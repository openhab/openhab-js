/**
 * When a rule is triggered, the script is provided the event instance that triggered it. The specific data depends on the event type. The `EventObject` provides several information about that trigger.
 *
 * Note:
 * `Group****Trigger`s use the equivalent `Item****Trigger` as trigger for each member.
 */
export type EventObject = {
    /**
     * only for {@link triggers.ItemStateChangeTrigger } & {@link triggers.GroupStateChangeTrigger }: Previous state of Item or Group that triggered event
     */
    oldState: string;
    /**
     * only for {@link triggers.ItemStateChangeTrigger } & {@link triggers.GroupStateChangeTrigger }: New state of Item or Group that triggered event
     */
    newState: string;
    /**
     * only for {@link triggers.ItemStateUpdateTrigger } & {@link triggers.GroupStateUpdateTrigger }: State that triggered event
     */
    receivedState: string;
    /**
     * only for {@link triggers.ItemCommandTrigger }, {@link triggers.GroupCommandTrigger }, {@link triggers.PWMTrigger } & {@link triggers.PIDTrigger } : Command that triggered event
     */
    receivedCommand: string;
    /**
     * for all triggers except {@link triggers.PWMTrigger }: name of Item that triggered event
     */
    itemName: string;
    /**
     * only for {@link triggers.ChannelEventTrigger }: Channel event that triggered event
     */
    receivedEvent: string;
    /**
     * only for {@link triggers.ChannelEventTrigger }: UID of channel that triggered event
     */
    channelUID: string;
    /**
     * only for {@link triggers.ThingStatusChangeTrigger }: Previous state of Thing that triggered event
     */
    oldStatus: string;
    /**
     * only for {@link triggers.ThingStatusChangeTrigger }: New state of Thing that triggered event
     */
    newStatus: string;
    /**
     * only for {@link triggers.ThingStatusUpdateTrigger }: State of Thing that triggered event
     */
    status: string;
    /**
     * for all triggers except {@link triggers.PWMTrigger }, {@link triggers.PIDTrigger }: Type of event that triggered event (change, command, time, triggered, update)
     */
    eventType: string;
    /**
     * for all triggers except {@link triggers.PWMTrigger }, {@link triggers.PIDTrigger }: Type of trigger that triggered event (for `TimeOfDayTrigger`: `GenericCronTrigger`)
     */
    triggerType: string;
    /**
     * for most triggers
     */
    payload: any;
};
/**
 * When a rule is run, a callback is executed.
 */
export type RuleCallback = (event: EventObject) => any;
/**
 * configuration for {@link rules.JSRule }
 */
export type RuleConfig = {
    /**
     * name of the rule (used in UI)
     */
    name: string;
    /**
     * description of the rule (used in UI)
     */
    description?: string;
    /**
     * which will fire the rule
     */
    triggers: typeof triggers | (typeof triggers)[];
    /**
     * callback to run when the rule fires
     */
    execute: RuleCallback;
    /**
     * UID of the rule, if not provided, one is generated
     */
    id?: string;
    /**
     * tags for the rule (used in UI)
     */
    tags?: string[];
    /**
     * name of rule group to use
     */
    ruleGroup: string;
    /**
     * whether to overwrite an existing rule with the same UID
     */
    overwrite?: boolean;
};
export function withNewRuleProvider(fn: any): void;
/**
  * Remove a rule when it exists. The rule will be immediately removed.
  * Only works for rules created in the same file.
  *
  * @memberOf rules
  * @param {String} uid the UID of the rule
  * @returns {Boolean} whether the rule was actually removed
  */
export function removeRule(uid: string): boolean;
/**
  * Runs the rule with the given UID. Throws errors when the rule doesn't exist
  * or is unable to run (e.g. it's disabled).
  *
  * @memberOf rules
  * @param {String} uid the UID of the rule to run
  * @param {Map<Object>} [args={}] args optional dict of data to pass to the called rule
  * @param {Boolean} [cond=true] when true, the called rule will only run if it's conditions are met
  * @throws Will throw an error if the rule does not exist or is not initialized.
  */
export function runRule(uid: string, args?: Map<any, any>, cond?: boolean): void;
/**
  * Tests to see if the rule with the given UID is enabled or disabled. Throws
  * and error if the rule doesn't exist.
  *
  * @memberof rules
  * @param {String} uid
  * @returns {Boolean} whether or not the rule is enabled
  * @throws Will throw an error when the rule is not found.
  */
export function isEnabled(uid: string): boolean;
/**
  * Enables or disables the rule with the given UID. Throws an error if the
  * rule doesn't exist.
  *
  * @memberof rules
  * @param {String} uid UID of the rule
  * @param {Boolean} isEnabled when true, the rule is enabled, otherwise the rule is disabled
  * @throws Will throw an error when the rule is not found.
  */
export function setEnabled(uid: string, isEnabled: boolean): void;
/**
  * Creates a rule. The rule will be created and immediately available.
  *
  * @example
  * import { rules, triggers } = require('openhab');
  *
  * rules.JSRule({
  *  name: "my_new_rule",
  *  description: "this rule swizzles the swallows",
  *  triggers: triggers.GenericCronTrigger("0 30 16 * * ? *"),
  *  execute: (event) => { // do stuff }
  * });
  *
  * @memberOf rules
  * @param {RuleConfig} ruleConfig The rule config describing the rule
  * @returns {HostRule} the created rule
  * @throws Will throw an error if the rule with the passed in uid already exists
  */
export function JSRule(ruleConfig: RuleConfig): HostRule;
/**
  * Creates a rule, with an associated SwitchItem that can be used to toggle the rule's enabled state.
  * The rule will be created and immediately available.
  *
  * @memberOf rules
  * @param {RuleConfig} ruleConfig The rule config describing the rule
  * @returns {HostRule} the created rule
  * @throws Will throw an error is a rule with the given UID already exists.
  */
export function SwitchableJSRule(ruleConfig: RuleConfig): HostRule;
import triggers = require("../triggers");
//# sourceMappingURL=rules.d.ts.map