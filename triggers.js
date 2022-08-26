/**
 * Triggers namespace.
 * This namespace allows creation of openHAB rule triggers.
 *
 * It is possible to skip parameter configuration in triggers by using `null`.
 *
 * @namespace triggers
 */

const utils = require('./utils');

const ModuleBuilder = Java.type('org.openhab.core.automation.util.ModuleBuilder');
const Configuration = Java.type('org.openhab.core.config.core.Configuration');

/**
 * Creates a trigger. Internal function, instead use predefined trigger types.
 *
 * @memberof triggers
 * @private
 * @param {string} typeString the type of trigger to create
 * @param {string} [name] the name of the trigger
 * @param {Configuration} config the trigger configuration
 * @returns {HostTrigger} {@link HostTrigger}
 */
const createTrigger = function (typeString, name, config) {
  if (typeof name === 'undefined' || name === null) {
    name = utils.randomUUID().toString();
  }

  return ModuleBuilder.createTrigger()
    .withId(name)
    .withTypeUID(typeString)
    .withConfiguration(new Configuration(config))
    .build();
};

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
const ChannelEventTrigger = (channel, event, triggerName) => createTrigger('core.ChannelEventTrigger', triggerName, {
  channelUID: channel,
  event: event
});

/**
 * Creates a trigger that fires upon an Item changing state.
 *
 * @example
 * ItemStateChangeTrigger('my_item'); // changed
 * ItemStateChangeTrigger('my_item', 'OFF', 'ON'); // changed from OFF to ON
 * ItemStateChangeTrigger('my_item', null, 'ON'); // changed to ON
 * ItemStateChangeTrigger('my_item', 'OFF', null); // changed from OFF
 *
 * @memberof triggers
 * @param {string} itemName the name of the Item to monitor for change
 * @param {string} [oldState] the previous state of the Item
 * @param {string} [newState] the new state of the Item
 * @param {string} [triggerName] the optional name of the trigger to create
 */
