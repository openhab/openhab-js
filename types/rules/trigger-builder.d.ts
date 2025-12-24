export type Item = {
    rawItem: HostItem;
    persistence: import("../items/item-persistence");
    semantics: import("../items/item-semantics");
    readonly type: string;
    /** @private */
    readonly groupType: string;
    readonly name: string;
    readonly label: string;
    readonly state: string;
    readonly numericState: number;
    readonly quantityState: import("../quantity").Quantity;
    readonly boolState: boolean;
    readonly rawState: HostState; /**
     * Item state changed from
     *
     * @param {string} value
     * @returns {ItemTriggerConfig}
     */
    readonly previousState: string;
    readonly previousNumericState: number;
    readonly previousQuantityState: import("../quantity").Quantity;
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
        toString(): any; /**
         * Specifies a time schedule for the rule to fire.
         *
         * @param {string} time the time expression (in `HH:mm`) defining the triggering schedule
         * @returns {TimeOfDayTriggerConfig} the trigger config
         */
    } | {
        namespace: {
            rawMetadata: any;
            readonly value: string;
            readonly configuration: any;
            toString(): any; /**
             * Specifies a time schedule for the rule to fire.
             *
             * @param {string} time the time expression (in `HH:mm`) defining the triggering schedule
             * @returns {TimeOfDayTriggerConfig} the trigger config
             */
        };
    };
    replaceMetadata(namespace: string, value: string, configuration?: any): {
        rawMetadata: any;
        readonly value: string;
        readonly configuration: any;
        toString(): any; /**
         * Specifies a time schedule for the rule to fire.
         *
         * @param {string} time the time expression (in `HH:mm`) defining the triggering schedule
         * @returns {TimeOfDayTriggerConfig} the trigger config
         */
    };
    removeMetadata(namespace?: string): {
        rawMetadata: any;
        readonly value: string;
        readonly configuration: any;
        toString(): any; /**
         * Specifies a time schedule for the rule to fire.
         *
         * @param {string} time the time expression (in `HH:mm`) defining the triggering schedule
         * @returns {TimeOfDayTriggerConfig} the trigger config
         */
    };
    sendCommand(value: any, expire?: JSJoda.Duration, onExpire?: any): void;
    sendCommandIfDifferent(value: any): boolean;
    sendIncreaseCommand(value: any): boolean;
    sendDecreaseCommand(value: any): boolean;
    getToggleState(): "OPEN" | "PLAY" | "ON" | "PAUSE" | "CLOSED" | "OFF";
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
 * The callback function to determine if the condition is met.
 */
export type ConditionCallback = () => boolean;
/**
 * Cron based trigger
 *
 * @memberof TriggerBuilder
 * @extends TriggerConf
 * @hideconstructor
 */
export class CronTriggerConfig extends TriggerConf {
    constructor(timeStr: any, triggerBuilder: any);
    /** @private */
    private timeStr;
    /** @private */
    private _complete;
    /** @private */
    private _toOHTriggers;
    /** @private */
    private describe;
}
/**
 * @memberof TriggerBuilder
 * @extends TriggerConf
 * @hideconstructor
 */
export class ChannelTriggerConfig extends TriggerConf {
    constructor(channelName: any, triggerBuilder: any);
    channelName: any;
    _toOHTriggers: () => HostTrigger[];
    /** @private */
    private describe;
    /**
     * channel triggered a specific event name
     *
     * @param {string} eventName
     * @returns {ChannelTriggerConfig}
     */
    to(eventName: string): ChannelTriggerConfig;
    /**
     * channel triggered a specific event name
     *
     * @param {string} eventName
     * @returns {ChannelTriggerConfig}
     */
    triggered(eventName: string): ChannelTriggerConfig;
    eventName: string;
    /** @private */
    private _complete;
}
/**
 * Item based trigger
 *
 * @memberof TriggerBuilder
 * @extends TriggerConf
 * @hideconstructor
 */
