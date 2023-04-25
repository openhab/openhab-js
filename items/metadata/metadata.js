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
 * Class representing an openHAB Item metadata namespace
 *
 * @memberof items.metadata
 * @hideconstructor
 */
class ItemMetadata {
  /**
   * @param {*} rawMetadata {@link https://www.openhab.org/javadoc/latest/org/openhab/core/items/metadata org.openhab.core.items.Metadata}
   */
  constructor (rawMetadata) {
    /**
     * metadata namespace's value
     * @type {string}
     */
    this.value = rawMetadata.getValue();
    /**
     * metadata namespace's configuration
     * @type {object}
     */
    this.configuration = utils.javaMapToJsObj(rawMetadata.getConfiguration());
  }
}

/**
 * Gets all metadata from a given Item.
 *
 * @example
 * var meta = items.metadata.getItemMetadata('Kitchen_Light');
 * var namespaces = Array.from(meta.keys());
 * var stateDescription = meta.get('stateDescription');
 *
 * @private
 * @param {string} itemName the name of the Item
 * @returns {{ namespace: ItemMetadata }} object of all Item metadata with one property for each namespace; each namespace is of type {@link ItemMetadata}
 */
function _getAllItemMetadata (itemName) {
  const metadata = {};
  // TODO: Move implementation to openHAB Core
  metadataRegistry.stream().filter((meta) => meta.getUID().getItemName().equals(itemName)).forEach((meta) => {
    metadata[meta.getUID().getNamespace()] = new ItemMetadata(meta);
  });
  return metadata;
}

/**
 * Gets metadata of a single namespace from the given Item.
 *
 * @private
 * @param {string} itemName the name of the Item
 * @param {string} namespace namespace of the metadata
 * @returns {ItemMetadata|null} metadata or `null` if the Item has no metadata under the given namespace
 */
function _getSingleItemMetadata (itemName, namespace) {
  const key = new MetadataKey(namespace, itemName);
  const meta = metadataRegistry.get(key);
  if (meta === null || meta === undefined) return null;
  return new ItemMetadata(meta);
}

/**
 * Gets metadata of a single namespace or of all namespaces from a given Item.
 *
 * @example
 * // Get metadata of ALL namespaces
 * var meta = items.metadata.getMetadata(items.Hallway_Light);
 * var namespaces = Object.keys(meta); // Get metadata namespaces
 * // Get metadata of a single namespace
 * meta = items.metadata.getMetadata(items.Hallway_Light, 'expire');
 *
 * @see items.Item.getMetadata
 * @memberOf items.metadata
 * @param {Item|string} itemOrName {@link Item} or the name of the Item
 * @param {string} [namespace] name of the metadata: if provided, only metadata of this namespace is returned, else all metadata is returned
 * @returns {{ namespace: ItemMetadata }|ItemMetadata|null} all metadata as an object with the namespaces as properties OR metadata of a single namespace or `null` if that namespace doesn't exist; the metadata itself is of type {@link ItemMetadata}
 */
function getMetadata (itemOrName, namespace) {
  const itemName = _getItemName(itemOrName);
  if (namespace !== undefined) return _getSingleItemMetadata(itemName, namespace);
  return _getAllItemMetadata(itemName);
}

/**
 * Updates or adds metadata of a single namespace to an Item.
 *
 * @see items.Item.replaceMetadata
 * @memberof items.metadata
 * @param {Item|string} itemOrName {@link Item} or the name of the Item * @param {string} namespace name of the metadata
 * @param {string} namespace name of the metadata
 * @param {string} value value for this metadata
 * @param {object} [configuration] optional metadata configuration
 * @returns {ItemMetadata|null} old metadata or `null` if the Item has no metadata with the given name
 */
function replaceMetadata (itemOrName, namespace, value, configuration) {
  const key = new MetadataKey(namespace, _getItemName(itemOrName));
  const newMetadata = new Metadata(key, value, configuration);
  const meta = (metadataRegistry.get(key) === null) ? metadataRegistry.add(newMetadata) : metadataRegistry.update(newMetadata);
  if (meta === null || meta === undefined) return null;
  return new ItemMetadata(meta);
}

/**
 * Removes metadata of a single namespace or of all namespaces from a given Item.
 *
 * @see items.Item.removeMetadata
 * @memberof items.metadata
 * @param {Item|string} itemOrName {@link Item} or the name of the Item
 * @param {string} [namespace] name of the metadata: if provided, only metadata of this namespace is removed, else all metadata is removed
 * @returns {ItemMetadata|null} removed metadata OR `null` if the Item has no metadata under the given namespace or all metadata was removed
 */
function removeMetadata (itemOrName, namespace) {
  const itemName = _getItemName(itemOrName);

  if (namespace !== undefined) {
    const key = new MetadataKey(namespace, itemName);
    const meta = metadataRegistry.remove(key);
    if (meta === null || meta === undefined) return null;
    return new ItemMetadata(meta);
  } else {
    return metadataRegistry.removeItemMetadata(itemName);
  }
}

module.exports = {
  getMetadata,
  replaceMetadata,
  removeMetadata,
  itemchannellink: require('./itemchannellink'),
  ItemMetadata
};
