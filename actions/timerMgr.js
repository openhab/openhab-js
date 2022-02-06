const { cache, actions, log } = require('openhab');
const logger = log('actions.timerMgr');

/**
 * Timer Manager namespace.
 * This namespace allows creation and management of timers using the timer manager.
 *
 * Logger identifier is <caption>org.openhab.automation.script.actions.timermgr</caption>.
 *
 * @namespace actions.timerMgr
 */

/**
 * Create a timer with the timerManager.
 *
 * If there is no timer with the given id, create one to expire at when and call func.
 * If there already is a timer associated with id, then:
 * If reschedule is true, reschedule the timer at when, else cancel the timer.
 * If flappingFunc is provided, call flappingFunc.
 *
 * @memberOf actions.timerMgr
 * @param {String} id the "name" of the timer
 * @param {*} when any representation of time of duration
 * @param {function} [func] function to call when the timer expires
 * @param {boolean} [reschedule=false] optional flag, when present and true rescheudle the timer if it already exists
 * @param {function} [flappingFunc] function to call when the timer already exists
 *
 * @example
 * const now = require('openhab').time.ZonedDateTime.now();
 * createTimer('my-timer', now.plusSeconds(10), () => { console.info('Success'); }, false, () => { console.warn('Already exists.'); });
 */
const createTimer = (id, when, func, reschedule, flappingFunc) => {
  // Check for params.
  if (!id) throw Error('Parameter id is required!');
  if (!when) throw Error('Parameter when is required.');

  const timeout = when; // TODO: needs toDateTime from rkoshak's timeUtils

  const exists = cache.exists(id);
  if (exists) {
    // Timer already exists.
    logger.debug('Timer [{}] already exists.', id);
    const timer = cache.get(id);
    if (reschedule) {
      logger.debug('Rescheduling timer [{}].', id);
      timer.reschedule(timeout);
    } else {
      logger.debug('Cancelling timer [{}].', id);
      timer.cancel();
      cache.remove(id);
    }
    if (flappingFunc) flappingFunc();
  } else if (!exists) {
    // Timer does not exist.
    logger.debug('Creating timer [{}].', id);
    const timer = actions.ScriptExecution.createTimer(timeout, () => {
      // Debugging & Clean-Up.
      logger.debug('Timer [{}] expired.', id);
      cache.remove(id);
      // Execute passed function.
      if (func) func();
    });
    cache.put(id, timer);
  }
};

/**
 * Check whether timer exists.
 *
 * @memberOf actions.timerMgr
 * @param {String} id the "name" of the timer
 * @returns {boolean} whether a timer with the given key exists
 */
const hasTimer = (id) => {
  return cache.exists(id);
};

/**
 * If there is a timer identified by id, cancel it.
 *
 * @memberOf actions.timerMgr
 * @param {String} id name of the timer
 */
const cancel = (id) => {
  if (cache.exists(id)) {
    cache.get(id).cancel();
    cache.remove(id);
  }
};

module.exports = {
  createTimer,
  hasTimer,
  cancel
};
