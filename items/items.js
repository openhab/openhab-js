/**
 * Items namespace.
 * This namespace handles querying and updating openHAB Items.
 * @namespace items
 */

const osgi = require('../osgi');
const utils = require('../utils');
const log = require('../log')('items');
const metadata = require('../metadata/metadata');
const ItemHistory = require('./item-history');

const { UnDefType, OnOffType, events, itemRegistry } = require('@runtime');

const itemBuilderFactory = osgi.getService('org.openhab.core.items.ItemBuilderFactory');

const managedItemProvider = osgi.getService('org.openhab.core.items.ManagedItemProvider');

// typedefs need to be global for TypeScript to fully work
/**
 * @typedef {Object} ItemConfig configuration describing an Item
 * @property {String} type the type of the Item
 * @property {String} name Item name for the Item to create
 * @property {String} [label] the label for the Item
 * @property {String} [category] the category (icon) for the Item
 * @property {String[]} [groups] an array of groups the Item is a member of
 * @property {String[]} [tags] an array of tags for the Item
 * @property {String|Object} [channels] for single channel link a string or for multiple an object { channeluid: configuration }; configuration is an object
 * @property {ItemMetadata} [metadata] either object { namespace: value } or { namespace: { value: value, config: {} } }
 * @property {String} [giBaseType] the group Item base type for the Item
 * @property {HostGroupFunction} [groupFunction] the group function used by the Item
 */

/**
 * @typedef {Object} ItemMetadata Item metadata configuration, not fully documented
 * @property {Object} [stateDescription] `stateDescription` configuration, required for most UIs
 * @property {Object} [stateDescription.config] config of this metadata namespace
 * @property {String} [stateDescription.config.pattern] state formatting pattern, required for most UIs, see {@link https://www.openhab.org/docs/configuration/items.html#state-presentation}
 * @property {Object} [expire] `expire` configuration, see {@link https://www.openhab.org/docs/configuration/items.html#parameter-expire}
 * @property {String} [expire.value] e.g. `0h30m0s,command=OFF`
 * @property {Object} [expire.config]
 * @property {String} [expire.config.ignoreStateUpdates] If the ignore state updates checkbox is set, only state changes will reset the timer; `true` or `false`
 * @property {Object} [autoupdate] `autoupdate` configuration, see {@link https://www.openhab.org/docs/configuration/items.html#parameter-expire}
 * @property {String} [autoupdate.value] `true` or `false`
 */

