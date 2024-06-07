const time = require('../time');

/**
 * @typedef { import('@js-joda/core').Instant} time.Instant
 * @private
 */
/**
 * @typedef {import('../quantity').Quantity} Quantity
 * @private
 */

/**
 * A TimeSeries is used to transport a set of states together with their timestamp.
 * It is usually used for persisting historic state or forecasts in a persistence service.
 *
 * @memberof items
 */
class TimeSeries {
  #states = [];
  #policy;

  /**
   * Creates a new TimeSeries.
   *
   * The TimeSeries policy defines how the TimeSeries is persisted in a persistence service:
   * <code>ADD</code> adds the content to the persistence,
   * <code>REPLACE</code> first removes all persisted elements in the timespan given by {@link begin} and {@link end}.
   *
   * @param {string} policy TimeSeries policy <code>ADD</code> or <code>REPLACE</code>
   */
  constructor (policy) {
    if (!['ADD', 'REPLACE'].includes(policy)) throw new TypeError(`Invalid TimeSeries policy: ${policy}. Expected 'ADD' or 'REPLACE'.`);
    this.#policy = policy;
  }

  /**
   * The persistence policy of this TimeSeries
   *
   * @type {string}
   */
  get policy () {
    return this.#policy;
  }

  /**
   * Timestamp of the first element in the TimeSeries
   * @type {time.Instant}
   */
  get begin () {
    return this.#states.reduce((min, [timestamp, state]) => min.isBefore(timestamp) ? min : timestamp, time.Instant.MAX);
  }

  /**
   * Timestamp of the last element in the TimeSeries
   * @type {time.Instant}
   */
  get end () {
    return this.#states.reduce((max, [timestamp, state]) => max.isAfter(timestamp) ? max : timestamp, time.Instant.MIN);
  }

  /**
   * Number of elements in the TimeSeries
   * @type {number}
   */
  get size () {
    return this.#states.length;
  }

  /**
   * States of the TimeSeries together with their timestamp and sorted by their timestamps
   *
   * Be aware that this method returns a reference to the internal state array, i.e. don't modify the returned array.
   *
   * @type {Array}
   */
  get states () {
    return this.#states.sort(([timestampA, stateA], [timestampB, stateB]) => timestampA.isBefore(timestampB) ? -1 : 1);
  }

  /**
   * Add a new element to the TimeSeries.
   *
   * Elements can be added in an arbitrary order and are sorted chronologically.
   *
   * @param {*} timestamp a timestamp for the given state (uses {@link time.toZDT} for creating a {@link time.ZonedDateTime})
   * @param {string|number|Quantity|HostState} state the state at the given timestamp
   * @returns {TimeSeries} this TimeSeries instance
   */
  add (timestamp, state) {
    this.#states.push([time.toZDT(timestamp).toInstant(), state]);
    return this;
  }

  toString () {
    let states = '';
    for (const [timestamp, state] of this.states) {
      states += `[${timestamp} -> ${state}], `;
    }
    states = states.substring(0, states.length - 2);
    return `TimeSeries (Begin=${this.begin}, End=${this.end}, Size=${this.size}, States=${states})`;
  }
}

module.exports = TimeSeries;
