/**
 * Environment namespace.
 * This namespace handles utilities for determining the script environment and retrieving information about it.
 *
 * @namespace environment
 */
/**
 * Returns whether the code is running from a file-based script.
 * This is determined by checking if the `javax.script.filename` global variable is defined.
 * This is useful to distinguish between file-based scripts and UI-based scripts in openHAB.
 *
 * @memberOf environment
 * @return {boolean} true if the script is file-based, false otherwise
 */
export function isFileBasedScript(): boolean;
/**
 * Returns whether the registry implementations from the `@runtime/provider` module should be used instead of the default ones from the `@runtime` module.
 * Provider implementations should be used if the host openHAB version supports it and the script is running from a file-based script.
 *
 * @memberOf environment
 * @return {boolean} true if the provider registry implementations should be used, false otherwise
 */
export function useProviderRegistries(): boolean;
//# sourceMappingURL=environment.d.ts.map