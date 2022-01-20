const parse_duration = require('parse-duration');
const items = require('../items');

/**
 * Operation to execute as part of a rule
 * @hideconstructor
 */
class OperationBuilder {
    constructor(builder, fn) {
        this.builder = builder;
        this.fn = fn;
    }

    _finishErr() {
        if (this.fn) {
            throw new Error("rule already completed")
        }
    }

    _then(operation, group, name, description, tags, id) {
        this.builder.name = name;
        this.builder.description = description;
        this.builder.tags = tags;
        this.builder.id = id;
        this.builder.setOperation(operation, group);
    }

    /**
     * Build this rule
     *
     * @param {string} [name] of the rule
     * @param {string} [description] of the rule
     * @param {Array<String>} [tags] of the rule
     * @param {string} [id] of the rule
     */
    build(name, description, tags, id) {
        if (!this.fn) {
            throw new Error("Cannot call build without function")
        }
        this._then(this.fn, this.group, name, description, tags, id);
    }

    /**
     * Specify the rule group for this rule
     * 
     * @param {string} group the group this rule belongs to.
     * @returns {OperationBuilder} this
     */
    inGroup(group) {
        this.group = group;
        return this;
    }

    /**
    * Specifies that a command should be sent as a result of this rule firing.
    * 
    * @param {String} command the command to send
    * @returns {OperationBuilder.SendCommandOrUpdateOperation} the operation
    */
    send(c) {
        this._finishErr()
        return new SendCommandOrUpdateOperation(this, c);
    };

    /**
     * Specifies that an update should be posted as a result of this rule firing.
     * 
     * @param {String} update the update to send
     * @returns {OperationBuilder.SendCommandOrUpdateOperation} the operation
     */
    postUpdate(c) {
        this._finishErr()
        return new SendCommandOrUpdateOperation(this, c, false);
    };

    /**
     * Specifies the a command 'ON' should be sent as a result of this rule firing.
     * 
     * @returns {OperationBuilder.SendCommandOrUpdateOperation} the operation
     */
    sendOn() {
        this._finishErr()
        return new SendCommandOrUpdateOperation(this, "ON");
    };

    /**
     * Specifies the a command 'OFF' should be sent as a result of this rule firing.
     * 
     * @returns {OperationBuilder.SendCommandOrUpdateOperation} the operation
     */
    sendOff() {
        this._finishErr()
        return new SendCommandOrUpdateOperation(this, "OFF");
    };

    /**
     * Specifies a command should be sent to toggle the state of the target object
     * as a result of this rule firing.
     * 
     * @returns {OperationBuilder.ToggleOperation} the operation
     */
    sendToggle() {
        this._finishErr()
        return new ToggleOperation(this);
    };

    /**
     * Specifies a command should be forwarded to the state of the target object
     * as a result of this rule firing. This relies on the trigger being the result
     * of a command itself.
     * 
     * @returns {OperationBuilder.SendCommandOrUpdateOperation} the operation
     */
    sendIt() {
        this._finishErr()
        return new SendCommandOrUpdateOperation(this, args => args.it.toString(), true, "it");
    };

    /**
     * Specifies a command state should be posted to the target object
     * as a result of this rule firing. This relies on the trigger being the result
     * of a command itself.
     * 
     * @returns {OperationBuilder.SendCommandOrUpdateOperation} the operation
     */
    postIt() {
        this._finishErr()
        return new SendCommandOrUpdateOperation(this, args => args.it.toString(), false, "it");
    };

    /**
     * Copies the state from one item to another. Can be used to proxy item state. State is updated, not
     * sent as a command.
     * 
     * @returns {OperationBuilder.CopyStateOperation} the operation config
     */
    copyState() {
        this._finishErr()
        return new CopyStateOperation(this, false);
    };

