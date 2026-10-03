// See https://github.com/openhab/openhab-core/blob/main/bundles/org.openhab.core.automation.module.script/src/main/java/org/openhab/core/automation/module/script/internal/defaultscope/DefaultScriptScopeProvider.java
jest.mock('@runtime', () => ({
  DateTimeType: jest.fn(),
  DecimalType: jest.fn(),
  StringType: jest.fn(),
  QuantityType: jest.fn(),
  UnDefType: jest.fn(),
  lifecycleTracker: {
    addDisposeHook: jest.fn()
  }
}), { virtual: true });

jest.mock('@runtime/Defaults', () => ({}), { virtual: true });

// See https://github.com/openhab/openhab-addons/blob/main/bundles/org.openhab.automation.jsscripting/src/main/java/org/openhab/automation/jsscripting/internal/scope/OSGiScriptExtensionProvider.java
jest.mock('@runtime/osgi', () => ({
  bundleContext: {
    getServiceReference: jest.fn(),
    getService: jest.fn(),
    getAllServiceReferences: jest.fn(),
    registerService: jest.fn()
  }
}), { virtual: true });

// See https://github.com/openhab/openhab-core/blob/main/bundles/org.openhab.core.automation.module.script.rulesupport/src/main/java/org/openhab/core/automation/module/script/rulesupport/internal/CacheScriptExtension.java
jest.mock('@runtime/cache', () => ({}), { virtual: true });

// See https://github.com/openhab/openhab-core/blob/main/bundles/org.openhab.core.automation.module.script.providersupport/src/main/java/org/openhab/core/automation/module/script/providersupport/ProviderScriptExtension.java
jest.mock('@runtime/provider', () => ({}), { virtual: true });
