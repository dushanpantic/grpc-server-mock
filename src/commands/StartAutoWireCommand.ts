import { ServerCredentials } from '@grpc/grpc-js';
import { CommandModule, Argv } from 'yargs';
import createMockServer from '../server/createMockServer';
import createAutoWiredConfig from '../util/createAutoWiredConfig';
import createLogger from '../log/createLogger';

export class StartAutoWireCommand implements CommandModule {
  public readonly command = 'start:autowire';
  public readonly describe = 'Autowires grpc server mock using the mock folder';

  public builder(args: Argv): Argv<{ host: string, port: string, folder: string, silent: boolean }> {
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
        default: '.',
        describe: 'Path to folder with files for autowireing.',
      })
      .option('silent', {
        default: false,
        boolean: true,
        describe: 'If true, noop logger will be used',
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

    const server = createMockServer(config, createLogger(!!args.silent));

    server.bindAsync(
      `${config.host}:${config.port}`,
      ServerCredentials.createInsecure(),
      () => {
        server.start();
      }
    );
  }
}
