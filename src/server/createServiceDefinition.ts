import { GrpcObject } from '@grpc/grpc-js';
import { ServiceClientConstructor } from '@grpc/grpc-js/build/src/make-client';
import { strict as assert } from 'assert';
import { get } from 'lodash';


export default function createServiceDefinition(descriptor: GrpcObject, packageName: string, serviceName: string): ServiceClientConstructor {
  const namespace = get(descriptor, packageName);
  assert.ok(namespace);
  const service: ServiceClientConstructor = namespace[serviceName];
  assert.ok(service);

  return service;
}
