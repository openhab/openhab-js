const operations = require('./operation-builder');
const items = require('../items/items');

/**
 * Condition that wraps a function to determine whether if passes
 *
 * @hideconstructor
 */
class ConditionBuilder {
  constructor (builder, fn) {
    /** @private */
    this._builder = builder;
    /** @private */
    this._fn = fn;
  }

  /** @private */
  _then (condition, fn) {
    this._builder.setCondition(condition);
    return new operations.OperationBuilder(this._builder, fn);
  }

  /**
   * Move to the rule operations
   *
   * @param {*} [fn] the optional function to execute
   * @returns {operations.OperationBuilder}
   */
  then (fn) {
    if (this._fn) {
      this._builder.setCondition(new FunctionConditionConf(this._fn));
    } else {
      throw new Error("'then' can only be called when 'if' is passed a function");
    }
    return new operations.OperationBuilder(this._builder, fn);
  }

  /**
    * Condition of an item in determining whether to process rule.
    *
    * @memberof ConditionBuilder
    * @param {string} itemName the name of the item to assess the state
    * @returns {ItemStateConditionConf} the operation config
    */
  stateOfItem (itemName) {
    this.condition = new ItemStateConditionConf(itemName, this);
    return this.condition;
  }
}

/**
 * {RuleBuilder} RuleBuilder conditions
 * @memberof ConditionBuilder
 */
class ConditionConf {
  constructor (conditionBuilder) {
    /** @private */
    this.conditionBuilder = conditionBuilder;
  }

  /**
     *
     * @param {*} [fn] an optional function
     * @returns ConditionBuilder
     */
  then (fn) {
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
  constructor (fn, conditionBuilder) {
    super(conditionBuilder);
    /** @private */
    this.fn = fn;
  }

  /**
     * Checks whether the rule operations should be run
     *
     * @private
     * @param  {...any} args rule trigger arguments
     * @returns {boolean} true only if the operations should be run
     */
  check (...args) {
    return this.fn(args);
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
  constructor (itemName, conditionBuilder) {
    super(conditionBuilder);
    /** @private */
    this.item_name = itemName;
  }

  /**
     * Checks if item state is equal to value
     * @param {*} value
     * @returns {this}
     */
  is (value) {
    this.values = [value];
    return this;
  }

  /**
     * Checks if item state matches any array of values
     * @param  {...any} values
     * @returns {this}
     */
  in (...values) {
    this.values = values;
    return this;
  }

  check (...args) {
    const item = items.getItem(this.item_name);
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
};
