const { exists, get, put, remove } = require('../cache');

const mockExists = jest.fn();
const mockGet = jest.fn();
const mockPut = jest.fn();
const mockRemove = jest.fn();

jest.mock('@runtime', () => ({
  sharedcache: {
    exists: (...args) => mockExists(...args),
    get: (...args) => mockGet(...args),
    put: (...args) => mockPut(...args),
    remove: (...args) => mockRemove(...args)
  }
}), { virtual: true });

describe('cache.js', () => {
  describe('exist', () => {
    it('returns true if key exists in cache instance.', () => {
      mockGet.mockImplementation(() => 'value');
      expect(exists('key')).toBe(true);
    });

    it('returns false, if key does not exist in cache instance.', () => {
      mockGet.mockImplementation(() => null);
      expect(exists('key')).toBe(false);
    });
  });

  describe('get', () => {
    it('delegates to cache instance.', () => {
      const key = 'key';
      get(key);
      expect(mockGet).toHaveBeenCalledWith(key);
    });

    it('passes supplier, if present.', () => {
      const key = 'key';
      const supplier = () => 'value';
      get(key, supplier);
      expect(mockGet).toHaveBeenCalledWith(key, supplier);
    });

    it('returns value from cache instance.', () => {
      const returnValue = 'value';
      mockGet.mockImplementation(() => returnValue);
      expect(get('key')).toBe(returnValue);
    });
  });

  describe('put', () => {
    it('delegates to cache instance.', () => {
      const key = 'key';
      const value = 'value';
      put(key, value);
      expect(mockPut).toHaveBeenCalledWith(key, value);
    });

    it('returns value from cache instance.', () => {
      const returnValue = 'value';
      mockPut.mockImplementation(() => returnValue);
      expect(put('key', 'value')).toBe(returnValue);
    });
  });

  describe('remove', () => {
    it('delegates to cache instance.', () => {
      const key = 'key';
      remove(key);
      expect(mockRemove).toHaveBeenCalledWith(key);
    });

    it('returns value from cache instance.', () => {
      const returnValue = 'value';
      mockRemove.mockImplementation(() => returnValue);
      expect(remove('key')).toBe(returnValue);
    });
  });
});
