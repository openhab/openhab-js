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
     * group configuration, only applicable if type is `Group`
     */
    group?: {
        type: string;
        function?: string;
        parameters?: string[];
    };
    /**
     * for single channel link a string or for multiple an object { channeluid: configuration }; configuration is an object
     */
    channels?: string | object;
    /**
     * either object `{ namespace: value }` or `{ namespace: `{@link ItemMetadata }` }`
     */
    metadata?: any;
};
export type ItemMetadata = {
    rawMetadata: any;
    readonly value: string;
    readonly configuration: any;
    toString(): any;
};
export type ZonedDateTime = import('@js-joda/core').ZonedDateTime;
export type Instant = import('@js-joda/core').Instant;
export type Duration = import('@js-joda/core').Duration;
export type Quantity = import('../quantity').Quantity;
/**
 * Helper function to ensure an Item name is valid. All invalid characters are replaced with an underscore.
 * @memberof items
 * @param {string} s the name to make value
 * @returns {string} a valid Item name
 */
export function safeItemName(s: string): string;
/**
 * Whether an Item with the given name exists.
 * @memberof items
 * @param {string} name the name of the Item
 * @returns {boolean} whether the Item exists
 */
export function existsItem(name: string): boolean;
/**
 * Gets an openHAB Item.
 * @memberof items
 * @param {string} name the name of the Item
 * @param {boolean} [nullIfMissing=false] whether to return null if the Item cannot be found (default is to throw an {@link https://www.openhab.org/javadoc/latest/org/openhab/core/items/itemnotfoundexception ItemNotFoundException})
 * @returns {Item} {@link items.Item} Item or `null` if `nullIfMissing` is true and Item is missing
 */
export function getItem(name: string, nullIfMissing?: boolean): Item;
/**
 * Gets all openHAB Items.
 *
 * @memberof items
 * @returns {Item[]} {@link items.Item}[]: all Items
 */
export function getItems(): Item[];
/**
 * Creates a new Item.
 *
 * If this is called from file-based scripts, the Item is registered with the ScriptedItemProvider and shares the same lifecycle as the script.
 * You can still persist the Item permanently in this case by setting the `persist` parameter to `true`.
 * If this is called from UI-based scripts, the Item is stored to the ManagedItemProvider and independent of the script's lifecycle.
 *
 * @memberof items
 * @param {ItemConfig} itemConfig the Item config describing the Item
 * @param {boolean} [persist=false] whether to persist the Item permanently (only respected for file-based scripts)
 * @returns {Item} {@link Item}
 * @throws {Error} if {@link ItemConfig} is invalid, e.g. {@link ItemConfig}.name or {@link ItemConfig}.type is not set
 * @throws {Error} if an Item with the same name already exists
 */
export function addItem(itemConfig: ItemConfig, persist?: boolean): Item;
/**
 * Gets all openHAB Items with a specific tag.
 *
 * @memberof items
 * @param {string[]} tagNames an array of tags to match against
 * @returns {Item[]} {@link items.Item}[]: the Items with a tag that is included in the passed tags
 */
export function getItemsByTag(...tagNames: string[]): Item[];
/**
 * Replaces (or adds) an Item.
 * If an Item exists with the same name, it will be removed and a new Item with
 * the supplied parameters will be created in its place. If an Item does not exist with this name, a new
 * Item will be created with the supplied parameters.
 *
 * This function can be useful in scripts which create a static set of Items which may need updating either
 * periodically, during startup or even during development of the script. Using fixed Item names will ensure
 * that the Items remain up-to-date, but won't fail with issues related to duplicate Items.
 * When using file-based scripts, it is recommended to use {@link items.addItem} instead.
 *
 * @memberof items
 * @param {ItemConfig} itemConfig the Item config describing the Item
 * @returns {Item|null} the old Item or `null` if it did not exist
 * @throws {Error} {@link ItemConfig}.name or {@link ItemConfig}.type not set
 * @throws failed to create Item
 */
export function replaceItem(itemConfig: ItemConfig): Item | null;
/**
 * Removes an Item from openHAB. The Item is removed immediately and cannot be recovered.
 *
 * @memberof items
 * @param {string|Item} itemOrItemName the Item or the name of the Item to remove
 * @returns {Item|null} the Item that has been removed or `null` if no Item has been found, or it cannot be removed
 */
