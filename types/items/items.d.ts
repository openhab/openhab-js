/**
 * configuration describing an Item
 */
export type ItemConfig = {
    /**
     * the type of the Item
     */
    type: string;
    /**
     * Item name for the Item to create
     */
    name: string;
    /**
     * the label for the Item
     */
    label?: string;
    /**
     * the category (icon) for the Item
     */
    category?: string;
    /**
     * an array of groups the Item is a member of
     */
    groups?: string[];
    /**
     * an array of tags for the Item
     */
    tags?: string[];
    /**
     * for single channel link a string or for multiple an object { channeluid: configuration }; configuration is an object
     */
    channels?: string | any;
    /**
     * either object `{ namespace: value }` or `{ namespace: `{@link ItemMetadata }` }`
     */
    metadata?: any;
    /**
     * the group Item base type for the Item
     */
    giBaseType?: string;
    /**
     * the group function used by the Item
     */
    groupFunction?: HostGroupFunction;
};
/**
 * Helper function to ensure an Item name is valid. All invalid characters are replaced with an underscore.
 * @memberof items
 * @param {string} s the name to make value
 * @returns {string} a valid Item name
 */
export function safeItemName(s: string): string;
/**
 * Gets an openHAB Item.
 * @memberof items
 * @param {string} name the name of the Item
 * @param {boolean} [nullIfMissing=false] whether to return null if the Item cannot be found (default is to throw an exception)
 * @returns {Item|null} {@link items.Item} Item or `null` if `nullIfMissing` is true and Item is missing
 */
export function getItem(name: string, nullIfMissing?: boolean): Item | null;
/**
 * Gets all openHAB Items.
 *
 * @memberof items
 * @returns {Item[]} {@link items.Item}[]: all Items
 */
export function getItems(): Item[];
/**
 * Creates a new Item within OpenHab. This Item will persist to the provider regardless of the lifecycle of the script creating it.
 *
 * Note that all Items created this way have an additional tag attached, for simpler retrieval later. This tag is
 * created with the value {@link DYNAMIC_ITEM_TAG}.
 *
 * @memberof items
 * @param {ItemConfig} itemConfig the Item config describing the Item
 * @returns {Item} {@link Items.Item}
 * @throws {Error} {@link ItemConfig}.name or {@link ItemConfig}.type not set
 * @throws failed to create Item
 */
export function addItem(itemConfig: ItemConfig): Item;
/**
 * Gets all openHAB Items with a specific tag.
 *
 * @memberof items
 * @param {string[]} tagNames an array of tags to match against
 * @returns {Item[]} {@link items.Item}[]: the Items with a tag that is included in the passed tags
 */
export function getItemsByTag(...tagNames: string[]): Item[];
/**
 * Replaces (or adds) an Item. If an Item exists with the same name, it will be removed and a new Item with
 * the supplied parameters will be created in its place. If an Item does not exist with this name, a new
 * Item will be created with the supplied parameters.
 *
 * This function can be useful in scripts which create a static set of Items which may need updating either
 * periodically, during startup or even during development of the script. Using fixed Item names will ensure
 * that the Items remain up-to-date, but won't fail with issues related to duplicate Items.
 *
 * @memberof items
 * @param {ItemConfig} itemConfig the Item config describing the Item
 * @returns {Item|null} the old Item or `null` if it did not exist
 * @throws {Error} {@link ItemConfig}.name or {@link ItemConfig}.type not set
 * @throws failed to create Item
 */
export function replaceItem(itemConfig: ItemConfig): Item | null;
/**
 * Creates a new Item object. This Item is not registered with any provider and therefore can not be accessed.
 *
 * Note that all Items created this way have an additional tag attached, for simpler retrieval later. This tag is
 * created with the value {@link DYNAMIC_ITEM_TAG}.
 *
 * @memberof items
 * @private
 * @param {ItemConfig} itemConfig the Item config describing the Item
 * @returns {Item} {@link items.Item}
 * @throws {Error} {@link ItemConfig}.name or {@link ItemConfig}.type not set
 * @throws failed to create Item
 */
export function createItem(itemConfig: ItemConfig): Item;
/**
 * Removes an Item from openHAB. The Item is removed immediately and cannot be recovered.
 *
 * @memberof items
 * @param {string|Item} itemOrItemName the Item or the name of the Item to remove
 * @returns {Item|null} the Item that has been removed or `null` if it has not been removed
 */
export function removeItem(itemOrItemName: string | Item): Item | null;
/**
 * Class representing an openHAB Item
 *
 * @memberof items
 */
