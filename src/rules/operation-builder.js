const parseDuration = require('parse-duration');
const items = require('../items/items');

/**
 * @typedef { import("../items/items").Item } Item
 * @private
 */
/**
 * @typedef {import('@js-joda/core').ZonedDateTime} time.ZonedDateTime
 * @private
 */
/**
 * @typedef {import('../quantity').Quantity} Quantity
 * @private
 */

/**
 * Operation to execute as part of a rule
 * @hideconstructor
 */
class OperationBuilder {
  constructor (builder, fn) {
    /** @private */
    this._builder = builder;
    /** @private */
    this._fn = fn;
  }

  /** @private */
  _finishErr () {
    if (this._fn) {
      throw new Error('rule already completed');
    }
  }

  /** @private */
  _then (operation, group, name, description, tags, id) {
    this._builder.name = name;
    this._builder.description = description;
    this._builder.tags = tags;
    this._builder.id = id;
    this._builder.setOperation(operation, group);
  }

  /**
     * Build this rule
     *
     * @param {string} [name] of the rule
     * @param {string} [description] of the rule
     * @param {Array<String>} [tags] of the rule
     * @param {string} [id] of the rule
     */
  build (name, description, tags, id) {
    if (!this._fn) {
      throw new Error('Cannot call build without function');
    }
    this._then(this._fn, this.group, name, description, tags, id);
  }

  /**
     * Specify the rule group for this rule
     *
     * @param {string} group the group this rule belongs to.
     * @returns {OperationBuilder} this
     */
  inGroup (group) {
    this.group = group;
    return this;
  }

  /**
    * Specifies that a command should be sent as a result of this rule firing.
    *
    * @param {string|number|time.ZonedDateTime|Quantity|HostState} command the command to send
    * @returns {SendCommandOrUpdateOperation} the operation
    */
  send (command) {
    this._finishErr();
    return new SendCommandOrUpdateOperation(this, command);
  }

  /**
     * Specifies that an update should be posted as a result of this rule firing.
     *
     * @param {string} update the update to send
     * @returns {SendCommandOrUpdateOperation} the operation
     */
  postUpdate (update) {
    this._finishErr();
    return new SendCommandOrUpdateOperation(this, update, false);
  }

  /**
     * Specifies the command 'ON' should be sent as a result of this rule firing.
     *
     * @returns {SendCommandOrUpdateOperation} the operation
     */
  sendOn () {
    this._finishErr();
    return new SendCommandOrUpdateOperation(this, 'ON');
  }

  /**
     * Specifies the command 'OFF' should be sent as a result of this rule firing.
     *
     * @returns {SendCommandOrUpdateOperation} the operation
     */
  sendOff () {
    this._finishErr();
    return new SendCommandOrUpdateOperation(this, 'OFF');
  }

  /**
     * Specifies a command should be sent to toggle the state of the target object
     * as a result of this rule firing.
     *
     * @returns {ToggleOperation} the operation
     */
  sendToggle () {
    this._finishErr();
    return new ToggleOperation(this);
  }

  /**
     * Specifies a command should be forwarded to the state of the target object
     * as a result of this rule firing. This relies on the trigger being the result
     * of a command itself.
     *
     * @returns {SendCommandOrUpdateOperation} the operation
     */
  sendIt () {
    this._finishErr();
    return new SendCommandOrUpdateOperation(this, args => args.it.toString(), true, 'it');
  }

  /**
     * Specifies a command state should be posted to the target object
     * as a result of this rule firing. This relies on the trigger being the result
     * of a command itself.
     *
     * @returns {SendCommandOrUpdateOperation} the operation
     */
  postIt () {
    this._finishErr();
    return new SendCommandOrUpdateOperation(this, args => args.it.toString(), false, 'it');
  }

  /**
     * Copies the state from one item to another. Can be used to proxy item state. State is updated, not
     * sent as a command.
     *
     * @returns {CopyStateOperation} the operation config
     */
  copyState () {
    this._finishErr();
    return new CopyStateOperation(this, false);
  }

  /**
     * Sends the state from one item to another. Can be used to proxy item state. State is
     * sent as a command.
     *
     * @returns {CopyStateOperation} the operation config
     */
  copyAndSendState () {
    this._finishErr();
    return new CopyStateOperation(this, true);
  }
}

