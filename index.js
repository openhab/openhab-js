/**
 * @typedef {Object} HostState Native Java openHAB State (instance of {@link https://www.openhab.org/javadoc/latest/org/openhab/core/types/state org.openhab.core.types.State})
 */
/**
 * @typedef {Object} HostItem Native Java openHAB Item (instance of {@link https://www.openhab.org/javadoc/latest/org/openhab/core/items/item org.openhab.core.items.Item})
 */
/**
 * @typedef {Object} HostClass Native Java Class Object (instance of java.lang.Class)
 */
/**
 * @typedef {Object} HostRule Native Jave openHAB Rule (instance of {@link https://www.openhab.org/javadoc/latest/org/openhab/core/automation/rule org.openhab.core.automation.Rule})
 */
/**
 * @typedef {Object} HostTrigger Native Jave openHAB Trigger (instance of {@link https://www.openhab.org/javadoc/latest/org/openhab/core/automation/trigger org.openhab.core.automation.Trigger})
 */

// lazy getters to avoid any reference loading all submodules
module.exports = {
  get log () { return require('./log'); },
  get rules () { return require('./rules'); },
  get items () { return require('./items'); },
  get things () { return require('./things'); },
  get metadata () { return require('./metadata'); },
  get triggers () { return require('./triggers'); },
  get actions () { return require('./actions'); },
  get utils () { return require('./utils'); },
  get osgi () { return require('./osgi'); },
  get cache () { return require('./cache'); },
  get time () { return require('./time'); }
};
