import { join } from 'path';
import { IServerConfig } from '../server/config';
import createAutoWiredConfig from './createAutoWiredConfig';

describe('util/createAutoWiredConfig', () => {
  it('creates expected config', async () => {
    const autowireFixtureDir = join(
      __dirname,
      '..',
      '..',
      'fixtures',
      'autowire'
    );
    const host = '127.0.0.1';
    const port = '50051';
    const randomResponses = true;

    const expectedConfig: IServerConfig = {
      host: '127.0.0.1',
      port: '50051',
      responseDelay: 300,
      randomResponses: true,
      protos: [
        {
          packageName: 'multi.example',
          protoFilePath: join(autowireFixtureDir, 'multiproto', 'main.proto'),
          services: [
            {
              name: 'MultiSvc',
              responseHandlers: [
                {
                  methodName: 'Action',
                  requests: [{
                    input:{},
                    output: {
                      text: 'multi-proto',
                    shard: {
                      content: 'example'
                    }}
                  }]
                }
              ]
            },
          ]
        },
        {
          packageName: 'foo.bar.baz',
          protoFilePath: join(autowireFixtureDir, 'packaged', 'foo.proto'),
          services: [
            {
              name: 'SomeSvc',
              responseHandlers: [
                {
                  methodName: 'Action',
                  requests: [{ input:{}, output: { text: 'action' }}, { input:{}, output: { text: 'equals' }}, { input:{}, output: { text: 'reaction' }}],
                },
              ],
            },
          ],
        },
        {
          packageName: '',
          protoFilePath: join(autowireFixtureDir, 'packageless', 'bar.proto'),
          services: [
            {
              name: 'SomeOtherSvc',
              responseHandlers: [
                {
                  methodName: 'First',
                  requests: [{ input:{}, output: {text: 'first-1' }}, { input:{}, output: {text: 'first-1' }}],
                },
                {
                  methodName: 'Second',
                  requests: [{ input:{}, output: {text: 'second-1' }}, { input:{}, output: {text: 'second-1' }}],
                },
              ],
            },
          ],
        },
      ],
    };
    const config = await createAutoWiredConfig(host, port, 300, autowireFixtureDir, randomResponses);

    expect(config).toEqual(expectedConfig);
  });
});
