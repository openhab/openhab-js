/**
 * Gets a service registered with OSGi. Allows providing multiple classes/names to try for lookup.
 *
 * @memberof osgi
 * @param {Array<String|JavaClass>} classOrNames the class of the service to get
 *
 * @returns {*|null} an instance of the service, or `null` if it cannot be found
 * @throws {Error} if no services of the requested type(s) can be found
 */
export function getService(...classOrNames: Array<string | JavaClass>): any | null;
/**
 * Finds services registered with OSGi.
 *
 * @memberof osgi
 * @param {string} className the class of the service to get
 * @param {*} [filter] an optional filter used to filter the returned services
 * @returns {Array<*>} any instances of the service that can be found
 */
export function findServices(className: string, filter?: any): Array<any>;
export function registerService(service: any, ...interfaceNames: any[]): void;
export function registerPermanentService(service: any, interfaceNames: any, properties?: any): any;
export function unregisterService(serviceToUnregister: any): void;
//# sourceMappingURL=osgi.d.ts.map