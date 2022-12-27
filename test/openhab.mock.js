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

module.exports = { Configuration, MetadataRegistry, ModuleBuilder, JavaScriptExecution, JavaTransformation };
