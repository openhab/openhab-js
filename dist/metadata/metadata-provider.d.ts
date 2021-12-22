export class StaticCallbackMetadataProvider extends AbstractProvider {
    constructor();
    metadataCallbacks: any[];
    addProviderChangeListener(listener: any): void;
    removeProviderChangeListener(listener: any): void;
    addMetadataCallback(callback: any): void;
    getAll(): any;
}
import { AbstractProvider } from "openhab/provider";
export declare function staticCallbackMetadataProvider(): StaticCallbackMetadataProvider;
