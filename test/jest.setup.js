const { ModuleBuilder, Configuration, QuantityType, JavaScriptExecution, JavaTransformation, JavaNotificationAction } = require('./openhab.mock');
const { Class, BigDecimal, ArrayList, HashSet, Hashtable, UUID, FrameworkUtil, LoggerFactory, ZonedDateTime } = require('./java.mock');

const TYPES = {
  'java.lang.Class': Class,
  'java.math.BigDecimal': BigDecimal,
  'java.time.ZonedDateTime': ZonedDateTime,
  'java.util.ArrayList': ArrayList,
  'java.util.HashSet': HashSet,
  'java.util.Hashtable': Hashtable,
  'java.util.UUID': UUID,
  'org.openhab.core.automation.util.ModuleBuilder': ModuleBuilder,
  'org.openhab.core.config.core.Configuration': Configuration,
  'org.openhab.core.library.types.QuantityType': QuantityType,
  'org.openhab.core.model.script.actions.ScriptExecution': JavaScriptExecution,
  'org.openhab.core.transform.actions.Transformation': JavaTransformation,
  'org.openhab.io.openhabcloud.NotificationAction': JavaNotificationAction,
  'org.osgi.framework.FrameworkUtil': FrameworkUtil,
  'org.slf4j.LoggerFactory': LoggerFactory
};

/* eslint-disable-next-line no-global-assign */
Java = {
  type: (type) => TYPES[type],
  typeName: jest.fn(),
  from: jest.fn(),
  isType: jest.fn(),
  isJavaObject: jest.fn()
};
