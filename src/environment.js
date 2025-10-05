// This module MUST NOT depend on any other library code to avoid circular dependencies

const FrameworkUtil = Java.type('org.osgi.framework.FrameworkUtil');

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
const OPENHAB_VERSION = FrameworkUtil.getBundle(Java.type('org.openhab.core.OpenHAB')).getVersion().toString();

/**
 * openHAB JavaScript library version
 *
 * @memberOf environment
 * @name OPENHAB_JS_VERSION
 * @type {string}
 */
const OPENHAB_JS_VERSION = require('../package.json').version;

/**
 * GraalJS version
 * @memberOf environment
 * @name GRAALJS_VERSION
 * @type {string}
 */
const GRAALJS_VERSION = FrameworkUtil.getBundle(Java.type('org.graalvm.polyglot.Context')).getVersion().toString();

/**
 * Returns whether the code is from a script file.
 * This is determined by checking if the `javax.script.filename` global variable is defined.
 * This is useful to distinguish between file-based scripts and UI-based scripts in openHAB.
 *
 * @memberOf environment
 * @return {boolean} true if the script is file-based, false otherwise
 */
function isScriptFile () {
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
  return _hasProviderSupport() && isScriptFile();
}

module.exports = {
  isScriptFile,
  useProviderRegistries,
  OPENHAB_VERSION,
  OPENHAB_JS_VERSION,
  GRAALJS_VERSION
};
