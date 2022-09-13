# Changelog

## 2.x.x (to be released)

| Type        | Namespace  | Description                                                              | Reference                                              | Breaking |
|-------------|------------|--------------------------------------------------------------------------|--------------------------------------------------------|----------|


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
