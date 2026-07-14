/**
 * Creates rules in a fluent style.
 * @param {boolean} toggleable if this builder is toggleable
 */
export class RuleBuilder {
    constructor(toggleable: any);
    /** @private */
    private _triggerConfs;
    /** @private */
    private toggleable;
    /**
       * Specifies when the rule should occur. Will create a standard rule.
       *
       * @returns {triggers.TriggerBuilder} rule builder
       */
    when(): triggers.TriggerBuilder;
    /** @private */
    private addTrigger;
    /** @private */
    private setCondition;
    /** @private */
    private condition;
    /** @private */
    private setOperation;
    /** @private */
    private operation;
    /** @private */
    private optionalRuleGroup;
    describe(compact: any): string;
}
import triggers = require("./trigger-builder");
export declare function when(withToggle?: boolean): triggers.TriggerBuilder;
//# sourceMappingURL=rule-builder.d.ts.map