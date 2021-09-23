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
    const port = 50051;

    const expectedConfig: IServerConfig = {
      host: '127.0.0.1',
      port: 50051,
      protos: [
        {
          packageName: 'foo.bar.baz',
          protoFilePath: join(autowireFixtureDir, 'packaged', 'foo.proto'),
          services: [
            {
              name: 'SomeSvc',
              responseHandlers: [
                {
                  methodName: 'Action',
                  responses: [{ text: 'action' }, { text: 'equals' }, { text: 'reaction' }],
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
                  responses: [{ text: 'first-1' }, { text: 'first-1' }],
                },
                {
                  methodName: 'Second',
                  responses: [{ text: 'second-1' }, { text: 'second-1' }],
                },
              ],
            },
          ],
        },
      ],
    };
    const config = await createAutoWiredConfig(host, port, autowireFixtureDir);

    expect(config).toEqual(expectedConfig);
  });
});
