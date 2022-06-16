const rules = require('./rules');
/** @type {RuleBuilder} */
const builder = require('./rule-builder');

module.exports = Object.assign(rules, builder);
