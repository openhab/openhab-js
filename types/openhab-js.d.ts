// Manually written type defintions to avoid problems with lazy loading in index.js

/**
 * Native Java openHAB State (instance of {@link https ://www.openhab.org/javadoc/latest/org/openhab/core/types/state org.openhab.core.types.State})
 */
export type HostState = object;
/**
 * Native Java openHAB Item (instance of {@link https ://www.openhab.org/javadoc/latest/org/openhab/core/items/item org.openhab.core.items.Item})
 */
export type HostItem = object;
/**
 * Native Java Class Object (instance of java.lang.Class)
 */
export type HostClass = object;
/**
 * Native Jave openHAB Rule (instance of {@link https ://www.openhab.org/javadoc/latest/org/openhab/core/automation/rule org.openhab.core.automation.Rule})
 */
export type HostRule = object;
/**
 * Native Jave openHAB Trigger (instance of {@link https ://www.openhab.org/javadoc/latest/org/openhab/core/automation/trigger org.openhab.core.automation.Trigger})
 */
export type HostTrigger = object;
/**
 * Native Java openHAB Thing (instance of {@link https ://www.openhab.org/javadoc/latest/org/openhab/core/thing/thing org.openhab.core.thing.Thing})
 */
export type HostThing = object;
export const log: typeof import("./log");
export const rules: typeof import("./rules/rules");
export const items: typeof import("./items/items");
export const things: typeof import("./things/things");
export const metadata: typeof import("./metadata/metadata");
export const triggers: typeof import("./triggers");
export const actions: typeof import("./actions");
export const utils: typeof import("./utils");
export const osgi: typeof import("./osgi");
export const cache: typeof import("./cache");
export const time: typeof import("./time");
export const Quantity: typeof import("js-quantities");
export {};
