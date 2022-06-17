/**
 * Returns a new instance of StaticCallbackMetadataProvider.
 *
 * @private
 * @returns {StaticCallbackMetadataProvider}
 */
export function staticCallbackMetadataProvider(): StaticCallbackMetadataProvider;
declare class StaticCallbackMetadataProvider extends AbstractProvider {
    constructor();
    metadataCallbacks: any[];
    addProviderChangeListener(listener: any): void;
    removeProviderChangeListener(listener: any): void;
    addMetadataCallback(callback: any): void;
    getAll(): java.util.List;
}
import { AbstractProvider } from "../provider";
export {};
//# sourceMappingURL=metadata-provider.d.ts.map