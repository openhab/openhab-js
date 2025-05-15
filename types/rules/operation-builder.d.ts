export type Item = {
    rawItem: HostItem;
    persistence: import("../items/item-persistence");
    semantics: import("../items/item-semantics");
    readonly type: string;
    readonly name: string;
    readonly label: string;
    readonly state: string;
    readonly numericState: number;
    readonly quantityState: import("../quantity").Quantity;
    /**
       * Sends the state from one item to another. Can be used to proxy item state. State is
       * sent as a command.
       *
       * @returns {CopyStateOperation} the operation config
       */
    readonly rawState: HostState;
    readonly previousState: string;
    readonly previousNumericState: number;
    readonly previousQuantityState: import("../quantity").Quantity;
    readonly previousRawState: any;
    readonly lastStateUpdateTimestamp: any;
    readonly lastStateUpdateInstant: any;
    readonly lastStateChangeTimestamp: any;
    readonly lastStateChangeInstant: any;
    readonly members: any[];
    readonly descendents: any[];
    readonly isUninitialized: boolean;
    getMetadata(namespace?: string): {
        value: string;
        configuration: any;
    } | {
        namespace: {
            value: string;
            configuration: any;
        };
    };
    replaceMetadata(namespace: string, value: string, configuration?: any): {
        configuration: any;
        value: string;
    };
    removeMetadata(namespace?: string): {
        value: string;
        configuration: any;
    }; /** @private */
    sendCommand(value: any, expire?: time.Duration, onExpire?: any): void;
    sendCommandIfDifferent(value: any): boolean;
    sendIncreaseCommand(value: any): boolean;
    sendDecreaseCommand(value: any): boolean;
    getToggleState(): "PAUSE" | "PLAY" | "OPEN" | "CLOSED" | "ON" | "OFF";
    sendToggleCommand(): void;
    postToggleUpdate(): void;
    postUpdate(value: any): void;
    readonly groupNames: string[];
    addGroups(...groupNamesOrItems: any[]): void;
    removeGroups(...groupNamesOrItems: any[]): void;
    readonly tags: string[];
    addTags(...tagNames: string[]): void;
    removeTags(...tagNames: string[]): void;
    toString(): any;
};
export type Quantity = import('../quantity').Quantity;
/**
 * Sends a command or update to an item
 *
 * @memberof OperationBuilder
 * @extends OperationConfig
 * @hideconstructor
 */
export class SendCommandOrUpdateOperation extends OperationConfig {
    constructor(operationBuilder: any, dataOrSupplier: any, isCommand: boolean, optionalDesc: any);
    /** @private */
    private isCommand;
    dataFn: any;
    dataDesc: any;
    /**
       * Send command to multiple items
       *
       * @param {Item[] | string[]} itemsOrNames the items to send a command to
       * @returns {SendCommandOrUpdateOperation} this
       */
    toItems(itemsOrNames: Item[] | string[]): SendCommandOrUpdateOperation;
    toItemNames: any[] | string[];
    /**
       * Send command to an item
       *
       * @param {Item | string} itemOrName the item to send a command to
       * @returns {SendCommandOrUpdateOperation} this
       */
    toItem(itemOrName: Item | string): SendCommandOrUpdateOperation;
    /**
       * Send another command
       * @param {*} next
       * @returns {SendCommandOrUpdateOperation} this
       */
    and(next: any): SendCommandOrUpdateOperation;
    next: any;
    /** @private */
    private _run;
    /** @private */
    private _complete;
    /** @private */
    private describe;
}
/**
 * Timing Item state
 *
 * @memberof OperationBuilder
 * @extends OperationConfig
 * @hideconstructor
 */
export class TimingItemStateOperation extends OperationConfig {
    constructor(operationBuilder: any, itemChangedTriggerConfig: any, duration: any);
    /** @private */
    private item_changed_trigger_config;
    /** @private */
    private duration_ms;
    /** @private */
    private _complete;
    /** @private */
    private describe;
    /** @private */
    private _toOHTriggers;
    /** @private */
    private _executeHook;
    /** @private */
    private _startWait;
    current_wait: NodeJS.Timeout;
    _cancelWait(): void;
}
/**
 * Toggles the state of an item
 *
 * @memberof OperationBuilder
 * @extends OperationConfig
 * @hideconstructor
 */
export class ToggleOperation extends OperationConfig {
    /** @private */
    private next;
    /** @type {function} */
    toItem: Function;
    /** @type {function} */
    and: Function;
    /** @private */
    private _run;
    /** @private */
    private _complete;
    /** @private */
    private describe;
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
       * @param {boolean} send whether to send (or post update) the state
       * @hideconstructor
       */
    constructor(operationBuilder: any, send: boolean);
    send: boolean;
    /**
       * Sets the item to copy the state from
       *
       * @param {string} itemName the item to copy state from
       * @returns {CopyStateOperation} this
       */
    fromItem(itemName: string): CopyStateOperation;
    from_item: string;
    /**
       * Sets the item to copy the state to
       *
       * @param {string} itemName the item to copy state to
       * @returns {CopyStateOperation} this
       */
    toItem(itemName: string): CopyStateOperation;
    to_item: string;
    /**
       * Appends another operation to execute when the rule fires
       * @returns {CopyStateOperation} this
       */
    and(): CopyStateOperation;
    next: OperationBuilder;
    /**
       * Runs the operation. Don't call directly.
       *
       * @private
       * @param {object} args rule firing args
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
 * @typedef { import("../items/items").Item } Item
 * @private
 */
/**
 * @typedef {import('../quantity').Quantity} Quantity
 * @private
 */
/**
 * Operation to execute as part of a rule
 * @hideconstructor
 */
export class OperationBuilder {
    constructor(builder: any, fn: any);
    /** @private */
    private _builder;
    /** @private */
    private _fn;
    /** @private */
    private _finishErr;
    /** @private */
    private _then;
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
      * @param {string|number|time.ZonedDateTime|Quantity|HostState} command the command to send
      * @returns {SendCommandOrUpdateOperation} the operation
      */
    send(command: string | number | time.ZonedDateTime | Quantity | HostState): SendCommandOrUpdateOperation;
    /**
       * Specifies that an update should be posted as a result of this rule firing.
       *
       * @param {string} update the update to send
       * @returns {SendCommandOrUpdateOperation} the operation
       */
    postUpdate(update: string): SendCommandOrUpdateOperation;
    /**
       * Specifies the command 'ON' should be sent as a result of this rule firing.
       *
       * @returns {SendCommandOrUpdateOperation} the operation
       */
    sendOn(): SendCommandOrUpdateOperation;
    /**
       * Specifies the command 'OFF' should be sent as a result of this rule firing.
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
import time = require("@js-joda/core");
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
       * @param {string} [name] of the rule
       * @param {string} [description] of the rule
       * @param {Array<String>} [tags] of the rule
       * @param {string} [id] of the rule
       */
    build(name?: string, description?: string, tags?: Array<string>, id?: string): void;
}
export {};
//# sourceMappingURL=operation-builder.d.ts.map