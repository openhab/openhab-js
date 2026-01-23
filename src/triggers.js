/**
 * Triggers namespace.
 * This namespace allows creation of openHAB rule triggers.
 *
 * It is possible to skip parameter configuration in triggers by using `undefined`.
 *
 * @namespace triggers
 */

const log = require('./log')('triggers');
const { randomUUID } = require('./utils');
const { _isItem } = require('./helpers');

const ModuleBuilder = Java.type('org.openhab.core.automation.util.ModuleBuilder');
const Configuration = Java.type('org.openhab.core.config.core.Configuration');

/**
 * @typedef { import("./items/items").Item } Item
 * @private
 */

/**
 * Creates a trigger. Internal function, instead use predefined trigger types.
 *
 * @private
 * @param {string} typeString the type of trigger to create
 * @param {string} [name] the name of the trigger
 * @param {object} config the trigger configuration
 * @returns {HostTrigger} {@link HostTrigger}
 */
function _createTrigger (typeString, name, config) {
  if (typeof name === 'undefined' || name === null) {
    name = randomUUID();
  }

  log.debug('Creating {} trigger as {} with config: {}', typeString, name, JSON.stringify(config || {}));

  return ModuleBuilder.createTrigger()
    .withId(name)
    .withTypeUID(typeString)
    .withConfiguration(new Configuration(config))
    .build();
}

/**
 * Creates a trigger that fires upon specific events in a channel.
 *
 * @example
 * ChannelEventTrigger('astro:sun:local:rise#event', 'START');
 *
 * @memberof triggers
 * @param {string} channel the name of the channel
 * @param {string} event the name of the event to listen for
 * @param {string} [triggerName] the optional name of the trigger to create
 *
 */
const ChannelEventTrigger = (channel, event, triggerName) =>
  _createTrigger('core.ChannelEventTrigger', triggerName, {
    channelUID: channel,
    event
  });

/**
 * Creates a trigger that fires upon an Item changing state.
 *
 * @example
 * ItemStateChangeTrigger('my_item'); // changed
 * ItemStateChangeTrigger('my_item', 'OFF', 'ON'); // changed from OFF to ON
 * ItemStateChangeTrigger('my_item', undefined, 'ON'); // changed to ON
 * ItemStateChangeTrigger('my_item', 'OFF', undefined); // changed from OFF
 *
 * @memberof triggers
 * @param {Item|string} itemOrName the {@link Item} or the name of the Item to monitor for change
 * @param {string} [oldState] the previous state of the Item
 * @param {string} [newState] the new state of the Item
 * @param {string} [triggerName] the optional name of the trigger to create
 */
const ItemStateChangeTrigger = (itemOrName, oldState, newState, triggerName) =>
  _createTrigger('core.ItemStateChangeTrigger', triggerName, {
    itemName: _isItem(itemOrName) ? itemOrName.name : itemOrName,
    state: newState,
    previousState: oldState
  });

/**
 * Creates a trigger that fires upon an Item receiving a state update. Note that the Item does not need to change state.
 *
 * @example
 * ItemStateUpdateTrigger('my_item'); // received update
 * ItemStateUpdateTrigger('my_item', 'OFF'); // received update OFF
 *
 * @memberof triggers
 * @param {Item|string} itemOrName the {@link Item} or the name of the Item to monitor for change
 * @param {string} [state] the new state of the Item
 * @param {string} [triggerName] the optional name of the trigger to create
 */
const ItemStateUpdateTrigger = (itemOrName, state, triggerName) =>
  _createTrigger('core.ItemStateUpdateTrigger', triggerName, {
    itemName: _isItem(itemOrName) ? itemOrName.name : itemOrName,
    state
  });

/**
 * Creates a trigger that fires upon an Item receiving a command. Note that the Item does not need to change state.
 *
 * @example
 * ItemCommandTrigger('my_item'); // received command
 * ItemCommandTrigger('my_item', 'OFF'); // received command OFF
 *
 * @memberof triggers
 * @param {Item|string} itemOrName the {@link Item} or the name of the Item to monitor for change
 * @param {string} [command] the command received
 * @param {string} [triggerName] the optional name of the trigger to create
 */
const ItemCommandTrigger = (itemOrName, command, triggerName) =>
  _createTrigger('core.ItemCommandTrigger', triggerName, {
    itemName: _isItem(itemOrName) ? itemOrName.name : itemOrName,
    command
  });

