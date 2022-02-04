import { Options } from '@grpc/proto-loader';

export default function createLoaderOptions(requestedOptions: any): Options {
  return {
    keepCase: true,
    enums: String,
    defaults: true,
    oneofs: true,
    ...requestedOptions,
  };
}
