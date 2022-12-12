jest.mock('@runtime', () => ({
  DateTimeType: jest.fn(),
  DecimalType: jest.fn(),
  StringType: jest.fn(),
  QuantityType: jest.fn()
}), { virtual: true });

jest.mock('@runtime/Defaults', () => ({}), { virtual: true });

// Do NOT set the mock implementation here, because some tests need to overwrite them. Instead, default initialize them.
jest.mock('@runtime/osgi', () => ({
  bundleContext: {
    getServiceReference: jest.fn(),
    getService: jest.fn(),
    getAllServiceReferences: jest.fn(),
    registerService: jest.fn()
  },
  lifecycle: {
    addDisposeHook: jest.fn()
  }
}), { virtual: true });
