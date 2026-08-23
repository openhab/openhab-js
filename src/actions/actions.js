/**
 * Actions namespace.
 *
 * This namespace provides access to openHAB actions.
 * {@link https://www.openhab.org/javadoc/latest/org/openhab/core/model/script/actions/package-summary.html All available actions} can be accessed as direct properties of this object (via their simple class name).
 *
 * WARNING: Please be aware that there is, unless otherwise noted, NO type conversion from Java to JavaScript types for the return values of actions.
 * Read the linked JavaDoc to learn about the returned Java types.
 *
 * Additional actions provided by user installed addons can be accessed using their common name on the actions name space if the addon exports them in a proper way.
 *
 * @example
 * const { actions, time } = require('openhab');
 * <caption>Send a broadcast notification</caption>
 * actions.NotificationAction.sendBroadcastNotification('Hello World!');
 * <caption>Schedule a function for later execution/Create a timer (advanced)</caption>
 * actions.ScriptExecution.createTimer('myTimer', time.toZDT().plusMinutes(10), () => { console.log('Hello timer!'); });
 *
 * @namespace actions
 */

const osgi = require('../osgi');
// See https://github.com/openhab/openhab-core/blob/main/bundles/org.openhab.core.automation.module.script/src/main/java/org/openhab/core/automation/module/script/internal/defaultscope/ScriptThingActionsImpl.java
const log = require('../log')('actions');

const Things = Java.type('org.openhab.core.model.script.actions.Things');
const actionServices = osgi.findServices('org.openhab.core.model.script.engine.action.ActionService', null) || [];

const JavaCoreUtil = Java.type('org.openhab.core.model.script.actions.CoreUtil');
const JavaScriptExecution = Java.type('org.openhab.core.model.script.actions.ScriptExecution');
const JavaTransformation = Java.type('org.openhab.core.transform.actions.Transformation');

const { notificationBuilder } = require('./notification-builder');

// Dynamically export all found actions
const dynamicExports = {};
actionServices.forEach((a) => {
  try {
    // if an action fails to activate, then warn and continue so that other actions are available
    dynamicExports[a.getActionClass().getSimpleName()] = a.getActionClass().static;
    log.debug('Successfully activated action {} as {}', a, a.getActionClass().getSimpleName());
  } catch (e) {
    log.warn('Failed to activate action {} due to {}', a, e);
  }
});

/**
 * {@link https://www.openhab.org/javadoc/latest/org/openhab/core/model/script/actions/audio Audio} Actions
 *
 * The static methods of this class are made available as functions in the scripts. This allows a script to use audio features.
 * Refer to {@link https://www.openhab.org/docs/configuration/multimedia.html#actions openHAB Docs: Audio Actions} for more information.
 *
 * @name Audio
 * @memberof actions
 */
const Audio = Java.type('org.openhab.core.model.script.actions.Audio');

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
const BusEvent = Java.type('org.openhab.core.model.script.actions.BusEvent');

/**
 * {@link https://www.openhab.org/javadoc/latest/org/openhab/core/model/script/actions/coreutil CoreUtil} Actions
 *
 * This class provides static methods mapping methods from package {@link https://www.openhab.org/javadoc/latest/org/openhab/core/util/package-summary org.openhab.core.util}.
 * Refer to {@link https://www.openhab.org/docs/configuration/actions.html#color-utilities openHAB Docs: Color Utilities} for more information.
 *
 * @name CoreUtil
 * @memberof actions
 */
const CoreUtil = JavaCoreUtil;

/**
 * {@link https://www.openhab.org/javadoc/latest/org/openhab/core/model/script/actions/ephemeris Ephemeris} Actions
 *
 * The static methods of this class are made available as functions in the scripts. This allows a script to use ephemeris features.
 * Refer to {@link https://www.openhab.org/docs/configuration/actions.html#actions-examples openHAB Docs: Ephemeris Actions} for more information.
 *
 * @name Ephemeris
 * @memberof actions
 */
const Ephemeris = Java.type('org.openhab.core.model.script.actions.Ephemeris');

/**
 * {@link https://www.openhab.org/javadoc/latest/org/openhab/core/model/script/actions/exec Exec} Actions
 *
 * This class provides static methods that can be used in automation rules for executing commands on the command line.
 * Refer to {@link https://www.openhab.org/docs/configuration/actions.html#exec-actions openHAB Docs: Exec Actions} for more information.
 *
 * @name Exec
 * @memberof actions
 */
const Exec = Java.type('org.openhab.core.model.script.actions.Exec');

/**
 * {@link https://www.openhab.org/javadoc/latest/org/openhab/core/model/script/actions/HTTP.html HTTP} Actions
 *
 * This class provides static methods that can be used in automation rules for sending HTTP requests.
 * Refer to {@link https://www.openhab.org/docs/configuration/actions.html#http-actions openHAB Docs: HTTP Actions} for more information.}
 *
 * @name HTTP
 * @memberof actions
 */
const HTTP = Java.type('org.openhab.core.model.script.actions.HTTP');

