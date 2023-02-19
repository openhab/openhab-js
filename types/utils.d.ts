/**
 * Convert JavaScript Set to Java Set.
 *
 * @memberOf utils
 * @param {Set} set JavaScript Set
 * @returns {JavaSet} Java Set
 */
export function jsSetToJavaSet(set: Set<any>): JavaSet;
/**
 * Convert JavaScript Array to Java Set.
 *
 * @memberOf utils
 * @param {Array} arr
 * @returns {JavaSet} Java Set
 */
export function jsArrayToJavaSet(arr: any[]): JavaSet;
/**
 * Convert JavaScript Array to Java List.
 *
 * @memberOf utils
 * @param {Array} arr JavaScript Array
 * @returns {JavaList}
 */
export function jsArrayToJavaList(arr: any[]): JavaList;
/**
 * Convert Java List to JavaScript Array.
 *
 * @memberOf utils
 * @param {JavaList} list
 * @returns {Array} JavaScript Array
 */
export function javaListToJsArray(list: JavaList): any[];
/**
 * Convert Java Set to JavaScript Array.
 *
 * @memberOf utils
 * @param {JavaSet} set
 * @returns {Array} JavaScript Array
 */
export function javaSetToJsArray(set: JavaSet): any[];
/**
 * Convert Java Set to JavaScript Set.
 *
 * @memberOf utils
 * @param {JavaSet} set Java Set ({@link https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Set.html})
 * @returns {Set} JavaScript Set Object ({@link https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Set})
 */
export function javaSetToJsSet(set: JavaSet): Set<any>;
/**
 * Convert Java Map to JavaScript Map.
 *
 * @memberof utils
 * @param {JavaMap} map
 * @returns {Map<any, any>} JavaScript Map
 */
export function javaMapToJsMap(map: JavaMap): Map<any, any>;
/**
 * Convert Java Map to JavaScript Object.
 *
 * @memberof utils
 * @param {JavaMap} map
 * @returns {object} JavaScript Object
 */
export function javaMapToJsObj(map: JavaMap): object;
/**
 * Generate a random UUID.
 *
 * @memberOf utils
 * @returns {string} random UUID
 */
export function randomUUID(): string;
/**
 * Outputs all members and properties of an object and whether it is a JS or a Java Object to the log.
 *
 * @memberOf utils
 * @param {*} obj object
 * @param {boolean} [dumpProps=false] whether properties also should be dumped
 */
export function dumpObject(obj: any, dumpProps?: boolean): void;
/**
 * Checks whether an object is instance of a Java class.
 *
 * @memberOf utils
 * @param {*} instance object
 * @param {JavaClass} type Java class ({@link https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/Class.html})
 * @returns {boolean} whether it is an instance of a Java class
 * @throws error if type is not a java class
 */
export function isJsInstanceOfJava(instance: any, type: JavaClass): boolean;
/**
 * openHAB JavaScript library version
 *
 * @type {string}
 */
declare const VERSION: string;
export { VERSION as OPENHAB_JS_VERSION };
//# sourceMappingURL=utils.d.ts.map