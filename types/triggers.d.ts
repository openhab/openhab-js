export type Item = {
    rawItem: HostItem;
    persistence: import("./items/item-persistence");
    semantics: import("./items/item-semantics");
    readonly type: string;
    readonly name: string;
    readonly label: string;
    readonly state: string;
    readonly numericState: number;
    readonly quantityState: import("./quantity").Quantity;
    readonly rawState: HostState;
    readonly previousState: string;
    readonly previousNumericState: number;
    readonly previousQuantityState: import("./quantity").Quantity;
    readonly previousRawState: any;
    readonly lastStateUpdateTimestamp: any;
    readonly lastStateUpdateInstant: any;
    readonly lastStateChangeTimestamp: any;
    readonly lastStateChangeInstant: any;
    readonly members: any[];
    readonly descendents: any[];
    readonly isUninitialized: boolean;
    getMetadata(namespace?: string): {
        rawMetadata: any;
        readonly value: string;
        readonly configuration: any;
        toString(): any;
    } | {
        namespace: {
            rawMetadata: any;
            readonly value: string;
            readonly configuration: any;
            toString(): any;
        };
    };
    replaceMetadata(namespace: string, value: string, configuration?: any): {
        rawMetadata: any;
        readonly value: string;
        readonly configuration: any;
        toString(): any;
    };
    removeMetadata(namespace?: string): {
        rawMetadata: any;
        readonly value: string;
        readonly configuration: any;
        toString(): any;
    };
    sendCommand(value: any, expire?: JSJoda.Duration, onExpire?: any): void;
    sendCommandIfDifferent(value: any): boolean;
    sendIncreaseCommand(value: any): boolean;
    sendDecreaseCommand(value: any): boolean;
    getToggleState(): "PAUSE" | "PLAY" | "OPEN" | "CLOSED" | "ON" | "OFF";
    sendToggleCommand(): void;
    postToggleUpdate(): void;
    postUpdate(value: any): void;
    readonly groupNames: string[];
    addGroups(...groupNamesOrItems: any[]): void;
    removeGroups(...groupNamesOrItems: any[]): void;
    readonly tags: string[];
    addTags(...tagNames: string[]): void;
    removeTags(...tagNames: string[]): void;
    toString(): any;
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
export function ChannelEventTrigger(channel: string, event: string, triggerName?: string): HostTrigger;
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
export function ItemStateChangeTrigger(itemOrName: Item | string, oldState?: string, newState?: string, triggerName?: string): HostTrigger;
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
export function ItemStateUpdateTrigger(itemOrName: Item | string, state?: string, triggerName?: string): HostTrigger;
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
export function ItemCommandTrigger(itemOrName: Item | string, command?: string, triggerName?: string): HostTrigger;
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
export function GroupStateChangeTrigger(groupOrName: Item | string, oldState?: string, newState?: string, triggerName?: string): HostTrigger;
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
export function GroupStateUpdateTrigger(groupOrName: Item | string, state?: string, triggerName?: string): HostTrigger;
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
export function GroupCommandTrigger(groupOrName: Item | string, command?: string, triggerName?: string): HostTrigger;
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
export function ThingStatusUpdateTrigger(thingUID: string, status?: string, triggerName?: string): HostTrigger;
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
export function ThingStatusChangeTrigger(thingUID: string, status?: string, previousStatus?: string, triggerName?: string): HostTrigger;
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
export function SystemStartlevelTrigger(startlevel: string | number, triggerName?: string): HostTrigger;
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
export function GenericCronTrigger(expression: string, triggerName?: string): HostTrigger;
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
export function GenericEventTrigger(eventTopic: string, eventSource: string, eventTypes: string | string[], triggerName?: string): HostTrigger;
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
export function TimeOfDayTrigger(time: string, triggerName?: string): HostTrigger;
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
export function DateTimeTrigger(itemOrName: Item | string, timeOnly?: boolean, offset?: number, triggerName?: string): HostTrigger;
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
export function PWMTrigger(dutycycleItem: string, interval: number, minDutyCycle?: number, maxDutyCycle?: number, deadManSwitch?: number, triggerName?: string): HostTrigger;
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
export function PIDTrigger(inputItem: string, setpointItem: string, kp?: number, ki?: number, kd?: number, kdTimeConstant?: number, loopTime?: number, commandItem?: string, integralMinValue?: number, integralMaxValue?: number, pInspectorItem?: string, iInspectorItem?: string, dInspectorItem?: string, errorInspectorItem?: string, triggerName?: string): HostTrigger;
//# sourceMappingURL=triggers.d.ts.map