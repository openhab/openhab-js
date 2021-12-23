/**
 * @typedef { import("./operation-builder").OperationBuilder } OperationBuilder
 * @typedef { import("./condition-builder").ConditionBuilder } ConditionBuilder
 */

const triggers = require('../triggers');
const operations = require('./operation-builder');
const conditions = require('./condition-builder');

/**
 * Builder for rule Triggers
 * 
 * @hideconstructor
 */
class TriggerBuilder {
    constructor(builder) {
        this.builder = builder;
    }

    _setTrigger(trigger) {
        this.currentTigger = trigger;
        return this.currentTigger;
    }

    _or() {
        this.builder.addTrigger(this.currentTigger);
        return this;
    }

    _then(fn) {
        this._or();
        return new operations.OperationBuilder(this.builder, fn);
    }

    _if(fn) {
        this._or();
        return new conditions.ConditionBuilder(this.builder, fn);
    }

    /**
     * Specifies a channel event as a source for the rule to fire.
     * 
     * @param {String} channelName the name of the channel
     * @returns {ChannelTriggerConfig} the trigger config
     */
    channel(s) {
        return this._setTrigger(new ChannelTriggerConfig(s, this));
    }

    /**
     * Specifies a cron schedule for the rule to fire.
     * 
     * @param {String} cronExpression the cron expression
     * @returns {CronTriggerConfig} the trigger config
     */
    cron(s) {
        return this._setTrigger(new CronTriggerConfig(s, this));
    }

    /**
     * Specifies an item as the source of changes to trigger a rule.
     * 
     * @param {String} itemName the name of the item
     * @returns {ItemTriggerConfig} the trigger config
     */
    item(s) {
        return this._setTrigger(new ItemTriggerConfig(s, false, this));
    }

    /**
     * Specifies an group member as the source of changes to trigger a rule.
     * 
     * @param {String} groupName the name of the group
     * @returns {ItemTriggerConfig} the trigger config
     */
    memberOf(s) {
        return this._setTrigger(new ItemTriggerConfig(s, true, this));
    }

    /**
     * Specifies a Thing status event as a source for the rule to fire.
     * 
     * @param {String} thingUID the UID of the Thing
     * @returns {ThingTriggerConfig} the trigger config
     */
    thing(s) {
        return this._setTrigger(new ThingTriggerConfig(s, this));
    }

    /**
     * Specifies a system event as a source for the rule to fire.
     * 
     * @memberof TriggerBuilder
     * @returns {SystemTriggerConfig} the trigger config
     */
    system() {
        return this._setTrigger(new SystemTriggerConfig(this));
    }
}

/**
 * {RuleBuilder} RuleBuilder triggers
 * @memberof TriggerBuilder
 */
class TriggerConf {
    constructor(triggerBuilder) {
        this.triggerBuilder = triggerBuilder;
    }

    /**
     * Add an additional Trigger
     *
     * @returns {TriggerBuilder}
     */
    or() {
        return this.triggerBuilder._or();
    }

    /**
     * Move to the rule operations
     *
     * @param {*} function the optional function to execute 
     * @returns {OperationBuilder} 
     */
    then(fn) {
        return this.triggerBuilder._then(fn);
    }

    /**
     * Move to the rule condition
     *
     * @param {*} function the optional function to execute
     * @returns {ConditionBuilder} 
     */
    if(fn) {
        return this.triggerBuilder._if(fn)
    }
}

/**
 * @memberof TriggerBuilder
 * @extends TriggerConf
 * @hideconstructor
 */
class ChannelTriggerConfig extends TriggerConf {
    constructor(channelName, triggerBuilder) {
        super(triggerBuilder);
        this.channelName = channelName;
        this._toOHTriggers = () => [triggers.ChannelEventTrigger(this.channelName, this.eventName)]
    }

    describe(compact) {
        if (compact) {
            return this.channelName + (this.eventName ? `:${this.eventName}` : "")
        } else {
            return `matches channel "${this.channelName}"` + (this.eventName ? `for event ${this.eventName}` : "")
        }
    }

    /**
     * trigger a specific event name
     * 
     * @param {string} eventName 
     * @returns {ChannelTriggerConfig}
     */
    to(eventName) {
        return this.triggered(eventName);
    }

    /**
     * trigger a specific event name
     * 
     * @param {string} eventName 
     * @returns {ChannelTriggerConfig}
     */
    triggered(eventName) {
        this.eventName = eventName || "";
        return this;
    }

