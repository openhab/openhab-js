const { JavaNotificationAction } = require('./openhab.mock');
const { _getNotificationAction, logNotificationBuilder, notificationBuilder } = require('../src/actions/notification-builder');

describe('notification-builder.js', () => {
  describe('_getNotificationAction', () => {
    it('returns the NotificationAction.', () => {
      jest.spyOn(Java, 'type');

      expect(_getNotificationAction()).toBe(JavaNotificationAction);
      expect(Java.type).toHaveBeenCalledWith('org.openhab.io.openhabcloud.NotificationAction');
    });

    it('returns null if NotificationAction is not available.', () => {
      jest.spyOn(Java, 'type').mockImplementationOnce(() => {
        throw new TypeError();
      });

      expect(_getNotificationAction()).toBeNull();
    });

    it('rethrows error if NotificationAction is not available and error is not a TypeError.', () => {
      jest.spyOn(Java, 'type').mockImplementationOnce(() => {
        throw new Error();
      });

      expect(_getNotificationAction).toThrowError();
    });
  });

  describe('logNotificationBuilder', () => {
    const msg = 'message';
    const icon = 'icon';
    const severity = 'severity';

    it('delegates to NotificationAction.sendLogNotification.', () => {
      jest.spyOn(JavaNotificationAction, 'sendLogNotification');

      logNotificationBuilder(msg).send();
      expect(JavaNotificationAction.sendLogNotification).toHaveBeenCalledWith(msg, null, null);

      logNotificationBuilder(msg).withIcon(icon).withSeverity(severity).send();
      expect(JavaNotificationAction.sendLogNotification).toHaveBeenCalledWith(msg, icon, severity);
    });
  });

  describe('notificationBuilder', () => {
    const userId = 'usedId';
    const msg = 'message';
    const icon = 'icon';
    const severity = 'severity';
    const onClickAction = 'onClickAction';
    const mediaAttachmentUrl = 'mediaAttachmentUrl';
    const actionButton1 = 'actionButton1';
    const actionButton2 = 'actionButton2';
    const actionButton3 = 'actionButton3';

    it('delegates to NotoficiationAction.sendBroadcastNotification.', () => {
      jest.spyOn(JavaNotificationAction, 'sendBroadcastNotification');

      notificationBuilder(msg).send();
      expect(JavaNotificationAction.sendBroadcastNotification).toHaveBeenCalledWith(msg, null, null, null, null, null, null, null);

      notificationBuilder(msg).withIcon(icon).withSeverity(severity).send();
      expect(JavaNotificationAction.sendBroadcastNotification).toHaveBeenCalledWith(msg, icon, severity, null, null, null, null, null);

      notificationBuilder(msg).withIcon(icon).withSeverity(severity)
        .withOnClickAction(onClickAction)
        .withMediaAttachmentUrl(mediaAttachmentUrl)
        .withActionButton1(actionButton1).withActionButton2(actionButton2).withActionButton3(actionButton3).send();
      expect(JavaNotificationAction.sendBroadcastNotification).toHaveBeenCalledWith(msg, icon, severity, onClickAction, mediaAttachmentUrl, actionButton1, actionButton2, actionButton3);
    });

    it('delegates to NotificationAction.sendNotification.', () => {
      jest.spyOn(JavaNotificationAction, 'sendNotification');

      notificationBuilder(msg).withUserId(userId).send();
      expect(JavaNotificationAction.sendNotification).toHaveBeenCalledWith(userId, msg, null, null, null, null, null, null, null);

      notificationBuilder(msg).withUserId(userId).withIcon(icon).withSeverity(severity).send();
      expect(JavaNotificationAction.sendNotification).toHaveBeenCalledWith(userId, msg, icon, severity, null, null, null, null, null);

      notificationBuilder(msg).withUserId(userId).withIcon(icon).withSeverity(severity)
        .withOnClickAction(onClickAction)
        .withMediaAttachmentUrl(mediaAttachmentUrl)
        .withActionButton1(actionButton1).withActionButton2(actionButton2).withActionButton3(actionButton3).send();
      expect(JavaNotificationAction.sendNotification).toHaveBeenCalledWith(userId, msg, icon, severity, onClickAction, mediaAttachmentUrl, actionButton1, actionButton2, actionButton3);
    });
  });
});
