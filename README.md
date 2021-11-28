[![Build
Status](https://api.travis-ci.com/openhab/openhab-js.svg?branch=main)](https://travis-ci.com/openhab/openhab-js)
# openHAB Javascript Library

This library aims to be a fairly high-level ES6 library to support automation in openHAB. It provides convenient access
to common openHAB functionality within rules including items, things, action, logging and more.

This library is included by default in the openHAB [JavaScript
binding](https://www.openhab.org/addons/automation/jsscripting/)

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
- [JSRule API](#jsrule-api)
- [Logging](#logging)
- [API](#api)

## Requirements

- openHAB [JavaScript binding](https://www.openhab.org/addons/automation/jsscripting/)

## Installation
### Default Installation

- Install the openHAB [JavaScript binding](https://www.openhab.org/addons/automation/jsscripting/), a version of this
library will be automatically installed and available to all javascript rules by default.

### Custom Installation

- Ensure you have the correct path created `mkdir -p $OPENHAB_CONF/automation/lib/javascript/personal/node_modules`
- Go to the javascript personal lib directory: `cd $OPENHAB_CONF/automation/lib/javascript/personal/node_modules`
- Run `npm i @openhab/automation` (you may need to install npm)

## Usage
This library provides an easy to use API for common automation activities that interact with items, things, activities
and other openHAB concepts.

### Basic Usage
Using the openHAB UI, first create a new rule and set a trigger condition
![OpenHAB Rule Configuration](/images/rule-config.png)

Then select "Add Action" and then select "ECMAScript". This will bring up a empty script editor where you can enter your
javascript.
![OpenHAB Rule Script](/images/rule-script.png)

This library is automatically imported, so you can directly access items, actions and more in your logic.

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

See [API](#api) for a complete list of functionality

### Advanced Usage

Scripting may be done via the openHAB UI or by creating scripts in $OPENHAB_CONF/automation/jsr223/javascript/personal.

For file based scripts this API provides two ways of writing rules, a fluent [Rule Builder API](#rule-builder-api) and a
declarative syntax using [JSRule](#rulesjsrule).

By default the JS Scripting binding will export objects in the current scope, so no additional importing is necessary.
This behavior can be configured on or off in the binding's configuration options.

The injected import is roughly equivalent to:
```javascript
const {rules, items, things, log, triggers, actions, metadata, osgi} = require('@openhab/automation')
```

## Rule Builder API

The Rule Builder provides a convenient API to write rules in a high-level, readable style using a builder pattern. This
is particularly useful when writing rules using files as opposed to using the UI which provides its own rule creation
interface.

For a declarative style creation of rules, see using [JSRule](#rulesjsrule).

Rules are started by calling `rules.when()` and can chain together [triggers](#rule-builder-triggers),
[conditions](#rule-builder-conditions) and [operations](#rule-builder-operations) in the following pattern:

```javascript
rules.when().triggerType()...if().conditionType().then().operationType()...build(name,description);
```

A simple example of this would look like:

```javascript
rules.when().item("F1_Light").changed().then().send("changed").toItem("F2_Light").build("My Rule", "My First Rule");
```

Operations and conditions can also optionally take functions:

```javascript
rules.when().item("F1_light").changed().then(event => {
console.log(event);
}).build("Test Rule", "My Test Rule");
```
see [Examples](#rule-builder-examples) for further patterns

### Rule Builder Triggers

* `channel(channelName)` Specifies a channel event as a source for the rule to fire.
* `.triggered(event)` Trigger on a specific event name
* `cron(cronExpression)` Specifies a cron schedule for the rule to fire.
* `item(itemName)` Specifies an item as the source of changes to trigger a rule.
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


Additionally all the above triggers have the following functions:
* `.if()` or `.if(fn)` -> a [rule condition](#rule-builder-conditions)
* `.then()` or `.then(fn)` -> a [rule operation](#rule-builder-operations)
* `.or()` -> a [rule trigger](#rule-builder-triggers) (chain additional triggers)

### Rule Builder Conditions

* `stateOfItem(state)`

### Rule Builder Operations

* `build(name, description)`
* `copyAndSendState()`
* `copyState()`
* `inGroup(groupName)`
* `postIt()`
* `postUpdate(state)`
* `send(command)`
* `sendIt()`
* `sendOff()`
* `sendOn()`
* `sendToggle`

### Rule Builder Examples

```javascript
//turn on the kitchen light at SUNSET
rules.when().timeOfDay("SUNSET").then().sendOn().toItem("KitchenLight").build("Sunset Rule","turn on the kitchen light
at SUNSET");

//turn off the kitchen light at 9PM
rules.when().cron("0 0 21 * * ?").then().sendOff().toItem("KitchenLight").build("9PM Rule", "turn off the kitchen light
at 9PM");

//set the colour of the hall light to pink at 9PM
rules.when().cron("0 0 21 * * ?").then().send("300,100,100").toItem("HallLight").build("Pink Rule", "set the colour of
the hall light to pink at 9PM");

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

## JSRule API

JSRules provides a simple, declarative syntax for defining rules
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

See [triggers](#triggers) in the API documentation for a full list of all triggers.

## Logging

By default the JS Scripting binding supports console logging like `console.log()` and `console.debug()` to the openHAB
default log. Additionally scripts may create their own native openHAB logs using the log namespace

```javascript
//this is imported by default, shown here for clarity only
let log = require('@openhab/automation');

let logger = log('my_logger');

//prints "Hello World!"
logger.debug("Hello {}!", "world");
```

# API
## Classes

<dl>
<dt><a href="#RuleBuilder">RuleBuilder</a></dt>
<dd><p>Creates rules in a fluent style.</p>
</dd>
<dt><a href="#TriggerBuilder">TriggerBuilder</a></dt>
<dd><p>Builder for rule Triggers</p>
</dd>
<dt><a href="#ConditionBuilder">ConditionBuilder</a></dt>
<dd><p>Condition that wraps a function to determine whether if passes</p>
</dd>
<dt><a href="#OperationBuilder">OperationBuilder</a></dt>
<dd><p>Operation to execute as part of a rule</p>
</dd>
</dl>

## Objects

<dl>
<dt><a href="#log">log</a> : <code>object</code></dt>
<dd><p>Log namespace.
This namespace provides loggers to log messages to the openHAB Log.</p>
</dd>
<dt><a href="#items">items</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#actions">actions</a> : <code>object</code></dt>
<dd><p>Actions namespace.
This namespace provides access to openHAB actions. All available actions can be accessed as direct properties of this
object (via their simple class name).</p>
</dd>
<dt><a href="#triggers">triggers</a> : <code>object</code></dt>
<dd><p>Triggers namespace.
This namespace allows creation of openHAB rule triggers.</p>
</dd>
<dt><a href="#rules">rules</a> : <code>object</code></dt>
<dd><p>Rules namespace.
This namespace allows creation of openHAB rules.</p>
</dd>
</dl>


<br><a name="RuleBuilder"></a>

## RuleBuilder
> Creates rules in a fluent style.


* [RuleBuilder](#RuleBuilder)
    * [new RuleBuilder(toggleable)](#new_RuleBuilder_new)
    * [.when()](#RuleBuilder+when) ⇒ [<code>TriggerBuilder</code>](#TriggerBuilder)


<br><a name="new_RuleBuilder_new"></a>

### new RuleBuilder(toggleable)

| Param | Type | Description |
| --- | --- | --- |
| toggleable | <code>boolean</code> | if this builder is toggleable |


<br><a name="RuleBuilder+when"></a>

### ruleBuilder.when() ⇒ [<code>TriggerBuilder</code>](#TriggerBuilder)
> Specifies when the rule should occur. Will create a standard rule.

**Returns**: [<code>TriggerBuilder</code>](#TriggerBuilder) - rule builder  

<br><a name="TriggerBuilder"></a>

## TriggerBuilder
> Builder for rule Triggers


* [TriggerBuilder](#TriggerBuilder)
    * _instance_
        * [.channel(channelName)](#TriggerBuilder+channel) ⇒ [<code>ChannelTriggerConfig</code>](#TriggerBuilder.ChannelTriggerConfig)
        * [.cron(cronExpression)](#TriggerBuilder+cron) ⇒ [<code>CronTriggerConfig</code>](#TriggerBuilder.CronTriggerConfig)
        * [.item(itemName)](#TriggerBuilder+item) ⇒ [<code>ItemTriggerConfig</code>](#TriggerBuilder.ItemTriggerConfig)
        * [.memberOf(groupName)](#TriggerBuilder+memberOf) ⇒ [<code>ItemTriggerConfig</code>](#TriggerBuilder.ItemTriggerConfig)
        * [.thing(thingUID)](#TriggerBuilder+thing) ⇒ [<code>ThingTriggerConfig</code>](#TriggerBuilder.ThingTriggerConfig)
        * [.system()](#TriggerBuilder+system) ⇒ [<code>SystemTriggerConfig</code>](#TriggerBuilder.SystemTriggerConfig)
    * _static_
        * [.TriggerConf](#TriggerBuilder.TriggerConf)
            * [.or()](#TriggerBuilder.TriggerConf+or) ⇒ [<code>TriggerBuilder</code>](#TriggerBuilder)
            * [.then(function)](#TriggerBuilder.TriggerConf+then) ⇒ [<code>OperationBuilder</code>](#OperationBuilder)
            * [.if(function)](#TriggerBuilder.TriggerConf+if) ⇒ [<code>ConditionBuilder</code>](#ConditionBuilder)
        * [.ChannelTriggerConfig](#TriggerBuilder.ChannelTriggerConfig) ⇐ [<code>TriggerConf</code>](#TriggerBuilder.TriggerConf)
            * [.to(eventName)](#TriggerBuilder.ChannelTriggerConfig+to) ⇒ [<code>ChannelTriggerConfig</code>](#TriggerBuilder.ChannelTriggerConfig)
            * [.triggered(eventName)](#TriggerBuilder.ChannelTriggerConfig+triggered) ⇒ [<code>ChannelTriggerConfig</code>](#TriggerBuilder.ChannelTriggerConfig)
            * [.or()](#TriggerBuilder.TriggerConf+or) ⇒ [<code>TriggerBuilder</code>](#TriggerBuilder)
            * [.then(function)](#TriggerBuilder.TriggerConf+then) ⇒ [<code>OperationBuilder</code>](#OperationBuilder)
            * [.if(function)](#TriggerBuilder.TriggerConf+if) ⇒ [<code>ConditionBuilder</code>](#ConditionBuilder)
        * [.CronTriggerConfig](#TriggerBuilder.CronTriggerConfig) ⇐ [<code>TriggerConf</code>](#TriggerBuilder.TriggerConf)
            * [.or()](#TriggerBuilder.TriggerConf+or) ⇒ [<code>TriggerBuilder</code>](#TriggerBuilder)
            * [.then(function)](#TriggerBuilder.TriggerConf+then) ⇒ [<code>OperationBuilder</code>](#OperationBuilder)
            * [.if(function)](#TriggerBuilder.TriggerConf+if) ⇒ [<code>ConditionBuilder</code>](#ConditionBuilder)
        * [.ItemTriggerConfig](#TriggerBuilder.ItemTriggerConfig) ⇐ [<code>TriggerConf</code>](#TriggerBuilder.TriggerConf)
            * [.to(value)](#TriggerBuilder.ItemTriggerConfig+to) ⇒ [<code>ItemTriggerConfig</code>](#TriggerBuilder.ItemTriggerConfig)
            * [.from(value)](#TriggerBuilder.ItemTriggerConfig+from) ⇒ [<code>ItemTriggerConfig</code>](#TriggerBuilder.ItemTriggerConfig)
            * [.toOff()](#TriggerBuilder.ItemTriggerConfig+toOff) ⇒ [<code>ItemTriggerConfig</code>](#TriggerBuilder.ItemTriggerConfig)
            * [.toOn()](#TriggerBuilder.ItemTriggerConfig+toOn) ⇒ [<code>ItemTriggerConfig</code>](#TriggerBuilder.ItemTriggerConfig)
            * [.receivedCommand()](#TriggerBuilder.ItemTriggerConfig+receivedCommand) ⇒ [<code>ItemTriggerConfig</code>](#TriggerBuilder.ItemTriggerConfig)
            * [.receivedUpdate()](#TriggerBuilder.ItemTriggerConfig+receivedUpdate) ⇒ [<code>ItemTriggerConfig</code>](#TriggerBuilder.ItemTriggerConfig)
            * [.changed()](#TriggerBuilder.ItemTriggerConfig+changed) ⇒ [<code>ItemTriggerConfig</code>](#TriggerBuilder.ItemTriggerConfig)
            * [.for(timespan)](#TriggerBuilder.ItemTriggerConfig+for) ⇒ [<code>ItemTriggerConfig</code>](#TriggerBuilder.ItemTriggerConfig)
            * [.or()](#TriggerBuilder.TriggerConf+or) ⇒ [<code>TriggerBuilder</code>](#TriggerBuilder)
            * [.then(function)](#TriggerBuilder.TriggerConf+then) ⇒ [<code>OperationBuilder</code>](#OperationBuilder)
            * [.if(function)](#TriggerBuilder.TriggerConf+if) ⇒ [<code>ConditionBuilder</code>](#ConditionBuilder)
        * [.ThingTriggerConfig](#TriggerBuilder.ThingTriggerConfig) ⇐ [<code>TriggerConf</code>](#TriggerBuilder.TriggerConf)
            * [.changed()](#TriggerBuilder.ThingTriggerConfig+changed) ⇒ [<code>ThingTriggerConfig</code>](#TriggerBuilder.ThingTriggerConfig)
            * [.updated()](#TriggerBuilder.ThingTriggerConfig+updated) ⇒ [<code>ThingTriggerConfig</code>](#TriggerBuilder.ThingTriggerConfig)
            * [.from()](#TriggerBuilder.ThingTriggerConfig+from) ⇒ [<code>ThingTriggerConfig</code>](#TriggerBuilder.ThingTriggerConfig)
            * [.to()](#TriggerBuilder.ThingTriggerConfig+to) ⇒ [<code>ThingTriggerConfig</code>](#TriggerBuilder.ThingTriggerConfig)
            * [.or()](#TriggerBuilder.TriggerConf+or) ⇒ [<code>TriggerBuilder</code>](#TriggerBuilder)
            * [.then(function)](#TriggerBuilder.TriggerConf+then) ⇒ [<code>OperationBuilder</code>](#OperationBuilder)
            * [.if(function)](#TriggerBuilder.TriggerConf+if) ⇒ [<code>ConditionBuilder</code>](#ConditionBuilder)
        * [.SystemTriggerConfig](#TriggerBuilder.SystemTriggerConfig) ⇐ [<code>TriggerConf</code>](#TriggerBuilder.TriggerConf)
            * [.rulesLoaded()](#TriggerBuilder.SystemTriggerConfig+rulesLoaded) ⇒ [<code>SystemTriggerConfig</code>](#TriggerBuilder.SystemTriggerConfig)
            * [.ruleEngineStarted()](#TriggerBuilder.SystemTriggerConfig+ruleEngineStarted) ⇒ [<code>SystemTriggerConfig</code>](#TriggerBuilder.SystemTriggerConfig)
            * [.userInterfacesStarted()](#TriggerBuilder.SystemTriggerConfig+userInterfacesStarted) ⇒ [<code>SystemTriggerConfig</code>](#TriggerBuilder.SystemTriggerConfig)
            * [.thingsInitialized()](#TriggerBuilder.SystemTriggerConfig+thingsInitialized) ⇒ [<code>SystemTriggerConfig</code>](#TriggerBuilder.SystemTriggerConfig)
            * [.startupComplete()](#TriggerBuilder.SystemTriggerConfig+startupComplete) ⇒ [<code>SystemTriggerConfig</code>](#TriggerBuilder.SystemTriggerConfig)
            * [.startLevel()](#TriggerBuilder.SystemTriggerConfig+startLevel) ⇒ [<code>SystemTriggerConfig</code>](#TriggerBuilder.SystemTriggerConfig)
            * [.or()](#TriggerBuilder.TriggerConf+or) ⇒ [<code>TriggerBuilder</code>](#TriggerBuilder)
            * [.then(function)](#TriggerBuilder.TriggerConf+then) ⇒ [<code>OperationBuilder</code>](#OperationBuilder)
            * [.if(function)](#TriggerBuilder.TriggerConf+if) ⇒ [<code>ConditionBuilder</code>](#ConditionBuilder)


<br><a name="TriggerBuilder+channel"></a>

### triggerBuilder.channel(channelName) ⇒ [<code>ChannelTriggerConfig</code>](#TriggerBuilder.ChannelTriggerConfig)
> Specifies a channel event as a source for the rule to fire.

**Returns**: [<code>ChannelTriggerConfig</code>](#TriggerBuilder.ChannelTriggerConfig) - the trigger config  

| Param | Type | Description |
| --- | --- | --- |
| channelName | <code>String</code> | the name of the channel |


<br><a name="TriggerBuilder+cron"></a>

### triggerBuilder.cron(cronExpression) ⇒ [<code>CronTriggerConfig</code>](#TriggerBuilder.CronTriggerConfig)
> Specifies a cron schedule for the rule to fire.

**Returns**: [<code>CronTriggerConfig</code>](#TriggerBuilder.CronTriggerConfig) - the trigger config  

| Param | Type | Description |
| --- | --- | --- |
| cronExpression | <code>String</code> | the cron expression |


<br><a name="TriggerBuilder+item"></a>

### triggerBuilder.item(itemName) ⇒ [<code>ItemTriggerConfig</code>](#TriggerBuilder.ItemTriggerConfig)
> Specifies an item as the source of changes to trigger a rule.

**Returns**: [<code>ItemTriggerConfig</code>](#TriggerBuilder.ItemTriggerConfig) - the trigger config  

| Param | Type | Description |
| --- | --- | --- |
| itemName | <code>String</code> | the name of the item |


<br><a name="TriggerBuilder+memberOf"></a>

### triggerBuilder.memberOf(groupName) ⇒ [<code>ItemTriggerConfig</code>](#TriggerBuilder.ItemTriggerConfig)
> Specifies an group member as the source of changes to trigger a rule.

**Returns**: [<code>ItemTriggerConfig</code>](#TriggerBuilder.ItemTriggerConfig) - the trigger config  

| Param | Type | Description |
| --- | --- | --- |
| groupName | <code>String</code> | the name of the group |


<br><a name="TriggerBuilder+thing"></a>

### triggerBuilder.thing(thingUID) ⇒ [<code>ThingTriggerConfig</code>](#TriggerBuilder.ThingTriggerConfig)
> Specifies a Thing status event as a source for the rule to fire.

**Returns**: [<code>ThingTriggerConfig</code>](#TriggerBuilder.ThingTriggerConfig) - the trigger config  

| Param | Type | Description |
| --- | --- | --- |
| thingUID | <code>String</code> | the UID of the Thing |


<br><a name="TriggerBuilder+system"></a>

### triggerBuilder.system() ⇒ [<code>SystemTriggerConfig</code>](#TriggerBuilder.SystemTriggerConfig)
> Specifies a system event as a source for the rule to fire.

**Returns**: [<code>SystemTriggerConfig</code>](#TriggerBuilder.SystemTriggerConfig) - the trigger config  

<br><a name="TriggerBuilder.TriggerConf"></a>

### TriggerBuilder.TriggerConf
> {RuleBuilder} RuleBuilder triggers


* [.TriggerConf](#TriggerBuilder.TriggerConf)
    * [.or()](#TriggerBuilder.TriggerConf+or) ⇒ [<code>TriggerBuilder</code>](#TriggerBuilder)
    * [.then(function)](#TriggerBuilder.TriggerConf+then) ⇒ [<code>OperationBuilder</code>](#OperationBuilder)
    * [.if(function)](#TriggerBuilder.TriggerConf+if) ⇒ [<code>ConditionBuilder</code>](#ConditionBuilder)


<br><a name="TriggerBuilder.TriggerConf+or"></a>

#### triggerConf.or() ⇒ [<code>TriggerBuilder</code>](#TriggerBuilder)
> Add an additional Trigger


<br><a name="TriggerBuilder.TriggerConf+then"></a>

#### triggerConf.then(function) ⇒ [<code>OperationBuilder</code>](#OperationBuilder)
> Move to the rule operations


| Param | Type | Description |
| --- | --- | --- |
| function | <code>\*</code> | the optional function to execute |


<br><a name="TriggerBuilder.TriggerConf+if"></a>

#### triggerConf.if(function) ⇒ [<code>ConditionBuilder</code>](#ConditionBuilder)
> Move to the rule condition


| Param | Type | Description |
| --- | --- | --- |
| function | <code>\*</code> | the optional function to execute |


<br><a name="TriggerBuilder.ChannelTriggerConfig"></a>

### TriggerBuilder.ChannelTriggerConfig ⇐ [<code>TriggerConf</code>](#TriggerBuilder.TriggerConf)
**Extends**: [<code>TriggerConf</code>](#TriggerBuilder.TriggerConf)  

* [.ChannelTriggerConfig](#TriggerBuilder.ChannelTriggerConfig) ⇐ [<code>TriggerConf</code>](#TriggerBuilder.TriggerConf)
    * [.to(eventName)](#TriggerBuilder.ChannelTriggerConfig+to) ⇒ [<code>ChannelTriggerConfig</code>](#TriggerBuilder.ChannelTriggerConfig)
    * [.triggered(eventName)](#TriggerBuilder.ChannelTriggerConfig+triggered) ⇒ [<code>ChannelTriggerConfig</code>](#TriggerBuilder.ChannelTriggerConfig)
    * [.or()](#TriggerBuilder.TriggerConf+or) ⇒ [<code>TriggerBuilder</code>](#TriggerBuilder)
    * [.then(function)](#TriggerBuilder.TriggerConf+then) ⇒ [<code>OperationBuilder</code>](#OperationBuilder)
    * [.if(function)](#TriggerBuilder.TriggerConf+if) ⇒ [<code>ConditionBuilder</code>](#ConditionBuilder)


<br><a name="TriggerBuilder.ChannelTriggerConfig+to"></a>

#### channelTriggerConfig.to(eventName) ⇒ [<code>ChannelTriggerConfig</code>](#TriggerBuilder.ChannelTriggerConfig)
> trigger a specific event name


| Param | Type |
| --- | --- |
| eventName | <code>string</code> | 


<br><a name="TriggerBuilder.ChannelTriggerConfig+triggered"></a>

#### channelTriggerConfig.triggered(eventName) ⇒ [<code>ChannelTriggerConfig</code>](#TriggerBuilder.ChannelTriggerConfig)
> trigger a specific event name


| Param | Type |
| --- | --- |
| eventName | <code>string</code> | 


<br><a name="TriggerBuilder.TriggerConf+or"></a>

#### channelTriggerConfig.or() ⇒ [<code>TriggerBuilder</code>](#TriggerBuilder)
> Add an additional Trigger

**Overrides**: [<code>or</code>](#TriggerBuilder.TriggerConf+or)  

<br><a name="TriggerBuilder.TriggerConf+then"></a>

#### channelTriggerConfig.then(function) ⇒ [<code>OperationBuilder</code>](#OperationBuilder)
> Move to the rule operations

**Overrides**: [<code>then</code>](#TriggerBuilder.TriggerConf+then)  

| Param | Type | Description |
| --- | --- | --- |
| function | <code>\*</code> | the optional function to execute |


<br><a name="TriggerBuilder.TriggerConf+if"></a>

#### channelTriggerConfig.if(function) ⇒ [<code>ConditionBuilder</code>](#ConditionBuilder)
> Move to the rule condition

**Overrides**: [<code>if</code>](#TriggerBuilder.TriggerConf+if)  

| Param | Type | Description |
| --- | --- | --- |
| function | <code>\*</code> | the optional function to execute |


<br><a name="TriggerBuilder.CronTriggerConfig"></a>

### TriggerBuilder.CronTriggerConfig ⇐ [<code>TriggerConf</code>](#TriggerBuilder.TriggerConf)
> Cron based trigger

**Extends**: [<code>TriggerConf</code>](#TriggerBuilder.TriggerConf)  

* [.CronTriggerConfig](#TriggerBuilder.CronTriggerConfig) ⇐ [<code>TriggerConf</code>](#TriggerBuilder.TriggerConf)
    * [.or()](#TriggerBuilder.TriggerConf+or) ⇒ [<code>TriggerBuilder</code>](#TriggerBuilder)
    * [.then(function)](#TriggerBuilder.TriggerConf+then) ⇒ [<code>OperationBuilder</code>](#OperationBuilder)
    * [.if(function)](#TriggerBuilder.TriggerConf+if) ⇒ [<code>ConditionBuilder</code>](#ConditionBuilder)


<br><a name="TriggerBuilder.TriggerConf+or"></a>

#### cronTriggerConfig.or() ⇒ [<code>TriggerBuilder</code>](#TriggerBuilder)
> Add an additional Trigger

**Overrides**: [<code>or</code>](#TriggerBuilder.TriggerConf+or)  

<br><a name="TriggerBuilder.TriggerConf+then"></a>

#### cronTriggerConfig.then(function) ⇒ [<code>OperationBuilder</code>](#OperationBuilder)
> Move to the rule operations

**Overrides**: [<code>then</code>](#TriggerBuilder.TriggerConf+then)  

| Param | Type | Description |
| --- | --- | --- |
| function | <code>\*</code> | the optional function to execute |


<br><a name="TriggerBuilder.TriggerConf+if"></a>

#### cronTriggerConfig.if(function) ⇒ [<code>ConditionBuilder</code>](#ConditionBuilder)
> Move to the rule condition

**Overrides**: [<code>if</code>](#TriggerBuilder.TriggerConf+if)  

| Param | Type | Description |
| --- | --- | --- |
| function | <code>\*</code> | the optional function to execute |


<br><a name="TriggerBuilder.ItemTriggerConfig"></a>

### TriggerBuilder.ItemTriggerConfig ⇐ [<code>TriggerConf</code>](#TriggerBuilder.TriggerConf)
> item based trigger

**Extends**: [<code>TriggerConf</code>](#TriggerBuilder.TriggerConf)  

* [.ItemTriggerConfig](#TriggerBuilder.ItemTriggerConfig) ⇐ [<code>TriggerConf</code>](#TriggerBuilder.TriggerConf)
    * [.to(value)](#TriggerBuilder.ItemTriggerConfig+to) ⇒ [<code>ItemTriggerConfig</code>](#TriggerBuilder.ItemTriggerConfig)
    * [.from(value)](#TriggerBuilder.ItemTriggerConfig+from) ⇒ [<code>ItemTriggerConfig</code>](#TriggerBuilder.ItemTriggerConfig)
    * [.toOff()](#TriggerBuilder.ItemTriggerConfig+toOff) ⇒ [<code>ItemTriggerConfig</code>](#TriggerBuilder.ItemTriggerConfig)
    * [.toOn()](#TriggerBuilder.ItemTriggerConfig+toOn) ⇒ [<code>ItemTriggerConfig</code>](#TriggerBuilder.ItemTriggerConfig)
    * [.receivedCommand()](#TriggerBuilder.ItemTriggerConfig+receivedCommand) ⇒ [<code>ItemTriggerConfig</code>](#TriggerBuilder.ItemTriggerConfig)
    * [.receivedUpdate()](#TriggerBuilder.ItemTriggerConfig+receivedUpdate) ⇒ [<code>ItemTriggerConfig</code>](#TriggerBuilder.ItemTriggerConfig)
    * [.changed()](#TriggerBuilder.ItemTriggerConfig+changed) ⇒ [<code>ItemTriggerConfig</code>](#TriggerBuilder.ItemTriggerConfig)
    * [.for(timespan)](#TriggerBuilder.ItemTriggerConfig+for) ⇒ [<code>ItemTriggerConfig</code>](#TriggerBuilder.ItemTriggerConfig)
    * [.or()](#TriggerBuilder.TriggerConf+or) ⇒ [<code>TriggerBuilder</code>](#TriggerBuilder)
    * [.then(function)](#TriggerBuilder.TriggerConf+then) ⇒ [<code>OperationBuilder</code>](#OperationBuilder)
    * [.if(function)](#TriggerBuilder.TriggerConf+if) ⇒ [<code>ConditionBuilder</code>](#ConditionBuilder)


<br><a name="TriggerBuilder.ItemTriggerConfig+to"></a>

#### itemTriggerConfig.to(value) ⇒ [<code>ItemTriggerConfig</code>](#TriggerBuilder.ItemTriggerConfig)
> Item to


| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | this item should be triggered to |


<br><a name="TriggerBuilder.ItemTriggerConfig+from"></a>

#### itemTriggerConfig.from(value) ⇒ [<code>ItemTriggerConfig</code>](#TriggerBuilder.ItemTriggerConfig)
> Item from


| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | this items should be triggered from |


<br><a name="TriggerBuilder.ItemTriggerConfig+toOff"></a>

#### itemTriggerConfig.toOff() ⇒ [<code>ItemTriggerConfig</code>](#TriggerBuilder.ItemTriggerConfig)
> item changed to OFF


<br><a name="TriggerBuilder.ItemTriggerConfig+toOn"></a>

#### itemTriggerConfig.toOn() ⇒ [<code>ItemTriggerConfig</code>](#TriggerBuilder.ItemTriggerConfig)
> item changed to ON


<br><a name="TriggerBuilder.ItemTriggerConfig+receivedCommand"></a>

#### itemTriggerConfig.receivedCommand() ⇒ [<code>ItemTriggerConfig</code>](#TriggerBuilder.ItemTriggerConfig)
> item recieved command


<br><a name="TriggerBuilder.ItemTriggerConfig+receivedUpdate"></a>

#### itemTriggerConfig.receivedUpdate() ⇒ [<code>ItemTriggerConfig</code>](#TriggerBuilder.ItemTriggerConfig)
> item recieved update


<br><a name="TriggerBuilder.ItemTriggerConfig+changed"></a>

#### itemTriggerConfig.changed() ⇒ [<code>ItemTriggerConfig</code>](#TriggerBuilder.ItemTriggerConfig)
> item changed state


<br><a name="TriggerBuilder.ItemTriggerConfig+for"></a>

#### itemTriggerConfig.for(timespan) ⇒ [<code>ItemTriggerConfig</code>](#TriggerBuilder.ItemTriggerConfig)
> For timespan


| Param | Type |
| --- | --- |
| timespan | <code>\*</code> | 


<br><a name="TriggerBuilder.TriggerConf+or"></a>

#### itemTriggerConfig.or() ⇒ [<code>TriggerBuilder</code>](#TriggerBuilder)
> Add an additional Trigger

**Overrides**: [<code>or</code>](#TriggerBuilder.TriggerConf+or)  

<br><a name="TriggerBuilder.TriggerConf+then"></a>

#### itemTriggerConfig.then(function) ⇒ [<code>OperationBuilder</code>](#OperationBuilder)
> Move to the rule operations

**Overrides**: [<code>then</code>](#TriggerBuilder.TriggerConf+then)  

| Param | Type | Description |
| --- | --- | --- |
| function | <code>\*</code> | the optional function to execute |


<br><a name="TriggerBuilder.TriggerConf+if"></a>

#### itemTriggerConfig.if(function) ⇒ [<code>ConditionBuilder</code>](#ConditionBuilder)
> Move to the rule condition

**Overrides**: [<code>if</code>](#TriggerBuilder.TriggerConf+if)  

| Param | Type | Description |
| --- | --- | --- |
| function | <code>\*</code> | the optional function to execute |


<br><a name="TriggerBuilder.ThingTriggerConfig"></a>

### TriggerBuilder.ThingTriggerConfig ⇐ [<code>TriggerConf</code>](#TriggerBuilder.TriggerConf)
> Thing based trigger

**Extends**: [<code>TriggerConf</code>](#TriggerBuilder.TriggerConf)  

* [.ThingTriggerConfig](#TriggerBuilder.ThingTriggerConfig) ⇐ [<code>TriggerConf</code>](#TriggerBuilder.TriggerConf)
    * [.changed()](#TriggerBuilder.ThingTriggerConfig+changed) ⇒ [<code>ThingTriggerConfig</code>](#TriggerBuilder.ThingTriggerConfig)
    * [.updated()](#TriggerBuilder.ThingTriggerConfig+updated) ⇒ [<code>ThingTriggerConfig</code>](#TriggerBuilder.ThingTriggerConfig)
    * [.from()](#TriggerBuilder.ThingTriggerConfig+from) ⇒ [<code>ThingTriggerConfig</code>](#TriggerBuilder.ThingTriggerConfig)
    * [.to()](#TriggerBuilder.ThingTriggerConfig+to) ⇒ [<code>ThingTriggerConfig</code>](#TriggerBuilder.ThingTriggerConfig)
    * [.or()](#TriggerBuilder.TriggerConf+or) ⇒ [<code>TriggerBuilder</code>](#TriggerBuilder)
    * [.then(function)](#TriggerBuilder.TriggerConf+then) ⇒ [<code>OperationBuilder</code>](#OperationBuilder)
    * [.if(function)](#TriggerBuilder.TriggerConf+if) ⇒ [<code>ConditionBuilder</code>](#ConditionBuilder)


<br><a name="TriggerBuilder.ThingTriggerConfig+changed"></a>

#### thingTriggerConfig.changed() ⇒ [<code>ThingTriggerConfig</code>](#TriggerBuilder.ThingTriggerConfig)
> thing changed


<br><a name="TriggerBuilder.ThingTriggerConfig+updated"></a>

#### thingTriggerConfig.updated() ⇒ [<code>ThingTriggerConfig</code>](#TriggerBuilder.ThingTriggerConfig)
> thing updates


<br><a name="TriggerBuilder.ThingTriggerConfig+from"></a>

#### thingTriggerConfig.from() ⇒ [<code>ThingTriggerConfig</code>](#TriggerBuilder.ThingTriggerConfig)
> thing status changed from


<br><a name="TriggerBuilder.ThingTriggerConfig+to"></a>

#### thingTriggerConfig.to() ⇒ [<code>ThingTriggerConfig</code>](#TriggerBuilder.ThingTriggerConfig)
> thing status changed to


<br><a name="TriggerBuilder.TriggerConf+or"></a>

#### thingTriggerConfig.or() ⇒ [<code>TriggerBuilder</code>](#TriggerBuilder)
> Add an additional Trigger

**Overrides**: [<code>or</code>](#TriggerBuilder.TriggerConf+or)  

<br><a name="TriggerBuilder.TriggerConf+then"></a>

#### thingTriggerConfig.then(function) ⇒ [<code>OperationBuilder</code>](#OperationBuilder)
> Move to the rule operations

**Overrides**: [<code>then</code>](#TriggerBuilder.TriggerConf+then)  

| Param | Type | Description |
| --- | --- | --- |
| function | <code>\*</code> | the optional function to execute |


<br><a name="TriggerBuilder.TriggerConf+if"></a>

#### thingTriggerConfig.if(function) ⇒ [<code>ConditionBuilder</code>](#ConditionBuilder)
> Move to the rule condition

**Overrides**: [<code>if</code>](#TriggerBuilder.TriggerConf+if)  

| Param | Type | Description |
| --- | --- | --- |
| function | <code>\*</code> | the optional function to execute |


<br><a name="TriggerBuilder.SystemTriggerConfig"></a>

### TriggerBuilder.SystemTriggerConfig ⇐ [<code>TriggerConf</code>](#TriggerBuilder.TriggerConf)
> System based trigger

**Extends**: [<code>TriggerConf</code>](#TriggerBuilder.TriggerConf)  

* [.SystemTriggerConfig](#TriggerBuilder.SystemTriggerConfig) ⇐ [<code>TriggerConf</code>](#TriggerBuilder.TriggerConf)
    * [.rulesLoaded()](#TriggerBuilder.SystemTriggerConfig+rulesLoaded) ⇒ [<code>SystemTriggerConfig</code>](#TriggerBuilder.SystemTriggerConfig)
    * [.ruleEngineStarted()](#TriggerBuilder.SystemTriggerConfig+ruleEngineStarted) ⇒ [<code>SystemTriggerConfig</code>](#TriggerBuilder.SystemTriggerConfig)
    * [.userInterfacesStarted()](#TriggerBuilder.SystemTriggerConfig+userInterfacesStarted) ⇒ [<code>SystemTriggerConfig</code>](#TriggerBuilder.SystemTriggerConfig)
    * [.thingsInitialized()](#TriggerBuilder.SystemTriggerConfig+thingsInitialized) ⇒ [<code>SystemTriggerConfig</code>](#TriggerBuilder.SystemTriggerConfig)
    * [.startupComplete()](#TriggerBuilder.SystemTriggerConfig+startupComplete) ⇒ [<code>SystemTriggerConfig</code>](#TriggerBuilder.SystemTriggerConfig)
    * [.startLevel()](#TriggerBuilder.SystemTriggerConfig+startLevel) ⇒ [<code>SystemTriggerConfig</code>](#TriggerBuilder.SystemTriggerConfig)
    * [.or()](#TriggerBuilder.TriggerConf+or) ⇒ [<code>TriggerBuilder</code>](#TriggerBuilder)
    * [.then(function)](#TriggerBuilder.TriggerConf+then) ⇒ [<code>OperationBuilder</code>](#OperationBuilder)
    * [.if(function)](#TriggerBuilder.TriggerConf+if) ⇒ [<code>ConditionBuilder</code>](#ConditionBuilder)


<br><a name="TriggerBuilder.SystemTriggerConfig+rulesLoaded"></a>

#### systemTriggerConfig.rulesLoaded() ⇒ [<code>SystemTriggerConfig</code>](#TriggerBuilder.SystemTriggerConfig)
> System trigger


<br><a name="TriggerBuilder.SystemTriggerConfig+ruleEngineStarted"></a>

#### systemTriggerConfig.ruleEngineStarted() ⇒ [<code>SystemTriggerConfig</code>](#TriggerBuilder.SystemTriggerConfig)
> System trigger


<br><a name="TriggerBuilder.SystemTriggerConfig+userInterfacesStarted"></a>

#### systemTriggerConfig.userInterfacesStarted() ⇒ [<code>SystemTriggerConfig</code>](#TriggerBuilder.SystemTriggerConfig)
> System trigger


<br><a name="TriggerBuilder.SystemTriggerConfig+thingsInitialized"></a>

#### systemTriggerConfig.thingsInitialized() ⇒ [<code>SystemTriggerConfig</code>](#TriggerBuilder.SystemTriggerConfig)
> System trigger


<br><a name="TriggerBuilder.SystemTriggerConfig+startupComplete"></a>

#### systemTriggerConfig.startupComplete() ⇒ [<code>SystemTriggerConfig</code>](#TriggerBuilder.SystemTriggerConfig)
> System trigger


<br><a name="TriggerBuilder.SystemTriggerConfig+startLevel"></a>

#### systemTriggerConfig.startLevel() ⇒ [<code>SystemTriggerConfig</code>](#TriggerBuilder.SystemTriggerConfig)
> System trigger


<br><a name="TriggerBuilder.TriggerConf+or"></a>

#### systemTriggerConfig.or() ⇒ [<code>TriggerBuilder</code>](#TriggerBuilder)
> Add an additional Trigger

**Overrides**: [<code>or</code>](#TriggerBuilder.TriggerConf+or)  

<br><a name="TriggerBuilder.TriggerConf+then"></a>

#### systemTriggerConfig.then(function) ⇒ [<code>OperationBuilder</code>](#OperationBuilder)
> Move to the rule operations

**Overrides**: [<code>then</code>](#TriggerBuilder.TriggerConf+then)  

| Param | Type | Description |
| --- | --- | --- |
| function | <code>\*</code> | the optional function to execute |


<br><a name="TriggerBuilder.TriggerConf+if"></a>

#### systemTriggerConfig.if(function) ⇒ [<code>ConditionBuilder</code>](#ConditionBuilder)
> Move to the rule condition

**Overrides**: [<code>if</code>](#TriggerBuilder.TriggerConf+if)  

| Param | Type | Description |
| --- | --- | --- |
| function | <code>\*</code> | the optional function to execute |


<br><a name="ConditionBuilder"></a>

## ConditionBuilder
> Condition that wraps a function to determine whether if passes


* [ConditionBuilder](#ConditionBuilder)
    * _instance_
        * [.then(function)](#ConditionBuilder+then) ⇒ [<code>OperationBuilder</code>](#OperationBuilder)
        * [.stateOfItem(itemName)](#ConditionBuilder+stateOfItem) ⇒ <code>ItemStateConditionConf</code>
    * _static_
        * [.ConditionConf](#ConditionBuilder.ConditionConf)
            * [.then(function)](#ConditionBuilder.ConditionConf+then) ⇒
        * [.FunctionConditionConf](#ConditionBuilder.FunctionConditionConf) ⇐ [<code>ConditionConf</code>](#ConditionBuilder.ConditionConf)
            * [new FunctionConditionConf(fn)](#new_ConditionBuilder.FunctionConditionConf_new)
            * [.then(function)](#ConditionBuilder.ConditionConf+then) ⇒
        * [.ItemStateConditionConf](#ConditionBuilder.ItemStateConditionConf) ⇐ [<code>ConditionConf</code>](#ConditionBuilder.ConditionConf)
            * [.is(value)](#ConditionBuilder.ItemStateConditionConf+is) ⇒ <code>this</code>
            * [.in(...values)](#ConditionBuilder.ItemStateConditionConf+in) ⇒ <code>this</code>
            * [.then(function)](#ConditionBuilder.ConditionConf+then) ⇒


<br><a name="ConditionBuilder+then"></a>

### conditionBuilder.then(function) ⇒ [<code>OperationBuilder</code>](#OperationBuilder)
> Move to the rule operations


| Param | Type | Description |
| --- | --- | --- |
| function | <code>\*</code> | the optional function to execute |


<br><a name="ConditionBuilder+stateOfItem"></a>

### conditionBuilder.stateOfItem(itemName) ⇒ <code>ItemStateConditionConf</code>
> Condition of an item in determining whether to process rule.

**Returns**: <code>ItemStateConditionConf</code> - the operation config  

| Param | Type | Description |
| --- | --- | --- |
| itemName | <code>String</code> | the name of the item to assess the state |


<br><a name="ConditionBuilder.ConditionConf"></a>

### ConditionBuilder.ConditionConf
> {RuleBuilder} RuleBuilder conditions


<br><a name="ConditionBuilder.ConditionConf+then"></a>

#### conditionConf.then(function) ⇒
**Returns**: ConditionBuilder  

| Param | Type | Description |
| --- | --- | --- |
| function | <code>\*</code> | an optional function |


<br><a name="ConditionBuilder.FunctionConditionConf"></a>

### ConditionBuilder.FunctionConditionConf ⇐ [<code>ConditionConf</code>](#ConditionBuilder.ConditionConf)
> Condition that wraps a function to determine whether if passes

**Extends**: [<code>ConditionConf</code>](#ConditionBuilder.ConditionConf)  

* [.FunctionConditionConf](#ConditionBuilder.FunctionConditionConf) ⇐ [<code>ConditionConf</code>](#ConditionBuilder.ConditionConf)
    * [new FunctionConditionConf(fn)](#new_ConditionBuilder.FunctionConditionConf_new)
    * [.then(function)](#ConditionBuilder.ConditionConf+then) ⇒


<br><a name="new_ConditionBuilder.FunctionConditionConf_new"></a>

#### new FunctionConditionConf(fn)
> Creates a new function condition. Don't call directly.


| Param | Type | Description |
| --- | --- | --- |
| fn | <code>\*</code> | callback which determines whether the condition passes |


<br><a name="ConditionBuilder.ConditionConf+then"></a>

#### functionConditionConf.then(function) ⇒
**Overrides**: [<code>then</code>](#ConditionBuilder.ConditionConf+then)  
**Returns**: ConditionBuilder  

| Param | Type | Description |
| --- | --- | --- |
| function | <code>\*</code> | an optional function |


<br><a name="ConditionBuilder.ItemStateConditionConf"></a>

### ConditionBuilder.ItemStateConditionConf ⇐ [<code>ConditionConf</code>](#ConditionBuilder.ConditionConf)
> Condition that wraps a function to determine whether if passes

**Extends**: [<code>ConditionConf</code>](#ConditionBuilder.ConditionConf)  

* [.ItemStateConditionConf](#ConditionBuilder.ItemStateConditionConf) ⇐ [<code>ConditionConf</code>](#ConditionBuilder.ConditionConf)
    * [.is(value)](#ConditionBuilder.ItemStateConditionConf+is) ⇒ <code>this</code>
    * [.in(...values)](#ConditionBuilder.ItemStateConditionConf+in) ⇒ <code>this</code>
    * [.then(function)](#ConditionBuilder.ConditionConf+then) ⇒


<br><a name="ConditionBuilder.ItemStateConditionConf+is"></a>

#### itemStateConditionConf.is(value) ⇒ <code>this</code>
> Checks if item state is equal to vlaue


| Param | Type |
| --- | --- |
| value | <code>\*</code> | 


<br><a name="ConditionBuilder.ItemStateConditionConf+in"></a>

#### itemStateConditionConf.in(...values) ⇒ <code>this</code>
> Checks if item state matches any array of values


| Param | Type |
| --- | --- |
| ...values | <code>any</code> | 


<br><a name="ConditionBuilder.ConditionConf+then"></a>

#### itemStateConditionConf.then(function) ⇒
**Overrides**: [<code>then</code>](#ConditionBuilder.ConditionConf+then)  
**Returns**: ConditionBuilder  

| Param | Type | Description |
| --- | --- | --- |
| function | <code>\*</code> | an optional function |


<br><a name="OperationBuilder"></a>

## OperationBuilder
> Operation to execute as part of a rule


* [OperationBuilder](#OperationBuilder)
    * _instance_
        * [.build(name, description)](#OperationBuilder+build)
        * [.inGroup(group)](#OperationBuilder+inGroup) ⇒ [<code>OperationBuilder</code>](#OperationBuilder)
        * [.send(command)](#OperationBuilder+send) ⇒ [<code>SendCommandOrUpdateOperation</code>](#OperationBuilder.SendCommandOrUpdateOperation)
        * [.postUpdate(update)](#OperationBuilder+postUpdate) ⇒ [<code>SendCommandOrUpdateOperation</code>](#OperationBuilder.SendCommandOrUpdateOperation)
        * [.sendOn()](#OperationBuilder+sendOn) ⇒ [<code>SendCommandOrUpdateOperation</code>](#OperationBuilder.SendCommandOrUpdateOperation)
        * [.sendOff()](#OperationBuilder+sendOff) ⇒ [<code>SendCommandOrUpdateOperation</code>](#OperationBuilder.SendCommandOrUpdateOperation)
        * [.sendToggle()](#OperationBuilder+sendToggle) ⇒ [<code>ToggleOperation</code>](#OperationBuilder.ToggleOperation)
        * [.sendIt()](#OperationBuilder+sendIt) ⇒ [<code>SendCommandOrUpdateOperation</code>](#OperationBuilder.SendCommandOrUpdateOperation)
        * [.postIt()](#OperationBuilder+postIt) ⇒ [<code>SendCommandOrUpdateOperation</code>](#OperationBuilder.SendCommandOrUpdateOperation)
        * [.copyState()](#OperationBuilder+copyState) ⇒ [<code>CopyStateOperation</code>](#OperationBuilder.CopyStateOperation)
        * [.copyAndSendState()](#OperationBuilder+copyAndSendState) ⇒ [<code>CopyStateOperation</code>](#OperationBuilder.CopyStateOperation)
    * _static_
        * [.OperationConfig](#OperationBuilder.OperationConfig)
            * [.inGroup(group)](#OperationBuilder.OperationConfig+inGroup) ⇒ [<code>OperationBuilder</code>](#OperationBuilder)
            * [.build(name, description)](#OperationBuilder.OperationConfig+build)
        * [.CopyStateOperation](#OperationBuilder.CopyStateOperation) ⇐ [<code>OperationConfig</code>](#OperationBuilder.OperationConfig)
            * [new CopyStateOperation(send)](#new_OperationBuilder.CopyStateOperation_new)
            * [.fromItem(item_name)](#OperationBuilder.CopyStateOperation+fromItem) ⇒ [<code>CopyStateOperation</code>](#OperationBuilder.CopyStateOperation)
            * [.toItem(item_name)](#OperationBuilder.CopyStateOperation+toItem) ⇒ [<code>CopyStateOperation</code>](#OperationBuilder.CopyStateOperation)
            * [.and()](#OperationBuilder.CopyStateOperation+and) ⇒ [<code>CopyStateOperation</code>](#OperationBuilder.CopyStateOperation)
            * [.inGroup(group)](#OperationBuilder.OperationConfig+inGroup) ⇒ [<code>OperationBuilder</code>](#OperationBuilder)
            * [.build(name, description)](#OperationBuilder.OperationConfig+build)
        * [.SendCommandOrUpdateOperation](#OperationBuilder.SendCommandOrUpdateOperation) ⇐ [<code>OperationConfig</code>](#OperationBuilder.OperationConfig)
            * [.toItems(itemsOrNames)](#OperationBuilder.SendCommandOrUpdateOperation+toItems) ⇒ [<code>SendCommandOrUpdateOperation</code>](#OperationBuilder.SendCommandOrUpdateOperation)
            * [.toItem(itemOrName)](#OperationBuilder.SendCommandOrUpdateOperation+toItem) ⇒ [<code>SendCommandOrUpdateOperation</code>](#OperationBuilder.SendCommandOrUpdateOperation)
            * [.and(next)](#OperationBuilder.SendCommandOrUpdateOperation+and) ⇒ [<code>SendCommandOrUpdateOperation</code>](#OperationBuilder.SendCommandOrUpdateOperation)
            * [.inGroup(group)](#OperationBuilder.OperationConfig+inGroup) ⇒ [<code>OperationBuilder</code>](#OperationBuilder)
            * [.build(name, description)](#OperationBuilder.OperationConfig+build)
        * [.ToggleOperation](#OperationBuilder.ToggleOperation) ⇐ [<code>OperationConfig</code>](#OperationBuilder.OperationConfig)
            * [.doToggle()](#OperationBuilder.ToggleOperation+doToggle) ⇒ [<code>SendCommandOrUpdateOperation</code>](#OperationBuilder.SendCommandOrUpdateOperation)
            * [.inGroup(group)](#OperationBuilder.OperationConfig+inGroup) ⇒ [<code>OperationBuilder</code>](#OperationBuilder)
            * [.build(name, description)](#OperationBuilder.OperationConfig+build)
        * [.TimingItemStateOperation](#OperationBuilder.TimingItemStateOperation) ⇐ [<code>OperationConfig</code>](#OperationBuilder.OperationConfig)
            * [.inGroup(group)](#OperationBuilder.OperationConfig+inGroup) ⇒ [<code>OperationBuilder</code>](#OperationBuilder)
            * [.build(name, description)](#OperationBuilder.OperationConfig+build)


<br><a name="OperationBuilder+build"></a>

### operationBuilder.build(name, description)
> Build this rule


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | of the rules |
| description | <code>string</code> | of the rule |


<br><a name="OperationBuilder+inGroup"></a>

### operationBuilder.inGroup(group) ⇒ [<code>OperationBuilder</code>](#OperationBuilder)
> Specify the rule group for this rule

**Returns**: [<code>OperationBuilder</code>](#OperationBuilder) - this  

| Param | Type | Description |
| --- | --- | --- |
| group | <code>string</code> | the group this rule belongs to. |


<br><a name="OperationBuilder+send"></a>

### operationBuilder.send(command) ⇒ [<code>SendCommandOrUpdateOperation</code>](#OperationBuilder.SendCommandOrUpdateOperation)
> Specifies that a command should be sent as a result of this rule firing.

**Returns**: [<code>SendCommandOrUpdateOperation</code>](#OperationBuilder.SendCommandOrUpdateOperation) - the operation  

| Param | Type | Description |
| --- | --- | --- |
| command | <code>String</code> | the command to send |


<br><a name="OperationBuilder+postUpdate"></a>

### operationBuilder.postUpdate(update) ⇒ [<code>SendCommandOrUpdateOperation</code>](#OperationBuilder.SendCommandOrUpdateOperation)
> Specifies that an update should be posted as a result of this rule firing.

**Returns**: [<code>SendCommandOrUpdateOperation</code>](#OperationBuilder.SendCommandOrUpdateOperation) - the operation  

| Param | Type | Description |
| --- | --- | --- |
| update | <code>String</code> | the update to send |


<br><a name="OperationBuilder+sendOn"></a>

### operationBuilder.sendOn() ⇒ [<code>SendCommandOrUpdateOperation</code>](#OperationBuilder.SendCommandOrUpdateOperation)
> Specifies the a command 'ON' should be sent as a result of this rule firing.

**Returns**: [<code>SendCommandOrUpdateOperation</code>](#OperationBuilder.SendCommandOrUpdateOperation) - the operation  

<br><a name="OperationBuilder+sendOff"></a>

### operationBuilder.sendOff() ⇒ [<code>SendCommandOrUpdateOperation</code>](#OperationBuilder.SendCommandOrUpdateOperation)
> Specifies the a command 'OFF' should be sent as a result of this rule firing.

**Returns**: [<code>SendCommandOrUpdateOperation</code>](#OperationBuilder.SendCommandOrUpdateOperation) - the operation  

<br><a name="OperationBuilder+sendToggle"></a>

### operationBuilder.sendToggle() ⇒ [<code>ToggleOperation</code>](#OperationBuilder.ToggleOperation)
> Specifies a command should be sent to toggle the state of the target object
> as a result of this rule firing.

**Returns**: [<code>ToggleOperation</code>](#OperationBuilder.ToggleOperation) - the operation  

<br><a name="OperationBuilder+sendIt"></a>

### operationBuilder.sendIt() ⇒ [<code>SendCommandOrUpdateOperation</code>](#OperationBuilder.SendCommandOrUpdateOperation)
> Specifies a command should be forwarded to the state of the target object
> as a result of this rule firing. This relies on the trigger being the result
> of a command itself.

**Returns**: [<code>SendCommandOrUpdateOperation</code>](#OperationBuilder.SendCommandOrUpdateOperation) - the operation  

<br><a name="OperationBuilder+postIt"></a>

### operationBuilder.postIt() ⇒ [<code>SendCommandOrUpdateOperation</code>](#OperationBuilder.SendCommandOrUpdateOperation)
> Specifies a command state should be posted to the target object
> as a result of this rule firing. This relies on the trigger being the result
> of a command itself.

**Returns**: [<code>SendCommandOrUpdateOperation</code>](#OperationBuilder.SendCommandOrUpdateOperation) - the operation  

<br><a name="OperationBuilder+copyState"></a>

### operationBuilder.copyState() ⇒ [<code>CopyStateOperation</code>](#OperationBuilder.CopyStateOperation)
> Copies the state from one item to another. Can be used to proxy item state. State is updated, not
> sent as a command.

**Returns**: [<code>CopyStateOperation</code>](#OperationBuilder.CopyStateOperation) - the operation config  

<br><a name="OperationBuilder+copyAndSendState"></a>

### operationBuilder.copyAndSendState() ⇒ [<code>CopyStateOperation</code>](#OperationBuilder.CopyStateOperation)
> Sends the state from one item to another. Can be used to proxy item state. State is
> sent as a command.

**Returns**: [<code>CopyStateOperation</code>](#OperationBuilder.CopyStateOperation) - the operation config  

<br><a name="OperationBuilder.OperationConfig"></a>

### OperationBuilder.OperationConfig
> {RuleBuilder} RuleBuilder triggers


* [.OperationConfig](#OperationBuilder.OperationConfig)
    * [.inGroup(group)](#OperationBuilder.OperationConfig+inGroup) ⇒ [<code>OperationBuilder</code>](#OperationBuilder)
    * [.build(name, description)](#OperationBuilder.OperationConfig+build)


<br><a name="OperationBuilder.OperationConfig+inGroup"></a>

#### operationConfig.inGroup(group) ⇒ [<code>OperationBuilder</code>](#OperationBuilder)
> Specify the rule group for this rule

**Returns**: [<code>OperationBuilder</code>](#OperationBuilder) - this  

| Param | Type | Description |
| --- | --- | --- |
| group | <code>string</code> | the group this rule belongs to. |


<br><a name="OperationBuilder.OperationConfig+build"></a>

#### operationConfig.build(name, description)
> Build this rule


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | of the rules |
| description | <code>string</code> | of the rule |


<br><a name="OperationBuilder.CopyStateOperation"></a>

### OperationBuilder.CopyStateOperation ⇐ [<code>OperationConfig</code>](#OperationBuilder.OperationConfig)
> Copies state from one item to another item

**Extends**: [<code>OperationConfig</code>](#OperationBuilder.OperationConfig)  

* [.CopyStateOperation](#OperationBuilder.CopyStateOperation) ⇐ [<code>OperationConfig</code>](#OperationBuilder.OperationConfig)
    * [new CopyStateOperation(send)](#new_OperationBuilder.CopyStateOperation_new)
    * [.fromItem(item_name)](#OperationBuilder.CopyStateOperation+fromItem) ⇒ [<code>CopyStateOperation</code>](#OperationBuilder.CopyStateOperation)
    * [.toItem(item_name)](#OperationBuilder.CopyStateOperation+toItem) ⇒ [<code>CopyStateOperation</code>](#OperationBuilder.CopyStateOperation)
    * [.and()](#OperationBuilder.CopyStateOperation+and) ⇒ [<code>CopyStateOperation</code>](#OperationBuilder.CopyStateOperation)
    * [.inGroup(group)](#OperationBuilder.OperationConfig+inGroup) ⇒ [<code>OperationBuilder</code>](#OperationBuilder)
    * [.build(name, description)](#OperationBuilder.OperationConfig+build)


<br><a name="new_OperationBuilder.CopyStateOperation_new"></a>

#### new CopyStateOperation(send)
> Creates a new operation. Don't use constructor directly.


| Param | Type | Description |
| --- | --- | --- |
| send | <code>Boolean</code> | whether to send (or post update) the state |


<br><a name="OperationBuilder.CopyStateOperation+fromItem"></a>

#### copyStateOperation.fromItem(item_name) ⇒ [<code>CopyStateOperation</code>](#OperationBuilder.CopyStateOperation)
> Sets the item to copy the state from

**Returns**: [<code>CopyStateOperation</code>](#OperationBuilder.CopyStateOperation) - this  

| Param | Type | Description |
| --- | --- | --- |
| item_name | <code>String</code> | the item to copy state from |


<br><a name="OperationBuilder.CopyStateOperation+toItem"></a>

#### copyStateOperation.toItem(item_name) ⇒ [<code>CopyStateOperation</code>](#OperationBuilder.CopyStateOperation)
> Sets the item to copy the state to

**Returns**: [<code>CopyStateOperation</code>](#OperationBuilder.CopyStateOperation) - this  

| Param | Type | Description |
| --- | --- | --- |
| item_name | <code>String</code> | the item to copy state to |


<br><a name="OperationBuilder.CopyStateOperation+and"></a>

#### copyStateOperation.and() ⇒ [<code>CopyStateOperation</code>](#OperationBuilder.CopyStateOperation)
> Appends another operation to execute when the rule fires

**Returns**: [<code>CopyStateOperation</code>](#OperationBuilder.CopyStateOperation) - this  

<br><a name="OperationBuilder.OperationConfig+inGroup"></a>

#### copyStateOperation.inGroup(group) ⇒ [<code>OperationBuilder</code>](#OperationBuilder)
> Specify the rule group for this rule

**Overrides**: [<code>inGroup</code>](#OperationBuilder.OperationConfig+inGroup)  
**Returns**: [<code>OperationBuilder</code>](#OperationBuilder) - this  

| Param | Type | Description |
| --- | --- | --- |
| group | <code>string</code> | the group this rule belongs to. |


<br><a name="OperationBuilder.OperationConfig+build"></a>

#### copyStateOperation.build(name, description)
> Build this rule

**Overrides**: [<code>build</code>](#OperationBuilder.OperationConfig+build)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | of the rules |
| description | <code>string</code> | of the rule |


<br><a name="OperationBuilder.SendCommandOrUpdateOperation"></a>

### OperationBuilder.SendCommandOrUpdateOperation ⇐ [<code>OperationConfig</code>](#OperationBuilder.OperationConfig)
> Sends a command or update to an item

**Extends**: [<code>OperationConfig</code>](#OperationBuilder.OperationConfig)  

* [.SendCommandOrUpdateOperation](#OperationBuilder.SendCommandOrUpdateOperation) ⇐ [<code>OperationConfig</code>](#OperationBuilder.OperationConfig)
    * [.toItems(itemsOrNames)](#OperationBuilder.SendCommandOrUpdateOperation+toItems) ⇒ [<code>SendCommandOrUpdateOperation</code>](#OperationBuilder.SendCommandOrUpdateOperation)
    * [.toItem(itemOrName)](#OperationBuilder.SendCommandOrUpdateOperation+toItem) ⇒ [<code>SendCommandOrUpdateOperation</code>](#OperationBuilder.SendCommandOrUpdateOperation)
    * [.and(next)](#OperationBuilder.SendCommandOrUpdateOperation+and) ⇒ [<code>SendCommandOrUpdateOperation</code>](#OperationBuilder.SendCommandOrUpdateOperation)
    * [.inGroup(group)](#OperationBuilder.OperationConfig+inGroup) ⇒ [<code>OperationBuilder</code>](#OperationBuilder)
    * [.build(name, description)](#OperationBuilder.OperationConfig+build)


<br><a name="OperationBuilder.SendCommandOrUpdateOperation+toItems"></a>

#### sendCommandOrUpdateOperation.toItems(itemsOrNames) ⇒ [<code>SendCommandOrUpdateOperation</code>](#OperationBuilder.SendCommandOrUpdateOperation)
> Send command to multiple items

**Returns**: [<code>SendCommandOrUpdateOperation</code>](#OperationBuilder.SendCommandOrUpdateOperation) - this  

| Param | Type | Description |
| --- | --- | --- |
| itemsOrNames | <code>\*</code> | the items to send a command to |


<br><a name="OperationBuilder.SendCommandOrUpdateOperation+toItem"></a>

#### sendCommandOrUpdateOperation.toItem(itemOrName) ⇒ [<code>SendCommandOrUpdateOperation</code>](#OperationBuilder.SendCommandOrUpdateOperation)
> Send command to an item

**Returns**: [<code>SendCommandOrUpdateOperation</code>](#OperationBuilder.SendCommandOrUpdateOperation) - this  

| Param | Type | Description |
| --- | --- | --- |
| itemOrName | <code>\*</code> | the item to send a command to |


<br><a name="OperationBuilder.SendCommandOrUpdateOperation+and"></a>

#### sendCommandOrUpdateOperation.and(next) ⇒ [<code>SendCommandOrUpdateOperation</code>](#OperationBuilder.SendCommandOrUpdateOperation)
> Send another command

**Returns**: [<code>SendCommandOrUpdateOperation</code>](#OperationBuilder.SendCommandOrUpdateOperation) - this  

| Param | Type |
| --- | --- |
| next | <code>\*</code> | 


<br><a name="OperationBuilder.OperationConfig+inGroup"></a>

#### sendCommandOrUpdateOperation.inGroup(group) ⇒ [<code>OperationBuilder</code>](#OperationBuilder)
> Specify the rule group for this rule

**Overrides**: [<code>inGroup</code>](#OperationBuilder.OperationConfig+inGroup)  
**Returns**: [<code>OperationBuilder</code>](#OperationBuilder) - this  

| Param | Type | Description |
| --- | --- | --- |
| group | <code>string</code> | the group this rule belongs to. |


<br><a name="OperationBuilder.OperationConfig+build"></a>

#### sendCommandOrUpdateOperation.build(name, description)
> Build this rule

**Overrides**: [<code>build</code>](#OperationBuilder.OperationConfig+build)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | of the rules |
| description | <code>string</code> | of the rule |


<br><a name="OperationBuilder.ToggleOperation"></a>

### OperationBuilder.ToggleOperation ⇐ [<code>OperationConfig</code>](#OperationBuilder.OperationConfig)
> Toggles the state of an item

**Extends**: [<code>OperationConfig</code>](#OperationBuilder.OperationConfig)  

* [.ToggleOperation](#OperationBuilder.ToggleOperation) ⇐ [<code>OperationConfig</code>](#OperationBuilder.OperationConfig)
    * [.doToggle()](#OperationBuilder.ToggleOperation+doToggle) ⇒ [<code>SendCommandOrUpdateOperation</code>](#OperationBuilder.SendCommandOrUpdateOperation)
    * [.inGroup(group)](#OperationBuilder.OperationConfig+inGroup) ⇒ [<code>OperationBuilder</code>](#OperationBuilder)
    * [.build(name, description)](#OperationBuilder.OperationConfig+build)


<br><a name="OperationBuilder.ToggleOperation+doToggle"></a>

#### toggleOperation.doToggle() ⇒ [<code>SendCommandOrUpdateOperation</code>](#OperationBuilder.SendCommandOrUpdateOperation)
> Toggle the state of an item

**Returns**: [<code>SendCommandOrUpdateOperation</code>](#OperationBuilder.SendCommandOrUpdateOperation) - this  

<br><a name="OperationBuilder.OperationConfig+inGroup"></a>

#### toggleOperation.inGroup(group) ⇒ [<code>OperationBuilder</code>](#OperationBuilder)
> Specify the rule group for this rule

**Overrides**: [<code>inGroup</code>](#OperationBuilder.OperationConfig+inGroup)  
**Returns**: [<code>OperationBuilder</code>](#OperationBuilder) - this  

| Param | Type | Description |
| --- | --- | --- |
| group | <code>string</code> | the group this rule belongs to. |


<br><a name="OperationBuilder.OperationConfig+build"></a>

#### toggleOperation.build(name, description)
> Build this rule

**Overrides**: [<code>build</code>](#OperationBuilder.OperationConfig+build)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | of the rules |
| description | <code>string</code> | of the rule |


<br><a name="OperationBuilder.TimingItemStateOperation"></a>

### OperationBuilder.TimingItemStateOperation ⇐ [<code>OperationConfig</code>](#OperationBuilder.OperationConfig)
> Timing Item state

**Extends**: [<code>OperationConfig</code>](#OperationBuilder.OperationConfig)  

* [.TimingItemStateOperation](#OperationBuilder.TimingItemStateOperation) ⇐ [<code>OperationConfig</code>](#OperationBuilder.OperationConfig)
    * [.inGroup(group)](#OperationBuilder.OperationConfig+inGroup) ⇒ [<code>OperationBuilder</code>](#OperationBuilder)
    * [.build(name, description)](#OperationBuilder.OperationConfig+build)


<br><a name="OperationBuilder.OperationConfig+inGroup"></a>

#### timingItemStateOperation.inGroup(group) ⇒ [<code>OperationBuilder</code>](#OperationBuilder)
> Specify the rule group for this rule

**Overrides**: [<code>inGroup</code>](#OperationBuilder.OperationConfig+inGroup)  
**Returns**: [<code>OperationBuilder</code>](#OperationBuilder) - this  

| Param | Type | Description |
| --- | --- | --- |
| group | <code>string</code> | the group this rule belongs to. |


<br><a name="OperationBuilder.OperationConfig+build"></a>

#### timingItemStateOperation.build(name, description)
> Build this rule

**Overrides**: [<code>build</code>](#OperationBuilder.OperationConfig+build)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | of the rules |
| description | <code>string</code> | of the rule |


<br><a name="log"></a>

## log : <code>object</code>
> Log namespace.
> This namespace provides loggers to log messages to the openHAB Log.

**Example** *(Basic logging)*  
```js
let log = require('@openhab/automation').log('my_logger');
log.info("Hello World!")
```

* [log](#log) : <code>object</code>
    * [.Logger](#log.Logger)
        * [new Logger(_name, _listener)](#new_log.Logger_new)
        * [.listener](#log.Logger+listener) ⇒ <code>\*</code>
        * [.name](#log.Logger+name) ⇒ <code>String</code>
        * [.error()](#log.Logger+error)
        * [.warn()](#log.Logger+warn)
        * [.info()](#log.Logger+info)
        * [.debug()](#log.Logger+debug)
        * [.trace()](#log.Logger+trace)
        * [.atLevel(level, msg, [...objects])](#log.Logger+atLevel)
    * [.default](#log.default)
    * [.LOGGER_PREFIX](#log.LOGGER_PREFIX)


<br><a name="log.Logger"></a>

### log.Logger
> Logger class. A named logger providing the ability to log formatted messages.


* [.Logger](#log.Logger)
    * [new Logger(_name, _listener)](#new_log.Logger_new)
    * [.listener](#log.Logger+listener) ⇒ <code>\*</code>
    * [.name](#log.Logger+name) ⇒ <code>String</code>
    * [.error()](#log.Logger+error)
    * [.warn()](#log.Logger+warn)
    * [.info()](#log.Logger+info)
    * [.debug()](#log.Logger+debug)
    * [.trace()](#log.Logger+trace)
    * [.atLevel(level, msg, [...objects])](#log.Logger+atLevel)


<br><a name="new_log.Logger_new"></a>

#### new Logger(_name, _listener)
> Creates a new logger. Don't use directly, use [log](#log) on module.


| Param | Type | Description |
| --- | --- | --- |
| _name | <code>String</code> | the name of the logger. Will be prefixed by [LOGGER_PREFIX](LOGGER_PREFIX) |
| _listener | <code>\*</code> | a callback to receive logging calls. Can be used to send calls elsewhere, such as escalate errors. |


<br><a name="log.Logger+listener"></a>

#### logger.listener ⇒ <code>\*</code>
> The listener function attached to this logger.

**Returns**: <code>\*</code> - the listener function  

<br><a name="log.Logger+name"></a>

#### logger.name ⇒ <code>String</code>
> The name of this logger

**Returns**: <code>String</code> - the logger name  

<br><a name="log.Logger+error"></a>

#### logger.error()
> Logs at ERROR level.

**See**: atLevel  

<br><a name="log.Logger+warn"></a>

#### logger.warn()
> Logs at ERROR level.

**See**: atLevel  

<br><a name="log.Logger+info"></a>

#### logger.info()
> Logs at INFO level.

**See**: atLevel  

<br><a name="log.Logger+debug"></a>

#### logger.debug()
> Logs at DEBUG level.

**See**: atLevel  

<br><a name="log.Logger+trace"></a>

#### logger.trace()
> Logs at TRACE level.

**See**: atLevel  

<br><a name="log.Logger+atLevel"></a>

#### logger.atLevel(level, msg, [...objects])
> Logs a message at the supplied level. The message may include placeholders {} which
> will be substituted into the message string only if the message is actually logged.


| Param | Type | Description |
| --- | --- | --- |
| level | <code>String</code> | The level at which to log, such as 'INFO', or 'DEBUG' |
| msg | <code>String</code>, <code>Error</code> | the message to log, possibly with object placeholders |
| [...objects] | <code>Array.&lt;Object&gt;</code> | the objects to substitute into the log message |

**Example**  
```js
log.atLevel('INFO', 'The widget was created as {}', widget);
```

<br><a name="log.default"></a>

### log.default
> Creates a logger.

**See**: Logger  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | the name of the logger |
| [_listener] | <code>\*</code> | an optional listener to process log events. |


<br><a name="log.LOGGER_PREFIX"></a>

### log.LOGGER\_PREFIX
> Logger prefix


<br><a name="items"></a>

## items : <code>object</code>

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


<br><a name="items.OHItem"></a>

### items.OHItem
> Class representing an openHAB Item


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


<br><a name="new_items.OHItem_new"></a>

#### new OHItem(rawItem)
> Create an OHItem, wrapping a native Java openHAB Item. Don't use this constructor, instead call [getItem](getItem).


| Param | Type | Description |
| --- | --- | --- |
| rawItem | <code>HostItem</code> | Java Item from Host |


<br><a name="items.OHItem+type"></a>

#### ohItem.type ⇒ <code>String</code>
> The type of the item: the Simple (without package) name of the Java item type, such as 'Switch'.

**Returns**: <code>String</code> - the type  

<br><a name="items.OHItem+name"></a>

#### ohItem.name ⇒ <code>String</code>
> The name of the item.

**Returns**: <code>String</code> - the name  

<br><a name="items.OHItem+label"></a>

#### ohItem.label ⇒ <code>String</code>
> The label attached to the item

**Returns**: <code>String</code> - the label  

<br><a name="items.OHItem+state"></a>

#### ohItem.state ⇒ <code>String</code>
> The state of the item, as a string.

**Returns**: <code>String</code> - the item's state  

<br><a name="items.OHItem+rawState"></a>

#### ohItem.rawState ⇒ <code>HostState</code>
> The raw state of the item, as a java object.

**Returns**: <code>HostState</code> - the item's state  

<br><a name="items.OHItem+members"></a>

#### ohItem.members ⇒ <code>Array.&lt;OHItem&gt;</code>
> Members / children / direct descendents of the current group item (as returned by 'getMembers()'). Must be a group item.

**Returns**: <code>Array.&lt;OHItem&gt;</code> - member items  

<br><a name="items.OHItem+descendents"></a>

#### ohItem.descendents ⇒ <code>Array.&lt;OHItem&gt;</code>
> All descendents of the current group item (as returned by 'getAllMembers()'). Must be a group item.

**Returns**: <code>Array.&lt;OHItem&gt;</code> - all descendent items  

<br><a name="items.OHItem+isUninitialized"></a>

#### ohItem.isUninitialized ⇒
> Whether this item is initialized.

**Returns**: true iff the item has not been initialized  

<br><a name="items.OHItem+tags"></a>

#### ohItem.tags
> Gets the tags from this item


<br><a name="items.OHItem+getMetadataValue"></a>

#### ohItem.getMetadataValue(namespace) ⇒ <code>String</code>
> Gets metadata values for this item.

**Returns**: <code>String</code> - the metadata associated with this item and namespace  

| Param | Type | Description |
| --- | --- | --- |
| namespace | <code>String</code> | The namespace for the metadata to retreive |


<br><a name="items.OHItem+updateMetadataValue"></a>

#### ohItem.updateMetadataValue(namespace, value) ⇒ <code>String</code>
> Updates metadata values for this item.

**Returns**: <code>String</code> - the updated value  

| Param | Type | Description |
| --- | --- | --- |
| namespace | <code>String</code> | The namespace for the metadata to update |
| value | <code>String</code> | the value to update the metadata to |


<br><a name="items.OHItem+upsertMetadataValue"></a>

#### ohItem.upsertMetadataValue(namespace, value) ⇒ <code>Boolean</code>
> Inserts or updates metadata values for this item.

**Returns**: <code>Boolean</code> - true iff a new value was inserted  

| Param | Type | Description |
| --- | --- | --- |
| namespace | <code>String</code> | The namespace for the metadata to update |
| value | <code>String</code> | the value to update the metadata to |


<br><a name="items.OHItem+updateMetadataValues"></a>

#### ohItem.updateMetadataValues(namespaceToValues)
> Updates metadata values for this item.


| Param | Type | Description |
| --- | --- | --- |
| namespaceToValues | <code>Map</code> | A map of namespaces to values to update |


<br><a name="items.OHItem+sendCommand"></a>

#### ohItem.sendCommand(value)
> Sends a command to the item

**See**

- sendCommandIfDifferent
- postUpdate


| Param | Type | Description |
| --- | --- | --- |
| value | <code>String</code>, <code>HostState</code> | the value of the command to send, such as 'ON' |


<br><a name="items.OHItem+sendCommandIfDifferent"></a>

#### ohItem.sendCommandIfDifferent(value) ⇒ <code>Boolean</code>
> Sends a command to the item, but only if the current state is not what is being sent.
> Note

**Returns**: <code>Boolean</code> - true if the command was sent, false otherwise  
**See**: sendCommand  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>String</code>, <code>HostState</code> | the value of the command to send, such as 'ON' |


<br><a name="items.OHItem+postUpdate"></a>

#### ohItem.postUpdate(value)
> Posts an update to the item

**See**: sendCommand  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>String</code>, <code>HostState</code> | the value of the command to send, such as 'ON' |


<br><a name="items.OHItem+addGroups"></a>

#### ohItem.addGroups(...groupNamesOrItems)
> Adds groups to this item


| Param | Type | Description |
| --- | --- | --- |
| ...groupNamesOrItems | <code>Array.&lt;(String\|OHItem)&gt;</code> | names of the groups (or the group items themselves) |


<br><a name="items.OHItem+removeGroups"></a>

#### ohItem.removeGroups(...groupNamesOrItems)
> Removes groups from this item


| Param | Type | Description |
| --- | --- | --- |
| ...groupNamesOrItems | <code>Array.&lt;(String\|OHItem)&gt;</code> | names of the groups (or the group items themselves) |


<br><a name="items.OHItem+addTags"></a>

#### ohItem.addTags(...tagNames)
> Adds tags to this item


| Param | Type | Description |
| --- | --- | --- |
| ...tagNames | <code>Array.&lt;String&gt;</code> | names of the tags to add |


<br><a name="items.OHItem+removeTags"></a>

#### ohItem.removeTags(...tagNames)
> Removes tags from this item


| Param | Type | Description |
| --- | --- | --- |
| ...tagNames | <code>Array.&lt;String&gt;</code> | names of the tags to remove |


<br><a name="items.DYNAMIC_ITEM_TAG"></a>

### items.DYNAMIC\_ITEM\_TAG
> Tag value to be attached to all dynamically created items.


<br><a name="items.createItem"></a>

### items.createItem(itemName, [itemType], [category], [groups], [label], [tags], [giBaseType], [groupFunction], [itemMetadata])
> Creates a new item within OpenHab. This item is not registered with any provider.
> 
> Note that all items created this way have an additional tag attached, for simpler retrieval later. This tag is
> created with the value [DYNAMIC_ITEM_TAG](DYNAMIC_ITEM_TAG).


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


<br><a name="items.addItem"></a>

### items.addItem(itemName, [itemType], [category], [groups], [label], [tags], [giBaseType], [groupFunction])
> Creates a new item within OpenHab. This item will persist regardless of the lifecycle of the script creating it.
> 
> Note that all items created this way have an additional tag attached, for simpler retrieval later. This tag is
> created with the value [DYNAMIC_ITEM_TAG](DYNAMIC_ITEM_TAG).


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


<br><a name="items.removeItem"></a>

### items.removeItem(itemOrItemName) ⇒ <code>Boolean</code>
> Removes an item from OpenHab. The item is removed immediately and cannot be recoved.

**Returns**: <code>Boolean</code> - true iff the item is actually removed  

| Param | Type | Description |
| --- | --- | --- |
| itemOrItemName | <code>String</code>, <code>HostItem</code> | the item to remove |


<br><a name="items.replaceItem"></a>

### items.replaceItem(itemName, [itemType], [category], [groups], [label], [tags], [giBaseType], [groupFunction])
> Replaces (upserts) an item. If an item exists with the same name, it will be removed and a new item with
> the supplied parameters will be created in it's place. If an item does not exist with this name, a new
> item will be created with the supplied parameters.
> 
> This function can be useful in scripts which create a static set of items which may need updating either
> periodically, during startup or even during development of the script. Using fixed item names will ensure
> that the items remain up-to-date, but won't fail with issues related to duplicate items.


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


<br><a name="items.getItem"></a>

### items.getItem(name, nullIfMissing) ⇒ <code>OHItem</code>
> Gets an openHAB Item.

**Returns**: <code>OHItem</code> - the item  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>String</code> |  | the name of the item |
| nullIfMissing | <code>String</code> | <code>false</code> | whether to return null if the item cannot be found (default is to throw an exception) |


<br><a name="items.getItemsByTag"></a>

### items.getItemsByTag(...tagNames) ⇒ <code>Array.&lt;OHItem&gt;</code>
> Gets all openHAB Items with a specific tag.

**Returns**: <code>Array.&lt;OHItem&gt;</code> - the items with a tag that is included in the passed tags  

| Param | Type | Description |
| --- | --- | --- |
| ...tagNames | <code>Array.&lt;String&gt;</code> | an array of tags to match against |


<br><a name="items.safeItemName"></a>

### items.safeItemName(s) ⇒ <code>String</code>
> Helper function to ensure an item name is valid. All invalid characters are replaced with an underscore.

**Returns**: <code>String</code> - a valid item name  

| Param | Type | Description |
| --- | --- | --- |
| s | <code>String</code> | the name to make value |


<br><a name="actions"></a>

## actions : <code>object</code>
> Actions namespace.
> This namespace provides access to openHAB actions. All available actions can be accessed as direct properties of this
> object (via their simple class name).

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

<br><a name="triggers"></a>

## triggers : <code>object</code>
> Triggers namespace.
> This namespace allows creation of openHAB rule triggers.


* [triggers](#triggers) : <code>object</code>
    * [.ChannelEventTrigger](#triggers.ChannelEventTrigger)
    * [.ItemStateChangeTrigger](#triggers.ItemStateChangeTrigger)
    * [.ItemStateUpdateTrigger](#triggers.ItemStateUpdateTrigger)
    * [.ItemCommandTrigger](#triggers.ItemCommandTrigger)
    * [.GroupStateChangeTrigger](#triggers.GroupStateChangeTrigger)
    * [.GroupStateUpdateTrigger](#triggers.GroupStateUpdateTrigger)
    * [.GroupCommandTrigger](#triggers.GroupCommandTrigger)
    * [.ThingStatusUpdateTrigger](#triggers.ThingStatusUpdateTrigger)
    * [.ThingStatusChangeTrigger](#triggers.ThingStatusChangeTrigger)
    * [.SystemStartlevelTrigger](#triggers.SystemStartlevelTrigger)
    * [.GenericCronTrigger](#triggers.GenericCronTrigger)
    * [.TimeOfDayTrigger](#triggers.TimeOfDayTrigger)


<br><a name="triggers.ChannelEventTrigger"></a>

### triggers.ChannelEventTrigger
> Creates a trigger that fires upon specific events in a channel.


| Param | Type | Description |
| --- | --- | --- |
| channel | <code>String</code> | the name of the channel |
| event | <code>String</code> | the name of the event to listen for |
| [triggerName] | <code>String</code> | the name of the trigger to create |

**Example**  
```js
ChannelEventTrigger('astro:sun:local:rise#event', 'START')
```

<br><a name="triggers.ItemStateChangeTrigger"></a>

### triggers.ItemStateChangeTrigger
> Creates a trigger that fires upon an item changing state.


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

<br><a name="triggers.ItemStateUpdateTrigger"></a>

### triggers.ItemStateUpdateTrigger
> Creates a trigger that fires upon an item receiving a state update. Note that the item does not need to change state.


| Param | Type | Description |
| --- | --- | --- |
| itemName | <code>String</code> | the name of the item to monitor for change |
| [state] | <code>String</code> | the new state of the item |
| [triggerName] | <code>String</code> | the name of the trigger to create |

**Example**  
```js
ItemStateUpdateTrigger('my_item', 'OFF')
```

<br><a name="triggers.ItemCommandTrigger"></a>

### triggers.ItemCommandTrigger
> Creates a trigger that fires upon an item receiving a command. Note that the item does not need to change state.


| Param | Type | Description |
| --- | --- | --- |
| itemName | <code>String</code> | the name of the item to monitor for change |
| [command] | <code>String</code> | the command received |
| [triggerName] | <code>String</code> | the name of the trigger to create |

**Example**  
```js
ItemCommandTrigger('my_item', 'OFF')
```

<br><a name="triggers.GroupStateChangeTrigger"></a>

### triggers.GroupStateChangeTrigger
> Creates a trigger that fires upon a member of a group changing state.


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

<br><a name="triggers.GroupStateUpdateTrigger"></a>

### triggers.GroupStateUpdateTrigger
> Creates a trigger that fires upon a member of a group receiving a state update. Note that group item does not need to change state.


| Param | Type | Description |
| --- | --- | --- |
| groupName | <code>String</code> | the name of the group to monitor for change |
| [state] | <code>String</code> | the new state of the group |
| [triggerName] | <code>String</code> | the name of the trigger to create |

**Example**  
```js
GroupStateUpdateTrigger('my_group', 'OFF')
```

<br><a name="triggers.GroupCommandTrigger"></a>

### triggers.GroupCommandTrigger
> Creates a trigger that fires upon a member of a group receiving a command. Note that the group does not need to change state.


| Param | Type | Description |
| --- | --- | --- |
| groupName | <code>String</code> | the name of the group to monitor for change |
| [command] | <code>String</code> | the command received |
| [triggerName] | <code>String</code> | the name of the trigger to create |

**Example**  
```js
GroupCommandTrigger('my_group', 'OFF')
```

<br><a name="triggers.ThingStatusUpdateTrigger"></a>

### triggers.ThingStatusUpdateTrigger
> Creates a trigger that fires upon an Thing status updating


| Param | Type | Description |
| --- | --- | --- |
| thingUID | <code>String</code> | the name of the thing to monitor for a status updating |
| [status] | <code>String</code> | the optional status to monitor for |
| [triggerName] | <code>String</code> | the name of the trigger to create |

**Example**  
```js
ThingStatusUpdateTrigger('some:thing:uuid','OFFLINE')
```

<br><a name="triggers.ThingStatusChangeTrigger"></a>

### triggers.ThingStatusChangeTrigger
> Creates a trigger that fires upon an Thing status changing


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

<br><a name="triggers.SystemStartlevelTrigger"></a>

### triggers.SystemStartlevelTrigger
> Creates a trigger that fires if a given start level is reached by the system


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

<br><a name="triggers.GenericCronTrigger"></a>

### triggers.GenericCronTrigger
> Creates a trigger that fires on a cron schedule. The supplied cron expression defines when the trigger will fire.


| Param | Type | Description |
| --- | --- | --- |
| expression | <code>String</code> | the cron expression defining the triggering schedule |

**Example**  
```js
GenericCronTrigger('0 30 16 * * ? *')
```

<br><a name="triggers.TimeOfDayTrigger"></a>

### triggers.TimeOfDayTrigger
> Creates a trigger that fires daily at a specific time. The supplied time defines when the trigger will fire.


| Param | Type | Description |
| --- | --- | --- |
| time | <code>String</code> | the time expression defining the triggering schedule |

**Example**  
```js
TimeOfDayTrigger('19:00')
```

<br><a name="rules"></a>

## rules : <code>object</code>
> Rules namespace.
> This namespace allows creation of openHAB rules.


* [rules](#rules) : <code>object</code>
    * [.JSRule(ruleConfig)](#rules.JSRule) ⇒ <code>HostRule</code>
    * [.SwitchableJSRule(ruleConfig)](#rules.SwitchableJSRule) ⇒ <code>HostRule</code>
    * [.when(withToggle)](#rules.when) ⇒ [<code>TriggerBuilder</code>](#TriggerBuilder)


<br><a name="rules.JSRule"></a>

### rules.JSRule(ruleConfig) ⇒ <code>HostRule</code>
> Creates a rule. The rule will be created and immediately available.

**Returns**: <code>HostRule</code> - the created rule  

| Param | Type | Description |
| --- | --- | --- |
| ruleConfig | <code>Object</code> | The rule config describing the rule |
| ruleConfig.name | <code>String</code> | the name of the rule |
| ruleConfig.description | <code>String</code> | a description of the rule |
| ruleConfig.execute | <code>\*</code> | callback that will be called when the rule fires |
| ruleConfig.triggers | <code>HostTrigger</code>, <code>Array.&lt;HostTrigger&gt;</code> | triggers which will define when to fire the rule |

**Example**  
```js
import { rules, triggers } = require('@openhab/automation');

rules.JSRule({
 name: "my_new_rule",
 description": "this rule swizzles the swallows",
 triggers: triggers.GenericCronTrigger("0 30 16 * * ? *"),
 execute: triggerConfig => { //do stuff }
});
```

<br><a name="rules.SwitchableJSRule"></a>

### rules.SwitchableJSRule(ruleConfig) ⇒ <code>HostRule</code>
> Creates a rule, with an associated SwitchItem that can be used to toggle the rule's enabled state.
> The rule will be created and immediately available.

**Returns**: <code>HostRule</code> - the created rule  

| Param | Type | Description |
| --- | --- | --- |
| ruleConfig | <code>Object</code> | The rule config describing the rule |
| ruleConfig.name | <code>String</code> | the name of the rule |
| ruleConfig.description | <code>String</code> | a description of the rule |
| ruleConfig.execute | <code>\*</code> | callback that will be called when the rule fires |
| ruleConfig.triggers | <code>Array.&lt;HostTrigger&gt;</code> | triggers which will define when to fire the rule |
| ruleConfig.ruleGroup | <code>String</code> | the name of the rule group to use. |


<br><a name="rules.when"></a>

### rules.when(withToggle) ⇒ [<code>TriggerBuilder</code>](#TriggerBuilder)
> Create a new {RuleBuilder} chain for easily creating rules.

**Returns**: [<code>TriggerBuilder</code>](#TriggerBuilder) - rule builder  

| Param | Type | Description |
| --- | --- | --- |
| withToggle | <code>boolean</code> | rule can be toggled on or off (optional) |

**Example** *(Basic rule)*  
```js
rules.when().item("F1_Light").changed().then().send("changed").toItem("F2_Light").build("My Rule", "My First Rule");
```
**Example** *(Rule with function)*  
```js
rules.when().item("F1_light").changed().to("100").then(event => {
  console.log(event)
 }).build("Test Rule", "My Test Rule");
```
