# chained-config

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][codecov-image]][codecov-url] [![Dependency status][david-dm-image]][david-dm-url] [![Dev Dependency status][david-dm-dev-image]][david-dm-dev-url] [![Greenkeeper badge][greenkeeper-image]][greenkeeper-url]

[npm-url]:https://npmjs.org/package/chained-config
[downloads-image]:http://img.shields.io/npm/dm/chained-config.svg
[npm-image]:http://img.shields.io/npm/v/chained-config.svg
[travis-url]:https://travis-ci.org/moxystudio/js-chained-config
[travis-image]:http://img.shields.io/travis/moxystudio/js-chained-config/master.svg
[codecov-url]:https://codecov.io/gh/moxystudio/js-chained-config
[codecov-image]:https://img.shields.io/codecov/c/github/moxystudio/js-chained-config/master.svg
[david-dm-url]:https://david-dm.org/moxystudio/js-chained-config
[david-dm-image]:https://img.shields.io/david/moxystudio/js-chained-config.svg
[david-dm-dev-url]:https://david-dm.org/moxystudio/js-chained-config?type=dev
[david-dm-dev-image]:https://img.shields.io/david/dev/moxystudio/js-chained-config.svg
[greenkeeper-image]:https://badges.greenkeeper.io/moxystudio/js-chained-config.svg
[greenkeeper-url]:https://greenkeeper.io/

Use a chaining API to generate and simplify the modification of configs.


## Installation

`$ npm install chained-config`


## Motivation

