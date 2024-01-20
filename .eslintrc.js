module.exports = {
    extends: 'eslint-config-standard',
    rules: {
        semi: ["error", "always"],
        "no-extra-semi": "error",
        "func-style": ["error", "declaration", { "allowArrowFunctions": true }]
    },
    globals: {
        Java: "readonly"
    },
    parserOptions: {
        ecmaVersion: 2022
    }
}