export function removeItem(itemOrItemName: string | Item): Item | null;
/**
 * @typedef {object} ItemConfig configuration describing an Item
 * @property {string} type the type of the Item
 * @property {string} name Item name for the Item to create
 * @property {string} [label] the label for the Item
 * @property {string} [category] the category (icon) for the Item
 * @property {string[]} [groups] an array of groups the Item is a member of
 * @property {string[]} [tags] an array of tags for the Item
 * @property {object} [group] group configuration, only applicable if type is `Group`
 * @property {string} group.type the type of the Group, such as `Switch` or `Number`
 * @property {string} [group.function] the group function, such as 'EQUALITY' or `AND`
 * @property {string[]} [group.parameters] optional parameters for the group function, e.g. `ON` and `OFF` for the `AND` function
 * @property {string|object} [channels] for single channel link a string or for multiple an object { channeluid: configuration }; configuration is an object
 * @property {*} [metadata] either object `{ namespace: value }` or `{ namespace: `{@link ItemMetadata}` }`
 */
/**
 * @typedef {import('./metadata').ItemMetadata} ItemMetadata
 * @private
 */
/**
 * @typedef {import('@js-joda/core').ZonedDateTime} ZonedDateTime
 * @private
 */
/**
 * @typedef {import('@js-joda/core').Instant} Instant
 * @private
 */
/**
 * @typedef {import('@js-joda/core').Duration} Duration
 * @private
 */
/**
 * @typedef {import('../quantity').Quantity} Quantity
 * @private
 */
/**
 * Class representing an openHAB Item
 *
 * @memberof items
 * @hideconstructor
 */
