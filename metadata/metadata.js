/**
 * Items' metadata namespace.
 * This namespace provides access to metadata on items.
 * 
 * @private
 * @namespace metadata
 */

const osgi = require('../osgi');
const log = require('../log')('metadata');

let MetadataRegistry = osgi.getService("org.openhab.core.items.MetadataRegistry");
let Metadata = Java.type("org.openhab.core.items.Metadata");
let MetadataKey = Java.type("org.openhab.core.items.MetadataKey");

/**
 * Class representing an Item's Metadata
 * 
 * @memberOf metadata
 */
class ItemMetadata {

    /**
     * Don't use this constructor, instead call {@link items.Item.metadata}.
     * @param {String} itemName
     * @hideconstructor
     */
    constructor(itemName) {
        this.itemName = itemName;
    }

    /**
     * This function will return the Metadata value associated with the
     * specified Item.
     * 
     * @param {String} namespace name of the namespace
     * @returns {String|null} the metadata value as a string, or null
     */
    getValue(namespace) {
        let result = MetadataRegistry.get(new MetadataKey(namespace, this.itemName));
        return result ? result.value : null;
    };

    /**
    * Adds (inserts) a metadata value.
    * 
    * @param {String} namespace the name of the namespace
    * @param {String} value the value to insert or update
    */
    addValue(namespace, value) {
        let key = new MetadataKey(namespace, this.itemName);
        MetadataRegistry.add(new Metadata(key, value, {}));
    }

    /**
    * Updates metadata values for this item.
    * @param {String} namespace The namespace for the metadata to update
    * @param {String} value the value to update the metadata to
    * @returns {String} the updated value
    */
    updateValue(namespace, value) {
        let metadata = createMetadata(this.itemName, namespace, value);
        let result = MetadataRegistry.update(metadata);
        return result ? result.value : null;
    }

    /**
     * Updates metadata values for this item.
     * @param {Map} namespaceToValues A map of namespaces to values to update
     */
    updateValues(namespaceToValues) {
        for (let k in namespaceToValues) {
            this.updateValue(this.itemName, k, namespaceToValues[k]);
        }
    }

    /**
     * Adds (inserts) or updates a metadata value.
     * 
     * @param {String} namespace the name of the namespace
     * @param {String} value the value to insert or update
     * @returns {Boolean} true if the value was added, false if it was updated
     */
    upsertValue(namespace, value) {
        let existing = getValue(this.itemName, namespace);

        if (existing === null) {
            addValue(this.itemName, namespace, value);
            return true;
        } else {
            updateValue(this.itemName, namespace, value);
            return false;
        }
    }

    /**
     * This function will return the Metadata configuration value associated with the
     * specified Item or null if it does not exist
     * 
     * @param {String} namespace name of the namespace
     * @returns {String|null} the metadata configuration value as a string, or null
     */
    getConfigurationValue(namespace, key) {
        let result = MetadataRegistry.get(new MetadataKey(namespace, this.itemName));
        return result && result.configuration.containsKey(key) ? result.configuration[key] : null;
    };

    createMetadata(namespace, value) {
        log.debug("Creating metadata {}:{} = {}", namespace, this.itemName, value);
        let key = new MetadataKey(namespace, this.itemName);
        return new Metadata(key, value, {});
    }

}

module.exports = {
    ItemMetadata,
    provider: require('./metadata-provider')
};
