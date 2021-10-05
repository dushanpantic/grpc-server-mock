import get from './get';

describe('util/get', () => {
  const data = {
    topLevel: {
      midLevel: {
        bottomLevel: {
          value: 'hehe'
        }
      }
    }
  };

  [
    {
      path: 'topLevel',
      expectedResult: data.topLevel
    },
    {
      path: 'topLevel.midLevel',
      expectedResult: data.topLevel.midLevel
    },
    {
      path: 'topLevel.midLevel.bottomLevel',
      expectedResult: data.topLevel.midLevel.bottomLevel
    },
    {
      path: 'topLevel.midLevel.bottomLevel.value',
      expectedResult: 'hehe'
    },
    {
      path: '',
      expectedResult: data
    },
    {
      path: undefined,
      expectedResult: data
    },
    {
      path: 'nonexistant',
      expectedResult: undefined
    },
  ].forEach(testCase => {
    it('returns expected result', () => {
      expect(get(data, testCase.path)).toStrictEqual(testCase.expectedResult);
    });
  })
});
