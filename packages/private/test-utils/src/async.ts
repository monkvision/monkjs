export interface FakePromise<T> extends Promise<T> {
  resolve: (value: T) => void;
  reject: (err?: any) => void;
}

export function createFakePromise<T = any>(): FakePromise<T> {
  let manualResolve: (value: T) => void = () => {};
  let manualReject: (err?: any) => void = () => {};
  const promise = new Promise<T>((resolve, reject) => {
    manualResolve = resolve;
    manualReject = reject;
  });
  Object.assign(promise, {
    resolve: manualResolve,
    reject: manualReject,
  });
  return promise as FakePromise<T>;
}