    _complete() {
        return typeof (this.eventName) !== 'undefined';
    }
};

/**
 * Cron based trigger
 * 
 * @memberof TriggerBuilder
 * @extends TriggerConf
 * @hideconstructor
 */
class CronTriggerConfig extends TriggerConf {
    constructor(timeStr, triggerBuilder) {
        super(triggerBuilder);
        this.timeStr = timeStr;
        this._complete = () => true
        this._toOHTriggers = () => [triggers.GenericCronTrigger(this.timeStr)]
        this.describe = (compact) => compact ? `cron_${this.timeStr}` : `matches cron "${this.timeStr}"`
    }
};

/**
 * item based trigger
 * 
 * @memberof TriggerBuilder
 * @extends TriggerConf
 * @hideconstructor
 */
class ItemTriggerConfig extends TriggerConf {
    constructor(itemOrName, isGroup, triggerBuilder) {
        super(triggerBuilder);
        this.type = isGroup ? 'memberOf' : 'item';
        if (typeof itemOrName !== 'string') {
            itemOrName = itemOrName.name;
        }

        this.item_name = itemOrName;
        this.describe = () => `${this.type} ${this.item_name} changed`
        this.of = this.to; //receivedCommand().of(..)
    }

    /**
     * Item to 
     * 
     * @param {*} value this item should be triggered to
     * @returns {ItemTriggerConfig}
     */
    to(value) {
        this.to_value = value;
        return this;
    }

    /**
     * Item from
     * @param {*} value this items should be triggered from
     * @returns {ItemTriggerConfig}
     */
    from(value) {
        if (this.op_type != 'changed') {
            throw ".from(..) only available for .changed()";
        }
        this.from_value = value;
        return this;
    }

    /**
     * item changed to OFF
     *
     * @returns {ItemTriggerConfig}
     */
    toOff() {
        return this.to('OFF');
    }

    /**
     * item changed to ON
     *
     * @returns {ItemTriggerConfig}
     */
    toOn() {
        return this.to('ON');
    }

    /**
     * item recieved command
     *
     * @returns {ItemTriggerConfig}
     */
    receivedCommand() {
        this.op_type = 'receivedCommand';
        return this;
    }

    /**
     * item recieved update
     *
     * @returns {ItemTriggerConfig}
     */
    receivedUpdate() {
        this.op_type = 'receivedUpdate';
        return this;
    }

    /**
     * item changed state
     *
     * @returns {ItemTriggerConfig}
     */
    changed() {
        this.op_type = 'changed';
        return this;
    }

    /**
     * For timespan
     * @param {*} timespan 
     * @returns {ItemTriggerConfig}
     */
    for(timespan) {
        return new operations.TimingItemStateOperation(this, timespan);
    }

    _complete() {
        return typeof (this.op_type) !== 'undefined';
    }

    describe(compact) {
        switch (this.op_type) {
            case "changed":
                if (compact) {
                    let transition = this.from_value + '=>' || '';
                    if (this.to_value) {
                        transition = (transition || '=>') + this.to_value;
                    }

                    return `${this.item_name} ${transition}/Δ`;
                } else {
                    let transition = 'changed';
                    if (this.from_value) {
                        transition += ` from ${this.from_value}`;
                    }

                    if (this.to_value) {
                        transition += ` to ${this.to_value}`;
                    }

                    return `${this.item_name} ${transition}`;
                }
            case "receivedCommand":
                return compact ? `${this.item_name}/⌘` : `${this.type} ${this.item_name} received command`;
            case "receivedUpdate":
                return compact ? `${this.item_name}/↻` : `${this.type} ${this.item_name} received update`;
            default:
                throw error("Unknown operation type: " + this.op_type);
        }
    }

    _toOHTriggers() {
        if (this.type === "memberOf") {
            switch (this.op_type) {
                case "changed":
                    return [triggers.GroupStateChangeTrigger(this.item_name, this.from_value, this.to_value)];
                case 'receivedCommand':
                    return [triggers.GroupCommandTrigger(this.item_name, this.to_value)]
                case 'receivedUpdate':
                    return [triggers.GroupStateUpdateTrigger(this.item_name, this.to_value)]
                default:
                    throw error("Unknown operation type: " + this.op_type);
            }
        } else {
            switch (this.op_type) {
                case "changed":
                    return [triggers.ItemStateChangeTrigger(this.item_name, this.from_value, this.to_value)];
                case 'receivedCommand':
                    return [triggers.ItemCommandTrigger(this.item_name, this.to_value)]
                case 'receivedUpdate':
                    return [triggers.ItemStateUpdateTrigger(this.item_name, this.to_value)]
                default:
                    throw error("Unknown operation type: " + this.op_type);
            }
        }
    }

