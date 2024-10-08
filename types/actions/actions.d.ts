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
export const Audio: any;
/**
 * {@link https://www.openhab.org/javadoc/latest/org/openhab/core/model/script/actions/busevent BusEvent} Actions
 *
 * The static methods of this class are made available as functions in the scripts. This gives direct write access to the openHAB event bus from within scripts. Items should not be updated directly (setting the state property), but updates should be sent to the bus, so that all interested bundles are notified.
 *
 * Instead of using the BusEvent actions, it is recommended to use the `postUpdate` and `sendCommand` methods of {@link items.Item}.
 *
 * @example
 * BusEvent.postUpdate(String itemName, String stateString)
 * BusEvent.postUpdate(Item item, Number state)
 * BusEvent.postUpdate(Item item, String stateAsString)
 * BusEvent.postUpdate(Item item, State state)
 * BusEvent.restoreStates(Map<Item, State> statesMap)
 * BusEvent.sendCommand(String itemName, String commandString)
 * BusEvent.sendCommand(Item item, Number number)
 * BusEvent.sendCommand(Item item, String commandString)
 * BusEvent.sendCommand(Item item, Command command)
 * BusEvent.storeStates(Item... items)
 *
 * @name BusEvent
 * @memberof actions
 */
export const BusEvent: any;
/**
 * {@link https://www.openhab.org/javadoc/latest/org/openhab/core/model/script/actions/coreutil CoreUtil} Actions
 *
 * This class provides static methods mapping methods from package {@link https://www.openhab.org/javadoc/latest/org/openhab/core/util/package-summary org.openhab.core.util}.
 *
 * Its functionality includes:
 * @example
 * CoreUtil.hsbToRgb(HSBType hsb) -> int[]
 * CoreUtil.hsbToRgbPercent(HSBType hsb) -> PercentType[]
 * CoreUtil.hsbTosRGB(HSBType hsb) -> int
 * CoreUtil.hsbToRgbw(HSBType hsb) -> int[]
 * CoreUtil.hsbToRgbwPercent(HSBType hsb) -> PercentType[]
 * CoreUtil.rgbToHsb(int[] rgb) -> HSBType
 * CoreUtil.rgbToHsb(PercentType[] rgb) -> HSBType
 * CoreUtil.xyToDuv(double[] xy) -> double
 * CoreUtil.kelvinToXY(double kelvin) -> double[]
 * CoreUtil.xyToKelvin(double[] xy) -> double
 *
 * @name CoreUtil
 * @memberof actions
 */
export const CoreUtil: any;
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
export const Ephemeris: any;
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
export const Exec: any;
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
export const HTTP: any;
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
 * @example
 * ScriptExecution.callScript(string scriptName)
 * ScriptExecution.createTimer(time.ZonedDateTime instant, function callbackFunction)
 * ScriptExecution.createTimer(string identifier, time.ZonedDateTime instant, function callbackFunction)
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
     * actions.ScriptExecution.createTimer(time.toZDT().plusSeconds(10), (foo, bar) => {
     *   console.log(foo + bar);
     * }, 'Hello', 'openHAB');
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
 * @example
 * Things.getActions(String bindingId, String thingUid)
 * Things.getThingStatusInfo(String thingUid)
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
 * @example
 * actions.Transformation.transform('MAP', 'en.map', 'OPEN'); // returns "open"
 * actions.Transformation.transform('MAP', 'de.map', 'OPEN'); // returns "offen"
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
declare namespace time {
    type ZonedDateTime = import('@js-joda/core').ZonedDateTime;
}
export declare function get(bindingId: string, thingUid: string): any;
export declare function thingActions(bindingId: string, thingUid: string): any;
export { LogAction as Log, ThingsAction as Things, notificationBuilder };
//# sourceMappingURL=actions.d.ts.map