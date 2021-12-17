

const osgi = require('../osgi');
const utils = require('../utils');
const log = require('../log')('items');
const metadata = require('../metadata');
const ItemHistory = require('./item-history');

const { UnDefType, events, itemRegistry } = require('@runtime');

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
 * Class representing an openHAB Item
 * 
 * @memberOf items
 */
class Item {
    /**
     * Create an Item, wrapping a native Java openHAB Item. Don't use this constructor, instead call {@link getItem}.
     * @param {HostItem} rawItem Java Item from Host
     * @hideconstructor
     */
    constructor(rawItem) {
        if (typeof rawItem === 'undefined') {
            throw Error("Supplied item is undefined");
        }
        this.rawItem = rawItem;

        /**
         * Access historical states for this item
         * @type {items.ItemHistory}
         */
        this.history = new ItemHistory(rawItem);
    }

    /**
     * The type of the item: the Simple (without package) name of the Java item type, such as 'Switch'.
     * @return {String} the type
     */
    get type() {
        return this.rawItem.getClass().getSimpleName();
    }

    /**
     * The name of the item.
     * @returns {String} the name
     */
    get name() {
        return this.rawItem.getName();
    }

    /**
     * The label attached to the item
     * @returns {String} the label
     */
    get label() {
        return this.rawItem.getLabel();
    }

    /**
     * The state of the item, as a string.
     * @returns {String} the item's state
     */
    get state() {
        return this.rawState.toString();
    }

    /**
     * The raw state of the item, as a java object.
     * @returns {HostState} the item's state
     */
    get rawState() {
        return this.rawItem.state;
    }

    /**
     * Members / children / direct descendents of the current group item (as returned by 'getMembers()'). Must be a group item.
     * @returns {Item[]} member items
     * @example
     * const group = items.getItem('test_group').members;
     * for (let i = 0; i < group.length; i++) console.log(group[i].label);
     */
    get members() {
        return utils.javaSetToJsArray(this.rawItem.getMembers()).map(raw => new Item(raw));
    }

    /**
     * Names of members / children / direct descendents of the current group item (as returned by 'getMembers()'). Must be a group item.
     * @returns {Array} names of member items
     */
    get membersNames() {
        return this.members.map(item => item.name);
    }

    /**
     * Labels of members / children / direct descendents of the current group item (as returned by 'getMembers()') as a concatenated string. Must be a group item.
     * @returns {String} states of member items as concatenated string
     */
    get membersLabelsString() {
        return this.members.map(item => item.label).join(', ');
    }

    /**
     * Minimum state item of members / children / direct descendents of the current group item (as returned by 'getMembers()'). Must be a group item.
     * @returns {Item} item with the minimum state
     */
    get membersMin() {
        return this.members.reduce((min, item) => parseFloat(item.state) < parseFloat(min.state) ? item : min);
    }

    /**
     * Maximum state item of members / children / direct descendents of the current group item (as returned by 'getMembers()'). Must be a group item.
     * @returns {Item} item with the maximum state
     */
    get membersMax() {
        return this.members.reduce((min, item) => parseFloat(item.state) > parseFloat(min.state) ? item : min);
    }

    /**
     * Summarized value of members / children / direct descendents of the current group item (as returned by 'getMembers()'). Must be a group item.
     * Only includes items of type Number, Dimmer & Rollershutter in calculation.
     * @returns {Number} sum of states
     */
    get membersSum() {
        return this.members.filter(item => item.type === 'NumberItem' || item.type === 'DimmerItem' || item.type === 'RollershutterItem').reduce((sum, item) => sum + parseFloat(item.state), 0);
    }

    /**
     * Average value of members / children / direct descendents of the current group item (as returned by 'getMembers()'). Must be a group item.
     * Only includes items of type Number, Dimmer & Rollershutter in calculation.
     * @returns {Number} average of states
     */
    get membersAvg() {
        const numbers = this.members.filter(item => item.type === 'NumberItem' || item.type === 'DimmerItem' || item.type === 'RollershutterItem');
        return numbers.reduce((avg, item) => { return avg + parseFloat(item.state)/numbers.length; }, 0);
    }


    /**
     * All descendents of the current group item (as returned by 'getAllMembers()'). Must be a group item.
     * @returns {Item[]} all descendent items
     */
    get descendents() {
        return utils.javaSetToJsArray(this.rawItem.getAllMembers()).map(raw => new Item(raw));
    }

    /**
     * Names of all descendents of the current group item (as returned by 'getAllMembers()'). Must be a group item.
     * @returns {Array} names of descendent items
     */
     get descendentsNames() {
        return this.descendents.map(item => item.name);
    }

    /**
     * Labels of all descendents of the current group item (as returned by 'getAllMembers()'). Must be a group item.
     * @returns {String} states of descendent items as concatenated string
     */
    get descendentsLabelsString() {
        return this.descendents.map(item => item.label).join(', ');
    }

    /**
     * Minimum state item of all descendents of the current group item (as returned by 'getAllMembers()'). Must be a group item.
     * @returns {Item} item with the minimum state
     */
    get descendentsMin() {
        return this.descendents.reduce((min, item) => parseFloat(item.state) < parseFloat(min.state) ? item : min);
    }

    /**
     * Maximum state item of all descendents of the current group item (as returned by 'getAllMembers()'). Must be a group item.
     * @returns {Item} item with the maximum state
     */
    get descendents() {
        return this.descendents.reduce((min, item) => parseFloat(item.state) > parseFloat(min.state) ? item : min);
    }

