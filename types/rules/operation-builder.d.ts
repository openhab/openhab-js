/**
 * Sends a command or update to an item
 *
 * @memberof OperationBuilder
 * @extends OperationBuilder.OperationConfig
 * @hideconstructor
 */
export class SendCommandOrUpdateOperation {
    constructor(operationBuilder: any, dataOrSupplier: any, isCommand: boolean, optionalDesc: any);
    isCommand: boolean;
    dataFn: any;
    dataDesc: any;
    /**
       * Send command to multiple items
       *
       * @param {items.Item[]|String[]} itemsOrNames the items to send a command to
       * @returns {OperationBuilder.SendCommandOrUpdateOperation} this
       */
    toItems(itemsOrNames: items.Item[] | string[]): OperationBuilder.SendCommandOrUpdateOperation;
    toItemNames: any[];
    /**
       * Send command to an item
       *
       * @param {items.Item|String} itemOrName the item to send a command to
       * @returns {OperationBuilder.SendCommandOrUpdateOperation} this
       */
    toItem(itemOrName: items.Item | string): OperationBuilder.SendCommandOrUpdateOperation;
    /**
       * Send another command
       * @param {*} next
       * @returns {OperationBuilder.SendCommandOrUpdateOperation} this
       */
    and(next: any): OperationBuilder.SendCommandOrUpdateOperation;
    next: any;
    _run(args: any): void;
    _complete(): boolean;
    describe(compact: any): string;
}
/**
 * Timing Item state
 *
 * @memberof OperationBuilder
 * @extends OperationBuilder.OperationConfig
 * @hideconstructor
 */
export class TimingItemStateOperation {
    constructor(operationBuilder: any, itemChangedTriggerConfig: any, duration: any);
    item_changed_trigger_config: any;
    duration_ms: any;
    _complete: any;
    describe: () => string;
    _toOHTriggers(): any[];
    _executeHook(next: any): void;
    _startWait(next: any): void;
    current_wait: NodeJS.Timeout;
    _cancelWait(): void;
}
/**
 * Toggles the state of an item
 *
 * @memberof OperationBuilder
 * @extends OperationBuilder.OperationConfig
 * @hideconstructor
 */
export class ToggleOperation {
    constructor(operationBuilder: any);
    next: any;
    /** @type {function} */
    toItem: Function;
    /** @type {function} */
    and: Function;
    _run: () => any;
    _complete: () => boolean;
    describe: () => string;
    /**
       * Toggle the state of an item
       *
       * @returns {OperationBuilder.SendCommandOrUpdateOperation} this
       */
    doToggle(): OperationBuilder.SendCommandOrUpdateOperation;
}
/**
 * Copies state from one item to another item
 *
 * @memberof OperationBuilder
 * @extends OperationBuilder.OperationConfig
 * @hideconstructor
 */
export class CopyStateOperation {
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
       * @param {String} itemName the item to copy state from
       * @returns {OperationBuilder.CopyStateOperation} this
       */
    fromItem(itemName: string): OperationBuilder.CopyStateOperation;
    from_item: string;
    /**
       * Sets the item to copy the state to
       *
       * @param {String} itemName the item to copy state to
       * @returns {OperationBuilder.CopyStateOperation} this
       */
    toItem(itemName: string): OperationBuilder.CopyStateOperation;
    to_item: string;
    /**
       * Appends another operation to execute when the rule fires
       * @returns {OperationBuilder.CopyStateOperation} this
       */
    and(): OperationBuilder.CopyStateOperation;
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
    _then(operation: any, group: any, name: any, description: any, tags: any, id: any): void;
    /**
       * Build this rule
       *
       * @param {string} [name] of the rule
       * @param {string} [description] of the rule
       * @param {Array<String>} [tags] of the rule
       * @param {string} [id] of the rule
       */
    build(name?: string, description?: string, tags?: Array<string>, id?: string): void;
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
      * @returns {OperationBuilder.SendCommandOrUpdateOperation} the operation
      */
    send(c: any): OperationBuilder.SendCommandOrUpdateOperation;
    /**
       * Specifies that an update should be posted as a result of this rule firing.
       *
       * @param {String} update the update to send
       * @returns {OperationBuilder.SendCommandOrUpdateOperation} the operation
       */
    postUpdate(c: any): OperationBuilder.SendCommandOrUpdateOperation;
    /**
       * Specifies the a command 'ON' should be sent as a result of this rule firing.
       *
       * @returns {OperationBuilder.SendCommandOrUpdateOperation} the operation
       */
    sendOn(): OperationBuilder.SendCommandOrUpdateOperation;
    /**
       * Specifies the a command 'OFF' should be sent as a result of this rule firing.
       *
       * @returns {OperationBuilder.SendCommandOrUpdateOperation} the operation
       */
    sendOff(): OperationBuilder.SendCommandOrUpdateOperation;
    /**
       * Specifies a command should be sent to toggle the state of the target object
       * as a result of this rule firing.
       *
       * @returns {OperationBuilder.ToggleOperation} the operation
       */
    sendToggle(): OperationBuilder.ToggleOperation;
    /**
       * Specifies a command should be forwarded to the state of the target object
       * as a result of this rule firing. This relies on the trigger being the result
       * of a command itself.
       *
       * @returns {OperationBuilder.SendCommandOrUpdateOperation} the operation
       */
    sendIt(): OperationBuilder.SendCommandOrUpdateOperation;
    /**
       * Specifies a command state should be posted to the target object
       * as a result of this rule firing. This relies on the trigger being the result
       * of a command itself.
       *
       * @returns {OperationBuilder.SendCommandOrUpdateOperation} the operation
       */
    postIt(): OperationBuilder.SendCommandOrUpdateOperation;
    /**
       * Copies the state from one item to another. Can be used to proxy item state. State is updated, not
       * sent as a command.
       *
       * @returns {OperationBuilder.CopyStateOperation} the operation config
       */
    copyState(): OperationBuilder.CopyStateOperation;
    /**
       * Sends the state from one item to another. Can be used to proxy item state. State is
       * sent as a command.
       *
       * @returns {OperationBuilder.CopyStateOperation} the operation config
       */
    copyAndSendState(): OperationBuilder.CopyStateOperation;
}
//# sourceMappingURL=operation-builder.d.ts.map