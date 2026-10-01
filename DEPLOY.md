# Deployment Instructions

## TypeScript type definitions

openhab-js has included type definitions which are generated from JSDoc using the [`typescript`](https://www.npmjs.com/package/typescript) npm module.
Type definitions allow supercharged auto-completion in your IDE.

```bash
npm run types
```

This outputs the type definition files (`*.d.ts`) to `/types`.

Pro-tip: Add `// @ts-check` to the top of your `.js` files to enable type checking!

To test the generated type definitions for problems, run the test script:

```bash
npm run types:test
```

## Docs

Docs are automatically build on every push to `main` and deployed to [GitHub Pages](https://openhab.github.io/openhab-js/) on a new release.

## Webpack Build

The bundled versions of the library are automatically build and included into the JS Scripting add-on in its build process.

## Publish to NPM

We have a GitHub action which will publish this library automatically when a version tag is pushed.
Use the [npm version](https://docs.npmjs.com/cli/v12/commands/npm-version) command to bump the version, commit and tag:

```bash
npm run build # Perform a local build: Lint, run tests, bundle with webpack, update & test type definitions, build JSDoc
npm version [major | minor | patch] # Select one of the commands
```

Push the commit and version to the remote.
A GitHub release with a changelog will be created automatically by GitHub Actions after the package has been published to npm.
