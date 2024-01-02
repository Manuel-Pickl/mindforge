declare global {
  interface Array<T> {
    first(predicate: (element: T) => boolean): T;
  }
}
  
Array.prototype.first = function<T>(predicate: (element: T) => boolean): T {
  const result = this.find(predicate);

  if (result === undefined) {
    throw new Error("no element was found on first()");
  }

  return result;
};

export {};