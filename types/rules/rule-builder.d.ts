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
       * @returns {triggers.TriggerBuilder} rule builder
       */
    when(): triggers.TriggerBuilder;
    addTrigger(triggerConf: any): RuleBuilder;
    setCondition(condition: any): RuleBuilder;
    condition: any;
    setOperation(operation: any, optionalRuleGroup: any): HostRule;
    operation: any;
    optionalRuleGroup: any;
    describe(compact: any): string;
}
import triggers = require("./trigger-builder");
export declare function when(withToggle?: boolean): triggers.TriggerBuilder;
//# sourceMappingURL=rule-builder.d.ts.map