export class ItemTriggerConfig extends TriggerConf {
    constructor(itemOrName: any, isGroup: any, triggerBuilder: any);
    type: string;
    /** @private */
    private item_name;
    /** @private */
    private describe;
    of: (value: string) => ItemTriggerConfig;
    /**
     * Item received command or changed/updated state to
     *
     * @param {string} value
     * @returns {ItemTriggerConfig}
     */
    to(value: string): ItemTriggerConfig;
    to_value: string;
    /**
     * Item state changed from
     *
     * @param {string} value
     * @returns {ItemTriggerConfig}
     */
    from(value: string): ItemTriggerConfig;
    from_value: string;
    /**
     * Item received command OFF or changed/updated state to OFF
     *
     * @returns {ItemTriggerConfig}
     */
    toOff(): ItemTriggerConfig;
    /**
     * Item received command ON or changed/updated state to ON
     *
     * @returns {ItemTriggerConfig}
     */
    toOn(): ItemTriggerConfig;
    /**
     * Item changed state from OFF
     *
     * @returns {ItemTriggerConfig}
     */
    fromOff(): ItemTriggerConfig;
    /**
     * Item changed state from ON
     *
     * @returns {ItemTriggerConfig}
     */
    fromOn(): ItemTriggerConfig;
    /**
     * Item received command
     *
     * @returns {ItemTriggerConfig}
     */
    receivedCommand(): ItemTriggerConfig;
    op_type: string;
    /**
     * Item received update
     *
     * @returns {ItemTriggerConfig}
     */
    receivedUpdate(): ItemTriggerConfig;
    /**
     * Item changed state
     *
     * @returns {ItemTriggerConfig}
     */
    changed(): ItemTriggerConfig;
    /**
     * For timespan
     * @param {*} timespan
     * @returns {ItemTriggerConfig}
     */
    for(timespan: any): ItemTriggerConfig;
    /** @private */
    private _complete;
    /** @private */
    private _toOHTriggers;
    /** @private */
    private _executeHook;
}
/**
 * Thing-based trigger
 *
 * @memberof TriggerBuilder
 * @extends TriggerConf
 * @hideconstructor
 */
export class ThingTriggerConfig extends TriggerConf {
    constructor(thingUID: any, triggerBuilder: any);
    /** @private */
    private thingUID;
    /** @private */
    private _complete;
    /** @private */
    private describe;
    /**
     * Thing status changed
     *
     * @returns {ThingTriggerConfig}
     */
    changed(): ThingTriggerConfig;
    op_type: string;
    /**
     * Thing status updated
     *
     * @returns {ThingTriggerConfig}
     */
    updated(): ThingTriggerConfig;
    /**
     * Thing status changed from
     *
     * @param {string} value
     * @returns {ThingTriggerConfig}
     */
    from(value: string): ThingTriggerConfig;
    from_value: string;
    /**
     * Thing status changed to
     *
     * @param {string} value
     * @returns {ThingTriggerConfig}
     */
    to(value: string): ThingTriggerConfig;
    to_value: string;
    /** @private */
    private _toOHTriggers;
}
/**
 * System based trigger
 *
 * @memberof TriggerBuilder
 * @extends TriggerConf
 * @hideconstructor
 */
export class SystemTriggerConfig extends TriggerConf {
    _toOHTriggers: () => HostTrigger[];
    describe: (compact: any) => string;
    /** @private */
    private _complete;
    /**
     * System trigger
     *
     * @returns {SystemTriggerConfig}
     */
    rulesLoaded(): SystemTriggerConfig;
    /**
     * System trigger
     *
     * @returns {SystemTriggerConfig}
     */
    ruleEngineStarted(): SystemTriggerConfig;
    /**
     * System trigger
     *
     * @returns {SystemTriggerConfig}
     */
    userInterfacesStarted(): SystemTriggerConfig;
    /**
     * System trigger
     *
     * @returns {SystemTriggerConfig}
     */
    thingsInitialized(): SystemTriggerConfig;
    /**
     * System trigger
     *
     * @returns {SystemTriggerConfig}
     */
    startupComplete(): SystemTriggerConfig;
    /**
     * System trigger
     *
     * @param {number} level
     * @returns {SystemTriggerConfig}
     */
    startLevel(level: number): SystemTriggerConfig;
    level: number;
}
/**
 * @typedef { import("../items/items").Item } Item
 * @private
 */
/**
 * @callback ConditionCallback The callback function to determine if the condition is met.
 * @returns {boolean} true if the condition is met, otherwise false
 */
/**
 * Builder for rule Triggers
 *
 * @hideconstructor
 */
