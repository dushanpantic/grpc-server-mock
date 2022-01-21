export interface IServerConfig {
  host: string;
  port: string | number;
  responseDelay: number;
  protos: IProto[];
  randomResponses: boolean;
  orderedResponses: boolean;
}

export interface IProto {
  protoFilePath: string;
  packageName: string;
  services: IService[];
}

export interface IService {
  name: string;
  responseHandlers: IResponseHandler[];
}

export interface IResponseHandler {
  methodName: string;
  requests: any[] | (() => Promise<any>);
}