const ItemStateChangeTrigger = (itemName, oldState, newState, triggerName) => createTrigger('core.ItemStateChangeTrigger', triggerName, {
  itemName: itemName,
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
 * @param {string} itemName the name of the Item to monitor for change
 * @param {string} [state] the new state of the Item
 * @param {string} [triggerName] the optional name of the trigger to create
 */
const ItemStateUpdateTrigger = (itemName, state, triggerName) => createTrigger('core.ItemStateUpdateTrigger', triggerName, {
  itemName: itemName,
  state: state
});

/**
 * Creates a trigger that fires upon an Item receiving a command. Note that the Item does not need to change state.
 *
 * @example
 * ItemCommandTrigger('my_item'); // received command
 * ItemCommandTrigger('my_item', 'OFF'); // received command OFF
 *
 * @memberof triggers
 * @param {string} itemName the name of the Item to monitor for change
 * @param {string} [command] the command received
 * @param {string} [triggerName] the optional name of the trigger to create
 */
const ItemCommandTrigger = (itemName, command, triggerName) => createTrigger('core.ItemCommandTrigger', triggerName, {
  itemName: itemName,
  command: command
});

/**
 * Creates a trigger that fires upon a member of a group changing state.
 *
 * @example
 * GroupStateChangeTrigger('my_group', 'OFF', 'ON');
 *
 * @memberof triggers
 * @param {string} groupName the name of the group to monitor for change
 * @param {string} [oldState] the previous state of the group
 * @param {string} [newState] the new state of the group
 * @param {string} [triggerName] the optional name of the trigger to create
 */
const GroupStateChangeTrigger = (groupName, oldState, newState, triggerName) => createTrigger('core.GroupStateChangeTrigger', triggerName, {
  groupName: groupName,
  state: newState,
  previousState: oldState
});

/**
 * Creates a trigger that fires upon a member of a group receiving a state update. Note that group item does not need to change state.
 *
 * @example
 * GroupStateUpdateTrigger('my_group', 'OFF');
 *
 * @memberof triggers
 * @param {string} groupName the name of the group to monitor for change
 * @param {string} [state] the new state of the group
 * @param {string} [triggerName] the optional name of the trigger to create
 */
const GroupStateUpdateTrigger = (groupName, state, triggerName) => createTrigger('core.GroupStateUpdateTrigger', triggerName, {
  groupName: groupName,
  state: state
});

/**
 * Creates a trigger that fires upon a member of a group receiving a command. Note that the group does not need to change state.
 *
 * @example
 * GroupCommandTrigger('my_group', 'OFF');
 *
 * @memberof triggers
 * @param {string} groupName the name of the group to monitor for change
 * @param {string} [command] the command received
 * @param {string} [triggerName] the optional name of the trigger to create
 */
const GroupCommandTrigger = (groupName, command, triggerName) => createTrigger('core.GroupCommandTrigger', triggerName, {
  groupName: groupName,
  command: command
});

/**
 * Creates a trigger that fires upon an Thing status updating
 *
 * @example
 * ThingStatusUpdateTrigger('some:thing:uuid', 'OFFLINE');
 *
 * @memberof triggers
 * @param {string} thingUID the name of the thing to monitor for a status updating
 * @param {string} [status] the optional status to monitor for
 * @param {string} [triggerName] the optional name of the trigger to create
 */
const ThingStatusUpdateTrigger = (thingUID, status, triggerName) => createTrigger('core.ThingStatusUpdateTrigger', triggerName, {
  thingUID: thingUID,
  status: status
});

/**
 * Creates a trigger that fires upon an Thing status changing
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
const ThingStatusChangeTrigger = (thingUID, status, previousStatus, triggerName) => createTrigger('core.ThingStatusChangeTrigger', triggerName, {
  thingUID: thingUID,
  status: status,
  previousStatus: previousStatus
});

/**
 * Creates a trigger that fires if a given start level is reached by the system
 *
 * @example
 * SystemStartlevelTrigger(40)  // Rules loaded
 * ...
 * SystemStartlevelTrigger(50)  // Rule engine started
 * ...
 * SystemStartlevelTrigger(70)  // User interfaces started
 * ...
 * SystemStartlevelTrigger(80)  // Things initialized
 * ...
 * SystemStartlevelTrigger(100) // Startup Complete
 *
 * @memberof triggers
 * @param {string} startlevel the system start level to be triggered on
 * @param {string} [triggerName] the optional name of the trigger to create
 */
const SystemStartlevelTrigger = (startlevel, triggerName) => createTrigger('core.SystemStartlevelTrigger', triggerName, {
  startlevel: startlevel
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
const GenericCronTrigger = (expression, triggerName) => createTrigger('timer.GenericCronTrigger', triggerName, {
  cronExpression: expression
});

/**
 * Creates a trigger that fires daily at a specific time. The supplied time defines when the trigger will fire.
 *
 * @example
 * TimeOfDayTrigger('19:00');
 *
 * @memberof triggers
 * @param {string} time the time expression defining the triggering schedule
 * @param {string} [triggerName] the optional name of the trigger to create
 */
const TimeOfDayTrigger = (time, triggerName) => createTrigger('timer.TimeOfDayTrigger', triggerName, {
  time: time
});

/**
 * Creates a trigger that fires at a (optional) date and time specified in an DateTime Item.
 *
 * @example
 * DateTimeTrigger('MyDateTimeItem');
 *
 * @memberof triggers
 * @param {string} itemName the name of the DateTime Item
 * @param {boolean} [timeOnly=false] Specifies whether only the time of the Item should be compared or the date and time.
 * @param {string} [triggerName] the optional name of the trigger to create
 */
const DateTimeTrigger = (itemName, timeOnly = false, triggerName) => createTrigger('timer.DateTimeTrigger', triggerName, {
  itemName: itemName,
  timeOnly: timeOnly
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
 * @param {string} dutycycleItem Item (PercentType) to read the duty cycle from
 * @param {number} interval constant interval in which the output is switch ON and OFF again (in sec)
 * @param {number} [minDutyCycle] any duty cycle below this value will be increased to this value
 * @param {number} [maxDutyCycle] any duty cycle above this value will be decreased to this value
 * @param {number} [deadManSwitch] output will be switched off, when the duty cycle is not updated within this time (in ms)
 * @param {string} [triggerName] the optional name of the trigger to create
 */
const PWMTrigger = (dutycycleItem, interval, minDutyCycle, maxDutyCycle, deadManSwitch, triggerName) => createTrigger('pwm.trigger', triggerName, {
  dutycycleItem: dutycycleItem,
  interval: interval,
  minDutyCycle: minDutyCycle,
  maxDutyCycle: maxDutyCycle,
  deadManSwitch: deadManSwitch
});

/**
 * Creates a trigger for the {@link https://www.openhab.org/addons/automation/pidcontroller/ PID Controller Automation} add-on.
 *
 * @example
 * rules.JSRule({
 *   name: 'PID rule',
 *   triggers: [
 *     triggers.PIDTrigger('currentTemperature', 'targetTemperature', 1, 1, 1, 1, 10000, null, 1, 100);
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
const PIDTrigger = (inputItem, setpointItem, kp = 1, ki = 1, kd = 1, kdTimeConstant = 1, loopTime = 1000, commandItem, integralMinValue, integralMaxValue, pInspectorItem, iInspectorItem, dInspectorItem, errorInspectorItem, triggerName) => createTrigger('pidcontroller.trigger', triggerName, {
  input: inputItem,
  setpoint: setpointItem,
  kp: kp,
  ki: ki,
  kd: kd,
  kdTimeConstant: kdTimeConstant,
  loopTime: loopTime,
  commandItem: commandItem,
  integralMinValue: integralMinValue,
  integralMaxValue: integralMaxValue,
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
  TimeOfDayTrigger,
  DateTimeTrigger,
  PWMTrigger,
  PIDTrigger
};
