const { MetadataRegistry, MetadataKey, Metadata } = require('../openhab.mock');
const { HashMap, Stream } = require('../java.mock');

const mockMetadataRegistry = new MetadataRegistry();

jest.mock('../../src/osgi', () => ({
  getService: (serviceName) => {
    if (serviceName === 'org.openhab.core.items.MetadataRegistry') {
      return mockMetadataRegistry;
    }
    return {};
  }
}));

const { Item } = require('../../src/items/items');
const metadata = require('../../src/items/metadata');
const environment = require('../../src/environment');

describe('items/metadata.js', () => {
  const mockItemName = 'TestItem';
  const mockRawItem = {
    getName: () => mockItemName,
    getType: () => 'Switch'
  };
  const mockItem = new Item(mockRawItem);

  const createRawMetadata = (namespace = 'test_namespace', itemName = mockItemName, value = 'testvalue', config = {}) => {
    const key = new MetadataKey(namespace, itemName);
    return new Metadata(key, value, config);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();

    mockMetadataRegistry.get.mockReturnValue(null);
    mockMetadataRegistry.add.mockImplementation((meta) => meta);
    mockMetadataRegistry.addPermanent.mockImplementation((meta) => meta);
    mockMetadataRegistry.update.mockReturnValue(null);
    mockMetadataRegistry.remove.mockImplementation((meta) => meta);
    mockMetadataRegistry.removeItemMetadata.mockReturnValue(true);
  });

  describe('ItemMetadata class', () => {
    it('wraps raw metadata and exposes key, value, and configuration', () => {
      const raw = createRawMetadata('stateDescription', mockItemName, 'ON', { pattern: '%s' });
      const itemMeta = new metadata.ItemMetadata(raw);

      expect(itemMeta.key).toBe('stateDescription:TestItem');
      expect(itemMeta.value).toBe('ON');
      expect(itemMeta.configuration).toEqual({ pattern: '%s' });
    });

    it('formats toString correctly', () => {
      const raw = createRawMetadata('expire', mockItemName, '5m,state=OFF', { configKey: 'configVal' });
      const itemMeta = new metadata.ItemMetadata(raw);

      expect(itemMeta.toString()).toBe('Metadata [key=expire:TestItem, value=5m,state=OFF, configuration={"configKey":"configVal"}]');
    });

    it('returns a HashMap instance from rawMetadata.getConfiguration() in mock', () => {
      const raw = createRawMetadata('test', mockItemName, 'val', { a: 'b' });
      expect(raw.getConfiguration()).toBeInstanceOf(HashMap);
      expect(raw.getConfiguration()).toBeInstanceOf(Map);
    });
  });

  describe('getMetadata', () => {
    it.each([['Item name', mockItemName], ['Item', mockItem]])('returns single metadata for %s when namespace is specified', (_, itemOrName) => {
      mockMetadataRegistry.get.mockReturnValue(createRawMetadata('test_namespace', mockItemName, 'testvalue', { key: 'val' }));

      const result = metadata.getMetadata(itemOrName, 'test_namespace');

      expect(mockMetadataRegistry.get).toHaveBeenCalledWith(
        expect.objectContaining({
          namespace: 'test_namespace',
          itemName: mockItemName
        })
      );
      expect(result).toBeInstanceOf(metadata.ItemMetadata);
      expect(result.key).toBe('test_namespace:TestItem');
      expect(result.value).toBe('testvalue');
      expect(result.configuration).toEqual({ key: 'val' });
    });

    it.each([['Item name', mockItemName], ['Item', mockItem]])('returns null for %s when metadata does not exist', (_, itemOrName) => {
      mockMetadataRegistry.get.mockReturnValue(null);

      const result = metadata.getMetadata(itemOrName, 'NON_EXISTENT');

      expect(result).toBeNull();
    });

    it.each([['Item name', mockItemName], ['Item', mockItem]])('returns all metadata for %s when namespace is undefined', (_, itemOrName) => {
      const meta1 = createRawMetadata('ns1', mockItemName, 'val1');
      const meta2 = createRawMetadata('ns2', mockItemName, 'val2');
      const metaOtherItem = createRawMetadata('ns1', 'OtherItem', 'val3');

      mockMetadataRegistry.stream.mockReturnValue(new Stream([meta1, meta2, metaOtherItem]));

      const result = metadata.getMetadata(itemOrName);

      expect(result).toEqual({
        ns1: expect.objectContaining({ value: 'val1' }),
        ns2: expect.objectContaining({ value: 'val2' })
      });
      expect(result.ns1).toBeInstanceOf(metadata.ItemMetadata);
      expect(result.ns2).toBeInstanceOf(metadata.ItemMetadata);
    });

    it.each([['Item name', mockItemName], ['Item', mockItem]])('returns empty object for %s when item has no metadata', (_, itemOrName) => {
      mockMetadataRegistry.stream.mockReturnValue(new Stream([]));

      const result = metadata.getMetadata(itemOrName);

      expect(result).toEqual({});
    });
  });

  describe('addMetadata', () => {
    it.each([['Item name', mockItemName], ['Item', mockItem]])('adds metadata for %s and passes config payload', (_, itemOrName) => {
      const config = { configKey: 'configVal' };

      const result = metadata.addMetadata(itemOrName, 'TEST', 'testvalue', config);

      expect(mockMetadataRegistry.add).toHaveBeenCalledTimes(1);
      expect(mockMetadataRegistry.add).toHaveBeenCalledWith(
        expect.objectContaining({
          value: 'testvalue'
        })
      );
      expect(result.value).toBe('testvalue');
      expect(result.configuration).toEqual(config);
    });

    it('defaults configuration to an empty object if omitted', () => {
      const result = metadata.addMetadata(mockItemName, 'TEST', 'testvalue');

      expect(mockMetadataRegistry.add).toHaveBeenCalledTimes(1);
      expect(result.configuration).toEqual({});
    });

    it('calls addPermanent when persist is true and useProviderRegistries is true', () => {
      jest.spyOn(environment, 'useProviderRegistries').mockReturnValue(true);

      const result = metadata.addMetadata(mockItemName, 'TEST', 'testvalue', {}, true);

      expect(mockMetadataRegistry.addPermanent).toHaveBeenCalledTimes(1);
      expect(mockMetadataRegistry.add).not.toHaveBeenCalled();
      expect(result.value).toBe('testvalue');
    });

    it('calls add when persist is true but useProviderRegistries is false', () => {
      jest.spyOn(environment, 'useProviderRegistries').mockReturnValue(false);

      const result = metadata.addMetadata(mockItemName, 'TEST', 'testvalue', {}, true);

      expect(mockMetadataRegistry.add).toHaveBeenCalledTimes(1);
      expect(mockMetadataRegistry.addPermanent).not.toHaveBeenCalled();
      expect(result.value).toBe('testvalue');
    });

    it('warns and ignores non-primitive configuration values', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const config = { validKey: 'val', invalidKey: { nested: 'obj' } };

      const result = metadata.addMetadata(mockItemName, 'TEST', 'testvalue', config);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Metadata configuration values must be primitive types, not objects. Ignoring configuration for key 'invalidKey'")
      );
      expect(result.configuration).toEqual({ validKey: 'val' });
    });

    it('throws custom error when metadata already exists (IllegalStateException)', () => {
      const IllegalStateException = Java.type('java.lang.IllegalStateException');
      mockMetadataRegistry.add.mockImplementationOnce(() => {
        throw new IllegalStateException('Already exists');
      });

      expect(() => {
        metadata.addMetadata(mockItemName, 'TEST', 'testvalue');
      }).toThrow(`Cannot add metadata 'TEST' for Item '${mockItemName}': metadata already exists`);
    });

    it('re-throws other errors occurring during metadata add', () => {
      mockMetadataRegistry.add.mockImplementationOnce(() => {
        throw new Error('Some other error');
      });

      expect(() => {
        metadata.addMetadata(mockItemName, 'TEST', 'testvalue');
      }).toThrow('Some other error');
    });
  });

  describe('replaceMetadata', () => {
    it.each([['Item name', mockItemName], ['Item', mockItem]])('adds metadata for %s when previous metadata does not exist', (_, itemOrName) => {
      mockMetadataRegistry.get.mockReturnValue(null);

      const result = metadata.replaceMetadata(itemOrName, 'TEST', 'newvalue');

      expect(mockMetadataRegistry.add).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });

    it.each([['Item name', mockItemName], ['Item', mockItem]])('updates metadata for %s when previous metadata exists', (_, itemOrName) => {
      const oldMetadata = createRawMetadata('TEST', mockItemName, 'oldvalue', { key: 'oldval' });
      mockMetadataRegistry.get.mockReturnValue(oldMetadata);
      mockMetadataRegistry.update.mockReturnValue(oldMetadata);

      const result = metadata.replaceMetadata(itemOrName, 'TEST', 'newvalue');

      expect(mockMetadataRegistry.update).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(metadata.ItemMetadata);
      expect(result.value).toBe('oldvalue');
      expect(result.configuration).toEqual({ key: 'oldval' });
    });
  });

  describe('removeMetadata', () => {
    it.each([['Item name', mockItemName], ['Item', mockItem]])('removes single metadata namespace for %s', (_, itemOrName) => {
      mockMetadataRegistry.remove.mockReturnValue(createRawMetadata());

      const result = metadata.removeMetadata(itemOrName, 'TEST');

      expect(mockMetadataRegistry.remove).toHaveBeenCalledWith(
        expect.objectContaining({
          namespace: 'TEST',
          itemName: mockItemName
        })
      );
      expect(result).not.toBeNull();
      expect(result.value).toBe('testvalue');
    });

    it.each([['Item name', mockItemName], ['Item', mockItem]])('returns null for %s when removing a non-existent metadata entry', (_, itemOrName) => {
      mockMetadataRegistry.remove.mockReturnValue(null);

      const result = metadata.removeMetadata(itemOrName, 'NON_EXISTENT');

      expect(result).toBeNull();
    });

    it.each([['Item name', mockItemName], ['Item', mockItem]])('removes all metadata for %s when namespace is undefined', (_, itemOrName) => {
      metadata.removeMetadata(itemOrName);

      expect(mockMetadataRegistry.removeItemMetadata).toHaveBeenCalledWith(mockItemName);
    });
  });

  describe('Item instance metadata methods', () => {
    it('delegates getMetadata to metadata.getMetadata', () => {
      mockMetadataRegistry.get.mockReturnValue(createRawMetadata('expire', mockItemName, '5m'));

      const result = mockItem.getMetadata('expire');

      expect(mockMetadataRegistry.get).toHaveBeenCalledWith(
        expect.objectContaining({
          namespace: 'expire',
          itemName: mockItemName
        })
      );
      expect(result.value).toBe('5m');
    });

    it('delegates replaceMetadata to metadata.replaceMetadata', () => {
      const oldMetadata = createRawMetadata('expire', mockItemName, '5m', { state: 'OFF' });
      mockMetadataRegistry.get.mockReturnValue(oldMetadata);
      mockMetadataRegistry.update.mockReturnValue(oldMetadata);

      const result = mockItem.replaceMetadata('expire', '10m', { state: 'ON' });

      expect(mockMetadataRegistry.update).toHaveBeenCalledTimes(1);
      expect(result.value).toBe('5m');
      expect(result.configuration).toEqual({ state: 'OFF' });
    });

    it('delegates removeMetadata to metadata.removeMetadata', () => {
      mockMetadataRegistry.remove.mockReturnValue(createRawMetadata('expire', mockItemName, '5m'));

      const result = mockItem.removeMetadata('expire');

      expect(mockMetadataRegistry.remove).toHaveBeenCalledWith(
        expect.objectContaining({
          namespace: 'expire',
          itemName: mockItemName
        })
      );
      expect(result.value).toBe('5m');
    });
  });
});
