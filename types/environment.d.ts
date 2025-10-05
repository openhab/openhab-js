/**
 * Returns whether the code is from a script file.
 * This is determined by checking if the `javax.script.filename` global variable is defined.
 * This is useful to distinguish between file-based scripts and UI-based scripts in openHAB.
 *
 * @memberOf environment
 * @return {boolean} true if the script is file-based, false otherwise
 */
export function isScriptFile(): boolean;
/**
 * Returns whether the registry implementations from the `@runtime/provider` module should be used instead of the default ones from the `@runtime` module.
 * Provider implementations should be used if the host openHAB version supports it and the script is running from a file-based script.
 *
 * @memberOf environment
 * @return {boolean} true if the provider registry implementations should be used, false otherwise
 */
export function useProviderRegistries(): boolean;
/**
 * Environment namespace.
 * This namespace handles utilities for determining the script environment and retrieving information about it.
 * A word of caution: This namespace is considered an advanced API and might change without a new major version of the library.
 *
 * @namespace environment
 */
/**
 * openHAB version
 *
 * @memberOf environment
 * @name OPENHAB_VERSION
 * @type {string}
 */
export const OPENHAB_VERSION: string;
/**
 * openHAB JavaScript library version
 *
 * @memberOf environment
 * @name OPENHAB_JS_VERSION
 * @type {string}
 */
export const OPENHAB_JS_VERSION: string;
/**
 * GraalJS version
 * @memberOf environment
 * @name GRAALJS_VERSION
 * @type {string}
 */
export const GRAALJS_VERSION: string;
//# sourceMappingURL=environment.d.ts.map