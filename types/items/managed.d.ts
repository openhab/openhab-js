export type HostItem = any;
export type HostGroupFunction = any;
export type HostState = any;
export type Item = import("./item");
/**
 * Helper function to ensure an item name is valid. All invalid characters are replaced with an underscore.
 * @memberOf items
 * @param {String} s the name to make value
 * @returns {String} a valid item name
 */
export function safeItemName(s: string): string;
/**
 * Gets an openHAB Item.
 * @memberOf items
 * @param {String} name the name of the item
 * @param {Boolean} nullIfMissing whether to return null if the item cannot be found (default is to throw an exception)
 * @return {Item} the item
 */
export function getItem(name: string, nullIfMissing?: boolean): Item;
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
export function addItem(itemName: string, itemType?: string, category?: string, groups?: string[], label?: string, tags?: string[], giBaseType?: any, groupFunction?: any, ...args: any[]): any;
/**
 * Gets all openHAB Items with a specific tag.
 *
 * @memberOf items
 * @param {String[]} tagNames an array of tags to match against
 * @return {Item[]} the items with a tag that is included in the passed tags
 */
export function getItemsByTag(...tagNames: string[]): Item[];
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
export function replaceItem(...args: any[]): any;
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
export function createItem(itemName: string, itemType?: string, category?: string, groups?: string[], label?: string, tags?: string[], giBaseType?: any, groupFunction?: any, itemMetadata?: Map<any, any>): any;
/**
 * Removes an item from OpenHab. The item is removed immediately and cannot be recoved.
 *
 * @memberOf items
 * @param {String|HostItem} itemOrItemName the item to remove
 * @returns {Boolean} true iff the item is actually removed
 */
export function removeItem(itemOrItemName: string | HostItem): boolean;
export declare function objects(): any;
