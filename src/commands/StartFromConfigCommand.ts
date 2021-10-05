import { ServerCredentials } from '@grpc/grpc-js';
import { CommandModule, Argv } from 'yargs';
import { promises } from 'fs';
import createMockServer from '../server/createMockServer';
import createLogger from '../log/createLogger';

export class StartFromConfigCommand implements CommandModule {
  public readonly command = 'start:config';
  public readonly describe = 'Creates gRPC server mock using given config';

  public builder(args: Argv): Argv<{ folder: string, silent: boolean }> {
    return args
      .option('folder', {
        default: './grpc-server-mock.json',
        describe: 'Path to file with config.',
      })
      .option('silent', {
        default: false,
        boolean: true,
        describe: 'If set, noop logger will be used',
      });
  }

  public async handler(args: {
    folder: string,
    silent: boolean,
    _: (string | number)[];
    $0: string;
  }): Promise<void> {
    const configPath = args.folder as string;
    const config = JSON.parse(
      await promises.readFile(configPath, { encoding: 'utf-8' })
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
