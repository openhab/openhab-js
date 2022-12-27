declare const _exports: {
    when: (withToggle?: boolean) => import("./trigger-builder").TriggerBuilder;
    removeRule: (uid: string) => boolean;
    runRule: (uid: string, args?: any, cond?: boolean) => void;
    isEnabled: (uid: string) => boolean;
    setEnabled: (uid: string, isEnabled: boolean) => void;
    JSRule: (ruleConfig: import("./rules").RuleConfig) => HostRule;
    SwitchableJSRule: (ruleConfig: import("./rules").RuleConfig) => HostRule;
};
export = _exports;
//# sourceMappingURL=index.d.ts.map