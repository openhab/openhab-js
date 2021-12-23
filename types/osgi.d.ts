/**
 * Gets a service registered with OSGi. Allows providing multiple classes/names to try for lookup.
 *
 * @param {Array<String|HostClass>} classOrNames the class of the service to get
 *
 * @returns an instance of the service, or null if it cannot be found
 * @throws {Error} if no services of the requested type(s) can be found
 * @memberOf osgi
 */
export function getService(...classOrNames: Array<string | HostClass>): any;
/**
 * Finds services registered with OSGi.
 *
 * @param {String} className the class of the service to get
 * @param {*} [filter] an optional filter used to filter the returned services
 * @returns {Object[]} any instances of the service that can be found
 * @memberOf osgi
 */
export function findServices(className: string, filter?: any): any[];
export function registerService(service: any, ...interfaceNames: any[]): void;
export function registerPermanentService(service: any, interfaceNames: any, properties?: any): any;
export function unregisterService(serviceToUnregister: any): void;
