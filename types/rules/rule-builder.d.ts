export type TriggerBuilder = import("./trigger-builder").TriggerBuilder;
/**
* Create a new {RuleBuilder} chain for easily creating rules.
*
* @example <caption>Basic rule</caption>
* rules.when().item("F1_Light").changed().then().send("changed").toItem("F2_Light").build("My Rule", "My First Rule");
*
* @example <caption>Rule with function</caption>
* rules.when().item("F1_light").changed().to("100").then(event => {
*   console.log(event)
*  }).build("Test Rule", "My Test Rule");
*
* @memberof rules
* @param {boolean} withToggle rule can be toggled on or off (optional)
* @returns {TriggerBuilder} rule builder
*/
export function when(withToggle: boolean): TriggerBuilder;
/**
 * Creates rules in a fluent style.
 * @param {boolean} toggleable if this builder is toggleable
 */
export class RuleBuilder {
    constructor(toggleable: any);
    _triggerConfs: any[];
    toggleable: any;
    /**
     * Specifies when the rule should occur. Will create a standard rule.
     *
     * @returns {TriggerBuilder} rule builder
     */
    when(): TriggerBuilder;
    addTrigger(triggerConf: any): RuleBuilder;
    setCondition(condition: any): RuleBuilder;
    condition: any;
    setOperation(operation: any, optionalRuleGroup: any): any;
    operation: any;
    optionalRuleGroup: any;
    describe(compact: any): string;
}
