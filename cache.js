/**
 * Cache namespace.
 * This namespace provides caches that can be used to set and retrieve objects that will be persisted between reloads of scripts.
 * @namespace cache
 */

const { privateCache, sharedCache } = require('@runtime/cache'); // The new cache from core
const addonSharedCache = require('@runtime').sharedcache; // The old cache from the adddon

const coreCacheAvail = Java.isJavaObject(privateCache) && Java.isJavaObject(sharedCache);

const logDeprecationWarning = (funcName) => {
  console.warn(`"cache.${funcName}" has been deprecated and will be removed in a future release. Use "cache.private.${funcName}" or "cache.shared.${funcName}" instead.\nVisit the JavaScript Scripting Automation docs for more infomation about the cache.`);
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
   * @example <caption>Get a previously set value with a default value (times = 0)</caption>
   * let counter = cache.get('counter', () => ({ 'times': 0 }));
   * console.log('Count', counter.times++);
   *
   * @example <caption>Get a previously set object</caption>
   * let counter = cache.get('counter');
   * if (counter === null) {
   *      counter = { times: 0 };
   *      cache.put('counter', counter);
   * }
   * console.log('Count', counter.times++);
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
  addonSharedJSCache = new JSCache(sharedCache, true);
} else {
  addonSharedJSCache = new JSCache(addonSharedCache, true);
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
   * Private cache for each individual script.
   * It is not cleared between subsequent runs of a rule, but it is removed when the script is unloaded.
   *
   * @memberof cache
   * @type JSCache
   */
  shared: (coreCacheAvail === true) ? new JSCache(sharedCache) : undefined,
  /**
   * Shared cache between all scrips.
   * Every access to a key is tracked, the key is removed if all scripts that ever accessed that key have been unloaded.
   *
   * @memberof cache
   * @type JSCache
   */
  private: (coreCacheAvail === true) ? new JSCache(privateCache) : undefined
};