With `webpack-chain`, manipulating the webpack config is a breeze. This is possible thanks to [ChainedMap](https://github.com/mozilla-neutrino/webpack-chain/blob/2445476d0d7f444c34060f383c890597ca0d2e8d/src/ChainedMap.js) and [ChainedSet](https://github.com/mozilla-neutrino/webpack-chain/blob/2445476d0d7f444c34060f383c890597ca0d2e8d/src/ChainedSet.js).

`chained-config` offers those constructors in a separate package so that we can apply the same concepts to other configurations other than Webpack. There are small differences that are noted in each API section.


## Usage

```js
const {
    ChainedMap,
    OrderableChainedMap,
    ChainedSet,
} = require('chained-config');
```

Either you may use these directly or extend them, just like [DevServer](https://github.com/mozilla-neutrino/webpack-chain/blob/2445476d0d7f444c34060f383c890597ca0d2e8d/src/DevServer.js) from `webpack-chain` extends `ChainedMap`.

```js
const chainedMap = new ChainedMap();

// ..or

class MyConfig extends ChainedMap {
    // your own methods here..
}

const myConfig = new MyConfig();
```


## API

### Chainable

This is the base class that others inherit from, it's not meant to be used directly.

<details>
  <summary><b>Differences from webpack-chain:</b></summary>
  <ul>
    <li>Moved <code>.when(condition, whenTruthy, whenFalsy)</code> from ChainedMap and ChainedSet to Chainable to avoid having them replicated</li>
  </ul>
</details>


#### constructor(parent)

The constructor expects a `parent` pointing to the parent chain, if any.

#### .end()

Ends the current chain, going back to the parent chain.

Returns the parent.

#### .batch(fn)

Execute a function against the current chain.   
This is useful to execute various operations while not breaking the chain.

Returns itself to allow chaining.

#### .when(condition, whenTruthy, whenFalsy)

Conditionally execute a function on the current chain.   
`whenTruthy` and `whenFalsy` are called if condition is truthy or falsy respectively.

Returns itself to allow chaining.


### ChainedMap

A ChainedMap operates similarly to a JavaScript Map, with some conveniences for chaining and generating configs. It extends [Chainable](#chainable) which means that all its methods are also available.

<details>
  <summary><b>Diferences from webpack-chain:</b></summary>
  <ul>
    <li>Removed <code>move()</code> because it's an internal method, reducing the number of conflicts in case you create a class that inherits from <code>ChainedMap</code></li>
    <li>Removed <code>.clean(obj)</code> because it's more of a helper (it didn't use <code>this.store</code> whatsoever)</li>
    <li>Added <code>.tap(key, fn)</code></li>
    <li>Added <code>.keys()</code> just like the native <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/keys">Map</a></li>
    <li>Added <code>.forEach()</code> just like the native <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/forEach">Map</a></li>
    <li>Changed <code>.entries()</code> to no longer return <code>undefined</code> if the map is empty in order to avoid any "gotchas"</li>
  </ul>
</details>


#### .get(key)

Retrieve the value of the entry corresponding to `key`.

#### .set(key, value)

Set the value of the entry corresponding to `key`.

Returns itself to allow chaining.

#### .tap(key, fn)

Execute `fn` with the current value of the entry corresponding to `key`.   
The return value of `fn` will replace the current value.

Returns itself to allow chaining.

#### .delete(key)

Remove the entry corresponding to `key`.

Returns itself to allow chaining.

#### .has(key)

Check if there's an entry corresponding to `key`.

Returns `true` if it exists, `false` otherwise.

#### .clear()

Remove all entries from the Map.

Returns itself to allow chaining.

#### .keys()

Returns an array of the keys stored in the Map.

#### .values()

Returns an array of the values stored in the Map.

#### .entries()

Returns an object of all the entries stored in the Map.

#### .forEach(fn, [thisArg])

Execute `fn` once per each key/value pair in the Map.

#### .merge(ob, [omit])

Provide an object which maps its properties and values into the backing Map as keys and values.   
You can also provide an array as the second argument for property names to omit from being merged.

Returns itself to allow chaining.

#### .extend(shorthands)

Add setter aliases for each `key` specified in `shorthands`.

Returns itself to allow chaining.


#### Example

```js
class Jest extends ChainedMap {
    constructor(parent) {
        super(parent);

        this.extend([
            'rootDir',
            'runner',
            // ...
        ]);

        this.coverageThresholds = new ChainedMap(this);
    }
}

// Then use it like so:
const jestConfig = new Jest();

jestConfig
    .coverageThresholds
        .set('global', {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: -10
        })
        .tap('global', (thresholds) => Object.assign(thresholds, { branches: 100 }))
        .end()
    .rootDir('my-project')
    .runner('jest-runner-mocha');
```


### OrderableChainedMap

OrderableChainedMap extends [Chainable](#chained-map) and allows to re-order keys via the `move(key, specifier)` method. It also adds `before(key)` and `after(key)` methods on Chainables added via `set`. This allows an entry to declare that it comes before or after another by calling the aforementioned methods on itself.

Consequently, `keys()`, `values()`, `entries()` and `.forEach()` methods of OrderableChainedMap will have into consideration any changes to the entries order.

<details>
  <summary><b>Diferences from webpack-chain:</b></summary>
  <ul>
    <li><code>webpack-chain</code> has Orderable which is a function that receives a Chainable and adds the `before` and `after` methods. OrderableChainedMap is more flexible since it allows ordering entries whose values are primitives</li>
    <li>Removed weird treatment on <code>.merge(obj, [omit])</code> of <code>after</code> and <code>before</code> keys in <code>obj</code></li>
    <li>Fixed minor bugs that caused <code>.keys()</code>, <code>.values()</code> and <code>.entries()</code> to not respect the order specified with <code>.before(key)</code> and <code>.after(key)</code>
  </ul>
</details>


#### .move(key, specifier)

Moves the entry corresponding to `key` before of after another, according to the `specifier`.

`specifier` is a function that will be called with a single argument which is an object with `before(relativeKey)` and `after(relativeKey)` functions.

Returns itself to allow chaining.


#### Methods added to Chainables included via `set`

##### .before(key)

Marks the entry to be positioned before `key` on the OrderableChainedMap they belong.

Returns itself to allow chaining.

##### .after(key)

Marks the entry to be positioned after `key` on the OrderableChainedMap they belong.

Returns itself to allow chaining.


#### Example

```js
class Jest extends ChainedMap {
    constructor(parent) {
        super(parent);

        this.extend([
            'rootDir',
            'runner',
            // ...
        ]);

        this.setupFiles = new OrderableChainedMap(this);
        this.projects = new OrderableChainedMap(this);
    }

    project(name) {
        if (!this.projects.has(name)) {
            this.projects.set(name, new ChainedMap(this));
        }

        return this.projects.get(name);
    }
}

// Then use it like so:
const jestConfig = new Jest();

jestConfig
    // Using `move` to re-order entries
    .setupFiles
        .set('setup-foo', '/path/to/setup/foo.js')
        .set('setup-bar', '/path/to/setup/bar.js')
        .set('setup-baz', '/path/to/setup/baz.js')
        .move('setup-bar', ({ before }) => before('setup-foo'))
        .move('setup-baz', ({ after }) => after('setup-foo'))
        .end()
    // Using `before` and `after` which where added automatically by
    // OrderableChainedMap to entries added via `set`
    .project('examples')
        .set('displayName', 'lint')
        .set('runner', 'jest-runner-eslint')
        .set('testMatch', ['<rootDir>/**/*.js'])
        .end()
    .project('test')
        .set('displayName', 'test')
        .before('examples');
```


### ChainedSet

A ChainedSet operates similarly to a JavaScript Set, with some conveniences for chaining and generating configs. It extends [Chainable](#chainable) which means that all its methods are also available.

<details>
  <summary><b>Differences from webpack-chain:</b></summary>
  <ul>
    <li>Added <code>.forEach()</code> just like the native <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/forEach">Set</a></li>
  </ul>
</details>


#### .add(value)

Adds `value` to the end of the Set.

Returns itself to allow chaining.

#### .prepend(value)

Adds `value` to the start of the Set.

Returns itself to allow chaining.

#### .delete(value)

Removes `value` from the Set.

Returns itself to allow chaining.

#### .has(value)

Check if `value` is within the Set.

Returns `true` if it exists, `false` otherwise.

#### .clear()

Remove all entries from the Set.

Returns itself to allow chaining.

#### .values()

Returns an array of the values stored in the Set.

#### .forEach(fn, [thisArg])

Execute `fn` once per each value in the Set.

#### .merge(arr)

Provide an array whose items will be added to the Set.

Returns itself to allow chaining.


#### Example

```js
class Jest extends ChainedMap {
    constructor(parent) {
        super(parent);

        this.extend([
            'rootDir',
            'runner',
            // ...
        ]);

        this.moduleFileExtensions = new ChainedSet(this);
    }
}

// Then use it like so:
const jestConfig = new Jest();

jestConfig
    .moduleFileExtensions
        .add('ts')
        .add('tsx')
        .end()
    .rootDir('my-project')
    .runner('jest-runner-mocha');
```


## Tests

`$ npm test`   
`$ npm test -- --watch` during development


## License

Released under the [MIT License](http://www.opensource.org/licenses/mit-license.php).
