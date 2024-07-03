const { Class, BigDecimal} = require('./java.mock');
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
  add () {}
  get () {}
  update () {}
}

// org.openhab.core.model.script.actions.ScriptExecution (https://www.openhab.org/javadoc/latest/org/openhab/core/model/script/actions/scriptexecution)
class JavaScriptExecution {
  static callScript () {}
  static createTimer () {}
}

// org.openhab.core.transform.actions.Transformation (https://www.openhab.org/javadoc/latest/org/openhab/core/transform/actions/transformation)
class JavaTransformation {
  static transform () {
    return 'on';
  }

  static transformRaw () {
    return 'on';
  }
}

// org.openhab.core.library.types.DecimalType (https://www.openhab.org/javadoc/latest/org/openhab/core/library/types/decimaltype)
class DecimalType {
  toBigDecimal = jest.fn(() => new BigDecimal())
  getClass = () => new Class('org.openhab.core.library.types.DecimalType')
}

// org.openhab.core.library.types.QuantityType (https://www.openhab.org/javadoc/latest/org/openhab/core/library/types/quantitytype)
class QuantityType {
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

module.exports = {
  Configuration,
  MetadataRegistry,
  ModuleBuilder,
  JavaScriptExecution,
  JavaTransformation,
  DecimalType,
  QuantityType,
  JavaNotificationAction
};
