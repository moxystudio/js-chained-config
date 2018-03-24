'use strict';

const Chainable = require('./Chainable');

class ChainedSet extends Chainable {
    constructor(parent) {
        super(parent);
        this.store = new Set();
    }

    add(value) {
        this.store.add(value);

        return this;
    }

    prepend(value) {
        this.store = new Set([value, ...this.store]);

        return this;
    }

    has(value) {
        return this.store.has(value);
    }

    clear() {
        this.store.clear();

        return this;
    }

    delete(value) {
        this.store.delete(value);

        return this;
    }

    values() {
        return [...this.store];
    }

    forEach(fn, thisArg) {
        const values = this.values();

        values.forEach((value) => fn.call(thisArg, value, value, this));

        return this;
    }

    merge(arr) {
        this.store = new Set([...this.store, ...arr]);

        return this;
    }
}

module.exports = ChainedSet;
