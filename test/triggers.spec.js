const { UUID } = require('./java.mock');
const { ModuleBuilder } = require('./openhab.mock');
const {
  ItemCommandTrigger,
  ItemStateChangeTrigger,
  ChannelEventTrigger,
  ItemStateUpdateTrigger,
  GroupStateChangeTrigger,
  GroupStateUpdateTrigger,
  GroupCommandTrigger,
  ThingStatusUpdateTrigger,
  ThingStatusChangeTrigger,
  SystemStartlevelTrigger,
  GenericCronTrigger,
  TimeOfDayTrigger,
  DateTimeTrigger,
  PWMTrigger,
  PIDTrigger
} = require('../triggers');

jest.mock('../items', () => ({
  Item: class {
    constructor (name) {
      this.name = name;
    }
  }
}));
const Item = require('../items').Item;

describe('triggers.js', () => {
  const moduleBuilderSpy = new ModuleBuilder();
  moduleBuilderSpy.build.mockImplementation(() => new Object()); // eslint-disable-line no-new-object
  ModuleBuilder.createTrigger.mockImplementation(() => moduleBuilderSpy);

  it('use random UUID if no trigger name is specified.', () => {
    const uuid = 'random UUID';
    jest.spyOn(UUID, 'randomUUID').mockImplementation(() => uuid);
    ItemCommandTrigger('itemName', 'command');

    expect(UUID.randomUUID).toHaveBeenCalled();
    expect(moduleBuilderSpy.withId).toHaveBeenCalledWith(uuid);
  });

  describe('ItemCommandTrigger', () => {
    const itemName = 'itemName';
    const command = 'command';
    const triggerName = 'triggerName';
    const item = new Item(itemName);

    it.each([[itemName], [item]])('creates trigger from %s.', (itemOrName) => {
      const trigger = ItemCommandTrigger(itemOrName, command, triggerName);

      expect(trigger).not.toBe(undefined);
      expect(moduleBuilderSpy.withTypeUID).toHaveBeenCalledWith(
        'core.ItemCommandTrigger'
      );
      expect(moduleBuilderSpy.withId).toHaveBeenCalledWith(triggerName);
      expect(moduleBuilderSpy.withConfiguration).toHaveBeenCalledWith(
        expect.objectContaining({
          config: { itemName, command }
        })
      );
    });
  });

  describe('ItemStateChangeTrigger', () => {
    const itemName = 'itemName';
    const previousState = 'previousState';
    const state = 'state';
    const triggerName = 'triggerName';
    const item = new Item(itemName);

    it.each([[itemName], [item]])('creates trigger from %s.', (itemOrName) => {
      const trigger = ItemStateChangeTrigger(itemOrName, previousState, state, triggerName);

      expect(trigger).not.toBe(undefined);
      expect(moduleBuilderSpy.withTypeUID).toHaveBeenCalledWith(
        'core.ItemStateChangeTrigger'
      );
      expect(moduleBuilderSpy.withId).toHaveBeenCalledWith(triggerName);
      expect(moduleBuilderSpy.withConfiguration).toHaveBeenCalledWith(
        expect.objectContaining({
          config: { itemName, previousState, state }
        })
      );
    });
  });

  describe('ChannelEventTrigger', () => {
    it('creates trigger.', () => {
      const channelUID = 'channelUID';
      const event = 'event';
      const triggerName = 'triggerName';
      const trigger = ChannelEventTrigger(channelUID, event, triggerName);

      expect(trigger).not.toBe(undefined);
      expect(moduleBuilderSpy.withTypeUID).toHaveBeenCalledWith(
        'core.ChannelEventTrigger'
      );
      expect(moduleBuilderSpy.withId).toHaveBeenCalledWith(triggerName);
      expect(moduleBuilderSpy.withConfiguration).toHaveBeenCalledWith(
        expect.objectContaining({
          config: { channelUID, event }
        })
      );
    });
  });

  describe('ItemStateUpdateTrigger', () => {
    const itemName = 'itemName';
    const state = 'state';
    const triggerName = 'triggerName';
    const item = new Item(itemName);

    it.each([[itemName], [item]])('creates trigger from %s.', (itemOrName) => {
      const trigger = ItemStateUpdateTrigger(itemOrName, state, triggerName);

      expect(trigger).not.toBe(undefined);
      expect(moduleBuilderSpy.withTypeUID).toHaveBeenCalledWith(
        'core.ItemStateUpdateTrigger'
      );
      expect(moduleBuilderSpy.withId).toHaveBeenCalledWith(triggerName);
      expect(moduleBuilderSpy.withConfiguration).toHaveBeenCalledWith(
        expect.objectContaining({
          config: { itemName, state }
        })
      );
    });
  });

  describe('GroupStateChangeTrigger', () => {
    const groupName = 'groupName';
    const state = 'state';
    const previousState = 'previousState';
    const triggerName = 'triggerName';
    const group = new Item(groupName);

    it.each([[groupName], [group]])('creates trigger from %s.', (groupOrName) => {
      const trigger = GroupStateChangeTrigger(groupOrName, previousState, state, triggerName);

      expect(trigger).not.toBe(undefined);
      expect(moduleBuilderSpy.withTypeUID).toHaveBeenCalledWith(
        'core.GroupStateChangeTrigger'
      );
      expect(moduleBuilderSpy.withId).toHaveBeenCalledWith(triggerName);
      expect(moduleBuilderSpy.withConfiguration).toHaveBeenCalledWith(
        expect.objectContaining({
          config: { groupName, state, previousState }
        })
      );
    });
  });

  describe('GroupStateUpdateTrigger', () => {
    const groupName = 'groupName';
    const state = 'state';
    const triggerName = 'triggerName';
    const group = new Item(groupName);

    it.each([[groupName], [group]])('creates trigger from %s.', (groupOrName) => {
      const trigger = GroupStateUpdateTrigger(groupOrName, state, triggerName);

      expect(trigger).not.toBe(undefined);
      expect(moduleBuilderSpy.withTypeUID).toHaveBeenCalledWith(
        'core.GroupStateUpdateTrigger'
      );
      expect(moduleBuilderSpy.withId).toHaveBeenCalledWith(triggerName);
      expect(moduleBuilderSpy.withConfiguration).toHaveBeenCalledWith(
        expect.objectContaining({
          config: { groupName, state }
        })
      );
    });
  });

  describe('GroupCommandTrigger', () => {
    const groupName = 'groupName';
    const command = 'command';
    const triggerName = 'triggerName';
    const group = new Item(groupName);

    it.each([[groupName], [group]])('creates trigger from %s.', (groupOrName) => {
      const trigger = GroupCommandTrigger(groupOrName, command, triggerName);

      expect(trigger).not.toBe(undefined);
      expect(moduleBuilderSpy.withTypeUID).toHaveBeenCalledWith(
        'core.GroupCommandTrigger'
      );
      expect(moduleBuilderSpy.withId).toHaveBeenCalledWith(triggerName);
      expect(moduleBuilderSpy.withConfiguration).toHaveBeenCalledWith(
        expect.objectContaining({
          config: { groupName, command }
        })
      );
    });
  });

  describe('ThingStatusUpdateTrigger', () => {
    it('creates trigger.', () => {
      const thingUID = 'thingUID';
      const status = 'status';
      const triggerName = 'triggerName';
      const trigger = ThingStatusUpdateTrigger(thingUID, status, triggerName);

      expect(trigger).not.toBe(undefined);
      expect(moduleBuilderSpy.withTypeUID).toHaveBeenCalledWith(
        'core.ThingStatusUpdateTrigger'
      );
      expect(moduleBuilderSpy.withId).toHaveBeenCalledWith(triggerName);
      expect(moduleBuilderSpy.withConfiguration).toHaveBeenCalledWith(
        expect.objectContaining({
          config: { thingUID, status }
        })
      );
    });
  });

  describe('SystemStartlevelTrigger', () => {
    it('creates trigger.', () => {
      const startlevel = 'startlevel';
      const triggerName = 'triggerName';
      const trigger = SystemStartlevelTrigger(startlevel, triggerName);

      expect(trigger).not.toBe(undefined);
      expect(moduleBuilderSpy.withTypeUID).toHaveBeenCalledWith(
        'core.SystemStartlevelTrigger'
      );
      expect(moduleBuilderSpy.withId).toHaveBeenCalledWith(triggerName);
      expect(moduleBuilderSpy.withConfiguration).toHaveBeenCalledWith(
        expect.objectContaining({
          config: { startlevel }
        })
      );
    });
  });

  describe('ThingStatusChangeTrigger', () => {
    it('creates trigger.', () => {
      const thingUID = 'thingUID';
      const status = 'status';
      const previousStatus = 'previousStatus';
      const triggerName = 'triggerName';
      const trigger = ThingStatusChangeTrigger(thingUID, status, previousStatus, triggerName);

      expect(trigger).not.toBe(undefined);
      expect(moduleBuilderSpy.withTypeUID).toHaveBeenCalledWith(
        'core.ThingStatusChangeTrigger'
      );
      expect(moduleBuilderSpy.withId).toHaveBeenCalledWith(triggerName);
      expect(moduleBuilderSpy.withConfiguration).toHaveBeenCalledWith(
        expect.objectContaining({
          config: { thingUID, status, previousStatus }
        })
      );
    });
  });

  describe('GenericCronTrigger', () => {
    it('creates trigger.', () => {
      const cronExpression = 'cronExpression';
      const triggerName = 'triggerName';
      const trigger = GenericCronTrigger(cronExpression, triggerName);

      expect(trigger).not.toBe(undefined);
      expect(moduleBuilderSpy.withTypeUID).toHaveBeenCalledWith(
        'timer.GenericCronTrigger'
      );
      expect(moduleBuilderSpy.withId).toHaveBeenCalledWith(triggerName);
      expect(moduleBuilderSpy.withConfiguration).toHaveBeenCalledWith(
        expect.objectContaining({
          config: { cronExpression }
        })
      );
    });
  });

  describe('TimeOfDayTrigger', () => {
    it('creates trigger.', () => {
      const time = 'time';
      const triggerName = 'triggerName';
      const trigger = TimeOfDayTrigger(time, triggerName);

      expect(trigger).not.toBe(undefined);
      expect(moduleBuilderSpy.withTypeUID).toHaveBeenCalledWith(
        'timer.TimeOfDayTrigger'
      );
      expect(moduleBuilderSpy.withId).toHaveBeenCalledWith(triggerName);
      expect(moduleBuilderSpy.withConfiguration).toHaveBeenCalledWith(
        expect.objectContaining({
          config: { time }
        })
      );
    });
  });

  describe('DateTimeTrigger', () => {
    it('creates trigger.', () => {
      const itemName = 'itemName';
      const timeOnly = true;
      const triggerName = 'triggerName';
      const trigger = DateTimeTrigger(itemName, timeOnly, triggerName);

      expect(trigger).not.toBe(undefined);
      expect(moduleBuilderSpy.withTypeUID).toHaveBeenCalledWith(
        'timer.DateTimeTrigger'
      );
      expect(moduleBuilderSpy.withId).toHaveBeenCalledWith(triggerName);
      expect(moduleBuilderSpy.withConfiguration).toHaveBeenCalledWith(
        expect.objectContaining({
          config: { itemName, timeOnly }
        })
      );
    });
  });

  describe('PWMTrigger', () => {
    it('creates trigger.', () => {
      const dutycycleItem = 'dutycycleItem';
      const interval = 'interval';
      const minDutyCycle = 'minDutyCycle';
      const maxDutyCycle = 'maxDutyCycle';
      const deadManSwitch = 'deadManSwitch';
      const triggerName = 'triggerName';
      const trigger = PWMTrigger(
        dutycycleItem,
        interval,
        minDutyCycle,
        maxDutyCycle,
        deadManSwitch,
        triggerName
      );

      expect(trigger).not.toBe(undefined);
      expect(moduleBuilderSpy.withTypeUID).toHaveBeenCalledWith('pwm.trigger');
      expect(moduleBuilderSpy.withId).toHaveBeenCalledWith(triggerName);
      expect(moduleBuilderSpy.withConfiguration).toHaveBeenCalledWith(
        expect.objectContaining({
          config: {
            dutycycleItem,
            interval,
            minDutyCycle,
            maxDutyCycle,
            deadManSwitch
          }
        })
      );
    });
  });

  describe('PIDTrigger', () => {
    it('creates trigger.', () => {
      const input = 'input';
      const setpoint = 'setpoint';
      const kp = 'kp';
      const ki = 'ki';
      const kd = 'kd';
      const kdTimeConstant = 'kdTimeConstant';
      const loopTime = 'loopTime';
      const commandItem = 'commandItem';
      const integralMinValue = 'integralMinValue';
      const integralMaxValue = 'integralMaxValue';
      const pInspector = 'pInspector';
      const iInspector = 'iInspector';
      const dInspector = 'dInspector';
      const eInspector = 'eInspector';
      const triggerName = 'triggerName';
      const trigger = PIDTrigger(
        input,
        setpoint,
        kp,
        ki,
        kd,
        kdTimeConstant,
        loopTime,
        commandItem,
        integralMinValue,
        integralMaxValue,
        pInspector,
        iInspector,
        dInspector,
        eInspector,
        triggerName
      );

      expect(trigger).not.toBe(undefined);
      expect(moduleBuilderSpy.withTypeUID).toHaveBeenCalledWith(
        'pidcontroller.trigger'
      );
      expect(moduleBuilderSpy.withId).toHaveBeenCalledWith(triggerName);
      expect(moduleBuilderSpy.withConfiguration).toHaveBeenCalledWith(
        expect.objectContaining({
          config: {
            input,
            setpoint,
            kp,
            ki,
            kd,
            kdTimeConstant,
            loopTime,
            commandItem,
            integralMinValue,
            integralMaxValue,
            pInspector,
            iInspector,
            dInspector,
            eInspector
          }
        })
      );
    });
  });
});
