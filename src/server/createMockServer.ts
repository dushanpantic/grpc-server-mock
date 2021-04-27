import {
  Server,
  ServerUnaryCall,
  UntypedServiceImplementation,
} from '@grpc/grpc-js';
import { IServerConfig } from './config';
import createDescriptor from './createDescriptor';
import extractServiceDefinition from './extractServiceDefinition';
import getRandomInt from '../util/getRandomInt';


export default function createMockServer(config: IServerConfig) {
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
        (acc: UntypedServiceImplementation, curr) => {
          acc[curr.methodName] = async (
            call: ServerUnaryCall<unknown, unknown>, // proveri tip
            callback: (err?: any, value?: any, trailer?: any, flags?: any) => void
          ) => {
            let response: any;
            if (typeof curr.responses === 'function') {
              response = await curr.responses();
            } else {
              const responseIndex = getRandomInt(curr.responses.length);
              response = curr.responses[responseIndex];
            }
            callback(null, response);
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
