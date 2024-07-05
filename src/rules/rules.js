/**
 * Rules namespace.
 * This namespace allows creation of openHAB rules.
 *
 * @namespace rules
 */

// typedefs need to be global for TypeScript to fully work
/**
 * @typedef {object} EventObject When a rule is triggered, the script is provided the event instance that triggered it. The specific data depends on the event type. The `EventObject` provides several information about that trigger.
 *
 * Note:
 * `Group****Trigger`s use the equivalent `Item****Trigger` as trigger for each member.
 * Time triggers do not provide any event instance, therefore no property is populated.
 *
 * @property {string} oldState only for {@link triggers.ItemStateChangeTrigger} & {@link triggers.GroupStateChangeTrigger}: Previous state of Item or Group that triggered event
 * @property {string} newState only for {@link triggers.ItemStateChangeTrigger} & {@link triggers.GroupStateChangeTrigger}: New state of Item or Group that triggered event
 * @property {string} receivedState only for {@link triggers.ItemStateUpdateTrigger} & {@link triggers.GroupStateUpdateTrigger}: State that triggered event
 * @property {string} receivedCommand only for {@link triggers.ItemCommandTrigger}, {@link triggers.GroupCommandTrigger}, {@link triggers.PWMTrigger} & {@link triggers.PIDTrigger} : Command that triggered event
 * @property {string} itemName for all Item-related triggers: name of Item that triggered event
 * @property {string} groupName for all `Group****Trigger`s: name of the group whose member triggered event
 * @property {string} receivedEvent only for {@link triggers.ChannelEventTrigger}: Channel event that triggered event
 * @property {string} channelUID only for {@link triggers.ChannelEventTrigger}: UID of channel that triggered event
 * @property {string} oldStatus only for {@link triggers.ThingStatusChangeTrigger}: Previous state of Thing that triggered event
 * @property {string} newStatus only for {@link triggers.ThingStatusChangeTrigger}: New state of Thing that triggered event
 * @property {string} status only for {@link triggers.ThingStatusUpdateTrigger}: State of Thing that triggered event
 * @property {string} thingUID for all Thing-related triggers: UID of Thing that triggered event
 * @property {string} cronExpression for {@link triggers.GenericCronTrigger}: cron expression of the trigger
 * @property {string} time for {@link triggers.TimeOfDayTrigger}: time of day value of the trigger
 * @property {string} eventType for all triggers except {@link triggers.PWMTrigger}, {@link triggers.PIDTrigger}: Type of event that triggered event (change, command, time, triggered, update, time)
 * @property {string} triggerType for all triggers except {@link triggers.PWMTrigger}, {@link triggers.PIDTrigger}: Type of trigger that triggered event
 * @property {string} eventClass for all triggers: Java class name of the triggering event
 * @property {string} module (user-defined or auto-generated) name of trigger
 * @property {*} raw original contents of the event including data passed from a calling rule
 * @property {*} payload if provided by event: payload of event in Java data types
 */

/**
 * @callback RuleCallback When a rule is run, a callback is executed.
 * @param {EventObject} event
 */

/**
 * @typedef {object} RuleConfig configuration for {@link rules.JSRule}
 * @property {string} name name of the rule (used in UI)
 * @property {string} [description] description of the rule (used in UI)
 * @property {HostTrigger|HostTrigger[]} triggers which will fire the rule
 * @property {RuleCallback} execute callback to run when the rule fires
 * @property {string} [id] UID of the rule, if not provided, one is generated
 * @property {string[]} [tags] tags for the rule (used in UI)
 * @property {string} [ruleGroup] name of rule group to use
 * @property {boolean} [overwrite=false] whether to overwrite an existing rule with the same UID
 * @property {string} [switchItemName] (optional and only for {@link SwitchableJSRule}) name of the switch Item, which will get created automatically if it is not existent
 */

const GENERATED_RULE_ITEM_TAG = 'GENERATED_RULE_ITEM';

const items = require('../items/items');
const { randomUUID, jsArrayToJavaSet } = require('../utils');
const log = require('../log')('rules');
const { getService } = require('../osgi');
const triggers = require('../triggers');
const time = require('../time');