/**
 * {@link https://www.openhab.org/javadoc/latest/org/openhab/core/model/script/actions/Log.html Log} Actions
 *
 * The static methods of this class are made available as functions in the scripts. This allows a script to log to the SLF4J-Log.
 *
 * @deprecated Use {@link https://www.openhab.org/addons/automation/jsscripting/#console <code>console</code>} logging instead.
 * @name Log
 * @memberof actions
 */
const LogAction = Java.type('org.openhab.core.model.script.actions.Log');

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
const Ping = Java.type('org.openhab.core.model.script.actions.Ping');

/**
 * {@link https://www.openhab.org/javadoc/latest/org/openhab/core/model/script/actions/scriptexecution ScriptExecution} Actions
 *
 * The static methods of this class are made available as functions in the scripts.
 *
 * @memberof actions
 * @hideconstructor
 */
class ScriptExecution {
  /**
   * Calls a script which must be located in the configurations/scripts folder.
   *
   * @param {string} scriptName the name of the script (if the name does not end with the .script file extension it is added)
   */
  static callScript (scriptName) {
    JavaScriptExecution.callScript(scriptName);
  }

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
  static createTimer (identifier, zdt, functionRef, ...params) {
    ThreadsafeTimers.setIdentifier(console.loggerName); // eslint-disable-line no-undef
    // Support method overloading as identifier is optional
    if (typeof identifier === 'string' && functionRef != null) {
      const callbackFn = () => functionRef(...params);
      return ThreadsafeTimers.createTimer(identifier, zdt, callbackFn); // eslint-disable-line no-undef
    } else {
      const callbackFn = () => zdt(functionRef, ...params);
      return ThreadsafeTimers.createTimer(identifier, callbackFn); // eslint-disable-line no-undef
    }
  }
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
const Semantics = Java.type('org.openhab.core.model.script.actions.Semantics');

/**
 * {@link https://www.openhab.org/javadoc/latest/org/openhab/core/model/script/actions/Things.html Things} Actions
 *
 * This class provides static methods that can be used in automation rules for getting thing's status info.
 *
 * @deprecated Use {@link actions.thingActions} and <code>status</code>, <code>statusInfo</code> of {@link things.Thing} instead.
 * @name Things
 * @memberof actions
 */
const ThingsAction = Java.type('org.openhab.core.model.script.actions.Things');

/**
 * {@link https://www.openhab.org/javadoc/latest/org/openhab/core/transform/actions/transformation Transformation} Actions
 *
 * The static methods of this class allow rules to execute transformations using one of the various {@link https://www.openhab.org/addons/#transform data transformation services}.
 *
 * @memberof actions
 * @hideconstructor
 */
class Transformation {
  /**
   * Applies a transformation of a given type with some function to a value.
   *
   * @param {string} type the transformation type, e.g. REGEX or MAP
   * @param {string} fn the function to call, this value depends on the transformation type
   * @param {string} value the value to apply the transformation to
   * @returns {string} the transformed value or the original one, if there was no service registered for the given type or a transformation exception occurred
   */
  static transform (type, fn, value) {
    return JavaTransformation.transform(type, fn, value).toString();
  }

  /**
   * Applies a transformation of a given type with some function to a value.
   *
   * @param {string} type the transformation type, e.g. REGEX or MAP
   * @param {string} fn the function to call, this value depends on the transformation type
   * @param {string} value the value to apply the transformation to
   * @returns {string} the transformed value
   * @throws Java {@link https://www.openhab.org/javadoc/latest/org/openhab/core/transform/TransformationException.html TransformationException}
   */
  static transformRaw (type, fn, value) {
    // Wrap exception to enable JS stack traces
    try {
      return JavaTransformation.transformRaw(type, fn, value).toString();
    } catch (error) {
      throw new Error(error);
    }
  }
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
const Voice = Java.type('org.openhab.core.model.script.actions.Voice');

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
let NotificationAction;
try {
  NotificationAction = Java.type('org.openhab.io.openhabcloud.NotificationAction');
} catch (error) {
  if (error.name !== 'TypeError') throw error;
}

module.exports = Object.assign(dynamicExports, {
  Audio,
  BusEvent,
  CoreUtil,
  Ephemeris,
  Exec,
  HTTP,
  Log: LogAction,
  Ping,
  ScriptExecution,
  Semantics,
  Things: ThingsAction,
  Transformation,
  Voice,
  NotificationAction,
  notificationBuilder,
  /**
   * Get the ThingActions of a given Thing.
   *
   * @deprecated Use {@link actions.thingActions} instead.
   * @memberof actions
   * @param {string} bindingId binding ID
   * @param {string} thingUid Thing UID
   * @returns {*} Native Java {@link https://www.openhab.org/javadoc/latest/org/openhab/core/thing/binding/thingactions ThingActions}
   */
  get: (bindingId, thingUid) => Things.getActions(bindingId, thingUid),
  /**
   * Get the ThingActions of a given Thing.
   *
   * @memberof actions
   * @param {string} bindingId binding ID
   * @param {string} thingUid Thing UID
   * @returns {*} Native Java {@link https://www.openhab.org/javadoc/latest/org/openhab/core/thing/binding/thingactions ThingActions}
   */
  thingActions: (bindingId, thingUid) => Things.getActions(bindingId, thingUid)
});
