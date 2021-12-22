/**
 * @typedef { import("../index").HostItem } HostItem
 * @typedef { import("../index").HostGroupFunction } HostGroupFunction
 * @typedef { import("../index").HostState } HostState
 * @typedef { import("./item") } Item
 * 
*/

const osgi = require('../osgi');
const utils = require('../utils');
const log = require('../log')('items');

const { itemRegistry } = require('@runtime');

const itemBuilderFactory = osgi.getService("org.openhab.core.items.ItemBuilderFactory");

const managedItemProvider = osgi.getService("org.openhab.core.items.ManagedItemProvider");

/**
 * @namespace items
 */

/**
 * Tag value to be attached to all dynamically created items.
 */
const DYNAMIC_ITEM_TAG = "_DYNAMIC_";



/**
 * Creates a new item within OpenHab. This item is not registered with any provider.
 * 
 * Note that all items created this way have an additional tag attached, for simpler retrieval later. This tag is
 * created with the value {@link DYNAMIC_ITEM_TAG}.
 * 
 * @memberOf items
 * @param {String} itemName Item name for the Item to create
 * @param {String} [itemType] the type of the Item
 * @param {String} [category] the category (icon) for the Item
 * @param {String[]} [groups] an array of groups the Item is a member of
 * @param {String} [label] the label for the Item
 * @param {String[]} [tags] an array of tags for the Item
 * @param {HostItem} [giBaseType] the group Item base type for the Item
 * @param {HostGroupFunction} [groupFunction] the group function used by the Item
 * @param {Map<any, any>} [itemMetadata] a map of metadata to set on the item
 */
const createItem = function (itemName, itemType, category, groups, label, tags, giBaseType, groupFunction, itemMetadata) {
    itemName = safeItemName(itemName);

    let baseItem;
    if (itemType === 'Group' && typeof giBaseType !== 'undefined') {
        baseItem = itemBuilderFactory.newItemBuilder(giBaseType, itemName + "_baseItem").build()
    }

    if (itemType !== 'Group') {
        groupFunction = undefined;
    }

    if (typeof tags === 'undefined') {
        tags = [];
    }

    tags.push(DYNAMIC_ITEM_TAG);

    try {
        var builder = itemBuilderFactory.newItemBuilder(itemType, itemName).
            withCategory(category).
            withLabel(label);

        builder = builder.withTags(utils.jsArrayToJavaSet(tags));

        if (typeof groups !== 'undefined') {
            builder = builder.withGroups(utils.jsArrayToJavaList(groups));
        }

        if (typeof baseItem !== 'undefined') {
            builder = builder.withBaseItem(baseItem);
        }
        if (typeof groupFunction !== 'undefined') {
            builder = builder.withGroupFunction(groupFunction);
        }

        var item = builder.build();

        return new Item(item);
    } catch (e) {
        log.error("Failed to create item: " + e);
        throw e;
    }
}

/**
 * Creates a new item within OpenHab. This item will persist regardless of the lifecycle of the script creating it.
 * 
 * Note that all items created this way have an additional tag attached, for simpler retrieval later. This tag is
 * created with the value {@link DYNAMIC_ITEM_TAG}.
 * 
 * @memberOf items
 * @param {String} itemName Item name for the Item to create
 * @param {String} [itemType] the type of the Item
 * @param {String} [category] the category (icon) for the Item
 * @param {String[]} [groups] an array of groups the Item is a member of
 * @param {String} [label] the label for the Item
 * @param {String[]} [tags] an array of tags for the Item
 * @param {HostItem} [giBaseType] the group Item base type for the Item
 * @param {HostGroupFunction} [groupFunction] the group function used by the Item
 */
const addItem = function (itemName, itemType, category, groups, label, tags, giBaseType, groupFunction) {
    let item = createItem(...arguments);
    managedItemProvider.add(item.rawItem);
    log.debug("Item added: {}", item.name);
    return item;
}

/**
 * Removes an item from OpenHab. The item is removed immediately and cannot be recoved.
 * 
 * @memberOf items
 * @param {String|HostItem} itemOrItemName the item to remove
 * @returns {Boolean} true iff the item is actually removed
 */
