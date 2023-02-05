export type Item = import('../items').Item;
/**
 * Gets a channel link of from an Item.
 *
 * @memberof items.metadata.itemchannellink
 * @param {Item|string} itemOrName {@link Item} or the name of the Item
 * @param {string} channelUID
 * @returns {{itemName: string, configuration: *, channelUID: string}|null} the ItemChannelLink or `null` if none exists
 */
export function getItemChannelLink(itemOrName: Item | string, channelUID: string): {
    itemName: string;
    configuration: any;
    channelUID: string;
};
/**
 * Adds or updates a channel link of an Item.
 *
 * @memberof items.metadata.itemchannellink
 * @param {Item|string} itemOrName {@link Item} or the name of the Item
 * @param {string} channelUID
 * @param {object} [conf] channel configuration
 * @returns {{itemName: string, configuration: object, channelUID: string}|null} the old ItemChannelLink or `null` if it did not exist
 */
export function replaceItemChannelLink(itemOrName: Item | string, channelUID: string, conf?: object): {
    itemName: string;
    configuration: object;
    channelUID: string;
};
/**
 * Removes a channel link from an Item.
 *
 * @memberof items.metadata.itemchannellink
 * @param {Item|string} itemOrName {@link Item} or the name of the Item
 * @param {string} channelUID
 * @returns {{itemName: string, configuration: object, channelUID: string}|null} the removed ItemChannelLink or `null` if none exists
 */
export function removeItemChannelLink(itemOrName: Item | string, channelUID: string): {
    itemName: string;
    configuration: object;
    channelUID: string;
};
/**
 * Removes all channel links from the given Item.
 *
 * @memberof items.metadata.itemchannellink
 * @param {string} itemName the name of the Item
 * @returns {number} number of links removed
 */
export function removeLinksForItem(itemName: string): number;
/**
 * Removes all orphaned (Item or channel missing) links.
 *
 * @memberof items.metadata.itemchannellink
 * @returns {number} number of links removed
 */
export function removeOrphanedItemChannelLinks(): number;
//# sourceMappingURL=itemchannellink.d.ts.map