    /**
     * Summarized value of all descendents of the current group item (as returned by 'getAllMembers()'). Must be a group item.
     * Only includes items of type Number, Dimmer & Rollershutter in calculation.
     * @returns {Number} sum of states
     */
    get descendentsSum() {
        return this.descendents.filter(item => item.type === 'NumberItem' || item.type === 'DimmerItem' || item.type === 'RollershutterItem').reduce((sum, item) => sum + parseFloat(item.state), 0);
    }

    /**
     * Average value of all descendents of the current group item (as returned by 'getAllMembers()'). Must be a group item.
     * Only includes items of type Number, Dimmer & Rollershutter in calculation.
     * @returns {Number} average of states
     */
    get descendentsAvg() {
        const numbers = this.descendents.filter(item => item.type === 'NumberItem' || item.type === 'DimmerItem' || item.type === 'RollershutterItem');
        return numbers.reduce((avg, item) => { return avg + parseFloat(item.state)/numbers.length; }, 0);
    }

    /**
     * Whether this item is initialized.
     * @type {Boolean}
     * @returns true iff the item has not been initialized
     */
    get isUninitialized() {
        if (this.rawItem.state instanceof UnDefType
            || this.rawItem.state.toString() == "Undefined"
            || this.rawItem.state.toString() == "Uninitialized"
        ) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Gets metadata values for this item.
     * @param {String} namespace The namespace for the metadata to retreive
     * @returns {String} the metadata associated with this item and namespace
     */
    getMetadataValue(namespace) {
        return metadata.getValue(this.name, namespace);
    }

    /**
     * Updates metadata values for this item.
     * @param {String} namespace The namespace for the metadata to update
     * @param {String} value the value to update the metadata to
     * @returns {String} the updated value
     */
    updateMetadataValue(namespace, value) {
        return metadata.updateValue(this.name, namespace, value);
    }

    /**
     * Inserts or updates metadata values for this item.
     * @param {String} namespace The namespace for the metadata to update
     * @param {String} value the value to update the metadata to
     * @returns {Boolean} true iff a new value was inserted
     */
    upsertMetadataValue(namespace, value) {
        return metadata.upsertValue(this.name, namespace, value);
    }

    /**
     * Updates metadata values for this item.
     * @param {Map} namespaceToValues A map of namespaces to values to update
     */
    updateMetadataValues(namespaceToValues) {
        for(let k in namespaceToValues) {
            metadata.updateValue(this.name, k, namespaceToValues[k]);
        }
    }

    /**
     * Sends a command to the item
     * @param {String|HostState} value the value of the command to send, such as 'ON'
     * @see sendCommandIfDifferent
     * @see postUpdate
     */
    sendCommand(value) {
        log.debug("Sending command {} to {}", value, this.name);
        events.sendCommand(this.rawItem, value);
    }

    /**
     * Sends a command to the item, but only if the current state is not what is being sent.
     * Note
     * @param {String|HostState} value the value of the command to send, such as 'ON'
     * @returns {Boolean} true if the command was sent, false otherwise
     * @see sendCommand
     */
    sendCommandIfDifferent(value) {
        if (value.toString() != this.state.toString()) {
            this.sendCommand(value);
            return true;
        }

        return false;
    }

    /**
     * Posts an update to the item
     * @param {String|HostState} value the value of the command to send, such as 'ON'
     * @see sendCommand
     */
    postUpdate(value) {
        events.postUpdate(this.rawItem, value);
        log.debug("Posted update {} to {}", value, this.name);
    }

    /**
     * Adds groups to this item
     * @param {Array<String|Item>} groupNamesOrItems names of the groups (or the group items themselves)
     */
    addGroups(...groupNamesOrItems) {
        let groupNames = groupNamesOrItems.map((x) => (typeof x === 'string') ? x : x.name);
        this.rawItem.addGroupNames(groupNames);
        managedItemProvider.update(this.rawItem);
    }

    /**
     * Removes groups from this item
     * @param {Array<String|Item>} groupNamesOrItems names of the groups (or the group items themselves)
     */
    removeGroups(...groupNamesOrItems) {
        let groupNames = groupNamesOrItems.map((x) => (typeof x === 'string') ? x : x.name);
        for(let groupName of groupNames) {
            this.rawItem.removeGroupName(groupName);
        }
        managedItemProvider.update(this.rawItem);
    }

    /**
     * Gets the tags from this item
     */
    get tags() {
        return utils.javaSetToJsArray(this.rawItem.getTags());
    }

    /**
     * Adds tags to this item
     * @param {Array<String>} tagNames names of the tags to add
     */
    addTags(...tagNames) {
        this.rawItem.addTags(tagNames);
        managedItemProvider.update(this.rawItem);
    }

    /**
     * Removes tags from this item
     * @param {Array<String>} tagNames names of the tags to remove
     */
    removeTags(...tagNames) {
        for(let tagName of tagNames) {
            this.rawItem.removeTag(tagName);
        }
        managedItemProvider.update(this.rawItem);
    }
}
/**
 * Gets an openHAB Item.
 * @memberOf items
 * @param {String} name the name of the item
 * @param {String} nullIfMissing whether to return null if the item cannot be found (default is to throw an exception)
 * @return {items.Item} the item
 */
const getItem = (name, nullIfMissing = false) => {
    try {
        if (typeof name === 'string' || name instanceof String) {
            return new Item(itemRegistry.getItem(name));
        }
    } catch(e) {
        if(nullIfMissing) {
            return null;
        } else {
            throw e;
        }
    }
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
    Item,
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
