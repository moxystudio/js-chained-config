'use strict';

const Chainable = require('../lib/Chainable');

describe('.end', () => {
    it('should return the parent', () => {
        const parent = { foo: 'bar' };
        const chain = new Chainable(parent);

        expect(chain.end()).toBe(parent);
    });
});

describe('.batch', () => {
    it('should execute the function passing the context', () => {
        const fn = jest.fn();

        const chain = new Chainable();
        const ret = chain.batch(fn);

        expect(chain).toBe(ret);
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toHaveBeenCalledWith(chain);
    });

    it('should return itself', () => {
        const chain = new Chainable();
        const ret = chain.batch(() => {});

        expect(chain).toBe(ret);
    });
});

describe('.when', () => {
    it('should execute the `whenTruthy` if condition is truthy', () => {
        const chain = new Chainable();
        const whenTruthy = jest.fn();
        const whenFalsy = jest.fn();

        chain.when(true, whenTruthy, whenFalsy);

        expect(whenTruthy).toHaveBeenCalledTimes(1);
        expect(whenTruthy).toHaveBeenCalledWith(chain);
        expect(whenFalsy).toHaveBeenCalledTimes(0);
    });

    it('should execute the `whenFalsy` if condition is truthy', () => {
        const chain = new Chainable();
        const whenTruthy = jest.fn();
        const whenFalsy = jest.fn();

        chain.when(false, whenTruthy, whenFalsy);

        expect(whenFalsy).toHaveBeenCalledTimes(1);
        expect(whenFalsy).toHaveBeenCalledWith(chain);
        expect(whenTruthy).toHaveBeenCalledTimes(0);
    });

    it('should not fail if `whenTruthy` or `whenFalsy` are not passed', () => {
        const chain = new Chainable();

        chain.when(true);
        chain.when(false);
    });

    it('should return itself', () => {
        const chain = new Chainable();
        const ret = chain.batch(() => {});

        expect(chain).toBe(ret);
    });
});