    _executeHook() {
        const getReceivedCommand = function (args) {
            return args.receivedCommand;
        };

        if (this.op_type === 'receivedCommand') { //add the received command as 'it'
            return function (next, args) {
                let it = getReceivedCommand(args);
                return next({
                    ...args,
                    it
                });
            }
        } else {
            return null;
        }
    }
}

/**
 * Thing based trigger
 * 
 * @memberof TriggerBuilder
 * @extends TriggerConf
 * @hideconstructor
 */
class ThingTriggerConfig extends TriggerConf {
    constructor(thingUID, triggerBuilder) {
        super(triggerBuilder);
        this.thingUID = thingUID;
    }

    _complete() {
        return typeof (this.op_type) !== 'undefined';
    }

    describe(compact) {
        switch (this.op_type) {
            case "changed":
                let transition = 'changed';

                if (this.to_value) {
                    transition += ` to ${this.to_value}`;
                }

                if (this.from_value) {
                    transition += ` from ${this.from_value}`;
                }

                return `${this.thingUID} ${transition}`;
            case "updated":
                return compact ? `${this.thingUID}/updated` : `Thing ${this.thingUID} received update`;
            default:
                throw error("Unknown operation type: " + this.op_type);
        }
    }

    /**
     * thing changed
     *
     * @returns {ThingTriggerConfig}
     */
    changed() {
        this.op_type = 'changed';
        return this;
    }

    /**
     * thing updates
     *
     * @returns {ThingTriggerConfig}
     */
    updated() {
        this.op_type = 'updated';
        return this;
    }

    /**
     * thing status changed from
     *
     * @returns {ThingTriggerConfig}
     */
    from(value) {
        if (this.op_type != 'changed') {
            throw ".from(..) only available for .changed()";
        }
        this.from_value = value;
        return this;
    }

    /**
     * thing status changed to
     *
     * @returns {ThingTriggerConfig}
     */
    to(value) {
        this.to_value = value;
        return this;
    }

    _toOHTriggers() {
        switch (this.op_type) {
            case "changed":
                return [triggers.ThingStatusChangeTrigger(this.thingUID, this.to_value, this.from_value)];
            case 'updated':
                return [triggers.ThingStatusUpdateTrigger(this.thingUID, this.to_value)]
            default:
                throw error("Unknown operation type: " + this.op_type);
        }
    }
};

/**
 * System based trigger
 * 
 * @memberof TriggerBuilder
 * @extends TriggerConf
 * @hideconstructor
 */
class SystemTriggerConfig extends TriggerConf {
    constructor(triggerBuilder) {
        super(triggerBuilder);
        this._toOHTriggers = () => [triggers.SystemStartlevelTrigger(this.level)]
        this.describe = (compact) => compact ? `system:${this.level}` : `system level "${this.level}"`
    }
    _complete() {
        return typeof (this.level) !== 'undefined';
    }

    /**
     * System trigger
     *
     * @returns {SystemTriggerConfig}
     */
    rulesLoaded() {
        return this.startLevel(40);
    }

     /**
     * System trigger
     *
     * @returns {SystemTriggerConfig}
     */
    ruleEngineStarted() {
        return this.startLevel(50);
    }

     /**
     * System trigger
     *
     * @returns {SystemTriggerConfig}
     */
    userInterfacesStarted() {
        return this.startLevel(70);
    }

     /**
     * System trigger
     *
     * @returns {SystemTriggerConfig}
     */
    thingsInitialized() {
        return this.startLevel(80);
    }

     /**
     * System trigger
     *
     * @returns {SystemTriggerConfig}
     */
    startupComplete() {
        return this.startLevel(100);
    }

     /**
     * System trigger
     *
     * @returns {SystemTriggerConfig}
     */
    startLevel(level) {
        if(typeof (this.level) !== 'undefined' ){
            throw Error("Level already set");
        }
        this.level = level;
        return this;
    }
};

module.exports = {
    CronTriggerConfig,
    ChannelTriggerConfig,
    ItemTriggerConfig,
    ThingTriggerConfig,
    SystemTriggerConfig,
    TriggerBuilder
}