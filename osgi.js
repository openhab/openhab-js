/**
 * OSGi module.
 * This module provides access to OSGi services.
 *
 * @namespace osgi
 */
const log = require('./log')('osgi');
const bundleContext = require('@runtime/osgi').bundleContext;
const lifecycle = require('@runtime/osgi').lifecycle;
const Hashtable = Java.type('java.util.Hashtable');

/**
 * Map of interface names to sets of services registered (by this module)
 *
 * @private
 */
const registeredServices = {};

const jsObjectToHashtable = function (obj) {
  if (obj === null) {
    return null;
  }

  const rv = new Hashtable();
  for (const k in obj) {
    rv.put(k, obj[k]);
  }
  return rv;
};

/**
 * Gets a service registered with OSGi.
 *
 * @private
 * @param {String|JavaClass} classOrName the class of the service to get
 * @returns an instance of the service, or null if it cannot be found
 */
const lookupService = function (classOrName) {
  let bc = bundleContext;
  if (bundleContext === undefined) {
    log.warn('bundleContext is undefined');
    const FrameworkUtil = Java.type('org.osgi.framework.FrameworkUtil');
    const _bundle = FrameworkUtil.getBundle(scriptExtension.class); // eslint-disable-line no-undef
    bc = (_bundle !== null) ? _bundle.getBundleContext() : null;
  }
  if (bc !== null) {
    const classname = (typeof classOrName === 'object') ? classOrName.getName() : classOrName;
    const ref = bc.getServiceReference(classname);
    return (ref !== null) ? bc.getService(ref) : null;
  }
};

/**
 * Gets a service registered with OSGi. Allows providing multiple classes/names to try for lookup.
 *
 * @memberof osgi
 * @param {Array<String|JavaClass>} classOrNames the class of the service to get
 *
 * @returns an instance of the service, or null if it cannot be found
 * @throws {Error} if no services of the requested type(s) can be found
 */
const getService = function (...classOrNames) {
  let rv = null;

  for (const classOrName of classOrNames) {
    try {
      rv = lookupService(classOrName);
    } catch (e) {
      log.warn(`Failed to get service ${classOrName}: {}`, e);
    }

    if (typeof rv !== 'undefined' && rv !== null) {
      return rv;
    }
  }

  throw Error(`Failed to get any services of type(s): ${classOrNames}`);
};

/**
 * Finds services registered with OSGi.
 *
 * @memberof osgi
 * @param {string} className the class of the service to get
 * @param {*} [filter] an optional filter used to filter the returned services
 * @returns {Object[]} any instances of the service that can be found
 */
const findServices = function (className, filter) {
  if (bundleContext !== null) {
    const refs = bundleContext.getAllServiceReferences(className, filter);
    return refs != null ? [...refs].map(ref => bundleContext.getService(ref)) : [];
  }
};

const registerService = function (service, ...interfaceNames) {
  lifecycle.addDisposeHook(() => unregisterService(service));
  registerPermanentService(service, interfaceNames, null);
};

const registerPermanentService = function (service, interfaceNames, properties = null) {
  const registration = bundleContext.registerService(interfaceNames, service, jsObjectToHashtable(properties));

  for (const interfaceName of interfaceNames) {
    if (typeof registeredServices[interfaceName] === 'undefined') {
      registeredServices[interfaceName] = new Set();
    }
    registeredServices[interfaceName].add({ service, registration });
    log.debug('Registered service {} of as {}', service, interfaceName);
  }
  return registration;
};

const unregisterService = function (serviceToUnregister) {
  log.debug('Unregistering service {}', serviceToUnregister);

  for (const interfaceName in registeredServices) {
    const servicesForInterface = registeredServices[interfaceName];

    servicesForInterface.forEach(({ service, registration }) => {
      if (service === serviceToUnregister) {
        servicesForInterface.delete({ service, registration });
        registration.unregister();
        log.debug('Unregistered service: {}', service);
      }
    });
  }
};

module.exports = {
  getService,
  findServices,
  registerService,
  registerPermanentService,
  unregisterService
};
