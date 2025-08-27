const osgi = require('../osgi');
const utils = require('../utils');
const environment = require('../environment');
const log = require('../log')('itemchannellink');
const { _getItemName } = require('../helpers');

const itemChannelLinkRegistry = environment.useProviderRegistries()
  ? require('@runtime/provider').itemChannelLinkRegistry
  : osgi.getService('org.openhab.core.thing.link.ItemChannelLinkRegistry');
const JavaItemChannelLink = Java.type('org.openhab.core.thing.link.ItemChannelLink');
const ChannelUID = Java.type('org.openhab.core.thing.ChannelUID');
const Configuration = Java.type('org.openhab.core.config.core.Configuration');

/**
 * Item channel link namespace.
 * This namespace provides access to Item channel links.
 *
 * @namespace items.itemChannelLink
 */

/**
 * @typedef {import('./items').Item} Item
 * @private
 */

/**
 * Class representing an openHAB Item -> channel link.
 *
 * @memberof items.itemChannelLink
 * @hideconstructor
 */
class ItemChannelLink {
  /**
   * Create an ItemChannelLink instance, wrapping native openHAB Item -> channel link.
   * @param {*} rawItemChannelLink {@link https://www.openhab.org/javadoc/latest/org/openhab/core/thing/link/itemchannellink org.openhab.core.thing.link.ItemChannelLink}
   */
  constructor (rawItemChannelLink) {
    this.rawItemChannelLink = rawItemChannelLink;
  }

  /**
   * The name of the linked Item.
   * @return {string}
   */
  get itemName () {
    return this.rawItemChannelLink.getItemName().toString();
  }

  /**
   * The UID of the linked channel.
   * @return {string}
   */
  get channelUID () {
    return this.rawItemChannelLink.getLinkedUID().toString();
  }

  /**
   * The channel link configuration.
   * @return {object}
   */
  get configuration () {
    return utils.javaMapToJsObj(this.rawItemChannelLink.getConfiguration().getProperties());
  }

  toString () {
    return this.rawItemChannelLink.toString();
  }
}

/**
 * Gets a channel link of from an Item.
 *
 * @memberof items.itemChannelLink
 * @param {Item|string} itemOrName {@link Item} or the name of the Item
 * @param {string} channelUID
 * @returns {ItemChannelLink|null} the ItemChannelLink or `null` if none exists
 */
function getItemChannelLink (itemOrName, channelUID) {
  const itemName = _getItemName(itemOrName);
  log.debug(`Getting ItemChannelLink ${itemName} -> ${channelUID} from registry.`);
  const itemChannelLink = itemChannelLinkRegistry.get(itemName + ' -> ' + channelUID);
  if (itemChannelLink === null) return null;
  return new ItemChannelLink(itemChannelLink);
}

/**
 * Creates a new ItemChannelLink object.
 * This ItemChannelLink is not registered with any provider and therefore cannot be accessed.
 *
 * @private
 * @param {string} itemName the name of the Item
 * @param {string} channelUID
 * @param {object} [conf] channel configuration
 * @returns {JavaItemChannelLink} ItemChannelLink object
 */
function _createItemChannelLink (itemName, channelUID, conf) {
  log.debug(`Creating ItemChannelLink ${itemName} -> ${channelUID}`);
  if (typeof conf === 'object') {
    log.debug(`  with configuration: ${JSON.stringify(conf)}`);
    return new JavaItemChannelLink(itemName, new ChannelUID(channelUID), new Configuration(conf));
  } else {
    return new JavaItemChannelLink(itemName, new ChannelUID(channelUID));
  }
}

/**
 * Adds a new channel link to an Item.
 *
 * If this is called from file-based scripts, the Item -> channel link is registered with the ScriptedItemChannelLinkProvider and shares the same lifecycle as the script.
 * You can still persist the Item -> channel link permanently in this case by setting the `persist` parameter to `true`.
 * If this is called from UI-based scripts, the Item -> channel link is stored to the ManagedItemChannelLinkProvider and independent of the script's lifecycle.
 *
 * @memberOf items.itemChannelLink
 * @param {Item|string} itemOrName {@link Item} or the name of the Item
 * @param {string} channelUID
 * @param {object} [configuration] channel configuration
 * @param {boolean} [persist=false] whether to persist the Item -> channel link permanently (only respected for file-based scripts)
 * @returns {ItemChannelLink} the ItemChannelLink
 * @throws {Error} if the Item -> channel link already exists
 */
