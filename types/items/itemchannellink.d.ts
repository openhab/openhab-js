/**
 * Gets a channel link of from an Item.
 *
 * @memberof items.itemChannelLink
 * @param {items.Item|string} itemOrName {@link items.Item} or the name of the Item
 * @param {string} channelUID
 * @returns {ItemChannelLink|null} the ItemChannelLink or `null` if none exists
 */
export function getItemChannelLink(itemOrName: items.Item | string, channelUID: string): ItemChannelLink | null;
/**
 * Adds a new channel link to an Item.
 *
 * If this is called from file-based scripts, the Item -> channel link is registered with the ScriptedItemChannelLinkProvider and shares the same lifecycle as the script.
 * You can still persist the Item -> channel link permanently in this case by setting the `persist` parameter to `true`.
 * If this is called from UI-based scripts, the Item -> channel link is stored to the ManagedItemChannelLinkProvider and independent of the script's lifecycle.
 *
 * @memberOf items.itemChannelLink
 * @param {items.Item|string} itemOrName {@link items.Item} or the name of the Item
 * @param {string} channelUID
 * @param {object} [configuration] channel configuration
 * @param {boolean} [persist=false] whether to persist the Item -> channel link permanently (only respected for file-based scripts)
 * @returns {ItemChannelLink} the ItemChannelLink
 * @throws {Error} if the Item -> channel link already exists
 */
export function addItemChannelLink(itemOrName: items.Item | string, channelUID: string, configuration?: object, persist?: boolean): ItemChannelLink;
/**
 * Adds or updates a channel link of an Item.
 * If you use this in file-based scripts, better use {@link addItemChannelLink} to provide channel links.
 *
 * If an Item -> channel link is not provided by this script or the ManagedItemChannelLinkProvider, it is not editable and a warning is logged.
 *
 * @memberof items.itemChannelLink
 * @param {items.Item|string} itemOrName {@link items.Item} or the name of the Item
 * @param {string} channelUID
 * @param {object} [configuration] channel configuration
 * @returns {ItemChannelLink|null} the old ItemChannelLink or `null` if it did not exist
 */
export function replaceItemChannelLink(itemOrName: items.Item | string, channelUID: string, configuration?: object): ItemChannelLink | null;
/**
 * Removes a channel link from an Item.
 *
 * @memberof items.itemChannelLink
 * @param {items.Item|string} itemOrName {@link items.Item} or the name of the Item
 * @param {string} channelUID
 * @returns {ItemChannelLink|null} the removed ItemChannelLink or `null` if none exists, or it cannot be removed
 */
export function removeItemChannelLink(itemOrName: items.Item | string, channelUID: string): ItemChannelLink | null;
/**
 * Removes all channel links from the given Item.
 *
 * @memberof items.itemChannelLink
 * @param {string} itemName the name of the Item
 * @returns {number} number of links removed
 */
export function removeLinksForItem(itemName: string): number;
/**
 * Removes all orphaned (Item or channel missing) links.
 *
 * @memberof items.itemChannelLink
 * @returns {number} number of links removed
 */
export function removeOrphanedItemChannelLinks(): number;
/**
 * Item channel link namespace.
 * This namespace provides access to Item channel links.
 *
 * @namespace items.itemChannelLink
 */
/**
 * Class representing an openHAB Item -> channel link.
 *
 * @memberof items.itemChannelLink
 * @hideconstructor
 */
export class ItemChannelLink {
    /**
     * Create an ItemChannelLink instance, wrapping native openHAB Item -> channel link.
     * @param {*} rawItemChannelLink {@link https://www.openhab.org/javadoc/latest/org/openhab/core/thing/link/itemchannellink org.openhab.core.thing.link.ItemChannelLink}
     */
    constructor(rawItemChannelLink: any);
    /**
     * raw Java {@link https://www.openhab.org/javadoc/latest/org/openhab/core/thing/link/itemchannellink org.openhab.core.thing.link.ItemChannelLink}
     * @type {*}
     */
    rawItemChannelLink: any;
    /**
     * The name of the linked Item.
     * @type {string}
     */
    get itemName(): string;
    /**
     * The UID of the linked channel.
     * @type {string}
     */
    get channelUID(): string;
    /**
     * The channel link configuration.
     * @type {object}
     */
    get configuration(): object;
    toString(): any;
}
//# sourceMappingURL=itemchannellink.d.ts.map