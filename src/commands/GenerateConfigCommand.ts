import { CommandModule, Argv } from 'yargs';
import { promises } from 'fs';
import createAutoWiredConfig from '../util/createAutoWiredConfig';

export class GenerateConfigCommand implements CommandModule {
  public readonly command = 'generate:config';
  public readonly describe = 'Targets autowire folder and generates JSON config from it';

  public builder(args: Argv): Argv<{ host: string, port: string, folder: string, output: string }> {
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
      .option('output', {
        default: './grpc-server-mock.json',
        describe: 'Desired path to output file.',
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
    await promises.writeFile(args.output as string, JSON.stringify(config, null, 2), { encoding: 'utf-8' });
  }
}
