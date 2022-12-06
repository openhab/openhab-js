const { ModuleBuilder, Configuration, JavaScriptExecution, JavaTransformation } = require('./openhab.mock');

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
  error () {}
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
  'java.util.ArrayList': ArrayList,
  'java.util.HashSet': HashSet,
  'java.util.Hashtable': Hashtable,
  'java.util.UUID': UUID,
  'org.openhab.core.automation.util.ModuleBuilder': ModuleBuilder,
  'org.openhab.core.config.core.Configuration': Configuration,
  'org.openhab.core.model.script.actions.ScriptExecution': JavaScriptExecution,
  'org.openhab.core.transform.actions.Transformation': JavaTransformation,
  'org.osgi.framework.FrameworkUtil': FrameworkUtil,
  'org.slf4j.LoggerFactory': LoggerFactory
};

/* eslint-disable-next-line no-global-assign */
Java = {
  type: (type) => TYPES[type],
  from: function () {},
  isType: function () {}
};

module.exports = {
  ArrayList,
  FrameworkUtil,
  HashSet,
  Hashtable,
  UUID
};
