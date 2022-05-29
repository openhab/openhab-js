/**
 * Triggers namespace.
 * This namespace allows creation of openHAB rule triggers.
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
 * @param {String} typeString the type of trigger to create
 * @param {String} [name] the name of the trigger
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
 * ChannelEventTrigger('astro:sun:local:rise#event', 'START')
 *
 * @memberof triggers
 * @param {String} channel the name of the channel
 * @param {String} event the name of the event to listen for
 * @param {String} [triggerName] the optional name of the trigger to create
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
 * ItemStateChangeTrigger('my_item', 'OFF', 'ON')
 *
 * @memberof triggers
 * @param {String} itemName the name of the Item to monitor for change
 * @param {String} [oldState] the previous state of the Item
 * @param {String} [newState] the new state of the Item
 * @param {String} [triggerName] the optional name of the trigger to create
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
 * ItemStateUpdateTrigger('my_item', 'OFF')
 *
 * @memberof triggers
 * @param {String} itemName the name of the Item to monitor for change
 * @param {String} [state] the new state of the Item
 * @param {String} [triggerName] the optional name of the trigger to create
 */
const ItemStateUpdateTrigger = (itemName, state, triggerName) => createTrigger('core.ItemStateUpdateTrigger', triggerName, {
  itemName: itemName,
  state: state
});

/**
 * Creates a trigger that fires upon an Item receiving a command. Note that the Item does not need to change state.
 *
 * @example
 * ItemCommandTrigger('my_item', 'OFF')
 *
 * @memberof triggers
 * @param {String} itemName the name of the Item to monitor for change
 * @param {String} [command] the command received
 * @param {String} [triggerName] the optional name of the trigger to create
 */
const ItemCommandTrigger = (itemName, command, triggerName) => createTrigger('core.ItemCommandTrigger', triggerName, {
  itemName: itemName,
  command: command
});

/**
 * Creates a trigger that fires upon a member of a group changing state.
 *
 * @example
 * GroupStateChangeTrigger('my_group', 'OFF', 'ON')
 *
 * @memberof triggers
 * @param {String} groupName the name of the group to monitor for change
 * @param {String} [oldState] the previous state of the group
 * @param {String} [newState] the new state of the group
 * @param {String} [triggerName] the optional name of the trigger to create
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
 * GroupStateUpdateTrigger('my_group', 'OFF')
 *
 * @memberof triggers
 * @param {String} groupName the name of the group to monitor for change
 * @param {String} [state] the new state of the group
 * @param {String} [triggerName] the optional name of the trigger to create
 */
const GroupStateUpdateTrigger = (groupName, state, triggerName) => createTrigger('core.GroupStateUpdateTrigger', triggerName, {
  groupName: groupName,
  state: state
});

/**
 * Creates a trigger that fires upon a member of a group receiving a command. Note that the group does not need to change state.
 *
 * @example
 * GroupCommandTrigger('my_group', 'OFF')
 *
 * @memberof triggers
 * @param {String} groupName the name of the group to monitor for change
 * @param {String} [command] the command received
 * @param {String} [triggerName] the optional name of the trigger to create
 */
const GroupCommandTrigger = (groupName, command, triggerName) => createTrigger('core.GroupCommandTrigger', triggerName, {
  groupName: groupName,
  command: command
});

/**
 * Creates a trigger that fires upon an Thing status updating
 *
 * @example
 * ThingStatusUpdateTrigger('some:thing:uuid','OFFLINE')
 *
 * @memberof triggers
 * @param {String} thingUID the name of the thing to monitor for a status updating
 * @param {String} [status] the optional status to monitor for
 * @param {String} [triggerName] the optional name of the trigger to create
 */
const ThingStatusUpdateTrigger = (thingUID, status, triggerName) => createTrigger('core.ThingStatusUpdateTrigger', triggerName, {
  thingUID: thingUID,
  status: status
});

/**
 * Creates a trigger that fires upon an Thing status changing
 *
 * @example
 * ThingStatusChangeTrigger('some:thing:uuid','ONLINE','OFFLINE')
 *
 * @memberof triggers
 * @param {String} thingUID the name of the thing to monitor for a status change
 * @param {String} [status] the optional status to monitor for
 * @param {String} [previousStatus] the optional previous state to monitor from
 * @param {String} [triggerName] the optional name of the trigger to create
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
 * SystemStartlevelTrigger(40)  //Rules loaded
 * ...
 * SystemStartlevelTrigger(50)  //Rule engine started
 * ...
 * SystemStartlevelTrigger(70)  //User interfaces started
 * ...
 * SystemStartlevelTrigger(80)  //Things initialized
 * ...
 * SystemStartlevelTrigger(100) //Startup Complete
 *
 * @memberof triggers
 * @param {String} startlevel the system start level to be triggered on
 * @param {String} [triggerName] the optional name of the trigger to create
 */
const SystemStartlevelTrigger = (startlevel, triggerName) => createTrigger('core.SystemStartlevelTrigger', triggerName, {
  startlevel: startlevel
});

/**
 * Creates a trigger that fires on a cron schedule. The supplied cron expression defines when the trigger will fire.
 *
 * @example
 * GenericCronTrigger('0 30 16 * * ? *')
 *
 * @memberof triggers
 * @param {String} expression the cron expression defining the triggering schedule
 * @param {String} [triggerName] the optional name of the trigger to create
 */
const GenericCronTrigger = (expression, triggerName) => createTrigger('timer.GenericCronTrigger', triggerName, {
  cronExpression: expression
});

/**
 * Creates a trigger that fires daily at a specific time. The supplied time defines when the trigger will fire.
 *
 * @example
 * TimeOfDayTrigger('19:00')
 *
 * @memberof triggers
 * @param {String} time the time expression defining the triggering schedule
 * @param {String} [triggerName] the optional name of the trigger to create
 */
const TimeOfDayTrigger = (time, triggerName) => createTrigger('timer.TimeOfDayTrigger', triggerName, {
  time: time
});

/**
 * Creates a trigger for the {@link https://openhab.org/addons/automation/pwm/ Pulse Width Modulation (PWM) Automation} add-on.
 *
 * @example
 * rules.JSRule({
 *   name: "Termostat x PWM rule",
 *   triggers: [
 *     triggers.PWMTrigger('pwm_dimmer', 10)
 *   ],
 *   execute: (event) => {
 *     items.getItem('pwm_switch').sendCommand(event.command);
 *   }
 * });
 *
 * @memberof triggers
 * @param {String} dutycycleItem Item (PercentType) to read the duty cycle from
 * @param {Number} interval constant interval in which the output is switch ON and OFF again (in sec)
 * @param {Number} [minDutyCycle] any duty cycle below this value will be increased to this value
 * @param {Number} [maxDutyCycle] any duty cycle above this value will be decreased to this value
 * @param {Number} [deadManSwitch] output will be switched off, when the duty cycle is not updated within this time (in ms)
 * @param {String} [triggerName] the optional name of the trigger to create
 */
const PWMTrigger = (dutycycleItem, interval, minDutyCycle, maxDutyCycle, deadManSwitch, triggerName) => createTrigger('pwm.trigger', triggerName, {
  dutycycleItem: dutycycleItem,
  interval: interval,
  minDutyCycle: minDutyCycle,
  maxDutyCycle: maxDutyCycle,
  deadManSwitch: deadManSwitch
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
  PWMTrigger
};