const { automationManager, ruleRegistry } = require('@runtime/RuleSupport');

const RuleManager = getService('org.openhab.core.automation.RuleManager');

/**
  * Links an Item to a rule. When the Item is switched on or off, so will the rule be.
  *
  * @private
  * @param {HostRule} rule The rule to link to the Item.
  * @param {items.Item} item the Item to link to the rule.
  */
function _linkItemToRule (rule, item) {
  if (item.type !== 'Switch') {
    throw new Error('The linked Item for SwitchableJSRule must be a Switch Item!');
  }
  JSRule({
    name: 'vProxyRuleFor' + rule.getName(),
    description: 'Generated Rule to toggle real rule for ' + rule.getName(),
    triggers: [
      triggers.ItemStateUpdateTrigger(item.name)
    ],
    execute: function (data) {
      try {
        const itemState = data.receivedState;
        log.debug('Rule toggle Item state received as ' + itemState);
        RuleManager.setEnabled(rule.getUID(), itemState !== 'OFF');
        log.info((itemState === 'OFF' ? 'Disabled' : 'Enabled') + ' rule ' + rule.getName() + ' [' + rule.getUID() + ']');
      } catch (e) {
        log.error('Failed to toggle rule ' + rule.getName() + ': ' + e);
      }
    }
  });
}

/**
  * Gets the groups that a rule-toggling Item should be a member of. Will create the group Item if necessary.
  *
  * @private
  * @param {RuleConfig} ruleConfig The rule config describing the rule
  * @returns {string} the group name to put the Item in
  */
function _getGroupForItem (ruleConfig) {
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
    return groupName;
  }

  return 'gRules';
}

/**
  * Check whether a rule exists.
  * Only works for rules created in the same file.
  *
  * @private
  * @param {string} uid the UID of the rule
  * @returns {boolean} whether the rule exists
  */
function _ruleExists (uid) {
  return !(RuleManager.getStatusInfo(uid) == null);
}

/**
  * Remove a rule when it exists. The rule will be immediately removed.
  * Only works for rules created in the same file.
  *
  * @memberof rules
  * @param {string} uid the UID of the rule
  * @returns {boolean} whether the rule was actually removed
  */
function removeRule (uid) {
  if (_ruleExists(uid)) {
    log.info('Removing rule: {}', ruleRegistry.get(uid).name ? ruleRegistry.get(uid).name : uid);
    ruleRegistry.remove(uid);
    return !_ruleExists(uid);
  } else {
    return false;
  }
}

/**
  * Runs the rule with the given UID. Throws errors when the rule doesn't exist
  * or is unable to run (e.g. it's disabled).
  *
  * @memberof rules
  * @param {string} uid the UID of the rule to run
  * @param {object} [args={}] args optional dict of data to pass to the called rule
  * @param {boolean} [cond=true] when true, the called rule will only run if it's conditions are met
  * @throws Will throw an error if the rule does not exist or is not initialized.
  */
function runRule (uid, args = {}, cond = true) {
  const status = RuleManager.getStatus(uid);
  if (!status) {
    throw Error('There is no rule with UID ' + uid);
  }
  if (status.toString() === 'UNINITIALIZED') {
    throw Error('Rule ' + uid + ' is UNINITIALIZED');
  }

  RuleManager.runNow(uid, cond, args);
}

/**
  * Tests to see if the rule with the given UID is enabled or disabled. Throws
  * and error if the rule doesn't exist.
  *
  * @memberof rules
  * @param {string} uid
  * @returns {boolean} whether or not the rule is enabled
  * @throws {Error} an error when the rule is not found.
  */
function isEnabled (uid) {
  if (!_ruleExists(uid)) {
    throw Error('There is no rule with UID ' + uid);
  }
  return RuleManager.isEnabled(uid);
}

/**
  * Enables or disables the rule with the given UID. Throws an error if the rule doesn't exist.
  *
  * @memberof rules
  * @param {string} uid UID of the rule
  * @param {boolean} isEnabled when true, the rule is enabled, otherwise the rule is disabled
  * @throws {Error} an error when the rule is not found.
  */