/**
 * Creates a trigger that fires upon a member of a group changing state. Note that group Item does not need to change state.
 *
 * @example
 * GroupStateChangeTrigger('my_group', 'OFF', 'ON');
 *
 * @memberof triggers
 * @param {Item|string} groupOrName the group {@link Item} or the name of the group to monitor for change
 * @param {string} [oldState] the previous state of the group
 * @param {string} [newState] the new state of the group
 * @param {string} [triggerName] the optional name of the trigger to create
 */
const GroupStateChangeTrigger = (groupOrName, oldState, newState, triggerName) =>
  _createTrigger('core.GroupStateChangeTrigger', triggerName, {
    groupName: _isItem(groupOrName) ? groupOrName.name : groupOrName,
    state: newState,
    previousState: oldState
  });

/**
 * Creates a trigger that fires upon a member of a group receiving a state update. Note that group Item does not need to change state.
 *
 * @example
 * GroupStateUpdateTrigger('my_group', 'OFF');
 *
 * @memberof triggers
 * @param {Item|string} groupOrName the group {@link Item} or the name of the group to monitor for change
 * @param {string} [state] the new state of the group
 * @param {string} [triggerName] the optional name of the trigger to create
 */
const GroupStateUpdateTrigger = (groupOrName, state, triggerName) =>
  _createTrigger('core.GroupStateUpdateTrigger', triggerName, {
    groupName: _isItem(groupOrName) ? groupOrName.name : groupOrName,
    state
  });

/**
 * Creates a trigger that fires upon a member of a group receiving a command. Note that the group Item does not need to change state.
 *
 * @example
 * GroupCommandTrigger('my_group', 'OFF');
 *
 * @memberof triggers
 * @param {Item|string} groupOrName the group {@link Item} or the name of the group to monitor for commands
 * @param {string} [command] the command received
 * @param {string} [triggerName] the optional name of the trigger to create
 */
const GroupCommandTrigger = (groupOrName, command, triggerName) =>
  _createTrigger('core.GroupCommandTrigger', triggerName, {
    groupName: _isItem(groupOrName) ? groupOrName.name : groupOrName,
    command
  });

/**
 * Creates a trigger that fires upon a Thing status updating.
 *
 * @example
 * ThingStatusUpdateTrigger('some:thing:uuid', 'OFFLINE');
 *
 * @memberof triggers
 * @param {string} thingUID the name of the thing to monitor for a status updating
 * @param {string} [status] the optional status to monitor for
 * @param {string} [triggerName] the optional name of the trigger to create
 */
const ThingStatusUpdateTrigger = (thingUID, status, triggerName) =>
  _createTrigger('core.ThingStatusUpdateTrigger', triggerName, {
    thingUID,
    status
  });

/**
 * Creates a trigger that fires upon a Thing status changing.
 *
 * @example
 * ThingStatusChangeTrigger('some:thing:uuid', 'ONLINE', 'OFFLINE');
 *
 * @memberof triggers
 * @param {string} thingUID the name of the thing to monitor for a status change
 * @param {string} [status] the optional status to monitor for
 * @param {string} [previousStatus] the optional previous state to monitor from
 * @param {string} [triggerName] the optional name of the trigger to create
 */
const ThingStatusChangeTrigger = (thingUID, status, previousStatus, triggerName) =>
  _createTrigger('core.ThingStatusChangeTrigger', triggerName, {
    thingUID,
    status,
    previousStatus
  });

/**
 * Creates a trigger that fires if a given start level is reached by the system
 *
 * @example
 * SystemStartlevelTrigger(40)  // Rules loaded
 * SystemStartlevelTrigger(50)  // Rule engine started
 * SystemStartlevelTrigger(70)  // User interfaces started
 * SystemStartlevelTrigger(80)  // Things initialized
 * SystemStartlevelTrigger(100) // Startup Complete
 *
 * @memberof triggers
 * @param {string|number} startlevel the system start level to be triggered on
 * @param {string} [triggerName] the optional name of the trigger to create
 */
const SystemStartlevelTrigger = (startlevel, triggerName) =>
  _createTrigger('core.SystemStartlevelTrigger', triggerName, {
    startlevel: parseInt(startlevel)
  });

/**
 * Creates a trigger that fires on a cron schedule. The supplied cron expression defines when the trigger will fire.
 *
 * @example
 * GenericCronTrigger('0 30 16 * * ? *');
 *
 * @memberof triggers
 * @param {string} expression the cron expression defining the triggering schedule
 * @param {string} [triggerName] the optional name of the trigger to create
 */
const GenericCronTrigger = (expression, triggerName) =>
  _createTrigger('timer.GenericCronTrigger', triggerName, {
    cronExpression: expression
  });

