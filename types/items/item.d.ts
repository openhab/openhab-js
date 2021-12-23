export = Item;
/**
 * Class representing an openHAB Item
 *
 * @memberOf items
 */
declare class Item {
    /**
     * Create an Item, wrapping a native Java openHAB Item. Don't use this constructor, instead call {@link getItem}.
     * @param {HostItem} rawItem Java Item from Host
     * @hideconstructor
     */
    constructor(rawItem: any);
    rawItem: any;
    /**
     * Access historical states for this item
     * @type {ItemHistory}
     */
    history: ItemHistory;
    /**
     * The type of the item: the Simple (without package) name of the Java item type, such as 'Switch'.
     * @return {String} the type
     */
    get type(): string;
    /**
     * The name of the item.
     * @return {String} the name
     */
    get name(): string;
    /**
     * The label attached to the item
     * @return {String} the label
     */
    get label(): string;
    /**
     * The state of the item, as a string.
     * @return {String} the item's state
     */
    get state(): string;
    /**
     * The raw state of the item, as a java object.
     * @return {HostState} the item's state
     */
    get rawState(): any;
    /**
     * Members / children / direct descendents of the current group item (as returned by 'getMembers()'). Must be a group item.
     * @returns {Item[]} member items
     */
    get members(): import("openhab/items/item")[];
    /**
     * All descendents of the current group item (as returned by 'getAllMembers()'). Must be a group item.
     * @returns {Item[]} all descendent items
     */
    get descendents(): import("openhab/items/item")[];
    /**
     * Whether this item is initialized.
     * @type {Boolean}
     * @returns true iff the item has not been initialized
     */
    get isUninitialized(): boolean;
    /**
     * Gets metadata values for this item.
     * @param {String} namespace The namespace for the metadata to retreive
     * @returns {String} the metadata associated with this item and namespace
     */
    getMetadataValue(namespace: string): string;
    /**
     * Updates metadata values for this item.
     * @param {String} namespace The namespace for the metadata to update
     * @param {String} value the value to update the metadata to
     * @returns {String} the updated value
     */
    updateMetadataValue(namespace: string, value: string): string;
    /**
     * Inserts or updates metadata values for this item.
     * @param {String} namespace The namespace for the metadata to update
     * @param {String} value the value to update the metadata to
     * @returns {Boolean} true iff a new value was inserted
     */
    upsertMetadataValue(namespace: string, value: string): boolean;
    /**
     * Updates metadata values for this item.
     * @param {Map<any, any>} namespaceToValues A map of namespaces to values to update
     */
    updateMetadataValues(namespaceToValues: Map<any, any>): void;
    /**
     * Sends a command to the item
     * @param {String|HostState} value the value of the command to send, such as 'ON'
     * @see sendCommandIfDifferent
     * @see postUpdate
     */
    sendCommand(value: string | HostState): void;
    /**
     * Sends a command to the item, but only if the current state is not what is being sent.
     * Note
     * @param {String|HostState} value the value of the command to send, such as 'ON'
     * @returns {Boolean} true if the command was sent, false otherwise
     * @see sendCommand
     */
    sendCommandIfDifferent(value: string | HostState): boolean;
    /**
     * Posts an update to the item
     * @param {String|HostState} value the value of the command to send, such as 'ON'
     * @see sendCommand
     */
    postUpdate(value: string | HostState): void;
    /**
     * Adds groups to this item
     * @param {Array<String|Item>} groupNamesOrItems names of the groups (or the group items themselves)
     */
    addGroups(...groupNamesOrItems: Array<string | Item>): void;
    /**
     * Removes groups from this item
     * @param {Array<String|Item>} groupNamesOrItems names of the groups (or the group items themselves)
     */
    removeGroups(...groupNamesOrItems: Array<string | Item>): void;
    /**
     * Gets the tags from this item
     */
    get tags(): any;
    /**
     * Adds tags to this item
     * @param {Array<String>} tagNames names of the tags to add
     */
    addTags(...tagNames: Array<string>): void;
    /**
     * Removes tags from this item
     * @param {Array<String>} tagNames names of the tags to remove
     */
    removeTags(...tagNames: Array<string>): void;
}
declare namespace Item {
    export { HostItem, HostGroupFunction, HostState };
}
import ItemHistory = require("openhab/items/item-history");
type HostState = any;
type HostItem = any;
type HostGroupFunction = any;
