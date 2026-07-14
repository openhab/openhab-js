/// <reference path="../src/java.d.ts" />

declare global {
  namespace items {
    type Item = import('./items/items').Item;
    type ItemConfig = import('./items/items').ItemConfig;
    type ItemMetadata = import('./items/metadata').ItemMetadata;
    type TimeSeries = import('./items/time-series');
    type ItemPersistence = import('./items/items').ItemPersistence;
    type ItemSemantics = import('./items/items').ItemSemantics;
    type PersistedItem = InstanceType<typeof import('./items/item-persistence').PersistedItem>;
    type PersistedState = InstanceType<typeof import('./items/item-persistence').PersistedState>;
  }

  namespace time {
    type ZonedDateTime = import('@js-joda/core').ZonedDateTime;
    type Instant = import('@js-joda/core').Instant;
    type Duration = import('@js-joda/core').Duration;
    type LocalDateTime = import('@js-joda/core').LocalDateTime;
    type LocalTime = import('@js-joda/core').LocalTime;
    type LocalDate = import('@js-joda/core').LocalDate;
  }

  namespace rules {
    type RuleCallback = import('./rules/rules').RuleCallback;
    type RuleConfig = import('./rules/rules').RuleConfig;
  }

  type Quantity = import('./quantity').Quantity;
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
export const QuantityClass: typeof import("./quantity").Quantity;
export const environment: typeof import("./environment");
export {};
