import {
  Metadata,
  Server,
  ServerUnaryCall,
  UntypedServiceImplementation,
} from '@grpc/grpc-js';
import { IResponseHandler, IServerConfig } from './config';
import createDescriptor from './createDescriptor';
import extractServiceDefinition from './extractServiceDefinition';
import getRandomInt from '../util/getRandomInt';
import delay from '../util/delay';
import { ILogger } from '../log/logger.interface';
import isEqual from '../util/isEqual';

export default function createMockServer(config: IServerConfig, logger: ILogger) {
  const server = new Server();

  for (const protoDetails of config.protos) {
    const descriptor = createDescriptor(protoDetails.protoFilePath);

    for (const service of protoDetails.services) {
      const serviceDefinition = extractServiceDefinition(
        descriptor,
        protoDetails.packageName,
        service.name
      );

      const responseHandlers = service.responseHandlers.reduce(
        (acc: UntypedServiceImplementation, curr: IResponseHandler) => {
          let nextIndex = 0;
          acc[curr.methodName] = async (
            call: ServerUnaryCall<unknown, unknown>, // ServerUnaryCallImpl<RequestType, ResponseType>
            callback: (err?: any, value?: any, trailer?: Metadata, flags?: any) => void
          ) => {
            const receivedData = {
              request: call.request,
              metadataMap: call.metadata.getMap(),
              metadataOptions: call.metadata.getOptions(),
            };
            let response: any;
            if (typeof curr.requests === 'function') {
              response = await curr.requests();
            } else {
              logger.info(`[${new Date().toISOString()}][${service.name}::${curr.methodName}] Received call:\n`, receivedData)
              if (config.matchedResponses) {
                const responseIndex = getRandomInt(curr.requests.length);
                response = curr.requests[responseIndex];
              } else {
                if (config.orderedResponses) {
                  const responseIndex = nextIndex++;
                  nextIndex %= curr.requests.length;
                  response = curr.requests[responseIndex];
                } else {
                  const requestAnswer = curr.requests.find(r => isEqual(r.input, call.request));
                  if(requestAnswer) {
                    response = requestAnswer.output;
                  }
                }
              }
            }
            const md = new Metadata();
            await delay(config.responseDelay);
            callback(null, response, md);
          };
          return acc;
        },
        {} as UntypedServiceImplementation
      );

      server.addService(serviceDefinition.service, responseHandlers);
    }
  }
  return server;
}
