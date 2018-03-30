'use strict';

const { ChainedMap, ChainedSet } = require('..');

it('should create a chainable object', () => {
    const parent = { foo: 'bar' };
    const map = new ChainedMap(parent);

    expect(map.end()).toBe(parent);
});

it('should create a backing Map', () => {
    const map = new ChainedMap();

    expect(map.store instanceof Map).toBe(true);
});

describe('.set', () => {
    it('should store the value', () => {
        const map = new ChainedMap();

        map.set('foo', 'bar');

        expect(map.get('foo')).toBe('bar');
    });

    it('should add a getter/setter if value is a chainable', () => {
        const map = new ChainedMap();
        const childMap = new ChainedMap();
        const otherChildMap = new ChainedMap();

        map.set('foo', childMap);

        expect(map.get('foo')).toBe(childMap);
        expect(map.foo).toBe(childMap);

        map.foo = otherChildMap;

        expect(map.foo).toBe(otherChildMap);
    });

    it('should return itself', () => {
        const map = new ChainedMap();
        const ret = map.set('foo', 'bar');

        expect(map).toBe(ret);
    });
});

describe('.get', () => {
    it('should retrieve the value', () => {
        const map = new ChainedMap();

        map.set('foo', 'bar');

        expect(map.get('foo')).toBe('bar');
    });
});

describe('.clear', () => {
    it('should clear the entries', () => {
        const map = new ChainedMap();

        map.set('foo', 'bar');
        map.set('foz', 'baz');
        map.clear();

        expect(map.get('foo')).toBe(undefined);
        expect(map.get('foz')).toBe(undefined);
        expect(map.keys()).toHaveLength(0);
    });

    it('should return itself', () => {
        const map = new ChainedMap();
        const ret = map.clear();

        expect(map).toBe(ret);
    });
});

describe('.delete', () => {
    it('should delete an item', () => {
        const map = new ChainedMap();

        map.set('foo', 'bar');
        map.set('foz', 'baz');
        map.delete('foo');

        expect(map.get('foo')).toBe(undefined);
        expect(map.get('foz')).toBe('baz');
    });

    it('should return itself', () => {
        const map = new ChainedMap();
        const ret = map.delete('foo');

        expect(map).toBe(ret);
    });
});

describe('.tap', () => {
    it('should call `fn` with the item value and use the return value as the new value', () => {
        const map = new ChainedMap();
        const fn = jest.fn(() => 'baz');

        map.set('foo', 'bar');
        map.tap('foo', fn);

        expect(map.get('foo')).toBe('baz');
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toHaveBeenCalledWith('bar');
    });

    it('should return itself', () => {
        const map = new ChainedMap();
        const ret = map.tap('foo', () => 'bar');

        expect(map).toBe(ret);
    });
});

describe('.has', () => {
    it('should return true if the item exists', () => {
        const map = new ChainedMap();

        map.set('foo', 'bar');
        map.set('bar', false);
        map.set('baz', undefined);

        expect(map.has('foo')).toBe(true);
        expect(map.has('bar')).toBe(true);
        expect(map.has('baz')).toBe(true);
    });

    it('should return false if the item exists', () => {
        const map = new ChainedMap();

        expect(map.has('foo')).toBe(false);
    });
});

describe('.values', () => {
    it('should return the items\' values', () => {
        const map = new ChainedMap();

        map.set('z', 1);
        map.set('a', 2);
        map.set('c', 3);

        expect(map.values()).toEqual([1, 2, 3]);
    });
});

describe('.keys', () => {
    it('should return the item\'s keys', () => {
        const map = new ChainedMap();

        map.set('z', 1);
        map.set('a', 2);
        map.set('c', 3);

        expect(map.keys()).toEqual(['z', 'a', 'c']);
    });
});

describe('.entries', () => {
    it('should return an array of key and value pairs', () => {
        const map = new ChainedMap();

        map.set('z', 1);
        map.set('a', 2);
        map.set('c', 3);

        expect(map.entries()).toEqual([
            ['z', 1],
            ['a', 2],
            ['c', 3],
        ]);
    });
});

