import { Server, ServerUnaryCall, UntypedServiceImplementation } from '@grpc/grpc-js';
import { IServerConfig } from './config';
import createDescriptor from './createDescriptor';
import createServiceDefinition from './createServiceDefinition';
import getRandomInt from '../util/getRandomInt';

export default function createMockServer(config: IServerConfig) {
  const server = new Server();

  for (const protoDetails of config.protos) {
    const descriptor = createDescriptor(protoDetails.protoFilePath);

    for (const service of protoDetails.services) {
      const serviceDefinition = createServiceDefinition(descriptor, protoDetails.packageName, service.name);

      const responseHandlers = service.responseHandlers.reduce((acc: UntypedServiceImplementation, curr) => {
        acc[curr.methodName] = (
          call: ServerUnaryCall<unknown, unknown>, // proveri tip
          callback: (err?: any, value?: any, trailer?: any, flags?: any) => void,
        ) => {
          const responseIndex = getRandomInt(curr.responses.length);
          callback(null, curr.responses[responseIndex]);
        };
        return acc;
      }, {} as UntypedServiceImplementation);

      server.addService(serviceDefinition.service, responseHandlers);
    }
  }
  return server;
}
