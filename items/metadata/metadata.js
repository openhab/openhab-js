/**
 * @typedef {import('../items').Item} Item
 * @private
 */

/**
 * Item metadata namespace.
 * This namespace provides access to Item metadata.
 *
 * @namespace items.metadata
 */

const osgi = require('../../osgi');
const utils = require('../../utils');
const { _getItemName } = require('../../helpers');

const metadataRegistry = osgi.getService('org.openhab.core.items.MetadataRegistry');
const Metadata = Java.type('org.openhab.core.items.Metadata');
const MetadataKey = Java.type('org.openhab.core.items.MetadataKey');

/**
 * Gets metadata with the given name from the given Item.
 *
 * @memberOf items.metadata
 * @param {Item|string} itemOrName {@link Item} or the name of the Item
 * @param {string} namespace name of the metadata
 * @returns {{configuration: object, value: string}|null} metadata or `null` if the Item has no metadata with the given name
 */
const getMetadata = function (itemOrName, namespace) {
  const key = new MetadataKey(namespace, _getItemName(itemOrName));
  const meta = metadataRegistry.get(key);
  if (meta === null || meta === undefined) return null;
  return {
    value: meta.getValue(),
    configuration: utils.javaMapToJsObj(meta.getConfiguration())
  };
};

/**
 * Updates or adds the given metadata to an Item.
 *
 * @memberof items.metadata
 * @param {Item|string} itemOrName {@link Item} or the name of the Item * @param {string} namespace name of the metadata
 * @param {string} value value for this metadata
 * @param {object} [configuration] optional metadata configuration
 * @returns {{configuration: object, value: string}|null} old metadata or `null` if the Item has no metadata with the given name
 */
const replaceMetadata = function (itemOrName, namespace, value, configuration) {
  const key = new MetadataKey(namespace, _getItemName(itemOrName));
  const newMetadata = new Metadata(key, value, configuration);
  const meta = (metadataRegistry.get(key) === null) ? metadataRegistry.add(newMetadata) : metadataRegistry.update(newMetadata);
  if (meta === null || meta === undefined) return null;
  return {
    value: meta.getValue(),
    configuration: utils.javaMapToJsObj(meta.getConfiguration())
  };
};

/**
 * Removes metadata with a given name from a given Item.
 *
 * @memberof items.metadata
 * @param {Item|string} itemOrName {@link Item} or the name of the Item
 * @param {string} namespace name of the metadata
 * @returns {{configuration: object, value: string}|null} removed metadata or `null` if the Item has no metadata with the given name
 */
const removeMetadata = function (itemOrName, namespace) {
  const key = new MetadataKey(namespace, _getItemName(itemOrName));
  const meta = metadataRegistry.remove(key);
  if (meta === null || meta === undefined) return null;
  return {
    value: meta.getValue(),
    configuration: utils.javaMapToJsObj(meta.getConfiguration())
  };
};

module.exports = {
  getMetadata,
  replaceMetadata,
  removeMetadata,
  itemchannellink: require('./itemchannellink')
};
