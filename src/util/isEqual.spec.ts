import isEqual from './isEqual';

describe('util/isEqual', () => {

  [
    {
      first: 'same',
      second: 'same',
    },
    {
      first: 5,
      second: 5,
    },
    {
      first: false,
      second: false,
    },
    {
      first: ['a', 'b', 'c'],
      second: ['a', 'b', 'c']
    },
    {
      first: ['a', 'c', 'c'],
      second: ['a', 'b', 'd']
    },
    {
      first: { a: 'b' },
      second: { a: 'b' }
    },
    {
      first: { a: 'b', b: 'a', c: 'd' },
      second: { a: 'b', c: 'd', b:'a' }
    },
    {
      first: { complex: { something: true, arr: [{ b: 'c' }], bool: true, nested: { val: [5] } }, array: [1, 2, '3', false, { a: 'b', b: { c: ['3'] } }] },
      second: { complex: { something: true, arr: [{ b: 'c' }], bool: true, nested: { val: [5] } }, array: [1, 2, '3', false, { a: 'b', b: { c: ['3'] } }] }
    }
  ].forEach(data => {
    it('tests matching inputs without string regex matching', () => {
      expect(isEqual(data.first, data.second, false)).toBe(true);
      expect(isEqual(data.first, data.second)).toBe(true);
    })
  });

  [
    {
      first: '.*am.*',
      second: 'same',
    },
    {
      first: '^water.*',
      second: 'waters',
    },
    {
      first: ['(a|b|c)', '(a|b|c)', '(a|b|c)'],
      second: ['a', 'b', 'c']
    },
    {
      first: { a: '(a|b|c)' },
      second: { a: 'b' }
    },
    {
      first: { complex: { something: true, arr: [{ b: '.*' }], bool: true, nested: { val: [5] } }, array: [1, 2, '(a|3)', false, { a: '.*', b: { c: ['(a|3)'] } }] },
      second: { complex: { something: true, arr: [{ b: 'c' }], bool: true, nested: { val: [5] } }, array: [1, 2, '3', false, { a: 'b', b: { c: ['3'] } }] }
    }
  ].forEach(data => {
    it('tests matching inputs with string regex matching', () => {
      expect(isEqual(data.first, data.second, true)).toBe(true);
    })
  });

  [
    {
      first: 'first',
      second: 'not first',
    },
    {
      first: '1',
      second: 1,
    },
    {
      first: 1,
      second: 2,
    },
    {
      first: 'first',
      second: 2,
    },
    {
      first: true,
      second: false,
    },
    {
      first: 1,
      second: true,
    },
    {
      first: { 0: 'a' },
      second: ['a']
    },
    {
      first: { a: 'a' },
      second: { b: 'a' }
    },
    {
      first: { a: 'a' },
      second: { a: 'a', b: 'a' }
    },
    {
      first: { a: 'b' },
      second: { A: 'b' }
    },
  ].forEach(data => {
    it('tests non matching inputs without string regex matching', () => {
      expect(isEqual(data.first, data.second)).toBe(false);
      expect(isEqual(data.first, data.second, false)).toBe(false);
    })
  });

  [
    {
      first: '(a|b|c)',
      second: 'd',
    },

    {
      first: { a: '.*water.*' },
      second: { b: 'wat3r' }
    },
    {
      first: { a: '^water.*' },
      second: { a: 'hwaters', }
    },
    {
      first: { a: ['^water.*'] },
      second: { a: ['hwaters'] }
    },
  ].forEach(data => {
    it('tests non matching inputs with string regex matching', () => {
      expect(isEqual(data.first, data.second, true)).toBe(false);
    })
  });

});
