/**
 * {@link https://www.openhab.org/javadoc/latest/org/openhab/core/model/script/actions/audio Audio} Actions
 *
 * The static methods of this class are made available as functions in the scripts. This allows a script to use audio features.
 * Refer to {@link https://www.openhab.org/docs/configuration/multimedia.html#actions openHAB Docs: Audio Actions} for more information.
 *
 * @name Audio
 * @memberof actions
 */
export const Audio: any;
/**
 * {@link https://www.openhab.org/javadoc/latest/org/openhab/core/model/script/actions/busevent BusEvent} Actions
 *
 * The static methods of this class are made available as functions in the scripts. This gives direct write access to the openHAB event bus from within scripts. Items should not be updated directly (setting the state property), but updates should be sent to the bus, so that all interested bundles are notified.
 * Refer to {@link https://www.openhab.org/docs/configuration/actions.html#event-bus-actions openHAB Docs: Event Bus Actions} for more information.
 *
 * Instead of using the BusEvent actions, it is recommended to use the `postUpdate` and `sendCommand` methods of {@link items.Item}.
 *
 * @name BusEvent
 * @memberof actions
 */
export const BusEvent: any;
/**
 * {@link https://www.openhab.org/javadoc/latest/org/openhab/core/model/script/actions/coreutil CoreUtil} Actions
 *
 * This class provides static methods mapping methods from package {@link https://www.openhab.org/javadoc/latest/org/openhab/core/util/package-summary org.openhab.core.util}.
 * Refer to {@link https://www.openhab.org/docs/configuration/actions.html#color-utilities openHAB Docs: Color Utilities} for more information.
 *
 * @name CoreUtil
 * @memberof actions
 */
export const CoreUtil: any;
/**
 * {@link https://www.openhab.org/javadoc/latest/org/openhab/core/model/script/actions/ephemeris Ephemeris} Actions
 *
 * The static methods of this class are made available as functions in the scripts. This allows a script to use ephemeris features.
 * Refer to {@link https://www.openhab.org/docs/configuration/actions.html#actions-examples openHAB Docs: Ephemeris Actions} for more information.
 *
 * @name Ephemeris
 * @memberof actions
 */
export const Ephemeris: any;
/**
 * {@link https://www.openhab.org/javadoc/latest/org/openhab/core/model/script/actions/exec Exec} Actions
 *
 * This class provides static methods that can be used in automation rules for executing commands on the command line.
 * Refer to {@link https://www.openhab.org/docs/configuration/actions.html#exec-actions openHAB Docs: Exec Actions} for more information.
 *
 * @name Exec
 * @memberof actions
 */
export const Exec: any;
/**
 * {@link https://www.openhab.org/javadoc/latest/org/openhab/core/model/script/actions/HTTP.html HTTP} Actions
 *
 * This class provides static methods that can be used in automation rules for sending HTTP requests.
 * Refer to {@link https://www.openhab.org/docs/configuration/actions.html#http-actions openHAB Docs: HTTP Actions} for more information.}
 *
 * @name HTTP
 * @memberof actions
 */
export const HTTP: any;
/**
 * {@link https://www.openhab.org/javadoc/latest/org/openhab/core/model/script/actions/Log.html Log} Actions
 *
 * The static methods of this class are made available as functions in the scripts. This allows a script to log to the SLF4J-Log.
 *
 * @deprecated Use {@link https://www.openhab.org/addons/automation/jsscripting/#console <code>console</code>} logging instead.
 * @name Log
 * @memberof actions
 */
declare const LogAction: any;
/**
 * {@link https://www.openhab.org/javadoc/latest/org/openhab/core/model/script/actions/Ping.html Ping} Actions
 *
 * This Action checks the vitality of the given host.
 *
 * @example
 * Ping.checkVitality(String host, int port, int timeout)
 *
 * @name Ping
 * @memberof actions
 */
export const Ping: any;
/**
 * {@link https://www.openhab.org/javadoc/latest/org/openhab/core/model/script/actions/scriptexecution ScriptExecution} Actions
 *
 * The static methods of this class are made available as functions in the scripts.
 *
 * @memberof actions
 * @hideconstructor
 */