export class TriggerBuilder {
    constructor(builder: any);
    /** @private */
    private _builder;
    /** @private */
    private _setTrigger;
    currentTrigger: any;
    /** @private */
    private _or;
    /** @private */
    private _then;
    /** @private */
    private _if;
    /**
     * Specifies a channel event as a source for the rule to fire.
     *
     * @param {string} channelName the name of the channel
     * @returns {ChannelTriggerConfig} the trigger config
     */
    channel(channelName: string): ChannelTriggerConfig;
    /**
     * Specifies a cron schedule for the rule to fire.
     *
     * @param {string} cronExpression the cron expression
     * @returns {CronTriggerConfig} the trigger config
     */
    cron(cronExpression: string): CronTriggerConfig;
    /**
     * Specifies a time schedule for the rule to fire.
     *
     * @param {string} time the time expression (in `HH:mm`) defining the triggering schedule
     * @returns {TimeOfDayTriggerConfig} the trigger config
     */
    timeOfDay(time: string): TimeOfDayTriggerConfig;
    /**
     * Specifies an Item as the source of changes to trigger a rule.
     *
     * @param {Item|string} itemOrName the {@link Item} or the name of the Item
     * @returns {ItemTriggerConfig} the trigger config
     */
    item(itemOrName: Item | string): ItemTriggerConfig;
    /**
     * Specifies a group member as the source of changes to trigger a rule.
     *
     * @param {Item|string} groupOrName the {@link Item} or the name of the group
     * @returns {ItemTriggerConfig} the trigger config
     */
    memberOf(groupOrName: Item | string): ItemTriggerConfig;
    /**
     * Specifies a Thing status event as a source for the rule to fire.
     *
     * @param {string} thingUID the UID of the Thing
     * @returns {ThingTriggerConfig} the trigger config
     */
    thing(thingUID: string): ThingTriggerConfig;
    /**
     * Specifies a system event as a source for the rule to fire.
     *
     * @memberof TriggerBuilder
     * @returns {SystemTriggerConfig} the trigger config
     */
    system(): SystemTriggerConfig;
    /**
     * Specifies a DateTime Item whose (optional) date and time schedule the rule to fire.
     *
     * @param {Item|string} itemOrName the {@link Item} or the name of the Item
     * @returns {DateTimeTriggerConfig} the trigger config
     */
    dateTime(itemOrName: Item | string): DateTimeTriggerConfig;
}
/**
 * {RuleBuilder} RuleBuilder triggers
 * @memberof TriggerBuilder
 */
declare class TriggerConf {
    constructor(triggerBuilder: any);
    /** @private */
    private triggerBuilder;
    /**
     * Adds an additional Trigger
     *
     * @returns {TriggerBuilder}
     */
    or(): TriggerBuilder;
    /**
     * Move to the rule operations
     *
     * @param {*} [fn] the optional function to execute
     * @returns {operations.OperationBuilder}
     */
    then(fn?: any): operations.OperationBuilder;
    /**
     * Move to the rule condition
     *
     * @param {ConditionCallback} [fn] the optional function to execute
     * @returns {conditions.ConditionBuilder}
     */
    if(fn?: ConditionCallback): conditions.ConditionBuilder;
}
/**
 * Time of day-based trigger
 *
 * @memberof TriggerBuilder
 * @extends TriggerConf
 * @hideconstructor
 */
declare class TimeOfDayTriggerConfig extends TriggerConf {
    constructor(timeStr: any, triggerBuilder: any);
    /** @private */
    private timeStr;
    /** @private */
    private _complete;
    /** @private */
    private _toOHTriggers;
    /** @private */
    private describe;
}
/**
 * DateTime Item based trigger
 *
 * @memberof TriggerBuilder
 * @extends TriggerConf
 * @hideconstructor
 */
declare class DateTimeTriggerConfig extends TriggerConf {
    constructor(itemName: any, triggerBuilder: any);
    /** @private */
    private _itemName;
    /** @private */
    private _timeOnly;
    /** @private */
    private _offset;
    /** @private */
    private _complete;
    /** @private */
    private _toOHTriggers;
    /** @private */
    private describe;
    /**
     * Specifies whether only the time of the Item should be compared or the date and time.
     *
     * @param {boolean} [timeOnly=true]
     * @returns {DateTimeTriggerConfig}
     */
    timeOnly(timeOnly?: boolean): DateTimeTriggerConfig;
    /**
     * Specifies the offset in seconds to add to the time of the DateTime Item.
     *
     * @param {number} offset
     * @returns {DateTimeTriggerConfig}
     */
    withOffset(offset: number): DateTimeTriggerConfig;
}
import operations = require("./operation-builder");
import conditions = require("./condition-builder");
export {};
//# sourceMappingURL=trigger-builder.d.ts.map