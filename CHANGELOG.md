# Changelog

## 5.11.4

| Type   | Namespace | Description                                             | Reference                                              | Breaking |
|--------|-----------|---------------------------------------------------------|--------------------------------------------------------|----------|
| Bugfix | `items`   | Item: Fix .state returns null if state is NULL or UNDEF | [#463](https://github.com/openhab/openhab-js/pull/463) | no       |

Also see [`v5.11.3...v5.11.4`](https://github.com/openhab/openhab-js/compare/v5.11.3...v5.11.4).

## 5.11.3

| Type   | Namespace | Description                                        | Reference                                              | Breaking |
|--------|-----------|----------------------------------------------------|--------------------------------------------------------|----------|
| Bugfix | `items`   | Item: Fix lastStateChange fields call wrong method | [#459](https://github.com/openhab/openhab-js/pull/459) | no       |

Also see [`v5.11.2...v5.11.3`](https://github.com/openhab/openhab-js/compare/v5.11.2...v5.11.3).

## 5.11.2

| Type        | Namespace     | Description                                                                       | Reference                                              | Breaking |
|-------------|---------------|-----------------------------------------------------------------------------------|--------------------------------------------------------|----------|
| Bugfix      | `items`       | Fix `NULL` Item state (UnDefType) not recognized as `null`                        | [#448](https://github.com/openhab/openhab-js/pull/448) | no       |
| Bugfix      | `Quantity`    | Fix `.unit` returns null if there is a valid unit                                 | [#449](https://github.com/openhab/openhab-js/pull/449) | no       |
| Bugfix      | `items`       | Item: Declare null as allowed value for `sendCommand`, `postUpdate`               | [#452](https://github.com/openhab/openhab-js/pull/452) | no       |

Also see [`v5.11.1...v5.11.2`](https://github.com/openhab/openhab-js/compare/v5.11.1...v5.11.2).

## 5.11.1 (5.11.0)

| Type        | Namespace | Description                                                                        | Reference                                              | Breaking |
|-------------|-----------|------------------------------------------------------------------------------------|--------------------------------------------------------|----------|
| Enhancement | `items`   | Item: Add previousState, lastStateUpdate and lastStateChange methods to Item class | [#432](https://github.com/openhab/openhab-js/pull/432) | no       |
| Enhancement | `cache`   | Allow returning null from supplier function                                        | [#435](https://github.com/openhab/openhab-js/pull/435) | no       |
| Enhancement | `items`   | Item: Add numeric and quantity variants for previousState                          | [#433](https://github.com/openhab/openhab-js/pull/433) | no       |
| Enhancement | `items`   | Refactor state factory methods into shared helpers                                 | [#437](https://github.com/openhab/openhab-js/pull/437) | no       |

Also see the [Release Milestone](https://github.com/openhab/openhab-js/milestone/42) and [`v5.10.1...v5.11.1`](https://github.com/openhab/openhab-js/compare/v5.10.1...v5.11.1).

## 5.10.1

| Type   | Namespace | Description                                                          | Reference                                              | Breaking |
|--------|-----------|----------------------------------------------------------------------|--------------------------------------------------------|----------|
| Bugfix | `items`   | ItemPersistence: Fix backward compatibility when missing RiemannType | [#430](https://github.com/openhab/openhab-js/pull/430) | no       |
| Bugfix | `log`     | Don't make the logger name lower case                                | [#431](https://github.com/openhab/openhab-js/pull/431) | no       |

Also see the [Release Milestone](https://github.com/openhab/openhab-js/milestone/41) and [`v5.10.0...v5.10.1`](https://github.com/openhab/openhab-js/compare/v5.10.0...v5.10.1).

## 5.10.0

| Type        | Namespace | Description                                       | Reference                                              | Breaking |
|-------------|-----------|---------------------------------------------------|--------------------------------------------------------|----------|
| Enhancement | `items`   | ItemPersistence: Extend with Riemann Sums         | [#401](https://github.com/openhab/openhab-js/pull/401) | no       |
| Enhancement | `items`   | Provide static access to RiemannType enum         | [#427](https://github.com/openhab/openhab-js/pull/427) | no       |
| Enhancement | `items`   | Add expire command functionality to `sendCommand` | [#428](https://github.com/openhab/openhab-js/pull/428) | no       |

Also see the [Release Milestone](https://github.com/openhab/openhab-js/milestone/40) and [`v5.9.0...v5.10.0`](https://github.com/openhab/openhab-js/compare/v5.9.0...v5.10.0).

## 5.9.0

| Type        | Namespace | Description                                                                     | Reference                                              | Breaking |
|-------------|-----------|---------------------------------------------------------------------------------|--------------------------------------------------------|----------|
| Enhancement | `time`    | Use configured time-zone when converting DateTimeType to ZonedDateTime          | [#408](https://github.com/openhab/openhab-js/pull/408) | no       |
| Enhancement | `time`    | Add `toInstant` method                                                          | [#413](https://github.com/openhab/openhab-js/pull/413) | no       |
| Enhancement |           | Several dependency upgrades                                                     |                                                        | no       |
| Bugfix      | `items`   | Fix `sendCommandIfDifferent` fails for Dimmer/Number Items with string commands | [#421](https://github.com/openhab/openhab-js/pull/421) | no       |
| Enhancement | `time`    | `toZDT`: Add support for Instant                                                | [#422](https://github.com/openhab/openhab-js/pull/422) | no       |
| Enhancement | `time`    | `toInstant`: Add support for epoch millis                                       | [#422](https://github.com/openhab/openhab-js/pull/422) | no       |
| Enhancement | `items`   | Add `time.Instant` as valid parameter type for `sendCommand` & `postUpdate`     | [#423](https://github.com/openhab/openhab-js/pull/423) | no       |
| Enhancement | `rules`   | Rule Builder: Replace `parse-duration` dependency by using JS-Joda instead      | [#424](https://github.com/openhab/openhab-js/pull/424) | no       |

Also see the [Release Milestone](https://github.com/openhab/openhab-js/milestone/39) and [`v5.8.1...v5.9.0`](https://github.com/openhab/openhab-js/compare/v5.8.1...v5.9.0).

## 5.8.1

| Type   | Namespace | Description                                                 | Reference                                              | Breaking |
|--------|-----------|-------------------------------------------------------------|--------------------------------------------------------|----------|
| Bugfix | `items`   | Fix PersistedItem extending PersistedState type defs        | [#399](https://github.com/openhab/openhab-js/pull/399) | No       |
| Bugfix | `cache`   | Advise to not store JavaScript objects only in shared cache | [#402](https://github.com/openhab/openhab-js/pull/402) | No       |

Also see the [Release Milestone](https://github.com/openhab/openhab-js/milestone/38).

## 5.8.0

| Type          | Namespace | Description                                   | Reference                                              | Breaking |
|---------------|-----------|-----------------------------------------------|--------------------------------------------------------|----------|
| Enhancement   | `items`   | ItemPersistence: Add `PersistedItem::instant` | [#396](https://github.com/openhab/openhab-js/pull/396) | No       |

Also see the [Release Milestone](https://github.com/openhab/openhab-js/milestone/37).

## 5.7.2

| Type          | Namespace | Description                                                | Reference                                              | Breaking |
|---------------|-----------|------------------------------------------------------------|--------------------------------------------------------|----------|
| Documentation | `actions` | Add new ColorUtil methods to CoreUtil docs                 | [#388](https://github.com/openhab/openhab-js/pull/388) | No       |
| Bugfix        | `rules`   | Rule Builder: Fix wrong type defs for `send(command)`      | [#389](https://github.com/openhab/openhab-js/pull/389) | No       |
| Bugfix        | `rules`   | Rule Builder: Fix condition callback type def              | [#390](https://github.com/openhab/openhab-js/pull/390) | No       |
| Bugfix        | `cache`   | Advice to not store objects in shared cache                | [#391](https://github.com/openhab/openhab-js/pull/391) | No       |
| Bugfix        | `items`   | Fix type def issues caused by private method in Item class | [#394](https://github.com/openhab/openhab-js/pull/394) | No       |

Also see the [Release Milestone](https://github.com/openhab/openhab-js/milestone/36).

## 5.7.1

| Type   | Namespace | Description                                                | Reference                                              | Breaking |
|--------|-----------|------------------------------------------------------------|--------------------------------------------------------|----------|
| Bugfix |           | Properly handle `null` input in internal instanceof checks | [#385](https://github.com/openhab/openhab-js/pull/385) | No       |

Also see the [Release Milestone](https://github.com/openhab/openhab-js/milestone/35).

## 5.7.0

| Type        | Namespace | Description                                               | Reference                                                                                        | Breaking |
|-------------|-----------|-----------------------------------------------------------|--------------------------------------------------------------------------------------------------|----------|
| Bugfix      | `osgi`    | Fix type defs of `getService`                             | [9c87bb7](https://github.com/openhab/openhab-js/commit/9c87bb7e9902a2f2d8006872867384375779f73f) | No       |
| Enhancement | `rules`   | Rule Builder: Add offset support for DateTimeTrigger      | [#382](https://github.com/openhab/openhab-js/pull/382)                                           | No       |
| Bugfix      | `time`    | Default to user-configured timezone                       | [#383](https://github.com/openhab/openhab-js/pull/383)                                           | No       |
| Enhancement | `items`   | Item: Add sendIncreaseCommand/sendDecreaseCommand methods | [#371](https://github.com/openhab/openhab-js/pull/371)                                           | No       |

Please note that with this release the `utils.javaInstantToJsInstant` and `utils.javaZDTToJsZDT` methods have moved to the `time` namespace,
and `utils.javaZDTToJsZDTWithDefaultZoneSystem` has been replaced by `time.javaZDTToJsZDT`.
The old methods are still available for backwards compatibility but considered deprecated.

Also see the [Release Milestone](https://github.com/openhab/openhab-js/milestone/34).

## 5.6.0

| Type        | Namespace  | Description                                                                | Reference                                              | Breaking |
|-------------|------------|----------------------------------------------------------------------------|--------------------------------------------------------|----------|
| Enhancement | `items`    | ItemPersistence: Add medianSince, medianUntil and medianBetween methods    | [#376](https://github.com/openhab/openhab-js/pull/376) | No       |
| Enhancement | `rules`    | Add offset & timeOnly to event information for DateTimeTrigger             | [#379](https://github.com/openhab/openhab-js/pull/379) | No       |
| Enhancement | `triggers` | Support offset param for DateTimeTrigger                                   | [#380](https://github.com/openhab/openhab-js/pull/380) | No       |
| Enhancement | `items`    | ItemPersistence: Add toString overrides for PersistedState & PersistedItem | [#381](https://github.com/openhab/openhab-js/pull/381) | No       |

Please note that the signature of DateTimeTriggers has changed.
The old signature is still supported but considered deprecated.
See the [openhab-js : triggers : DateTimeTrigger JSDoc](https://openhab.github.io/openhab-js/triggers.html#.DateTimeTrigger) for more information.

Also see the [Release Milestone](https://github.com/openhab/openhab-js/milestone/33).

## 5.5.0

| Type        | Namespace | Description                                                          | Reference                                                                                        | Breaking |
|-------------|-----------|----------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|----------|
| Enhancement | `actions` | NotificationBuilder: Make message optional (default to empty string) | [#370](https://github.com/openhab/openhab-js/pull/370)                                           | No       |
| Enhancement | `rules`   | JSRule: Support rules without triggers                               | [#372](https://github.com/openhab/openhab-js/pull/372)                                           | No       |
| Bugfix      | `rules`   | RuleBuilder: Fix type defs for .if() and .then()                     | [7b46659](https://github.com/openhab/openhab-js/commit/7b46659586d19c681936398de3d1151fc5bc9590) | No       |

Also see the [Release Milestone](https://github.com/openhab/openhab-js/milestone/32).

## 5.4.0

| Type        | Namespace | Description                                                                | Reference                                              | Breaking |
|-------------|-----------|----------------------------------------------------------------------------|--------------------------------------------------------|----------|
| Enhancement | `actions` | NotificationBuilder: Support multiple args for addUserId                   | [#362](https://github.com/openhab/openhab-js/pull/362) | No       |
| Enhancement | `utils`   | Replace `isJsInstanceOfJavaType` method with `instanceof`                  | [#364](https://github.com/openhab/openhab-js/pull/364) | **Yes**  |
| Bugfix      |           | Use instanceof helpers for Item and Quantity class instead of `instanceof` | [#365](https://github.com/openhab/openhab-js/pull/365) | No       |
| Bugfix      | `actions` | ScriptExecution: Fix missing timer identifier for UI scripts               | [#367](https://github.com/openhab/openhab-js/pull/367) | No       |

Also see the [Release Milestone](https://github.com/openhab/openhab-js/milestone/31).

## 5.3.3 (5.3.2)

| Type   | Namespace | Description                                                                      | Reference                                              | Breaking |
|--------|-----------|----------------------------------------------------------------------------------|--------------------------------------------------------|----------|
| Bugfix | `rules`   | SwitchableJSRule: Fix restore previous state fails for switch Item               | [#355](https://github.com/openhab/openhab-js/pull/355) | No       |
| Bugfix | `time`    | `toZDT`: Fix JSDoc for `when` parameter says param is required                   | [#357](https://github.com/openhab/openhab-js/pull/357) | No       |
| Bugfix | `items`   | `getItem`: Don't declare `null` as return value as this is normally not returned | [#358](https://github.com/openhab/openhab-js/pull/358) | No       |
| Bugfix | `rules`   | RuleBuilder: Mark `fn` for `then(fn)` as optional (wrong JSDoc)                  | [#359](https://github.com/openhab/openhab-js/pull/359) | No       |
| Bugfix | `rules`   | JSRule: Always sanitize passed in rule UID                                       | [#360](https://github.com/openhab/openhab-js/pull/360) | No       |

Also see the [Release Milestone](https://github.com/openhab/openhab-js/milestone/30).

## 5.3.1 (5.3.0)

| Type        | Namespace | Description                                                         | Reference                                              | Breaking |
|-------------|-----------|---------------------------------------------------------------------|--------------------------------------------------------|----------|
| Enhancement | `actions` | Add notification builder                                            | [#351](https://github.com/openhab/openhab-js/pull/351) | No       |
| Enhancement | `actions` | Mark some actions deprecated as replaced by better APIs             | [#351](https://github.com/openhab/openhab-js/pull/351) | No       |
| Enhancement | `actions` | Notification Builder: Add support for updating/hiding notifications | [#353](https://github.com/openhab/openhab-js/pull/351) | No       |

These two releases are coupled together as 5.3.1 contains follow-up changes for 5.3.0.
Use 5.3.1 instead of 5.3.0.

Also see the [Release Milestone](https://github.com/openhab/openhab-js/milestone/29).

## 5.2.0

| Type        | Namespace | Description                                            | Reference                                              | Breaking |
|-------------|-----------|--------------------------------------------------------|--------------------------------------------------------|----------|
| Enhancement | `items`   | ItemPersistence: Add lastChange and nextChange methods | [#350](https://github.com/openhab/openhab-js/pull/350) | No       |

Also see the [Release Milestone](https://github.com/openhab/openhab-js/milestone/28).

## 5.1.2 (5.1.1)

| Type   | Namespace | Description                                            | Reference                                                                                                       | Breaking |
|--------|-----------|--------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|----------|
| Bugfix | `helpers` | Fix isInstant check & Improve isXXXX checks in general | [#348](https://github.com/openhab/openhab-js/pull/348) & [#349](https://github.com/openhab/openhab-js/pull/349) | No       |

These two releases are coupled together as 5.1.2 contains follow-up changes for 5.1.1.
Use 5.1.2 instead of 5.1.1.

Also see the [Release Milestone](https://github.com/openhab/openhab-js/milestone/27).

## 5.1.0

| Type        | Namespace  | Description                                                                 | Reference                                                                                         | Breaking |
|-------------|------------|-----------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------|----------|
| Bugfix      | `Quantity` | Fix type definitions                                                        | [ee0a59a5](https://github.com/openhab/openhab-js/commit/ee0a59a5dbd31c181bb7fdfe6b28be8d39637183) | No       |
| Enhancement | `rules`    | Add original input to event data for file-bases rules                       | [#334](https://github.com/openhab/openhab-js/pull/334)                                            | No       |
| Bugfix      | `items`    | ItemPersistence: Fix multi-threaded access exception when persisting states | [#339](https://github.com/openhab/openhab-js/pull/339)                                            | No       |
| Enhancement | `items`    | ItemPersistence: Add support for persisting TimeSeries                      | [#341](https://github.com/openhab/openhab-js/pull/341)                                            | No       |
| Enhancement | `items`    | TimeSeries: Add support for using Instant as timestamp                      | [#342](https://github.com/openhab/openhab-js/pull/342)                                            | No       |
| Enhancement | `items`    | Item: Fix `sendCommandIfDifferent` fails to compare Quantity                | [#343](https://github.com/openhab/openhab-js/pull/343)                                            | No       |

Also see the [Release Milestone](https://github.com/openhab/openhab-js/milestone/26).

## 5.0.0

| Type        | Namespace | Description                                                               | Reference                                              | Breaking |
|-------------|-----------|---------------------------------------------------------------------------|--------------------------------------------------------|----------|
| Clean-Up    |           | Remove deprecated methods and fields                                      | [#332](https://github.com/openhab/openhab-js/pull/332) | **Yes**  |
| Enhancement | `items`   | `ItemHistory`: Adjust to core changes & Add new methods for future states | [#331](https://github.com/openhab/openhab-js/pull/331) | **Yes**  |

Please note that this release drops support for openHAB 4.1.x.
From now on, openHAB 4.2.0 is the minimum requirement for full compatibility.

Read the [release community post](https://community.openhab.org/t/openhab-javascript-library-releases/144137#whats-new-in-500-1) to learn about adjusting your scripts and rules to the breaking changes.

Also see the [Release Milestone](https://github.com/openhab/openhab-js/milestone/25).

## 4.9.0

| Type        | Namespace | Description                                                   | Reference                                              | Breaking |
|-------------|-----------|---------------------------------------------------------------|--------------------------------------------------------|----------|
| Enhancement | `time`    | Upgrade JS-Joda (date & time library)                         | [#323](https://github.com/openhab/openhab-js/pull/323) | No       |
| Enhancement | `rules`   | `SwitchableJSRule`: Add option to specify name of Switch item | [#325](https://github.com/openhab/openhab-js/pull/325) | No       |
| Enhancement | `items`   | Remove the `Item` suffix from Item.type                       | [#325](https://github.com/openhab/openhab-js/pull/325) | **Yes**  |

Also see the [Release Milestone](https://github.com/openhab/openhab-js/milestone/24).

## 4.8.0

| Type        | Namespace | Description                                | Reference                                                                                        | Breaking |
|-------------|-----------|--------------------------------------------|--------------------------------------------------------------------------------------------------|----------|
| Enhancement | `actions` | Export `CoreUtil` actions                  | [#319](https://github.com/openhab/openhab-js/pull/319)                                           | No       |
| Enhancement | `rules`   | `JSRule`: Update MIME type shown in the UI | [c8c664a](https://github.com/openhab/openhab-js/commit/c8c644a109fa8555485e38b25322ad94adbe6fa9) | No       |

Also see the [Release Milestone](https://github.com/openhab/openhab-js/milestone/23).

## 4.7.3

| Type   | Namespace | Description                                                   | Reference                                                                                        | Breaking |
|--------|-----------|---------------------------------------------------------------|--------------------------------------------------------------------------------------------------|----------|
| Bugfix | `items`   | Fix updating/commanding Item with `undefined` fails           | [b30c794](https://github.com/openhab/openhab-js/commit/b30c794160e7bad9533afcd08911a6d45fd98278) | No       |
| Bugfix | `things`  | Fix `getThing` doesn't return `null` if Thing is not existent | [#315](https://github.com/openhab/openhab-js/pull/315)                                           | No       |

Also see the [Release Milestone](https://github.com/openhab/openhab-js/milestone/22).

## 4.7.1

| Type   | Namespace | Description                                                                              | Reference                                              | Breaking |
|--------|-----------|------------------------------------------------------------------------------------------|--------------------------------------------------------|----------|
| Bugfix | `time`    | Fix `toZDT` fails when injection caching is enabled because instanceof checks don't work | [#312](https://github.com/openhab/openhab-js/pull/312) | No       |

Also see the [Release Milestone](https://github.com/openhab/openhab-js/milestone/21).

## 4.7.0

| Type        | Namespace  | Description                                                                  | Reference                                                                                        | Breaking |
|-------------|------------|------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|----------|
| Enhancement | `triggers` | Add `GenericEventTrigger`                                                    | [#300](https://github.com/openhab/openhab-js/pull/300)                                           | No       |
| Bugfix      | `rules`    | Fix Rule Builder type defs not available                                     | [5ad1938](https://github.com/openhab/openhab-js/commit/5ad1938f4cb6c8f54a507b5bd2fe1a20c5c27dba) | No       |
| Enhancement | `items`    | ItemHistory: Add `getAllStatesBetween` & `getAllStatesSince` methods         | [#309](https://github.com/openhab/openhab-js/pull/309)                                           | No       |
| Bugfix      | `time`     | Default to system timezone in `toZDT` if zone is not explicitly provided     | [#307](https://github.com/openhab/openhab-js/pull/307)                                           | No       |
| Enhancement | `actions`  | ScriptExecution: Support passing params to createTimer in `setTimeout`-style | [#311](https://github.com/openhab/openhab-js/pull/311)                                           | No       |

Also see the [Release Milestone](https://github.com/openhab/openhab-js/milestone/20).

## 4.6.0

| Type        | Namespace | Description                                                         | Reference                                              | Breaking |
|-------------|-----------|---------------------------------------------------------------------|--------------------------------------------------------|----------|
| Bugfix      |           | Fix instance of Item checks don't work                              | [#290](https://github.com/openhab/openhab-js/pull/290) | No       |
| Enhancement | `rules`   | Rule Builder: Add DateTime & TimeOfDay triggers & Improve type defs | [#291](https://github.com/openhab/openhab-js/pull/291) | No       |
| Enhancement | `rules`   | Add event information for time-based and manual/run-rule triggers   | [#286](https://github.com/openhab/openhab-js/pull/286) | No       |
| Enhancement | `rules`   | Rule Builder: Add fromOn & fromOff to Item trigger config           | [#297](https://github.com/openhab/openhab-js/pull/297) | No       |
| Enhancement | `items`   | Use registry instead of provider                                    | [#298](https://github.com/openhab/openhab-js/pull/298) | No       |

Also see the [Release Milestone](https://github.com/openhab/openhab-js/milestone/19).


## 4.5.1

| Type   | Namespace      | Description                                                 | Reference                                              | Breaking |
|--------|----------------|-------------------------------------------------------------|--------------------------------------------------------|----------|
| Bugfix | `items`        | Fix null handling in sendCommand/postUpdate methods of Item | [#282](https://github.com/openhab/openhab-js/pull/282) | No       |
| Bugfix | Infrastructure | Disable Webpack TerserPlugin for cached globals injection   | [#283](https://github.com/openhab/openhab-js/pull/283) | No       |

Also see the [Release Milestone](https://github.com/openhab/openhab-js/milestone/18).

## 4.5.0

| Type        | Namespace  | Description                                                      | Reference                                                           | Breaking |
|-------------|------------|------------------------------------------------------------------|---------------------------------------------------------------------|----------|
| Enhancement | `Quantity` | Support Item for Quantity construction & divide/multiply methods | [#275](https://github.com/openhab/openhab-js/milestone/17?closed=1) | No       |

Also see the [Release Milestone](https://github.com/openhab/openhab-js/milestone/17).

## 4.4.0

| Type        | Namespace | Description                                                   | Reference                                              | Breaking |
|-------------|-----------|---------------------------------------------------------------|--------------------------------------------------------|----------|
| Enhancement | `utils`   | Add Java to JS conversion for `Instant` & `ZonedDateTime`     | [#267](https://github.com/openhab/openhab-js/pull/267) | No       |
| Bugfix      | `rules`   | Preserve disabled state of switchable rules after restarting  | [#271](https://github.com/openhab/openhab-js/pull/271) | No       |
| Enhancement |           | Configure webpack to keep class and function names            | [#273](https://github.com/openhab/openhab-js/pull/273) | No       |
| Enhancement | `rules`   | Add name of triggering group to event object                  | [#268](https://github.com/openhab/openhab-js/pull/268) | No       |
| Bugfix      | `things`  | Fix Thing.setX methods don't persist changes to ThingRegistry | [#274](https://github.com/openhab/openhab-js/pull/274) | No       |

Note: The changes on the event object require openHAB 4.0.0(.M4) or newer.

Also see the [Release Milestone](https://github.com/openhab/openhab-js/milestone/16).

## 4.3.0

| Type        | Namespace  | Description                                                                           | Reference                                                                                                                                                                                           | Breaking |
|-------------|------------|---------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| Enhancement | `Quantity` | Refactor exports for better internal use                                              | [b77b6e3](https://github.com/openhab/openhab-js/commit/b77b6e376549181b53ea19911fb94e87dae01253)                                                                                                    | No       |
| Enhancement | `items`    | Use data type classes instead of type definitions for `ItemMetadata` & `HistoricItem` | [e0f0ca1](https://github.com/openhab/openhab-js/commit/e0f0ca162c8cf1d5d4c1b99695d49f614631ae12) & [858ce86](https://github.com/openhab/openhab-js/commit/858ce860bc28c69eb41dc27fd548cdd24d1399ef) | No       |
| Bugfix      | `items`    | Fix Item semantics `location` & `equipment`                                           | [#261](https://github.com/openhab/openhab-js/pull/261)                                                                                                                                              | No       |
| Enhancement | `Quantity` | Minor improvements & Make `quantityState` `null` when unit is missing                 | [#263](https://github.com/openhab/openhab-js/pull/263)                                                                                                                                              | No       |

Also see the [Release Milestone](https://github.com/openhab/openhab-js/milestone/15).

## 4.2.1

| Type        | Namespace  | Description                                                    | Reference                                              | Breaking |
|-------------|------------|----------------------------------------------------------------|--------------------------------------------------------|----------|
| Bugfix      | `rules`    | Adjust `event` object for recent core changes                  | [#260](https://github.com/openhab/openhab-js/pull/260) | No       |

Also see the [Release Milestone](https://github.com/openhab/openhab-js/milestone/14).

Please note that openHAB >= 4.0.0(.M2) (or >= `SNAPSHOT #3391`) requires at least this version.

## 4.2.0

| Type        | Namespace  | Description                                                    | Reference                                                                                        | Breaking |
|-------------|------------|----------------------------------------------------------------|--------------------------------------------------------------------------------------------------|----------|
| Enhancement | `items`    | Add missing semantic actions to `ItemSemantics`                | [#252](https://github.com/openhab/openhab-js/pull/252)                                           | No       |
| Bugfix      | `Quantity` | Improve availability of `symbol` property                      | [c03241d](https://github.com/openhab/openhab-js/commit/c03241d9acdc7cd23694d441bb9b1a2214580a80) | No       |
| Bugfix      | `items`    | Accept `Quantity` as argument for `postUpdate` & `sendCommand` | [bdd1b98](https://github.com/openhab/openhab-js/commit/bdd1b9846dadbe432a5c3bf5b148d59367531439) | No       |

Also see the [Release Milestone](https://github.com/openhab/openhab-js/milestone/13).

## 4.1.0

| Type        | Namespace | Description                                         | Reference                                              | Breaking |
|-------------|-----------|-----------------------------------------------------|--------------------------------------------------------|----------|
| Enhancement | `utils`   | Add access to library version                       | [#244](https://github.com/openhab/openhab-js/pull/244) | No       |
| Bugfix      | `items`   | Fix error handling for `quantityState`              | [#243](https://github.com/openhab/openhab-js/pull/243) | No       |
| Bugfix      | `items`   | Fix silent failure of `ItemHistory.historicState`   | [#248](https://github.com/openhab/openhab-js/pull/248) | No       |
| Bugfix      | `items`   | Fix `ItemHistory.latestState` doesn’t return string | [#249](https://github.com/openhab/openhab-js/pull/249) | No       |

Also see the [Release Milestone](https://github.com/openhab/openhab-js/milestone/12).

## 4.0.0

| Type        | Namespace              | Description                                                                                       | Reference                                                                                               | Breaking |
|-------------|------------------------|---------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|----------|
| Enhancement | `items`                | Refactor `metadata` & `itemchannllink` APIs & add additional functionality                        | [#212](https://github.com/openhab/openhab-js/pull/212)                                                  | **Yes**  |
| Enhancement | `Quantity`             | Rename comparison methods                                                                         | [#211](https://github.com/openhab/openhab-js/pull/211)                                                  | **Yes**  |
| Bugfix      | `actions` & `triggers` | Remove arg type checks as they cause trouble & addon now logs stack on `IllegalArgumentException` | Commit [9975507](https://github.com/openhab/openhab-js/commit/99755070df9b4fa3d96157f74bbeb3809ae22514) | No       |
| Bugfix      | `rules`                | `SwitchableJSRule`: Fix deprecation warning of EventObj                                           | Commit [0df9462](https://github.com/openhab/openhab-js/commit/0df946213a0ebf17f4ec4cec3ea12b6d08a483c8) | No       |
| Bugfix      | `items`                | Metadata: Return configuration as JS obj instead of Java Map                                      | [#222](https://github.com/openhab/openhab-js/pull/222)                                                  | No       |
| Enhancement | `time`                 | Add isBefore(Date/Time/DateTime) and isAfter(Date/Time/DateTime)                                  | [#227](https://github.com/openhab/openhab-js/pull/227)                                                  | No       |
| Enhancement | `items`                | ItemHistory: return an object with state and timestamp instead of just state where applicable     | [#228](https://github.com/openhab/openhab-js/pull/228)                                                  | **Yes**  |
| Enhancement | `items`                | Metadata: Accept Item as param in addition to Item name                                           | [#230](https://github.com/openhab/openhab-js/pull/230)                                                  | No       |
| Enhancement | `items`                | Allow Item lookup by name directly on the `items` namespace                                       | [#233](https://github.com/openhab/openhab-js/pull/233)                                                  | No       |
| Enhancement | `items`                | Add `numericState` & `quantityState` properties to `Item` & `HistoricItem`                        | [#234](https://github.com/openhab/openhab-js/pull/234)                                                  | No       |
| Enhancement | `items`                | Extend `metadata` & `itemchannellink` methods with additional functionality                       | [#223](https://github.com/openhab/openhab-js/pull/223)                                                  | No       |
| Enhancement | `osgi`                 | Migrate from addon- to core-provided lifecycle tracker                                            | [#237](https://github.com/openhab/openhab-js/pull/237)                                                  | No       |

Also see the [Release Milestone](https://github.com/openhab/openhab-js/milestone/11).

## 3.2.0

| Type        | Namespace  | Description                                                              | Reference                                                                                               | Breaking |
|-------------|------------|--------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|----------|
| Enhancement | `triggers` | Add support for `Item` as argument & Add arg type checks                 | [#194](https://github.com/openhab/openhab-js/pull/194)                                                  | No       |
| Enhancement | `items`    | ItemHistory: Add new persistence methods                                 | [#196](https://github.com/openhab/openhab-js/pull/196)                                                  | No       |
| Enhancement | `rules`    | Display `execute` code of `JSRule` in MainUI                             | [#199](https://github.com/openhab/openhab-js/pull/199)                                                  | No       |
| Enhancement | `time`     | Support ISO8601 string parsing in `toZDT`                                | [#202](https://github.com/openhab/openhab-js/pull/202)                                                  | No       |
| Enhancement | `time`     | Add `isBetweenDates` & `isBetweenDateTimes` polyfills to `ZonedDateTime` | [#203](https://github.com/openhab/openhab-js/pull/203)                                                  | No       |
| Enhancement | `items`    | ItemHistory: ItemHistory: Add `previousStateTimestamp` method            | [#205](https://github.com/openhab/openhab-js/pull/205)                                                  | No       |
| Enhancement | `Quantity` | Add UoM/Quantity handling functionality by wrapping QuantityType         | [#206](https://github.com/openhab/openhab-js/pull/206)                                                  | No       |
| Fix         | `items`    | Respect the `toString` method of the raw Java Item                       | [#198](https://github.com/openhab/openhab-js/pull/198)                                                  | No       |
| Fix         | `things`   | Respect the `toString` method of the raw Java Thing                      | [#198](https://github.com/openhab/openhab-js/pull/198)                                                  | No       |
| Cleanup     | `things`   | Remove unused ThingBuilder & ChannelBuilder                              | [#198](https://github.com/openhab/openhab-js/pull/198)                                                  | No       |
| Bugfix      | `things`   | Fix `bridgeUID` member of `Thing` not working                            | Commit [fec416a](https://github.com/openhab/openhab-js/commit/fec416a011f4a1e7453541c5beb17d3fca23ec85) | No       |
| Bugfix      |            | Fix & Improve type definitions                                           | [#209](https://github.com/openhab/openhab-js/pull/209)                                                  | No       |
| Bugfix      | `items`    | Fix `time.ZonedDateTime` not working as command or state update          | [#213](https://github.com/openhab/openhab-js/pull/213)                                                  | No       |
| Bugfix      | `rules`    | Catch persistence exceptions in SwitchableJSRule creation                | [#214](https://github.com/openhab/openhab-js/pull/214)                                                  | No       |

Also see the [Release Milestone](https://github.com/openhab/openhab-js/milestone/10).

## 3.1.0

| Type        | Namespace | Description                                 | Reference                                                                                               | Breaking |
|-------------|-----------|---------------------------------------------|---------------------------------------------------------------------------------------------------------|----------|
| Enhancement | `utils`   | Support all data types in `dumpObject`      | Commit [144e6a9](https://github.com/openhab/openhab-js/commit/144e6a9c58982f45a07bf704ac0bd18fa6c3a54d) | No       |
| Enhancement | `cache`   | Reimplementation to use the new core caches | [#191](https://github.com/openhab/openhab-js/pull/191)                                                  | No       |

Also see the [Release Milestone](https://github.com/openhab/openhab-js/milestone/9).

## 3.0.0

| Type        | Namespace | Description                                                         | Reference                                                                                                | Breaking |
|-------------|-----------|---------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|----------|
| Enhancement | `items`   | ItemHistory: Change return types of min/max between/since to number | [#175](https://github.com/openhab/openhab-js/pull/175)                                                   | **Yes**  |
| Cleanup     | `rules`   | Remove unused rule providers                                        | [#183](https://github.com/openhab/openhab-js/pull/183)                                                   | **Yes**  |
| Enhancement | `actions` | Add Transformation actions as a class with arg type checking        | [#180](https://github.com/openhab/openhab-js/pull/180)                                                   | No       |
| Cleanup     |           | Remove unused & non-working providers                               | Commit [83dac55d](https://github.com/openhab/openhab-js/commit/83dac55d67099494661d9bbee9cd0a58cca3e2b0) | No       |

Also see the [Release Milestone](https://github.com/openhab/openhab-js/milestone/8).

## 2.1.1

| Type        | Namespace | Description                                                | Reference                                              | Breaking |
|-------------|-----------|------------------------------------------------------------|--------------------------------------------------------|----------|
| Enhancement | `actions` | Don't deprecate `ScriptExecution.createTimer`              | [#171](https://github.com/openhab/openhab-js/pull/171) | No       |

Also see the [Release Milestone](https://github.com/openhab/openhab-js/milestone/7).

## 2.1.0

| Type        | Namespace | Description                                                | Reference                                              | Breaking |
|-------------|-----------|------------------------------------------------------------|--------------------------------------------------------|----------|
| Enhancement | `items`   | Add semantics to the `Item` class                          | [#167](https://github.com/openhab/openhab-js/pull/167) | No       |
| Docs        |           | Timer polyfills now behave like standard JS                | [#169](https://github.com/openhab/openhab-js/pull/169) | No       |
| Docs        |           | Remove raw Java timer creation methods & openHAB Timer     | [#169](https://github.com/openhab/openhab-js/pull/169) | No       |
| Bugfix      | `actions` | Warn when the raw Java timer creation methods are accessed | [#169](https://github.com/openhab/openhab-js/pull/169) | No       |

Also see the [Release Milestone](https://github.com/openhab/openhab-js/milestone/6).

# 2.0.4

| Type   | Namespace | Description                                     | Reference                                              | Breaking |
|--------|-----------|-------------------------------------------------|--------------------------------------------------------|----------|
| Docs   |           | Update timer docs                               | [#161](https://github.com/openhab/openhab-js/pull/161) | No       |
| Bugfix | `actions` | Fix `get()`, `thingActions()` & dynamic exports | [#165](https://github.com/openhab/openhab-js/pull/165) | No       |


Also see the [Release Milestone](https://github.com/openhab/openhab-js/milestone/5).

## 2.0.3

| Type        | Namespace  | Description                                                              | Reference                                              | Breaking |
|-------------|------------|--------------------------------------------------------------------------|--------------------------------------------------------|----------|
| Enhancement | `triggers` | Add DateTime Trigger                                                     | [#154](https://github.com/openhab/openhab-js/pull/154) | No       |
| Enhancement | `items`    | ItemHistory: Add missing methods & Enable type defs                      | [#158](https://github.com/openhab/openhab-js/pull/158) | No       |
| Docs        | `actions`  | Update docs for naming timers                                            | [#160](https://github.com/openhab/openhab-js/pull/160) | No       |


Also see the [Release Milestone](https://github.com/openhab/openhab-js/milestone/4).

## 2.0.2

| Type        | Namespace | Description                                                              | Reference                                              | Breaking |
|-------------|-----------|--------------------------------------------------------------------------|--------------------------------------------------------|----------|
| Bugfix      | `time`    | `isBetweenTimes` fails with: TypeError: `time.toZDT` is not a function   | [#151](https://github.com/openhab/openhab-js/pull/151) | No       |
| Enhancement | `items`   | Update JSDoc to fix type definitions for return of getters               | [#152](https://github.com/openhab/openhab-js/pull/152) | No       |
| Enhancement | `things`  | Update JSDoc to fix type definitions for return of getters               | [#152](https://github.com/openhab/openhab-js/pull/152) | No       |

Also see the [Release Milestone](https://github.com/openhab/openhab-js/milestone/3).

## 2.0.1

| Type        | Namespace | Description                                                              | Reference                                              | Breaking |
|-------------|-----------|--------------------------------------------------------------------------|--------------------------------------------------------|----------|
| Bugfix      | `rules`   | Strip dashes in generated rule UIDs                                      | [#144](https://github.com/openhab/openhab-js/pull/144) | No       |
| Bugfix      | `rules`   | Fix `itemName` & `triggerType` unavailable for Group in Item****Triggers | [#146](https://github.com/openhab/openhab-js/pull/146) | No       |
| Enhancement | `actions` | Enable type definitions & Extend with `NotificationAction`               | [#148](https://github.com/openhab/openhab-js/pull/148) | No       |

Also see the [Release Milestone](https://github.com/openhab/openhab-js/milestone/2).

## 2.0.0

| Type        | Namespace  | Description                                              | Reference                                              | Breaking |
|-------------|------------|----------------------------------------------------------|--------------------------------------------------------|----------|
| Bugfix      | `rules`    | Failed rule run logs a useful error message              | [#116](https://github.com/openhab/openhab-js/pull/116) | No       |
| Enhancement | `utils`    | Allow `dumpObject` to also dump own properties           | [#121](https://github.com/openhab/openhab-js/pull/121) | No       |
| Bugfix      | `rules`    | Fix `removeItem` not working                             | [#122](https://github.com/openhab/openhab-js/pull/122) | No       |
| Enhancement | `triggers` | Add PWM Automation trigger                               | [#126](https://github.com/openhab/openhab-js/pull/126) | No       |
| Enhancement | `triggers` | Add PID Automation trigger                               | [#131](https://github.com/openhab/openhab-js/pull/131) | No       |
| Enhancement | `things`   | Add Thing class & add `getThing`(s)                      | [#132](https://github.com/openhab/openhab-js/pull/132) | No       |
| Enhancement | `rules`    | Refactor EventObject to only hold properties with values | [#136](https://github.com/openhab/openhab-js/pull/136) | **Yes**  |
| Enhancement |            | Add type definitions for better autocompletion           | [#137](https://github.com/openhab/openhab-js/pull/137) | No       |

Also see the [Release Milestone](https://github.com/openhab/openhab-js/milestone/1).

## 1.2.3

Changelog is incomplete!

| Namespace | Description                                                        | Reference                                              | Breaking |
|-----------|--------------------------------------------------------------------|--------------------------------------------------------|----------|
| items     | `addItem(...)` and `updateItem(...)` use `itemConfig` as parameter | [#109](https://github.com/openhab/openhab-js/pull/109) | **Yes**  |
| time      | Add timeUtils                                                      | [#101](https://github.com/openhab/openhab-js/pull/101) | No       |

## 1.2.2

Changelog is incomplete!

| Namespace | Description                                                         | Reference                                            | Breaking |
|-----------|---------------------------------------------------------------------|------------------------------------------------------|----------|
| items     | item.history.lastUpdate() returns `ZonedDateTime` instead of `Date` | [#67](https://github.com/openhab/openhab-js/pull/67) | **Yes**  |
