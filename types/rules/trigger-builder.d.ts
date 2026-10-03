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
    _toOHTriggers: () => object[];
    /** @private */
    private describe;
    /**
     * channel triggered a specific event name
     *
     * @param {string} [eventName]
     * @returns {ChannelTriggerConfig}
     */
    to(eventName?: string): ChannelTriggerConfig;
    /**
     * channel triggered a specific event name
     *
     * @param {string} [eventName]
     * @returns {ChannelTriggerConfig}
     */
    triggered(eventName?: string): ChannelTriggerConfig;
    eventName: string | undefined;
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
    to_value: string | undefined;
    /**
     * Item state changed from
     *
     * @param {string} value
     * @returns {ItemTriggerConfig}
     */
    from(value: string): ItemTriggerConfig;
    from_value: string | undefined;
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
    op_type: string | undefined;
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
     * Requires the Item to stay in the state given by {@link ItemTriggerConfig#to} for the given timespan before the rule fires.
     *
     * @param {number|string|time.Duration} timespan the time to wait in milliseconds, as ISO-8601 duration string, or as {@link https://js-joda.github.io/js-joda/class/packages/core/src/Duration.js~Duration.html JS-Joda: Duration}
     * @returns {TimingItemStateOperation} the trigger config
     */
    for(timespan: number | string | time.Duration): TimingItemStateOperation;
    /** @private */
    private _complete;
    /** @private */
    private _toOHTriggers;
    /** @private */
    private _executeHook;
}
/**
 * Item based trigger that only fires the rule once the Item has stayed in the target state for a given timespan
 *
 * @memberof TriggerBuilder
 * @extends TriggerConf
 * @hideconstructor
 */
export class TimingItemStateOperation extends TriggerConf {
    constructor(itemChangedTriggerConfig: any, duration: any);
    /** @private */
    private itemChangedTriggerConfig;
    /** @private */
    private duration;
    durationMs: any;
    /** @private */
    private _complete;
    /** @private */
    private describe;
    /** @private */
    private _toOHTriggers;
    /** @private */
    private _executeHook;
    /** @private */
    private _startWait;
    currentWait: NodeJS.Timeout | undefined;
    /** @private */
    private _cancelWait;
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
    op_type: string | undefined;
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
    from_value: string | undefined;
    /**
     * Thing status changed to
     *
     * @param {string} value
     * @returns {ThingTriggerConfig}
     */
    to(value: string): ThingTriggerConfig;
    to_value: string | undefined;
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
    _toOHTriggers: () => object[];
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
    level: number | undefined;
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
     * @param {items.Item|string} itemOrName the {@link items.Item} or the name of the Item
     * @returns {ItemTriggerConfig} the trigger config
     */
    item(itemOrName: items.Item | string): ItemTriggerConfig;
    /**
     * Specifies a group member as the source of changes to trigger a rule.
     *
     * @param {items.Item|string} groupOrName the {@link items.Item} or the name of the group
     * @returns {ItemTriggerConfig} the trigger config
     */
    memberOf(groupOrName: items.Item | string): ItemTriggerConfig;
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
     * @param {items.Item|string} itemOrName the {@link items.Item} or the name of the Item
     * @returns {DateTimeTriggerConfig} the trigger config
     */
    dateTime(itemOrName: items.Item | string): DateTimeTriggerConfig;
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
     * @param {rules.RuleCallback} [fn] the optional callback function to execute when the rule is run
     * @returns {operations.OperationBuilder}
     */
    then(fn?: rules.RuleCallback): operations.OperationBuilder;
    /**
     * Move to the rule condition
     *
     * @param {ConditionCallback} [fn] the optional function to check for conditions when the rule is triggered
     * @returns {conditions.ConditionBuilder}
     */
    if(fn?: ConditionCallback): conditions.ConditionBuilder;
}
import time = require("@js-joda/core");
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