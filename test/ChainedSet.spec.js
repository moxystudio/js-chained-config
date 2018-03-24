'use strict';

const { ChainedSet } = require('..');

it('should create a chainable object', () => {
    const parent = { foo: 'bar' };
    const set = new ChainedSet(parent);

    expect(set.end()).toBe(parent);
});

it('should create a backing Set', () => {
    const set = new ChainedSet();

    expect(set.store instanceof Set).toBe(true);
});

describe('.add', () => {
    it('should add the value to the end of the set', () => {
        const set = new ChainedSet();

        set.add('foo');
        set.add('bar');

        expect(set.values()).toEqual(['foo', 'bar']);
    });

    it('should not add duplicates', () => {
        const set = new ChainedSet();

        set.add('foo');
        set.add('foo');
        expect(set.values()).toEqual(['foo']);
    });

    it('should return itself', () => {
        const set = new ChainedSet();
        const ret = set.add('foo');

        expect(set).toBe(ret);
    });
});

describe('.prepend', () => {
    it('should add the value to the begining of the set', () => {
        const set = new ChainedSet();

        set.add('foo');
        set.prepend('bar');
        expect(set.values()).toEqual(['bar', 'foo']);
    });

    it('should not add duplicates', () => {
        const set = new ChainedSet();

        set.add('foo');
        set.prepend('foo');
        expect(set.values()).toEqual(['foo']);
    });

    it('should return itself', () => {
        const set = new ChainedSet();
        const ret = set.prepend('foo');

        expect(set).toBe(ret);
    });
});

describe('.clear', () => {
    it('should clear the entries', () => {
        const set = new ChainedSet();

        set.add('foo');
        set.add('bar');
        set.clear();

        expect(set.has('foo')).toBe(false);
        expect(set.has('bar')).toBe(false);
        expect(set.values()).toHaveLength(0);
    });

    it('should return itself', () => {
        const set = new ChainedSet();
        const ret = set.clear();

        expect(set).toBe(ret);
    });
});

describe('.delete', () => {
    it('should delete an entry', () => {
        const set = new ChainedSet();

        set.add('foo');
        set.add('bar');
        set.delete('foo');

        expect(set.has('foo')).toBe(false);
        expect(set.has('bar')).toBe(true);
    });

    it('should return itself', () => {
        const set = new ChainedSet();
        const ret = set.delete('foo');

        expect(set).toBe(ret);
    });
});

describe('.has', () => {
    it('should return true if the entry exists', () => {
        const set = new ChainedSet();

        set.add('foo');
        set.add('bar');

        expect(set.has('foo')).toBe(true);
        expect(set.has('bar')).toBe(true);
        expect(set.has('baz')).toBe(false);
    });

    it('should return false if the entry exists', () => {
        const set = new ChainedSet();

        expect(set.has('foo')).toBe(false);
    });
});

describe('.values', () => {
    it('should return the entry values by insertion order', () => {
        const set = new ChainedSet();

        set.add('z');
        set.add('a');
        set.add('c');

        expect(set.values()).toEqual(['z', 'a', 'c']);
    });
});

describe('.forEach', () => {
    it('should call fn for each value', () => {
        const set = new ChainedSet();

        set.add('a');
        set.add('b');
        set.add('c');

        const fn = jest.fn();

        set.forEach(fn);

        expect(fn).toHaveBeenCalledTimes(3);
        expect(fn.mock.calls).toEqual([
            ['a', 'a', set],
            ['b', 'b', set],
            ['c', 'c', set],
        ]);
    });

    it('should call fn with the correct `thisArg`', () => {
        const set = new ChainedSet();

        set.add('a');

        expect.assertions(1);

        const thisArg = {};

        set.forEach(function () {
            expect(this).toBe(thisArg);
        }, thisArg);
    });

    it('should return itself', () => {
        const set = new ChainedSet();
        const ret = set.forEach(() => {});

        expect(set).toBe(ret);
    });
});

describe('.merge', () => {
    it('should merge with existing values', () => {
        const set = new ChainedSet();

        set.add('a');
        set.add('b');
        set.merge(['c', 'd']);

        expect(set.values()).toEqual(['a', 'b', 'c', 'd']);
    });

    it('should merge and deduplicate existing values', () => {
        const set = new ChainedSet();

        set.add('a');
        set.add('b');
        set.merge(['a', 'c']);

        expect(set.values()).toEqual(['a', 'b', 'c']);
    });

    it('should return itself', () => {
        const set = new ChainedSet();
        const ret = set.merge(['foo']);

        expect(set).toBe(ret);
    });
});
