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

jest.mock('../items', () => ({ Item: class {} }));

describe('triggers.js', () => {
  const moduleBuilderSpy = new ModuleBuilder();
  ModuleBuilder.createTrigger.mockImplementation(() => moduleBuilderSpy);

  it('use random UUID if no trigger name is specified.', () => {
    const uuid = 'random UUID';
    jest.spyOn(UUID, 'randomUUID').mockImplementation(() => uuid);
    ItemCommandTrigger('itemName', 'command');

    expect(UUID.randomUUID).toHaveBeenCalled();
    expect(moduleBuilderSpy.withId).toHaveBeenCalledWith(uuid);
  });

  describe('ItemCommandTrigger', () => {
    it('creates trigger.', () => {
      const itemName = 'itemName';
      const command = 'command';
      const triggerName = 'triggerName';
      ItemCommandTrigger(itemName, command, triggerName);

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
    it('creates trigger.', () => {
      const itemName = 'itemName';
      const previousState = 'previousState';
      const state = 'state';
      const triggerName = 'triggerName';
      ItemStateChangeTrigger(itemName, previousState, state, triggerName);

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
      ChannelEventTrigger(channelUID, event, triggerName);

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
    it('creates trigger.', () => {
      const itemName = 'itemName';
      const state = 'state';
      const triggerName = 'triggerName';
      ItemStateUpdateTrigger(itemName, state, triggerName);

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
    it('creates trigger.', () => {
      const groupName = 'groupName';
      const state = 'state';
      const previousState = 'previousState';
      const triggerName = 'triggerName';
      GroupStateChangeTrigger(groupName, previousState, state, triggerName);

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
    it('creates trigger.', () => {
      const groupName = 'groupName';
      const state = 'state';
      const triggerName = 'triggerName';
      GroupStateUpdateTrigger(groupName, state, triggerName);

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
    it('creates trigger.', () => {
      const groupName = 'groupName';
      const command = 'command';
      const triggerName = 'triggerName';
      GroupCommandTrigger(groupName, command, triggerName);

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
      ThingStatusUpdateTrigger(thingUID, status, triggerName);

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
      SystemStartlevelTrigger(startlevel, triggerName);

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
      ThingStatusChangeTrigger(thingUID, status, previousStatus, triggerName);

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
      GenericCronTrigger(cronExpression, triggerName);

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
      TimeOfDayTrigger(time, triggerName);

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
      DateTimeTrigger(itemName, timeOnly, triggerName);

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
      PWMTrigger(
        dutycycleItem,
        interval,
        minDutyCycle,
        maxDutyCycle,
        deadManSwitch,
        triggerName
      );

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
      PIDTrigger(
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