/**
 * Creates a trigger that fires daily at a specific time. The supplied time defines when the trigger will fire.
 *
 * @example
 * TimeOfDayTrigger('19:00');
 *
 * @memberof triggers
 * @param {string} time the time expression (in `HH:mm`) defining the triggering schedule
 * @param {string} [triggerName] the optional name of the trigger to create
 */
const TimeOfDayTrigger = (time, triggerName) =>
  _createTrigger('timer.TimeOfDayTrigger', triggerName, {
    time
  });

/**
 * Creates a trigger that fires at an (optional) date and time specified in a DateTime Item.
 *
 * @example
 * DateTimeTrigger('MyDateTimeItem');
 *
 * @memberof triggers
 * @param {Item|string} itemOrName the {@link Item} or the name of the Item to monitor for change
 * @param {boolean} [timeOnly=false] Specifies whether only the time of the DateTime Item should be compared or the date and time.
 * @param {number} [offset=0] The offset in seconds to add to the time of the DateTime Item
 * @param {string} [triggerName] the optional name of the trigger to create
 */
const DateTimeTrigger = (itemOrName, timeOnly = false, offset = 0, triggerName) => {
  // backward compatibility for (itemOrName, timeOnly, triggerName) signature:
  if (typeof offset === 'string') {
    triggerName = offset;
    offset = 0;
    console.warn('The signature DateTimeTrigger(itemOrName, timeOnly, triggerName) is deprecated. Please use DateTimeTrigger(itemOrName, timeOnly, offset, triggerName) instead.');
  }
  return _createTrigger('timer.DateTimeTrigger', triggerName, {
    itemName: _isItem(itemOrName) ? itemOrName.name : itemOrName,
    timeOnly,
    offset
  });
};

/**
 * Creates a trigger that fires upon a matching event from the event bus.
 *
 * Please have a look at the {@link https://www.openhab.org/docs/developer/utils/events.html Event Bus docs} to learn about events.
 *
 * @example
 * // Triggers when an Item is added or removed
 * GenericEventTrigger('openhab/items/**', '', ['ItemAddedEvent', 'ItemRemovedEvent'])
 * // Triggers when the Item "OutdoorLights" is commanded by expire
 * GenericEventTrigger('openhab/items/OutdoorLights/*', 'org.openhab.core.expire', 'ItemCommandEvent')
 *
 *
 * @memberof triggers
 * @param {string} eventTopic Specifies the event topic to match, asa file-system style glob (`*` and `**` operators)
 * @param {string} eventSource Specifies the event source such as `org.openhab.core.expire`,
 * @param {string|string[]} eventTypes Specifies the event type(s) to match, e.g. `ItemAddedEvent`, `ItemRemovedEvent`, `ItemCommandEvent`, etc.
 * @param {string} [triggerName] the optional name of the trigger to create
 */
const GenericEventTrigger = (eventTopic, eventSource, eventTypes, triggerName) =>
  _createTrigger('core.GenericEventTrigger', triggerName, {
    topic: eventTopic,
    source: eventSource,
    types: (Array.isArray(eventTypes) ? eventTypes.join(',') : eventTypes),
    payload: ''
  });

/**
 * Creates a trigger for the {@link https://openhab.org/addons/automation/pwm/ Pulse Width Modulation (PWM) Automation} add-on.
 *
 * @example
 * rules.JSRule({
 *   name: 'PWM rule',
 *   triggers: [
 *     triggers.PWMTrigger('pwm_dimmer', 10);
 *   ],
 *   execute: (event) => {
 *     items.getItem('pwm_switch').sendCommand(event.receivedCommand);
 *   }
 * });
 *
 * @memberof triggers
 * @param {Item|string} dutycycleItemOrName the Item or name of the Item (PercentType) to read the duty cycle from
 * @param {number} interval constant interval in which the output is switch ON and OFF again (in sec)
 * @param {number} [minDutyCycle] any duty cycle below this value will be increased to this value
 * @param {number} [maxDutyCycle] any duty cycle above this value will be decreased to this value
 * @param {number} [deadManSwitch] output will be switched off, when the duty cycle is not updated within this time (in ms)
 * @param {boolean} [equateMinToZero=false] whether the duty cycle below `minDutyCycle` should be set to 0
 * @param {boolean} [equateMaxToHundred=true] whether the duty cycle above `maxDutyCycle` should be set to 100
 * @param {string} [triggerName] the optional name of the trigger to create
 */
