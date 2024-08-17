import queryString from 'query-string';

export const stringify = (object: Record<string, any>) =>
  queryString.stringify(object, {
    skipNull: true,
    skipEmptyString: true,
  });
