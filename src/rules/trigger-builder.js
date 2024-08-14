const triggers = require('../triggers');
const operations = require('./operation-builder');
const conditions = require('./condition-builder');

/**
 * Builder for rule Triggers
 *
 * @hideconstructor
 */
class TriggerBuilder {
  constructor (builder) {
    /** @private */
    this._builder = builder;
  }

  /** @private */
  _setTrigger (trigger) {
    this.currentTrigger = trigger;
    return this.currentTrigger;
  }

  /** @private */
  _or () {
    this._builder.addTrigger(this.currentTrigger);
    return this;
  }

  /** @private */
  _then (fn) {
    this._or();
    return new operations.OperationBuilder(this._builder, fn);
  }

  /** @private */
  _if (fn) {
    this._or();
    return new conditions.ConditionBuilder(this._builder, fn);
  }

  /**
   * Specifies a channel event as a source for the rule to fire.
   *
   * @param {string} channelName the name of the channel
   * @returns {ChannelTriggerConfig} the trigger config
   */
  channel (channelName) {
    return this._setTrigger(new ChannelTriggerConfig(channelName, this));
  }

  /**
   * Specifies a cron schedule for the rule to fire.
   *
   * @param {string} cronExpression the cron expression
   * @returns {CronTriggerConfig} the trigger config
   */
  cron (cronExpression) {
    return this._setTrigger(new CronTriggerConfig(cronExpression, this));
  }

  /**
   * Specifies a time schedule for the rule to fire.
   *
   * @param {string} time the time expression (in `HH:mm`) defining the triggering schedule
   * @returns {TimeOfDayTriggerConfig} the trigger config
   */
  timeOfDay (time) {
    return this._setTrigger(new TimeOfDayTriggerConfig(time, this));
  }

  /**
   * Specifies an Item as the source of changes to trigger a rule.
   *
   * @param {string} itemName the name of the Item
   * @returns {ItemTriggerConfig} the trigger config
   */
  item (itemName) {
    return this._setTrigger(new ItemTriggerConfig(itemName, false, this));
  }

  /**
   * Specifies a group member as the source of changes to trigger a rule.
   *
   * @param {string} groupName the name of the group
   * @returns {ItemTriggerConfig} the trigger config
   */
  memberOf (groupName) {
    return this._setTrigger(new ItemTriggerConfig(groupName, true, this));
  }

  /**
   * Specifies a Thing status event as a source for the rule to fire.
   *
   * @param {string} thingUID the UID of the Thing
   * @returns {ThingTriggerConfig} the trigger config
   */
  thing (thingUID) {
    return this._setTrigger(new ThingTriggerConfig(thingUID, this));
  }

  /**
   * Specifies a system event as a source for the rule to fire.
   *
   * @memberof TriggerBuilder
   * @returns {SystemTriggerConfig} the trigger config
   */
  system () {
    return this._setTrigger(new SystemTriggerConfig(this));
  }

  /**
   * Specifies a DateTime Item whose (optional) date and time schedule the rule to fire.
   *
   * @param {string} itemName the name of the Item to monitor for change
   * @returns {DateTimeTriggerConfig} the trigger config
   */
  dateTime (itemName) {
    return this._setTrigger(new DateTimeTriggerConfig(itemName, this));
  }
}

/**
 * {RuleBuilder} RuleBuilder triggers
 * @memberof TriggerBuilder
 */
class TriggerConf {
  constructor (triggerBuilder) {
    /** @private */
    this.triggerBuilder = triggerBuilder;
  }

  /**
   * Add an additional Trigger
   *
   * @returns {TriggerBuilder}
   */
  or () {
    return this.triggerBuilder._or();
  }

  /**
   * Move to the rule operations
   *
   * @param {*} [fn] the optional function to execute
   * @returns {operations.OperationBuilder}
   */
  then (fn) {
    return this.triggerBuilder._then(fn);
  }

