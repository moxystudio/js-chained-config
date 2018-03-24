'use strict';

const merge = require('deepmerge');
const Chainable = require('./Chainable');

class ChainedMap extends Chainable {
    constructor(parent) {
        super(parent);
        this.store = new Map();
    }

    set(key, value) {
        this.store.set(key, value);

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
        return this.keys().reduce((entries, key) => {
            entries[key] = this.get(key);

            return entries;
        }, {});
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

    extend(methods) {
        this.shorthands = methods;
        methods.forEach((method) => {
            this[method] = (value) => this.set(method, value);
        });

        return this;
    }
}

module.exports = ChainedMap;
