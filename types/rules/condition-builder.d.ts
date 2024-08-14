/**
 * Condition that wraps a function to determine whether if passes
 *
 * @extends ConditionConf
 * @hideconstructor
 */
export class FunctionConditionConf extends ConditionConf {
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
 * @extends ConditionConf
 * @hideconstructor
 */
export class ItemStateConditionConf extends ConditionConf {
    constructor(itemName: any, conditionBuilder: any);
    /** @private */
    private item_name;
    /**
      * Checks if Item state is equal to given value.
     *
      * @param {string} value
      * @return {ItemStateConditionConf}
      */
    is(value: string): ItemStateConditionConf;
    values: any[] | string[];
    /**
     * Checks if the Item state is ON.
     *
     * @return {ItemStateConditionConf}
     */
    isOn(): ItemStateConditionConf;
    /**
     * Checks if the Item state is OFF.
     *
     * @return {ItemStateConditionConf}
     */
    isOff(): ItemStateConditionConf;
    /**
       * Checks if item state matches any array of values
       * @param  {...any} values
       * @return {ItemStateConditionConf}
       */
    in(...values: any[]): ItemStateConditionConf;
    /** @private */
    private check;
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
     * @param {*} [fn] the optional function to execute
     * @returns {operations.OperationBuilder}
     */
    then(fn?: any): operations.OperationBuilder;
    /**
      * Condition of an item in determining whether to process rule.
      *
      * @param {string} itemName the name of the item to assess the state
      * @returns {ItemStateConditionConf} the operation config
      */
    stateOfItem(itemName: string): ItemStateConditionConf;
    condition: ItemStateConditionConf;
}
/**
 * {@link RuleBuilder} RuleBuilder conditions
 */
declare class ConditionConf {
    constructor(conditionBuilder: any);
    /** @private */
    private conditionBuilder;
    /**
      * @param {*} [fn] an optional function
      * @returns {operations.OperationBuilder}
      */
    then(fn?: any): operations.OperationBuilder;
}
import operations = require("./operation-builder");
export {};
//# sourceMappingURL=condition-builder.d.ts.map