function setEnabled (uid, isEnabled) {
  if (!_ruleExists(uid)) {
    throw Error('There is no rule with UID ' + uid);
  }
  RuleManager.setEnabled(uid, isEnabled);
}

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
  * @memberof rules
  * @param {RuleConfig} ruleConfig The rule config describing the rule
  * @returns {HostRule} the created rule
  * @throws {Error} an error if the rule with the passed in uid already exists and {@link RuleConfig.overwrite} is not `true`
  */
function JSRule (ruleConfig) {
  const ruleUID = ruleConfig.id || ruleConfig.name.replace(/[^\w]/g, '-') + '-' + randomUUID();
  if (ruleConfig.overwrite === true) {
    removeRule(ruleUID);
  }
  if (_ruleExists(ruleUID)) {
    throw Error(`Failed to add rule: ${ruleConfig.name ? ruleConfig.name : ruleUID}, a rule with same UID [${ruleUID}] already exists!`);
  }
  log.info('Adding rule: {}', ruleConfig.name ? ruleConfig.name : ruleUID);

  const SimpleRule = Java.extend(Java.type('org.openhab.core.automation.module.script.rulesupport.shared.simple.SimpleRule'));

  function doExecute (module, input) {
    try {
      return ruleConfig.execute(_getTriggeredData(input));
    } catch (error) {
      // logging error is required for meaningful error log message
      // when throwing error: error is caught by core framework and no meaningful message is logged
      let msg;
      if (error.stack) {
        msg = `Failed to execute rule ${ruleUID}: ${error}: ${error.stack}`;
      } else {
        msg = `Failed to execute rule ${ruleUID}: ${error}`;
      }
      console.error(msg);
      throw Error(msg);
    }
  }

  let rule = new SimpleRule({
    execute: doExecute,
    getUID: () => ruleUID
  });

  rule.setTemplateUID(ruleUID); // Not sure if we need this at all

  if (ruleConfig.description) {
    rule.setDescription(ruleConfig.description);
  }
  if (ruleConfig.name) {
    rule.setName(ruleConfig.name);
  }
  if (ruleConfig.tags) {
    rule.setTags(jsArrayToJavaSet(ruleConfig.tags));
  }

  // Register rule here
  if (ruleConfig.triggers) {
    if (!Array.isArray(ruleConfig.triggers)) ruleConfig.triggers = [ruleConfig.triggers];
    rule.setTriggers(ruleConfig.triggers);
    rule = automationManager.addRule(rule);
  } else {
    throw new Error(`Triggers are missing for rule "${ruleConfig.name ? ruleConfig.name : ruleUID}"!`);
  }

  // Add config to the action so that MainUI can show the script
  const actionConfiguration = rule.actions.get(0).getConfiguration();
  actionConfiguration.put('type', 'application/javascript');
  actionConfiguration.put('script', '// Code to run when the rule fires:\n// Note that Rule Builder is currently not supported!\n\n' + ruleConfig.execute.toString());

  return rule;
}

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
function SwitchableJSRule (ruleConfig) {
  if (!ruleConfig.name) {
    throw Error('No name specified for rule!');
  }

  // First create a toggling Item
  const itemName = ruleConfig.switchItemName || 'vRuleItemFor' + items.safeItemName(ruleConfig.name);
  if (!items.existsItem(itemName)) {
    log.info(`Creating Item: ${itemName}`);
    items.addItem({
      name: itemName,
      type: 'Switch',
      groups: [_getGroupForItem(ruleConfig)],
      label: ruleConfig.description,
      tags: [GENERATED_RULE_ITEM_TAG]
    });
  }
  const item = items.getItem(itemName);

  // create the real rule
  const rule = JSRule(ruleConfig);

  // hook up a rule to link the item to the actual rule
  _linkItemToRule(rule, item);

  if (item.isUninitialized) {
    // possibly load item's prior state
    let historicState = null;
    try {
      historicState = item.persistence.persistedState(time.ZonedDateTime.now()).state;
    } catch (e) {
      log.warn(`Failed to get historic state of ${item.name} for rule ${ruleConfig.name}: ${e}`);
    }

    if (historicState !== null) {
      item.postUpdate(historicState);
    } else {
      item.sendCommand('ON');
    }
  }

  RuleManager.setEnabled(rule.getUID(), item.state !== 'OFF');
}

