/**
 * Items namespace.
 * This namespace handles querying and updating openHAB Items.
 * @namespace items
 */

const osgi = require('../osgi');
const utils = require('../utils');
const log = require('../log')('items');
const { _toOpenhabPrimitiveType, _isQuantity, _isItem } = require('../helpers');
const cache = require('../cache');
const { getQuantity, QuantityError } = require('../quantity');
const time = require('../time');

const { OnOffType, PercentType, UnDefType, events, itemRegistry } = require('@runtime');

const metadata = require('./metadata/metadata');
const ItemPersistence = require('./item-persistence');
const ItemSemantics = require('./item-semantics');
const TimeSeries = require('./time-series');

const itemBuilderFactory = osgi.getService('org.openhab.core.items.ItemBuilderFactory');

// typedefs need to be global for TypeScript to fully work
/**
 * @typedef {object} ItemConfig configuration describing an Item
 * @property {string} type the type of the Item
 * @property {string} name Item name for the Item to create
 * @property {string} [label] the label for the Item
 * @property {string} [category] the category (icon) for the Item
 * @property {string[]} [groups] an array of groups the Item is a member of
 * @property {string[]} [tags] an array of tags for the Item
 * @property {string|Object} [channels] for single channel link a string or for multiple an object { channeluid: configuration }; configuration is an object
 * @property {*} [metadata] either object `{ namespace: value }` or `{ namespace: `{@link ItemMetadata}` }`
 * @property {string} [giBaseType] the group Item base type for the Item
 * @property {HostGroupFunction} [groupFunction] the group function used by the Item
 */
/**
 * @typedef {import('../items/metadata/metadata').ItemMetadata} ItemMetadata
 * @private
 */
/**
 * @typedef {import('@js-joda/core').ZonedDateTime} ZonedDateTime
 * @private
 */
/**
 * @typedef {import('@js-joda/core').Instant} Instant
 * @private
 */
/**
 * @typedef {import('@js-joda/core').Duration} Duration
 * @private
 */
/**
 * @typedef {import('../quantity').Quantity} Quantity
 * @private
 */

/**
 * Tag value to be attached to all dynamically created Items.
 *
 * @memberof items
 */
const DYNAMIC_ITEM_TAG = '_DYNAMIC_';

/**
 * Class representing an openHAB Item
 *
 * @memberof items
 */
class Item {
  /**
   * Create an Item, wrapping a native Java openHAB Item. Don't use this constructor, instead call {@link getItem}.
   * @param {HostItem} rawItem Java Item from Host
   * @hideconstructor
   */
  constructor (rawItem) {
    if (typeof rawItem === 'undefined') {
      throw Error('Supplied Item is undefined');
    }
    /**
     * raw Java Item
     * @type {HostItem}
     */
    this.rawItem = rawItem;

    /**
     * Access historical states for this Item {@link items.ItemPersistence}
     * @type {ItemPersistence}
     */
    this.persistence = new ItemPersistence(rawItem);

    /**
     * Access Semantic information of this Item {@link items.ItemSemantics}
     * @type {ItemSemantics}
     */
    this.semantics = new ItemSemantics(rawItem, getItem);
  }

  /**
   * Type of Item: the Simple (without package) name of the Java Item type, such as 'Switch'.
   * @type {string}
   */
  get type () {
    return this.rawItem.getType().toString();
  }

  /**
   * Name of Item
   * @type {string}
   */
  get name () {
    return this.rawItem.getName();
  }

  /**
   * Label attached to Item
   * @type {string}
   */
  get label () {
    return this.rawItem.getLabel();
  }

  /**
   * String representation of the Item state.
   * @type {string}
   */
  get state () {
    return _state(this.rawState);
  }

  /**
   * Numeric representation of Item state, or `null` if state is not numeric
   * @type {number|null}
   */
  get numericState () {
    return _numericState(this.rawState, this.type);
  }

  /**
   * Item state as {@link Quantity} or `null` if state is not Quantity-compatible or Quantity would be unit-less (without unit)
   * @type {Quantity|null}
   */
  get quantityState () {
    return _quantityState(this.rawState);
  }

