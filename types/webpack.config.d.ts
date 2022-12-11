export const entry: string;
export const mode: string;
export const externals: {
    '@runtime': {
        root: string;
        commonjs: string;
        commonjs2: string;
        amd: string;
    };
    '@runtime/cache': {
        root: string;
        commonjs: string;
        commonjs2: string;
        amd: string;
    };
    '@runtime/Defaults': {
        root: string;
        commonjs: string;
        commonjs2: string;
        amd: string;
    };
    '@runtime/provider': {
        root: string;
        commonjs: string;
        commonjs2: string;
        amd: string;
    };
    '@runtime/RuleSupport': {
        root: string;
        commonjs: string;
        commonjs2: string;
        amd: string;
    };
    '@runtime/osgi': {
        root: string;
        commonjs: string;
        commonjs2: string;
        amd: string;
    };
}[];
export namespace output {
    const path: string;
    const filename: string;
    namespace library {
        const name: string;
        const type: string;
    }
    const globalObject: string;
}
//# sourceMappingURL=webpack.config.d.ts.map