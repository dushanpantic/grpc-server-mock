import { Options } from '@grpc/proto-loader';
import { join } from 'path'
import createDescriptor from './createDescriptor';
import extractServiceDefinition from './extractServiceDefinition';

describe('server/extractServiceDefinition', () => {

  const loaderOptions: Options = {
    keepCase: true,
    enums: String,
    defaults: true,
    oneofs: true,
  };

  it('extracts service from complex descriptor', () => {
    const protoWithNamespace = join(__dirname, '..', '..', 'fixtures', 'protos', 'foo.proto');
    const descriptor = createDescriptor(protoWithNamespace, loaderOptions);
    const service = extractServiceDefinition(descriptor, 'foo.bar.baz', 'SomeSvc');

    expect(service).toBeDefined();
    expect(service).toEqual((descriptor as any).foo.bar.baz.SomeSvc);
  });

  it('extracts service from simple descriptor', () => {
    const protoWithoutNamespace = join(__dirname, '..', '..', 'fixtures', 'protos', 'bar.proto');
    const descriptor = createDescriptor(protoWithoutNamespace, loaderOptions);
    const service = extractServiceDefinition(descriptor, undefined, 'SomeOtherSvc');

    expect(service).toBeDefined();
    expect(service).toEqual(descriptor.SomeOtherSvc);
  });

});
