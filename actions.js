/* eslint-disable no-irregular-whitespace */

/**
 * Actions namespace.
 *
 * This namespace provides access to openHAB actions. {@link https://www.openhab.org/javadoc/latest/org/openhab/core/model/script/actions/package-summary.html All available actions} can be accessed as direct properties of this
 * object (via their simple class name).
 *
 * Additional actions provided by user installed addons can be accessed using their common name on the actions name space if the addon exports them in a proper way.
 *
 * @namespace actions
 * @example <caption>Sends a broadcast notification</caption>
 * const { actions } = require('openhab');
 * actions.NotificationAction.sendBroadcastNotification("Hello World!")
 */
/**
 * @typedef {import('@js-joda/core').ZonedDateTime} time.ZonedDateTime
 * @private
 */

const osgi = require('./osgi');
// See https://github.com/openhab/openhab-core/blob/main/bundles/org.openhab.core.automation.module.script/src/main/java/org/openhab/core/automation/module/script/internal/defaultscope/ScriptThingActionsImpl.java
const { actions } = require('@runtime/Defaults');
const log = require('./log')('actions');

const Things = Java.type('org.openhab.core.model.script.actions.Things');
const actionServices = osgi.findServices('org.openhab.core.model.script.engine.action.ActionService', null) || [];

const JavaScriptExecution = Java.type('org.openhab.core.model.script.actions.ScriptExecution');
const JavaTransformation = Java.type('org.openhab.core.transform.actions.Transformation');

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
 *
 * @example
 * Audio.decreaseMasterVolume(float percent)
 * Audio.getMasterVolume()
 * Audio.increaseMasterVolume(float percent)
 * Audio.playSound(String filename)
 * Audio.playSound(String sink, String filename)
 * Audio.playSound(String sink, String filename, PercentType volume)
 * Audio.playSound(String filename, PercentType volume)
 * Audio.playStream(String url)
 * Audio.playStream(String sink, String url)
 * Audio.setMasterVolume(float volume)
 * Audio.setMasterVolume(PercentType percent)
 * Audio.decreaseMasterVolume(1.0)
 *
 * @name Audio
 * @memberof actions
 */
const Audio = Java.type('org.openhab.core.model.script.actions.Audio');

/**
 * {@link https://www.openhab.org/javadoc/latest/org/openhab/core/model/script/actions/busevent BusEvent} Actions
 *
 * The static methods of this class are made available as functions in the scripts. This gives direct write access to the openHAB event bus from within scripts. Items should not be updated directly (setting the state property), but updates should be sent to the bus, so that all interested bundles are notified.
 * @example
 * BusEvent.postUpdate(String itemName, String stateString)
 * BusEvent.postUpdate(Item item, Number state)
 * BusEvent.postUpdate(Item item, String stateAsString)
 * BusEvent.postUpdate(Item item, State state)
 * BusEvent.restoreStates(Map<Item,​State> statesMap)
 * BusEvent.sendCommand(String itemName, String commandString)
 * BusEvent.sendCommand(Item item, Number number)
 * BusEvent.sendCommand(Item item, String commandString)
 * BusEvent.sendCommand(Item item, Command command)
 * BusEvent.storeStates(Item... items)
 *
 * @name BusEvent
 * @memberof actions
 */
const BusEvent = Java.type('org.openhab.core.model.script.actions.BusEvent');

/**
 * {@link https://www.openhab.org/javadoc/latest/org/openhab/core/model/script/actions/ephemeris Ephemeris} Actions
 *
 * The static methods of this class are made available as functions in the scripts. This allows a script to use ephemeris features.
 * @example
 * Ephemeris.getBankHolidayName()
 * Ephemeris.getBankHolidayName(int offset)
 * Ephemeris.getBankHolidayName(int offset, String filename)
 * Ephemeris.getBankHolidayName(String filename)
 * Ephemeris.getBankHolidayName(ZonedDateTime day)
 * Ephemeris.getBankHolidayName(ZonedDateTime day, String filename)
 * Ephemeris.getDaysUntil(String searchedHoliday)
 * Ephemeris.getDaysUntil(String searchedHoliday, String filename)
 * Ephemeris.getDaysUntil(ZonedDateTime day, String searchedHoliday)
 * Ephemeris.getDaysUntil(ZonedDateTime day, String searchedHoliday, String filename)
 * Ephemeris.getHolidayDescription(@Nullable String holiday)
 * Ephemeris.getNextBankHoliday()
 * Ephemeris.getNextBankHoliday(int offset)
 * Ephemeris.getNextBankHoliday(int offset, String filename)
 * Ephemeris.getNextBankHoliday(String filename)
 * Ephemeris.getNextBankHoliday(ZonedDateTime day)
 * Ephemeris.getNextBankHoliday(ZonedDateTime day, String filename)
 * Ephemeris.isBankHoliday()
 * Ephemeris.isBankHoliday(int offset)
 * Ephemeris.isBankHoliday(int offset, String filename)
 * Ephemeris.isBankHoliday(String filename)
 * Ephemeris.isBankHoliday(ZonedDateTime day)
 * Ephemeris.isBankHoliday(ZonedDateTime day, String filename)
 * Ephemeris.isInDayset(String daysetName)
 * Ephemeris.isInDayset(String daysetName, int offset)
 * Ephemeris.isInDayset(String daysetName, ZonedDateTime day)
 * Ephemeris.isWeekend()
 * Ephemeris.isWeekend(int offset)
 * Ephemeris.isWeekend(ZonedDateTime day)
 *
 * @name Ephemeris
 * @memberof actions
 */
