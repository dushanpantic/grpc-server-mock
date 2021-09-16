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
import { ILogger } from '../log/logger.interface';


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
          acc[curr.methodName] = async (
            call: ServerUnaryCall<unknown, unknown>, // ServerUnaryCallImpl<RequestType, ResponseType>
            callback: (err?: any, value?: any, trailer?: Metadata, flags?: any) => void
          ) => {
            const receivedData = {
              request: call.request,
              metadataMap: call.metadata.getMap(),
              metadataOptions: call.metadata.getOptions(),
            };
            logger.info('Received call:', receivedData)
            let response: any;
            if (typeof curr.responses === 'function') {
              response = await curr.responses();
            } else {
              const responseIndex = getRandomInt(curr.responses.length);
              response = curr.responses[responseIndex];
            }
            const md = new Metadata();
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
