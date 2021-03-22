import { strict as assert } from 'assert';
import { GrpcObject, loadPackageDefinition } from '@grpc/grpc-js';
import { loadSync, Options } from '@grpc/proto-loader';

export default function createDescriptor(protoFile: string): GrpcObject {
  const loaderOptions: Options = {
    keepCase: true,
    enums: String,
    defaults: true,
    oneofs: true,
  };

  const packageDefinition = loadSync(protoFile, loaderOptions);
  const descriptor = loadPackageDefinition(packageDefinition);
  assert.ok(descriptor);

  return descriptor;  
}
