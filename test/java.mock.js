const { ModuleBuilder, Configuration, JavaScriptExecution, JavaTransformation, QuantityType } = require('./openhab.mock');

// java.math.BigDecimal (https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/math/BigDecimal.html)
class BigDecimal {}
BigDecimal.valueOf = jest.fn(() => new BigDecimal());

class HashSet {
  add () {}
}

class Hashtable {
  put () {}
}

class ArrayList {
  add () {}
}

class UUID {
  toString () {}
  static randomUUID () {}
}

class Logger {
  debug () {}
  error () {}
  info () {}
  trace () {}
  warn () {}
}

class LoggerFactory {
  static getLogger () {
    return new Logger();
  }
}

class FrameworkUtil {
  static getBundleContext () {}
}

const TYPES = {
  'java.math.BigDecimal': BigDecimal,
  'java.util.ArrayList': ArrayList,
  'java.util.HashSet': HashSet,
  'java.util.Hashtable': Hashtable,
  'java.util.UUID': UUID,
  'org.openhab.core.automation.util.ModuleBuilder': ModuleBuilder,
  'org.openhab.core.config.core.Configuration': Configuration,
  'org.openhab.core.library.types.QuantityType': QuantityType,
  'org.openhab.core.model.script.actions.ScriptExecution': JavaScriptExecution,
  'org.openhab.core.transform.actions.Transformation': JavaTransformation,
  'org.osgi.framework.FrameworkUtil': FrameworkUtil,
  'org.slf4j.LoggerFactory': LoggerFactory
};

/* eslint-disable-next-line no-global-assign */
Java = {
  type: (type) => TYPES[type],
  from: jest.fn(),
  isType: jest.fn(),
  isJavaObject: jest.fn()
};

module.exports = {
  ArrayList,
  BigDecimal,
  FrameworkUtil,
  HashSet,
  Hashtable,
  UUID,
  Logger
};
