const { UUID } = require('./java.mock');
const { JavaNotificationAction } = require('./openhab.mock');
const { _getNotificationAction, notificationBuilder } = require('../src/actions/notification-builder');

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

  describe('notificationBuilder', () => {
    const userId1 = 'userId1';
    const userId2 = 'userId2';
    const msg = 'message';
    const icon = 'icon';
    const tag = 'tag';
    const title = 'title';
    const referenceId = 'referenceId';
    const onClickAction = 'onClickAction';
    const mediaAttachmentUrl = 'mediaAttachmentUrl';
    const actionButton1 = { title: 'title1', action: 'action1', full: 'title1=action1' };
    const actionButton2 = { title: 'title2', action: 'action2', full: 'title2=action2' };
    const actionButton3 = { title: 'title3', action: 'action3', full: 'title3=action3' };

    jest.spyOn(JavaNotificationAction, 'sendBroadcastNotification');
    jest.spyOn(JavaNotificationAction, 'sendNotification');
    jest.spyOn(JavaNotificationAction, 'sendLogNotification');
    jest.spyOn(UUID, 'randomUUID').mockImplementation(() => referenceId);

    it('delegates to NotificationAction.sendBroadcastNotification and generates random referenceId if none provided', () => {
      // params: message, icon, tag, title, referenceId, onClickAction, mediaAttachmentUrl, actionButton1, actionButton2, actionButton3

      (notificationBuilder(msg).send());
      expect(JavaNotificationAction.sendBroadcastNotification).toHaveBeenCalledWith(msg, null, null, null, referenceId, null, null, null, null, null);
      JavaNotificationAction.sendBroadcastNotification.mockClear();

      notificationBuilder(msg).withIcon(icon).withTag(tag).withTitle(title).send();
      expect(JavaNotificationAction.sendBroadcastNotification).toHaveBeenCalledWith(msg, icon, tag, title, referenceId, null, null, null, null, null);
      JavaNotificationAction.sendBroadcastNotification.mockClear();

      notificationBuilder(msg).withIcon(icon).withTag(tag).withTitle(title)
        .withReferenceId(referenceId)
        .withOnClickAction(onClickAction)
        .withMediaAttachmentUrl(mediaAttachmentUrl)
        .addActionButton(actionButton1.title, actionButton1.action).addActionButton(actionButton2.title, actionButton2.action).addActionButton(actionButton3.title, actionButton3.action).send();
      expect(JavaNotificationAction.sendBroadcastNotification).toHaveBeenCalledWith(msg, icon, tag, title, referenceId, onClickAction, mediaAttachmentUrl, actionButton1.full, actionButton2.full, actionButton3.full);
      JavaNotificationAction.sendBroadcastNotification.mockClear();

      expect(JavaNotificationAction.sendLogNotification).toHaveBeenCalledTimes(0);
      expect(JavaNotificationAction.sendNotification).toHaveBeenCalledTimes(0);
    });

    it('delegates to NotificationAction.sendLogNotification.', () => {
      // parameters: message, icon, tag
      notificationBuilder(msg).logOnly().send();
      expect(JavaNotificationAction.sendLogNotification).toHaveBeenCalledWith(msg, null, null);
      JavaNotificationAction.sendLogNotification.mockClear();

      notificationBuilder(msg).logOnly().withIcon(icon).withTag(tag).withTitle(title).send();
      expect(JavaNotificationAction.sendLogNotification).toHaveBeenCalledWith(msg, icon, tag);
      JavaNotificationAction.sendLogNotification.mockClear();

      expect(JavaNotificationAction.sendBroadcastNotification).toHaveBeenCalledTimes(0);
      expect(JavaNotificationAction.sendNotification).toHaveBeenCalledTimes(0);
    });

    it('delegates to NotificationAction.sendNotification and generates random referenceId if none provided.', () => {
      // parameters: userId, message, icon, tag, title, referenceId, onClickAction, mediaAttachmentUrl, actionButton1, actionButton2, actionButton3

      notificationBuilder(msg).addUserId(userId1).addUserId(userId2).send();
      expect(JavaNotificationAction.sendNotification).toHaveBeenCalledWith(userId1, msg, null, null, null, referenceId, null, null, null, null, null);
      expect(JavaNotificationAction.sendNotification).toHaveBeenCalledWith(userId2, msg, null, null, null, referenceId, null, null, null, null, null);
      JavaNotificationAction.sendNotification.mockClear();

      notificationBuilder(msg).addUserId(userId1).addUserId(userId2).withIcon(icon).withTag(tag).withTitle(title).send();
      expect(JavaNotificationAction.sendNotification).toHaveBeenCalledWith(userId1, msg, icon, tag, title, referenceId, null, null, null, null, null);
      expect(JavaNotificationAction.sendNotification).toHaveBeenCalledWith(userId2, msg, icon, tag, title, referenceId, null, null, null, null, null);
      JavaNotificationAction.sendNotification.mockClear();

      notificationBuilder(msg).addUserId(userId1).addUserId(userId2).withIcon(icon).withTag(tag).withTitle(title)
        .withReferenceId(referenceId)
        .withOnClickAction(onClickAction)
        .withMediaAttachmentUrl(mediaAttachmentUrl)
        .addActionButton(actionButton1.title, actionButton1.action).addActionButton(actionButton2.title, actionButton2.action).addActionButton(actionButton3.title, actionButton3.action).send();
      expect(JavaNotificationAction.sendNotification).toHaveBeenCalledWith(userId1, msg, icon, tag, title, referenceId, onClickAction, mediaAttachmentUrl, actionButton1.full, actionButton2.full, actionButton3.full);
      expect(JavaNotificationAction.sendNotification).toHaveBeenCalledWith(userId2, msg, icon, tag, title, referenceId, onClickAction, mediaAttachmentUrl, actionButton1.full, actionButton2.full, actionButton3.full);
      JavaNotificationAction.sendNotification.mockClear();

      expect(JavaNotificationAction.sendBroadcastNotification).toHaveBeenCalledTimes(0);
      expect(JavaNotificationAction.sendLogNotification).toHaveBeenCalledTimes(0);
    });

    it('throws error if too many action buttons are added.', () => {
      const builder = notificationBuilder(msg).addActionButton(actionButton1).addActionButton(actionButton2).addActionButton(actionButton3);
      const action = () => builder.addActionButton(actionButton1);

      expect(action).toThrowError('Only 3 action buttons are supported.');
    });

    it('returns the referenceId of the notification or null if the notification is a log notification only.', () => {
      expect(notificationBuilder(msg).send()).toBe(referenceId);
      expect(notificationBuilder(msg).logOnly().send()).toBeNull();
    });
  });
});
