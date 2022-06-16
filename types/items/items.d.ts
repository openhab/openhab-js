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
     * either object { namespace: value } or { namespace: { value: value, config: {} } }
     */
    metadata?: ItemMetadata;
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
 * Item metadata configuration, not fully documented
 */
export type ItemMetadata = {
    /**
     * `stateDescription` configuration, required for most UIs
     */
    stateDescription?: {
        config?: {
            pattern?: string;
        };
    };
    /**
     * `expire` configuration, see {@link https ://www.openhab.org/docs/configuration/items.html#parameter-expire}
     */
    expire?: {
        value?: string;
        config?: {
            ignoreStateUpdates?: string;
        };
    };
    /**
     * `autoupdate` configuration, see {@link https ://www.openhab.org/docs/configuration/items.html#parameter-expire}
     */
    autoupdate?: {
        value?: string;
    };
};
/**
 * Helper function to ensure an item name is valid. All invalid characters are replaced with an underscore.
 * @memberof items
 * @param {string} s the name to make value
 * @returns {string} a valid item name
 */
export function safeItemName(s: string): string;
/**
 * Gets an openHAB Item.
 * @memberof items
 * @param {string} name the name of the item
 * @param {boolean} [nullIfMissing=false] whether to return null if the item cannot be found (default is to throw an exception)
 * @return {items.Item} the item
 */
export function getItem(name: string, nullIfMissing?: boolean): items.Item;
/**
 * Gets all openHAB Items.
 *
 * @memberof items
 * @return {items.Item[]} all items
 */
export function getItems(): items.Item[];
/**
 * Creates a new item within OpenHab. This Item will persist to the provider regardless of the lifecycle of the script creating it.
 *
 * Note that all items created this way have an additional tag attached, for simpler retrieval later. This tag is
 * created with the value {@link DYNAMIC_ITEM_TAG}.
 *
 * @memberof items
 * @param {ItemConfig} itemConfig the Item config describing the Item
 * @returns {Item} an {@link items.Item} object
 * @throws {@link ItemConfig}.name or {@link ItemConfig}.type not set
 * @throws failed to create Item
 */
export function addItem(itemConfig: ItemConfig): Item;
/**
 * Gets all openHAB Items with a specific tag.
 *
 * @memberof items
 * @param {...String} tagNames an array of tags to match against
 * @return {items.Item[]} the items with a tag that is included in the passed tags
 */
export function getItemsByTag(...tagNames: string[]): items.Item[];
/**
 * Replaces (upserts) an item. If an item exists with the same name, it will be removed and a new item with
 * the supplied parameters will be created in it's place. If an item does not exist with this name, a new
 * item will be created with the supplied parameters.
 *
 * This function can be useful in scripts which create a static set of items which may need updating either
 * periodically, during startup or even during development of the script. Using fixed item names will ensure
 * that the items remain up-to-date, but won't fail with issues related to duplicate items.
 *
 * @memberof items
 * @param {ItemConfig} itemConfig the Item config describing the Item
 * @returns {Item} an {@link items.Item} object
 * @throws {@link ItemConfig}.name or {@link ItemConfig}.type not set
 * @throws failed to create Item
 */
export function replaceItem(itemConfig: ItemConfig, ...args: any[]): Item;
/**
 * Creates a new Item object. This Item is not registered with any provider and therefore can not be accessed.
 *
 * Note that all Items created this way have an additional tag attached, for simpler retrieval later. This tag is
 * created with the value {@link DYNAMIC_ITEM_TAG}.
 *
 * @memberof items
 * @private
 * @param {ItemConfig} itemConfig the Item config describing the Item
 * @returns {Item} an {@link items.Item} object
 * @throws {@link ItemConfig}.name or {@link ItemConfig}.type not set
 * @throws failed to create Item
 */
export function createItem(itemConfig: ItemConfig): Item;
/**
 * Removes an Item from openHAB. The Item is removed immediately and cannot be recovered.
 *
 * @memberof items
 * @param {String|HostItem} itemOrItemName the Item or the name of the Item to remove
 * @returns {boolean} true if the item was actually removed
 */
export function removeItem(itemOrItemName: string | HostItem): boolean;
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
    rawItem: HostItem;
    /**
         * Access historical states for this item
         * @type {items.ItemHistory}
         */
    history: items.ItemHistory;
    /**
       * The type of the item: the Simple (without package) name of the Java item type, such as 'Switch'.
       * @return {string} the type
       */
    get type(): string;
    /**
       * The name of the item.
       * @return {string} the name
       */
    get name(): string;
    /**
       * The label attached to the item
       * @return {string} the label
       */
    get label(): string;
    /**
       * The state of the item, as a string.
       * @return {string} the item's state
       */
    get state(): string;
    /**
       * The raw state of the item, as a java object.
       * @return {HostState} the item's state
       */
    get rawState(): HostState;
    /**
       * Members / children / direct descendents of the current group item (as returned by 'getMembers()'). Must be a group item.
       * @returns {Item[]} member items
       */
    get members(): Item[];
    /**
       * All descendents of the current group item (as returned by 'getAllMembers()'). Must be a group item.
       * @returns {Item[]} all descendent items
       */
    get descendents(): Item[];
    /**
       * Whether this item is initialized.
       * @type {boolean}
       * @returns true iff the item has not been initialized
       */
    get isUninitialized(): boolean;
    /**
       * Gets metadata values for this item.
       * @param {string} namespace The namespace for the metadata to retreive
       * @returns {string} the metadata associated with this item and namespace
       */
    getMetadataValue(namespace: string): string;
    /**
       * Updates metadata values for this item.
       * @param {string} namespace The namespace for the metadata to update
       * @param {string} value the value to update the metadata to
       * @returns {string} the updated value
       */
    updateMetadataValue(namespace: string, value: string): string;
    /**
       * Inserts or updates metadata values for this item.
       * @param {string} namespace The namespace for the metadata to update
       * @param {string} value the value to update the metadata to
       * @returns {boolean} true iff a new value was inserted
       */
    upsertMetadataValue(namespace: string, value: string): boolean;
    /**
       * Updates metadata values for this item.
       * @param {Map} namespaceToValues A map of namespaces to values to update
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
       * @returns {boolean} true if the command was sent, false otherwise
       * @see sendCommand
       */
    sendCommandIfDifferent(value: string | HostState): boolean;
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
       * Posts an update to the item
       * @param {String|HostState} value the value of the command to send, such as 'ON'
       * @see sendCommand
       */
    postUpdate(value: string | HostState): void;
    /**
       * Gets the tags from this item
       * @returns {Array<String>} array of group names
       */
    get groupNames(): string[];
    /**
       * Adds groups to this item
       * @param {...String|...Item} groupNamesOrItems one or more names of the groups (or the group items themselves)
       */
    addGroups(...groupNamesOrItems: any[]): void;
    /**
       * Removes groups from this item
       * @param {...String|...Item} groupNamesOrItems one or more names of the groups (or the group items themselves)
       */
    removeGroups(...groupNamesOrItems: any[]): void;
    /**
       * Gets the tags from this item
       * @returns {Array<String>} array of tags
       */
    get tags(): string[];
    /**
       * Adds tags to this item
       * @param {...String} tagNames names of the tags to add
       */
    addTags(...tagNames: string[]): void;
    /**
       * Removes tags from this item
       * @param {...String} tagNames names of the tags to remove
       */
    removeTags(...tagNames: string[]): void;
}
export declare const provider: typeof import("./items-provider");
export declare function objects(): any;
//# sourceMappingURL=items.d.ts.map