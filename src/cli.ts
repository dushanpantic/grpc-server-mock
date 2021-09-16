import * as yargs from 'yargs';
import { GenerateConfigCommand } from './commands/GenerateConfigCommand';
import { StartAutoWireCommand } from './commands/StartAutoWireCommand';
import { StartFromConfigCommand } from './commands/StartFromConfigCommand';


yargs
  .usage('Usage: $0 <command> [options]')
  .command(new StartAutoWireCommand())
  .command(new StartFromConfigCommand())
  .command(new GenerateConfigCommand())
  .recommendCommands()
  .demandCommand(1)
  .strict()
  .alias('v', 'version')
  .help('h')
  .alias('h', 'help').argv;
  