/**
 * Adds a key's value from a Java HashMap to a JavaScript object (as string) if the HashMap has that key.
 * This function uses the mutable nature of JS objects and does not return anything.
 *
 * @private
 * @param {*} hashMap Java HashMap
 * @param {string} key key from the HashMap to add to the JS object
 * @param {object} object JavaScript object
 */
function _addFromHashMap (hashMap, key, object) {
  if (hashMap.containsKey(key)) object[key] = hashMap[key].toString();
}

/**
 * Get rule trigger data from raw Java input and generate JavaScript object.
 *
 * @private
 * @param {*} input raw Java input from openHAB core
 * @returns {rules.EventObject}
 */
function _getTriggeredData (input) {
  const event = input.get('event');
  const data = {};

  // Add input to data to passthrough any properties not captured below
  data.raw = input;

  // Dynamically added properties, depending on their availability

  // Item triggers
  if (input.containsKey('command')) data.receivedCommand = input.get('command').toString();
  _addFromHashMap(input, 'oldState', data);
  _addFromHashMap(input, 'newState', data);
  if (input.containsKey('state')) data.receivedState = input.get('state').toString();

  // Group Item triggers
  if (input.containsKey('triggeringGroup')) data.groupName = input.get('triggeringGroup').getName();

  // Thing triggers
  _addFromHashMap(input, 'oldStatus', data);
  _addFromHashMap(input, 'newStatus', data);
  _addFromHashMap(input, 'status', data);

  // Properties added if event is available

  if (event) {
    data.eventClass = Java.typeName(event.getClass());

    try {
      if (event.getPayload()) {
        data.payload = JSON.parse(event.getPayload());
        log.debug('Extracted event payload {}', data.payload);
      }
    } catch (e) {
      log.warn('Failed to extract payload: {}', e.message);
    }

    // The source code of the trigger handlers provide an insight into the respective events,
    // see https://github.com/openhab/openhab-core/tree/main/bundles/org.openhab.core.automation/src/main/java/org/openhab/core/automation/internal/module/handler
    switch (data.eventClass) {
      case 'org.openhab.core.automation.events.ExecutionEvent':
        data.eventType = event.toString().split(' ').pop();
        break;
      case 'org.openhab.core.automation.events.TimerEvent':
        data.eventType = 'time';
        if (data.payload.cronExpression) {
          data.triggerType = 'GenericCronTrigger';
          data.cronExpression = data.payload.cronExpression.toString();
        } else if (data.payload.time) {
          data.triggerType = 'TimeOfDayTrigger';
          data.time = data.payload.time.toString();
        } else if (data.payload.itemName) {
          data.triggerType = 'DateTimeTrigger';
          data.itemName = data.payload.itemName.toString();
        }
        break;
      case 'org.openhab.core.items.events.GroupItemCommandEvent':
      case 'org.openhab.core.items.events.ItemCommandEvent':
        data.itemName = event.getItemName();
        data.eventType = 'command';
        data.triggerType = 'ItemCommandTrigger';
        break;
      case 'org.openhab.core.items.events.GroupItemStateChangedEvent':
      case 'org.openhab.core.items.events.ItemStateChangedEvent':
        data.itemName = event.getItemName();
        data.eventType = 'change';
        data.triggerType = 'ItemStateChangeTrigger';
        break;
      // **StateEvents replaced by **StateUpdatedEvents in https://github.com/openhab/openhab-core/pull/3141
      case 'org.openhab.core.items.events.ItemStateUpdatedEvent':
      case 'org.openhab.core.items.events.GroupStateUpdatedEvent':
      case 'org.openhab.core.items.events.GroupItemStateEvent':
      case 'org.openhab.core.items.events.ItemStateEvent':
        data.itemName = event.getItemName();
        data.eventType = 'update';
        data.triggerType = 'ItemStateUpdateTrigger';
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
        break;
    }
  }

  _addFromHashMap(input, 'module', data);

  return data;
}

module.exports = {
  removeRule,
  runRule,
  isEnabled,
  setEnabled,
  JSRule,
  SwitchableJSRule
};
