/**
 * Condition that wraps a function to determine whether if passes
 *
 * @memberof ConditionBuilder
 * @extends ConditionBuilder.ConditionConf
 * @hideconstructor
 */
export class FunctionConditionConf {
    /**
       * Creates a new function condition. Don't call directly.
       *
       * @param {*} fn callback which determines whether the condition passes
       */
    constructor(fn: any, conditionBuilder: any);
    /** @private */
    private fn;
    /**
       * Checks whether the rule operations should be run
       *
       * @private
       * @param  {...any} args rule trigger arguments
       * @returns {boolean} true only if the operations should be run
       */
    private check;
}
/**
 * Condition that wraps a function to determine whether if passes
 *
 * @memberof ConditionBuilder
 * @extends ConditionBuilder.ConditionConf
 * @hideconstructor
 */
export class ItemStateConditionConf {
    constructor(itemName: any, conditionBuilder: any);
    /** @private */
    private item_name;
    /**
       * Checks if item state is equal to value
       * @param {*} value
       * @returns {this}
       */
    is(value: any): this;
    values: any[];
    /**
       * Checks if item state matches any array of values
       * @param  {...any} values
       * @returns {this}
       */
    in(...values: any[]): this;
    check(...args: any[]): boolean;
}
/**
 * Condition that wraps a function to determine whether if passes
 *
 * @hideconstructor
 */
export class ConditionBuilder {
    constructor(builder: any, fn: any);
    /** @private */
    private _builder;
    /** @private */
    private _fn;
    /** @private */
    private _then;
    /**
     * Move to the rule operations
     *
     * @param {*} fn the optional function to execute
     * @returns {operations.OperationBuilder}
     */
    then(fn: any): operations.OperationBuilder;
    /**
      * Condition of an item in determining whether to process rule.
      *
      * @memberof ConditionBuilder
      * @param {string} itemName the name of the item to assess the state
      * @returns {ItemStateConditionConf} the operation config
      */
    stateOfItem(itemName: string): ItemStateConditionConf;
    condition: ItemStateConditionConf;
}
import operations = require("./operation-builder");
//# sourceMappingURL=condition-builder.d.ts.map