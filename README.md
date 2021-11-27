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
- [Provided Variables](#provided-variables)
  -[log](#log)
  -[rules](#rules)
  -[items](#items)
  -[things](#things)
  -[metadata](#metadata)
  -[triggers](#triggers)
  -[actions](#actions)
  -[utils](#utils)
  -[osgi](#osgi)
  -[provider](#provider)
  -[itemchannellink](#itemchannellink)
-[Rule Builder API](#rule-builder-api)
  -[Rule Builder Triggers](#rule-builder-triggers)
  -[Rule Builder Conditions](#rule-builder-conditions)
  -[Rule Builder Operations](#rule-builder-operations)

  


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

Scripting may be done via the openHAB UI or by creating scripts in $OPENHAB_CONF/automation/jsr223/javascript/personal.

By default the JS Scripting binding will bind all exported variables of this library to `this`, so no additional importing is necessary. This behavior can be configured on or off in the binding's configuration options. The injected import is roughly equivalent to:
```javascript
const {rules, items, things, log, triggers, actions, metadata, osgi, utils} = require('@openhab/automation')
```

## Provided Variables 

The following variables are provided by the library:

### log

By default the JS Scripting binding supports console logging like `console.log()` and `console.debug()` to the openHAB default log.  Additionally scripts may create their own native openHAB logs using the log namespace

```javascript
//this is imported by default, shown here for clarity only
let log = require('@openhab/automation');

let logger = log('my_logger');

//prints "Hello World!"
logger.debug("Hello {}!", "world");
```

### rules

  * `JSRule`
  * `SwitchableJSRule`
  * `when` See [Rule Builder API](#rule-builder-api)

### Items

  * `addItem`
  * `createItem`
  * `getItem`
  * `getItemsByTag`
  * `removeItem`
  * `replaceItem`
  * `safeItemName`

### things

### metadata

### triggers

### actions

### utils

### osgi

### provider

### itemchannellink

## Rule Builder API

The Rule Builder provides a convenient API to write rules in a high-level, readable style using a builder pattern. This is particularly useful when writing rules using files as opposed to using the UI which provides its own rule creation interface. 

Rules are started using `rules.when()` and can chain together rule triggers, conditions and operations in the following pattern:

```javascript
rules.when().triggerType()....triggerType()...if().conditionType().then().operationType()...build(name,description);
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
## Developer API Docs

[API Documentation](https://openhab.github.io/openhab-js/oh/0.1.1/)