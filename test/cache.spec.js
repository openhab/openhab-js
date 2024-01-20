const mockExists = jest.fn();
const mockGet = jest.fn();
const mockPut = jest.fn();
const mockRemove = jest.fn();
console.warn = jest.fn();

describe('cache.js', () => {
  describe('JSCache', () => {
    jest.mock('@runtime', () => ({}), { virtual: true });

    jest.mock('@runtime/cache', () => ({}), { virtual: true });

    const { JSCache } = require('../src/cache');
    const cache = new JSCache({
      exists: (...args) => mockExists(...args),
      get: (...args) => mockGet(...args),
      put: (...args) => mockPut(...args),
      remove: (...args) => mockRemove(...args)
    });

    const key = 'key';
    const value = 'value';

    describe('exist', () => {
      it('returns true if key exists in cache instance.', () => {
        mockGet.mockImplementation(() => 'value');
        expect(cache.exists(key)).toBe(true);
        expect(console.warn).not.toHaveBeenCalled();
      });

      it('returns false, if key does not exist in cache instance.', () => {
        mockGet.mockImplementation(() => null);
        expect(cache.exists(key)).toBe(false);
        expect(console.warn).not.toHaveBeenCalled();
      });
    });

    describe('get', () => {
      it('delegates to cache instance.', () => {
        cache.get(key);
        expect(mockGet).toHaveBeenCalledWith(key);
        expect(console.warn).not.toHaveBeenCalled();
      });

      it('passes supplier, if present.', () => {
        const supplier = () => 'value';
        cache.get(key, supplier);
        expect(mockGet).toHaveBeenCalledWith(key, supplier);
        expect(console.warn).not.toHaveBeenCalled();
      });

      it('returns value from cache instance.', () => {
        const returnValue = 'value';
        mockGet.mockImplementation(() => returnValue);
        expect(cache.get(key)).toBe(returnValue);
        expect(console.warn).not.toHaveBeenCalled();
      });
    });

    describe('put', () => {
      it('delegates to cache instance.', () => {
        cache.put(key, value);
        expect(mockPut).toHaveBeenCalledWith(key, value);
        expect(console.warn).not.toHaveBeenCalled();
      });

      it('returns value from cache instance.', () => {
        const returnValue = 'value';
        mockPut.mockImplementation(() => returnValue);
        expect(cache.put(key, 'value')).toBe(returnValue);
        expect(console.warn).not.toHaveBeenCalled();
      });
    });

    describe('remove', () => {
      it('delegates to cache instance.', () => {
        cache.remove(key);
        expect(mockRemove).toHaveBeenCalledWith(key);
        expect(console.warn).not.toHaveBeenCalled();
      });

      it('returns value from cache instance.', () => {
        const returnValue = 'value';
        mockRemove.mockImplementation(() => returnValue);
        expect(cache.remove(key)).toBe(returnValue);
        expect(console.warn).not.toHaveBeenCalled();
      });
    });

    it('logs a warning if the deprecated option is set.', () => {
      cache._deprecated = true;
      cache.exists(key);
      cache.get(key);
      cache.put(key, value);
      cache.remove(key);
      expect(console.warn).toBeCalledTimes(4);
    });
  });
});