    /**
     * Sends the state from one item to another. Can be used to proxy item state. State is
     * sent as a command.
     * 
     * @returns {OperationBuilder.CopyStateOperation} the operation config
     */
    copyAndSendState() {
        this._finishErr()
        return new CopyStateOperation(this, true);
    };
}

/**
 * {RuleBuilder} RuleBuilder triggers
 * @memberof OperationBuilder
 */
class OperationConfig {
    constructor(operationBuilder) {
        this.operationBuilder = operationBuilder;
    }

    
     /**
     * Specify the rule group for this rule
     * 
     * @param {string} group the group this rule belongs to.
     * @returns {OperationBuilder} this
     */
    inGroup(group) {
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
    build(name, description, tags, id) {
        this.operationBuilder._then(this, this.group, name, description, tags, id);
    }
}
/**
 * Copies state from one item to another item
 * 
 * @memberof OperationBuilder
 * @extends OperationBuilder.OperationConfig
 * @hideconstructor
 */
class CopyStateOperation extends OperationConfig {

    /**
     * Creates a new operation. Don't use constructor directly.
     * 
     * @param {Boolean} send whether to send (or post update) the state
     * @hideconstructor
     */
    constructor(operationBuilder, send) {
        super(operationBuilder);
        this.send = send;
    }

    /**
     * Sets the item to copy the state from
     * 
     * @param {String} item_name the item to copy state from
     * @returns {OperationBuilder.CopyStateOperation} this
     */
    fromItem(item_name) {
        this.from_item = item_name;
        return this;
    }

    /**
     * Sets the item to copy the state to
     * 
     * @param {String} item_name the item to copy state to
     * @returns {OperationBuilder.CopyStateOperation} this
     */
    toItem(item_name) {
        this.to_item = item_name;
        return this;
    }

    /**
     * Appends another operation to execute when the rule fires
     * 
     * @returns {OperationBuilder.CopyStateOperation} this
     */
    and() {
        let next = new OperationBuilder(this.operationBuilder.builder, fn);
        this.next = next;
        return next;
    }

    /**
     * Runs the operation. Don't call directly.
     * 
     * @private
     * @param {Object} args rule firing args
     */
    _run(args) {

        if (typeof this.from_item === 'undefined' || this.from_item === null) {
            throw Error("From item not set");
        }

        if (typeof this.to_item === 'undefined' || this.to_item === null) {
            throw Error("To item not set");
        }

        let from = items.getItem(this.from_item);
        if (typeof from === 'undefined' || from === null) {
            throw Error(`Cannot find (from) item ${this.from_item}`);
        }

        let to = items.getItem(this.to_item);
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
    _complete() {
        return this.from_item && this.to_item;
    }

    /**
     * Describes the operation.
     * 
     * @private
     * @returns a description of the operation
     */
    describe() {
        return `copy state from ${this.from_item} to ${this.to_item}`
    }
}

/**
 * Sends a command or update to an item
 * 
 * @memberof OperationBuilder
 * @extends OperationBuilder.OperationConfig
 * @hideconstructor
 */
class SendCommandOrUpdateOperation extends OperationConfig {
    constructor(operationBuilder, dataOrSupplier, isCommand = true, optionalDesc) {
        super(operationBuilder);
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
     * @param {*} itemsOrNames the items to send a command to
     * @returns {OperationBuilder.SendCommandOrUpdateOperation} this
     */
    toItems(itemsOrNames) {
        this.toItemNames = itemsOrNames.map(i => (typeof i === 'string') ? i : i.name)
        return this;
    }

    /**
     * Send command to an item
     * 
     * @param {*} itemOrName the item to send a command to
     * @returns {OperationBuilder.SendCommandOrUpdateOperation} this
     */
    toItem(itemOrName) {
        this.toItemNames = [(typeof itemOrName === 'string') ? itemOrName : itemOrName.name];
        return this;
    }

    /**
     * Send another command
     * @param {*} next 
     * @returns {OperationBuilder.SendCommandOrUpdateOperation} this
     */
    and(next) {
        this.next = next;
        return this;
    }

    _run(args) {
        for (let toItemName of this.toItemNames) {
            let item = items.getItem(toItemName);
            let data = this.dataFn(args);

            if (this.isCommand) {
                item.sendCommand(data)
            } else {
                item.postUpdate(data);
            }
        }
        this.next && this.next.execute(args);
    }

    _complete() {
        return (typeof this.toItemNames) !== 'undefined';
    }

    describe(compact) {
        if (compact) {
            return this.dataDesc + (this.isCommand ? '⌘' : '↻') + this.toItemNames + (this.next ? this.next.describe() : "")
        } else {
            return (this.isCommand ? 'send command' : 'post update') + ` ${this.dataDesc} to ${this.toItemNames}` + (this.next ? ` and ${this.next.describe()}` : "")
        }
    }
}

/**
 * Toggles the state of an item
 * 
 * @memberof OperationBuilder
 * @extends OperationBuilder.OperationConfig
 * @hideconstructor
 */
class ToggleOperation extends OperationConfig {
    constructor(operationBuilder) {
        super(operationBuilder);
        this.next = null;
        this.toItem = function (itemName) {
            this.itemName = itemName;
            return this;
        };
        this.and = function (next) {
            this.next = next;
            return this;
        };
        this._run = () => this.doToggle() && (this.next && this.next.execute())
        this._complete = () => true;
        this.describe = () => `toggle ${this.itemName}` + (this.next ? ` and ${this.next.describe()}` : "")
    }

