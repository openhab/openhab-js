/**
 * Returns the value to which the specified key is mapped
 *
 * @example <caption>Get a previously set value with a default value (times = 0)</caption>
 * let counter = cache.get("counter", () => ({ "times": 0 }));
 * console.log("Count",counter.times++);
 *
 * @example <caption>Get a previously set object</caption>
 * let counter = cache.get("counter");
 * if(counter == null){
 *      counter = {times: 0};
 *      cache.put("counter", counter);
 * }
 * console.log("Count",counter.times++);
 *
 * @memberof cache
 * @param {string} key the key whose associated value is to be returned
 * @param {function} [defaultSupplier] if the specified key is not already associated with a value, this function will return a default value
 * @returns {(*|null)} the current object for the supplied key, a default value if defaultSupplier is provided, or null
 */
export function get(key: string, defaultSupplier?: Function): (any | null);
/**
 * Associates the specified value with the specified key
 *
 * @memberof cache
 * @param {string} key key with which the specified value is to be associated
 * @param {*} value value to be associated with the specified key
 * @returns {(*|null)} the previous value associated with null, or null if there was no mapping for key
 */
export function put(key: string, value: any): (any | null);
/**
 * Removes the mapping for a key from this map if it is present
 *
 * @memberof cache
 * @param {string} key key whose mapping is to be removed from the map
 * @returns {(*|null)} the previous value associated with key or null if there was no mapping for key
 */
export function remove(key: string): (any | null);
/**
 * Checks the mapping for a key from this map.
 *
 * @memberof cache
 * @param {string} key key whose mapping is to be checked in the map
 * @returns {boolean} whether the key has a mapping
 */
export function exists(key: string): boolean;
//# sourceMappingURL=cache.d.ts.map