  /**
   * Raw state of Item, as a Java {@link https://www.openhab.org/javadoc/latest/org/openhab/core/types/state State object}
   * @type {HostState}
   */
  get rawState () {
    return this.rawItem.getState();
  }

  /**
   * String representation of the previous state of the Item or `null` if no previous state is available.
   * @type {string|null}
   */
  get previousState () {
    return _state(this.previousRawState);
  }

  /**
   * Numeric representation of Item previous state, or `null` if state is not numeric or not available.
   * @type {number|null}
   */
  get previousNumericState () {
    return _numericState(this.previousRawState, this.type);
  }

  /**
   * Previous item state as {@link Quantity} or `null` if state is not Quantity-compatible, Quantity would be unit-less (without unit) or not available.
   * @type {Quantity|null}
   */
  get previousQuantityState () {
    return _quantityState(this.previousRawState);
  }

  /**
    * Previous raw state of Item, as a Java {@link https://www.openhab.org/javadoc/latest/org/openhab/core/types/state State object} or `null` if previous state not available.
   * @type {HostState|null}
   */
  get previousRawState () {
    return this.rawItem.getLastState();
  }

  /**
   * The time the state was last updated as ZonedDateTime or `null` if no timestamp is available.
   * @type {time.ZonedDateTime|null}
   */
  get lastStateUpdateTimestamp () {
    const timestamp = this.rawItem.getLastStateUpdate();
    if (timestamp == null) return null;
    return time.javaZDTToJsZDT(timestamp);
  }

  /**
   * The time the state was last updated as Instant or `null` if no timestamp is available.
   * @type {time.Instant|null}
   */
  get lastStateUpdateInstant () {
    const timestamp = this.rawItem.getLastStateUpdate();
    if (timestamp == null) return null;
    return time.javaInstantToJsInstant(timestamp.toInstant());
  }

  /**
   * The time the state was last changed as ZonedDateTime or `null` if no timestamp is available.
   * @type {time.ZonedDateTime|null}
   */
  get lastStateChangeTimestamp () {
    const timestamp = this.rawItem.getLastStateUpdate();
    if (timestamp == null) return null;
    return time.javaZDTToJsZDT(timestamp);
  }

  /**
   * The time the state was last changed as Instant or `null` if no timestamp is available.
   * @type {time.Instant|null}
   */
  get lastStateChangeInstant () {
    const timestamp = this.rawItem.getLastStateUpdate();
    if (timestamp == null) return null;
    return time.javaInstantToJsInstant(timestamp.toInstant());
  }

  /**
   * Members / children / direct descendents of the current group Item (as returned by 'getMembers()'). Must be a group Item.
   * @type {Item[]}
   */
  get members () {
    return utils.javaSetToJsArray(this.rawItem.getMembers()).map(raw => new Item(raw));
  }

  /**
   * All descendents of the current group Item (as returned by 'getAllMembers()'). Must be a group Item.
   * @type {Item[]}
   */
  get descendents () {
    return utils.javaSetToJsArray(this.rawItem.getAllMembers()).map(raw => new Item(raw));
  }

  /**
   * Whether this Item is uninitialized (`true` if it has not been initialized).
   * @type {boolean}
   */
  get isUninitialized () {
    return (this.rawItem.getState() instanceof UnDefType ||
        this.rawItem.getState().toString() === 'Undefined' ||
        this.rawItem.getState().toString() === 'Uninitialized'
    );
  }

  /**
   * Gets metadata of a single namespace or of all namespaces from this Item.
   *
   * @example
   * // Get metadata of ALL namespaces
   * var meta = Item.getMetadata();
   * var namespaces = Object.keys(meta); // Get metadata namespaces
   * // Get metadata of a single namespace
   * meta = Item.getMetadata('expire');
   *
   * @see items.metadata.getMetadata
   * @param {string} [namespace] name of the metadata: if provided, only metadata of this namespace is returned, else all metadata is returned
   * @returns {{ namespace: ItemMetadata }|ItemMetadata|null} all metadata as an object with the namespaces as properties OR metadata of a single namespace or `null` if that namespace doesn't exist; the metadata itself is of type {@link items.metadata.ItemMetadata}
   */
  getMetadata (namespace) {
    return metadata.getMetadata(this.name, namespace);
  }

