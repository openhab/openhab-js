declare class StaticItemProvider extends AbstractProvider {
    items: any;
    addProviderChangeListener(listener: any): void;
    removeProviderChangeListener(listener: any): void;
    getAll(): any;
}
declare class ManagedItemProvider extends AbstractProvider {
    constructor();
    items: Set<any>;
    listeners: Set<any>;
    addProviderChangeListener(listener: any): void;
    removeProviderChangeListener(listener: any): void;
    add(item: any): void;
    remove(itemOrName: any): void;
    update(item: any): void;
    getAll(): java.util.Set;
}
declare class StaticCallbackItemProvider extends AbstractProvider {
    constructor();
    itemsCallbacks: any[];
    addProviderChangeListener(listener: any): void;
    removeProviderChangeListener(listener: any): void;
    addItemsCallback(callback: any): void;
    getAll(): java.util.List;
}
import { AbstractProvider } from "../provider";
export function staticItemProvider(items: HostItem[]): StaticItemProvider;
export function managedItemProvider(): ManagedItemProvider;
export function staticCallbackItemProvider(): StaticCallbackItemProvider;
export {};
//# sourceMappingURL=items-provider.d.ts.map