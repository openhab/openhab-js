/**
 * Rules namespace.
 * This namespace allows creation of openHAB rules.
 *
 * @namespace rules
 */

// typedefs need to be global for TypeScript to fully work
/**
 * @typedef {Object} EventObject When a rule is triggered, the script is provided the event instance that triggered it. The specific data depends on the event type. The `EventObject` provides several information about that trigger.
 *
 * Note:
 * `Group****Trigger`s use the equivalent `Item****Trigger` as trigger for each member.
 *
 * @property {String} oldState only for {@link triggers.ItemStateChangeTrigger} & {@link triggers.GroupStateChangeTrigger}: Previous state of Item or Group that triggered event
 * @property {String} newState only for {@link triggers.ItemStateChangeTrigger} & {@link triggers.GroupStateChangeTrigger}: New state of Item or Group that triggered event
 * @property {String} receivedState only for {@link triggers.ItemStateUpdateTrigger} & {@link triggers.GroupStateUpdateTrigger}: State that triggered event
 * @property {String} receivedCommand only for {@link triggers.ItemCommandTrigger}, {@link triggers.GroupCommandTrigger}, {@link triggers.PWMTrigger} & {@link triggers.PIDTrigger} : Command that triggered event
 * @property {String} itemName for all triggers except {@link triggers.PWMTrigger}: name of Item that triggered event
 * @property {String} receivedEvent only for {@link triggers.ChannelEventTrigger}: Channel event that triggered event
 * @property {String} channelUID only for {@link triggers.ChannelEventTrigger}: UID of channel that triggered event
 * @property {String} oldStatus only for {@link triggers.ThingStatusChangeTrigger}: Previous state of Thing that triggered event
 * @property {String} newStatus only for {@link triggers.ThingStatusChangeTrigger}: New state of Thing that triggered event
 * @property {String} status only for {@link triggers.ThingStatusUpdateTrigger}: State of Thing that triggered event
 * @property {String} eventType for all triggers except {@link triggers.PWMTrigger}, {@link triggers.PIDTrigger}: Type of event that triggered event (change, command, time, triggered, update)
 * @property {String} triggerType for all triggers except {@link triggers.PWMTrigger}, {@link triggers.PIDTrigger}: Type of trigger that triggered event (for `TimeOfDayTrigger`: `GenericCronTrigger`)
 * @property {*} payload for most triggers
 */

/**
 * @callback RuleCallback When a rule is run, a callback is executed.
 * @param {EventObject} event
 */

/**
 * @typedef {Object} RuleConfig configuration for {@link rules.JSRule}
 * @property {String} name name of the rule (used in UI)
 * @property {String} [description] description of the rule (used in UI)
 * @property {triggers|triggers[]} triggers which will fire the rule
 * @property {RuleCallback} execute callback to run when the rule fires
 * @property {String} [id] UID of the rule, if not provided, one is generated
 * @property {String[]} [tags] tags for the rule (used in UI)
 * @property {String} ruleGroup name of rule group to use
 * @property {Boolean} [overwrite=false] whether to overwrite an existing rule with the same UID
 */

const GENERATED_RULE_ITEM_TAG = 'GENERATED_RULE_ITEM';

const items = require('../items');
const utils = require('../utils');
const log = require('../log')('rules');
const osgi = require('../osgi');
const triggers = require('../triggers');
const { automationManager, ruleRegistry } = require('@runtime/RuleSupport');

const RuleManager = osgi.getService('org.openhab.core.automation.RuleManager');
const factory = require('@runtime/rules').factory;

/**
  * Generates an item name given it's configuration.
  *
  * @memberOf rules
  * @private
  * @param {Object} ruleConfig The rule config
  * @param {String} userInfo.name The name of the rule.
  */
const itemNameForRule = function (ruleConfig) {
  return 'vRuleItemFor' + items.safeItemName(ruleConfig.name);
};

/**
  * Links an item to a rule. When the item is switched on or off, so will the rule be.
  *
  * @memberOf rules
  * @private
  * @param {HostRule} rule The rule to link to the item.
  * @param {items.Item} item the item to link to the rule.
  */
