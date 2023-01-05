/**
 * @typedef {import('../items').Item} Item
 * @private
 */

/**
 * Item channel link namespace.
 * This namespace provides access to Item channel links.
 *
 * @namespace items.metadata.itemchannellink
 */

const osgi = require('../../osgi');
const utils = require('../../utils');
const log = require('../../log')('itemchannellink');
const { _getItemName } = require('../../helpers');

const itemChannelLinkRegistry = osgi.getService('org.openhab.core.thing.link.ItemChannelLinkRegistry');
const ItemChannelLink = Java.type('org.openhab.core.thing.link.ItemChannelLink');
const ChannelUID = Java.type('org.openhab.core.thing.ChannelUID');
const Configuration = Java.type('org.openhab.core.config.core.Configuration');

/**
 * Creates a new ItemChannelLink object.
 *
 * @private
 * @param {string} itemName the name of the Item
 * @param {string} channelUID
 * @param {object} [conf] channel configuration
 * @returns {ItemChannelLink} ItemChannelLink object
 */
const _createItemChannelLink = function (itemName, channelUID, conf) {
  log.debug(`Creating ItemChannelLink ${itemName} -> ${channelUID}...`);
  if (typeof conf === 'object') {
    log.debug(`  .. with configuration ${conf}`);
    return new ItemChannelLink(itemName, new ChannelUID(channelUID), new Configuration(conf));
  } else {
    return new ItemChannelLink(itemName, new ChannelUID(channelUID));
  }
};

/**
 * Gets an ItemChannelLink.
 *
 * @memberof items.metadata.itemchannellink
 * @param {Item|string} itemOrName {@link Item} or the name of the Item
 * @param {string} channelUID
 * @returns {{itemName: string, configuration: *, channelUID: string}|null} the ItemChannelLink or `null` if none exists
 */
const getItemChannelLink = function (itemOrName, channelUID) {
  const itemName = _getItemName(itemOrName);
  log.debug(`Getting ItemChannelLink ${itemName} -> ${channelUID} from provider...`);
  const itemChannelLink = itemChannelLinkRegistry.get(itemName + ' -> ' + channelUID);
  if (itemChannelLink === null || itemChannelLink === undefined) return null;
  return {
    itemName: itemChannelLink.getItemName().toString(),
    channelUID: itemChannelLink.getLinkedUID().toString(),
    configuration: utils.javaMapToJsObj(itemChannelLink.getConfiguration().getProperties())
  };
};

/**
 * Adds a new ItemChannelLink. Therefore, it adds a channel link to an Item.
 *
 * @private
 * @param {string} itemName the name of the Item
 * @param {string} channelUID
 * @param {object} [conf] channel configuration
 * @returns {{itemName: string, configuration: *, channelUID: string}} the ItemChannelLink
 */
const _addItemChannelLink = function (itemName, channelUID, conf) {
  log.debug(`Adding ItemChannelLink ${itemName} -> ${channelUID} to provider...`);
  const itemChannelLink = _createItemChannelLink(itemName, channelUID, conf);
  itemChannelLinkRegistry.add(itemChannelLink);
  return {
    itemName: itemChannelLink.getItemName().toString(),
    channelUID: itemChannelLink.getLinkedUID().toString(),
    configuration: utils.javaMapToJsObj(itemChannelLink.getConfiguration().getProperties())
  };
};

/**
 * Updates an ItemChannelLink. Therefore, it updates the channel link of an Item.
 *
 * @private
 * @param {string} itemName the name of the Item
 * @param {string} channelUID
 * @param {object} [conf] channel configuration
 * @returns {{itemName: string, configuration: *, channelUID: string}|null} the old ItemChannelLink or `null` if none exists
 */
const _updateItemChannelLink = function (itemName, channelUID, conf) {
  log.debug(`Updating ItemChannelLink ${itemName} -> ${channelUID} in provider...`);
  const itemChannelLink = _createItemChannelLink(itemName, channelUID, conf);
  itemChannelLinkRegistry.update(itemChannelLink);
  if (itemChannelLink === null || itemChannelLink === undefined) return null;
  return {
    itemName: itemChannelLink.getItemName().toString(),
    channelUID: itemChannelLink.getLinkedUID().toString(),
    configuration: utils.javaMapToJsObj(itemChannelLink.getConfiguration().getProperties())
  };
};

/**
 * Adds or updates an ItemChannelLink.
 *
 * @memberof items.metadata.itemchannellink
 * @param {Item|string} itemOrName {@link Item} or the name of the Item
 * @param {string} channelUID
 * @param {object} [conf] channel configuration
 * @returns {{itemName: string, configuration: *, channelUID: string}|null} the old ItemChannelLink or `null` if it did not exist
 */
const replaceItemChannelLink = function (itemOrName, channelUID, conf) {
  const itemName = _getItemName(itemOrName);
  const existing = getItemChannelLink(itemName, channelUID);
  if (existing === null) {
    _addItemChannelLink(itemName, channelUID, conf);
  } else {
    _updateItemChannelLink(itemName, channelUID, conf);
  }
  return existing;
};

/**
 * Removes an ItemChannelLink. Therefore, the channel link is removed from the Item.
 *
 * @memberof items.metadata.itemchannellink
 * @param {Item|string} itemOrName {@link Item} or the name of the Item
 * @param {string} channelUID
 * @returns {{itemName: string, configuration: *, channelUID: string}|null} the removed ItemChannelLink or `null` if none exists
 */
const removeItemChannelLink = function (itemOrName, channelUID) {
  const itemName = _getItemName(itemOrName);
  log.debug(`Removing ItemChannelLink ${itemName} -> ${channelUID} from provider...`);
  const itemChannelLink = itemChannelLinkRegistry.remove(itemName + ' -> ' + channelUID);
  if (itemChannelLink === null || itemChannelLink === undefined) return null;
  return {
    itemName: itemChannelLink.getItemName().toString(),
    channelUID: itemChannelLink.getLinkedUID().toString(),
    configuration: utils.javaMapToJsObj(itemChannelLink.getConfiguration().getProperties())
  };
};

module.exports = {
  getItemChannelLink,
  replaceItemChannelLink,
  removeItemChannelLink
};