const removeItem = function (itemOrItemName) {

    var itemName;

    if (typeof itemOrItemName === 'string') {
        itemName = itemOrItemName;
    } else if (itemOrItemName.hasOwnProperty('name')) {
        itemName = itemOrItemName.name;
    } else {
        log.warn('Item not registered (or supplied name is not a string) so cannot be removed');
        return false;
    }

    if (typeof getItem(itemName) === 'undefined') {
        log.warn('Item not registered so cannot be removed');
        return false;
    }

    managedItemProvider.remove(itemName);

    if (typeof itemRegistry.getItem(itemName) === 'undefined') {
        log.debug("Item removed: " + itemName);
        return true;
    } else {
        log.warn("Failed to remove item: " + itemName);
        return false;
    }
}

/**
 * Replaces (upserts) an item. If an item exists with the same name, it will be removed and a new item with
 * the supplied parameters will be created in it's place. If an item does not exist with this name, a new
 * item will be created with the supplied parameters.
 * 
 * This function can be useful in scripts which create a static set of items which may need updating either
 * periodically, during startup or even during development of the script. Using fixed item names will ensure
 * that the items remain up-to-date, but won't fail with issues related to duplicate items.
 * 
 * @memberOf items
 * @param {String} itemName Item name for the Item to create
 * @param {String} [itemType] the type of the Item
 * @param {String} [category] the category (icon) for the Item
 * @param {String[]} [groups] an array of groups the Item is a member of
 * @param {String} [label] the label for the Item
 * @param {String[]} [tags] an array of tags for the Item
 * @param {HostItem} [giBaseType] the group Item base type for the Item
 * @param {HostGroupFunction} [groupFunction] the group function used by the Item
 */
const replaceItem = function (/* same args as addItem */) {
    var itemName = arguments[0];
    try {
        var item = getItem(itemName);
        if (typeof item !== 'undefined') {
            log.debug("Removing existing item " + itemName + "[" + item + "] to replace with updated one");
            removeItem(itemName);
        }
    } catch (e) {
        if (("" + e).startsWith("org.openhab.core.items.ItemNotFoundException")) {
            // item not present
        } else {
            throw e;
        }
    }

    return addItem.apply(this, arguments);
}

/**
 * Gets an openHAB Item.
 * @memberOf items
 * @param {String} name the name of the item
 * @param {String} nullIfMissing whether to return null if the item cannot be found (default is to throw an exception)
 * @return {Item} the item
 */
const getItem = (name, nullIfMissing = false) => {
    try {
        if (typeof name === 'string' || name instanceof String) {
            return new Item(itemRegistry.getItem(name));
        }
    } catch (e) {
        if (nullIfMissing) {
            return null;
        } else {
            throw e;
        }
    }
}

/**
 * Gets all openHAB Items with a specific tag.
 * 
 * @memberOf items
 * @param {String[]} tagNames an array of tags to match against
 * @return {Item[]} the items with a tag that is included in the passed tags
 */
const getItemsByTag = (...tagNames) => {
    return utils.javaSetToJsArray(itemRegistry.getItemsByTag(tagNames)).map(i => new Item(i));
}

/**
 * Helper function to ensure an item name is valid. All invalid characters are replaced with an underscore.
 * @memberOf items
 * @param {String} s the name to make value
 * @returns {String} a valid item name
 */
const safeItemName = s => s.
    replace(/[\"\']/g, ''). //delete
    replace(/[^a-zA-Z0-9]/g, '_'); //replace with underscore

module.exports = {
    safeItemName,
    getItem,
    addItem,
    getItemsByTag,
    replaceItem,
    createItem,
    removeItem,
    // Item,
    /**
     * Custom indexer, to allow static item lookup.
     * @example
     * let { my_object_name } = require('openhab').items.objects;
     * ...
     * let my_state = my_object_name.state; //my_object_name is an Item
     * 
     * @returns {Object} a collection of items allowing indexing by item name
     */
    objects: () => new Proxy({}, {
        get: function (target, name) {
            if (typeof name === 'string' && /^-?\d+$/.test(name))
                return getItem(name);

            throw Error("unsupported function call: " + name);
        }
    })
}
