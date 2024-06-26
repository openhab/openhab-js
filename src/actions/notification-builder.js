const log = require('../log')('notification-action-builder');

/**
 * If the {@link https://www.openhab.org/addons/integrations/openhabcloud/ openHAB Cloud Connector} add-on is installed, notifications can be sent to registered users/devices.
 *
 * @namespace actions.Notification
 */

/**
 * Gets the <code>NotificationAction</code> from the {@link https://www.openhab.org/addons/integrations/openhabcloud/ openHAB Cloud Connector} add-on.
 *
 * If the openHAB Cloud Connector is not installed, a warning is logged and <code>null</code> is returned.
 *
 * @private
 * @return {*|null}
 */
function _getNotificationAction () {
  try {
    return Java.type('org.openhab.io.openhabcloud.NotificationAction');
  } catch (e) {
    if (e.name === 'TypeError') {
      log.warn('NotificationAction is not available. Make sure you have installed the openHAB Cloud Connector.');
      return null;
    }
    throw e;
  }
}

class NotificationType {
  static BROADCAST = 'BROADCAST';
  static LOG = 'LOG';
  static STANDARD = 'STANDARD';
}

/**
 * Base notification builder to handle only {@link NotificationType.LOG} and provide a foundation for other notification types.
 *
 * Do NOT use directly, use {@link actions.Notification.logNotificationBuilder} instead.
 */
class BaseNotificationBuilder {
  type = NotificationType.BROADCAST;
  #message = null;
  #icon = null;
  #severity = null;

  /**
   * @hideconstructor
   * @param {string} type any valid {@link NotificationType}
   * @param {string} message the body of the notification
   */
  constructor (type, message) {
    if (type) {
      this.type = type;
    }
    this.#message = message;
  }

  get message () {
    return this.#message;
  }

  get icon () {
    return this.#icon;
  }

  get severity () {
    return this.#severity;
  }

  /**
   * Sets the icon for the notification.
   *
   * Uses the same syntax as the oh-icon component, see {@link https://next.openhab.org/docs/ui/components/oh-icon.html#icon oh-icon docs} for valid options.
   * Please note that not all push notification clients support displaying icons.
   *
   * @param {string} icon
   * @return {BaseNotificationBuilder}
   */
  withIcon (icon) {
    this.#icon = icon;
    return this;
  }

  /**
   * Sets the severity for the notification.
   *
   * The severity text is shown by the push notification client if supported.
   *
   * @param {string} severity
   * @return {BaseNotificationBuilder}
   */
  withSeverity (severity) {
    this.#severity = severity;
    return this;
  }

  /**
   * Sends the notification.
   *
   * In case the openHAB Cloud Connector is not installed, a warning is logged and the notification is not sent.
   */
  send () {
    switch (this.type) {
      case NotificationType.BROADCAST:
      case NotificationType.STANDARD:
        throw new Error('NotificationType BROADCAST and STANDARD should be handler by ExtendedNotificationBuilder.');
      case NotificationType.LOG:
        _getNotificationAction()?.sendLogNotification(this.#message, this.#icon, this.#severity);
        break;
      default:
        throw new Error(`Unknown NotificationType: ${this.type}`);
    }
  }
}

/**
 * Extends {@link BaseNotificationBuilder} and handles {@link NotificationType.BROADCAST} and {@link NotificationType.STANDARD} notification types.
 *
 * Do NOT use directly, use {@link actions.Notification.notificationBuilder} instead.
 *
 * @hideconstructor
 */
class ExtendedNotificationBuilder extends BaseNotificationBuilder {
  #userId = null;
  #onClickAction = null;
  #mediaAttachmentURL = null;
  #actionButton1 = null;
  #actionButton2 = null;
  #actionButton3 = null;

