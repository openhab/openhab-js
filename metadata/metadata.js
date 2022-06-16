/**
 * Items' metadata namespace.
 * This namespace provides access to metadata on items.
 *
 * @namespace metadata
 */

const osgi = require('../osgi');
// const utils = require('../utils');
const log = require('../log')('metadata');

const MetadataRegistry = osgi.getService('org.openhab.core.items.MetadataRegistry');
const Metadata = Java.type('org.openhab.core.items.Metadata');
const MetadataKey = Java.type('org.openhab.core.items.MetadataKey');

/**
 * This function will return the Metadata object associated with the specified Item.
 *
 * @memberof metadata
 * @param {string} itemName name of the Item
 * @param {string} namespace name of the namespace
 * @returns {String|null} the metadata as a string, or null
 */
const getValue = function (itemName, namespace) {
  const result = MetadataRegistry.get(new MetadataKey(namespace, itemName));
  return result ? result.value : null;
};

const addValue = function (itemName, namespace, value, config) {
  const key = new MetadataKey(namespace, itemName);
  MetadataRegistry.add(new Metadata(key, value, config));
};

const updateValue = function (itemName, namespace, value, config) {
  const metadata = createMetadata(itemName, namespace, value, config);
  const result = MetadataRegistry.update(metadata);
  return result ? result.value : null;
};

/**
 * Adds (inserts) or updates a metadata value.
 *
 * @memberof metadata
 * @param {string} itemName the name of the Item
 * @param {string} namespace the name of the namespace
 * @param {string} value the value to insert or update
 * @param {Map<String, String>} [config] configuration of namespace
 * @returns {boolean} true if the value was added, false if it was updated
 */
const upsertValue = function (itemName, namespace, value, config) {
  const existing = getValue(itemName, namespace);

  if (existing === null) {
    addValue(itemName, namespace, value, config);
    return true;
  } else {
    updateValue(itemName, namespace, value, config);
    return false;
  }
};

const createMetadata = function (itemName, namespace, value) {
  log.debug('Creating metadata {}:{} = {}', namespace, itemName, value);
  const key = new MetadataKey(namespace, itemName);
  return new Metadata(key, value, {});
};

module.exports = {
  getValue,
  addValue,
  updateValue,
  upsertValue,
  provider: require('./metadata-provider'),
  itemchannellink: require('./itemchannellink')
};