const linkItemToRule = function (rule, item) {
  JSRule({
    name: 'vProxyRuleFor' + rule.getName(),
    description: 'Generated Rule to toggle real rule for ' + rule.getName(),
    triggers: [
      triggers.ItemStateUpdateTrigger(item.name)
    ],
    execute: function (data) {
      try {
        const itemState = data.state;
        log.debug('Rule toggle item state received as ' + itemState);
        RuleManager.setEnabled(rule.getUID(), itemState !== 'OFF');
        log.info((itemState === 'OFF' ? 'Disabled' : 'Enabled') + ' rule ' + rule.getName() + ' [' + rule.getUID() + ']');
      } catch (e) {
        log.error('Failed to toggle rule ' + rule.getName() + ': ' + e);
      }
    }
  });
};

/**
  * Gets the groups that an rule-toggling-item should be a member of. Will create the group item if necessary.
  *
  * @memberOf rules
  * @private
  * @param {RuleConfig} ruleConfig The rule config describing the rule
  * @returns {String[]} the group names to put the item in
  */
const getGroupsForItem = function (ruleConfig) {
  if (ruleConfig.ruleGroup) {
    const groupName = 'gRules' + items.safeItemName(ruleConfig.ruleGroup);
    log.debug('Creating rule group ' + ruleConfig.ruleGroup);
    items.replaceItem({
      name: groupName,
      type: 'Group',
      groups: ['gRules'],
      label: ruleConfig.ruleGroup,
      tags: [GENERATED_RULE_ITEM_TAG]
    });
    return [groupName];
  }

  return ['gRules'];
};

/**
  * Check whether a rule exists.
  * Only works for rules created in the same file.
  *
  * @memberOf rules
  * @private
  * @param {String} uid the UID of the rule
  * @returns {Boolean} whether the rule exists
  */
const ruleExists = function (uid) {
  return !(RuleManager.getStatusInfo(uid) == null);
};

/**
  * Remove a rule when it exists. The rule will be immediately removed.
  * Only works for rules created in the same file.
  *
  * @memberOf rules
  * @param {String} uid the UID of the rule
  * @returns {Boolean} whether the rule was actually removed
  */
const removeRule = function (uid) {
  if (ruleExists(uid)) {
    log.info('Removing rule: {}', ruleRegistry.get(uid).name ? ruleRegistry.get(uid).name : uid);
    ruleRegistry.remove(uid);
    return !ruleExists(uid);
  } else {
    return false;
  }
};

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
const runRule = function (uid, args = {}, cond = true) {
  const status = RuleManager.getStatus(uid);
  if (!status) {
    throw Error('There is no rule with UID ' + uid);
  }
  if (status.toString() === 'UNINITIALIZED') {
    throw Error('Rule ' + uid + ' is UNINITIALIZED');
  }

  RuleManager.runNow(uid, cond, args);
};

/**
  * Tests to see if the rule with the given UID is enabled or disabled. Throws
  * and error if the rule doesn't exist.
  *
  * @memberof rules
  * @param {String} uid
  * @returns {Boolean} whether or not the rule is enabled
  * @throws Will throw an error when the rule is not found.
  */
const isEnabled = function (uid) {
  if (!ruleExists(uid)) {
    throw Error('There is no rule with UID ' + uid);
  }
  return RuleManager.isEnabled(uid);
};

/**
  * Enables or disables the rule with the given UID. Throws an error if the
  * rule doesn't exist.
  *
  * @memberof rules
  * @param {String} uid UID of the rule
  * @param {Boolean} isEnabled when true, the rule is enabled, otherwise the rule is disabled
  * @throws Will throw an error when the rule is not found.
  */
