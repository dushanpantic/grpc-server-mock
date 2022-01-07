export interface IServerConfig {
  host: string;
  port: string | number;
  responseDelay: number;
  protos: IProto[];
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
  responses: any[] | (() => Promise<any>);
}
