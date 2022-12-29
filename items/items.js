/**
 * Items namespace.
 * This namespace handles querying and updating openHAB Items.
 * @namespace items
 */

const osgi = require('../osgi');
const utils = require('../utils');
const log = require('../log')('items');
const metadata = require('./metadata/metadata');
const ItemHistory = require('./item-history');
const ItemSemantics = require('./item-semantics');
/** @typedef {import('@js-joda/core').ZonedDateTime} time.ZonedDateTime */
const time = require('../time');

const { UnDefType, OnOffType, events, itemRegistry } = require('@runtime');

const itemBuilderFactory = osgi.getService('org.openhab.core.items.ItemBuilderFactory');

const managedItemProvider = osgi.getService('org.openhab.core.items.ManagedItemProvider');

// typedefs need to be global for TypeScript to fully work
/**
 * @typedef {object} ItemConfig configuration describing an Item
 * @property {string} type the type of the Item
 * @property {string} name Item name for the Item to create
 * @property {string} [label] the label for the Item
 * @property {string} [category] the category (icon) for the Item
 * @property {String[]} [groups] an array of groups the Item is a member of
 * @property {String[]} [tags] an array of tags for the Item
 * @property {String|Object} [channels] for single channel link a string or for multiple an object { channeluid: configuration }; configuration is an object
 * @property {ItemMetadata} [metadata] either object { namespace: value } or { namespace: { value: value, config: {} } }
 * @property {string} [giBaseType] the group Item base type for the Item
 * @property {HostGroupFunction} [groupFunction] the group function used by the Item
 */

