/**
 * Actions namespace.
 * This namespace provides access to openHAB actions. All available actions can be accessed as direct properties of this
 * object (via their simple class name).
 * 
 * @example <caption>Sends a broadcast notification</caption>
 * let { actions } = require('openhab');
 * actions.NotificationAction.sendBroadcastNotification("Hello World!")
 * 
 * @example <caption>Sends a PushSafer notification</caption>
 * let { actions } = require('openhab');
 *  actions.Pushsafer.pushsafer("<your pushsafer api key>", "<message>", "<message title>", "", "", "", "")
 * 
 * @namespace actions
 */



const osgi = require('./osgi');
const utils = require('./utils');
const { actions } = require('@runtime/Defaults');
const log = require('./log')('actions');

const Things = Java.type('org.openhab.core.model.script.actions.Things');
const actionServices = osgi.findServices("org.openhab.core.model.script.engine.action.ActionService", null) || [];

actionServices.forEach(function (item) {
    try {
        //if an action fails to activate, then warn and continue so that other actions are available
        exports[item.getActionClass().getSimpleName()] = item.getActionClass().static;
    } catch(e) {
        log.warn("Failed to activate action {} due to {}", item, e);
    }
});

let Exec = Java.type('org.openhab.core.model.script.actions.Exec');
let HTTP = Java.type('org.openhab.core.model.script.actions.HTTP');
let LogAction = Java.type('org.openhab.core.model.script.actions.Log');
let Ping = Java.type('org.openhab.core.model.script.actions.Ping');
let ScriptExecution = Java.type('org.openhab.core.model.script.actions.ScriptExecution');

[Exec, HTTP, LogAction, Ping, ScriptExecution].forEach(function (item) {
    exports[item.class.getSimpleName()] = item.class.static;
});

exports.get = (...args) => actions.get(...args)

exports.thingActions = (bindingId, thingUid) => Things.getActions(bindingId,thingUid)
