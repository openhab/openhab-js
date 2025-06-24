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
 * Returns whether the host openHAB version supports providing openHAB entities via the `@runtime/provider` module.
 *
 * @memberOf environment
 * @return {boolean} true if the provider module is available, false otherwise
 */
export function hasProviderSupport(): boolean;
//# sourceMappingURL=environment.d.ts.map