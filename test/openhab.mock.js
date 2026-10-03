const { Class, BigDecimal, HashMap, String, Stream } = require('./java.mock');
const { Unit } = require('./javax-measure.mock');

// org.openhab.core.automation.util.ModuleBuilder (https://www.openhab.org/javadoc/latest/org/openhab/core/automation/util/modulebuilder)
class ModuleBuilder {
  constructor () {
    this.withId = jest.fn(() => this);
    this.withTypeUID = jest.fn(() => this);
    this.withConfiguration = jest.fn(() => this);
    this.build = jest.fn();
  }
}

ModuleBuilder.createTrigger = jest.fn(() => new ModuleBuilder());

// org.openhab.core.config.core.Configuration (https://www.openhab.org/javadoc/latest/org/openhab/core/config/core/configuration)
class Configuration {
  constructor (config) {
    this.config = config;
  }
}

// org.openhab.core.items.MetadataRegistry (https://www.openhab.org/javadoc/latest/org/openhab/core/items/metadataregistry)
class MetadataRegistry {
  get = jest.fn()
  add = jest.fn()
  addPermanent = jest.fn()
  update = jest.fn()
  remove = jest.fn()
  removeItemMetadata = jest.fn()
  stream = jest.fn(() => new Stream());
}

// org.openhab.core.items.MetadataKey (https://www.openhab.org/javadoc/latest/org/openhab/core/items/metadatakey)
class MetadataKey {
  constructor (namespace, itemName) {
    this.namespace = namespace;
    this.itemName = itemName;
  }

  getNamespace () {
    return this.namespace;
  }

  getItemName () {
    return new String(this.itemName);
  }

  toString () {
    return `${this.namespace}:${this.itemName}`;
  }
}

// org.openhab.core.items.Metadata (https://www.openhab.org/javadoc/latest/org/openhab/core/items/metadata)
class Metadata {
  constructor (key, value, configuration) {
    this.key = key;
    this.value = value;
    this.configuration = configuration;
  }

  getUID () {
    return this.key;
  }

  getKey () {
    return this.key;
  }

  getValue () {
    return this.value;
  }

  getConfiguration () {
    const map = new HashMap();
    if (this.configuration) {
      if (this.configuration instanceof Map) {
        this.configuration.forEach((v, k) => map.set(k, v));
      } else {
        Object.keys(this.configuration).forEach(k => map.set(k, this.configuration[k]));
      }
    }
    return map;
  }
}

// org.openhab.core.model.script.actions.ScriptExecution (https://www.openhab.org/javadoc/latest/org/openhab/core/model/script/actions/scriptexecution)
class JavaScriptExecution {
  static callScript = jest.fn()
  static createTimer = jest.fn()
}

// org.openhab.core.transform.actions.Transformation (https://www.openhab.org/javadoc/latest/org/openhab/core/transform/actions/transformation)
class JavaTransformation {
  static transform = jest.fn((v) => new String(v))
  static transformRaw = jest.fn((v) => new String(v))
}

// org.openhab.core.library.types.PrimitiveType (https://www.openhab.org/javadoc/latest/org/openhab/core/types/primitivetype)
class PrimitiveType {
  constructor (value) {
    this.value = value;
  }

  as = jest.fn(() => this)
  toString = jest.fn(() => this.value.toString())
  getClass = () => new Class('org.openhab.core.types.PrimitiveType')
}

// org.openhab.core.library.types.DecimalType (https://www.openhab.org/javadoc/latest/org/openhab/core/library/types/decimaltype)
class DecimalType extends PrimitiveType {
  toBigDecimal = jest.fn(() => new BigDecimal())
  getClass = () => new Class('org.openhab.core.library.types.DecimalType')
}

// org.openhab.core.library.types.PercentType (https://www.openhab.org/javadoc/latest/org/openhab/core/library/types/percenttype)
class PercentType extends PrimitiveType {
  getClass = () => new Class('org.openhab.core.types.PercentType')
}

// org.openhab.core.library.types.QuantityType (https://www.openhab.org/javadoc/latest/org/openhab/core/library/types/quantitytype)
class QuantityType extends PrimitiveType {
  add = jest.fn(() => new QuantityType())
  compareTo = jest.fn(() => new QuantityType())
  divide = jest.fn(() => new QuantityType())
  doubleValue = jest.fn()
  getDimension = jest.fn()
  getUnit = jest.fn(() => new Unit())
  longValue = jest.fn()
  multiply = jest.fn(() => new QuantityType())
  subtract = jest.fn(() => new QuantityType())
  toString = jest.fn()
  toUnit = jest.fn(() => new QuantityType())
  getClass = () => new Class('org.openhab.core.library.types.QuantityType')
}
QuantityType.valueOf = jest.fn(() => new QuantityType())

class JavaNotificationAction {
  static sendBroadcastNotification = jest.fn()
  static sendLogNotification = jest.fn()
  static sendNotification = jest.fn()
  static hideBroadcastNotificationByReferenceId = jest.fn()
  static hideNotificationByReferenceId = jest.fn()
  static hideBroadcastNotificationByTag = jest.fn()
  static hideNotificationByTag = jest.fn()
}

// org.openhab.core.persistence.extensions.PersistenceExtensions (https://www.openhab.org/javadoc/latest/org/openhab/core/persistence/extensions/persistenceextensions)
class JavaPersistenceExtensions {
  static persist = jest.fn();
}

// org.openhab.core.types.TimeSeries (https://www.openhab.org/javadoc/latest/org/openhab/core/types/timeseries)
class JavaTimeSeries {
  constructor (policy) {
    this.policy = policy;
    this.states = [];
  }

  add (timestamp, state) {
    this.states.push([timestamp, state]);
  }
}
JavaTimeSeries.Policy = {
  valueOf: jest.fn((policy) => policy)
};

// org.openhab.core.types.TypeParser (https://www.openhab.org/javadoc/latest/org/openhab/core/types/typeparser)
class JavaTypeParser {
  static parseState = jest.fn((acceptedDataTypes, stateString) => {
    // TypeParser::parseState(String, String) only accepts a stateString, so GraalJS cannot coerce a JS number to a String.
    // Mirror this behavior here to make a regression visible in the tests instead of only at runtime inside openHAB.
    if (typeof stateString !== 'string') {
      throw new TypeError(`Cannot convert '${stateString}'(language: Java, type: java.lang.Double) to Java type 'java.lang.String': Invalid or lossy primitive coercion.`);
    }
    return new DecimalType(stateString);
  });
}

module.exports = {
  Configuration,
  MetadataRegistry,
  MetadataKey,
  Metadata,
  ModuleBuilder,
  JavaScriptExecution,
  JavaTransformation,
  PrimitiveType,
  DecimalType,
  PercentType,
  QuantityType,
  JavaNotificationAction,
  JavaPersistenceExtensions,
  JavaTimeSeries,
  JavaTypeParser
};
