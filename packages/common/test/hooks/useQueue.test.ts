import { Renderer, renderHook, RenderHookResult } from '@testing-library/react-hooks';
import { act } from 'react-dom/test-utils';
import { Queue, QueueOptions, useQueue } from '../../src';

interface ItemPromise {
  promise: Promise<void>;
  resolve: () => void;
  reject: (err?: any) => void;
}

let items: Record<string, ItemPromise | null> = {};

function create(value: string): string {
  items[value] = null;
  return value;
}

function complete(value: string): Promise<void> {
  if (!items[value]) {
    throw new Error(
      `Unable to complete processing of item "${value}" because it is ${items[value]}`,
    );
  }
  (items[value] as ItemPromise).resolve();
  return (items[value] as ItemPromise).promise;
}

function fail(value: string, err?: any): Promise<void> {
  if (!items[value]) {
    throw new Error(`Unable to fail processing of item "${value}" because it is ${items[value]}`);
  }
  (items[value] as ItemPromise).reject(err);
  return (items[value] as ItemPromise).promise.catch(() => {});
}

function process(value: string): Promise<void> {
  const promise = new Promise<void>((resolve, reject) => {
    items[value] = { resolve, reject } as ItemPromise;
  });
  (items[value] as ItemPromise).promise = promise;
  return promise;
}

function renderUseQueue(
  initialProps?: QueueOptions<string>,
): RenderHookResult<QueueOptions<string>, Queue<string>, Renderer<QueueOptions<string>>> {
  return renderHook((options) => useQueue(process, options), {
    initialProps,
  });
}

