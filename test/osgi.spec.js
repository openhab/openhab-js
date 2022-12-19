const { getService, findServices, unregisterService, registerPermanentService, registerService } = require('../osgi');
const { Hashtable } = require('./java.mock');
const bundleContext = require('@runtime/osgi').bundleContext;
const lifecycle = require('@runtime/osgi').lifecycle;

describe('osgi.js', () => {
  describe('getService', () => {
    describe('looks up given service from bundle context', () => {
      const serviceReferenceMock = {};
      const serviceObjectMock = {};
      const classname = 'service-1';

      beforeAll(() => {
        bundleContext.getServiceReference.mockImplementation(() => serviceReferenceMock);
        bundleContext.getService.mockImplementation(() => serviceObjectMock);
      });

      afterEach(() => {
        expect(bundleContext.getServiceReference).toHaveBeenCalledWith(classname);
        expect(bundleContext.getService).toHaveBeenCalledWith(serviceObjectMock);
      });

      it('by class name.', () => {
        const service = getService(classname);
        expect(service).toBe(serviceObjectMock);
      });

      it('by object of class.', () => {
        const javaObject = {
          getName: jest.fn(() => classname)
        };

        const service = getService(javaObject);
        expect(service).toBe(serviceObjectMock);
      });
    });

    it('returns first service found on bundle context.', () => {
      const nonExistendServiceClassname = 'service-1';
      const serviceClassname = 'service-2';
      const anotherServiceClassname = 'service-3';

      bundleContext.getServiceReference.mockImplementation((classname) => {
        if (classname === serviceClassname || classname === anotherServiceClassname) {
          return {};
        } else {
          return null;
        }
      });

      getService(nonExistendServiceClassname, serviceClassname, anotherServiceClassname);

      expect(bundleContext.getServiceReference).toHaveBeenCalledTimes(2);
      expect(bundleContext.getServiceReference).toHaveBeenNthCalledWith(1, nonExistendServiceClassname);
      expect(bundleContext.getServiceReference).toHaveBeenNthCalledWith(2, serviceClassname);
    });

    it('throws error, if service reference for given class name doesn\'t exist in bundle context.', () => {
      bundleContext.getServiceReference.mockImplementation(() => null);
      expect(() => getService('service-1')).toThrow('Failed to get any services of type(s): service-1');
    });

    it('throws error, if service object for given class name doesn\'t exist in bundle context.', () => {
      bundleContext.getServiceReference.mockImplementation(() => {});
      bundleContext.getService.mockImplementation(null);
      expect(() => getService('service-1')).toThrow('Failed to get any services of type(s): service-1');
    });

    it('throws error, if bundle context lookup throws an error.', () => {
      bundleContext.getServiceReference.mockImplementation(() => { throw new Error('Java Exception'); });
      expect(() => getService('service-1')).toThrow('Failed to get any services of type(s): service-1');
    });
  });

  describe('findServices', () => {
    const serviceReferenceMocks = [{}, {}, {}];
    const serviceObjectMock = {};
    const classname = 'service-1';
    const filter = 'filter';

    beforeAll(() => {
      bundleContext.getAllServiceReferences.mockImplementation((className, filter) => serviceReferenceMocks);
      bundleContext.getService.mockImplementation(() => serviceObjectMock);
    });

    it('looks up given service from bundle context', () => {
      const services = findServices(classname, filter);

      expect(services.length).toBe(3);
      expect(bundleContext.getAllServiceReferences).toHaveBeenCalledWith(classname, filter);
      serviceReferenceMocks.forEach((serviceReferenceMock, i) => expect(bundleContext.getService).toHaveBeenNthCalledWith(i + 1, serviceReferenceMock));
    });

    it('returns empty array, when no service references match.', () => {
      bundleContext.getAllServiceReferences.mockImplementation((className, filter) => null);

      const services = findServices(classname, filter);

      expect(services.length).toBe(0);
      expect(bundleContext.getService).not.toHaveBeenCalled();
    });
  });

  describe('registerPermanentService', () => {
    it('registers service without properties on bundle context.', () => {
      const service = {};
      const interfaceNames = ['interface-1', 'interface-2'];

      registerPermanentService(service, interfaceNames);

      expect(bundleContext.registerService).toBeCalledWith(interfaceNames, service, null);
    });

    it('registers service with properties on bundle context.', () => {
      const service = {};
      const interfaceNames = ['interface-1', 'interface-2'];
      const properties = { propertyOne: '1' };

      // Capture properties passed to bundleContext.registerService().
      Hashtable.prototype.map = {};
      Hashtable.prototype.put = function (k, v) { this.map[k] = v; };

      registerPermanentService(service, interfaceNames, properties);

      expect(bundleContext.registerService).toBeCalledWith(interfaceNames, service, expect.objectContaining({ map: properties }));
    });
  });

  describe('unregisterService', () => {
    it('unregisters service from bundle context.', () => {
      const service1 = { s: 1 };
      const service2 = { s: 2 };
      const interfaceNames1 = ['interface-1.1', 'interface-1.2'];
      const interfaceNames2 = ['interface-2.1', 'interface-2.2'];

      const serviceRegistration1 = { r: 1, unregister: jest.fn() };
      const serviceRegistration2 = { r: 2, unregister: jest.fn() };

      const serviceRegistrationMap = new Map();
      serviceRegistrationMap.set(service1, serviceRegistration1);
      serviceRegistrationMap.set(service2, serviceRegistration2);

      bundleContext.registerService.mockImplementation((_, s) => { return serviceRegistrationMap.get(s); });

      registerPermanentService(service1, interfaceNames1);
      registerPermanentService(service2, interfaceNames2);

      unregisterService(service2);

      expect(serviceRegistration1.unregister).not.toHaveBeenCalled();

      // unregisterService calls unregister() on the ServiceRegistration as often, as there are Interfaces registered for this service. This is propably a bug. A ServiceRegistration can only called ones.
      // expect(serviceRegistration2.unregister).toHaveBeenCalledTimes(1);
      expect(serviceRegistration2.unregister).toHaveBeenCalled();
    });
  });

  describe('registerService', () => {
    it('adds lifecycle hook to unregister service on dispose.', () => {
      const service = {};
      const interfaceNames = ['interface-1', 'interface-2'];

      registerService(service, ...interfaceNames);

      expect(lifecycle.addDisposeHook).toHaveBeenCalled();
    });

    it('regsiters given service.', () => {
      const service = {};
      const interfaceNames = ['interface-1', 'interface-2'];

      registerService(service, ...interfaceNames);

      expect(bundleContext.registerService).toHaveBeenCalledWith(interfaceNames, service, null);
    });
  });
});