const setEnabled = function (uid, isEnabled) {
  if (!ruleExists(uid)) {
    throw Error('There is no rule with UID ' + uid);
  }
  RuleManager.setEnabled(uid, isEnabled);
};

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
const JSRule = function (ruleConfig) {
  const ruid = ruleConfig.id || ruleConfig.name.replace(/[^\w]/g, '-') + '-' + utils.randomUUID();
  if (ruleConfig.overwrite === true) {
    removeRule(ruid);
  }
  if (ruleExists(ruid)) {
    throw Error(`Failed to add rule: ${ruleConfig.name ? ruleConfig.name : ruid}, a rule with same UID [${ruid}] already exists!`);
  }
  const ruTemplateid = ruleConfig.name.replace(/[^\w]/g, '-') + '-' + utils.randomUUID();
  log.info('Adding rule: {}', ruleConfig.name ? ruleConfig.name : ruid);

  const SimpleRule = Java.extend(Java.type('org.openhab.core.automation.module.script.rulesupport.shared.simple.SimpleRule'));

  const doExecute = function (module, input) {
    try {
      return ruleConfig.execute(getTriggeredData(input));
    } catch (error) {
      // logging error is required for meaningful error log message
      // when throwing error: error is caught by core framework and no meaningful message is logged
      let msg;
      if (error.stack) {
        msg = `Failed to execute rule ${ruid}: ${error}: ${error.stack}`;
      } else {
        msg = `Failed to execute rule ${ruid}: ${error}`;
      }
      console.error(msg);
      throw Error(msg);
    }
  };

  let rule = new SimpleRule({
    execute: doExecute,
    getUID: () => ruid
  });

  let triggers = ruleConfig.triggers ? ruleConfig.triggers : ruleConfig.getEventTrigger();
  if (!Array.isArray(triggers)) {
    triggers = [triggers];
  }

  rule.setTemplateUID(ruTemplateid);

  if (ruleConfig.description) {
    rule.setDescription(ruleConfig.description);
  }
  if (ruleConfig.name) {
    rule.setName(ruleConfig.name);
  }
  if (ruleConfig.tags) {
    rule.setTags(utils.jsArrayToJavaSet(ruleConfig.tags));
  }

  // Register rule here
  if (triggers && triggers.length > 0) {
    rule.setTriggers(triggers);
    rule = registerRule(rule);
  }

  return rule;
};

let currentProvider = automationManager;

const withNewRuleProvider = function (fn) {
  const cachedRules = [];
  currentProvider = {
    addRule: r => {
      // r = factory.processRule(r);
      // r.setConfigurationDescriptions(null);
      // r.setConfiguration(null);
      cachedRules.push(factory.processRule(r));
    }
  };

  try {
    fn();
    const provider = factory.newRuleProvider(cachedRules);
    osgi.registerService(provider, Java.type('org.openhab.core.automation.RuleProvider').class.getName());
  } finally {
    currentProvider = automationManager;
  }
};

const withManagedProvider = function (fn) { // eslint-disable-line no-unused-vars
  const previousProvider = currentProvider;
  currentProvider = automationManager;

  try {
    fn();
  } finally {
    currentProvider = previousProvider;
  }
};

const registerRule = function (rule) {
  return currentProvider.addRule(rule);
};

/**
  * Creates a rule, with an associated SwitchItem that can be used to toggle the rule's enabled state.
  * The rule will be created and immediately available.
  *
  * @memberOf rules
  * @param {RuleConfig} ruleConfig The rule config describing the rule
  * @returns {HostRule} the created rule
  * @throws Will throw an error is a rule with the given UID already exists.
  */
const SwitchableJSRule = function (ruleConfig) {
  if (!ruleConfig.name) {
    throw Error('No name specified for rule!');
  }

  // first create a toggling item
  const itemName = itemNameForRule(ruleConfig);

  // then add the item
  const item = items.replaceItem({
    name: itemName,
    type: 'Switch',
    groups: getGroupsForItem(ruleConfig),
    label: ruleConfig.description,
    tags: [GENERATED_RULE_ITEM_TAG]
  });

  // create the real rule
  const rule = JSRule(ruleConfig);

  // hook up a rule to link the item to the actual rule
  linkItemToRule(rule, item);

  if (item.isUninitialized) {
    // possibly load item's prior state
    const historicState = item.history.latestState();

    if (historicState !== null) {
      item.postUpdate(historicState);
    } else {
      item.sendCommand('ON');
    }
  }
};

