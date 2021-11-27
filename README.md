[![Build Status](https://api.travis-ci.com/openhab/openhab-js.svg?branch=main)](https://travis-ci.com/openhab/openhab-js)
# openHAB Javascript Library

This library aims to be a fairly high-level ES6 library to support automation in openHAB. It provides convenient access to common openHAB functionality within rules including items, things, action, logging and more.

This library is included by default in the openHAB [JavaScript binding](https://www.openhab.org/addons/automation/jsscripting/)

## Contents

- [Requirements](#requirements)
- [Installation](#installation)
  - [Default Installation](#default-installation)
  - [Custom Installation](#custom-installation)
- [Usage](#usage)
  - [Basic Usage](#basic-usage)
  - [Advanced Usage](#advanced-usage)
- [Rule Builder API](#rule-builder-api)
  - [Rule Builder Triggers](#rule-builder-triggers)
  - [Rule Builder Conditions](#rule-builder-conditions)
  - [Rule Builder Operations](#rule-builder-operations)
  - [Rule Builder Examples](#rule-builder-examples)
- [API](#api)
  - [log](#log)
  - [rules](#rules)
  - [items](#items)
  - [things](#things)
  - [metadata](#metadata)
  - [triggers](#triggers)
  - [actions](#actions)

  


## Requirements

- openHAB [JavaScript binding](https://www.openhab.org/addons/automation/jsscripting/) 

## Installation

### Default Installation

- Install the openHAB [JavaScript binding](https://www.openhab.org/addons/automation/jsscripting/) 

### Custom Installation

- Ensure you have the correct path created `mkdir -p $OPENHAB_CONF/automation/lib/javascript/personal/node_modules`
- Go to the javascript community lib directory: `cd $OPENHAB_CONF/automation/lib/javascript/personal/node_modules`
- Run `npm i @openhab/automation` (you may need to install npm)

## Usage
This library provides an easy to use API for common automation activities that interact with items, things, activities and other openHAB concepts.

### Basic Usage

For example, turning a light on:
```javascript
items.getItem("KitchenLight").sendCommand("ON");
console.log("Kitchen Light State", items.getItem("KitchenLight").state);
```

Sending a notification
```javascript
actions.NotificationAction.sendNotification("romeo@montague.org", "Balcony door is open");
```

Querying the status of a thing 
```javascript
const thingStatusInfo = actions.Things.getThingStatusInfo("zwave:serial_zstick:512");
console.log("Thing status",thingStatusInfo.getStatus());
```

Scripting may be done via the openHAB UI or by creating scripts in $OPENHAB_CONF/automation/jsr223/javascript/personal.

### Advanced Usage
For file based scripts this API provides two ways of writing rules, a fluent [Rule Builder API](#rule-builder-api) and a declarative syntax using [JSRule](#rules#jsrule).

Rule Builder Example:
```javascript
//turn off the kitchen light at 9PM
rules.when().cron("0 0 21 * * ?").then().sendOff().toItem("KitchenLight").build("9PM Rule", "turn off the kitchen light at 9PM");
```

By default the JS Scripting binding will bind the exported variables of this library to `this`, so no additional importing is necessary. This behavior can be configured on or off in the binding's configuration options.

The injected import is roughly equivalent to:
```javascript
const {rules, items, things, log, triggers, actions, metadata} = require('@openhab/automation')
```

## Rule Builder API

The Rule Builder provides a convenient API to write rules in a high-level, readable style using a builder pattern. This is particularly useful when writing rules using files as opposed to using the UI which provides its own rule creation interface. 

For a declarative style creation of rules, see using [JSRule](#rulesjsrule).

Rules are started using `rules.when()` and can chain together rule [triggers](#rule-builder-triggers), [conditions](#rule-builder-conditions) and [operations](#rule-builder-operations) in the following pattern:

```javascript
rules.when().triggerType()...if().conditionType().then().operationType()...build(name,description);
```

A simple example of this would look like:

```javascript
rules.when().item("F1_Light").changed().then().send("changed").toItem("F2_Light").build("My Rule", "My First Rule");
```

Operations and Conditions can also optionally take functions:

```javascript
rules.when().item("F1_light").changed().then(event => {
  console.log(event);
}).build("Test Rule", "My Test Rule");
```
see [Examples](#rule-builder-examples) for further patterns

### Rule Builder Triggers

* `channel(channelName)`
  * `.triggered(event)`
* `cron(cronExpression)`
* `item(itemName)`
  * `.for(duration)`
  * `.from(state)`
  * `.to(state)`
  * `.fromOff()`
  * `.toOn()`
  * `.receivedCommand()`
  * `.receivedUpdate()`
* `memberOf(groupName)`
  * `.for(duration)`
  * `.from(state)`
  * `.to(state)`
  * `.fromOff()`
  * `.toOn()`
  * `.receivedCommand()`
  * `.receivedUpdate()`
* `system()`
  * `.ruleEngineStarted()`
  * `.rulesLoaded()`
  * `.startupComplete()`
  * `.thingsInitialized()`
  * `.userInterfacesStarted()`
  * `.startLevel(level)`
* `thing`
  * `changed()`
  * `updated()`
  * `from(state)`
  * `to(state)`


Additionally all the above triggers have the following function:
* `.if()` or `.if(fn)` -> a [rule condition](#rule-builder-conditions)
* `.then()` or `.then(fn)` -> a [rule operation](#rule-builder-operations)
* `.or()` -> a [rule trigger](#rule-builder-triggers) (chain additional triggers) 

### Rule Builder Conditions

* `FunctionConditionConf`
* `ItemStateConditionConf`

### Rule Builder Operations

* `build`
* `copyAndSendState`
* `copyState`
* `inGroup`
* `postIt`
* `postUpdate`
* `send`
* `sendIt`
* `sendOff`
* `sendOn`
* `sendToggle`

### Rule Builder Examples

```javascript
//turn on the kitchen light at SUNSET
rules.when().timeOfDay("SUNSET").then().sendOn().toItem("KitchenLight").build("Sunset Rule","turn on the kitchen light at SUNSET");

//turn off the kitchen light at 9PM
rules.when().cron("0 0 21 * * ?").then().sendOff().toItem("KitchenLight").build("9PM Rule", "turn off the kitchen light at 9PM");

//set the colour of the hall light to pink at 9PM
rules.when().cron("0 0 21 * * ?").then().send("300,100,100").toItem("HallLight").build("Pink Rule", "set the colour of the hall light to pink at 9PM");

//when the switch S1 status changes to ON, then turn on the HallLight
rules.when().item('S1').changed().toOn().then(sendOn().toItem('HallLight')).build("S1 Rule");

//when the HallLight colour changes pink, if the function fn returns true, then toggle the state of the OutsideLight
rules.when().item('HallLight').changed().to("300,100,100").if(fn).then().sendToggle().toItem('OutsideLight').build();

//and some rules which can be toggled by the items created in the 'gRules' Group:

//when the HallLight receives a command, send the same command to the KitchenLight
rules.when(true).item('HallLight').receivedCommand().then().sendIt().toItem('KitchenLight').build("Hall Light", "");

//when the HallLight is updated to ON, make sure that BedroomLight1 is set to the same state as the BedroomLight2
rules.when(true).item('HallLight').receivedUpdate().then().copyState().fromItem('BedroomLight1').toItem('BedroomLight2').build();

//when the BedroomLight1 is changed, run a custom function
rules.when(true).item('BedroomLight1').changed().then(() => {
    // do stuff
}.build();
```

# API
## log

By default the JS Scripting binding supports console logging like `console.log()` and `console.debug()` to the openHAB default log.  Additionally scripts may create their own native openHAB logs using the log namespace

```javascript
//this is imported by default, shown here for clarity only
let log = require('@openhab/automation');

let logger = log('my_logger');

//prints "Hello World!"
logger.debug("Hello {}!", "world");
```

## rules

The rules namespace allows the creation of rules from within another rule, or more commonly when authoring rules using files as opposed to using the UI. Two different APIs are provided to create rules, a fluent [Rule Builder API](#rule-builder-api) and a declarative syntax using JSRule

### rules.when()

Rules written using the [Rule Builder API](#rule-builder-api) use a fluent builder pattern for chaining together triggers, conditions and operations.

```javascript
//turn off the kitchen light at 9PM
rules.when().cron("0 0 21 * * ?").then().sendOff().toItem("KitchenLight").build("9PM Rule", "turn off the kitchen light at 9PM");
```

See the [Rule Builder API](#rule-builder-api) section for more details.

### rules.JSRule

  This provides a declarative syntax for defining rules
  ```javascript
  rules.JSRule({
    name: "Lights ON at 5pm",
    description: "Light will turn on when it's 5:00pm",
    triggers: [triggers.GenericCronTrigger("0 0 17 * * ?")],
    execute: data => {
        items.getItem("AllLights").sendCommand("ON");
    }
  });
  ```

  See the [triggers](#triggers) for additional triggers.
  
### rules.SwitchableJSRule

Creates switchable rule, uses the same syntax as [rules.JSRule](#rules.JSRule)

## Items
<a name="items"></a>

## items : <code>object</code>
**Kind**: global namespace  

* [items](#items) : <code>object</code>
    * [.OHItem](#items.OHItem)
        * [new OHItem(rawItem)](#new_items.OHItem_new)
        * [.type](#items.OHItem+type) ⇒ <code>String</code>
        * [.name](#items.OHItem+name) ⇒ <code>String</code>
        * [.label](#items.OHItem+label) ⇒ <code>String</code>
        * [.state](#items.OHItem+state) ⇒ <code>String</code>
        * [.rawState](#items.OHItem+rawState) ⇒ <code>HostState</code>
        * [.members](#items.OHItem+members) ⇒ <code>Array.&lt;OHItem&gt;</code>
        * [.descendents](#items.OHItem+descendents) ⇒ <code>Array.&lt;OHItem&gt;</code>
        * [.isUninitialized](#items.OHItem+isUninitialized) ⇒
        * [.tags](#items.OHItem+tags)
        * [.getMetadataValue(namespace)](#items.OHItem+getMetadataValue) ⇒ <code>String</code>
        * [.updateMetadataValue(namespace, value)](#items.OHItem+updateMetadataValue) ⇒ <code>String</code>
        * [.upsertMetadataValue(namespace, value)](#items.OHItem+upsertMetadataValue) ⇒ <code>Boolean</code>
        * [.updateMetadataValues(namespaceToValues)](#items.OHItem+updateMetadataValues)
        * [.sendCommand(value)](#items.OHItem+sendCommand)
        * [.sendCommandIfDifferent(value)](#items.OHItem+sendCommandIfDifferent) ⇒ <code>Boolean</code>
        * [.postUpdate(value)](#items.OHItem+postUpdate)
        * [.addGroups(...groupNamesOrItems)](#items.OHItem+addGroups)
        * [.removeGroups(...groupNamesOrItems)](#items.OHItem+removeGroups)
        * [.addTags(...tagNames)](#items.OHItem+addTags)
        * [.removeTags(...tagNames)](#items.OHItem+removeTags)
    * [.DYNAMIC_ITEM_TAG](#items.DYNAMIC_ITEM_TAG)
    * [.createItem(itemName, [itemType], [category], [groups], [label], [tags], [giBaseType], [groupFunction], [itemMetadata])](#items.createItem)
    * [.addItem(itemName, [itemType], [category], [groups], [label], [tags], [giBaseType], [groupFunction])](#items.addItem)
    * [.removeItem(itemOrItemName)](#items.removeItem) ⇒ <code>Boolean</code>
    * [.replaceItem(itemName, [itemType], [category], [groups], [label], [tags], [giBaseType], [groupFunction])](#items.replaceItem)
    * [.getItem(name, nullIfMissing)](#items.getItem) ⇒ <code>OHItem</code>
    * [.getItemsByTag(...tagNames)](#items.getItemsByTag) ⇒ <code>Array.&lt;OHItem&gt;</code>
    * [.safeItemName(s)](#items.safeItemName) ⇒ <code>String</code>

<a name="items.OHItem"></a>

### items.OHItem
Class representing an openHAB Item

**Kind**: static class of [<code>items</code>](#items)  

* [.OHItem](#items.OHItem)
    * [new OHItem(rawItem)](#new_items.OHItem_new)
    * [.type](#items.OHItem+type) ⇒ <code>String</code>
    * [.name](#items.OHItem+name) ⇒ <code>String</code>
    * [.label](#items.OHItem+label) ⇒ <code>String</code>
    * [.state](#items.OHItem+state) ⇒ <code>String</code>
    * [.rawState](#items.OHItem+rawState) ⇒ <code>HostState</code>
    * [.members](#items.OHItem+members) ⇒ <code>Array.&lt;OHItem&gt;</code>
    * [.descendents](#items.OHItem+descendents) ⇒ <code>Array.&lt;OHItem&gt;</code>
    * [.isUninitialized](#items.OHItem+isUninitialized) ⇒
    * [.tags](#items.OHItem+tags)
    * [.getMetadataValue(namespace)](#items.OHItem+getMetadataValue) ⇒ <code>String</code>
    * [.updateMetadataValue(namespace, value)](#items.OHItem+updateMetadataValue) ⇒ <code>String</code>
    * [.upsertMetadataValue(namespace, value)](#items.OHItem+upsertMetadataValue) ⇒ <code>Boolean</code>
    * [.updateMetadataValues(namespaceToValues)](#items.OHItem+updateMetadataValues)
    * [.sendCommand(value)](#items.OHItem+sendCommand)
    * [.sendCommandIfDifferent(value)](#items.OHItem+sendCommandIfDifferent) ⇒ <code>Boolean</code>
    * [.postUpdate(value)](#items.OHItem+postUpdate)
    * [.addGroups(...groupNamesOrItems)](#items.OHItem+addGroups)
    * [.removeGroups(...groupNamesOrItems)](#items.OHItem+removeGroups)
    * [.addTags(...tagNames)](#items.OHItem+addTags)
    * [.removeTags(...tagNames)](#items.OHItem+removeTags)

<a name="new_items.OHItem_new"></a>

#### new OHItem(rawItem)
Create an OHItem, wrapping a native Java openHAB Item. Don't use this constructor, instead call [getItem](getItem).


| Param | Type | Description |
| --- | --- | --- |
| rawItem | <code>HostItem</code> | Java Item from Host |

<a name="items.OHItem+type"></a>

#### ohItem.type ⇒ <code>String</code>
The type of the item: the Simple (without package) name of the Java item type, such as 'Switch'.

**Kind**: instance property of [<code>OHItem</code>](#items.OHItem)  
**Returns**: <code>String</code> - the type  
<a name="items.OHItem+name"></a>

#### ohItem.name ⇒ <code>String</code>
The name of the item.

**Kind**: instance property of [<code>OHItem</code>](#items.OHItem)  
**Returns**: <code>String</code> - the name  
<a name="items.OHItem+label"></a>

#### ohItem.label ⇒ <code>String</code>
The label attached to the item

**Kind**: instance property of [<code>OHItem</code>](#items.OHItem)  
**Returns**: <code>String</code> - the label  
<a name="items.OHItem+state"></a>

#### ohItem.state ⇒ <code>String</code>
The state of the item, as a string.

**Kind**: instance property of [<code>OHItem</code>](#items.OHItem)  
**Returns**: <code>String</code> - the item's state  
<a name="items.OHItem+rawState"></a>

#### ohItem.rawState ⇒ <code>HostState</code>
The raw state of the item, as a java object.

**Kind**: instance property of [<code>OHItem</code>](#items.OHItem)  
**Returns**: <code>HostState</code> - the item's state  
<a name="items.OHItem+members"></a>

#### ohItem.members ⇒ <code>Array.&lt;OHItem&gt;</code>
Members / children / direct descendents of the current group item (as returned by 'getMembers()'). Must be a group item.

**Kind**: instance property of [<code>OHItem</code>](#items.OHItem)  
**Returns**: <code>Array.&lt;OHItem&gt;</code> - member items  
<a name="items.OHItem+descendents"></a>

#### ohItem.descendents ⇒ <code>Array.&lt;OHItem&gt;</code>
All descendents of the current group item (as returned by 'getAllMembers()'). Must be a group item.

**Kind**: instance property of [<code>OHItem</code>](#items.OHItem)  
**Returns**: <code>Array.&lt;OHItem&gt;</code> - all descendent items  
<a name="items.OHItem+isUninitialized"></a>

#### ohItem.isUninitialized ⇒
Whether this item is initialized.

**Kind**: instance property of [<code>OHItem</code>](#items.OHItem)  
**Returns**: true iff the item has not been initialized  
<a name="items.OHItem+tags"></a>

#### ohItem.tags
Gets the tags from this item

**Kind**: instance property of [<code>OHItem</code>](#items.OHItem)  
<a name="items.OHItem+getMetadataValue"></a>

#### ohItem.getMetadataValue(namespace) ⇒ <code>String</code>
Gets metadata values for this item.

**Kind**: instance method of [<code>OHItem</code>](#items.OHItem)  
**Returns**: <code>String</code> - the metadata associated with this item and namespace  

| Param | Type | Description |
| --- | --- | --- |
| namespace | <code>String</code> | The namespace for the metadata to retreive |

<a name="items.OHItem+updateMetadataValue"></a>

#### ohItem.updateMetadataValue(namespace, value) ⇒ <code>String</code>
Updates metadata values for this item.

**Kind**: instance method of [<code>OHItem</code>](#items.OHItem)  
**Returns**: <code>String</code> - the updated value  

| Param | Type | Description |
| --- | --- | --- |
| namespace | <code>String</code> | The namespace for the metadata to update |
| value | <code>String</code> | the value to update the metadata to |

<a name="items.OHItem+upsertMetadataValue"></a>

#### ohItem.upsertMetadataValue(namespace, value) ⇒ <code>Boolean</code>
Inserts or updates metadata values for this item.

**Kind**: instance method of [<code>OHItem</code>](#items.OHItem)  
**Returns**: <code>Boolean</code> - true iff a new value was inserted  

| Param | Type | Description |
| --- | --- | --- |
| namespace | <code>String</code> | The namespace for the metadata to update |
| value | <code>String</code> | the value to update the metadata to |

<a name="items.OHItem+updateMetadataValues"></a>

#### ohItem.updateMetadataValues(namespaceToValues)
Updates metadata values for this item.

**Kind**: instance method of [<code>OHItem</code>](#items.OHItem)  

| Param | Type | Description |
| --- | --- | --- |
| namespaceToValues | <code>Map</code> | A map of namespaces to values to update |

<a name="items.OHItem+sendCommand"></a>

#### ohItem.sendCommand(value)
Sends a command to the item

**Kind**: instance method of [<code>OHItem</code>](#items.OHItem)  
**See**

- sendCommandIfDifferent
- postUpdate


| Param | Type | Description |
| --- | --- | --- |
| value | <code>String</code> \| <code>HostState</code> | the value of the command to send, such as 'ON' |

<a name="items.OHItem+sendCommandIfDifferent"></a>

#### ohItem.sendCommandIfDifferent(value) ⇒ <code>Boolean</code>
Sends a command to the item, but only if the current state is not what is being sent.
Note

**Kind**: instance method of [<code>OHItem</code>](#items.OHItem)  
**Returns**: <code>Boolean</code> - true if the command was sent, false otherwise  
**See**: sendCommand  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>String</code> \| <code>HostState</code> | the value of the command to send, such as 'ON' |

<a name="items.OHItem+postUpdate"></a>

#### ohItem.postUpdate(value)
Posts an update to the item

**Kind**: instance method of [<code>OHItem</code>](#items.OHItem)  
**See**: sendCommand  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>String</code> \| <code>HostState</code> | the value of the command to send, such as 'ON' |

<a name="items.OHItem+addGroups"></a>

#### ohItem.addGroups(...groupNamesOrItems)
Adds groups to this item

**Kind**: instance method of [<code>OHItem</code>](#items.OHItem)  

| Param | Type | Description |
| --- | --- | --- |
| ...groupNamesOrItems | <code>Array.&lt;(String\|OHItem)&gt;</code> | names of the groups (or the group items themselves) |

<a name="items.OHItem+removeGroups"></a>

#### ohItem.removeGroups(...groupNamesOrItems)
Removes groups from this item

**Kind**: instance method of [<code>OHItem</code>](#items.OHItem)  

| Param | Type | Description |
| --- | --- | --- |
| ...groupNamesOrItems | <code>Array.&lt;(String\|OHItem)&gt;</code> | names of the groups (or the group items themselves) |

<a name="items.OHItem+addTags"></a>

#### ohItem.addTags(...tagNames)
Adds tags to this item

**Kind**: instance method of [<code>OHItem</code>](#items.OHItem)  

| Param | Type | Description |
| --- | --- | --- |
| ...tagNames | <code>Array.&lt;String&gt;</code> | names of the tags to add |

<a name="items.OHItem+removeTags"></a>

#### ohItem.removeTags(...tagNames)
Removes tags from this item

**Kind**: instance method of [<code>OHItem</code>](#items.OHItem)  

| Param | Type | Description |
| --- | --- | --- |
| ...tagNames | <code>Array.&lt;String&gt;</code> | names of the tags to remove |

<a name="items.DYNAMIC_ITEM_TAG"></a>

### items.DYNAMIC\_ITEM\_TAG
Tag value to be attached to all dynamically created items.

**Kind**: static constant of [<code>items</code>](#items)  
<a name="items.createItem"></a>

### items.createItem(itemName, [itemType], [category], [groups], [label], [tags], [giBaseType], [groupFunction], [itemMetadata])
Creates a new item within OpenHab. This item is not registered with any provider.

Note that all items created this way have an additional tag attached, for simpler retrieval later. This tag is
created with the value [DYNAMIC_ITEM_TAG](DYNAMIC_ITEM_TAG).

**Kind**: static method of [<code>items</code>](#items)  

| Param | Type | Description |
| --- | --- | --- |
| itemName | <code>String</code> | Item name for the Item to create |
| [itemType] | <code>String</code> | the type of the Item |
| [category] | <code>String</code> | the category (icon) for the Item |
| [groups] | <code>Array.&lt;String&gt;</code> | an array of groups the Item is a member of |
| [label] | <code>String</code> | the label for the Item |
| [tags] | <code>Array.&lt;String&gt;</code> | an array of tags for the Item |
| [giBaseType] | <code>HostItem</code> | the group Item base type for the Item |
| [groupFunction] | <code>HostGroupFunction</code> | the group function used by the Item |
| [itemMetadata] | <code>Map</code> | a map of metadata to set on the item |

<a name="items.addItem"></a>

### items.addItem(itemName, [itemType], [category], [groups], [label], [tags], [giBaseType], [groupFunction])
Creates a new item within OpenHab. This item will persist regardless of the lifecycle of the script creating it.

Note that all items created this way have an additional tag attached, for simpler retrieval later. This tag is
created with the value [DYNAMIC_ITEM_TAG](DYNAMIC_ITEM_TAG).

**Kind**: static method of [<code>items</code>](#items)  

| Param | Type | Description |
| --- | --- | --- |
| itemName | <code>String</code> | Item name for the Item to create |
| [itemType] | <code>String</code> | the type of the Item |
| [category] | <code>String</code> | the category (icon) for the Item |
| [groups] | <code>Array.&lt;String&gt;</code> | an array of groups the Item is a member of |
| [label] | <code>String</code> | the label for the Item |
| [tags] | <code>Array.&lt;String&gt;</code> | an array of tags for the Item |
| [giBaseType] | <code>HostItem</code> | the group Item base type for the Item |
| [groupFunction] | <code>HostGroupFunction</code> | the group function used by the Item |

<a name="items.removeItem"></a>

### items.removeItem(itemOrItemName) ⇒ <code>Boolean</code>
Removes an item from OpenHab. The item is removed immediately and cannot be recoved.

**Kind**: static method of [<code>items</code>](#items)  
**Returns**: <code>Boolean</code> - true iff the item is actually removed  

| Param | Type | Description |
| --- | --- | --- |
| itemOrItemName | <code>String</code> \| <code>HostItem</code> | the item to remove |

<a name="items.replaceItem"></a>

### items.replaceItem(itemName, [itemType], [category], [groups], [label], [tags], [giBaseType], [groupFunction])
Replaces (upserts) an item. If an item exists with the same name, it will be removed and a new item with
the supplied parameters will be created in it's place. If an item does not exist with this name, a new
item will be created with the supplied parameters.

This function can be useful in scripts which create a static set of items which may need updating either
periodically, during startup or even during development of the script. Using fixed item names will ensure
that the items remain up-to-date, but won't fail with issues related to duplicate items.

**Kind**: static method of [<code>items</code>](#items)  

| Param | Type | Description |
| --- | --- | --- |
| itemName | <code>String</code> | Item name for the Item to create |
| [itemType] | <code>String</code> | the type of the Item |
| [category] | <code>String</code> | the category (icon) for the Item |
| [groups] | <code>Array.&lt;String&gt;</code> | an array of groups the Item is a member of |
| [label] | <code>String</code> | the label for the Item |
| [tags] | <code>Array.&lt;String&gt;</code> | an array of tags for the Item |
| [giBaseType] | <code>HostItem</code> | the group Item base type for the Item |
| [groupFunction] | <code>HostGroupFunction</code> | the group function used by the Item |

<a name="items.getItem"></a>

### items.getItem(name, nullIfMissing) ⇒ <code>OHItem</code>
Gets an openHAB Item.

**Kind**: static method of [<code>items</code>](#items)  
**Returns**: <code>OHItem</code> - the item  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>String</code> |  | the name of the item |
| nullIfMissing | <code>String</code> | <code>false</code> | whether to return null if the item cannot be found (default is to throw an exception) |

<a name="items.getItemsByTag"></a>

### items.getItemsByTag(...tagNames) ⇒ <code>Array.&lt;OHItem&gt;</code>
Gets all openHAB Items with a specific tag.

**Kind**: static method of [<code>items</code>](#items)  
**Returns**: <code>Array.&lt;OHItem&gt;</code> - the items with a tag that is included in the passed tags  

| Param | Type | Description |
| --- | --- | --- |
| ...tagNames | <code>Array.&lt;String&gt;</code> | an array of tags to match against |

<a name="items.safeItemName"></a>

### items.safeItemName(s) ⇒ <code>String</code>
Helper function to ensure an item name is valid. All invalid characters are replaced with an underscore.

**Kind**: static method of [<code>items</code>](#items)  
**Returns**: <code>String</code> - a valid item name  

| Param | Type | Description |
| --- | --- | --- |
| s | <code>String</code> | the name to make value |


## things

### things.newThingBuilder

### things.newChannelBuilder

## metadata

## triggers
### triggers.ChannelEventTrigger
Creates a trigger that fires upon specific events in a channel.

**Kind**: static property of [<code>triggers</code>](#triggers)  

| Param | Type | Description |
| --- | --- | --- |
| channel | <code>String</code> | the name of the channel |
| event | <code>String</code> | the name of the event to listen for |
| [triggerName] | <code>String</code> | the name of the trigger to create |

**Example**  
```js
ChannelEventTrigger('astro:sun:local:rise#event', 'START')
```
<a name="triggers.ItemStateChangeTrigger"></a>

### triggers.ItemStateChangeTrigger
Creates a trigger that fires upon an item changing state.

**Kind**: static property of [<code>triggers</code>](#triggers)  

| Param | Type | Description |
| --- | --- | --- |
| itemName | <code>String</code> | the name of the item to monitor for change |
| [oldState] | <code>String</code> | the previous state of the item |
| [newState] | <code>String</code> | the new state of the item |
| [triggerName] | <code>String</code> | the name of the trigger to create |

**Example**  
```js
ItemStateChangeTrigger('my_item', 'OFF', 'ON')
```
<a name="triggers.ItemStateUpdateTrigger"></a>

### triggers.ItemStateUpdateTrigger
Creates a trigger that fires upon an item receiving a state update. Note that the item does not need to change state.

**Kind**: static property of [<code>triggers</code>](#triggers)  

| Param | Type | Description |
| --- | --- | --- |
| itemName | <code>String</code> | the name of the item to monitor for change |
| [state] | <code>String</code> | the new state of the item |
| [triggerName] | <code>String</code> | the name of the trigger to create |

**Example**  
```js
ItemStateUpdateTrigger('my_item', 'OFF')
```
<a name="triggers.ItemCommandTrigger"></a>

### triggers.ItemCommandTrigger
Creates a trigger that fires upon an item receiving a command. Note that the item does not need to change state.

**Kind**: static property of [<code>triggers</code>](#triggers)  

| Param | Type | Description |
| --- | --- | --- |
| itemName | <code>String</code> | the name of the item to monitor for change |
| [command] | <code>String</code> | the command received |
| [triggerName] | <code>String</code> | the name of the trigger to create |

**Example**  
```js
ItemCommandTrigger('my_item', 'OFF')
```
<a name="triggers.GroupStateChangeTrigger"></a>

### triggers.GroupStateChangeTrigger
Creates a trigger that fires upon a member of a group changing state.

**Kind**: static property of [<code>triggers</code>](#triggers)  

| Param | Type | Description |
| --- | --- | --- |
| groupName | <code>String</code> | the name of the group to monitor for change |
| [oldState] | <code>String</code> | the previous state of the group |
| [newState] | <code>String</code> | the new state of the group |
| [triggerName] | <code>String</code> | the name of the trigger to create |

**Example**  
```js
GroupStateChangeTrigger('my_group', 'OFF', 'ON')
```
<a name="triggers.GroupStateUpdateTrigger"></a>

### triggers.GroupStateUpdateTrigger
Creates a trigger that fires upon a member of a group receiving a state update. Note that group item does not need to change state.

**Kind**: static property of [<code>triggers</code>](#triggers)  

| Param | Type | Description |
| --- | --- | --- |
| groupName | <code>String</code> | the name of the group to monitor for change |
| [state] | <code>String</code> | the new state of the group |
| [triggerName] | <code>String</code> | the name of the trigger to create |

**Example**  
```js
GroupStateUpdateTrigger('my_group', 'OFF')
```
<a name="triggers.GroupCommandTrigger"></a>

### triggers.GroupCommandTrigger
Creates a trigger that fires upon a member of a group receiving a command. Note that the group does not need to change state.

**Kind**: static property of [<code>triggers</code>](#triggers)  

| Param | Type | Description |
| --- | --- | --- |
| groupName | <code>String</code> | the name of the group to monitor for change |
| [command] | <code>String</code> | the command received |
| [triggerName] | <code>String</code> | the name of the trigger to create |

**Example**  
```js
GroupCommandTrigger('my_group', 'OFF')
```
<a name="triggers.ThingStatusUpdateTrigger"></a>

### triggers.ThingStatusUpdateTrigger
Creates a trigger that fires upon an Thing status updating

**Kind**: static property of [<code>triggers</code>](#triggers)  

| Param | Type | Description |
| --- | --- | --- |
| thingUID | <code>String</code> | the name of the thing to monitor for a status updating |
| [status] | <code>String</code> | the optional status to monitor for |
| [triggerName] | <code>String</code> | the name of the trigger to create |

**Example**  
```js
ThingStatusUpdateTrigger('some:thing:uuid','OFFLINE')
```
<a name="triggers.ThingStatusChangeTrigger"></a>

### triggers.ThingStatusChangeTrigger
Creates a trigger that fires upon an Thing status changing

**Kind**: static property of [<code>triggers</code>](#triggers)  

| Param | Type | Description |
| --- | --- | --- |
| thingUID | <code>String</code> | the name of the thing to monitor for a status change |
| [status] | <code>String</code> | the optional status to monitor for |
| [previousStatus] | <code>String</code> | the optional previous state to monitor from |
| [triggerName] | <code>String</code> | the optional name of the trigger to create |

**Example**  
```js
ThingStatusChangeTrigger('some:thing:uuid','ONLINE','OFFLINE')
```
<a name="triggers.SystemStartlevelTrigger"></a>

### triggers.SystemStartlevelTrigger
Creates a trigger that fires if a given start level is reached by the system

**Kind**: static property of [<code>triggers</code>](#triggers)  

| Param | Type | Description |
| --- | --- | --- |
| startlevel | <code>String</code> | the system start level to be triggered on |
| [triggerName] | <code>String</code> | the name of the trigger to create |

**Example**  
```js
SystemStartlevelTrigger(40)  //Rules loaded
...
SystemStartlevelTrigger(50)  //Rule engine started
...
SystemStartlevelTrigger(70)  //User interfaces started
...
SystemStartlevelTrigger(80)  //Things initialized
...
SystemStartlevelTrigger(100) //Startup Complete
```
<a name="triggers.GenericCronTrigger"></a>

### triggers.GenericCronTrigger
Creates a trigger that fires on a cron schedule. The supplied cron expression defines when the trigger will fire.

**Kind**: static property of [<code>triggers</code>](#triggers)  

| Param | Type | Description |
| --- | --- | --- |
| expression | <code>String</code> | the cron expression defining the triggering schedule |

**Example**  
```js
GenericCronTrigger('0 30 16 * * ? *')
```
<a name="triggers.TimeOfDayTrigger"></a>

### triggers.TimeOfDayTrigger
Creates a trigger that fires daily at a specific time. The supplied time defines when the trigger will fire.

**Kind**: static property of [<code>triggers</code>](#triggers)  

| Param | Type | Description |
| --- | --- | --- |
| time | <code>String</code> | the time expression defining the triggering schedule |

**Example**  
```js
TimeOfDayTrigger('19:00')
```

## actions
Actions namespace.
This namespace provides access to openHAB actions. All available actions can be accessed as direct properties of this
object (via their simple class name).

**Example** *(Sends a broadcast notification)*  
```js
let { actions } = require('@openhab/automation');
actions.NotificationAction.sendBroadcastNotification("Hello World!")
```
**Example** *(Sends a PushSafer notification)*  
```js
let { actions } = require('@openhab/automation');
 actions.Pushsafer.pushsafer("<your pushsafer api key>", "<message>", "<message title>", "", "", "", "")
```
## Developer API Docs

[API Documentation](https://openhab.github.io/openhab-js/oh/0.1.1/)