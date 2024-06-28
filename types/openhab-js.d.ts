declare global {
  /**
   * Native Java Class Object (instance of {@link https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/Class.html java.lang.Class})
   */
  type JavaClass = object;
  /**
   * Native Java BigDecimal (instance of {@link https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/math/BigDecimal.html java.math.BigDecimal})
   */
  type JavaBigDecimal = object;
  /**
   * Native Java Set Object (instance of {@link https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Set.html java.util.Set})
   */
  type JavaSet = object;
  /**
   * Native Java List Object (instance of {@link https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/List.html java.util.List})
   */
  type JavaList = object;
  /**
   * Native Java Map Object (implementation of {@link https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Map.html java.util.Map})
   */
  type JavaMap = object;
  /**
   * Native Java Instant Object (instance of {@link https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/time/Instant.html java.time.Instant})
   */
  type JavaInstant = object;
  /**
   * Native Java ZonedDateTime Object (instance of {@link https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/time/ZonedDateTime.html java.time.ZonedDateTime})
   */
  type JavaZonedDateTime = object;
  /**
   * Native Java openHAB State (instance of {@link https://www.openhab.org/javadoc/latest/org/openhab/core/types/state org.openhab.core.types.State})
   */
  type HostState = object;
  /**
   * Native Java openHAB Item (instance of {@link https://www.openhab.org/javadoc/latest/org/openhab/core/items/item org.openhab.core.items.Item})
   */
  type HostItem = object;
  /**
   * Native Javea openHAB Rule (instance of {@link https://www.openhab.org/javadoc/latest/org/openhab/core/automation/rule org.openhab.core.automation.Rule})
   */
  type HostRule = object;
  /**
   * Native Java openHAB Trigger (instance of {@link https://www.openhab.org/javadoc/latest/org/openhab/core/automation/trigger org.openhab.core.automation.Trigger})
   */
  type HostTrigger = object;
  /**
   * Native Java openHAB Thing (instance of {@link https://www.openhab.org/javadoc/latest/org/openhab/core/thing/thing org.openhab.core.thing.Thing})
   */
  type HostThing = object;
  /**
   * Native Java openHAB GroupFunction (instance of {@link https://www.openhab.org/javadoc/latest/org/openhab/core/items/groupfunction org.openhab.core.items.GroupFunction})
   */
  type HostGroupFunction = object;
  /**
   * Native Java openHAB QuantityType (instance of {@link https://www.openhab.org/javadoc/latest/org/openhab/core/library/types/quantitytype org.openhab.core.library.types.QuantityType})
   */
  type QuantityType = object;
}

// Manually written type definitions to avoid problems with lazy loading in index.js
export const log: typeof import("./log");
export const rules: typeof import("./rules");
export const items: typeof import("./items/items");
export const things: typeof import("./things");
export const triggers: typeof import("./triggers");
export const actions: typeof import("./actions/actions");
export const utils: typeof import("./utils");
export const osgi: typeof import("./osgi");
export const cache: typeof import("./cache");
export const time: typeof import("./time");
export const Quantity: typeof import("./quantity").getQuantity;
export {};
