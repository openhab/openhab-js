# Changelog

## 2.x.x (to be released)

| Type        | Namespace | Description                                                              | Reference                                      | Breaking |
|-------------|-----------|--------------------------------------------------------------------------|------------------------------------------------|----------|
| Bugfix      | `rules`   | Strip dashes in generated rule UIDs                                      | https://github.com/openhab/openhab-js/pull/144 | No       |
| Bugfix      | `rules`   | Fix `itemName` & `triggerType` unavailable for Group in Item****Triggers | https://github.com/openhab/openhab-js/pull/146 | No       |
| Enhancement | `actions` | Enable type definitions & Extend with `NotificationAction`               | https://github.com/openhab/openhab-js/pull/148 | No       |

Also see the [Release Milestone](https://github.com/openhab/openhab-js/milestone/2).

## 2.0.0

| Type        | Namespace  | Description                                              | Reference                                      | Breaking |
|-------------|------------|----------------------------------------------------------|------------------------------------------------|----------|
| Bugfix      | `rules`    | Failed rule run logs a useful error message              | https://github.com/openhab/openhab-js/pull/116 | No       |
| Enhancement | `utils`    | Allow `dumpObject` to also dump own properties           | https://github.com/openhab/openhab-js/pull/121 | No       |
| Bugfix      | `rules`    | Fix `removeItem` not working                             | https://github.com/openhab/openhab-js/pull/122 | No       |
| Enhancement | `triggers` | Add PWM Automation trigger                               | https://github.com/openhab/openhab-js/pull/126 | No       |
| Enhancement | `triggers` | Add PID Automation trigger                               | https://github.com/openhab/openhab-js/pull/131 | No       |
| Enhancement | `things`   | Add Thing class & add `getThing`(s)                      | https://github.com/openhab/openhab-js/pull/132 | No       |
| Enhancement | `rules`    | Refactor EventObject to only hold properties with values | https://github.com/openhab/openhab-js/pull/136 | **Yes**  |
| Enhancement |            | Add type definitions for better autocompletion           | https://github.com/openhab/openhab-js/pull/137 | No       |

Also see the [Release Milestone](https://github.com/openhab/openhab-js/milestone/1).

## 1.2.3

Changelog is incomplete!

| Namespace | Description                                                        | Reference                                      | Breaking |
|-----------|--------------------------------------------------------------------|------------------------------------------------|----------|
| items     | `addItem(...)` and `updateItem(...)` use `itemConfig` as parameter | https://github.com/openhab/openhab-js/pull/109 | **Yes**  |
| time      | Add timeUtils                                                      | https://github.com/openhab/openhab-js/pull/101 | No       |


## 1.2.2

Changelog is incomplete!

| Namespace | Description                                                         | Reference                                     | Breaking |
|-----------|---------------------------------------------------------------------|-----------------------------------------------|----------|
| items     | item.history.lastUpdate() returns `ZonedDateTime` instead of `Date` | https://github.com/openhab/openhab-js/pull/67 | **Yes**  |
