const rules = require('./rules');
/**
 * @type {RuleBuilder}
 * @private
 */
const builder = require('./rule-builder');

module.exports = Object.assign(rules, builder);
