/**
 * Creates a trigger that fires upon specific events in a channel.
 *
 * @example
 * ChannelEventTrigger('astro:sun:local:rise#event', 'START')
 *
 * @name ChannelEventTrigger
 * memberof triggers
 * @param {String} channel the name of the channel
 * @param {String} event the name of the event to listen for
 * @param {String} [triggerName] the name of the trigger to create
 * @returns {any | null} trigger
 *
 */
export function ChannelEventTrigger(channel: string, event: string, triggerName?: string): any | null;
/**
 * sadsdfsdfs
 */
export function XXX(): void;
export declare function ItemStateChangeTrigger(itemName: string, oldState?: string, newState?: string, triggerName?: string): any;
export declare function ItemStateUpdateTrigger(itemName: string, state?: string, triggerName?: string): any;
export declare function ItemCommandTrigger(itemName: string, command?: string, triggerName?: string): any;
export declare function GroupStateChangeTrigger(groupName: string, oldState?: string, newState?: string, triggerName?: string): any;
export declare function GroupStateUpdateTrigger(groupName: string, state?: string, triggerName?: string): any;
export declare function GroupCommandTrigger(groupName: string, command?: string, triggerName?: string): any;
export declare function ThingStatusUpdateTrigger(thingUID: string, status?: string, triggerName?: string): any;
export declare function ThingStatusChangeTrigger(thingUID: string, status?: string, previousStatus?: string, triggerName?: string): any;
export declare function SystemStartlevelTrigger(startlevel: string, triggerName?: string): any;
export declare function GenericCronTrigger(expression: string, triggerName: any): any;
export declare function TimeOfDayTrigger(time: string, triggerName: any): any;