export class ScriptExecution {
    /**
     * Calls a script which must be located in the configurations/scripts folder.
     *
     * @param {string} scriptName the name of the script (if the name does not end with the .script file extension it is added)
     */
    static callScript(scriptName: string): void;
    /**
     * Schedules a function for later execution.
     *
     * @example
     * // Minimal example:
     * actions.ScriptExecution.createTimer(time.toZDT().plusSeconds(10), () => {
     *   console.log('Hello timer!');
     * });
     * // With parameters:
     * actions.ScriptExecution.createTimer(time.toZDT().plusSeconds(10), (foo, bar) => {
     *   console.log('foo = ' + foo);
     *   console.log('bar = ' + bar);
     * }, 'param1', 'param2');
     * // With identifier:
     * actions.ScriptExecution.createTimer('myTimer', time.toZDT().plusSeconds(10), () => {
     *   console.log('myTimer ran!');
     * })
     *
     * @param {string} identifier an optional identifier, e.g. used for logging
     * @param {time.ZonedDateTime} zdt the point in time when the callback function should be executed
     * @param {function} functionRef callback function to execute when the timer expires
     * @param {...*} params additional arguments which are passed through to the function specified by `functionRef`
     * @returns {*} a native openHAB Timer
     */
    static createTimer(identifier: string, zdt: time.ZonedDateTime, functionRef: Function, ...params: any[]): any;
}
/**
 * {@link https://www.openhab.org/javadoc/latest/org/openhab/core/model/script/actions/Semantics.html Semantics} Actions
 *
 * The static methods of this class are made available as functions in the scripts. This allows a script to use Semantics features.
 *
 * @deprecated Use {@link items.ItemSemantics} available through the <code>semantics</code> property of {@link items.Item} instead.
 * @name Semantics
 * @memberof actions
 */
export const Semantics: any;
/**
 * {@link https://www.openhab.org/javadoc/latest/org/openhab/core/model/script/actions/Things.html Things} Actions
 *
 * This class provides static methods that can be used in automation rules for getting thing's status info.
 *
 * @deprecated Use {@link actions.thingActions} and <code>status</code>, <code>statusInfo</code> of {@link things.Thing} instead.
 * @name Things
 * @memberof actions
 */
declare const ThingsAction: any;
/**
 * {@link https://www.openhab.org/javadoc/latest/org/openhab/core/transform/actions/transformation Transformation} Actions
 *
 * The static methods of this class allow rules to execute transformations using one of the various {@link https://www.openhab.org/addons/#transform data transformation services}.
 *
 * @memberof actions
 * @hideconstructor
 */
export class Transformation {
    /**
     * Applies a transformation of a given type with some function to a value.
     *
     * @param {string} type the transformation type, e.g. REGEX or MAP
     * @param {string} fn the function to call, this value depends on the transformation type
     * @param {string} value the value to apply the transformation to
     * @returns {string} the transformed value or the original one, if there was no service registered for the given type or a transformation exception occurred
     */
    static transform(type: string, fn: string, value: string): string;
    /**
     * Applies a transformation of a given type with some function to a value.
     *
     * @param {string} type the transformation type, e.g. REGEX or MAP
     * @param {string} fn the function to call, this value depends on the transformation type
     * @param {string} value the value to apply the transformation to
     * @returns {string} the transformed value
     * @throws Java {@link https://www.openhab.org/javadoc/latest/org/openhab/core/transform/TransformationException.html TransformationException}
     */
    static transformRaw(type: string, fn: string, value: string): string;
}
/**
 * {@link https://www.openhab.org/javadoc/latest/org/openhab/core/model/script/actions/Voice.html Voice} Actions
 *
 * The static methods of this class are made available as functions in the scripts. This allows a script to use voice features.
 * Refer to {@link https://www.openhab.org/docs/configuration/multimedia.html#actions-3 openHAB Docs: Voice Actions} for more information.
 *
 * @name Voice
 * @memberof actions
 */
export const Voice: any;
/**
 * Cloud Notification Actions
 *
 * If the {@link https://www.openhab.org/addons/integrations/openhabcloud/ openHAB Cloud Connector} add-on is installed, notifications can be sent to registered users/devices.
 *
 * The static methods of this class are made available as functions in the scripts. This allows a script to send notifications using the openHAB Cloud Connector add-on.
 * See {@link https://www.openhab.org/docs/configuration/actions.html#cloud-notification-actions Cloud Notification Action Docs} for full documentation.
 *
 * @deprecated Use the notification builders of {@link actions.notificationBuilder} instead.
 * @name NotificationAction
 * @memberof actions
 */
export let NotificationAction: any;
import { notificationBuilder } from "./notification-builder";
export declare function get(bindingId: string, thingUid: string): any;
export declare function thingActions(bindingId: string, thingUid: string): any;
export { LogAction as Log, ThingsAction as Things, notificationBuilder };
//# sourceMappingURL=actions.d.ts.map