function addItemChannelLink (itemOrName, channelUID, configuration, persist = false) {
  const itemName = _getItemName(itemOrName);
  log.debug(`Adding ItemChannelLink ${itemName} -> ${channelUID} to registry...`);
  let itemChannelLink = _createItemChannelLink(itemName, channelUID, configuration);
  try {
    itemChannelLink = (persist && environment.useProviderRegistries()) ? itemChannelLinkRegistry.addPermanent(itemChannelLink) : itemChannelLinkRegistry.add(itemChannelLink);
  } catch (e) {
    if (e instanceof Java.type('java.lang.IllegalArgumentException')) {
      throw new Error(`Cannot add ItemChannelLink ${itemName} -> ${channelUID}: already exists`);
    } else {
      throw e; // re-throw other errors
    }
  }
  return new ItemChannelLink(itemChannelLink);
}

/**
 * Updates a channel link of an Item.
 *
 * @private
 * @param {string} itemName the name of the Item
 * @param {string} channelUID
 * @param {object} [configuration] channel configuration
 * @returns {ItemChannelLink|null} the old ItemChannelLink or `null` if none exists
 */
function _updateItemChannelLink (itemName, channelUID, configuration) {
  log.debug(`Updating ItemChannelLink ${itemName} -> ${channelUID} in registry...`);
  let itemChannelLink = _createItemChannelLink(itemName, channelUID, configuration);
  itemChannelLink = itemChannelLinkRegistry.update(itemChannelLink);
  if (itemChannelLink === null) return null;
  return new ItemChannelLink(itemChannelLink);
}

/**
 * Adds or updates a channel link of an Item.
 * If you use this in file-based scripts, better use {@link addItemChannelLink} to provide channel links.
 *
 * If an Item -> channel link is not provided by this script or the ManagedItemChannelLinkProvider, it is not editable and a warning is logged.
 *
 * @memberof items.itemChannelLink
 * @param {Item|string} itemOrName {@link Item} or the name of the Item
 * @param {string} channelUID
 * @param {object} [configuration] channel configuration
 * @returns {ItemChannelLink|null} the old ItemChannelLink or `null` if it did not exist
 */
function replaceItemChannelLink (itemOrName, channelUID, configuration) {
  const itemName = _getItemName(itemOrName);
  const itemChannelLink = getItemChannelLink(itemName, channelUID);
  return (itemChannelLink === null) ? addItemChannelLink(itemName, channelUID, configuration) : _updateItemChannelLink(itemName, channelUID, configuration);
}

/**
 * Removes a channel link from an Item.
 *
 * @memberof items.itemChannelLink
 * @param {Item|string} itemOrName {@link Item} or the name of the Item
 * @param {string} channelUID
 * @returns {ItemChannelLink|null} the removed ItemChannelLink or `null` if none exists, or it cannot be removed
 */
function removeItemChannelLink (itemOrName, channelUID) {
  const itemName = _getItemName(itemOrName);
  log.debug(`Removing ItemChannelLink ${itemName} -> ${channelUID} from registry...`);
  const itemChannelLink = itemChannelLinkRegistry.remove(itemName + ' -> ' + channelUID);
  if (itemChannelLink === null) return null;
  return new ItemChannelLink(itemChannelLink);
}

/**
 * Removes all channel links from the given Item.
 *
 * @memberof items.itemChannelLink
 * @param {string} itemName the name of the Item
 * @returns {number} number of links removed
 */
function removeLinksForItem (itemName) {
  return itemChannelLinkRegistry.removeLinksForItem(itemName);
}

/**
 * Removes all orphaned (Item or channel missing) links.
 *
 * @memberof items.itemChannelLink
 * @returns {number} number of links removed
 */
function removeOrphanedItemChannelLinks () {
  return itemChannelLinkRegistry.purge();
}

module.exports = {
  getItemChannelLink,
  addItemChannelLink,
  replaceItemChannelLink,
  removeItemChannelLink,
  removeLinksForItem,
  removeOrphanedItemChannelLinks,
  ItemChannelLink
};