  /**
   * Move to the rule condition
   *
   * @param {*} [fn] the optional function to execute
   * @returns {conditions.ConditionBuilder}
   */
  if (fn) {
    return this.triggerBuilder._if(fn);
  }
}

/**
 * @memberof TriggerBuilder
 * @extends TriggerConf
 * @hideconstructor
 */
class ChannelTriggerConfig extends TriggerConf {
  constructor (channelName, triggerBuilder) {
    super(triggerBuilder);
    this.channelName = channelName;
    this._toOHTriggers = () => [triggers.ChannelEventTrigger(this.channelName, this.eventName)];
  }

  /** @private */
  describe (compact) {
    if (compact) {
      return this.channelName + (this.eventName ? `:${this.eventName}` : '');
    } else {
      return `matches channel "${this.channelName}"` + (this.eventName ? `for event ${this.eventName}` : '');
    }
  }

  /**
   * trigger a specific event name
   *
   * @param {string} eventName
   * @returns {ChannelTriggerConfig}
   */
  to (eventName) {
    return this.triggered(eventName);
  }

  /**
   * trigger a specific event name
   *
   * @param {string} eventName
   * @returns {ChannelTriggerConfig}
   */
  triggered (eventName) {
    this.eventName = eventName || '';
    return this;
  }

  /** @private */
  _complete () {
    return typeof (this.eventName) !== 'undefined';
  }
}

/**
 * Cron based trigger
 *
 * @memberof TriggerBuilder
 * @extends TriggerConf
 * @hideconstructor
 */
class CronTriggerConfig extends TriggerConf {
  constructor (timeStr, triggerBuilder) {
    super(triggerBuilder);
    /** @private */
    this.timeStr = timeStr;
    /** @private */
    this._complete = () => true;
    /** @private */
    this._toOHTriggers = () => [triggers.GenericCronTrigger(this.timeStr)];
    /** @private */
    this.describe = (compact) => compact ? `cron_${this.timeStr}` : `matches cron "${this.timeStr}"`;
  }
}

/**
 * Time of day based trigger
 *
 * @memberof TriggerBuilder
 * @extends TriggerConf
 * @hideconstructor
 */
class TimeOfDayTriggerConfig extends TriggerConf {
  constructor (timeStr, triggerBuilder) {
    super(triggerBuilder);
    /** @private */
    this.timeStr = timeStr;
    /** @private */
    this._complete = () => true;
    /** @private */
    this._toOHTriggers = () => [triggers.TimeOfDayTrigger(this.timeStr)];
    /** @private */
    this.describe = (compact) => compact ? `timeOfDay_${this.timeStr}` : `matches time of day "${this.timeStr}"`;
  }
}

/**
 * Item based trigger
 *
 * @memberof TriggerBuilder
 * @extends TriggerConf
 * @hideconstructor
 */
class ItemTriggerConfig extends TriggerConf {
  constructor (itemOrName, isGroup, triggerBuilder) {
    super(triggerBuilder);
    this.type = isGroup ? 'memberOf' : 'Item';
    if (typeof itemOrName !== 'string') {
      itemOrName = itemOrName.name;
    }

    /** @private */
    this.item_name = itemOrName;
    /** @private */
    this.describe = () => `${this.type} ${this.item_name} changed`;
    this.of = this.to; // receivedCommand().of(..)
  }

  /**
   * Item to
   *
   * @param {*} value this Item should be triggered to
   * @returns {ItemTriggerConfig}
   */
  to (value) {
    this.to_value = value;
    return this;
  }

  /**
   * Item from
   * @param {*} value this items should be triggered from
   * @returns {ItemTriggerConfig}
   */
  from (value) {
    if (this.op_type !== 'changed') {
      throw Error('.from(..) only available for .changed()');
    }
    this.from_value = value;
    return this;
  }

  /**
   * Item changed to OFF
   *
   * @returns {ItemTriggerConfig}
   */
  toOff () {
    return this.to('OFF');
  }

