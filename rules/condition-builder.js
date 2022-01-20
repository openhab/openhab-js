const operations = require('./operation-builder');
const items = require('../items')

/**
 * Condition that wraps a function to determine whether if passes
 *
 * @hideconstructor
 */
class ConditionBuilder {
    constructor(builder, fn) {
        this.builder = builder
        this.fn = fn;
    }

    _then(condition, fn) {
        this.builder.setCondition(condition);
        return new operations.OperationBuilder(this.builder, fn);
    }

    /**
     * Move to the rule operations
     *
     * @param {*} function the optional function to execute
     * @returns {OperationBuilder}
     */
    then(fn) {
        if (this.fn) {
            this.builder.setCondition(new FunctionConditionConf(this.fn));
        } else {
            throw new Error("'then' can only be called when 'if' is passed a function")
        }
        return new operations.OperationBuilder(this.builder, fn);
    }

    /**
    * Condition of an item in determining whether to process rule.
    *
    * @memberof ConditionBuilder
    * @param {String} itemName the name of the item to assess the state
    * @returns {ItemStateConditionConf} the operation config
    */
    stateOfItem(itemName) {
        this.condition = new ItemStateConditionConf(itemName, this)
        return this.condition;
    }
}

/**
 * {RuleBuilder} RuleBuilder conditions
 * @memberof ConditionBuilder
 */
class ConditionConf {
    constructor(conditionBuilder) {
        this.conditionBuilder = conditionBuilder;
    }
    /**
     *
     * @param {*} function an optional function
     * @returns ConditionBuilder
     */
    then(fn) {
        return this.conditionBuilder._then(this, fn);
    }
}

/**
 * Condition that wraps a function to determine whether if passes
 *
 * @memberof ConditionBuilder
 * @extends ConditionBuilder.ConditionConf
 * @hideconstructor
 */
class FunctionConditionConf extends ConditionConf {
    /**
     * Creates a new function condition. Don't call directly.
     *
     * @param {*} fn callback which determines whether the condition passes
     */
    constructor(fn, conditionBuilder) {
        super(conditionBuilder);
        this.fn = fn;
    }

    /**
     * Checks whether the rule operations should be run
     *
     * @private
     * @param  {...any} args rule trigger arguments
     * @returns {Boolean} true only if the operations should be run
     */
    check(...args) {
        let answer = this.fn(args);
        return answer;
    }
}

/**
 * Condition that wraps a function to determine whether if passes
 *
 * @memberof ConditionBuilder
 * @extends ConditionBuilder.ConditionConf
 * @hideconstructor
 */
class ItemStateConditionConf extends ConditionConf {
    constructor(item_name, conditionBuilder) {
        super(conditionBuilder)
        this.item_name = item_name;
    }

    /**
     * Checks if item state is equal to vlaue
     * @param {*} value
     * @returns {this}
     */
    is(value) {
        this.values = [value];
        return this;
    }

    /**
     * Checks if item state matches any array of values
     * @param  {...any} values
     * @returns {this}
     */
    in(...values) {
        this.values = values;
        return this;
    }

    check(...args) {
        let item = items.getItem(this.item_name);
        if (typeof item === 'undefined' || item === null) {
            throw Error(`Cannot find item: ${this.item_name}`);
        }
        return this.values.includes(item.state);
    }
}

module.exports = {
    FunctionConditionConf,
    ItemStateConditionConf,
    ConditionBuilder
}