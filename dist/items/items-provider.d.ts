export class StaticItemProvider extends AbstractProvider {
    items: any;
    addProviderChangeListener(listener: any): void;
    removeProviderChangeListener(listener: any): void;
    getAll(): any;
}
export class ManagedItemProvider extends AbstractProvider {
    constructor();
    items: Set<any>;
    listeners: Set<any>;
    addProviderChangeListener(listener: any): void;
    removeProviderChangeListener(listener: any): void;
    add(item: any): void;
    remove(itemOrName: any): void;
    update(item: any): void;
    getAll(): any;
}
export class StaticCallbackItemProvider extends AbstractProvider {
    constructor();
    itemsCallbacks: any[];
    addProviderChangeListener(listener: any): void;
    removeProviderChangeListener(listener: any): void;
    addItemsCallback(callback: any): void;
    getAll(): any;
}
import { AbstractProvider } from "openhab/provider";
export declare function staticItemProvider(items: any): StaticItemProvider;
export declare function managedItemProvider(): ManagedItemProvider;
export declare function staticCallbackItemProvider(): StaticCallbackItemProvider;