/**
 * @typedef {object} ItemMetadata Item metadata configuration, not fully documented
 * @property {object} [stateDescription] `stateDescription` configuration, required for most UIs
 * @property {object} [stateDescription.config] config of this metadata namespace
 * @property {string} [stateDescription.config.pattern] state formatting pattern, required for most UIs, see {@link https://www.openhab.org/docs/configuration/items.html#state-presentation}
 * @property {object} [expire] `expire` configuration, see {@link https://www.openhab.org/docs/configuration/items.html#parameter-expire}
 * @property {string} [expire.value] e.g. `0h30m0s,command=OFF`
 * @property {object} [expire.config]
 * @property {string} [expire.config.ignoreStateUpdates] If the ignore state updates checkbox is set, only state changes will reset the timer; `true` or `false`
 * @property {object} [autoupdate] `autoupdate` configuration, see {@link https://www.openhab.org/docs/configuration/items.html#parameter-expire}
 * @property {string} [autoupdate.value] `true` or `false`
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
     * Access historical states for this Item {@link items.ItemHistory}
     * @type {ItemHistory}
     */
    this.history = new ItemHistory(rawItem);

    /**
     * Access Semantic informations of this Item {@link items.ItemSemantics}
     * @type {ItemSemantics}
     */
    this.semantics = new ItemSemantics(rawItem);
  }

  /**
   * The type of the Item: the Simple (without package) name of the Java Item type, such as 'Switch'.
   * @return {string} the type
   */
  get type () {
    return this.rawItem.getClass().getSimpleName();
  }

  /**
   * The name of the Item.
   * @return {string} the name
   */
  get name () {
    return this.rawItem.getName();
  }

  /**
   * The label attached to the Item
   * @return {string} the label
   */
  get label () {
    return this.rawItem.getLabel();
  }

  /**
   * The state of the Item, as a string.
   * @return {string} the Item's state
   */
  get state () {
    return this.rawState.toString();
  }

  /**
   * The raw state of the Item, as a Java {@link https://www.openhab.org/javadoc/latest/org/openhab/core/types/state State object}.
   * @return {HostState} the Item's state
   */
  get rawState () {
    return this.rawItem.getState();
  }

  /**
   * Members / children / direct descendents of the current group Item (as returned by 'getMembers()'). Must be a group Item.
   * @returns {Item[]} member Items
   */
  get members () {
    return utils.javaSetToJsArray(this.rawItem.getMembers()).map(raw => new Item(raw));
  }

  /**
   * All descendents of the current group Item (as returned by 'getAllMembers()'). Must be a group Item.
   * @returns {Item[]} all descendent Items
   */
  get descendents () {
    return utils.javaSetToJsArray(this.rawItem.getAllMembers()).map(raw => new Item(raw));
  }

  /**
   * Whether this Item is initialized.
   * @type {boolean}
   * @returns true iff the Item has not been initialized
   */
  get isUninitialized () {
    if (this.rawItem.getState() instanceof UnDefType ||
        this.rawItem.getState().toString() === 'Undefined' ||
        this.rawItem.getState().toString() === 'Uninitialized'
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Gets metadata with the given name for this Item.
   * @param {string} namespace The namespace for the metadata to retrieve
   * @returns {{configuration: *, value: string}|null} metadata or null if the Item has no metadata with the given name
   */
  getMetadata (namespace) {
    return metadata.getMetadata(this.name, namespace);
  }

  /**
   * Updates or adds the given metadata for this Item.
   * @param {string} namespace name of the metadata
   * @param {string} value value for this metadata
   * @param {object} [configuration] optional metadata configuration
   * @returns {{configuration: *, value: string}|null} old metadata or `null` if the Item has no metadata with the given name
   */
  replaceMetadata (namespace, value, configuration) {
    return metadata.replaceMetadata(this.name, namespace, value, configuration);
  }

  /**
   * Removes metadata with a given name from a given Item.
   * @param {string} namespace name of the metadata
   * @returns {{configuration: *, value: string}|null} removed metadata or `null` if the Item has no metadata with the given name
   */
  removeMetadata (namespace) {
    return metadata.removeMetadata(this.name, namespace);
  }

  /**
   * Sends a command to the Item.
   *
   * @param {String|time.ZonedDateTime|HostState} value the value of the command to send, such as 'ON'
   * @see sendCommandIfDifferent
   * @see postUpdate
   */
  sendCommand (value) {
    if (value instanceof time.ZonedDateTime) value = value.toOpenHabString();
    events.sendCommand(this.rawItem, value);
  }

  /**
   * Sends a command to the Item, but only if the current state is not what is being sent.
   *
   * @param {String|time.ZonedDateTime|HostState} value the value of the command to send, such as 'ON'
   * @returns {boolean} true if the command was sent, false otherwise
   * @see sendCommand
   */
  sendCommandIfDifferent (value) {
    if (value instanceof time.ZonedDateTime) value = value.toOpenHabString();
    if (value.toString() !== this.state.toString()) {
      this.sendCommand(value);
      return true;
    }

    return false;
  }

  /**
   * Calculates the toggled state of this Item. For Items like Color and
   * Dimmer, getStateAs(OnOffType) is used and the toggle calculated off
   * of that.
   * @returns the toggled state (e.g. 'OFF' if the Item is 'ON')
   * @throws error if the Item is uninitialized or is a type that doesn't make sense to toggle
   */
  getToggleState () {
    if (this.isUninitialized) {
      throw Error('Cannot toggle uninitialized Items');
    }
    switch (this.type) {
      case 'PlayerItem' :
        return this.state === 'PAUSE' ? 'PLAY' : 'PAUSE';
      case 'ContactItem' :
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
   * Sends a command to flip the Item's state (e.g. if it is 'ON' an 'OFF'
   * command is sent).
   * @throws error if the Item is uninitialized or a type that cannot be toggled or commanded
   */
  sendToggleCommand () {
    if (this.type === 'ContactItem') {
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
   * @param {String|time.ZonedDateTime|HostState} value the value of the command to send, such as 'ON'
   * @see sendCommand
   */
  postUpdate (value) {
    if (value instanceof time.ZonedDateTime) value = value.toOpenHabString();
    events.postUpdate(this.rawItem, value);
  }

  /**
   * Gets the tags from this Item
   * @returns {Array<String>} array of group names
   */
  get groupNames () {
    return utils.javaListToJsArray(this.rawItem.getGroupNames());
  }

  /**
   * Adds groups to this Item
   * @param {...String|...Item} groupNamesOrItems one or more names of the groups (or the group Items themselves)
   */
  addGroups (...groupNamesOrItems) {
    const groupNames = groupNamesOrItems.map((x) => (typeof x === 'string') ? x : x.name);
    this.rawItem.addGroupNames(groupNames);
    managedItemProvider.update(this.rawItem);
  }

  /**
   * Removes groups from this Item
   * @param {...String|...Item} groupNamesOrItems one or more names of the groups (or the group Items themselves)
   */
  removeGroups (...groupNamesOrItems) {
    const groupNames = groupNamesOrItems.map((x) => (typeof x === 'string') ? x : x.name);
    for (const groupName of groupNames) {
      this.rawItem.removeGroupName(groupName);
    }
    managedItemProvider.update(this.rawItem);
  }

  /**
   * Gets the tags from this Item
   * @returns {Array<String>} array of tags
   */
  get tags () {
    return utils.javaSetToJsArray(this.rawItem.getTags());
  }

  /**
   * Adds tags to this Item
   * @param {...String} tagNames names of the tags to add
   */
  addTags (...tagNames) {
    this.rawItem.addTags(tagNames);
    managedItemProvider.update(this.rawItem);
  }

  /**
   * Removes tags from this Item
   * @param {...String} tagNames names of the tags to remove
   */
  removeTags (...tagNames) {
    for (const tagName of tagNames) {
      this.rawItem.removeTag(tagName);
    }
    managedItemProvider.update(this.rawItem);
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
 * @memberof items
 * @private
 * @param {ItemConfig} itemConfig the Item config describing the Item
 * @returns {Item} {@link items.Item}
 * @throws {@link ItemConfig}.name or {@link ItemConfig}.type not set
 * @throws failed to create Item
 */
const createItem = function (itemConfig) {
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
};

/**
 * Creates a new Item within OpenHab. This Item will persist to the provider regardless of the lifecycle of the script creating it.
 *
 * Note that all Items created this way have an additional tag attached, for simpler retrieval later. This tag is
 * created with the value {@link DYNAMIC_ITEM_TAG}.
 *
 * @memberof items
 * @param {ItemConfig} itemConfig the Item config describing the Item
 * @returns {Item} {@link Items.Item}
 * @throws {@link ItemConfig}.name or {@link ItemConfig}.type not set
 * @throws failed to create Item
 */
const addItem = function (itemConfig) {
  const item = createItem(itemConfig);
  managedItemProvider.add(item.rawItem);

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
};

/**
 * Removes an Item from openHAB. The Item is removed immediately and cannot be recovered.
 *
 * @memberof items
 * @param {String|HostItem} itemOrItemName the Item or the name of the Item to remove
 * @returns {boolean} true if the Item was actually removed
 */
const removeItem = function (itemOrItemName) {
  let itemName;

  if (typeof itemOrItemName === 'string') {
    itemName = itemOrItemName;
  } else if (itemOrItemName.hasOwnProperty('name')) { // eslint-disable-line no-prototype-builtins
    itemName = itemOrItemName.name;
  } else {
    log.warn('Item name is undefined (no Item supplied or supplied name is not a string) so cannot be removed');
    return false;
  }

  try { // If the Item is not registered, ItemNotFoundException is thrown.
    getItem(itemName);
  } catch (e) {
    if (Java.typeName(e.getClass()) === 'org.openhab.core.items.ItemNotFoundException') {
      log.error('Item {} not registered so cannot be removed: {}', itemName, e.message);
      return false;
    } else { // If exception/error is not ItemNotFouncException, rethrow.
      throw Error(e);
    }
  }

  managedItemProvider.remove(itemName);

  try { // If the Item has been successfully removed, ItemNotFoundException is thrown.
    itemRegistry.getItem(itemName);
    log.warn('Failed to remove Item: {}', itemName);
    return false;
  } catch (e) {
    if (Java.typeName(e.getClass()) === 'org.openhab.core.items.ItemNotFoundException') {
      return true;
    } else { // If exception/error is not ItemNotFoundException, rethrow.
      throw Error(e);
    }
  }
};

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
 * @returns {Item} {@link items.Item}
 * @throws {@link ItemConfig}.name or {@link ItemConfig}.type not set
 * @throws failed to create Item
 */
const replaceItem = function (itemConfig) {
  const item = getItem(itemConfig.name, true);
  if (item !== null) {
    removeItem(itemConfig.name);
  }
  return addItem(itemConfig);
};

/**
 * Gets an openHAB Item.
 * @memberof items
 * @param {string} name the name of the Item
 * @param {boolean} [nullIfMissing=false] whether to return null if the Item cannot be found (default is to throw an exception)
 * @returns {Item} {@link items.Item}
 */
const getItem = (name, nullIfMissing = false) => {
  try {
    if (typeof name === 'string' || name instanceof String) {
      return new Item(itemRegistry.getItem(name));
    }
  } catch (e) {
    if (nullIfMissing) {
      return null;
    } else {
      throw e;
    }
  }
};

/**
 * Gets all openHAB Items.
 *
 * @memberof items
 * @returns {Item[]} {@link items.Item}[]: all Items
 */
const getItems = () => {
  return utils.javaSetToJsArray(itemRegistry.getItems()).map(i => new Item(i));
};

/**
 * Gets all openHAB Items with a specific tag.
 *
 * @memberof items
 * @param {...String} tagNames an array of tags to match against
 * @returns {Item[]} {@link items.Item}[]: the Items with a tag that is included in the passed tags
 */
const getItemsByTag = (...tagNames) => {
  return utils.javaSetToJsArray(itemRegistry.getItemsByTag(tagNames)).map(i => new Item(i));
};

/**
 * Helper function to ensure an Item name is valid. All invalid characters are replaced with an underscore.
 * @memberof items
 * @param {string} s the name to make value
 * @returns {string} a valid Item name
 */
const safeItemName = s => s
  .replace(/["']/g, '') // delete
  .replace(/[^a-zA-Z0-9]/g, '_'); // replace with underscore

module.exports = {
  safeItemName,
  getItem,
  getItems,
  addItem,
  getItemsByTag,
  replaceItem,
  createItem,
  removeItem,
  Item,
  /**
   * Custom indexer, to allow static Item lookup.
   * @example
   * let { my_object_name } = require('openhab').items.objects;
   * ...
   * let my_state = my_object_name.state; //my_object_name is an Item
   *
   * @returns {object} a collection of items allowing indexing by Item name
   */
  objects: () => new Proxy({}, {
    get: function (target, name) {
      if (typeof name === 'string' && /^-?\d+$/.test(name)) { return getItem(name); }

      throw Error('unsupported function call: ' + name);
    }
  }),
  metadata
};