describe('useQueue hook', () => {
  beforeEach(() => {
    items = {};
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a properly initialized queue', () => {
    const { result, unmount } = renderUseQueue();
    expect(result.current.length).toBe(0);
    expect(result.current.processingCount).toBe(0);
    expect(result.current.onHoldCount).toBe(0);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.isFull).toBe(false);
    expect(result.current.isAtMaxProcessing).toBe(false);
    expect(typeof result.current.push).toBe('function');
    expect(Array.isArray(result.current.failedItems)).toBe(true);
    expect(result.current.failedItems.length).toBe(0);
    expect(typeof result.current.clearFailedItems).toBe('function');
    expect(typeof result.current.clear).toBe('function');
    unmount();
  });

  it('should process items correctly', async () => {
    const value1 = 'test1';
    const value2 = 'test2';
    const { result, unmount } = renderUseQueue();
    act(() => {
      result.current.push(create(value1));
    });
    expect(result.current.length).toBe(1);
    expect(result.current.processingCount).toBe(1);
    expect(result.current.onHoldCount).toBe(0);
    expect(result.current.totalItems).toBe(1);
    act(() => {
      result.current.push(create(value2));
    });
    expect(result.current.length).toBe(2);
    expect(result.current.processingCount).toBe(2);
    expect(result.current.onHoldCount).toBe(0);
    expect(result.current.totalItems).toBe(2);
    await act(async () => {
      await complete(value1);
    });
    expect(result.current.length).toBe(1);
    expect(result.current.processingCount).toBe(1);
    expect(result.current.onHoldCount).toBe(0);
    expect(result.current.totalItems).toBe(2);
    await act(async () => {
      await complete(value2);
    });
    expect(result.current.length).toBe(0);
    expect(result.current.processingCount).toBe(0);
    expect(result.current.onHoldCount).toBe(0);
    expect(result.current.totalItems).toBe(2);
    expect(result.current.failedItems.length).toBe(0);
    unmount();
  });

  it('should accept a max number of items', async () => {
    const maxItems = 3;
    const values = Array.from(Array(maxItems).keys()).map((i) => `value-${i}`);
    const { result, unmount } = renderUseQueue({ maxItems });
    expect(result.current.isFull).toBe(false);
    act(() => {
      values.forEach((value) => result.current.push(create(value)));
    });
    expect(result.current.isFull).toBe(true);
    expect(() => result.current.push(create('test'))).toThrowError();
    await act(async () => {
      await Promise.all(values.map((value) => complete(value)));
    });
    expect(result.current.isFull).toBe(false);
    await act(async () => {
      const value = 'test';
      expect(() => result.current.push(create(value))).not.toThrowError();
      await complete(value);
    });
    unmount();
  });

  it('should accept a max number of processing items', async () => {
    const maxProcessingItems = 2;
    const values = Array.from(Array(maxProcessingItems).keys()).map((i) => `value-${i}`);
    const { result, unmount } = renderUseQueue({ maxProcessingItems });
    expect(result.current.processingCount).toBe(0);
    expect(result.current.onHoldCount).toBe(0);
    expect(result.current.isAtMaxProcessing).toBe(false);
    act(() => {
      values.forEach((value) => result.current.push(create(value)));
    });
    expect(result.current.processingCount).toBe(maxProcessingItems);
    expect(result.current.onHoldCount).toBe(0);
    expect(result.current.isAtMaxProcessing).toBe(true);
    act(() => {
      result.current.push(create(`value-${maxProcessingItems}`));
    });
    expect(result.current.processingCount).toBe(maxProcessingItems);
    expect(result.current.onHoldCount).toBe(1);
    expect(result.current.isAtMaxProcessing).toBe(true);
    await act(async () => {
      await complete('value-0');
    });
    expect(result.current.processingCount).toBe(maxProcessingItems);
    expect(result.current.onHoldCount).toBe(0);
    expect(result.current.isAtMaxProcessing).toBe(true);
    await act(async () => {
      await complete('value-1');
    });
    expect(result.current.processingCount).toBe(maxProcessingItems - 1);
    expect(result.current.onHoldCount).toBe(0);
    expect(result.current.isAtMaxProcessing).toBe(false);
    unmount();
  });

  it('should be able to store failed items', async () => {
    const values = ['test1', 'test2', 'test3'];
    const { result, unmount } = renderUseQueue({ storeFailedItems: true });
    expect(result.current.failedItems.length).toBe(0);
    act(() => {
      values.forEach((value) => result.current.push(create(value)));
    });
    expect(result.current.length).toBe(3);
    expect(result.current.processingCount).toBe(3);
    expect(result.current.totalItems).toBe(3);
    expect(result.current.failedItems.length).toBe(0);
    const err0 = new Error('test');
    await act(async () => {
      await fail(values[0], err0);
    });
    expect(result.current.length).toBe(2);
    expect(result.current.processingCount).toBe(2);
    expect(result.current.totalItems).toBe(3);
    expect(result.current.failedItems.length).toBe(1);
    expect(result.current.failedItems[0].item).toBe(values[0]);
    expect(result.current.failedItems[0].error).toBe(err0);
    const err1 = 'err1';
    await act(async () => {
      await fail(values[1], err1);
      await fail(values[2]);
    });
    expect(result.current.length).toBe(0);
    expect(result.current.processingCount).toBe(0);
    expect(result.current.totalItems).toBe(3);
    expect(result.current.failedItems.length).toBe(3);
    expect(result.current.failedItems).toContainEqual({ item: values[1], error: err1 });
    expect(result.current.failedItems).toContainEqual({ item: values[2] });
    act(() => {
      result.current.clearFailedItems([values[0], values[1]]);
    });
    expect(result.current.totalItems).toBe(3);
    expect(result.current.failedItems.length).toBe(1);
    expect(result.current.failedItems[0].item).toBe(values[2]);
    act(() => {
      result.current.clearFailedItems([values[2]]);
    });
    expect(result.current.totalItems).toBe(3);
    expect(result.current.failedItems.length).toBe(0);
    unmount();
  });

  it('should call the onItemComplete callback when an item completes', async () => {
    const onItemComplete = jest.fn();
    const onItemFail = jest.fn();
    const { result, unmount } = renderUseQueue({ onItemComplete, onItemFail });
    const value = 'testValue';
    await act(async () => {
      result.current.push(create(value));
      await complete(value);
    });
    expect(onItemComplete).toHaveBeenCalledWith(value);
    expect(onItemFail).not.toHaveBeenCalled();
    unmount();
  });

  it('should call the onItemFail callback when an item fails', async () => {
    const onItemComplete = jest.fn();
    const onItemFail = jest.fn();
    const { result, unmount } = renderUseQueue({ onItemComplete, onItemFail });
    const value = 'testValue';
    await act(async () => {
      result.current.push(create(value));
      await fail(value);
    });
    expect(onItemFail).toHaveBeenCalledWith(value);
    expect(onItemComplete).not.toHaveBeenCalled();
    unmount();
  });

  it('should properly clear the queue when the clear function is called', async () => {
    const onItemComplete = jest.fn();
    const onItemFail = jest.fn();
    const { result, unmount } = renderUseQueue({
      storeFailedItems: true,
      onItemComplete,
      onItemFail,
    });
    const valueSuccess1 = 'testSuccess1';
    const valueSuccess2 = 'testSuccess2';
    const valueFail = 'testFail';
    await act(async () => {
      result.current.push(create(valueSuccess1));
      result.current.push(create(valueSuccess2));
      result.current.push(create(valueFail));
      await complete(valueSuccess1);
    });
    expect(onItemComplete).toHaveBeenCalledTimes(1);
    expect(result.current.length).toBe(2);
    expect(result.current.processingCount).toBe(2);
    expect(result.current.onHoldCount).toBe(0);
    expect(result.current.totalItems).toBe(3);
    expect(result.current.failedItems.length).toBe(0);
    act(() => {
      result.current.clear();
    });
    expect(result.current.length).toBe(0);
    expect(result.current.processingCount).toBe(0);
    expect(result.current.onHoldCount).toBe(0);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.failedItems.length).toBe(0);
    await act(async () => {
      await complete(valueSuccess2);
      await fail(valueFail);
    });
    expect(result.current.length).toBe(0);
    expect(result.current.processingCount).toBe(0);
    expect(result.current.onHoldCount).toBe(0);
    expect(result.current.onHoldCount).toBe(0);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.failedItems.length).toBe(1);
    expect(onItemComplete).toHaveBeenCalledTimes(2);
    expect(onItemFail).toHaveBeenCalledTimes(1);
    unmount();
  });

  it('should cancel the ongoing processings when clear is called with cancelProcessing = true', async () => {
    const onItemComplete = jest.fn();
    const onItemFail = jest.fn();
    const { result, unmount } = renderUseQueue({
      storeFailedItems: true,
      onItemComplete,
      onItemFail,
    });
    const valueSuccess = 'testSuccess';
    const valueFail = 'testFail';
    await act(async () => {
      result.current.push(create(valueSuccess));
      result.current.push(create(valueFail));
    });
    expect(result.current.length).toBe(2);
    expect(result.current.processingCount).toBe(2);
    expect(result.current.onHoldCount).toBe(0);
    expect(result.current.totalItems).toBe(2);
    expect(result.current.failedItems.length).toBe(0);
    act(() => {
      result.current.clear(true);
    });
    expect(result.current.length).toBe(0);
    expect(result.current.processingCount).toBe(0);
    expect(result.current.onHoldCount).toBe(0);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.failedItems.length).toBe(0);
    await act(async () => {
      await complete(valueSuccess);
      await fail(valueFail);
    });
    expect(result.current.length).toBe(0);
    expect(result.current.processingCount).toBe(0);
    expect(result.current.onHoldCount).toBe(0);
    expect(result.current.onHoldCount).toBe(0);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.failedItems.length).toBe(0);
    expect(onItemComplete).not.toHaveBeenCalled();
    expect(onItemFail).not.toHaveBeenCalled();
    unmount();
  });
});
