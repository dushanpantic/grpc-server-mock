import { join } from 'path';
import { promises, createReadStream } from 'fs';
import { createInterface } from 'readline';
import { IProto, IServerConfig, IService } from '../server/config';


const FILE_NAME_ROOT_INFO = 'root.json';

interface IRootInfo {
  root?: string,
  ignoreServiceFolders?: string[],
}

export default async function createAutoWiredConfig(
  host: string,
  port: string | number,
  responseDelay: number,
  mockFolderPath: string,
  orderedResponses: boolean
): Promise<IServerConfig> {
  const config: IServerConfig = {
    host,
    port,
    responseDelay,
    protos: [],
    orderedResponses
  };

  const protoFolderPaths = (await promises.readdir(mockFolderPath, { withFileTypes: true }))
    .filter((x) => x.isDirectory())
    .map((dir) => join(mockFolderPath, dir.name));

  for (const protoFolderPath of protoFolderPaths) {
    const folderContent = await promises.readdir(protoFolderPath, {
      withFileTypes: true,
    });
    const hasRootInfo = !!folderContent.find(x => x.name === FILE_NAME_ROOT_INFO);

    let rootContent: IRootInfo = {};
    if (hasRootInfo) {
      rootContent = JSON.parse(await promises.readFile(join(protoFolderPath, FILE_NAME_ROOT_INFO), { encoding: 'utf-8' }));
    }

    const protoFileName = rootContent.root
      ?? folderContent
        .filter((x) => x.name.endsWith('.proto'))
        .find(() => true).name;

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
    
    /* istanbul ignore next */
    rootContent.ignoreServiceFolders ??= [];

    const serviceFolderNames = folderContent
      .filter((x) => x.isDirectory())
      .map((dir) => dir.name)
      .filter((name) => !rootContent.ignoreServiceFolders.includes(name));

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
          responses: fileContentParsed,
        });
      }

      proto.services.push(service);
    }

    config.protos.push(proto);
  }

  return config;
}
