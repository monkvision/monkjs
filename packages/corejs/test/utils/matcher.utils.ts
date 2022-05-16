/**
 * Returns an object matcher that allows for dreferencing when comparing two complex objects. This is essentially the
 * same as using `expect(obj).toMatchObject(otherObject)` but with the `expect.objectContaining(...)` api.
 * @param obj The object to match
 * @return An object matcher that matches the given object.
 */
export function deepObjectMatcher(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      obj[i] = deepObjectMatcher(obj[i]);
    }
    return expect.arrayContaining(obj);
  }
  if (typeof obj === 'object') {
    if ('$$typeof' in obj) {
      return obj;
    }
    const matchingObj = {};
    Object.entries(obj).forEach(([key, value]) => {
      Object.assign(matchingObj, {
        [key]: deepObjectMatcher(value),
      });
    });
    return expect.objectContaining(matchingObj);
  }
  return obj;
}
