import { ServerCredentials } from "@grpc/grpc-js";
import { CommandModule, Argv } from "yargs";
import { join } from "path";
import { promises } from "fs";
import createMockServer from "../server/createMockServer";

export class FromConfigCommand implements CommandModule {
  public readonly command = "from-config";
  public readonly describe = "Creates gRPC server mock using given config";

  public builder(args: Argv) {
    return args.option("folder", {
      default: join(__dirname, "grpc-server-mock.json"),
      describe: "Path to file with config.",
    });
  }

  public async handler(args: {
    [argName: string]: unknown;
    _: (string | number)[];
    $0: string;
  }): Promise<void> {
    const configPath = args.folder as string;
    const config = JSON.parse(
      await promises.readFile(configPath, { encoding: "utf-8" })
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
