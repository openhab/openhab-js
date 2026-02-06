/**
 * When a rule is triggered, the script is provided the event instance that triggered it. The specific data depends on the event type. The `EventObject` provides several information about that trigger.
 *
 * Note:
 * `Group****Trigger`s use the equivalent `Item****Trigger` as trigger for each member.
 * Time triggers do not provide any event instance, therefore no property is populated.
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
     * for all Item-related triggers: name of Item that triggered event
     */
    itemName: string;
    /**
     * for all `Group****Trigger`s: name of the group whose member triggered event
     */
    groupName: string;
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
     * for all Thing-related triggers: UID of Thing that triggered event
     */
    thingUID: string;
    /**
     * for {@link triggers.GenericCronTrigger }: cron expression of the trigger
     */
    cronExpression: string;
    /**
     * for {@link triggers.TimeOfDayTrigger }: time of day value of the trigger
     */
    time: string;
    /**
     * for {@link triggers.DateTimeTrigger }: whether the trigger only considers the time part of the DateTime Item
     */
    timeOnly: boolean;
    /**
     * for {@link triggers.DateTimeTrigger }: offset in seconds added to the time of the DateTime Item
     */
    offset: number;
    /**
     * for all triggers except {@link triggers.PWMTrigger }, {@link triggers.PIDTrigger }: Type of event that triggered event (change, command, time, triggered, update, time)
     */
    eventType: string;
    /**
     * for all triggers except {@link triggers.PWMTrigger }, {@link triggers.PIDTrigger }: Type of trigger that triggered event
     */
    triggerType: string;
    /**
     * for all triggers: simple Java class name of the triggering event
     */
    eventName: string;
    /**
     * for all triggers: full Java class name of the triggering event
     */
    eventClass: string;
    /**
     * for all triggers: topic of the triggering event
     */
    eventTopic: string;
    /**
     * for all triggers: source of the triggering event or null if not specified
     */
    eventSource: string | null;
    /**
     * (user-defined or auto-generated) name of trigger
     */
    module: string;
    /**
     * original contents of the event including data passed from a calling rule
     */
    raw: any;
    /**
     * if provided by event: payload of event in Java data types
     */
    payload: any;
};
/**
 * When a rule is run, a callback is executed.
 */
export type RuleCallback = (event: EventObject) => any;
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
    triggers?: HostTrigger | HostTrigger[];
    /**
     * callback to run when the rule fires
     */
    execute: RuleCallback;
    /**
     * tags for the rule (used in UI)
     */
    tags?: string[];
    /**
     * UID of the rule, if not provided, one is generated
     */
    id?: string;
    /**
     * whether to overwrite an existing rule with the same UID
     */
    overwrite?: boolean;
    /**
     * whether to run the rule in a separate dedicated context
     */
    dedicatedContext?: boolean;
    /**
     * (optional and only for {@link SwitchableJSRule }) name of the switch Item, which will get created automatically if it is not existent
     */
    switchItemName?: string;
    /**
     * (optional and only for {@link SwitchableJSRule }) name of an Item group to use for the switch Item, which will get created automatically if it is not existent
     */
    ruleGroup?: string;
};
/**
  * Remove a rule when it exists. The rule will be immediately removed.
  * Only works for rules created in the same file.
  *
  * @memberof rules
  * @param {string} uid the UID of the rule
  * @returns {boolean} whether the rule was actually removed
  */
export function removeRule(uid: string): boolean;
/**
  * Runs the rule with the given UID. Throws errors when the rule doesn't exist
  * or is unable to run (e.g. it's disabled).
  *
  * @memberof rules
  * @param {string} uid the UID of the rule to run
  * @param {object} [args={}] args optional dict of data to pass to the called rule
  * @param {boolean} [cond=true] when true, the called rule will only run if it's conditions are met
  * @throws {Error} throws an error if the rule does not exist or is not initialized.
  */
export function runRule(uid: string, args?: object, cond?: boolean): void;
/**
  * Tests to see if the rule with the given UID is enabled or disabled. Throws
  * and error if the rule doesn't exist.
  *
  * @memberof rules
  * @param {string} uid
  * @returns {boolean} whether or not the rule is enabled
  * @throws {Error} an error when the rule is not found.
  */
export function isEnabled(uid: string): boolean;
/**
  * Enables or disables the rule with the given UID. Throws an error if the rule doesn't exist.
  *
  * @memberof rules
  * @param {string} uid UID of the rule
  * @param {boolean} isEnabled when true, the rule is enabled, otherwise the rule is disabled
  * @throws {Error} an error when the rule is not found.
  */
export function setEnabled(uid: string, isEnabled: boolean): void;
/**
  * Creates a rule. The rule will be created and immediately available.
  *
  * @example
  * import { rules, triggers } = require('openhab');
  *
  * rules.JSRule({
  *   name: "my_new_rule",
  *   description: "this rule swizzles the swallows",
  *   triggers: triggers.GenericCronTrigger("0 30 16 * * ? *"),
  *   execute: (event) => {
  *     // do stuff
  *   }
  * });
  *
  * @memberof rules
  * @param {RuleConfig} ruleConfig The rule config describing the rule
  * @returns {HostRule} the created rule
  * @throws {Error} an error if the rule with the passed in uid already exists and {@link RuleConfig.overwrite} is not `true`
  */
export function JSRule(ruleConfig: RuleConfig): HostRule;
/**
 * Creates a rule, with an associated Switch Item that can be used to toggle the rule's enabled state.
 * The rule will be created and immediately available.
 * The Switch Item will be created automatically unless you pass a {@link RuleConfig}`switchItemName` and an Item with that name already exists.
 *
 * @memberof rules
 * @param {RuleConfig} ruleConfig The rule config describing the rule
 * @returns {HostRule} the created rule
 * @throws {Error} an error is a rule with the given UID already exists.
 */
export function SwitchableJSRule(ruleConfig: RuleConfig): HostRule;
/**
 * Get rule trigger data from raw Java input and generate JavaScript object.
 * This method is not intended for direct use in user scripts, but used internally by JS Scripting.
 *
 * @private
 * @param {*} input raw Java input/context, see
 * {@link https://github.com/openhab/openhab-core/blob/main/bundles/org.openhab.core.automation.module.script/src/main/java/org/openhab/core/automation/module/script/internal/handler/ScriptActionHandler.java ScriptActionHandler}
 * and {@link https://github.com/openhab/openhab-core/blob/main/bundles/org.openhab.core.automation.module.script.rulesupport/src/main/java/org/openhab/core/automation/module/script/rulesupport/shared/simple/SimpleRuleActionHandler.java SimpleRuleActionHandler}
 * @param {boolean} [javaEventBackwardCompat=false] enables backwards compatibility with pure Java event object in UI-based rules
 * @returns {EventObject}
 */
export function _getTriggeredData(input: any, javaEventBackwardCompat?: boolean): EventObject;
//# sourceMappingURL=rules.d.ts.map