/**
 * {RuleBuilder} RuleBuilder triggers
 * @memberof OperationBuilder
 */
class OperationConfig {
  constructor (operationBuilder) {
    this.operationBuilder = operationBuilder;
  }

  /**
     * Specify the rule group for this rule
     *
     * @param {string} group the group this rule belongs to.
     * @returns {OperationBuilder} this
     */
  inGroup (group) {
    this.group = group;
    return this;
  }

  /**
     * Build this rule
     *
     * @param {string} [name] of the rule
     * @param {string} [description] of the rule
     * @param {Array<String>} [tags] of the rule
     * @param {string} [id] of the rule
     */
  build (name, description, tags, id) {
    this.operationBuilder._then(this, this.group, name, description, tags, id);
  }
}
/**
 * Copies state from one item to another item
 *
 * @memberof OperationBuilder
 * @extends OperationConfig
 * @hideconstructor
 */
class CopyStateOperation extends OperationConfig {
  /**
     * Creates a new operation. Don't use constructor directly.
     *
     * @param {boolean} send whether to send (or post update) the state
     * @hideconstructor
     */
  constructor (operationBuilder, send) {
    super(operationBuilder);
    this.send = send;
  }

  /**
     * Sets the item to copy the state from
     *
     * @param {string} itemName the item to copy state from
     * @returns {CopyStateOperation} this
     */
  fromItem (itemName) {
    this.from_item = itemName;
    return this;
  }

  /**
     * Sets the item to copy the state to
     *
     * @param {string} itemName the item to copy state to
     * @returns {CopyStateOperation} this
     */
  toItem (itemName) {
    this.to_item = itemName;
    return this;
  }

  /**
     * Appends another operation to execute when the rule fires
     * @returns {CopyStateOperation} this
     */
  and () {
    const next = new OperationBuilder(this.operationBuilder.builder, this.fn);
    this.next = next;
    return next;
  }

  /**
     * Runs the operation. Don't call directly.
     *
     * @private
     * @param {object} args rule firing args
     */
  _run (args) {
    if (typeof this.from_item === 'undefined' || this.from_item === null) {
      throw Error('From item not set');
    }

    if (typeof this.to_item === 'undefined' || this.to_item === null) {
      throw Error('To item not set');
    }

    const from = items.getItem(this.from_item);
    if (typeof from === 'undefined' || from === null) {
      throw Error(`Cannot find (from) item ${this.from_item}`);
    }

    const to = items.getItem(this.to_item);
    if (typeof to === 'undefined' || to === null) {
      throw Error(`Cannot find (to) item ${this.to_item}`);
    }

    if (this.send) {
      to.sendCommand(from.state);
    } else {
      to.postUpdate(from.state);
    }
    if (this.next) {
      this.next.execute(args);
    }
  }

  /**
     * Checks that the operation configuration is complete. Don't call directly.
     *
     * @private
     * @returns true only if the operation is ready to run
     */
  _complete () {
    return this.from_item && this.to_item;
  }

  /**
     * Describes the operation.
     *
     * @private
     * @returns a description of the operation
     */
  describe () {
    return `copy state from ${this.from_item} to ${this.to_item}`;
  }
}

/**
 * Sends a command or update to an item
 *
 * @memberof OperationBuilder
 * @extends OperationConfig
 * @hideconstructor
 */
class SendCommandOrUpdateOperation extends OperationConfig {
  constructor (operationBuilder, dataOrSupplier, isCommand = true, optionalDesc) {
    super(operationBuilder);
    /** @private */
    this.isCommand = isCommand;
    if (typeof dataOrSupplier === 'function') {
      this.dataFn = dataOrSupplier;
      this.dataDesc = optionalDesc || '[something]';
    } else {
      this.dataFn = () => dataOrSupplier;
      this.dataDesc = optionalDesc || dataOrSupplier;
    }
  }

  /**
     * Send command to multiple items
     *
     * @param {Item[] | string[]} itemsOrNames the items to send a command to
     * @returns {SendCommandOrUpdateOperation} this
     */
  toItems (itemsOrNames) {
    this.toItemNames = itemsOrNames.map(i => (typeof i === 'string') ? i : i.name);
    return this;
  }

