# AGENTS.md - openHAB JavaScript Library Development Guide

## Overview

This repository contains the openHAB JavaScript library (openhab-js), a high-level pure JavaScript API for interacting with openHAB Core's Java APIs.
It is designed to be used in the openHAB JavaScript Scripting add-on, running in a GraalVM JavaScript environment.

**Key Resources:**

- [openHAB Core Javadoc](https://www.openhab.org/javadoc/latest/)
- [openHAB JavaScript Scripting add-on](https://github.com/openhab/openhab-addons/tree/main/bundles/org.openhab.automation.jsscripting)
- [GraalVM JavaScript](https://github.com/oracle/graaljs)

## Project Structure

The repository is organized as follows:

```text
repo root folder
├── src/                               # Core library source code (CommonJS)
│   ├── actions/                       # Built-in actions and notification builders
│   ├── items/                         # Item management, persistence, semantics, metadata
│   ├── rules/                         # Rule, condition, trigger, and operation builders
│   ├── index.js                       # Main entrypoint using lazy getters
│   ├── time.js                        # Date/time utilities (wraps @js-joda/core)
│   └── globals.d.ts                   # Compiler-facing global types
├── test/                              # Tests and mocks
│   ├── openhab.mock.js                # Java host environment stubs
│   ├── *.spec.js                      # Jest test files
│   └── *.test.js                      # Mocha test files (Legacy)
├── build/                             # Build, bundler, and type config
│   ├── tsconfig.json                  # TypeScript declaration generation
│   ├── webpack.config.js              # Primary UMD module bundling
│   └── @globals-webpack.config.js     # Global namespace injection config
├── dist/                              # Built Webpack bundles for openHAB add-on
├── types/                             # Generated .d.ts declaration files
└── docs/                              # JSDoc output (deployed to GitHub Pages)
```

## Runtime Environment Constraints

`openhab-js` runs in the openHAB JavaScript Scripting add-on environment, which is powered by GraalVM JavaScript running inside a Java host.
This environment has specific restrictions:

> [!WARNING]
>
> - **No Node.js core libraries**: Standard Node.js modules (such as `node:http`, `fs`, `path`, etc.) are **not** available. Only pure ECMAScript and bundled dependencies (like `@js-joda/core`) can be used.
> - **Synchronous Execution Only**: The runtime environment is synchronous. Promises, `async`/`await` functions, and asynchronous timers (`setTimeout`, `setInterval`) are **not supported** and must not be used in the core code.

## General Build & Development Instructions

### Environment Setup

- The recommended Node.js version is defined in **[.nvmrc](.nvmrc)**. It is recommended to use a version manager such as `nvm` (run `nvm use`).
- Install dependencies using npm:

  ```bash
  npm install
  ```

### Standard Development Scripts

- **Linting**:
  - Lint files in `src/` using ESLint (with JavaScript Standard Style):

    ```bash
    npm run lint
    ```

  - Auto-fix style issues:

    ```bash
    npm run lint:fix
    ```

- **Testing**:
  - Run the full test suite (Mocha + Jest):

    ```bash
    npm test
    ```

- **Bundling**:
  - Bundle the source with Webpack into the `dist/` directory:

    ```bash
    npm run webpack
    ```

- **Type Declarations**:
  - Generate `.d.ts` type declarations under `types/`:

    ```bash
    npm run types
    ```

  - Verify the generated type definitions for syntax and compilation:

    ```bash
    npm run types:test
    ```

- **Documentation**:
  - Build the HTML JSDoc documentation under `docs/`:

    ```bash
    npm run docs
    ```

- **Full Production Build**:
  - Perform tests, bundle, generate types, and compile JSDoc:

    ```bash
    npm run build
    ```

## Testing Guidelines

- **Write Jest tests**: All new unit tests should be written using **Jest** and placed in the **[test/](test)** folder (or subfolders) with the extension `*.spec.js`.
- **Legacy Mocha tests**: Legacy test files with the extension `*.test.js` run under Mocha. These are still present in the repository but will be migrated or removed in the future. Avoid adding new Mocha tests.
- **Test Mocks**: Ensure that tests stub out Java-specific hosts (like `@runtime`) using the provided mock modules under the `test/` directory.

## Type Definition Architecture and Guidelines

This section documents the architecture and constraints for type definition generation and global type resolution in `openhab-js`.

### Separation of Compiler-Facing and Public-Facing Globals

There is a strict separation between the globals used during type generation (`npm run types`) and those exposed to public package consumers:

#### Compiler-Facing (`src/globals.d.ts`)

- **Purpose**: Used only by `tsc` when generating `.d.ts` files from the JS source.
- **Location**: [src/globals.d.ts](src/globals.d.ts)
- **Configuration**: Included in [build/tsconfig.json](build/tsconfig.json).
- **Key Constraint**: Because JS files are CommonJS modules exporting constructor values, `src/globals.d.ts` must use `InstanceType<typeof import(...)>` to extract class instance types. Otherwise, the compiler will fail to compile.

#### Public-Facing (`types/openhab-js.d.ts`)

- **Purpose**: Used by external library consumers (and VS Code) when importing `openhab-js`.
- **Location**: [types/openhab-js.d.ts](types/openhab-js.d.ts)
- **Configuration**: Exposed via `"types"` in `package.json`.
- **Key Constraint**: Because the generated declaration files under `types/` are true TS modules exporting actual class/type definitions, this file **must not** use `InstanceType<typeof ...>` for classes. Instead, it must use direct type imports (e.g. `import('./items/items').Item`) to allow editor engines like VS Code to resolve class member autocompletion instantly.

### Preventing Output Overwrite Conflicts (`TS5055`)

- The `types/` output directory must **never** be included in the compilation input patterns/`include` array of [build/tsconfig.json](build/tsconfig.json).
- If a file in the input graph imports or references files under `types/` during build time, `tsc` loads them as compilation inputs. When `tsc` then attempts to output the generated declarations to `types/`, it raises `error TS5055: Cannot write file because it would overwrite input file`.
- To avoid this, always keep `src/globals.d.ts` importing directly from the source `.js` files using relative paths within `src/` (e.g., `./items/items` instead of `../types/items/items`).
