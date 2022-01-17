# Deployment Instructions

# Webpack

openhab-js can be compiled into a single JS file, which is connivent for deploying locally and also how we ship the library with the JSScripting binding in openHAB

```bash
npm run webpack
```
this outputs the library as a single JS file to `dist/openhab.js`

# Docs

openhab-js uses [JSDocs](https://jsdoc.app/) to produce API documentation.

```bash
npm run docs
```

This will output API documentation to `./docs`

This also happens automatically on every push to `main` and is published using Github Pages, see [openhab-js API Documentation](https://openhab.github.io/openhab-js/) for the latest version. 

# Publish to NPM

We have a Github action which will publish this library automatically when a version tag is pushed. 

```bash
export OHJS=2.x.x #replace 2.x.x with version
git checkout main
git pull origin
npm version $OHJS 
git push origin  #push changes
git push origin $OHJS #push tag
```