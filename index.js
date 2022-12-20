/**
 * @typedef {object} HostState Native Java openHAB State (instance of {@link https://www.openhab.org/javadoc/latest/org/openhab/core/types/state org.openhab.core.types.State})
 */
/**
 * @typedef {object} HostItem Native Java openHAB Item (instance of {@link https://www.openhab.org/javadoc/latest/org/openhab/core/items/item org.openhab.core.items.Item})
 */
/**
 * @typedef {object} HostClass Native Java Class Object (instance of java.lang.Class)
 */
/**
 * @typedef {object} HostRule Native Jave openHAB Rule (instance of {@link https://www.openhab.org/javadoc/latest/org/openhab/core/automation/rule org.openhab.core.automation.Rule})
 */
/**
 * @typedef {object} HostTrigger Native Jave openHAB Trigger (instance of {@link https://www.openhab.org/javadoc/latest/org/openhab/core/automation/trigger org.openhab.core.automation.Trigger})
 */
/**
 * @typedef {object} HostThing Native Java openHAB Thing (instance of {@link https://www.openhab.org/javadoc/latest/org/openhab/core/thing/thing org.openhab.core.thing.Thing})
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
  get time () { return require('./time'); },
  get Quantity () { return require('js-quantities'); }
};
