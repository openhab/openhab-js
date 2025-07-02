// This module MUST NOT depend on any other library code to avoid circular dependencies

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
function isFileBasedScript () {
  return globalThis['javax.script.filename'] !== undefined;
}

/**
 * Returns whether the host openHAB version supports providing openHAB entities via the `@runtime/provider` module.
 *
 * @private
 * @return {boolean} true if the provider module is available, false otherwise
 */
function _hasProviderSupport () {
  return !!require('@runtime/provider').itemRegistry;
}

/**
 * Returns whether the registry implementations from the `@runtime/provider` module should be used instead of the default ones from the `@runtime` module.
 * Provider implementations should be used if the host openHAB version supports it and the script is running from a file-based script.
 *
 * @memberOf environment
 * @return {boolean} true if the provider registry implementations should be used, false otherwise
 */
function useProviderRegistries () {
  return _hasProviderSupport() && isFileBasedScript();
}

module.exports = {
  isFileBasedScript,
  useProviderRegistries
};
