'use strict';

const { OrderableChainedMap } = require('..');

it('should create a backing Map for the order', () => {
    const map = new OrderableChainedMap();

    expect(map.orderStore instanceof Map).toBe(true);
});

describe('.set', () => {
    it('should add `before` and `after` methods on value if it\'s a chainable', () => {
        const map = new OrderableChainedMap();
        const childMap = new OrderableChainedMap();

        map.set('foo', childMap);
        expect(typeof childMap.before).toBe('function');
        expect(typeof childMap.after).toBe('function');
    });

    it('should not add `before` and `after` methods on value if it\'s a chainable', () => {
        const map = new OrderableChainedMap();
        const value = {};

        map.set('foo', value);
        expect(value.before).toBe(undefined);
        expect(value.after).toBe(undefined);
    });
});

describe('.delete', () => {
    it('should delete the entry from the order store', () => {
        const map = new OrderableChainedMap();

        map.move('foo', ({ before }) => before('bar'));
        map.delete('foo');

        expect(map.orderStore.has('foo')).toBe(false);
    });
});

describe('.clear', () => {
    it('should clear all entries from the order store', () => {
        const map = new OrderableChainedMap();

        map.move('foo', ({ before }) => before('bar'));
        map.clear();

        expect(map.orderStore.size).toBe(0);
    });
});

describe('.order', () => {
    it('should mark the map to be added before another', () => {
        const map = new OrderableChainedMap();

        map.move('foo', ({ before }) => before('bar'));

        expect(map.orderStore.get('foo')).toEqual({ relativeKey: 'bar', position: 'before' });
    });

    it('should mark the map to be added before another (child)', () => {
        const map = new OrderableChainedMap();
        const childMap = new OrderableChainedMap();

        map.set('foo', childMap);
        childMap.before('bar');

        expect(map.orderStore.get('foo')).toEqual({ relativeKey: 'bar', position: 'before' });
    });

    it('should mark the map to be added after another', () => {
        const map = new OrderableChainedMap();

        map.move('foo', ({ after }) => after('bar'));

        expect(map.orderStore.get('foo')).toEqual({ relativeKey: 'bar', position: 'after' });
    });

    it('should mark the map to be added after another (child)', () => {
        const map = new OrderableChainedMap();
        const childMap = new OrderableChainedMap();

        map.set('foo', childMap);
        childMap.after('bar');

        expect(map.orderStore.get('foo')).toEqual({ relativeKey: 'bar', position: 'after' });
    });
});

describe('.values', () => {
    it('should return the entry values by insertion order', () => {
        const map = new OrderableChainedMap();

        map.set('prop1', 1);
        map.set('prop2', 2);
        map.set('prop3', 3);

        map.move('prop1', ({ after }) => after('prop3'));
        map.move('prop2', ({ before }) => before('prop1'));

        expect(map.values()).toEqual([3, 2, 1]);
    });

    it('should deal with relative keys that does not exist', () => {
        const map = new OrderableChainedMap();

        map.set('prop1', 1);
        map.set('prop2', 2);
        map.set('prop3', 3);

        map.move('prop1', ({ after }) => after('prop4'));
        map.move('prop2', ({ before }) => before('prop5'));

        expect(map.values()).toEqual([1, 2, 3]);
    });
});

describe('.keys', () => {
    it('should return the entry keys by the correct order', () => {
        const map = new OrderableChainedMap();

        map.set('prop1', 1);
        map.set('prop2', 2);
        map.set('prop3', 3);

        map.move('prop1', ({ after }) => after('prop3'));
        map.move('prop2', ({ before }) => before('prop1'));

        expect(map.keys()).toEqual(['prop3', 'prop2', 'prop1']);
    });

    it('should deal with relative keys that does not exist', () => {
        const map = new OrderableChainedMap();

        map.set('prop1', 1);
        map.set('prop2', 2);
        map.set('prop3', 3);

        map.move('prop1', ({ after }) => after('prop4'));
        map.move('prop2', ({ before }) => before('prop5'));

        expect(map.keys()).toEqual(['prop1', 'prop2', 'prop3']);
    });
});

describe('.entries', () => {
    it('should return an object with keys and values by the correct order', () => {
        const map = new OrderableChainedMap();

        map.set('prop1', 1);
        map.set('prop2', 2);
        map.set('prop3', 3);

        map.move('prop1', ({ after }) => after('prop3'));
        map.move('prop2', ({ before }) => before('prop1'));

        const entries = map.entries();

        expect(Object.keys(entries)).toEqual(['prop3', 'prop2', 'prop1']);
    });

    it('should deal with relative keys that does not exist', () => {
        const map = new OrderableChainedMap();

        map.set('prop1', 1);
        map.set('prop2', 2);
        map.set('prop3', 3);

        map.move('prop1', ({ after }) => after('prop4'));
        map.move('prop2', ({ before }) => before('prop5'));

        const entries = map.entries();

        expect(Object.keys(entries)).toEqual(['prop1', 'prop2', 'prop3']);
    });
});

describe('.forEach', () => {
    it('should call fn for each entry by the correct order', () => {
        const map = new OrderableChainedMap();

        map.set('prop1', 1);
        map.set('prop2', 2);
        map.set('prop3', 3);

        map.move('prop1', ({ after }) => after('prop3'));
        map.move('prop2', ({ before }) => before('prop1'));

        const fn = jest.fn();

        map.forEach(fn);

        expect(fn).toHaveBeenCalledTimes(3);
        expect(fn.mock.calls).toEqual([
            [3, 'prop3', map],
            [2, 'prop2', map],
            [1, 'prop1', map],
        ]);
    });

    it('should deal with relative keys that does not exist', () => {
        const map = new OrderableChainedMap();

        map.set('prop1', 1);
        map.set('prop2', 2);
        map.set('prop3', 3);

        map.move('prop1', ({ after }) => after('prop4'));
        map.move('prop2', ({ before }) => before('prop5'));

        const fn = jest.fn();

        map.forEach(fn);

        expect(fn).toHaveBeenCalledTimes(3);
        expect(fn.mock.calls).toEqual([
            [1, 'prop1', map],
            [2, 'prop2', map],
            [3, 'prop3', map],
        ]);
    });
});
