import createMockServer from './server/createMockServer';

import { ServerCredentials } from '@grpc/grpc-js'
import { IServerConfig } from './server/config';


const config: IServerConfig = {
  host: '0.0.0.0',
  port: '50051',
  protos: [
    {
      packageName: 'foo.bar.baz',
      protoFilePath: `${__dirname}/../proto/foo.proto`,

      services: [{
        name: 'SomeSvc',
        responseHandlers: [{
          methodName: 'actione',
          responses: [
            {
              text: 'dis works'
            },
            {
              text: 'ZAZAZA'
            },
          ]
        }]
      }]
    }
  ]
}

const server = createMockServer(config);

server.bindAsync('0.0.0.0:50051', ServerCredentials.createInsecure(), () => {
  server.start();
});
