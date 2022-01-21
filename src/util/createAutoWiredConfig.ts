import { join } from 'path';
import { promises, createReadStream } from 'fs';
import { createInterface } from 'readline';
import { IProto, IServerConfig, IService } from '../server/config';

const ROOT_INFO = 'root.json';

export default async function createAutoWiredConfig(
  host: string,
  port: string | number,
  responseDelay: number,
  mockFolderPath: string,
  matchedResponses: boolean,
  orderedResponses: boolean
): Promise<IServerConfig> {
  const config: IServerConfig = {
    host,
    port,
    responseDelay,
    protos: [],
    matchedResponses,
    orderedResponses,
  };

  const protoFolderPaths = (await promises.readdir(mockFolderPath, { withFileTypes: true }))
    .filter((x) => x.isDirectory())
    .map((dir) => join(mockFolderPath, dir.name));

  for (const protoFolderPath of protoFolderPaths) {
    const folderContent = await promises.readdir(protoFolderPath, {
      withFileTypes: true,
    });
    const hasRootInfo = !!folderContent.find(x => x.name === ROOT_INFO);

    let protoFileName: string;
    if (hasRootInfo) {
      const rootContent: { root: string } = JSON.parse(await promises.readFile(join(protoFolderPath, ROOT_INFO), { encoding: 'utf-8' }));
      protoFileName = rootContent.root;
    } else {
      protoFileName = folderContent
        .filter((x) => x.name.endsWith('.proto'))
        .find(() => true).name;
    }
    const protoFilePath = join(protoFolderPath, protoFileName);

    const readInterface = createInterface({
      input: createReadStream(protoFilePath, { encoding: 'utf-8' }),
    });

    let packageName = '';
    for await (const line of readInterface) {
      const trimmedLine = line.trim();
      if (!trimmedLine.startsWith('package')) continue;

      packageName = trimmedLine
        .substring('package'.length, trimmedLine.length - 1)
        .trim();
      break;
    }
    readInterface.close();

    const proto: IProto = {
      protoFilePath: protoFilePath,
      packageName,
      services: [],
    };
    const serviceFolderNames = folderContent
      .filter((x) => x.isDirectory())
      .map((dir) => dir.name);

    for (const serviceFolderName of serviceFolderNames) {
      const serviceFolderPath = join(protoFolderPath, serviceFolderName);

      const methodFiles = await promises.readdir(serviceFolderPath);
      const methodFilesNames = methodFiles.filter((fileName) =>
        fileName.endsWith('.json')
      );

      const service: IService = {
        name: serviceFolderName,
        responseHandlers: [],
      };

      for (const methodFileName of methodFilesNames) {
        const methodFilePath = join(serviceFolderPath, methodFileName);
        const fileContent = await promises.readFile(methodFilePath, {
          encoding: 'utf-8',
        });
        const fileContentParsed = JSON.parse(fileContent);

        service.responseHandlers.push({
          methodName: methodFileName.substring(
            0,
            methodFileName.length - '.json'.length
          ),
          requests: fileContentParsed,
        });
      }

      proto.services.push(service);
    }

    config.protos.push(proto);
  }

  return config;
}
