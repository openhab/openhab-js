const { ModuleBuilder, Configuration, MetadataKey, Metadata, QuantityType, JavaScriptExecution, JavaTransformation, JavaNotificationAction, JavaPersistenceExtensions, JavaTimeSeries, JavaTypeParser } = require('./openhab.mock');
const { Class, String, IllegalStateException, BigDecimal, ArrayList, HashMap, HashSet, Hashtable, UUID, FrameworkUtil, LoggerFactory, Instant, ZonedDateTime } = require('./java.mock');

const TYPES = {
  'java.lang.Class': Class,
  'java.lang.String': String,
  'java.lang.IllegalStateException': IllegalStateException,
  'java.math.BigDecimal': BigDecimal,
  'java.time.Instant': Instant,
  'java.time.ZonedDateTime': ZonedDateTime,
  'java.util.ArrayList': ArrayList,
  'java.util.HashMap': HashMap,
  'java.util.HashSet': HashSet,
  'java.util.Hashtable': Hashtable,
  'java.util.UUID': UUID,
  'org.openhab.core.automation.util.ModuleBuilder': ModuleBuilder,
  'org.openhab.core.config.core.Configuration': Configuration,
  'org.openhab.core.items.Metadata': Metadata,
  'org.openhab.core.items.MetadataKey': MetadataKey,
  'org.openhab.core.library.types.QuantityType': QuantityType,
  'org.openhab.core.model.script.actions.ScriptExecution': JavaScriptExecution,
  'org.openhab.core.persistence.extensions.PersistenceExtensions': JavaPersistenceExtensions,
  'org.openhab.core.types.TimeSeries': JavaTimeSeries,
  'org.openhab.core.types.TypeParser': JavaTypeParser,
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
