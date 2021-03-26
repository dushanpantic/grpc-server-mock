import * as yargs from "yargs";
import { AutoWireCommand } from "./commands/AutoWireCommand";
import { FromConfigCommand } from "./commands/FromConfigCommand";

yargs
  .usage("Usage: $0 <command> [options]")
  .command(new AutoWireCommand())
  .command(new FromConfigCommand())
  .recommendCommands()
  .demandCommand(1)
  .strict()
  .alias("v", "version")
  .help("h")
  .alias("h", "help").argv;
