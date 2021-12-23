export type OperationBuilder = import("./operation-builder").OperationBuilder;
export type ConditionBuilder = import("./condition-builder").ConditionBuilder;
/**
 * Cron based trigger
 *
 * @memberof TriggerBuilder
 * @extends TriggerConf
 * @hideconstructor
 */
export class CronTriggerConfig extends TriggerConf {
    constructor(timeStr: any, triggerBuilder: any);
    timeStr: any;
    _complete: () => boolean;
    _toOHTriggers: () => any[];
    describe: (compact: any) => string;
}
/**
 * @memberof TriggerBuilder
 * @extends TriggerConf
 * @hideconstructor
 */
export class ChannelTriggerConfig extends TriggerConf {
    constructor(channelName: any, triggerBuilder: any);
    channelName: any;
    _toOHTriggers: () => any[];
    describe(compact: any): string;
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
    _complete(): boolean;
}
/**
 * item based trigger
 *
 * @memberof TriggerBuilder
 * @extends TriggerConf
 * @hideconstructor
 */
export class ItemTriggerConfig extends TriggerConf {
    constructor(itemOrName: any, isGroup: any, triggerBuilder: any);
    type: string;
    item_name: any;
    describe(compact: any): string;
    of: (value: any) => ItemTriggerConfig;
    /**
     * Item to
     *
     * @param {*} value this item should be triggered to
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
     * item changed to OFF
     *
     * @returns {ItemTriggerConfig}
     */
    toOff(): ItemTriggerConfig;
    /**
     * item changed to ON
     *
     * @returns {ItemTriggerConfig}
     */
    toOn(): ItemTriggerConfig;
    /**
     * item recieved command
     *
     * @returns {ItemTriggerConfig}
     */
    receivedCommand(): ItemTriggerConfig;
    op_type: string;
    /**
     * item recieved update
     *
     * @returns {ItemTriggerConfig}
     */
    receivedUpdate(): ItemTriggerConfig;
    /**
     * item changed state
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
    _complete(): boolean;
    _toOHTriggers(): any[];
    _executeHook(): (next: any, args: any) => any;
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
    thingUID: any;
    _complete(): boolean;
    describe(compact: any): string;
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
    _toOHTriggers(): any[];
}
/**
 * System based trigger
 *
 * @memberof TriggerBuilder
 * @extends TriggerConf
 * @hideconstructor
 */
export class SystemTriggerConfig extends TriggerConf {
    _toOHTriggers: () => any[];
    describe: (compact: any) => string;
    _complete(): boolean;
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
    * @returns {SystemTriggerConfig}
    */
    startLevel(level: any): SystemTriggerConfig;
    level: any;
}
/**
 * Builder for rule Triggers
 *
 * @hideconstructor
 */
export class TriggerBuilder {
    constructor(builder: any);
    builder: any;
    _setTrigger(trigger: any): any;
    currentTigger: any;
    _or(): TriggerBuilder;
    _then(fn: any): operations.OperationBuilder;
    _if(fn: any): conditions.ConditionBuilder;
    /**
     * Specifies a channel event as a source for the rule to fire.
     *
     * @param {String} channelName the name of the channel
     * @returns {ChannelTriggerConfig} the trigger config
     */
    channel(s: any): ChannelTriggerConfig;
    /**
     * Specifies a cron schedule for the rule to fire.
     *
     * @param {String} cronExpression the cron expression
     * @returns {CronTriggerConfig} the trigger config
     */
    cron(s: any): CronTriggerConfig;
    /**
     * Specifies an item as the source of changes to trigger a rule.
     *
     * @param {String} itemName the name of the item
     * @returns {ItemTriggerConfig} the trigger config
     */
    item(s: any): ItemTriggerConfig;
    /**
     * Specifies an group member as the source of changes to trigger a rule.
     *
     * @param {String} groupName the name of the group
     * @returns {ItemTriggerConfig} the trigger config
     */
    memberOf(s: any): ItemTriggerConfig;
    /**
     * Specifies a Thing status event as a source for the rule to fire.
     *
     * @param {String} thingUID the UID of the Thing
     * @returns {ThingTriggerConfig} the trigger config
     */
    thing(s: any): ThingTriggerConfig;
    /**
     * Specifies a system event as a source for the rule to fire.
     *
     * @memberof TriggerBuilder
     * @returns {SystemTriggerConfig} the trigger config
     */
    system(): SystemTriggerConfig;
}
/**
 * {RuleBuilder} RuleBuilder triggers
 * @memberof TriggerBuilder
 */
declare class TriggerConf {
    constructor(triggerBuilder: any);
    triggerBuilder: any;
    /**
     * Add an additional Trigger
     *
     * @returns {TriggerBuilder}
     */
    or(): TriggerBuilder;
    /**
     * Move to the rule operations
     *
     * @param {*} function the optional function to execute
     * @returns {OperationBuilder}
     */
    then(fn: any): OperationBuilder;
    /**
     * Move to the rule condition
     *
     * @param {*} function the optional function to execute
     * @returns {ConditionBuilder}
     */
    if(fn: any): ConditionBuilder;
}
import operations = require("openhab/rules/operation-builder");
import conditions = require("openhab/rules/condition-builder");
export {};