  /**
   * Sets the user ID, which usually is the mail address of an openHAB Cloud user, to send the notification to.
   *
   * If no user ID is specified, a broadcast notification is sent.
   *
   * @param {string} userId
   * @return {BaseNotificationBuilder}
   */
  withUserId (userId) {
    this.#userId = userId;
    this.type = NotificationType.STANDARD;
    return this;
  }

  withOnClickAction (onClickAction) {
    this.#onClickAction = onClickAction;
    return this;
  }

  /**
   * Sets the URL to a media attachment to be displayed with the notification.
   *
   * This URL must be reachable by the push notification client and the client needs to support media attachments.
   *
   * @param {string} mediaAttachmentURL
   * @return {ExtendedNotificationBuilder}
   */
  withMediaAttachmentURL (mediaAttachmentURL) {
    this.#mediaAttachmentURL = mediaAttachmentURL;
    return this;
  }

  withActionButton1 (actionButton1) {
    this.#actionButton1 = actionButton1;
    return this;
  }

  withActionButton2 (actionButton2) {
    this.#actionButton2 = actionButton2;
    return this;
  }

  withActionButton3 (actionButton3) {
    this.#actionButton3 = actionButton3;
    return this;
  }

  /**
   * Sends the notification.
   *
   * In case the openHAB Cloud Connector is not installed, a warning is logged and the notification is not sent.
   */
  send () {
    switch (this.type) {
      case NotificationType.BROADCAST:
        _getNotificationAction()?.sendBroadcastNotification(this.message, this.icon, this.severity, this.#onClickAction, this.#mediaAttachmentURL, this.#actionButton1, this.#actionButton2, this.#actionButton3);
        break;
      case NotificationType.STANDARD:
        _getNotificationAction()?.sendNotification(this.#userId, this.message, this.icon, this.severity, this.#onClickAction, this.#mediaAttachmentURL, this.#actionButton1, this.#actionButton2, this.#actionButton3);
        break;
      case NotificationType.LOG:
        throw new Error('NotificationType LOG is not supported by ExtendedNotificationBuilder.');
      default:
        throw new Error(`Unknown NotificationType: ${this.type}`);
    }
  }
}

module.exports = {
  _getNotificationAction,
  /**
   * Creates a new log notification builder.
   *
   * Log notifications do not trigger a notification on push notification clients and only visible in the notification log.
   *
   * @example
   * // Send a simple log notification
   * actions.Notification.logNotificationBuilder('Hello World!').send();
   * // Send a log notification with icon and severity
   * actions.Notification.logNotificationBuilder('Hello World!').withIcon('f7:bell_fill').withSeverity('important').send();
   *
   * @memberof actions.Notification
   * @param {string} message the body of the notification
   * @return {BaseNotificationBuilder}
   */
  logNotificationBuilder: (message) => new BaseNotificationBuilder(NotificationType.LOG, message),
  /**
   * Creates a new notification builder for broadcast and standard notifications.
   *
   * Broadcast notifications are sent to all openHAB Cloud users, whereas standard notifications are sent to a single openHAB Cloud user specified by his ID.
   * These notifications trigger a notification on push notification clients and are also visible in the notification log.
   *
   * @example
   * // Send a simple broadcast notification
   * actions.Notification.notificationBuilder('Hello World!').send();
   * // Send a broadcast notification with icon and severity
   * actions.Notification.notificationBuilder('Hello World!').withIcon('f7:bell_fill').withSeverity('important').send();
   * // Send a standard notification to a specific user
   * actions.Notification.notificationBuilder('Hello World!').withUserId('florian@example.com').send();
   * // Send a standard notification with icon and severity to a specific user
   * actions.Notification.notificationBuilder('Hello World!').withUserId('florian@example.com').withIcon('f7:bell_fill').withSeverity('important').send();
   *
   * @memberof actions.Notification
   * @param {string} message the body of the notification
   * @return {ExtendedNotificationBuilder}
   */
  notificationBuilder: (message) => new ExtendedNotificationBuilder(null, message)
};