  /**
   * Item changed to ON
   *
   * @returns {ItemTriggerConfig}
   */
  toOn () {
    return this.to('ON');
  }

  /**
   * Item changed from OFF
   *
   * @returns {ItemTriggerConfig}
   */
  fromOff () {
    return this.from('OFF');
  }

  /**
   * Item changed from ON
   *
   * @returns {ItemTriggerConfig}
   */
  fromOn () {
    return this.from('ON');
  }

  /**
   * Item received command
   *
   * @returns {ItemTriggerConfig}
   */
  receivedCommand () {
    this.op_type = 'receivedCommand';
    return this;
  }

  /**
   * Item received update
   *
   * @returns {ItemTriggerConfig}
   */
  receivedUpdate () {
    this.op_type = 'receivedUpdate';
    return this;
  }

  /**
   * Item changed state
   *
   * @returns {ItemTriggerConfig}
   */
  changed () {
    this.op_type = 'changed';
    return this;
  }

  /**
   * For timespan
   * @param {*} timespan
   * @returns {ItemTriggerConfig}
   */
  for (timespan) {
    return new operations.TimingItemStateOperation(this, timespan);
  }

  /** @private */
  _complete () {
    return typeof (this.op_type) !== 'undefined';
  }

  /** @private */
  describe (compact) {
    switch (this.op_type) {
      case 'changed':
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
      case 'receivedCommand':
        return compact ? `${this.item_name}/⌘` : `${this.type} ${this.item_name} received command`;
      case 'receivedUpdate':
        return compact ? `${this.item_name}/↻` : `${this.type} ${this.item_name} received update`;
      default:
        throw Error('Unknown operation type: ' + this.op_type);
    }
  }

  /** @private */
  _toOHTriggers () {
    if (this.type === 'memberOf') {
      switch (this.op_type) {
        case 'changed':
          return [triggers.GroupStateChangeTrigger(this.item_name, this.from_value, this.to_value)];
        case 'receivedCommand':
          return [triggers.GroupCommandTrigger(this.item_name, this.to_value)];
        case 'receivedUpdate':
          return [triggers.GroupStateUpdateTrigger(this.item_name, this.to_value)];
        default:
          throw Error('Unknown operation type: ' + this.op_type);
      }
    } else {
      switch (this.op_type) {
        case 'changed':
          return [triggers.ItemStateChangeTrigger(this.item_name, this.from_value, this.to_value)];
        case 'receivedCommand':
          return [triggers.ItemCommandTrigger(this.item_name, this.to_value)];
        case 'receivedUpdate':
          return [triggers.ItemStateUpdateTrigger(this.item_name, this.to_value)];
        default:
          throw Error('Unknown operation type: ' + this.op_type);
      }
    }
  }