  /**
     * Send command to an item
     *
     * @param {Item | string} itemOrName the item to send a command to
     * @returns {SendCommandOrUpdateOperation} this
     */
  toItem (itemOrName) {
    this.toItemNames = [(typeof itemOrName === 'string') ? itemOrName : itemOrName.name];
    return this;
  }

  /**
     * Send another command
     * @param {*} next
     * @returns {SendCommandOrUpdateOperation} this
     */
  and (next) {
    this.next = next;
    return this;
  }

  /** @private */
  _run (args) {
    for (const toItemName of this.toItemNames) {
      const item = items.getItem(toItemName);
      const data = this.dataFn(args);

      if (this.isCommand) {
        item.sendCommand(data);
      } else {
        item.postUpdate(data);
      }
    }
    this.next && this.next.execute(args);
  }

  /** @private */
  _complete () {
    return (typeof this.toItemNames) !== 'undefined';
  }

  /** @private */
  describe (compact) {
    if (compact) {
      return this.dataDesc + (this.isCommand ? '⌘' : '↻') + this.toItemNames + (this.next ? this.next.describe() : '');
    } else {
      return (this.isCommand ? 'send command' : 'post update') + ` ${this.dataDesc} to ${this.toItemNames}` + (this.next ? ` and ${this.next.describe()}` : '');
    }
  }
}

/**
 * Toggles the state of an item
 *
 * @memberof OperationBuilder
 * @extends OperationConfig
 * @hideconstructor
 */
class ToggleOperation extends OperationConfig {
  constructor (operationBuilder) {
    super(operationBuilder);
    /** @private */
    this.next = null;
    /** @type {function} */
    this.toItem = function (itemName) {
      this.itemName = itemName;
      return this;
    };
    /** @type {function} */
    this.and = function (next) {
      this.next = next;
      return this;
    };
    /** @private */
    this._run = () => this.doToggle() && (this.next && this.next.execute());
    /** @private */
    this._complete = () => true;
    /** @private */
    this.describe = () => `toggle ${this.itemName}` + (this.next ? ` and ${this.next.describe()}` : '');
  }

  /**
     * Toggle the state of an item
     *
     * @returns {SendCommandOrUpdateOperation} this
     */
  doToggle () {
    items.getItem(this.itemName).sendToggleCommand();
  }
}

/**
 * Timing Item state
 *
 * @memberof OperationBuilder
 * @extends OperationConfig
 * @hideconstructor
 */
class TimingItemStateOperation extends OperationConfig {
  constructor (operationBuilder, itemChangedTriggerConfig, duration) {
    super(operationBuilder);
    if (typeof itemChangedTriggerConfig.to_value === 'undefined') {
      throw Error('Must specify item state value to wait for!');
    }

    /** @private */
    this.item_changed_trigger_config = itemChangedTriggerConfig;
    /** @private */
    this.duration_ms = (typeof duration === 'number' ? duration : parseDuration.parse(duration));

    /** @private */
    this._complete = itemChangedTriggerConfig._complete;
    /** @private */
    this.describe = () => itemChangedTriggerConfig.describe() + ' for ' + duration;
  }

  /** @private */
  _toOHTriggers () {
    // each time we're triggered, set a callback.
    // If the item changes to something else, cancel the callback.
    // If the callback executes, run the operation

    // register for all changes as we need to know when it changes away
    switch (this.op_type) {
      case 'changed':
        return [triggers.ChangedEventTrigger(this.item_name)]; // eslint-disable-line no-undef
      default:
        throw Error('Unknown operation type: ' + this.op_type);
    }
  }

  /** @private */
  _executeHook (next) {
    if (items.get(this.item_changed_trigger_config.item_name).toString() === this.item_changed_trigger_config.to_value) {
      this._startWait(next);
    } else {
      this._cancelWait();
    }
  }

  /** @private */
  _startWait (next) {
    this.current_wait = setTimeout(next, this.duration_ms);
  }

  _cancelWait () {
    if (this.current_wait) {
      clearTimeout(this.current_wait);
    }
  }
}

module.exports = {
  SendCommandOrUpdateOperation,
  TimingItemStateOperation,
  ToggleOperation,
  CopyStateOperation,
  OperationBuilder
};
