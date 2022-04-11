const osgi = require('../osgi');
const log = require('../log')('itemchannellink');

const ItemChannelLink = Java.type('org.openhab.core.thing.link.ItemChannelLink');
const ChannelUID = Java.type('org.openhab.core.thing.ChannelUID');
const managedItemChannelLinkProvider = osgi.getService('org.openhab.core.thing.link.ManagedItemChannelLinkProvider');

/**
 * Creates a new ItemChannelLink object.
 *
 * @private
 * @memberof metadata
 * @param {String} itemName the name of the Item
 * @param {String} channel channelUID as string
 * @returns {ItemChannelLink} ItemChannelLink object
 */
const createItemChannelLink = function (itemName, channel) {
  log.debug('Creating item channel link {} -> {}', itemName, channel);
  return new ItemChannelLink(itemName, new ChannelUID(channel));
};

/**
 * Adds a new ItemChannelLink to the registry. That means, it adds a channel link to a given Item.
 *
 * @memberof metadata
 * @param {String} itemName the name of the Item
 * @param {String} channel channelUID as string
 * @returns {ItemChannelLink} ItemChannelLink object
 */
const addItemChannelLink = function (itemName, channel) {
  log.debug('Adding item channel link {} -> {}', itemName, channel);
  const itemChannelLink = createItemChannelLink(itemName, channel);
  managedItemChannelLinkProvider.add(itemChannelLink);
  return itemChannelLink;
};

/**
 * Adds a new ItemChannelLink to the registry. That means, it removes a channel link from a given Item.
 *
 * @memberof metadata
 * @param {String} itemName the name of the Item
 * @param {String} channel channelUID as string
 * @returns {ItemChannelLink} ItemChannelLink object
 */
const removeItemChannelLink = function (itemName, channel) {
  log.debug('Adding item channel link {} -> {}', itemName, channel);
  const itemChannelLink = createItemChannelLink(itemName, channel);
  managedItemChannelLinkProvider.remove(itemChannelLink);
  return itemChannelLink;
};

module.exports = {
  addItemChannelLink,
  removeItemChannelLink
};
