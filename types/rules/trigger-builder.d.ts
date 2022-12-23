/**
 * Cron based trigger
 *
 * @memberof TriggerBuilder
 * @extends TriggerBuilder.TriggerConf
 * @hideconstructor
 */
export class CronTriggerConfig {
    constructor(timeStr: any, triggerBuilder: any);
    timeStr: any;
    _complete: () => boolean;
    _toOHTriggers: () => HostTrigger[];
    describe: (compact: any) => string;
}
/**
 * @memberof TriggerBuilder
 * @extends TriggerBuilder.TriggerConf
 * @hideconstructor
 */
export class ChannelTriggerConfig {
    constructor(channelName: any, triggerBuilder: any);
    channelName: any;
    _toOHTriggers: () => HostTrigger[];
    describe(compact: any): string;
    /**
       * trigger a specific event name
       *
       * @param {string} eventName
       * @returns {TriggerBuilder.ChannelTriggerConfig}
       */
    to(eventName: string): TriggerBuilder.ChannelTriggerConfig;
    /**
       * trigger a specific event name
       *
       * @param {string} eventName
       * @returns {TriggerBuilder.ChannelTriggerConfig}
       */
    triggered(eventName: string): TriggerBuilder.ChannelTriggerConfig;
    eventName: string;
    _complete(): boolean;
}
/**
 * item based trigger
 *
 * @memberof TriggerBuilder
 * @extends TriggerBuilder.TriggerConf
 * @hideconstructor
 */
export class ItemTriggerConfig {
    constructor(itemOrName: any, isGroup: any, triggerBuilder: any);
    type: string;
    item_name: any;
    describe(compact: any): string;
    of: (value: any) => TriggerBuilder.ItemTriggerConfig;
    /**
       * Item to
       *
       * @param {*} value this item should be triggered to
       * @returns {TriggerBuilder.ItemTriggerConfig}
       */
    to(value: any): TriggerBuilder.ItemTriggerConfig;
    to_value: any;
    /**
       * Item from
       * @param {*} value this items should be triggered from
       * @returns {TriggerBuilder.ItemTriggerConfig}
       */
    from(value: any): TriggerBuilder.ItemTriggerConfig;
    from_value: any;
    /**
       * item changed to OFF
       *
       * @returns {TriggerBuilder.ItemTriggerConfig}
       */
    toOff(): TriggerBuilder.ItemTriggerConfig;
    /**
       * item changed to ON
       *
       * @returns {TriggerBuilder.ItemTriggerConfig}
       */
    toOn(): TriggerBuilder.ItemTriggerConfig;
    /**
       * item recieved command
       *
       * @returns {TriggerBuilder.ItemTriggerConfig}
       */
    receivedCommand(): TriggerBuilder.ItemTriggerConfig;
    op_type: string;
    /**
       * item recieved update
       *
       * @returns {TriggerBuilder.ItemTriggerConfig}
       */
    receivedUpdate(): TriggerBuilder.ItemTriggerConfig;
    /**
       * item changed state
       *
       * @returns {TriggerBuilder.ItemTriggerConfig}
       */
    changed(): TriggerBuilder.ItemTriggerConfig;
    /**
       * For timespan
       * @param {*} timespan
       * @returns {TriggerBuilder.ItemTriggerConfig}
       */
    for(timespan: any): TriggerBuilder.ItemTriggerConfig;
    _complete(): boolean;
    _toOHTriggers(): HostTrigger[];
    _executeHook(): (next: any, args: any) => any;
}
/**
 * Thing based trigger
 *
 * @memberof TriggerBuilder
 * @extends TriggerBuilder.TriggerConf
 * @hideconstructor
 */
