/**
 * OSGi module.
 * This module provides access to OSGi services.
 *
 * @namespace osgi
 */
const log = require('./log')('osgi');
const bundleContext = require('@runtime/osgi').bundleContext;
const lifecycleTracker = require('@runtime').lifecycleTracker;
const Hashtable = Java.type('java.util.Hashtable');

/**
 * Map of interface names to sets of services registered (by this module)
 *
 * @private
 */
const registeredServices = {};

function _jsObjectToHashtable (obj) {
  if (obj === null) {
    return null;
  }

  const rv = new Hashtable();
  for (const k in obj) {
    rv.put(k, obj[k]);
  }
  return rv;
}

/**
 * Gets a service registered with OSGi.
 *
 * @private
 * @param {string|JavaClass} classOrName the class of the service to get
 * @returns {*|null} an instance of the service, or `null` if it cannot be found
 */
function _lookupService (classOrName) {
  let bc = bundleContext;
  if (bundleContext === undefined) {
    log.warn('bundleContext is undefined');
    const FrameworkUtil = Java.type('org.osgi.framework.FrameworkUtil');
    const _bundle = FrameworkUtil.getBundle(scriptExtension.getClass()); // eslint-disable-line no-undef
    bc = (_bundle !== null) ? _bundle.getBundleContext() : null;
  }
  if (bc !== null) {
    const classname = (typeof classOrName === 'object') ? classOrName.getName() : classOrName;
    const ref = bc.getServiceReference(classname);
    return (ref !== null) ? bc.getService(ref) : null;
  }
}

/**
 * Gets a service registered with OSGi.
 * Allows providing multiple classes/names to try for lookup.
 *
 * @memberof osgi
 * @param {...(string|JavaClass)} classOrNames the class of the service to get
 *
 * @returns {*|null} an instance of the service, or `null` if it cannot be found
 * @throws {Error} if no services of the requested type(s) can be found
 */
function getService (...classOrNames) {
  let rv = null;

  for (const classOrName of classOrNames) {
    try {
      rv = _lookupService(classOrName);
    } catch (e) {
      log.warn(`Failed to get service ${classOrName}: {}`, e);
    }

    if (typeof rv !== 'undefined' && rv !== null) {
      return rv;
    }
  }

  throw Error(`Failed to get any services of type(s): ${classOrNames}`);
}

/**
 * Finds services registered with OSGi.
 *
 * @memberof osgi
 * @param {string} className the class of the service to get
 * @param {*} [filter] an optional filter used to filter the returned services
 * @returns {Array<*>} any instances of the service that can be found
 */
function findServices (className, filter) {
  if (bundleContext !== null) {
    const refs = bundleContext.getAllServiceReferences(className, filter);
    return refs != null ? [...refs].map(ref => bundleContext.getService(ref)) : [];
  }
}

function registerService (service, ...interfaceNames) {
  lifecycleTracker.addDisposeHook(() => unregisterService(service));
  registerPermanentService(service, interfaceNames, null);
}

function registerPermanentService (service, interfaceNames, properties = null) {
  const registration = bundleContext.registerService(interfaceNames, service, _jsObjectToHashtable(properties));

  for (const interfaceName of interfaceNames) {
    if (typeof registeredServices[interfaceName] === 'undefined') {
      registeredServices[interfaceName] = new Set();
    }
    registeredServices[interfaceName].add({ service, registration });
    log.debug('Registered service {} of as {}', service, interfaceName);
  }
  return registration;
}

function unregisterService (serviceToUnregister) {
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
}

module.exports = {
  getService,
  findServices,
  registerService,
  registerPermanentService,
  unregisterService
};