/**
 * Adds a key's value from a Java HashMap to a JavaScript object (as string) if the HashMap has that key.
 * This function uses the mutable nature of JS objects and does not return anything.
 * @private
 * @param {*} hashMap Java HashMap
 * @param {String} key key from the HashMap to add to the JS object
 * @param {Object} object JavaScript object
 */
const addFromHashMap = (hashMap, key, object) => {
  if (hashMap.containsKey(key)) object[key] = hashMap[key].toString();
};

/**
 * Get rule trigger data from raw Java input and generate JavaScript object.
 * @private
 * @param {*} input raw Java input from openHAB core
 * @returns {rules.EventObject}
 */
const getTriggeredData = function (input) {
  const event = input.get('event');
  const data = {};

  // Properties of data are dynamically added, depending on their availability

  // Item triggers
  if (input.containsKey('command')) data.receivedCommand = input.get('command').toString();
  addFromHashMap(input, 'oldState', data);
  addFromHashMap(input, 'newState', data);
  if (input.containsKey('state')) data.receivedState = input.get('state').toString();

  // Thing triggers
  addFromHashMap(input, 'oldStatus', data);
  addFromHashMap(input, 'newStatus', data);
  addFromHashMap(input, 'status', data);

  // Only with event data (for Item, Thing & Channel triggers)
  if (event) {
    switch (Java.typeName(event.class)) {
      case 'org.openhab.core.items.events.ItemCommandEvent':
        data.itemName = event.getItemName();
        data.eventType = 'command';
        data.triggerType = 'ItemCommandTrigger';
        break;
      case 'org.openhab.core.items.events.ItemStateChangedEvent':
        data.itemName = event.getItemName();
        data.eventType = 'change';
        data.triggerType = 'ItemStateChangeTrigger';
        break;
      case 'org.openhab.core.items.events.ItemStateEvent':
        data.itemName = event.getItemName();
        data.eventType = 'update';
        data.triggerType = 'ItemStateUpdateTrigger';
        Object.defineProperty(
          data,
          'state',
          {
            get: function () {
              console.warn('"state" has been deprecated and will be removed in a future release. Please use "receivedState" instead.');
              return input.get('state').toString();
            }
          }
        );
        break;
      case 'org.openhab.core.thing.events.ThingStatusInfoChangedEvent':
        data.thingUID = event.getThingUID().toString();
        data.eventType = 'change';
        data.triggerType = 'ThingStatusChangeTrigger';
        break;
      case 'org.openhab.core.thing.events.ThingStatusInfoEvent':
        data.thingUID = event.getThingUID().toString();
        data.eventType = 'update';
        data.triggerType = 'ThingStatusUpdateTrigger';
        break;
      case 'org.openhab.core.thing.events.ChannelTriggeredEvent':
        data.channelUID = event.getChannel().toString();
        data.receivedEvent = event.getEvent();
        data.eventType = 'triggered';
        data.triggerType = 'ChannelEventTrigger';
        Object.defineProperty(
          data,
          'receivedTrigger',
          {
            get: function () {
              console.warn('"receivedTrigger" has been deprecated and will be removed in a future release. Please use "receivedEvent" instead.');
              return event.getEvent();
            }
          }
        );
        break;
    }
    data.eventClass = Java.typeName(event.class);
    try {
      if (event.getPayload()) {
        data.payload = JSON.parse(event.getPayload());
        log.debug('Extracted event payload {}', data.payload);
      }
    } catch (e) {
      log.warn('Failed to extract payload: {}', e.message);
    }
  }

  // Always
  addFromHashMap(input, 'module', data);

  // If the ScriptEngine gets an empty input, the trigger is either time based or the rule is run manually!!
  if (input.size() === 0) {
    data.eventType = '';
    data.triggerType = '';
  }

  return data;
};

module.exports = {
  withNewRuleProvider,
  removeRule,
  runRule,
  isEnabled,
  setEnabled,
  JSRule,
  SwitchableJSRule
};
