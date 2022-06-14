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
export function ChannelEventTrigger(channel: string, event: string, triggerName?: string): HostTrigger;
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
export function ItemStateChangeTrigger(itemName: string, oldState?: string, newState?: string, triggerName?: string): HostTrigger;
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
export function ItemStateUpdateTrigger(itemName: string, state?: string, triggerName?: string): HostTrigger;
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
export function ItemCommandTrigger(itemName: string, command?: string, triggerName?: string): HostTrigger;
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
export function GroupStateChangeTrigger(groupName: string, oldState?: string, newState?: string, triggerName?: string): HostTrigger;
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
export function GroupStateUpdateTrigger(groupName: string, state?: string, triggerName?: string): HostTrigger;
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
export function GroupCommandTrigger(groupName: string, command?: string, triggerName?: string): HostTrigger;
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
export function ThingStatusUpdateTrigger(thingUID: string, status?: string, triggerName?: string): HostTrigger;
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
export function ThingStatusChangeTrigger(thingUID: string, status?: string, previousStatus?: string, triggerName?: string): HostTrigger;
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
export function SystemStartlevelTrigger(startlevel: string, triggerName?: string): HostTrigger;
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
export function GenericCronTrigger(expression: string, triggerName?: string): HostTrigger;
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
export function TimeOfDayTrigger(time: string, triggerName?: string): HostTrigger;
/**
 * Creates a trigger for the {@link https://openhab.org/addons/automation/pwm/ Pulse Width Modulation (PWM) Automation} add-on.
 *
 * @example
 * rules.JSRule({
 *   name: 'PWM rule',
 *   triggers: [
 *     triggers.PWMTrigger('pwm_dimmer', 10)
 *   ],
 *   execute: (event) => {
 *     items.getItem('pwm_switch').sendCommand(event.receivedCommand);
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
export function PWMTrigger(dutycycleItem: string, interval: number, minDutyCycle?: number, maxDutyCycle?: number, deadManSwitch?: number, triggerName?: string): HostTrigger;
/**
 * Creates a trigger for the {@link https://www.openhab.org/addons/automation/pidcontroller/ PID Controller Automation} add-on.
 *
 * @example
 * rules.JSRule({
 *   name: 'PID rule',
 *   triggers: [
 *     triggers.PIDTrigger('currentTemperature', 'targetTemperature', 1, 1, 1, 1, 10000, null, 1, 100)
 *   ],
 *   execute: (event) => {
 *     // Look out what the max value for your Item is!
 *     const command = parseInt(event.receivedCommand) > 100 ? '100' : event.receivedCommand;
 *     items.getItem('thermostat').sendCommand(command);
 *   }
 * });
 *
 * @memberof triggers
 * @param {String} inputItem name of the input Item (e.g. temperature sensor value)
 * @param {String} setpointItem name of the setpoint Item (e.g. desired room temperature)
 * @param {Number} kp P: {@link https://www.openhab.org/addons/automation/pidcontroller/#proportional-p-gain-parameter Proportional Gain} parameter
 * @param {Number} ki I: {@link https://www.openhab.org/addons/automation/pidcontroller/#integral-i-gain-parameter Integral Gain} parameter
 * @param {Number} kd D: {@link https://www.openhab.org/addons/automation/pidcontroller/#derivative-d-gain-parameter Deritative Gain} parameter
 * @param {Number} kdTimeConstant D-T1: {@link https://www.openhab.org/addons/automation/pidcontroller/#derivative-time-constant-d-t1-parameter Derivative Gain Time Constant} in sec
 * @param {Number} loopTime The interval the output value will be updated in milliseconds. Note: the output will also be updated when the input value or the setpoint changes.
 * @param {String} [commandItem] Name of the item to send a String "RESET" to reset the I- and the D-part to 0.
 * @param {Number} [integralMinValue] The I-part will be limited (min) to this value.
 * @param {Number} [integralMaxValue] The I-part will be limited (max) to this value.
 * @param {String} [pInspectorItem] name of the debug Item for the current P-part
 * @param {String} [iInspectorItem] name of the debug Item for the current I-part
 * @param {String} [dInspectorItem] name of the debug Item for the current D-part
 * @param {String} [errorInspectorItem] name of the debug Item for the current regulation difference (error)
 * @param {String} [triggerName] the optional name of the trigger to create
 */
export function PIDTrigger(inputItem: string, setpointItem: string, kp?: number, ki?: number, kd?: number, kdTimeConstant?: number, loopTime?: number, commandItem?: string, integralMinValue?: number, integralMaxValue?: number, pInspectorItem?: string, iInspectorItem?: string, dInspectorItem?: string, errorInspectorItem?: string, triggerName?: string): HostTrigger;
//# sourceMappingURL=triggers.d.ts.map