const Ephemeris = Java.type('org.openhab.core.model.script.actions.Ephemeris');

/**
 * {@link https://www.openhab.org/javadoc/latest/org/openhab/core/model/script/actions/exec Exec} Actions
 *
 * This class provides static methods that can be used in automation rules for executing commands on command line.
 *
 * @example
 * Exec.executeCommandLine(String... commandLine)
 * Exec.executeCommandLine(Duration timeout, String... commandLine)
 *
 * @name Exec
 * @memberof actions
 */
const Exec = Java.type('org.openhab.core.model.script.actions.Exec');

/**
 * {@link https://www.openhab.org/javadoc/latest/org/openhab/core/model/script/actions/HTTP.html HTTP} Actions
 *
 * This class provides static methods that can be used in automation rules for sending HTTP requests
 *
 * @example
 * HTTP.sendHttpDeleteRequest(String url)
 * HTTP.sendHttpDeleteRequest(String url, int timeout)
 * HTTP.sendHttpDeleteRequest(String url, Map<String, String> headers, int timeout)
 * HTTP.sendHttpGetRequest(String url)
 * HTTP.sendHttpGetRequest(String url, int timeout)
 * HTTP.sendHttpGetRequest(String url, Map<String, String> headers, int timeout)
 * HTTP.sendHttpPostRequest(String url)
 * HTTP.sendHttpPostRequest(String url, int timeout)
 * HTTP.sendHttpPostRequest(String url, String contentType, String content)
 * HTTP.sendHttpPostRequest(String url, String contentType, String content, int timeout)
 * HTTP.sendHttpPostRequest(String url, String contentType, String content, Map<String, String> headers, int timeout)
 * HTTP.sendHttpPutRequest(String url)
 * HTTP.sendHttpPutRequest(String url, int timeout)
 * HTTP.sendHttpPutRequest(String url, String contentType, String content)
 * HTTP.sendHttpPutRequest(String url, String contentType, String content, int timeout)
 * HTTP.sendHttpPutRequest(String url, String contentType, String content, Map<String, String> headers, int timeout)
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
 * @example
 * Log.logDebug(String loggerName, String format, Object... args)
 * Log.logError(String loggerName, String format, Object... args)
 * Log.logInfo(String loggerName, String format, Object... args)
 * Log.logWarn(String loggerName, String format, Object... args)
 *
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
 * @example
 * ScriptExecution.callScript(string scriptName)
 * ScriptExecution.createTimer(time.ZonedDateTime instant, function callbackFunction)
 * ScriptExecution.createTimer(string identifier, time.ZonedDateTime instant, function callbackFunction)
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
   * @param {string} identifier an optional identifier
   * @param {time.ZonedDateTime} instant the point in time when the code should be executed
   * @param {function} closure the code block to execute
   * @returns {*} a native openHAB Timer
   */
  static createTimer (identifier, instant, closure) {
    // Support method overloading as identifier is optional
    if (typeof identifier === 'string' && closure != null) {
      // Try to access the createTimer method of ThreadsafeTimers
      try {
        return ThreadsafeTimers.createTimer(identifier, instant, closure); // eslint-disable-line no-undef
      } catch {
        return JavaScriptExecution.createTimer(identifier, instant, closure);
      }
    } else {
      // Try to access the createTimer method of ThreadsafeTimers
      try {
        return ThreadsafeTimers.createTimer(identifier, instant); // eslint-disable-line no-undef
      } catch {
        return JavaScriptExecution.createTimer(identifier, instant);
      }
    }
  }

  /**
   * Schedules a function (with argument) for later execution
   *
   * @deprecated
   * @param {string} identifier an optional identifier
   * @param {time.ZonedDateTime} instant the point in time when the code should be executed
   * @param {*} arg1 the argument to pass to the code block
   * @param {function} closure the code block to execute
   * @returns {*} a native openHAB Timer
   */
  static createTimerWithArgument (identifier, instant, arg1, closure) {
    console.warn('"createTimerWithArgument" has been deprecated and will be removed in a future release. Use "createTimer" or "setTimeout" instead.');
    // Support method overloading as identifier is optional
    if (typeof identifier === 'string' && closure != null) {
      return JavaScriptExecution.createTimerWithArgument(identifier, instant, arg1, closure);
    } else {
      return JavaScriptExecution.createTimerWithArgument(identifier, instant, arg1);
    }
  }
}

