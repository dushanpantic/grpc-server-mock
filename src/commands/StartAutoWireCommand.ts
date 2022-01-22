import { ServerCredentials } from '@grpc/grpc-js';
import { CommandModule, Argv } from 'yargs';
import createMockServer from '../server/createMockServer';
import createAutoWiredConfig from '../util/createAutoWiredConfig';
import createLogger from '../log/createLogger';

export class StartAutoWireCommand implements CommandModule {
  public readonly command = 'start:autowire';
  public readonly describe = 'Autowires grpc server mock using the mock folder';

  public builder(args: Argv): Argv<{ host: string, port: string, folder: string, delay: string, silent: boolean, ordered: boolean }> {
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
        describe: 'If set, noop logger will be used',
      })
      .option('delay', {
        default: '0',
        describe: 'Delay in milliseconds before returning response.',
      })
      .option('ordered', {
        default: false,
        boolean: true,
        describe: 'If set, responses will be ordered, otherwise they are random.'
      })
     .option('matchRequest', {
        default: false,
        boolean: true,
        describe: 'If set, responses will be ordered, otherwise they are random.'
      });
  }

  public async handler(args: {
    host: string,
    port: string,
    folder: string,
    delay: string,
    silent: boolean,
    ordered: boolean,
    matchRequest: boolean,
    _: (string | number)[];
    $0: string;
  }): Promise<void> {
    const config = await createAutoWiredConfig(
      args.host as string,
      args.port as string,
      parseInt(args.delay),
      args.folder as string,
      args.matchRequest,
      args.ordered,
    );

    const logger = createLogger(!!args.silent);
    const server = createMockServer(config, logger);

    server.bindAsync(
      `${config.host}:${config.port}`,
      ServerCredentials.createInsecure(),
      () => {
        server.start();
        logger.info(`Server started at ${config.host}:${config.port}`);
      }
    );
  }
}
