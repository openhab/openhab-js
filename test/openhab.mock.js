class ModuleBuilder {
  constructor () {
    this.withId = jest.fn(() => this);
    this.withTypeUID = jest.fn(() => this);
    this.withConfiguration = jest.fn(() => this);
    this.build = jest.fn();
  }
}

ModuleBuilder.createTrigger = jest.fn(() => new ModuleBuilder());

class Configuration {
  constructor (config) {
    this.config = config;
  }
}

class JavaScriptExecution {
  static callScript () {}
  static createTimer () {}
}

class JavaTransformation {}
JavaTransformation.transform = jest.fn(() => 'on');
JavaTransformation.transformRaw = jest.fn(() => 'on');

module.exports = { Configuration, ModuleBuilder, JavaScriptExecution, JavaTransformation };