  /**
   * Updates or adds metadata of a single namespace to this Item.
   *
   * @see items.metadata.replaceMetadata
   * @param {string} namespace name of the metadata
   * @param {string} value value for this metadata
   * @param {object} [configuration] optional metadata configuration
   * @returns {{configuration: *, value: string}|null} old {@link items.metadata.ItemMetadata} or `null` if the Item has no metadata with the given name
   */
  replaceMetadata (namespace, value, configuration) {
    return metadata.replaceMetadata(this.name, namespace, value, configuration);
  }

  /**
   * Removes metadata of a single namespace or of all namespaces from a given Item.
   *
   * @see items.metadata.removeMetadata
   * @param {string} [namespace] name of the metadata: if provided, only metadata of this namespace is removed, else all metadata is removed
   * @returns {ItemMetadata|null} removed {@link items.metadata.ItemMetadata} OR `null` if the Item has no metadata under the given namespace or all metadata was removed
   */
  removeMetadata (namespace) {
    return metadata.removeMetadata(this.name, namespace);
  }

  /**
   * Sends a command to the Item.
   *
   * @example
   * // Turn on the Hallway lights
   * items.getItem('HallwayLight').sendCommand('ON');
   * // Turn on the Hallway lights for at least 5 minutes, if they were on before, keep them on, otherwise turn them off
   * items.getItem('HallwayLight').sendCommand('ON', time.Duration.ofMinutes(5));
   * // Turn on the Hallway lights for 5 minutes, then turn them off
   * items.getItem('HallwayLight').sendCommand('ON', time.Duration.ofMinutes(5), 'OFF');
   *
   * @param {string|number|ZonedDateTime|Instant|Quantity|HostState} value the value of the command to send, such as 'ON'
   * @param {Duration} [expire] optional duration (see {@link https://js-joda.github.io/js-joda/class/packages/core/src/Duration.js~Duration.html JS-Joda: Duration}) after which the command expires and the Item is commanded back to its previous state or `onExpire`
   * @param {string|number|ZonedDateTime|Instant|Quantity|HostState} [onExpire] the optional value of the command to apply on expire, default is the current state
   * @see sendCommandIfDifferent
   * @see postUpdate
   */
  sendCommand (value, expire, onExpire) {
    if (expire !== undefined) {
      const CACHE_KEY = this.name + '-command-expire-timeoutId';
      if (cache.private.exists(CACHE_KEY)) {
        log.debug('Cancelling existing command expire timer for {}.', this.name);
        clearTimeout(cache.private.remove(CACHE_KEY));
      }
      if (onExpire === undefined) onExpire = this.state;
      log.debug('Scheduling command expire timer for {}, will apply command {} on expire.', this.name, onExpire);
      const timeoutId = setTimeout((item, command, expiredCommand) => {
        log.debug('Command {} for {} expired: Applying command {}', expiredCommand, item.name, command);
        item.sendCommand(command);
      }, expire.toMillis(), this, onExpire, value);
      cache.private.put(CACHE_KEY, timeoutId);
    }
    events.sendCommand(this.rawItem, _toOpenhabPrimitiveType(value));
  }

  /**
   * Sends a command to the Item, but only if the current state is not what is being sent.
   *
   * @param {string|number|ZonedDateTime|Instant|Quantity|HostState} value the value of the command to send, such as 'ON'
   * @returns {boolean} true if the command was sent, false otherwise
   * @see sendCommand
   */
  sendCommandIfDifferent (value) {
    // value and current state both are Quantity and have equal value
    if (_isQuantity(value) && this.quantityState !== null) {
      if (value.equal(this.quantityState)) {
        return false;
      }
    }

    // value and current state are both numeric and have equal value
    if (typeof value === 'number' && this.numericState !== null) {
      if (value === this.numericState) {
        return false;
      }
    }

    // value is number as string and current state is numeric and both are equal
    if (typeof value === 'string' && !isNaN(value) && this.numericState !== null) {
      if (parseFloat(value) === this.numericState) {
        return false;
      }
    }

    // stringified value and string state are equal
    value = _toOpenhabPrimitiveType(value);
    if (value.toString() === this.state) {
      return false;
    }

    // else send the command
    this.sendCommand(value);
    return true;
  }

