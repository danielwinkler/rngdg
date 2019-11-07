const toCamel = (s: string) => {
  return s.replace(/([-_][a-z])/ig, ($1) => {
    return $1.toUpperCase()
      .replace('-', '')
      .replace('_', '');
  });
};

const isArray = function (a: any): a is Array<unknown> {
  return Array.isArray(a);
};

const isObject = function (o: any): o is object {
  return o === Object(o) && !isArray(o) && typeof o !== 'function';
};

/// This one claims to do something that it doesn,t, but swagger does the same
/// so we change the keys back to how they should be
export const keysToCamelHackForSwagger = <T extends object | Array<T>>(o: T): T => {
  if (isObject(o)) {
    const n = {};

    Object.keys(o)
      .forEach((k) => {
        n[toCamel(k)] = keysToCamelHackForSwagger(o[k]);
      });

    return n;
  } else if (isArray(o)) {
    return o.map(keysToCamelHackForSwagger);
  }
  return o;
}
