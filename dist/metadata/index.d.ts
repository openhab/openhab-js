declare const _exports: {
    provider: {
        staticCallbackMetadataProvider: () => import("openhab/metadata/metadata-provider").StaticCallbackMetadataProvider;
        StaticCallbackMetadataProvider: typeof import("openhab/metadata/metadata-provider").StaticCallbackMetadataProvider;
    };
    getValue: (itemName: any, namespace: string) => string;
    addValue: (itemName: any, namespace: any, value: any) => void;
    updateValue: (itemName: any, namespace: any, value: any) => any;
    upsertValue: (itemName: string, namespace: string, value: string) => boolean;
    createMetadata: (itemName: any, namespace: any, value: any) => any;
};
export = _exports;
