/// <reference path="./java.d.ts" />

declare global {
  namespace items {
    type Item = InstanceType<typeof import('./items/items').Item>;
    type ItemConfig = import('./items/items').ItemConfig;
    type ItemMetadata = InstanceType<typeof import('./items/metadata').ItemMetadata>;
    type TimeSeries = InstanceType<typeof import('./items/time-series')>;
    type ItemPersistence = InstanceType<typeof import('./items/items').ItemPersistence>;
    type ItemSemantics = InstanceType<typeof import('./items/items').ItemSemantics>;
    type PersistedItem = InstanceType<typeof import('./items/items').PersistedItem>;
    type PersistedState = InstanceType<typeof import('./items/items').PersistedState>;
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

  type Quantity = InstanceType<typeof import('./quantity').Quantity>;
}
export {};
