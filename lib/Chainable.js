'use strict';

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
}

module.exports = Chainable;