describe('.forEach', () => {
    it('should call `fn` for each item', () => {
        const map = new ChainedMap();

        map.set('a', 1);
        map.set('b', 2);
        map.set('c', 3);

        const fn = jest.fn();

        map.forEach(fn);

        expect(fn).toHaveBeenCalledTimes(3);
        expect(fn.mock.calls).toEqual([
            [1, 'a', map],
            [2, 'b', map],
            [3, 'c', map],
        ]);
    });

    it('should call `fn` with the correct `thisArg`', () => {
        const map = new ChainedMap();

        map.set('a', 1);

        expect.assertions(1);

        const thisArg = {};

        map.forEach(function () {
            expect(this).toBe(thisArg);
        }, thisArg);
    });

    it('should return itself', () => {
        const map = new ChainedMap();
        const ret = map.forEach(() => {});

        expect(map).toBe(ret);
    });
});

describe('.merge', () => {
    it('should merge with existing values', () => {
        const map = new ChainedMap();

        map.set('a', 1);
        map.set('b', 2);
        map.merge({
            c: 3,
            d: 4,
        });

        expect(map.entries()).toEqual([
            ['a', 1],
            ['b', 2],
            ['c', 3],
            ['d', 4],
        ]);
    });

    it('should merge and override existing values', () => {
        const map = new ChainedMap();

        map.set('a', 1);
        map.set('b', 2);
        map.merge({
            a: 3,
            b: 4,
        });

        expect(map.entries()).toEqual([
            ['a', 3],
            ['b', 4],
        ]);
    });

    it('should merge and keep the order correct', () => {
        const map = new ChainedMap();

        map.set('a', 1);
        map.set('b', 2);
        map.merge({
            c: 3,
            d: 4,
        });

        expect(map.keys()).toEqual(['a', 'b', 'c', 'd']);
    });

    it('should deep merge objects', () => {
        const map = new ChainedMap();

        map.set('a', { foo: 'bar' });
        map.set('b', 2);
        map.merge({
            a: { foz: 'baz' },
        });

        expect(map.entries()).toEqual([
            ['a', { foo: 'bar', foz: 'baz' }],
            ['b', 2],
        ]);
    });

    it('should omit keys specified in `omit`', () => {
        const map = new ChainedMap();

        map.set('a', 1);
        map.set('b', 2);
        map.merge({
            c: 3,
            d: 4,
        }, ['d']);

        expect(map.keys()).toEqual(['a', 'b', 'c']);
    });

    it('should return itself', () => {
        const map = new ChainedMap();
        const ret = map.merge({ foo: 'bar' });

        expect(map).toBe(ret);
    });
});

describe('.shorthands', () => {
    it('should add methods for the specified keys', () => {
        const map = new ChainedMap();

        map.shorthands(['foo']);

        expect(typeof map.foo).toBe('function');

        map.foo('bar');
        expect(map.get('foo')).toBe('bar');
    });

    it('should return itself', () => {
        const map = new ChainedMap();
        const ret = map.shorthands(['foo']);

        expect(map).toBe(ret);
    });
});

describe('.toConfig', () => {
    it('should return an object representation of the config', () => {
        const map = new ChainedMap();
        const childMap = new ChainedMap(map);
        const childSet = new ChainedSet(map);

        childMap.set('foo', 'bar');
        childSet.add('foz');

        map.set('z', childMap);
        map.set('a', childSet);
        map.set('c', 3);

        expect(map.toConfig()).toEqual({
            z: { foo: 'bar' },
            a: ['foz'],
            c: 3,
        });
    });

    it('should be sorted by insertion order', () => {
        const map = new ChainedMap();
        const childMap = new ChainedMap(map);
        const childSet = new ChainedSet(map);

        childMap.set('foo', 'bar');
        childSet.add('foz');

        map.set('z', childMap);
        map.set('a', childSet);
        map.set('c', 3);

        expect(Object.keys(map.toConfig())).toEqual(['z', 'a', 'c']);
    });

    it('should convert to array if `options.asArray` is enabled', () => {
        const map = new ChainedMap(undefined, { asArray: true });

        map.set('foo', 'bar');

        expect(map.toConfig()).toEqual(['bar']);
    });
});
