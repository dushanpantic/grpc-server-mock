import { CommandModule, Argv } from 'yargs';
import { promises } from 'fs';
import createAutoWiredConfig from '../util/createAutoWiredConfig';

export class GenerateConfigCommand implements CommandModule {
  public readonly command = 'generate:config';
  public readonly describe = 'Targets autowire folder and generates JSON config from it';

  public builder(args: Argv): Argv<{
    host: string,
    port: string,
    folder: string,
    output: string,
    delay: string,
    ordered: boolean,
    matched: boolean,
  }> {
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
      .option('matched', {
        default: false,
        boolean: true,
        describe: 'If set, received inputs will be matched to provided outputs.'
      });
  }

  public async handler(args: {
    host: string,
    port: string,
    folder: string,
    output: string,
    delay: string,
    ordered: boolean,
    matched: boolean,
    _: (string | number)[];
    $0: string;
  }): Promise<void> {
    const config = await createAutoWiredConfig(
      args.host as string,
      args.port as string,
      parseInt(args.delay),
      args.folder as string,
      args.matched,
      args.ordered,
    );
    await promises.writeFile(args.output as string, JSON.stringify(config, null, 2), { encoding: 'utf-8' });
  }
}
