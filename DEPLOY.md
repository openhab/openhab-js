# Deployment Instructions

## Webpack

openhab-js and it's injection script can be compiled into a single JS file, which is how we ship the library with the JS Scripting automation addon in openHAB.

```bash
npm run webpack
```

This outputs the library, and it's injection script as a single JS file to `dist/@openhab-globals.js`.

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

openhab-js uses [JSDocs](https://jsdoc.app/) to produce API documentation.

```bash
npm run docs
```

This will output API documentation to `./docs`.

This also happens automatically on every push to `main` and is published using Github Pages, see [openhab-js API Documentation](https://openhab.github.io/openhab-js/) for the latest version.

## Publish to NPM

We have a Github action which will publish this library automatically when a version tag is pushed.

```bash
npm test
export OHJS=2.x.x # replace 2.x.x with version
git checkout main
git pull origin
npm version $OHJS 
git push origin  # push changes
git push origin v${OHJS} # push tag
```
