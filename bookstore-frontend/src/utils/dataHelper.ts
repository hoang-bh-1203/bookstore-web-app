export const isNilOrEmpty = (value: unknown): boolean => {
  return value === null || value === undefined || value === "";
};
export const isArrayEmpty = (arr: unknown[]): boolean => {
  return Array.isArray(arr) && arr.length === 0;
};
export const isObjectEmpty = (obj: Record<string, unknown>): boolean => {
  return Object.keys(obj).length === 0;
};