/**
 * Tag value to be attached to all dynamically created items.
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
      throw Error('Supplied item is undefined');
    }
    this.rawItem = rawItem;

    /**
         * Access historical states for this item
         * @type {items.ItemHistory}
         */
    this.history = new ItemHistory(rawItem);
  }

  /**
     * The type of the item: the Simple (without package) name of the Java item type, such as 'Switch'.
     * @return {String} the type
     */
  get type () {
    return this.rawItem.getClass().getSimpleName();
  }

  /**
     * The name of the item.
     * @return {String} the name
     */
  get name () {
    return this.rawItem.getName();
  }

  /**
     * The label attached to the item
     * @return {String} the label
     */
  get label () {
    return this.rawItem.getLabel();
  }

  /**
     * The state of the item, as a string.
     * @return {String} the item's state
     */
  get state () {
    return this.rawState.toString();
  }

  /**
     * The raw state of the item, as a java object.
     * @return {HostState} the item's state
     */
  get rawState () {
    return this.rawItem.state;
  }

  /**
     * Members / children / direct descendents of the current group item (as returned by 'getMembers()'). Must be a group item.
     * @returns {Item[]} member items
     */
  get members () {
    return utils.javaSetToJsArray(this.rawItem.getMembers()).map(raw => new Item(raw));
  }

  /**
     * All descendents of the current group item (as returned by 'getAllMembers()'). Must be a group item.
     * @returns {Item[]} all descendent items
     */
  get descendents () {
    return utils.javaSetToJsArray(this.rawItem.getAllMembers()).map(raw => new Item(raw));
  }

  /**
     * Whether this item is initialized.
     * @type {Boolean}
     * @returns true iff the item has not been initialized
     */
  get isUninitialized () {
    if (this.rawItem.state instanceof UnDefType ||
            this.rawItem.state.toString() === 'Undefined' ||
            this.rawItem.state.toString() === 'Uninitialized'
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
     * Gets metadata values for this item.
     * @param {String} namespace The namespace for the metadata to retreive
     * @returns {String} the metadata associated with this item and namespace
     */
  getMetadataValue (namespace) {
    return metadata.getValue(this.name, namespace);
  }

  /**
     * Updates metadata values for this item.
     * @param {String} namespace The namespace for the metadata to update
     * @param {String} value the value to update the metadata to
     * @returns {String} the updated value
     */
  updateMetadataValue (namespace, value) {
    return metadata.updateValue(this.name, namespace, value);
  }

  /**
     * Inserts or updates metadata values for this item.
     * @param {String} namespace The namespace for the metadata to update
     * @param {String} value the value to update the metadata to
     * @returns {Boolean} true iff a new value was inserted
     */
  upsertMetadataValue (namespace, value) {
    return metadata.upsertValue(this.name, namespace, value);
  }

  /**
     * Updates metadata values for this item.
     * @param {Map} namespaceToValues A map of namespaces to values to update
     */
  updateMetadataValues (namespaceToValues) {
    for (const k in namespaceToValues) {
      metadata.updateValue(this.name, k, namespaceToValues[k]);
    }
  }

  /**
     * Sends a command to the item
     * @param {String|HostState} value the value of the command to send, such as 'ON'
     * @see sendCommandIfDifferent
     * @see postUpdate
     */
  sendCommand (value) {
    events.sendCommand(this.rawItem, value);
  }

  /**
     * Sends a command to the item, but only if the current state is not what is being sent.
     * Note
     * @param {String|HostState} value the value of the command to send, such as 'ON'
     * @returns {Boolean} true if the command was sent, false otherwise
     * @see sendCommand
     */
  sendCommandIfDifferent (value) {
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
          throw Error('Toggle not supported for items of type ' + this.type);
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
     * Posts an update to the item
     * @param {String|HostState} value the value of the command to send, such as 'ON'
     * @see sendCommand
     */
  postUpdate (value) {
    events.postUpdate(this.rawItem, value);
  }

  /**
     * Gets the tags from this item
     * @returns {Array<String>} array of group names
     */
  get groupNames () {
    return utils.javaListToJsArray(this.rawItem.getGroupNames());
  }

  /**
     * Adds groups to this item
     * @param {...String|...Item} groupNamesOrItems one or more names of the groups (or the group items themselves)
     */
  addGroups (...groupNamesOrItems) {
    const groupNames = groupNamesOrItems.map((x) => (typeof x === 'string') ? x : x.name);
    this.rawItem.addGroupNames(groupNames);
    managedItemProvider.update(this.rawItem);
  }

  /**
     * Removes groups from this item
     * @param {...String|...Item} groupNamesOrItems one or more names of the groups (or the group items themselves)
     */
  removeGroups (...groupNamesOrItems) {
    const groupNames = groupNamesOrItems.map((x) => (typeof x === 'string') ? x : x.name);
    for (const groupName of groupNames) {
      this.rawItem.removeGroupName(groupName);
    }
    managedItemProvider.update(this.rawItem);
  }

  /**
     * Gets the tags from this item
     * @returns {Array<String>} array of tags
     */
  get tags () {
    return utils.javaSetToJsArray(this.rawItem.getTags());
  }

  /**
     * Adds tags to this item
     * @param {...String} tagNames names of the tags to add
     */
  addTags (...tagNames) {
    this.rawItem.addTags(tagNames);
    managedItemProvider.update(this.rawItem);
  }

  /**
     * Removes tags from this item
     * @param {...String} tagNames names of the tags to remove
     */
  removeTags (...tagNames) {
    for (const tagName of tagNames) {
      this.rawItem.removeTag(tagName);
    }
    managedItemProvider.update(this.rawItem);
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
 * @returns {Item} an {@link items.Item} object
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
    log.error('Failed to create item: ' + e);
    throw e;
  }
};

/**
 * Creates a new item within OpenHab. This Item will persist to the provider regardless of the lifecycle of the script creating it.
 *
 * Note that all items created this way have an additional tag attached, for simpler retrieval later. This tag is
 * created with the value {@link DYNAMIC_ITEM_TAG}.
 *
 * @memberof items
 * @param {ItemConfig} itemConfig the Item config describing the Item
 * @returns {Item} an {@link items.Item} object
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
        metadata.upsertValue(itemConfig.name, namespace[i], namespaceValue);
      } else if (typeof namespaceValue === 'object') { // namespace as key and { value: 'string', configuration: object } as value
        metadata.upsertValue(itemConfig.name, namespace[i], namespaceValue.value, namespaceValue.config);
      }
    }
  }

  if (itemConfig.type !== 'Group') {
    if (typeof itemConfig.channels === 'string') { // single channel link with string
      metadata.itemchannellink.upsertItemChannelLink(itemConfig.name, itemConfig.channels);
    } else if (typeof itemConfig.channels === 'object') { // multiple/complex channel links with channel as key and config object as value
      const channels = Object.keys(itemConfig.channels);
      for (const i in channels) metadata.itemchannellink.upsertItemChannelLink(itemConfig.name, channels[i], itemConfig.channels[channels[i]]);
    }
  }

  return getItem(itemConfig.name);
};

/**
 * Removes an Item from openHAB. The Item is removed immediately and cannot be recovered.
 *
 * @memberof items
 * @param {String|HostItem} itemOrItemName the Item or the name of the Item to remove
 * @returns {Boolean} true if the item was actually removed
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
    if (Java.typeName(e.class) === 'org.openhab.core.items.ItemNotFoundException') {
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
    if (Java.typeName(e.class) === 'org.openhab.core.items.ItemNotFoundException') {
      return true;
    } else { // If exception/error is not ItemNotFoundException, rethrow.
      throw Error(e);
    }
  }
};

/**
 * Replaces (upserts) an item. If an item exists with the same name, it will be removed and a new item with
 * the supplied parameters will be created in it's place. If an item does not exist with this name, a new
 * item will be created with the supplied parameters.
 *
 * This function can be useful in scripts which create a static set of items which may need updating either
 * periodically, during startup or even during development of the script. Using fixed item names will ensure
 * that the items remain up-to-date, but won't fail with issues related to duplicate items.
 *
 * @memberof items
 * @param {ItemConfig} itemConfig the Item config describing the Item
 * @returns {Item} an {@link items.Item} object
 * @throws {@link ItemConfig}.name or {@link ItemConfig}.type not set
 * @throws failed to create Item
 */
const replaceItem = function (itemConfig) {
  try {
    const item = getItem(itemConfig.name);
    if (typeof item !== 'undefined') {
      removeItem(itemConfig.name);
    }
  } catch (e) {
    if (('' + e).startsWith('org.openhab.core.items.ItemNotFoundException')) {
      // item not present
    } else {
      throw e;
    }
  }

  return addItem.apply(this, arguments);
};

/**
 * Gets an openHAB Item.
 * @memberof items
 * @param {String} name the name of the item
 * @param {String} nullIfMissing whether to return null if the item cannot be found (default is to throw an exception)
 * @return {items.Item} the item
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
 * @return {items.Item[]} all items
 */
const getItems = () => {
  return utils.javaSetToJsArray(itemRegistry.getItems()).map(i => new Item(i));
};

/**
 * Gets all openHAB Items with a specific tag.
 *
 * @memberof items
 * @param {...String} tagNames an array of tags to match against
 * @return {items.Item[]} the items with a tag that is included in the passed tags
 */
const getItemsByTag = (...tagNames) => {
  return utils.javaSetToJsArray(itemRegistry.getItemsByTag(tagNames)).map(i => new Item(i));
};

/**
 * Helper function to ensure an item name is valid. All invalid characters are replaced with an underscore.
 * @memberof items
 * @param {String} s the name to make value
 * @returns {String} a valid item name
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
  provider: require('./items-provider'),
  /**
     * Custom indexer, to allow static item lookup.
     * @example
     * let { my_object_name } = require('openhab').items.objects;
     * ...
     * let my_state = my_object_name.state; //my_object_name is an Item
     *
     * @returns {Object} a collection of items allowing indexing by item name
     */
  objects: () => new Proxy({}, {
    get: function (target, name) {
      if (typeof name === 'string' && /^-?\d+$/.test(name)) { return getItem(name); }

      throw Error('unsupported function call: ' + name);
    }
  })
};