  /**
   * Increase the value of this Item to the given value by sending a command, but only if the current state is less than that value.
   *
   * @param {number|Quantity|HostState} value the value of the command to send, such as 'ON'
   * @return {boolean} true if the command was sent, false otherwise
   */
  sendIncreaseCommand (value) {
    // value and current state both are Quantity and value is less than or equal current state
    if (_isQuantity(value) && this.quantityState !== null) {
      if (value.lessThanOrEqual(this.quantityState)) {
        log.debug('sendIncreaseCommand: Ignoring command {} for Item {} with state {}', value, this.name, this.state);
        return false;
      }
    }

    // value and current state are both numeric and value is less than or equal current state
    if (typeof value === 'number' && this.numericState !== null) {
      if (value <= this.numericState) {
        log.debug('sendIncreaseCommand: Ignoring command {} for Item {} with state {}', value, this.name, this.state);
        return false;
      }
    }

    // else send the command
    log.debug('sendIncreaseCommand: Sending command {} to Item {} with state {}', value, this.name, this.state);
    this.sendCommand(value);
    return true;
  }

  /**
   * Decreases the value of this Item to the given value by sending a command, but only if the current state is greater than that value.
   *
   * @param {number|Quantity|HostState} value the value of the command to send, such as 'ON'
   * @return {boolean} true if the command was sent, false otherwise
   */
  sendDecreaseCommand (value) {
    // value and current state both are Quantity and value is greater than or equal current state
    if (_isQuantity(value) && this.quantityState !== null) {
      if (value.greaterThanOrEqual(this.quantityState)) {
        log.debug('sendDecreaseCommand: Ignoring command {} for Item {} with state {}', value, this.name, this.state);
        return false;
      }
    }

    // value and current state are both numeric and value is greater than or equal current state
    if (typeof value === 'number' && this.numericState !== null) {
      if (value >= this.numericState) {
        log.debug('sendDecreaseCommand: Ignoring command {} for Item {} with state {}', value, this.name, this.state);
        return false;
      }
    }

    // else send the command
    log.debug('sendDecreaseCommand: Sending command {} to Item {} with state {}', value, this.name, this.state);
    this.sendCommand(value);
    return true;
  }

  /**
   * Calculates the toggled state of this Item.
   * For Items like Color and Dimmer, getStateAs(OnOffType) is used and the toggle calculated of that.
   *
   * @ignore
   * @returns the toggled state (e.g. 'OFF' if the Item is 'ON')
   * @throws error if the Item is uninitialized or is a type that doesn't make sense to toggle
   */
  getToggleState () {
    if (this.isUninitialized) {
      throw Error('Cannot toggle uninitialized Items');
    }
    switch (this.type) {
      case 'Player' :
        return this.state === 'PAUSE' ? 'PLAY' : 'PAUSE';
      case 'Contact' :
        return this.state === 'OPEN' ? 'CLOSED' : 'OPEN';
      default: {
        const oldState = this.rawItem.getStateAs(OnOffType);
        if (oldState) {
          return oldState.toString() === 'ON' ? 'OFF' : 'ON';
        } else {
          throw Error('Toggle not supported for Items of type ' + this.type);
        }
      }
    }
  }

  /**
   * Sends a command to flip the Item's state (e.g. if it is 'ON' an 'OFF' command is sent).
   * @throws error if the Item is uninitialized or a type that cannot be toggled or commanded
   */
  sendToggleCommand () {
    if (this.type === 'Contact') {
      throw Error('Cannot command Contact Items');
    }
    this.sendCommand(this.getToggleState());
  }

  /**
   * Posts an update to flip the Item's state (e.g. if it is 'ON' an 'OFF'
   * update is posted).
   * @throws error if the Item is uninitialized or a type that cannot be toggled
   */
  postToggleUpdate () {
    this.postUpdate(this.getToggleState());
  }

  /**
   * Posts an update to the Item.
   *
   * @param {string|number|ZonedDateTime|Instant|Quantity|HostState} value the value of the command to send, such as 'ON'
   * @see postToggleUpdate
   * @see sendCommand
   */
  postUpdate (value) {
    events.postUpdate(this.rawItem, _toOpenhabPrimitiveType(value));
  }

