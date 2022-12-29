/**
 * Item metadata namespace.
 * This namespace provides access to Item metadata.
 *
 * @namespace items.metadata
 */

const osgi = require('../../osgi');

const metadataRegistry = osgi.getService('org.openhab.core.items.MetadataRegistry');
const Metadata = Java.type('org.openhab.core.items.Metadata');
const MetadataKey = Java.type('org.openhab.core.items.MetadataKey');

/**
 * Gets metadata with the given name from the given Item.
 *
 * @memberOf items.metadata
 * @param {string} itemName the name of the Item
 * @param {string} namespace name of the metadata
 * @returns {{configuration: *, value: string}|null} metadata or `null` if the Item has no metadata with the given name
 */
const getMetadata = function (itemName, namespace) {
  const key = new MetadataKey(namespace, itemName);
  const meta = metadataRegistry.get(key);
  if (meta === null || meta === undefined) return null;
  return {
    value: meta.getValue(),
    configuration: meta.getConfiguration()
  };
};

/**
 * Updates or adds the given metadata to an Item.
 *
 * @memberof items.metadata
 * @param {string} itemName the name of the Item
 * @param {string} namespace name of the metadata
 * @param {string} value value for this metadata
 * @param {object} [configuration] optional metadata configuration
 * @returns {{configuration: *, value: string}|null} old metadata or `null` if the Item has no metadata with the given name
 */
const replaceMetadata = function (itemName, namespace, value, configuration) {
  const key = new MetadataKey(namespace, itemName);
  const newMetadata = new Metadata(key, value, configuration);
  const meta = (metadataRegistry.get(key) === null) ? metadataRegistry.add(newMetadata) : metadataRegistry.update(newMetadata);
  if (meta === null || meta === undefined) return null;
  return {
    value: meta.getValue(),
    configuration: meta.getConfiguration()
  };
};

/**
 * Removes metadata with a given name from a given Item.
 *
 * @memberof items.metadata
 * @param {string} itemName the name of the Item
 * @param {string} namespace name of the metadata
 * @returns {{configuration: *, value: string}|null} removed metadata or `null` if the Item has no metadata with the given name
 */
const removeMetadata = function (itemName, namespace) {
  const key = new MetadataKey(namespace, itemName);
  const meta = metadataRegistry.remove(key);
  if (meta === null || meta === undefined) return null;
  return {
    value: meta.getValue(),
    configuration: meta.getConfiguration()
  };
};

module.exports = {
  getMetadata,
  replaceMetadata,
  removeMetadata,
  itemchannellink: require('./itemchannellink')
};