const PWMTrigger = (dutycycleItemOrName, interval, minDutyCycle, maxDutyCycle, deadManSwitch, equateMinToZero = false, equateMaxToHundred = true, triggerName) =>
  _createTrigger('pwm.trigger', triggerName, {
    dutycycleItem: _isItem(dutycycleItemOrName) ? dutycycleItemOrName.name : dutycycleItemOrName,
    interval,
    minDutyCycle,
    equateMinToZero,
    maxDutyCycle,
    equateMaxToHundred,
    deadManSwitch
  });

/**
 * Creates a trigger for the {@link https://www.openhab.org/addons/automation/pidcontroller/ PID Controller Automation} add-on.
 *
 * @example
 * rules.JSRule({
 *   name: 'PID rule',
 *   triggers: [
 *     triggers.PIDTrigger('currentTemperature', 'targetTemperature', 1, 1, 1, 1, 10000, undefined, 1, 100);
 *   ],
 *   execute: (event) => {
 *     // Look out what the max value for your Item is!
 *     const command = parseInt(event.receivedCommand) > 100 ? '100' : event.receivedCommand;
 *     items.getItem('thermostat').sendCommand(command);
 *   }
 * });
 *
 * @memberof triggers
 * @param {string} inputItem name of the input Item (e.g. temperature sensor value)
 * @param {string} setpointItem name of the setpoint Item (e.g. desired room temperature)
 * @param {number} kp P: {@link https://www.openhab.org/addons/automation/pidcontroller/#proportional-p-gain-parameter Proportional Gain} parameter
 * @param {number} ki I: {@link https://www.openhab.org/addons/automation/pidcontroller/#integral-i-gain-parameter Integral Gain} parameter
 * @param {number} kd D: {@link https://www.openhab.org/addons/automation/pidcontroller/#derivative-d-gain-parameter Deritative Gain} parameter
 * @param {number} kdTimeConstant D-T1: {@link https://www.openhab.org/addons/automation/pidcontroller/#derivative-time-constant-d-t1-parameter Derivative Gain Time Constant} in sec
 * @param {number} loopTime The interval the output value will be updated in milliseconds. Note: the output will also be updated when the input value or the setpoint changes.
 * @param {string} [commandItem] Name of the item to send a String "RESET" to reset the I- and the D-part to 0.
 * @param {number} [integralMinValue] The I-part will be limited (min) to this value.
 * @param {number} [integralMaxValue] The I-part will be limited (max) to this value.
 * @param {string} [pInspectorItem] name of the debug Item for the current P-part
 * @param {string} [iInspectorItem] name of the debug Item for the current I-part
 * @param {string} [dInspectorItem] name of the debug Item for the current D-part
 * @param {string} [errorInspectorItem] name of the debug Item for the current regulation difference (error)
 * @param {string} [triggerName] the optional name of the trigger to create
 */
const PIDTrigger = (inputItem, setpointItem, kp = 1, ki = 1, kd = 1, kdTimeConstant = 1, loopTime = 1000, commandItem, integralMinValue, integralMaxValue, pInspectorItem, iInspectorItem, dInspectorItem, errorInspectorItem, triggerName) =>
  _createTrigger('pidcontroller.trigger', triggerName, {
    input: inputItem,
    setpoint: setpointItem,
    kp,
    ki,
    kd,
    kdTimeConstant,
    loopTime,
    commandItem,
    integralMinValue,
    integralMaxValue,
    pInspector: pInspectorItem,
    iInspector: iInspectorItem,
    dInspector: dInspectorItem,
    eInspector: errorInspectorItem
  });

/* not yet tested
ItemStateCondition: (itemName, state, triggerName) => createTrigger("core.ItemStateCondition", triggerName, {
    "itemName": itemName,
    "operator": "=",
    "state": state
}
GenericCompareCondition: (itemName, state, operator, triggerName) => createTrigger("core.GenericCompareCondition", triggerName, {
        "itemName": itemName,
        "operator": operator,// matches, ==, <, >, =<, =>
        "state": state
})
*/

module.exports = {
  ChannelEventTrigger,
  ItemStateChangeTrigger,
  ItemStateUpdateTrigger,
  ItemCommandTrigger,
  GroupStateChangeTrigger,
  GroupStateUpdateTrigger,
  GroupCommandTrigger,
  ThingStatusUpdateTrigger,
  ThingStatusChangeTrigger,
  SystemStartlevelTrigger,
  GenericCronTrigger,
  GenericEventTrigger,
  TimeOfDayTrigger,
  DateTimeTrigger,
  PWMTrigger,
  PIDTrigger
};
