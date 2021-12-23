/**
 * Sends a command or update to an item
 *
 * @memberof OperationBuilder
 * @extends OperationConfig
 * @hideconstructor
 */
export class SendCommandOrUpdateOperation extends OperationConfig {
    constructor(operationBuilder: any, dataOrSupplier: any, isCommand: boolean, optionalDesc: any);
    isCommand: boolean;
    dataFn: any;
    dataDesc: any;
    /**
     * Send command to multiple items
     *
     * @param {*} itemsOrNames the items to send a command to
     * @returns {SendCommandOrUpdateOperation} this
     */
    toItems(itemsOrNames: any): SendCommandOrUpdateOperation;
    toItemNames: any;
    /**
     * Send command to an item
     *
     * @param {*} itemOrName the item to send a command to
     * @returns {SendCommandOrUpdateOperation} this
     */
    toItem(itemOrName: any): SendCommandOrUpdateOperation;
    /**
     * Send another command
     * @param {*} next
     * @returns {SendCommandOrUpdateOperation} this
     */
    and(next: any): SendCommandOrUpdateOperation;
    next: any;
    _run(args: any): void;
    _complete(): boolean;
    describe(compact: any): string;
}
/**
 * Timing Item state
 *
 * @memberof OperationBuilder
 * @extends OperationConfig
 * @hideconstructor
 */
export class TimingItemStateOperation extends OperationConfig {
    constructor(operationBuilder: any, item_changed_trigger_config: any, duration: any);
    item_changed_trigger_config: any;
    duration_ms: any;
    _complete: any;
    describe: () => string;
    _toOHTriggers(): any[];
    _executeHook(next: any): void;
    _start_wait(next: any): void;
    current_wait: number;
    _cancel_wait(): void;
}
/**
 * Toggles the state of an item
 *
 * @memberof OperationBuilder
 * @extends OperationConfig
 * @hideconstructor
 */
export class ToggleOperation extends OperationConfig {
    next: any;
    /**
     * @private
     * @param {*} itemName
     * @returns {ToggleOperation} this
     */
    private toItem;
    /**
     * @private
     * @param {*} next
     * @returns {ToggleOperation} this
     */
    private and;
    _run: () => any;
    _complete: () => boolean;
    describe: () => string;
    /**
    * Toggle the state of an item
    *
    * @returns {SendCommandOrUpdateOperation} this
    */
    doToggle(): SendCommandOrUpdateOperation;
}
/**
 * Copies state from one item to another item
 *
 * @memberof OperationBuilder
 * @extends OperationConfig
 * @hideconstructor
 */
export class CopyStateOperation extends OperationConfig {
    /**
     * Creates a new operation. Don't use constructor directly.
     *
     * @param {Boolean} send whether to send (or post update) the state
     * @hideconstructor
     */
    constructor(operationBuilder: any, send: boolean);
    send: boolean;
    /**
     * Sets the item to copy the state from
     *
     * @param {String} item_name the item to copy state from
     * @returns {CopyStateOperation} this
     */
    fromItem(item_name: string): CopyStateOperation;
    from_item: string;
    /**
     * Sets the item to copy the state to
     *
     * @param {String} item_name the item to copy state to
     * @returns {CopyStateOperation} this
     */
    toItem(item_name: string): CopyStateOperation;
    to_item: string;
    /**
     * Appends another operation to execute when the rule fires
     *
     * @returns {CopyStateOperation} this
     */
    and(): CopyStateOperation;
    next: OperationBuilder;
    /**
     * Runs the operation. Don't call directly.
     *
     * @private
     * @param {Object} args rule firing args
     */
    private _run;
    /**
     * Checks that the operation configuration is complete. Don't call directly.
     *
     * @private
     * @returns true only if the operation is ready to run
     */
    private _complete;
    /**
     * Describes the operation.
     *
     * @private
     * @returns a description of the operation
     */
    private describe;
}
/**
 * Operation to execute as part of a rule
 * @hideconstructor
 */
export class OperationBuilder {
    constructor(builder: any, fn: any);
    builder: any;
    fn: any;
    _finishErr(): void;
    _then(operation: any, group: any, name: any, description: any): void;
    /**
     * Build this rule
     *
     * @param {string} name of the rules
     * @param {string} description of the rule
     */
    build(name: string, description: string): void;
    /**
     * Specify the rule group for this rule
     *
     * @param {string} group the group this rule belongs to.
     * @returns {OperationBuilder} this
     */
    inGroup(group: string): OperationBuilder;
    group: string;
    /**
    * Specifies that a command should be sent as a result of this rule firing.
    *
    * @param {String} command the command to send
    * @returns {SendCommandOrUpdateOperation} the operation
    */
    send(c: any): SendCommandOrUpdateOperation;
    /**
     * Specifies that an update should be posted as a result of this rule firing.
     *
     * @param {String} update the update to send
     * @returns {SendCommandOrUpdateOperation} the operation
     */
    postUpdate(c: any): SendCommandOrUpdateOperation;
    /**
     * Specifies the a command 'ON' should be sent as a result of this rule firing.
     *
     * @returns {SendCommandOrUpdateOperation} the operation
     */
    sendOn(): SendCommandOrUpdateOperation;
    /**
     * Specifies the a command 'OFF' should be sent as a result of this rule firing.
     *
     * @returns {SendCommandOrUpdateOperation} the operation
     */
    sendOff(): SendCommandOrUpdateOperation;
    /**
     * Specifies a command should be sent to toggle the state of the target object
     * as a result of this rule firing.
     *
     * @returns {ToggleOperation} the operation
     */
    sendToggle(): ToggleOperation;
    /**
     * Specifies a command should be forwarded to the state of the target object
     * as a result of this rule firing. This relies on the trigger being the result
     * of a command itself.
     *
     * @returns {SendCommandOrUpdateOperation} the operation
     */
    sendIt(): SendCommandOrUpdateOperation;
    /**
     * Specifies a command state should be posted to the target object
     * as a result of this rule firing. This relies on the trigger being the result
     * of a command itself.
     *
     * @returns {SendCommandOrUpdateOperation} the operation
     */
    postIt(): SendCommandOrUpdateOperation;
    /**
     * Copies the state from one item to another. Can be used to proxy item state. State is updated, not
     * sent as a command.
     *
     * @returns {CopyStateOperation} the operation config
     */
    copyState(): CopyStateOperation;
    /**
     * Sends the state from one item to another. Can be used to proxy item state. State is
     * sent as a command.
     *
     * @returns {CopyStateOperation} the operation config
     */
    copyAndSendState(): CopyStateOperation;
}
/**
 * {RuleBuilder} RuleBuilder triggers
 * @memberof OperationBuilder
 */
declare class OperationConfig {
    constructor(operationBuilder: any);
    operationBuilder: any;
    /**
    * Specify the rule group for this rule
    *
    * @param {string} group the group this rule belongs to.
    * @returns {OperationBuilder} this
    */
    inGroup(group: string): OperationBuilder;
    group: string;
    /**
     * Build this rule
     *
     * @param {string} name of the rules
     * @param {string} description of the rule
     */
    build(name: string, description: string): void;
}
export {};
