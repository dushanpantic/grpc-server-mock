import { join } from 'path'
import createDescriptor from './createDescriptor';
import extractServiceDefinition from './extractServiceDefinition';

describe('server/extractServiceDefinition', () => {

  it('extracts service from complex descriptor', () => {
    const protoWithNamespace = join(__dirname, '..', '..', 'fixtures', 'protos', 'foo.proto');
    const descriptor = createDescriptor(protoWithNamespace);
    const service = extractServiceDefinition(descriptor, 'foo.bar.baz', 'SomeSvc');

    expect(service).toBeDefined();
    expect(service).toEqual((descriptor as any).foo.bar.baz.SomeSvc);
  });

  it('extracts service from simple descriptor', () => {
    const protoWithoutNamespace = join(__dirname, '..', '..', 'fixtures', 'protos', 'bar.proto');
    const descriptor = createDescriptor(protoWithoutNamespace);
    const service = extractServiceDefinition(descriptor, undefined, 'SomeOtherSvc');

    expect(service).toBeDefined();
    expect(service).toEqual(descriptor.SomeOtherSvc);
  });

});
