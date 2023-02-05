jest.mock('@runtime', () => ({
  DateTimeType: jest.fn(),
  DecimalType: jest.fn(),
  StringType: jest.fn(),
  QuantityType: jest.fn(),
  lifecycleTracker: {
    addDisposeHook: jest.fn()
  }
}), { virtual: true });

jest.mock('@runtime/Defaults', () => ({}), { virtual: true });

jest.mock('@runtime/osgi', () => ({
  bundleContext: {
    getServiceReference: jest.fn(),
    getService: jest.fn(),
    getAllServiceReferences: jest.fn(),
    registerService: jest.fn()
  }
}), { virtual: true });