export class ThingTriggerConfig {
    constructor(thingUID: any, triggerBuilder: any);
    thingUID: any;
    _complete(): boolean;
    describe(compact: any): string;
    /**
       * thing changed
       *
       * @returns {TriggerBuilder.ThingTriggerConfig}
       */
    changed(): TriggerBuilder.ThingTriggerConfig;
    op_type: string;
    /**
       * thing updates
       *
       * @returns {TriggerBuilder.ThingTriggerConfig}
       */
    updated(): TriggerBuilder.ThingTriggerConfig;
    /**
       * thing status changed from
       *
       * @returns {TriggerBuilder.ThingTriggerConfig}
       */
    from(value: any): TriggerBuilder.ThingTriggerConfig;
    from_value: any;
    /**
       * thing status changed to
       *
       * @returns {TriggerBuilder.ThingTriggerConfig}
       */
    to(value: any): TriggerBuilder.ThingTriggerConfig;
    to_value: any;
    _toOHTriggers(): HostTrigger[];
}
/**
 * System based trigger
 *
 * @memberof TriggerBuilder
 * @extends TriggerBuilder.TriggerConf
 * @hideconstructor
 */
export class SystemTriggerConfig {
    constructor(triggerBuilder: any);
    _toOHTriggers: () => HostTrigger[];
    describe: (compact: any) => string;
    _complete(): boolean;
    /**
       * System trigger
       *
       * @returns {TriggerBuilder.SystemTriggerConfig}
       */
    rulesLoaded(): TriggerBuilder.SystemTriggerConfig;
    /**
       * System trigger
       *
       * @returns {TriggerBuilder.SystemTriggerConfig}
       */
    ruleEngineStarted(): TriggerBuilder.SystemTriggerConfig;
    /**
       * System trigger
       *
       * @returns {TriggerBuilder.SystemTriggerConfig}
       */
    userInterfacesStarted(): TriggerBuilder.SystemTriggerConfig;
    /**
       * System trigger
       *
       * @returns {TriggerBuilder.SystemTriggerConfig}
       */
    thingsInitialized(): TriggerBuilder.SystemTriggerConfig;
    /**
       * System trigger
       *
       * @returns {TriggerBuilder.SystemTriggerConfig}
       */
    startupComplete(): TriggerBuilder.SystemTriggerConfig;
    /**
       * System trigger
       *
       * @returns {TriggerBuilder.SystemTriggerConfig}
       */
    startLevel(level: any): TriggerBuilder.SystemTriggerConfig;
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
       * @param {string} channelName the name of the channel
       * @returns {TriggerBuilder.ChannelTriggerConfig} the trigger config
       */
    channel(s: any): TriggerBuilder.ChannelTriggerConfig;
    /**
       * Specifies a cron schedule for the rule to fire.
       *
       * @param {string} cronExpression the cron expression
       * @returns {TriggerBuilder.CronTriggerConfig} the trigger config
       */
    cron(s: any): TriggerBuilder.CronTriggerConfig;
    /**
       * Specifies an item as the source of changes to trigger a rule.
       *
       * @param {string} itemName the name of the item
       * @returns {TriggerBuilder.ItemTriggerConfig} the trigger config
       */
    item(s: any): TriggerBuilder.ItemTriggerConfig;
    /**
       * Specifies an group member as the source of changes to trigger a rule.
       *
       * @param {string} groupName the name of the group
       * @returns {TriggerBuilder.ItemTriggerConfig} the trigger config
       */
    memberOf(s: any): TriggerBuilder.ItemTriggerConfig;
    /**
       * Specifies a Thing status event as a source for the rule to fire.
       *
       * @param {string} thingUID the UID of the Thing
       * @returns {TriggerBuilder.ThingTriggerConfig} the trigger config
       */
    thing(s: any): TriggerBuilder.ThingTriggerConfig;
    /**
       * Specifies a system event as a source for the rule to fire.
       *
       * @memberof TriggerBuilder
       * @returns {TriggerBuilder.SystemTriggerConfig} the trigger config
       */
    system(): TriggerBuilder.SystemTriggerConfig;
}
import operations = require("./operation-builder");
import conditions = require("./condition-builder");
//# sourceMappingURL=trigger-builder.d.ts.map