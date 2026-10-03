const triggers = require('../../src/triggers');

jest.mock('../../src/triggers');
jest.mock('../../src/items/items', () => ({}));

const time = require('@js-joda/core');
const { TriggerBuilder, TimingItemStateOperation } = require('../../src/rules/trigger-builder');
const { OperationBuilder } = require('../../src/rules/operation-builder');

describe('ItemTriggerConfig.for(timespan)', () => {
  const createBuilder = () => ({
    _triggerConfs: [],
    addTrigger (trigger) {
      this._triggerConfs.push(trigger);
      return this;
    }
  });

  const createTimingConf = (itemOrGroup = 'item1', isGroup = false) => {
    const triggerBuilder = new TriggerBuilder(createBuilder());
    const itemConf = isGroup ? triggerBuilder.memberOf(itemOrGroup) : triggerBuilder.item(itemOrGroup);
    return itemConf.changed().toOn().for(60000);
  };

  it('returns a TimingItemStateOperation that can be completed with .then()', () => {
    const builder = createBuilder();
    const conf = new TriggerBuilder(builder).item('item1').changed().toOn().for(60000);

    expect(conf).toBeInstanceOf(TimingItemStateOperation);
    expect(conf._complete()).toBe(true);
    expect(conf.then(() => {})).toBeInstanceOf(OperationBuilder);
    expect(builder._triggerConfs).toEqual([conf]);
  });

  it('parses the duration from a number, an ISO-8601 string or a Duration', () => {
    const triggerBuilder = new TriggerBuilder(createBuilder());
    expect(triggerBuilder.item('item1').changed().toOn().for(60000).durationMs).toBe(60000);
    expect(triggerBuilder.item('item1').changed().toOn().for('PT1M').durationMs).toBe(60000);
    expect(triggerBuilder.item('item1').changed().toOn().for(time.Duration.ofMinutes(1)).durationMs).toBe(60000);
  });

  it('throws when the Item state to wait for is not specified', () => {
    const triggerBuilder = new TriggerBuilder(createBuilder());
    expect(() => triggerBuilder.item('item1').changed().for(60000))
      .toThrow('Must specify item state value to wait for!');
  });

  it('throws when used without .changed()', () => {
    const triggerBuilder = new TriggerBuilder(createBuilder());
    expect(() => triggerBuilder.item('item1').toOn().for(60000))
      .toThrow('.for(..) only available for .changed()');
  });

  it.each([['item1', false], ['group1', true]])('creates an unfiltered %s change trigger', (name, isGroup) => {
    createTimingConf(name, isGroup)._toOHTriggers();

    expect(isGroup ? triggers.GroupStateChangeTrigger : triggers.ItemStateChangeTrigger).toHaveBeenCalledWith(name);
    expect(isGroup ? triggers.ItemStateChangeTrigger : triggers.GroupStateChangeTrigger).not.toHaveBeenCalled();
  });

  describe('execute hook', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it('runs the operation once the Item stayed in the target state', () => {
      const conf = createTimingConf();
      const hook = conf._executeHook();
      const next = jest.fn();
      const args = { newState: 'ON' };

      hook(next, args);
      jest.advanceTimersByTime(59999);
      expect(next).not.toHaveBeenCalled();
      jest.advanceTimersByTime(1);
      expect(next).toHaveBeenCalledWith(args);
    });

    it('cancels the wait when the Item changes away from the target state', () => {
      const conf = createTimingConf();
      const hook = conf._executeHook();
      const next = jest.fn();

      hook(next, { newState: 'ON' });
      hook(next, { newState: 'OFF' });
      jest.advanceTimersByTime(120000);
      expect(next).not.toHaveBeenCalled();
    });

    it('honours the from state', () => {
      const triggerBuilder = new TriggerBuilder(createBuilder());
      const conf = triggerBuilder.item('item1').changed().fromOff().toOn().for(60000);
      const hook = conf._executeHook();
      const next = jest.fn();

      hook(next, { oldState: 'NULL', newState: 'ON' });
      jest.advanceTimersByTime(120000);
      expect(next).not.toHaveBeenCalled();

      hook(next, { oldState: 'OFF', newState: 'ON' });
      jest.advanceTimersByTime(60000);
      expect(next).toHaveBeenCalled();
    });
  });
});
