/**
 * The {@link JSCache} can be used by to share information between subsequent runs of the same script or between scripts (depending on implementation).
 */
export class JSCache {
    /**
     * @param {*} valueCacheImpl an implementation of the Java {@link https://github.com/openhab/openhab-core/blob/main/bundles/org.openhab.core.automation.module.script.rulesupport/src/main/java/org/openhab/core/automation/module/script/rulesupport/shared/ValueCache.java ValueCache} interface
     * @hideconstructor
     */
    constructor(valueCacheImpl: any);
    /**
     * Returns the value to which the specified key is mapped.
     *
     * @param {string} key the key whose associated value is to be returned
     * @param {function} [defaultSupplier] if the specified key is not already associated with a value, this function will return a default value
     * @returns {*|null} the current object for the supplied key, the value returned by defaultSupplier (if provided), or `null`
     */
    get(key: string, defaultSupplier?: Function): any | null;
    /**
     * Associates the specified value with the specified key.
     *
     * @param {string} key key with which the specified value is to be associated
     * @param {*} value value to be associated with the specified key
     * @returns {*|null} the previous value associated with the key, or null if there was no mapping for key
     */
    put(key: string, value: any): any | null;
    /**
     * Removes the mapping for a key from this map if it is present.
     *
     * @param {string} key key whose mapping is to be removed from the cache
     * @returns {*|null} the previous value associated with the key or null if there was no mapping for key
     */
    remove(key: string): any | null;
    /**
     * Checks the mapping for a key from this map.
     *
     * @param {string} key key whose mapping is to be checked in the map
     * @returns {boolean} whether the key has a mapping
     */
    exists(key: string): boolean;
    #private;
}
export declare const shared: JSCache;
declare const _private: JSCache;
export { _private as private };
//# sourceMappingURL=cache.d.ts.map