  /**
   * Gets the names of the groups this Item is member of.
   * @returns {string[]}
   */
  get groupNames () {
    return utils.javaListToJsArray(this.rawItem.getGroupNames());
  }

  /**
   * Adds groups to this Item
   * @param {...string|...Item} groupNamesOrItems one or more names of the groups (or the group Items themselves)
   */
  addGroups (...groupNamesOrItems) {
    const groupNames = groupNamesOrItems.map((x) => (typeof x === 'string') ? x : x.name);
    this.rawItem.addGroupNames(groupNames);
    itemRegistry.update(this.rawItem);
  }

  /**
   * Removes groups from this Item
   * @param {...string|...Item} groupNamesOrItems one or more names of the groups (or the group Items themselves)
   */
  removeGroups (...groupNamesOrItems) {
    const groupNames = groupNamesOrItems.map((x) => (typeof x === 'string') ? x : x.name);
    for (const groupName of groupNames) {
      this.rawItem.removeGroupName(groupName);
    }
    itemRegistry.update(this.rawItem);
  }

  /**
   * Gets the tags from this Item
   * @type {string[]}
   */
  get tags () {
    return utils.javaSetToJsArray(this.rawItem.getTags());
  }

  /**
   * Adds tags to this Item
   * @param {...string} tagNames names of the tags to add
   */
  addTags (...tagNames) {
    this.rawItem.addTags(tagNames);
    itemRegistry.update(this.rawItem);
  }

  /**
   * Removes tags from this Item
   * @param {...string} tagNames names of the tags to remove
   */
  removeTags (...tagNames) {
    for (const tagName of tagNames) {
      this.rawItem.removeTag(tagName);
    }
    itemRegistry.update(this.rawItem);
  }

  toString () {
    return this.rawItem.toString();
  }
}

/**
 * Creates a new Item object. This Item is not registered with any provider and therefore can not be accessed.
 *
 * Note that all Items created this way have an additional tag attached, for simpler retrieval later. This tag is
 * created with the value {@link DYNAMIC_ITEM_TAG}.
 *
 * @private
 * @param {ItemConfig} itemConfig the Item config describing the Item
 * @returns {Item} {@link items.Item}
 * @throws {Error} {@link ItemConfig}.name or {@link ItemConfig}.type not set
 * @throws failed to create Item
 */
function _createItem (itemConfig) {
  if (typeof itemConfig.name !== 'string' || typeof itemConfig.type !== 'string') throw Error('itemConfig.name or itemConfig.type not set');

  itemConfig.name = safeItemName(itemConfig.name);

  let baseItem;
  if (itemConfig.type === 'Group' && typeof itemConfig.giBaseType !== 'undefined') {
    baseItem = itemBuilderFactory.newItemBuilder(itemConfig.giBaseType, itemConfig.name + '_baseItem').build();
  }
  if (itemConfig.type !== 'Group') {
    itemConfig.groupFunction = undefined;
  }

  if (typeof itemConfig.tags === 'undefined') {
    itemConfig.tags = [];
  }
  itemConfig.tags.push(DYNAMIC_ITEM_TAG);

  try {
    let builder = itemBuilderFactory.newItemBuilder(itemConfig.type, itemConfig.name)
      .withCategory(itemConfig.category)
      .withLabel(itemConfig.label)
      .withTags(utils.jsArrayToJavaSet(itemConfig.tags));

    if (typeof itemConfig.groups !== 'undefined') {
      builder = builder.withGroups(utils.jsArrayToJavaList(itemConfig.groups));
    }

    if (typeof baseItem !== 'undefined') {
      builder = builder.withBaseItem(baseItem);
    }
    if (typeof itemConfig.groupFunction !== 'undefined') {
      builder = builder.withGroupFunction(itemConfig.groupFunction);
    }

    const item = builder.build();
    return new Item(item);
  } catch (e) {
    log.error('Failed to create Item: ' + e);
    throw e;
  }
}

/**
 * Return a string representation of a state.
 *
 * @private
 * @param {HostState|null} rawState the state
 * @returns {string|null} string representation or `null` if `rawState` was `null`
 */
function _state (rawState) {
  if (rawState === null) return null;
  return rawState.toString();
}

/**
 * Return a numeric representation of a state.
 *
 * @private
 * @param {HostState|null} rawState the state
 * @returns {number|null} numeric representation or `null` if `rawState` was `null`
 */
