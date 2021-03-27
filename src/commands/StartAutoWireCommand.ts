import { ServerCredentials } from '@grpc/grpc-js';
import { CommandModule, Argv } from 'yargs';
import { join } from 'path';
import createMockServer from '../server/createMockServer';
import createAutoWiredConfig from '../util/createAutoWiredConfig';

export class StartAutoWireCommand implements CommandModule {
  public readonly command = 'start:autowire';
  public readonly describe = 'Autowires grpc server mock using the mock folder';

  public builder(args: Argv): Argv<{ host: string } & { port: string } & { folder: string }> {
    return args
      .option('host', {
        default: '127.0.0.1',
        describe: 'Server host.',
      })
      .option('port', {
        default: '50051',
        describe: 'Server port.',
      })
      .option('folder', {
        default: join(__dirname, 'grpc-server-mock'),
        describe: 'Path to folder with files for autowireing.',
      });
  }

  public async handler(args: {
    [argName: string]: unknown;
    _: (string | number)[];
    $0: string;
  }): Promise<void> {
    const config = await createAutoWiredConfig(
      args.host as string,
      args.port as string,
      args.folder as string
    );

    const server = createMockServer(config);

    server.bindAsync(
      `${config.host}:${config.port}`,
      ServerCredentials.createInsecure(),
      () => {
        server.start();
      }
    );
  }
}
