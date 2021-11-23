/**  
 * Allows creation of rules in a fluent, human-readable style.
 * 
 * @namespace fluent
 */

const log = require('../log')('fluent');

const items = require('../items/items');

const rules = require('./rules');
const triggers = require('./trigger-conf');
const conditions = require('./condition-conf');

/**
 * Creates rules in a fluent style.
 */
class RuleBuilder {
    constructor(toggleable) {
        this._triggerConfs = [];
        this.toggleable = toggleable;
    }

    when() {
        return new triggers.TriggerBuilder(this);
    }

    addTrigger(triggerConf) {
        if (!triggerConf._complete()) {
            throw Error("Trigger is not complete!");
        }
        this._triggerConfs.push(triggerConf);
        return this;
    }

    setCondition(condition) {
        if (typeof condition === 'function') {
            condition = new conditions.FunctionConditionConf(condition);
        }

        log.debug("Setting condition on rule: {}", condition);

        this.condition = condition;
        return this;
    }

    setOperation(operation, optionalRuleGroup) {
        if (typeof operation === 'function') {
            let operationFunction = operation;
            operation = {
                _complete: () => true,
                _run: x => operationFunction(x),
                describe: () => "custom function"
            }
        } else {
            //first check complete
            if (!operation._complete()) {
                throw Error("Operation is not complete!");
            }
        }

        this.operation = operation;
        this.optionalRuleGroup = optionalRuleGroup;

        let generatedTriggers = this._triggerConfs.flatMap(x => x._toOHTriggers())

        const ruleClass = this.toggleable ? rules.SwitchableJSRule : rules.JSRule;

        let fnToExecute = operation._run.bind(operation); //bind the function to it's instance

        //chain (of responsibility for) the execute hooks
        for (let triggerConf of this._triggerConfs) {
            let next = fnToExecute;
            if (typeof triggerConf._executeHook === 'function') {
                let maybeHook = triggerConf._executeHook();
                if (maybeHook) {
                    let hook = maybeHook.bind(triggerConf); //bind the function to it's instance
                    fnToExecute = function (args) {
                        return hook(next, args);
                    }
                }
            }
        }

        if (typeof this.condition !== 'undefined') { //if conditional, check it first
            log.debug("Adding condition to rule: {}", this.condition);
            let fnWithoutCheck = fnToExecute;
            fnToExecute = (x) => this.condition.check(x) && fnWithoutCheck(x)
        }

        return ruleClass({
            name: this.name || items.safeItemName(this.describe(true)),
            description: this.description || this.describe(true),
            triggers: generatedTriggers,
            ruleGroup: optionalRuleGroup,
            execute: function (data) {
                fnToExecute(data);
            }
        });
    }

    describe(compact) {
        return (compact ? "" : "When ") +
            this._triggerConfs.map(t => t.describe(compact)).join(" or ") +
            (compact ? "→" : " then ") +
            this.operation.describe(compact) +
            ((!compact && this.optionalRuleGroup) ? ` (in group ${this.optionalRuleGroup})` : "");
    }
}

module.exports = {
    RuleBuilder,
    /**
     * Specifies when the rule should occur. Will create a standard rule.
     * 
     * @memberof fluent
     * @param {ItemTriggerConfig|CronTriggerConfig} config specifies the rule triggers
     * @returns {FluentRule} the fluent rule builder
     */
    when: () => new RuleBuilder(false).when()
};

/**
 * Switches on toggle-able rules for all items created in this namespace.
 * 
 * @memberof fluent
 * @name withToggle
 */
module.exports.withToggle = {
    RuleBuilder,
    /**
     * Specifies when the rule should occur. Will create a toggle-able rule.
     * 
     * @memberof fluent
     * @param {ItemTriggerConfig|CronTriggerConfig} config specifies the rule triggers
     * @returns {FluentRule} the fluent rule builder
     */
    when: () => new RuleBuilder(true).when()
};