/**
 * {@link https://www.openhab.org/javadoc/latest/org/openhab/core/model/script/actions/Semantics.html Semantics} Actions
 *
 * The static methods of this class are made available as functions in the scripts. This allows a script to use Semantics features.
 *
 * Instead of using the Semantics actions, it is recommended to use the the {@link items.ItemSemantics} available through the `semantics` property of an {@link items.Item}.
 *
 * @example
 * Semantics.getEquipment(Item item)
 * Semantics.getEquipmentType(Item item)
 * Semantics.getLocation(Item item)
 * Semantics.getLocationType(Item item)
 * Semantics.getPointType(Item item)
 * Semantics.getPropertyType(Item item)
 * Semantics.getSemanticType(Item item)
 * Semantics.isEquipment(Item item)
 * Semantics.isLocation(Item item)
 * Semantics.isPoint(Item item)
 *
 * @name Semantics
 * @memberof actions
 */
const Semantics = Java.type('org.openhab.core.model.script.actions.Semantics');

/**
 * {@link https://www.openhab.org/javadoc/latest/org/openhab/core/model/script/actions/Things.html Things} Actions
 *
 * This class provides static methods that can be used in automation rules for getting thing's status info.
 *
 * @example
 * Things.getActions(String bindingId, String thingUid)
 * Things.getThingStatusInfo(String thingUid)
 *
 * @name Things
 * @memberof actions
 */
const ThingsAction = Java.type('org.openhab.core.model.script.actions.Things');

/**
 * {@link https://www.openhab.org/javadoc/latest/org/openhab/core/transform/actions/transformation Transformation} Actions
 *
 * The static methods of this class allow rules to execute transformations using one of the various {@link https://www.openhab.org/addons/#transform data transformation services}.
 *
 * @example
 * actions.Transformation.transform('MAP', 'en.map', 'OPEN'); // returns "open"
 * actions.Transformation.transform('MAP', 'de.map', 'OPEN'); // returns "offen"
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
 *
 * @example
 * Voice.interpret(Object text)
 * Voice.interpret(Object text, String interpreter)
 * Voice.interpret(Object text, String interpreter, String sink)
 * Voice.say(Object text)
 * Voice.say(Object text, String voice)
 * Voice.say(Object text, String voice, String sink)
 * Voice.say(Object text, String voice, String sink, PercentType volume)
 * Voice.say(Object text, String voice, PercentType volume)
 * Voice.say(Object text, PercentType volume)
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
 * @example
 * NotificationAction.sendNotification('<email>', '<message>'); // to a single myopenHAB user identified by e-mail
 * NotificationAction.sendBroadcastNotification('<message>'); // to all myopenHAB users
 * NotificationAction.sendLogNotification('<message>'); // only listed in the notification log
 *
 * @name NotificationAction
 * @memberof actions
 */
let NotificationAction;
try {
  NotificationAction = Java.type('org.openhab.io.openhabcloud.NotificationAction');
} catch (error) {
  if (error.name !== 'TypeError') throw new Error(error);
}

module.exports = Object.assign(dynamicExports, {
  Audio,
  BusEvent,
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
  /**
   * Get the ThingActions of a given Thing.
   * Duplicate of {@link actions.Things actions.Things.getActions()}.
   *
   * @memberof actions
   * @param {string} bindingId binding ID
   * @param {string} thingUid Thing UID
   * @returns {*} Native Java {@link https://www.openhab.org/javadoc/latest/org/openhab/core/thing/binding/thingactions ThingActions}
   */
  get: (bindingId, thingUid) => actions.get(bindingId, thingUid),
  /**
   * Get the ThingActions of a given Thing.
   * Duplicate of {@link actions.get actions.get()} and {@link actions.Things actions.Things.getActions()}.
   *
   * @memberof actions
   * @param {string} bindingId binding ID
   * @param {string} thingUid Thing UID
   * @returns {*} Native Java {@link https://www.openhab.org/javadoc/latest/org/openhab/core/thing/binding/thingactions ThingActions}
   */
  thingActions: (bindingId, thingUid) => Things.getActions(bindingId, thingUid)
});
