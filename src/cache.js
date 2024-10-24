/**
 * Cache namespace.
 * This namespace provides caches that can be used to set and retrieve objects that will be persisted between reloads of scripts.
 * @namespace cache
 */

const { privateCache, sharedCache } = require('@runtime/cache');

/**
 * The {@link JSCache} can be used by to share information between subsequent runs of the same script or between scripts (depending on implementation).
 */
class JSCache {
  #valueCache;

  /**
   * @param {*} valueCacheImpl an implementation of the Java {@link https://github.com/openhab/openhab-core/blob/main/bundles/org.openhab.core.automation.module.script.rulesupport/src/main/java/org/openhab/core/automation/module/script/rulesupport/shared/ValueCache.java ValueCache} interface
   * @hideconstructor
   */
  constructor (valueCacheImpl) {
    this.#valueCache = valueCacheImpl;
  }

  #isSharedCache () {
    return this.#valueCache === sharedCache;
  }

  /**
   * Returns the value to which the specified key is mapped.
   *
   * @param {string} key the key whose associated value is to be returned
   * @param {function} [defaultSupplier] if the specified key is not already associated with a value, this function will return a default value
   * @returns {*|null} the current object for the supplied key, a default value if defaultSupplier is provided, or null
   */
  get (key, defaultSupplier) {
    if (typeof defaultSupplier === 'function') {
      return this.#valueCache.get(key, defaultSupplier);
    } else {
      return this.#valueCache.get(key);
    }
  }

  /**
   * Associates the specified value with the specified key.
   *
   * @param {string} key key with which the specified value is to be associated
   * @param {*} value value to be associated with the specified key
   * @returns {*|null} the previous value associated with the key, or null if there was no mapping for key
   */
  put (key, value) {
    if (typeof value === 'object' && this.#isSharedCache()) {
      console.warn(`Do not use the shared cache to store the object with key '${key}', as it is not thread-safe and can cause script execution failures. Only store primitives in the shared cache!`);
    }
    return this.#valueCache.put(key, value);
  }

  /**
   * Removes the mapping for a key from this map if it is present.
   *
   * @param {string} key key whose mapping is to be removed from the cache
   * @returns {*|null} the previous value associated with the key or null if there was no mapping for key
   */
  remove (key) {
    return this.#valueCache.remove(key);
  }

  /**
   * Checks the mapping for a key from this map.
   *
   * @param {string} key key whose mapping is to be checked in the map
   * @returns {boolean} whether the key has a mapping
   */
  exists (key) {
    return this.#valueCache.get(key) !== null;
  }
}

module.exports = {
  /**
   * Shared cache that is shared across all rules and scripts, it can therefore be accessed from any automation language.
   * The access to every key is tracked and the key is removed when all scripts that ever accessed that key are unloaded.
   * If the key that has been auto-removed stored a timer, that timer is cancelled.
   *
   * Do not use the shared cache to store objects, as it is not thread-safe and can cause script execution failures.
   *
   * @memberof cache
   * @type JSCache
   */
  shared: new JSCache(sharedCache),
  /**
   * Private cache for each script.
   * The private cache can only be accessed by the same script and is cleared when the script is unloaded.
   * You can use it to e.g. store timers or counters between subsequent runs of that script.
   * When the script is unloaded and the cache is cleared, all timers in the cache are cancelled.
   *
   * @memberof cache
   * @type JSCache
   */
  private: new JSCache(privateCache),
  JSCache // export class for unit tests
};