  /** @private */
  _executeHook () {
    const getReceivedCommand = (args) => args.receivedCommand;

    if (this.op_type === 'receivedCommand') { // add the received command as 'it'
      return function (next, args) {
        const it = getReceivedCommand(args);
        return next({
          ...args,
          it
        });
      };
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
  constructor (thingUID, triggerBuilder) {
    super(triggerBuilder);
    /** @private */
    this.thingUID = thingUID;
  }

  /** @private */
  _complete () {
    return typeof (this.op_type) !== 'undefined';
  }

  /** @private */
  describe (compact) {
    switch (this.op_type) {
      case 'changed':
        let transition = 'changed'; // eslint-disable-line no-case-declarations

        if (this.to_value) {
          transition += ` to ${this.to_value}`;
        }

        if (this.from_value) {
          transition += ` from ${this.from_value}`;
        }

        return `${this.thingUID} ${transition}`;
      case 'updated':
        return compact ? `${this.thingUID}/updated` : `Thing ${this.thingUID} received update`;
      default:
        throw Error('Unknown operation type: ' + this.op_type);
    }
  }

  /**
   * thing changed
   *
   * @returns {ThingTriggerConfig}
   */
  changed () {
    this.op_type = 'changed';
    return this;
  }

  /**
   * thing updates
   *
   * @returns {ThingTriggerConfig}
   */
  updated () {
    this.op_type = 'updated';
    return this;
  }

  /**
   * thing status changed from
   *
   * @returns {ThingTriggerConfig}
   */
  from (value) {
    if (this.op_type !== 'changed') {
      throw Error('.from(..) only available for .changed()');
    }
    this.from_value = value;
    return this;
  }

  /**
   * thing status changed to
   *
   * @returns {ThingTriggerConfig}
   */
  to (value) {
    this.to_value = value;
    return this;
  }

  /** @private */
  _toOHTriggers () {
    switch (this.op_type) {
      case 'changed':
        return [triggers.ThingStatusChangeTrigger(this.thingUID, this.to_value, this.from_value)];
      case 'updated':
        return [triggers.ThingStatusUpdateTrigger(this.thingUID, this.to_value)];
      default:
        throw Error('Unknown operation type: ' + this.op_type);
    }
  }
}

/**
 * System based trigger
 *
 * @memberof TriggerBuilder
 * @extends TriggerConf
 * @hideconstructor
 */
class SystemTriggerConfig extends TriggerConf {
  constructor (triggerBuilder) {
    super(triggerBuilder);
    this._toOHTriggers = () => [triggers.SystemStartlevelTrigger(this.level)];
    this.describe = (compact) => compact ? `system:${this.level}` : `system level "${this.level}"`;
  }

  /** @private */
  _complete () {
    return typeof (this.level) !== 'undefined';
  }

  /**
   * System trigger
   *
   * @returns {SystemTriggerConfig}
   */
  rulesLoaded () {
    return this.startLevel(40);
  }

  /**
   * System trigger
   *
   * @returns {SystemTriggerConfig}
   */
  ruleEngineStarted () {
    return this.startLevel(50);
  }

  /**
   * System trigger
   *
   * @returns {SystemTriggerConfig}
   */
  userInterfacesStarted () {
    return this.startLevel(70);
  }

  /**
   * System trigger
   *
   * @returns {SystemTriggerConfig}
   */
  thingsInitialized () {
    return this.startLevel(80);
  }

  /**
   * System trigger
   *
   * @returns {SystemTriggerConfig}
   */
  startupComplete () {
    return this.startLevel(100);
  }

  /**
   * System trigger
   *
   * @param {number} level
   * @returns {SystemTriggerConfig}
   */
  startLevel (level) {
    if (typeof (this.level) !== 'undefined') {
      throw Error('Level already set');
    }
    this.level = level;
    return this;
  }
}

/**
 * DateTime Item based trigger
 *
 * @memberof TriggerBuilder
 * @extends TriggerConf
 * @hideconstructor
 */
class DateTimeTriggerConfig extends TriggerConf {
  constructor (itemName, triggerBuilder) {
    super(triggerBuilder);
    /** @private */
    this._itemName = itemName;
    /** @private */
    this._timeOnly = false;
    /** @private */
    this._complete = () => true;
    /** @private */
    this._toOHTriggers = () => [triggers.DateTimeTrigger(this._itemName, this._timeOnly)];
    /** @private */
    this.describe = (compact) => compact ? `dateTime_${this._itemName}` : `matches ${this._timeOnly ? 'time' : 'date and time'} of Item "${this._itemName}"`;
  }

  /**
   * Specifies whether only the time of the Item should be compared or the date and time.
   *
   * @param {boolean} [timeOnly=true]
   * @returns {DateTimeTriggerConfig}
   */
  timeOnly (timeOnly = true) {
    this._timeOnly = timeOnly;
    return this;
  }
}

module.exports = {
  CronTriggerConfig,
  ChannelTriggerConfig,
  ItemTriggerConfig,
  ThingTriggerConfig,
  SystemTriggerConfig,
  TriggerBuilder
};