function _numericState (rawState, type) {
  if (rawState === null) return null;
  let state = rawState.toString();
  if (type === 'Color') state = rawState.as(PercentType).toString();
  const numericState = parseFloat(state);
  return isNaN(numericState) ? null : numericState;
}

/**
 * Return a Quantity representation of a state.
 *
 * @private
 * @param {HostState} rawState the state
 * @returns {Quantity|null} Quantity representation, or `null` if `rawState` was `null` or not Quantity-compatible, Quantity would be unit-less (without unit) or not available
 * @throws failed to create quantityState
 */
function _quantityState (rawState) {
  if (rawState === null) return null;
  try {
    const qty = getQuantity(rawState);
    return (qty !== null && qty.symbol !== null) ? qty : null;
  } catch (e) {
    if (e instanceof QuantityError) {
      return null;
    } else {
      throw Error('Failed to create "quantityState": ' + e);
    }
  }
}

/**
 * Creates a new Item within OpenHab. This Item will persist to the registry, and therefore is independent of the lifecycle of the script creating it.
 *
 * Note that all Items created this way have an additional tag attached, for simpler retrieval later. This tag is
 * created with the value {@link DYNAMIC_ITEM_TAG}.
 *
 * @memberof items
 * @param {ItemConfig} itemConfig the Item config describing the Item
 * @returns {Item} {@link Items.Item}
 * @throws {Error} if {@link ItemConfig}.name or {@link ItemConfig}.type is not set
 * @throws {Error} if failed to create Item
 */
function addItem (itemConfig) {
  const item = _createItem(itemConfig);
  itemRegistry.add(item.rawItem);

  if (typeof itemConfig.metadata === 'object') {
    const namespace = Object.keys(itemConfig.metadata);
    for (const i in namespace) {
      const namespaceValue = itemConfig.metadata[namespace[i]];
      log.debug('addItem: Processing metadata namespace {}', namespace[i]);
      if (typeof namespaceValue === 'string') { // namespace as key and it's value as value
        metadata.replaceMetadata(itemConfig.name, namespace[i], namespaceValue);
      } else if (typeof namespaceValue === 'object') { // namespace as key and { value: 'string', configuration: object } as value
        metadata.replaceMetadata(itemConfig.name, namespace[i], namespaceValue.value, namespaceValue.config);
      }
    }
  }

  if (itemConfig.type !== 'Group') {
    if (typeof itemConfig.channels === 'string') { // single channel link with string
      metadata.itemchannellink.replaceItemChannelLink(itemConfig.name, itemConfig.channels);
    } else if (typeof itemConfig.channels === 'object') { // multiple/complex channel links with channel as key and config object as value
      const channels = Object.keys(itemConfig.channels);
      for (const i in channels) metadata.itemchannellink.replaceItemChannelLink(itemConfig.name, channels[i], itemConfig.channels[channels[i]]);
    }
  }

  return getItem(itemConfig.name);
}

/**
 * Removes an Item from openHAB. The Item is removed immediately and cannot be recovered.
 *
 * @memberof items
 * @param {string|Item} itemOrItemName the Item or the name of the Item to remove
 * @returns {Item|null} the Item that has been removed or `null` if it has not been removed
 */
function removeItem (itemOrItemName) {
  let itemName;

  if (typeof itemOrItemName === 'string') {
    itemName = itemOrItemName;
  } else if (_isItem(itemOrItemName)) {
    itemName = itemOrItemName.name;
  } else {
    log.warn('Item name is undefined (no Item supplied or supplied name is not a string) so cannot be removed');
    return false;
  }

  let item;
  try { // If the Item is not registered, ItemNotFoundException is thrown.
    item = getItem(itemName);
  } catch (e) {
    if (Java.typeName(e.getClass()) === 'org.openhab.core.items.ItemNotFoundException') {
      log.error('Item {} not registered so cannot be removed: {}', itemName, e.message);
      return null;
    } else { // If exception/error is not ItemNotFoundException, rethrow.
      throw Error(e);
    }
  }

  itemRegistry.remove(itemName);

  try { // If the Item has been successfully removed, ItemNotFoundException is thrown.
    itemRegistry.getItem(itemName);
    log.warn('Failed to remove Item: {}', itemName);
    return null;
  } catch (e) {
    if (Java.typeName(e.getClass()) === 'org.openhab.core.items.ItemNotFoundException') {
      return item;
    } else { // If exception/error is not ItemNotFoundException, rethrow.
      throw Error(e);
    }
  }
}

