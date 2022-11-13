const { ModuleBuilder, Configuration } = require('./openhab.mock');

class HashSet {
  constructor () {
    this.add = jest.fn();
  }
}

class ArrayList {
  constructor () {
    this.add = jest.fn();
  }
}

class UUID {
  constructor () {
    this.toString = jest.fn();
  }
}

UUID.randomUUID = jest.fn();

class LoggerFactory {}

LoggerFactory.getLogger = jest.fn();

const TYPES = {
  'java.util.UUID': UUID,
  'java.util.HashSet': HashSet,
  'java.util.ArrayList': ArrayList,
  'org.openhab.core.automation.util.ModuleBuilder': ModuleBuilder,
  'org.openhab.core.config.core.Configuration': Configuration,
  'org.slf4j.LoggerFactory': LoggerFactory
};

Java = {
  type: (type) => TYPES[type],
  from: jest.fn(),
  isType: jest.fn()
};

module.exports = {
  ArrayList,
  HashSet,
  UUID
};
