const osgi = require('../osgi');
const log = require('../log')('itemchannellink');

const ItemChannelLink = Java.type('org.openhab.core.thing.link.ItemChannelLink');
const ChannelUID = Java.type('org.openhab.core.thing.ChannelUID');
const Configuration = Java.type('org.openhab.core.config.core.Configuration');
const managedItemChannelLinkProvider = osgi.getService('org.openhab.core.thing.link.ManagedItemChannelLinkProvider');

/**
 * Creates a new ItemChannelLink object.
 *
 * @private
 * @memberof metadata
 * @param {String} itemName the name of the Item
 * @param {String} channel channelUID as string
 * @param {Map} [conf] Map of channel configuration
 * @returns {ItemChannelLink} ItemChannelLink object
 */
const createItemChannelLink = function (itemName, channel, conf) {
  log.debug('Creating Item channel link {} -> {}', itemName, channel);
  if (typeof conf === 'object') {
    log.debug('  .. with configuration.');
    return new ItemChannelLink(itemName, new ChannelUID(channel), new Configuration(conf));
  } else {
    return new ItemChannelLink(itemName, new ChannelUID(channel));
  }
};

/**
 * Gets an ItemChannelLink from the provider.
 *
 * @private
 * @memberof metadata
 * @param {String} itemName the name of the Item
 * @param {String} channel channelUID as string
 * @returns {ItemChannelLink|null} if ItemChannelLink is registered in provider, ItemChannelLink, else null
 */
const getItemChannelLink = function (itemName, channel) {
  log.debug('Getting Item channel link {} -> {} from provider', itemName, channel);
  return managedItemChannelLinkProvider.get(itemName + ' -> ' + channel);
};

/**
 * Adds a new ItemChannelLink to the provider. Therefore, it adds a channel link to an Item.
 *
 * @private
 * @memberof metadata
 * @param {String} itemName the name of the Item
 * @param {String} channel channelUID as string
 * @param {Map<String, any>} [conf] Map of channel configuration
 * @returns {ItemChannelLink} ItemChannelLink object
 */
const addItemChannelLink = function (itemName, channel, conf) {
  log.debug('Adding Item channel link {} -> {} to provider', itemName, channel);
  const itemChannelLink = createItemChannelLink(itemName, channel, conf);
  managedItemChannelLinkProvider.add(itemChannelLink);
  return itemChannelLink;
};

/**
 * Update an ItemChannelLink in the provider. Therefore, it updates the channel link of an Item.
 *
 * @private
 * @memberof metadata
 * @param {String} itemName the name of the Item
 * @param {String} channel channelUID as string
 * @param {Map<String, String>} [conf] Map of channel configuration
 * @returns {ItemChannelLink} ItemChannelLink object
 */
const updateItemChannelLink = function (itemName, channel, conf) {
  log.debug('Updating Item channel link {} -> {} in provider', itemName, channel);
  const itemChannelLink = createItemChannelLink(itemName, channel, conf);
  managedItemChannelLinkProvider.update(itemChannelLink);
  return itemChannelLink;
};

/**
 * Adds (inserts) or updates an Item channel link.
 *
 * @memberof metadata
 * @param {String} itemName the name of the Item
 * @param {String} channel channelUID as string
 * @param {Map<String, String>} [conf] Map of channel configuration
 * @returns true if the channel link was added, false if it was updated
 */
const upsertItemChannelLink = function (itemName, channel, conf) {
  const existing = getItemChannelLink(itemName, channel);
  if (existing === null) {
    addItemChannelLink(itemName, channel, conf);
    return true;
  } else {
    updateItemChannelLink(itemName, channel, conf);
    return false;
  }
};

/**
 * Removes an ItemChannelLink from the provider. Therefore, the channel link is removed from the Item.
 *
 * @memberof metadata
 * @param {String} itemName the name of the Item
 * @param {String} channel channelUID as string
 * @returns {ItemChannelLink} the removed ItemChannelLink
 */
const removeItemChannelLink = function (itemName, channel) {
  log.debug('Removing Item channel link {} -> {} from provider', itemName, channel);
  return managedItemChannelLinkProvider.remove(itemName + ' -> ' + channel);
};

module.exports = {
  upsertItemChannelLink,
  removeItemChannelLink
};
