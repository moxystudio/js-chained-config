'use strict';

const merge = require('deepmerge');
const wrap = require('lodash.wrap');
const Chainable = require('./Chainable');

class ChainedMap extends Chainable {
    constructor(parent, options) {
        super(parent);

        this.store = new Map();

        if (options && options.asArray) {
            this.toConfig = wrap(this.toConfig.bind(this),
                (toConfig, ...args) => Object.values(toConfig(...args)));
        }
    }

    set(key, value) {
        this.store.set(key, value);

        if (Chainable.isChainable(value) && this[key] !== value) {
            Object.defineProperty(this, key, {
                get: () => this.get(key),
                set: (value) => this.set(key, value),
                enumerable: true,
                configurable: true,
            });
        }

        return this;
    }

    get(key) {
        return this.store.get(key);
    }

    has(key) {
        return this.store.has(key);
    }

    tap(key, fn) {
        this.store.set(key, fn(this.store.get(key)));

        return this;
    }

    clear() {
        this.store.clear();

        return this;
    }

    delete(key) {
        this.store.delete(key);

        return this;
    }

    entries() {
        return [...this.store.entries()];
    }

    keys() {
        return [...this.store.keys()];
    }

    values() {
        return [...this.store.values()];
    }

    forEach(fn, thisArg) {
        const keys = this.keys();

        keys.forEach((key) => fn.call(thisArg, this.get(key), key, this));

        return this;
    }

    merge(obj, omit = []) {
        Object
        .keys(obj)
        .forEach((key) => {
            if (omit.includes(key)) {
                return;
            }

            const value = obj[key];

            if ((!Array.isArray(value) && typeof value !== 'object') || value === null || !this.has(key)) {
                this.set(key, value);
            } else {
                this.set(key, merge(this.get(key), value));
            }
        });

        return this;
    }

    shorthands(keys) {
        keys.forEach((key) => {
            this[key] = (value) => this.set(key, value);
        });

        return this;
    }

    toConfig() {
        return this.entries().reduce((config, [key, value]) => {
            value = Chainable.isChainable(value) ? value.toConfig() : value;

            config[key] = value;

            return config;
        }, {});
    }
}

module.exports = ChainedMap;
