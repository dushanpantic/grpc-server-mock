/**
 *
 * @param first
 * @param second
 * @param regexMatch if true, string values will be compared using regex, where first is made into RegExp, while second is used as `.test()` value
 * @returns boolean which determines if first and second have same values.
 */
export default function isEqual(first: any, second: any, regexMatch = false): boolean {
  const typeofFirst = typeof first;
  const typeofSecond = typeof second;

  if (typeofFirst !== typeofSecond) {
    return false;
  }

  if (regexMatch && typeofFirst === 'string') {
    return new RegExp(first).test(second);
  }

  const firstIsArray = Array.isArray(first);
  const secondIsArray = Array.isArray(second);

  if (firstIsArray !== secondIsArray) {
    return false;
  }

  if (firstIsArray) {
    return first.length === second.length
      && first.every((elem, index) => isEqual(elem, second[index], regexMatch));
  }

  if (typeofFirst === 'object') {
    const firstKeysSet = new Set(Object.keys(first));
    const secondKeysSet = new Set(Object.keys(second));
    if (firstKeysSet.size !== secondKeysSet.size) {
      return false;
    }

    if (!([...firstKeysSet].every(key => secondKeysSet.has(key)))) {
      return false;
    }

    return Object.keys(first).every(key => isEqual(first[key], second[key], regexMatch));
  }

  return first === second;
}
