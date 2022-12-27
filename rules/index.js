module.exports = {
  ...require('./rules'),
  when: require('./rule-builder').when
};
