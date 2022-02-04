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
    const matchedResponses = true;
    const orderedResponses = false;

    const expectedConfig: IServerConfig = {
      host: '127.0.0.1',
      port: '50051',
      responseDelay: 300,
      matchedResponses: true,
      orderedResponses: false,
      protos: [
        {
          packageName: 'snake.case.package',
          protoFilePath: join(autowireFixtureDir, 'custom-loader-options', 'snake.proto'),
          loaderOptions: {
            keepCase: false,
            defaults: false
          },
          services: [
            {
              name: 'SnakeSvc',
              responseHandlers: [
                {
                  methodName: 'Action',
                  requests: [{ someResponseText: 'snake' }, { someResponseText: 'case' }, { someResponseText: 'example' }],
                },
              ],
            },
          ],
        },
        {
          packageName: 'multi.example',
          protoFilePath: join(autowireFixtureDir, 'multiproto', 'main.proto'),
          loaderOptions: {},
          services: [
            {
              name: 'MultiSvc',
              responseHandlers: [
                {
                  methodName: 'Action',
                  requests: [{
                    text: 'multi-proto',
                    shard: {
                      content: 'example'
                    }
                  }]
                }
              ]
            },
          ]
        },
        {
          packageName: 'foo.bar.baz',
          protoFilePath: join(autowireFixtureDir, 'packaged', 'foo.proto'),
          loaderOptions: {},
          services: [
            {
              name: 'SomeSvc',
              responseHandlers: [
                {
                  methodName: 'Action',
                  requests: [{ text: 'action' }, { text: 'equals' }, { text: 'reaction' }],
                },
              ],
            },
          ],
        },
        {
          packageName: '',
          protoFilePath: join(autowireFixtureDir, 'packageless', 'bar.proto'),
          loaderOptions: {},
          services: [
            {
              name: 'SomeOtherSvc',
              responseHandlers: [
                {
                  methodName: 'First',
                  requests: [{ text: 'first-1' }, { text: 'first-1' }],
                },
                {
                  methodName: 'Second',
                  requests: [{ text: 'second-1' }, { text: 'second-1' }],
                },
              ],
            },
          ],
        },
      ],
    };
    const config = await createAutoWiredConfig(host, port, 300, autowireFixtureDir, matchedResponses, orderedResponses);

    expect(config).toEqual(expectedConfig);
  });
});
