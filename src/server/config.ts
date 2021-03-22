
export interface IServerConfig {
  host: string;
  port: string | number;
  protos: IProto[];
}

interface IProto {
  protoFilePath: string;
  packageName: string;
  services: IService[];
}

interface IService {
  name: string;
  responseHandlers: IResponseHandler[]
}

interface IResponseHandler {
  methodName: string;
  responses: any[];
}
