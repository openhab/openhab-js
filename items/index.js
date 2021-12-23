/**
 * Items namespace.
 * This namespace handles querying and updating openHAB Items.
 * @namespace items
 */

module.exports = {
    ...require('./managed'),
    Item: require("./item"),
    provider: require('./items-provider')
}