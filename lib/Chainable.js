'use strict';

const withIs = require('class-is');

class Chainable {
    constructor(parent) {
        this.parent = parent;
    }

    batch(handler) {
        handler(this);

        return this;
    }

    end() {
        return this.parent;
    }

    when(condition, whenTruthy = () => {}, whenFalsy = () => {}) {
        if (condition) {
            whenTruthy(this);
        } else {
            whenFalsy(this);
        }

        return this;
    }

    toConfig() {
        throw new Error('Not implemented');
    }
}

module.exports = withIs(Chainable, { className: 'Chainable', symbolName: '@moxy/chained-config/Chainable' });
