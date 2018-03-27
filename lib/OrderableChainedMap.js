'use strict';

const ChainedMap = require('./ChainedMap');
const Chainable = require('./Chainable');

class OrderableChainedMap extends ChainedMap {
    constructor(parent) {
        super(parent);
        this.orderStore = new Map();
    }

    clear() {
        this.orderStore.clear();

        return super.clear();
    }

    delete(key) {
        this.orderStore.delete(key);

        return super.delete(key);
    }

    entries() {
        const keys = getOrderedKeys(this);

        return keys.reduce((entries, key) => {
            entries[key] = this.get(key);

            return entries;
        }, {});
    }

    keys() {
        return getOrderedKeys(this);
    }

    values() {
        const keys = getOrderedKeys(this);

        return keys.map((key) => this.get(key));
    }

    set(key, value) {
        if (value instanceof Chainable) {
            Object.assign(value, {
                before: (relativeKey) => this.orderStore.set(key, { relativeKey, position: 'before' }),
                after: (relativeKey) => this.orderStore.set(key, { relativeKey, position: 'after' }),
            });
        }

        return this.store.set(key, value);
    }

    move(key, fn) {
        fn({
            before: (relativeKey) => this.orderStore.set(key, { relativeKey, position: 'before' }),
            after: (relativeKey) => this.orderStore.set(key, { relativeKey, position: 'after' }),
        });

        return this;
    }
}

function getOrderedKeys(chainedMap) {
    const keys = Array.from(chainedMap.store.keys());
    const order = [...keys];

    keys.forEach((key) => {
        if (!chainedMap.orderStore.has(key)) {
            return;
        }

        const { relativeKey, position } = chainedMap.orderStore.get(key);

        if (position === 'before') {
            if (order.includes(relativeKey)) {
                order.splice(order.indexOf(key), 1);
                order.splice(order.indexOf(relativeKey), 0, key);
            }
        } else if (order.includes(relativeKey)) {
            order.splice(order.indexOf(key), 1);
            order.splice(order.indexOf(relativeKey) + 1, 0, key);
        }
    });

    return order;
}

module.exports = OrderableChainedMap;
