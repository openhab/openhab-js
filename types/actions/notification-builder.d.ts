/**
 * Gets the <code>NotificationAction</code> from the {@link https://www.openhab.org/addons/integrations/openhabcloud/ openHAB Cloud Connector} add-on.
 *
 * If the openHAB Cloud Connector is not installed, a warning is logged and <code>null</code> is returned.
 *
 * @private
 * @return {*|null}
 */
export function _getNotificationAction(): any | null;
/**
 * Notification builder to create and send openHAB Cloud notifications.
 *
 * Do NOT use directly, use {@link actions.notificationBuilder} instead.
 */
declare class NotificationBuilder {
    /**
     * @hideconstructor
     * @param {string} message the body of the notification
     */
    constructor(message: string);
    /**
     * Sets the type of the notification to log notification.
     *
     * @return {NotificationBuilder}
     */
    logOnly(): NotificationBuilder;
    /**
     * Sets the user ID, which usually is the mail address of an openHAB Cloud user, to send the notification to.
     *
     * If no user ID is specified, a broadcast notification is sent.
     *
     * @param {string} emailAddress
     * @return {NotificationBuilder}
     */
    addUserId(emailAddress: string): NotificationBuilder;
    /**
     * Sets the icon for the notification.
     *
     * See {@link https://www.openhab.org/docs/configuration/items.html#icon-sources} for valid icon sources.
     * Please note that not all push notification clients support displaying icons.
     *
     * @param {string} icon
     * @return {NotificationBuilder}
     */
    withIcon(icon: string): NotificationBuilder;
    /**
     * Sets the severity for the notification.
     *
     * The severity text is shown by the push notification client if supported.
     *
     * @param {string} severity
     * @return {NotificationBuilder}
     */
    withSeverity(severity: string): NotificationBuilder;
    /**
     * Sets the title for the notification.
     *
     * @param {string} title
     * @return {NotificationBuilder}
     */
    withTitle(title: string): NotificationBuilder;
    /**
     * Sets the action to be performed when the user clicks on the notification.
     *
     * The on click action is not supported by log notifications.
     *
     * @param {string} action the action using the syntax as described in {@link https://www.openhab.org/addons/integrations/openhabcloud/#action-syntax openHAB Cloud Connector: Action Syntax}
     * @return {NotificationBuilder}
     */
    withOnClickAction(action: string): NotificationBuilder;
    /**
     * Sets the URL to a media attachment to be displayed with the notification.
     *
     * This URL must be reachable by the push notification client and the client needs to support media attachments.
     * Media attachments are not supported by log notifications.
     *
     * @param {string} mediaAttachmentUrl
     * @return {NotificationBuilder}
     */
    withMediaAttachmentUrl(mediaAttachmentUrl: string): NotificationBuilder;
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
    addActionButton(title: string, action: string): NotificationBuilder;
    /**
     * Sends the notification.
     *
     * In case the openHAB Cloud Connector is not installed, a warning is logged and the notification is not sent.
     */
    send(): void;
    #private;
}
export declare function notificationBuilder(message: string): NotificationBuilder;
export {};
//# sourceMappingURL=notification-builder.d.ts.map