/**
 * Replaces (or adds) an Item. If an Item exists with the same name, it will be removed and a new Item with
 * the supplied parameters will be created in its place. If an Item does not exist with this name, a new
 * Item will be created with the supplied parameters.
 *
 * This function can be useful in scripts which create a static set of Items which may need updating either
 * periodically, during startup or even during development of the script. Using fixed Item names will ensure
 * that the Items remain up-to-date, but won't fail with issues related to duplicate Items.
 *
 * @memberof items
 * @param {ItemConfig} itemConfig the Item config describing the Item
 * @returns {Item|null} the old Item or `null` if it did not exist
 * @throws {Error} {@link ItemConfig}.name or {@link ItemConfig}.type not set
 * @throws failed to create Item
 */
function replaceItem (itemConfig) {
  const item = getItem(itemConfig.name, true);
  if (item !== null) { // Item already existed
    removeItem(itemConfig.name);
  }
  addItem(itemConfig);
  return item;
}

/**
 * Whether an Item with the given name exists.
 * @memberof items
 * @param {string} name the name of the Item
 * @returns {boolean} whether the Item exists
 */
function existsItem (name) {
  try {
    itemRegistry.getItem(name);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Gets an openHAB Item.
 * @memberof items
 * @param {string} name the name of the Item
 * @param {boolean} [nullIfMissing=false] whether to return null if the Item cannot be found (default is to throw an {@link https://www.openhab.org/javadoc/latest/org/openhab/core/items/itemnotfoundexception ItemNotFoundException})
 * @returns {Item} {@link items.Item} Item or `null` if `nullIfMissing` is true and Item is missing
 */
function getItem (name, nullIfMissing = false) {
  try {
    return new Item(itemRegistry.getItem(name));
  } catch (e) {
    if (nullIfMissing) {
      return null;
    } else {
      throw e;
    }
  }
}

/**
 * Gets all openHAB Items.
 *
 * @memberof items
 * @returns {Item[]} {@link items.Item}[]: all Items
 */
function getItems () {
  return utils.javaSetToJsArray(itemRegistry.getItems()).map(i => new Item(i));
}

/**
 * Gets all openHAB Items with a specific tag.
 *
 * @memberof items
 * @param {string[]} tagNames an array of tags to match against
 * @returns {Item[]} {@link items.Item}[]: the Items with a tag that is included in the passed tags
 */
function getItemsByTag (...tagNames) {
  return utils.javaSetToJsArray(itemRegistry.getItemsByTag(tagNames)).map(i => new Item(i));
}

/**
 * Helper function to ensure an Item name is valid. All invalid characters are replaced with an underscore.
 * @memberof items
 * @param {string} s the name to make value
 * @returns {string} a valid Item name
 */
const safeItemName = (s) => s
  .replace(/["']/g, '') // delete
  .replace(/[^a-zA-Z0-9]/g, '_'); // replace with underscore

const itemProperties = {
  safeItemName,
  existsItem,
  getItem,
  getItems,
  addItem,
  getItemsByTag,
  replaceItem,
  removeItem,
  Item,
  metadata,
  /**
   * @type {RiemannType}
   */
  RiemannType: ItemPersistence.RiemannType,
  TimeSeries
};

/**
 * Gets an openHAB Item by name directly on the {@link items} namespace.
 * Equivalent to {@link items.getItem}
 *
 * @example
 * // retrieve item by name directly on the items namespace
 * console.log(items.KitchenLight.state) // returns 'ON'
 * // equivalent to
 * console.log(items.getItem('KitchenLight').state) // returns 'ON'
 *
 * @name NAME
 * @memberof items
 * @function
 * @returns {Item|null} {@link items.Item} Item or `null` if Item is missing
 */
module.exports = new Proxy(itemProperties, {
  get: function (target, prop) {
    return target[prop] || target.getItem(prop, true);
  }
});