     /**
     * Toggle the state of an item
     * 
     * @returns {OperationBuilder.SendCommandOrUpdateOperation} this
     */
    doToggle() {
        let item = items.getItem(this.itemName);

        switch (item.type) {
            case "SwitchItem": {
                let toSend = ('ON' == item.state) ? 'OFF' : 'ON';
                item.sendCommand(toSend);
                break;
            }
            case "ColorItem": {
                let toSend = ('0' != item.rawState.getBrightness().toString()) ? 'OFF' : 'ON';
                item.sendCommand(toSend);
                break;
            }
            default:
                throw error(`Toggle not supported for items of type ${item.type}`);
        }
    }
}

/**
 * Timing Item state
 * 
 * @memberof OperationBuilder
 * @extends OperationBuilder.OperationConfig
 * @hideconstructor
 */
class TimingItemStateOperation extends OperationConfig {
    constructor(operationBuilder, item_changed_trigger_config, duration) {
        super(operationBuilder);
        if (typeof item_changed_trigger_config.to_value === 'undefined') {
            throw error("Must specify item state value to wait for!");
        }

        this.item_changed_trigger_config = item_changed_trigger_config;
        this.duration_ms = (typeof duration === 'Number' ? duration : parse_duration.parse(duration))

        this._complete = item_changed_trigger_config._complete;
        this.describe = () => item_changed_trigger_config.describe() + " for " + duration;
    }

    _toOHTriggers() {
        //each time we're triggered, set a callback. 
        //If the item changes to something else, cancel the callback.
        //If the callback executes, run the operation

        //register for all changes as we need to know when it changes away
        switch (this.op_type) {
            case "changed":
                return [triggers.ChangedEventTrigger(this.item_name)];
            default:
                throw error("Unknown operation type: " + this.op_type);
        }
    }

    _executeHook(next) {
        if (items.get(this.item_changed_trigger_config.item_name).toString() === this.item_changed_trigger_config.to_value) {
            _start_wait(next);
        } else {
            _cancel_wait();
        }
    }

    _start_wait(next) {
        this.current_wait = setTimeout(next, this.duration_ms);
    }

    _cancel_wait() {
        if (this.current_wait) {
            cancelTimeout(this.current_wait);
        }
    }


}

module.exports = {
    SendCommandOrUpdateOperation,
    TimingItemStateOperation,
    ToggleOperation,
    CopyStateOperation,
    OperationBuilder
}