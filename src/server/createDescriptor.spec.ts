import { Options } from '@grpc/proto-loader';
import { join } from 'path'
import createDescriptor from './createDescriptor';

describe('server/createDescriptor', () => {

  const loaderOptions: Options = {
    keepCase: true,
    enums: String,
    defaults: true,
    oneofs: true,
  };

  it('creates descriptor for proto file with defined package', () => {
    const protoWithNamespace = join(__dirname, '..', '..', 'fixtures', 'protos', 'foo.proto');

    const descriptor = createDescriptor(protoWithNamespace, loaderOptions);

    expect(descriptor).toBeDefined();
    expect(descriptor.foo).toBeDefined();
    expect((descriptor as any).foo.bar).toBeDefined();
    expect((descriptor as any).foo.bar.baz).toBeDefined();
    expect((descriptor as any).foo.bar.baz.Request).toBeDefined();
    expect((descriptor as any).foo.bar.baz.Response).toBeDefined();
    expect((descriptor as any).foo.bar.baz.SomeSvc).toBeDefined();
    expect((descriptor as any).foo.bar.baz.SomeSvc.service.Action).toBeDefined();
  });

  it('creates descriptor for proto file without defined package', () => {
    const protoWithoutNamespace = join(__dirname, '..', '..', 'fixtures', 'protos', 'bar.proto');

    const descriptor = createDescriptor(protoWithoutNamespace, loaderOptions);

    expect(descriptor).toBeDefined();
    expect(descriptor.Request).toBeDefined();
    expect(descriptor.Response).toBeDefined();
    expect(descriptor.SomeOtherSvc).toBeDefined();
    expect((descriptor as any).SomeOtherSvc.service.First).toBeDefined();
    expect((descriptor as any).SomeOtherSvc.service.Second).toBeDefined();

  });

});
