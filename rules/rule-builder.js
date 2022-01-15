const items = require('../items');
const rules = require('./rules');
const triggers = require('./trigger-builder');
const conditions = require('./condition-builder');

/**
 * Creates rules in a fluent style.
 * @param {boolean} toggleable if this builder is toggleable
 */
class RuleBuilder {
    constructor(toggleable) {
        this._triggerConfs = [];
        this.toggleable = toggleable || false;
    }

    /**
     * Specifies when the rule should occur. Will create a standard rule.
     * 
     * @returns {TriggerBuilder} rule builder
     */
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
            },
            tags: this.tags || [],
            id: this.id
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
    when: withToggle => new RuleBuilder(withToggle).when()
};