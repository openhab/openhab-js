const osgi = require('../osgi');
const utils = require('../utils');
const environment = require('../environment');
const { _getItemName } = require('../helpers');

const metadataRegistry = environment.useProviderRegistries()
  ? require('@runtime/provider').metadataRegistry
  : osgi.getService('org.openhab.core.items.MetadataRegistry');
const Metadata = Java.type('org.openhab.core.items.Metadata');
const MetadataKey = Java.type('org.openhab.core.items.MetadataKey');

/**
 * Item metadata namespace.
 * This namespace provides access to Item metadata.
 *
 * @namespace items.metadata
 */

/**
 * @typedef {import('./items').Item} Item
 * @private
 */

/**
 * Class representing openHAB Item metadata.
 *
 * @memberof items.metadata
 * @hideconstructor
 */
class ItemMetadata {
  /**
   * The metadata value.
   * @type {string}
   */
  value;
  /**
   * The metadata configuration.
   * @type {object}
   */
  configuration;

  /**
   * Create an ItemMetadata instance, wrapping native openHAB Item metadata.
   * @param {*} rawMetadata {@link https://www.openhab.org/javadoc/latest/org/openhab/core/items/metadata org.openhab.core.items.Metadata}
   */
  constructor (rawMetadata) {
    /**
     * raw Java {@link https://www.openhab.org/javadoc/latest/org/openhab/core/items/metadata org.openhab.core.items.Metadata}
     * @type {*}
     */
    this.rawMetadata = rawMetadata;

    this.value = this.rawMetadata.getValue();
    this.configuration = utils.javaMapToJsObj(this.rawMetadata.getConfiguration());
  }

  /**
   * The metadata key.
   * @return {string}
   */
  get key () {
    return this.rawMetadata.getUID().toString();
  }

  toString () {
    return `Metadata [key=${this.key}, value=${this.value}, configuration=${JSON.stringify(this.configuration)}]`;
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
  if (meta === null) return null;
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
 * @returns {{ namespace: ItemMetadata }|ItemMetadata|null} all metadata as an object with the namespaces as properties OR metadata of a single
 *   namespace or `null` if that namespace doesn't exist; the metadata itself is of type {@link ItemMetadata}
 */
function getMetadata (itemOrName, namespace) {
  const itemName = _getItemName(itemOrName);
  if (namespace !== undefined) return _getSingleItemMetadata(itemName, namespace);
  return _getAllItemMetadata(itemName);
}

/**
 * Creates a {@link https://www.openhab.org/javadoc/latest/org/openhab/core/items/metadata org.openhab.core.items.Metadata}.
 *
 * @private
 * @param {string} itemName
 * @param {string} namespace
 * @param {string} value
 * @param {object} configuration
 * @return {*} an instance of {@link https://www.openhab.org/javadoc/latest/org/openhab/core/items/metadata org.openhab.core.items.Metadata}
 */
function _createMetadata (itemName, namespace, value, configuration) {
  const configurationClone = Object.assign({}, configuration);
  for (const key in configurationClone) {
    const value = configurationClone[key];
    if (typeof value === 'object') {
      /*
      * Some reasoning for this:
      * Generally, storing objects in metadata is not the best idea, as they are not necessarily serializable and therefore JSONDB will not be able to store them.
      * Wrt to JavaScript objects specifically, they are passed by reference (as all objects), and that reference becomes invalid if the script that created the
      *   object is reloaded, causing various issues failure of related REST API endpoints.
      * */
      console.warn(`Metadata configuration values must be primitive types, not objects. Ignoring configuration for key '${key}' of metadata '${namespace}' for Item '${itemName}'`);
      delete configurationClone[key];
    }
  }

  const key = new MetadataKey(namespace, itemName);
  return new Metadata(key, value, configurationClone);
}

/**
 * Adds metadata of a single namespace to an Item.
 *
 * If this is called from file-based scripts, the metadata is registered with the ScriptedMetadataProvider and shares the same lifecycle as the script.
 * You can still persist the metadata permanently in this case by setting the `persist` parameter to `true`.
 * If this is called from UI-based scripts, the metadata is stored to the ManagedMetadataProvider and independent of the script's lifecycle.
 *
 * @memberof items.metadata
 * @param {Item|string} itemOrName {@link Item} or the name of the Item
 * @param {string} namespace name of the metadata
 * @param {string} value value for this metadata
 * @param {object} [configuration] optional metadata configuration
 * @param {boolean} [persist=false] whether to persist the metadata permanently (only respected for file-based scripts)
 * @returns {ItemMetadata} the added metadata
 * @throws {Error} if the Item already has metadata of the given namespace
 */
function addMetadata (itemOrName, namespace, value, configuration, persist = false) {
  const itemName = _getItemName(itemOrName);
  const newMetadata = _createMetadata(itemName, namespace, value, configuration);
  try {
    const meta = (persist && environment.useProviderRegistries()) ? metadataRegistry.addPermanent(newMetadata) : metadataRegistry.add(newMetadata);
    return new ItemMetadata(meta);
  } catch (e) {
    if (e instanceof Java.type('java.lang.IllegalStateException')) {
      throw new Error(`Cannot add metadata '${namespace}' for Item '${itemName}': metadata already exists`);
    } else {
      throw e; // re-throw other errors
    }
  }
}

/**
 * Updates or adds metadata of a single namespace to an Item.
 * When using file-based scripts, it is recommended to use {@link items.metadata.addMetadata} instead.
 *
 * If metadata is not provided by this script or the ManagedMetadataProvider, it is not editable and a warning is logged.
 *
 * @see items.Item.replaceMetadata
 * @memberof items.metadata
 * @param {Item|string} itemOrName {@link Item} or the name of the Item
 * @param {string} namespace name of the metadata
 * @param {string} value value for this metadata
 * @param {object} [configuration] optional metadata configuration
 * @returns {ItemMetadata|null} old metadata or `null` if the Item had no metadata with the given name
 */
function replaceMetadata (itemOrName, namespace, value, configuration) {
  const itemName = _getItemName(itemOrName);
  const key = new MetadataKey(namespace, itemName);
  const newMetadata = _createMetadata(itemName, namespace, value, configuration);
  let metadata = metadataRegistry.get(key);
  metadata = (metadata === null) ? metadataRegistry.add(newMetadata) : metadataRegistry.update(newMetadata);
  if (metadata === null) return null;
  return new ItemMetadata(metadata);
}

/**
 * Removes metadata of a single namespace or of all namespaces from a given Item.
 *
 * @see items.Item.removeMetadata
 * @memberof items.metadata
 * @param {Item|string} itemOrName {@link Item} or the name of the Item
 * @param {string} [namespace] name of the metadata: if provided, only metadata of this namespace is removed, else all metadata is removed
 * @returns {ItemMetadata|null} removed metadata OR `null` if the Item has no metadata under the given namespace, or it cannot be removed or all metadata was removed
 */
function removeMetadata (itemOrName, namespace) {
  const itemName = _getItemName(itemOrName);

  if (namespace !== undefined) {
    const key = new MetadataKey(namespace, itemName);
    const meta = metadataRegistry.remove(key);
    if (meta === null) return null;
    return new ItemMetadata(meta);
  } else {
    return metadataRegistry.removeItemMetadata(itemName);
  }
}

module.exports = {
  getMetadata,
  addMetadata,
  replaceMetadata,
  removeMetadata,
  itemChannelLink: {
    get () {
      console.warn('items.metadata.itemchannellink is deprecated, use items.itemChannelLink instead');
      return require('./itemchannellink');
    }
  },
  ItemMetadata
};
