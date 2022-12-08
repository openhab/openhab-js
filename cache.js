/**
 * Cache namespace.
 * This namespace provides caches that can be used to set and retrieve objects that will be persisted between reloads of scripts.
 * @namespace cache
 */

const log = require('./log')('cache');
const { privateCache, sharedCache } = require('@runtime/cache'); // The new cache from core
const addonSharedCache = require('@runtime').sharedcache; // The old cache from the adddon

const coreCacheAvail = Java.isJavaObject(privateCache) && Java.isJavaObject(sharedCache);

const logDeprecationWarning = (funcName) => {
  console.warn(`"cache.${funcName}" has been deprecated and will be removed in a future release. Use "cache.private.${funcName}" or "cache.shared.${funcName}" instead. Visit the JavaScript Scripting Automation addon docs for more information about the cache.`);
};

/**
 * The {@link JSCache} can be used by to share information between subsequent runs of the same script or between scripts (depending on implementation).
 */
class JSCache {
  /**
   * @param {*} valueCacheImpl an implementation of the Java {@link https://github.com/openhab/openhab-core/blob/main/bundles/org.openhab.core.automation.module.script.rulesupport/src/main/java/org/openhab/core/automation/module/script/rulesupport/shared/ValueCache.java ValueCache} interface
   * @param {boolean} [deprecated]
   * @hideconstructor
   */
  constructor (valueCacheImpl, deprecated = false) {
    this._valueCache = valueCacheImpl;
    this._deprecated = deprecated;
  }

  /**
   * Returns the value to which the specified key is mapped.
   *
   * @param {string} key the key whose associated value is to be returned
   * @param {function} [defaultSupplier] if the specified key is not already associated with a value, this function will return a default value
   * @returns {*|null} the current object for the supplied key, a default value if defaultSupplier is provided, or null
   */
  get (key, defaultSupplier) {
    if (this._deprecated === true) logDeprecationWarning('get');
    if (typeof defaultSupplier === 'function') {
      return this._valueCache.get(key, defaultSupplier);
    } else {
      return this._valueCache.get(key);
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
    if (this._deprecated === true) logDeprecationWarning('put');
    return this._valueCache.put(key, value);
  }

  /**
   * Removes the mapping for a key from this map if it is present.
   *
   * @param {string} key key whose mapping is to be removed from the cache
   * @returns {*|null} the previous value associated with the key or null if there was no mapping for key
   */
  remove (key) {
    if (this._deprecated === true) logDeprecationWarning('remove');
    return this._valueCache.remove(key);
  }

  /**
   * Checks the mapping for a key from this map.
   *
   * @param {string} key key whose mapping is to be checked in the map
   * @returns {boolean} whether the key has a mapping
   */
  exists (key) {
    if (this._deprecated === true) logDeprecationWarning('exists');
    return this._valueCache.get(key) !== null;
  }
}

let addonSharedJSCache;
if (coreCacheAvail === true) {
  log.debug('Caches from core are available, enable legacy cache methods to keep the old API.');
  addonSharedJSCache = new JSCache(sharedCache, true);
} else {
  log.debug('Caches from core are unavailable, using the addon-provided cache.');
  addonSharedJSCache = new JSCache(addonSharedCache);
}

module.exports = {
  /** @deprecated */
  get: (key, defaultSupplier) => { return addonSharedJSCache.get(key, defaultSupplier); },
  /** @deprecated */
  put: (key, value) => { return addonSharedJSCache.put(key, value); },
  /** @deprecated */
  remove: (key) => { return addonSharedJSCache.remove(key); },
  /** @deprecated */
  exists: (key) => { return addonSharedJSCache.exists(key); },
  /**
   * Shared cache that is shared across all rules and scripts, it can therefore be accessed from any automation language.
   * The access to every key is tracked and the key is removed when all scripts that ever accessed that key are unloaded.
   *
   * @memberof cache
   * @type JSCache
   */
  shared: (coreCacheAvail === true) ? new JSCache(sharedCache) : undefined,
  /**
   * Private cache for each script.
   * The private cache can only be accessed by the same script and is cleared when the script is unloaded.
   * You can use it to e.g. store timers or counters between subsequent runs of that script.
   *
   * @memberof cache
   * @type JSCache
   */
  private: (coreCacheAvail === true) ? new JSCache(privateCache) : undefined,
  JSCache
};
