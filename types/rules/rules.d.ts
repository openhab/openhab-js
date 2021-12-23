export function withNewRuleProvider(fn: any): void;
/**
 * Creates a rule. The rule will be created and immediately available.
 *
 * @example
 * import { rules, triggers } = require('openhab');
 *
 * rules.JSRule({
 *  name: "my_new_rule",
 *  description": "this rule swizzles the swallows",
 *  triggers: triggers.GenericCronTrigger("0 30 16 * * ? *"),
 *  execute: triggerConfig => { //do stuff }
 * });
 *
 * @memberOf rules
 * @param {Object} ruleConfig The rule config describing the rule
 * @param {String} ruleConfig.name the name of the rule
 * @param {String} ruleConfig.description a description of the rule
 * @param {*} ruleConfig.execute callback that will be called when the rule fires
 * @param {HostTrigger|HostTrigger[]} ruleConfig.triggers triggers which will define when to fire the rule
 * @returns {HostRule} the created rule
 */
export function JSRule(ruleConfig: {
    name: string;
    description: string;
    execute: any;
    triggers: HostTrigger | HostTrigger[];
}): HostRule;
/**
 * Creates a rule, with an associated SwitchItem that can be used to toggle the rule's enabled state.
 * The rule will be created and immediately available.
 *
 * @memberOf rules
 * @param {Object} ruleConfig The rule config describing the rule
 * @param {String} ruleConfig.name the name of the rule
 * @param {String} ruleConfig.description a description of the rule
 * @param {*} ruleConfig.execute callback that will be called when the rule fires
 * @param {HostTrigger[]} ruleConfig.triggers triggers which will define when to fire the rule
 * @param {String} ruleConfig.ruleGroup the name of the rule group to use.
 * @returns {HostRule} the created rule
 */
export function SwitchableJSRule(ruleConfig: {
    name: string;
    description: string;
    execute: any;
    triggers: HostTrigger[];
    ruleGroup: string;
}): HostRule;