export class Item {
    /**
     * Create an Item, wrapping a native Java openHAB Item. Don't use this constructor, instead call {@link getItem}.
     * @param {HostItem} rawItem Java Item from Host
     */
    constructor(rawItem: HostItem);
    /**
     * raw Java {@link https://www.openhab.org/javadoc/latest/org/openhab/core/items/item org.openhab.core.items.Item}
     * @type {HostItem}
     */
    rawItem: HostItem;
    /**
     * Access historical states for this Item {@link items.ItemPersistence}
     * @type {ItemPersistence}
     */
    persistence: ItemPersistence;
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
     * Item state as {@link Quantity} or `null` if state is not Quantity-compatible or Quantity would be unit-less (without unit)
     * @type {Quantity|null}
     */
    get quantityState(): import("../quantity").Quantity;
    /**
     * Raw state of Item, as a Java {@link https://www.openhab.org/javadoc/latest/org/openhab/core/types/state State object}
     * @type {HostState}
     */
    get rawState(): HostState;
    /**
     * String representation of the previous state of the Item or `null` if no previous state is available.
     * @type {string|null}
     */
    get previousState(): string;
    /**
     * Numeric representation of Item previous state, or `null` if state is not numeric or not available.
     * @type {number|null}
     */
    get previousNumericState(): number;
    /**
     * Previous item state as {@link Quantity} or `null` if state is not Quantity-compatible, Quantity would be unit-less (without unit) or not available.
     * @type {Quantity|null}
     */
    get previousQuantityState(): import("../quantity").Quantity;
    /**
      * Previous raw state of Item, as a Java {@link https://www.openhab.org/javadoc/latest/org/openhab/core/types/state State object} or `null` if previous state not available.
     * @type {HostState|null}
     */
    get previousRawState(): any;
    /**
     * The time the state was last updated as ZonedDateTime or `null` if no timestamp is available.
     * @type {time.ZonedDateTime|null}
     */
    get lastStateUpdateTimestamp(): any;
    /**
     * The time the state was last updated as Instant or `null` if no timestamp is available.
     * @type {time.Instant|null}
     */
    get lastStateUpdateInstant(): any;
    /**
     * The time the state was last changed as ZonedDateTime or `null` if no timestamp is available.
     * @type {time.ZonedDateTime|null}
     */
    get lastStateChangeTimestamp(): any;
    /**
     * The time the state was last changed as Instant or `null` if no timestamp is available.
     * @type {time.Instant|null}
     */
    get lastStateChangeInstant(): any;
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
     * Whether this Item is uninitialized (`true` if it has not been initialized).
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
     * If metadata is not provided by this script or the ManagedMetadataProvider, it is not editable and a warning is logged.
     *
     * @see items.metadata.replaceMetadata
     * @param {string} namespace name of the metadata
     * @param {string} value value for this metadata
     * @param {object} [configuration] optional metadata configuration
     * @returns {ItemMetadata|null} old {@link items.metadata.ItemMetadata} or `null` if the Item has no metadata with the given name
     */
    replaceMetadata(namespace: string, value: string, configuration?: object): ItemMetadata | null;
    /**
     * Removes metadata of a single namespace or of all namespaces from a given Item.
     *
     * @see items.metadata.removeMetadata
     * @param {string} [namespace] name of the metadata: if provided, only metadata of this namespace is removed, else all metadata is removed
     * @returns {ItemMetadata|null} removed {@link items.metadata.ItemMetadata} OR `null` if the Item has no metadata under the given namespace or all metadata was removed
     */
    removeMetadata(namespace?: string): ItemMetadata | null;
    /**
     * Sends a command to the Item.
     *
     * @example
     * // Turn on the Hallway lights
     * items.getItem('HallwayLight').sendCommand('ON');
     * // Turn on the Hallway lights for at least 5 minutes, if they were on before, keep them on, otherwise turn them off
     * items.getItem('HallwayLight').sendCommand('ON', time.Duration.ofMinutes(5));
     * // Turn on the Hallway lights for 5 minutes, then turn them off
     * items.getItem('HallwayLight').sendCommand('ON', time.Duration.ofMinutes(5), 'OFF');
     *
     * @param {string|number|ZonedDateTime|Instant|Quantity|HostState|null} value the value of the command to send, such as 'ON'
     * @param {Duration} [expire] optional duration (see {@link https://js-joda.github.io/js-joda/class/packages/core/src/Duration.js~Duration.html JS-Joda: Duration}) after which the command expires and the Item is commanded back to its previous state or `onExpire`
     * @param {string|number|ZonedDateTime|Instant|Quantity|HostState} [onExpire] the optional value of the command to apply on expire, default is the current state
     * @see sendCommandIfDifferent
     * @see postUpdate
     */
    sendCommand(value: string | number | ZonedDateTime | Instant | Quantity | HostState | null, expire?: Duration, onExpire?: string | number | ZonedDateTime | Instant | Quantity | HostState): void;
    /**
     * Sends a command to the Item, but only if the current state is not what is being sent.
     *
     * @param {string|number|ZonedDateTime|Instant|Quantity|HostState} value the value of the command to send, such as 'ON'
     * @returns {boolean} true if the command was sent, false otherwise
     * @see sendCommand
     */
    sendCommandIfDifferent(value: string | number | ZonedDateTime | Instant | Quantity | HostState): boolean;
    /**
     * Increase the value of this Item to the given value by sending a command, but only if the current state is less than that value.
     *
     * @param {number|Quantity|HostState} value the value of the command to send, such as 'ON'
     * @return {boolean} true if the command was sent, false otherwise
     */
    sendIncreaseCommand(value: number | Quantity | HostState): boolean;
    /**
     * Decreases the value of this Item to the given value by sending a command, but only if the current state is greater than that value.
     *
     * @param {number|Quantity|HostState} value the value of the command to send, such as 'ON'
     * @return {boolean} true if the command was sent, false otherwise
     */
    sendDecreaseCommand(value: number | Quantity | HostState): boolean;
    /**
     * Calculates the toggled state of this Item.
     * For Items like Color and Dimmer, getStateAs(OnOffType) is used and the toggle calculated of that.
     *
     * @ignore
     * @returns the toggled state (e.g. 'OFF' if the Item is 'ON')
     * @throws error if the Item is uninitialized or is a type that doesn't make sense to toggle
     */
    getToggleState(): "PAUSE" | "PLAY" | "OPEN" | "CLOSED" | "ON" | "OFF";
    /**
     * Sends a command to flip the Item's state (e.g. if it is 'ON' an 'OFF' command is sent).
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
     * @param {string|number|ZonedDateTime|Instant|Quantity|HostState|null} value the value of the command to send, such as 'ON'
     * @see postToggleUpdate
     * @see sendCommand
     */
    postUpdate(value: string | number | ZonedDateTime | Instant | Quantity | HostState | null): void;
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
import metadata = require("./metadata");
import itemChannelLink = require("./itemchannellink");
import TimeSeries = require("./time-series");
import ItemPersistence = require("./item-persistence");
import ItemSemantics = require("./item-semantics");
export declare const RiemannType: RiemannType;
export { metadata, itemChannelLink, TimeSeries };
//# sourceMappingURL=items.d.ts.map