export class Item {
    /**
     * Create an Item, wrapping a native Java openHAB Item. Don't use this constructor, instead call {@link getItem}.
     * @param {HostItem} rawItem Java Item from Host
     * @hideconstructor
     */
    constructor(rawItem: HostItem);
    /**
     * raw Java Item
     * @type {HostItem}
     */
    rawItem: HostItem;
    /**
     * Access historical states for this Item {@link items.ItemHistory}
     * @type {ItemHistory}
     */
    history: ItemHistory;
    /**
     * Access Semantic information of this Item {@link items.ItemSemantics}
     * @type {ItemSemantics}
     */
    semantics: ItemSemantics;
    /**
     * Type of Item: the Simple (without package) name of the Java Item type, such as 'Switch'.
     * @type {string}
     */
    get type(): string;
    /**
     * Name of Item
     * @type {string}
     */
    get name(): string;
    /**
     * Label attached to Item
     * @type {string}
     */
    get label(): string;
    /**
     * String representation of the Item state.
     * @type {string}
     */
    get state(): string;
    /**
     * Numeric representation of Item state, or `null` if state is not numeric
     * @type {number|null}
     */
    get numericState(): number;
    /**
     * Item state as {@link Quantity} or `null` if state is not Quantity-compatible
     * @type {Quantity|null}
     */
    get quantityState(): import("../quantity").QuantityClass;
    /**
     * Raw state of Item, as a Java {@link https://www.openhab.org/javadoc/latest/org/openhab/core/types/state State object}
     * @type {HostState}
     */
    get rawState(): HostState;
    /**
     * Members / children / direct descendents of the current group Item (as returned by 'getMembers()'). Must be a group Item.
     * @type {Item[]}
     */
    get members(): Item[];
    /**
     * All descendents of the current group Item (as returned by 'getAllMembers()'). Must be a group Item.
     * @type {Item[]}
     */
    get descendents(): Item[];
    /**
     * Whether this Item is uninitialized (`true if it has not been initialized`).
     * @type {boolean}
     */
    get isUninitialized(): boolean;
    /**
     * Gets metadata of a single namespace or of all namespaces from this Item.
     *
     * @example
     * // Get metadata of ALL namespaces
     * var meta = Item.getMetadata();
     * var namespaces = Object.keys(meta); // Get metadata namespaces
     * // Get metadata of a single namespace
     * meta = Item.getMetadata('expire');
     *
     * @see items.metadata.getMetadata
     * @param {string} [namespace] name of the metadata: if provided, only metadata of this namespace is returned, else all metadata is returned
     * @returns {{ namespace: ItemMetadata }|ItemMetadata|null} all metadata as an object with the namespaces as properties OR metadata of a single namespace or `null` if that namespace doesn't exist; the metadata itself is of type {@link ItemMetadata}
     */
    getMetadata(namespace?: string): {
        namespace: ItemMetadata;
    } | ItemMetadata | null;
    /**
     * Updates or adds metadata of a single namespace to this Item.
     *
     * @see items.metadata.replaceMetadata
     * @param {string} namespace name of the metadata
     * @param {string} value value for this metadata
     * @param {object} [configuration] optional metadata configuration
     * @returns {{configuration: *, value: string}|null} old metadata or `null` if the Item has no metadata with the given name
     */
    replaceMetadata(namespace: string, value: string, configuration?: object): {
        configuration: any;
        value: string;
    } | null;
    /**
     * Removes metadata of a single namespace from this Item.
     *
     * @see items.metadata.removeMetadata
     * @param {string} [namespace] name of the metadata: if provided, only metadata of this namespace is removed, else all metadata is removed
     * @returns {ItemMetadata|null} removed metadata OR `null` if the Item has no metadata under the given namespace or all metadata was removed
     */
    removeMetadata(namespace?: string): ItemMetadata | null;
    /**
     * Sends a command to the Item.
     *
     * @param {string|time.ZonedDateTime|HostState} value the value of the command to send, such as 'ON'
     * @see sendCommandIfDifferent
     * @see postUpdate
     */
    sendCommand(value: string | time.ZonedDateTime | HostState): void;
    /**
     * Sends a command to the Item, but only if the current state is not what is being sent.
     *
     * @param {string|time.ZonedDateTime|HostState} value the value of the command to send, such as 'ON'
     * @returns {boolean} true if the command was sent, false otherwise
     * @see sendCommand
     */
    sendCommandIfDifferent(value: string | time.ZonedDateTime | HostState): boolean;
    /**
     * Calculates the toggled state of this Item. For Items like Color and
     * Dimmer, getStateAs(OnOffType) is used and the toggle calculated off
     * of that.
     * @returns the toggled state (e.g. 'OFF' if the Item is 'ON')
     * @throws error if the Item is uninitialized or is a type that doesn't make sense to toggle
     */
    getToggleState(): "PAUSE" | "PLAY" | "OPEN" | "CLOSED" | "ON" | "OFF";
    /**
     * Sends a command to flip the Item's state (e.g. if it is 'ON' an 'OFF'
     * command is sent).
     * @throws error if the Item is uninitialized or a type that cannot be toggled or commanded
     */
    sendToggleCommand(): void;
    /**
     * Posts an update to flip the Item's state (e.g. if it is 'ON' an 'OFF'
     * update is posted).
     * @throws error if the Item is uninitialized or a type that cannot be toggled
     */
    postToggleUpdate(): void;
    /**
     * Posts an update to the Item.
     *
     * @param {string|time.ZonedDateTime|HostState} value the value of the command to send, such as 'ON'
     * @see postToggleUpdate
     * @see sendCommand
     */
    postUpdate(value: string | time.ZonedDateTime | HostState): void;
    /**
     * Gets the names of the groups this Item is member of.
     * @returns {string[]}
     */
    get groupNames(): string[];
    /**
     * Adds groups to this Item
     * @param {...string|...Item} groupNamesOrItems one or more names of the groups (or the group Items themselves)
     */
    addGroups(...groupNamesOrItems: any[]): void;
    /**
     * Removes groups from this Item
     * @param {...string|...Item} groupNamesOrItems one or more names of the groups (or the group Items themselves)
     */
    removeGroups(...groupNamesOrItems: any[]): void;
    /**
     * Gets the tags from this Item
     * @type {string[]}
     */
    get tags(): string[];
    /**
     * Adds tags to this Item
     * @param {...string} tagNames names of the tags to add
     */
    addTags(...tagNames: string[]): void;
    /**
     * Removes tags from this Item
     * @param {...string} tagNames names of the tags to remove
     */
    removeTags(...tagNames: string[]): void;
    toString(): any;
}
import metadata = require("./metadata/metadata");
import ItemHistory = require("./item-history");
import ItemSemantics = require("./item-semantics");
declare namespace time {
    type ZonedDateTime = import('@js-joda/core').ZonedDateTime;
}
import time = require("../time");
export { metadata };
//# sourceMappingURL=items.d.ts.map