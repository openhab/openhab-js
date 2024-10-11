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
     * trigger a specific event name
     *
     * @param {string} eventName
     * @returns {ChannelTriggerConfig}
     */
    to(eventName: string): ChannelTriggerConfig;
    /**
     * trigger a specific event name
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
    of: (value: any) => ItemTriggerConfig;
    /**
     * Item to
     *
     * @param {*} value this Item should be triggered to
     * @returns {ItemTriggerConfig}
     */
    to(value: any): ItemTriggerConfig;
    to_value: any;
    /**
     * Item from
     * @param {*} value this items should be triggered from
     * @returns {ItemTriggerConfig}
     */
    from(value: any): ItemTriggerConfig;
    from_value: any;
    /**
     * Item changed to OFF
     *
     * @returns {ItemTriggerConfig}
     */
    toOff(): ItemTriggerConfig;
    /**
     * Item changed to ON
     *
     * @returns {ItemTriggerConfig}
     */
    toOn(): ItemTriggerConfig;
    /**
     * Item changed from OFF
     *
     * @returns {ItemTriggerConfig}
     */
    fromOff(): ItemTriggerConfig;
    /**
     * Item changed from ON
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
 * Thing based trigger
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
     * thing changed
     *
     * @returns {ThingTriggerConfig}
     */
    changed(): ThingTriggerConfig;
    op_type: string;
    /**
     * thing updates
     *
     * @returns {ThingTriggerConfig}
     */
    updated(): ThingTriggerConfig;
    /**
     * thing status changed from
     *
     * @returns {ThingTriggerConfig}
     */
    from(value: any): ThingTriggerConfig;
    from_value: any;
    /**
     * thing status changed to
     *
     * @returns {ThingTriggerConfig}
     */
    to(value: any): ThingTriggerConfig;
    to_value: any;
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
     * @param {string} itemName the name of the Item
     * @returns {ItemTriggerConfig} the trigger config
     */
    item(itemName: string): ItemTriggerConfig;
    /**
     * Specifies a group member as the source of changes to trigger a rule.
     *
     * @param {string} groupName the name of the group
     * @returns {ItemTriggerConfig} the trigger config
     */
    memberOf(groupName: string): ItemTriggerConfig;
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
     * @param {string} itemName the name of the Item to monitor for change
     * @returns {DateTimeTriggerConfig} the trigger config
     */
    dateTime(itemName: string): DateTimeTriggerConfig;
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
     * Add an additional Trigger
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
 * Time of day based trigger
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