const log = require('../log')('notification-action-builder');

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
 * Notification builder to create and send openHAB Cloud notifications.
 *
 * Do NOT use directly, use {@link actions.notificationBuilder} instead.
 */
class NotificationBuilder {
  #type = NotificationType.BROADCAST;
  #userIds = [];
  #message = null;
  #icon = null;
  #severity = null;
  #title = null;
  #onClickAction = null;
  #mediaAttachmentUrl = null;
  #actionButtons = [];

  /**
   * @hideconstructor
   * @param {string} message the body of the notification
   */
  constructor (message) {
    this.#message = message;
  }

  /**
   * Sets the type of the notification to log notification.
   *
   * @return {NotificationBuilder}
   */
  logOnly () {
    this.#type = NotificationType.LOG;
    return this;
  }

  /**
   * Sets the user ID, which usually is the mail address of an openHAB Cloud user, to send the notification to.
   *
   * If no user ID is specified, a broadcast notification is sent.
   *
   * @param {string} emailAddress
   * @return {NotificationBuilder}
   */
  addUserId (emailAddress) {
    this.#userIds.push(emailAddress);
    this.#type = NotificationType.STANDARD;
    return this;
  }

  /**
   * Sets the icon for the notification.
   *
   * See {@link https://www.openhab.org/docs/configuration/items.html#icon-sources} for valid icon sources.
   * Please note that not all push notification clients support displaying icons.
   *
   * @param {string} icon
   * @return {NotificationBuilder}
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
   * @return {NotificationBuilder}
   */
  withSeverity (severity) {
    this.#severity = severity;
    return this;
  }

  /**
   * Sets the title for the notification.
   *
   * @param {string} title
   * @return {NotificationBuilder}
   */
  withTitle (title) {
    this.#title = title;
    return this;
  }

  /**
   * Sets the action to be performed when the user clicks on the notification.
   *
   * The on click action is not supported by log notifications.
   *
   * @param {string} action the action using the syntax as described in {@link https://www.openhab.org/addons/integrations/openhabcloud/#action-syntax openHAB Cloud Connector: Action Syntax}
   * @return {NotificationBuilder}
   */
  withOnClickAction (action) {
    this.#onClickAction = action;
    return this;
  }

  /**
   * Sets the URL to a media attachment to be displayed with the notification.
   *
   * This URL must be reachable by the push notification client and the client needs to support media attachments.
   * Media attachments are not supported by log notifications.
   *
   * @param {string} mediaAttachmentUrl
   * @return {NotificationBuilder}
   */
  withMediaAttachmentUrl (mediaAttachmentUrl) {
    this.#mediaAttachmentUrl = mediaAttachmentUrl;
    return this;
  }

  /**
   * Adds an action button to the notification.
   *
   * Please note that due to limitations in Android and iOS only three action buttons are supported.
   * Action buttons are obviously not supported by log notifications.
   *
   * @param {string} title the title of the action button
   * @param {string} action the action using the syntax as described in {@link https://www.openhab.org/addons/integrations/openhabcloud/#action-syntax openHAB Cloud Connector: Action Syntax}
   * @return {NotificationBuilder}
   */
  addActionButton (title, action) {
    if (this.#actionButtons.length >= 3) {
      throw new Error('Only 3 action buttons are supported.');
    }
    this.#actionButtons.push(`${title}=${action}`);
    return this;
  }

  /**
   * Sends the notification.
   *
   * In case the openHAB Cloud Connector is not installed, a warning is logged and the notification is not sent.
   */
  send () {
    while (this.#actionButtons.length < 3) {
      this.#actionButtons.push(null);
    }
    switch (this.#type) {
      case NotificationType.BROADCAST:
        // parameters: message, icon, severity, title, onClickAction, mediaAttachmentUrl, actionButton1, actionButton2, actionButton3
        _getNotificationAction()?.sendBroadcastNotification(this.#message, this.#icon, this.#severity, this.#title, this.#onClickAction, this.#mediaAttachmentUrl, ...this.#actionButtons);
        break;
      case NotificationType.LOG:
        // parameters: message, icon, severity
        _getNotificationAction()?.sendLogNotification(this.#message, this.#icon, this.#severity);
        break;
      case NotificationType.STANDARD:
        this.#userIds.forEach((userId) => {
          // parameters: userId, message, icon, severity, title, onClickAction, mediaAttachmentUrl, actionButton1, actionButton2, actionButton3
          _getNotificationAction()?.sendNotification(userId, this.#message, this.#icon, this.#severity, this.#title, this.#onClickAction, this.#mediaAttachmentUrl, ...this.#actionButtons);
        });
        break;
      default:
        throw new Error(`Unknown NotificationType: ${this.type}`);
    }
  }
}

module.exports = {
  _getNotificationAction,
  /**
   * Creates a new notification builder for openHAB Cloud notifications, which are sent as push notifications to registered devices.
   *
   * This requires the {@link https://www.openhab.org/addons/integrations/openhabcloud/ openHAB Cloud Connector} add-on to be installed.
   *
   * There are three types of notifications:
   *
   * Broadcast notifications, which are sent to all openHAB Cloud users,
   * standard notifications, which are sent to a openHAB Cloud users specified by their email addresses,
   * and log notifications, which are only sent to the notification log and not shown as a push notification.
   *
   * @memberof actions
   * @param {string} message the body of the notification
   * @return {NotificationBuilder}
   */
  notificationBuilder: (message) => new NotificationBuilder(message)
};
