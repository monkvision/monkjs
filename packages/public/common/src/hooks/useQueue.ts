import { useMemo, useRef, useState } from 'react';

/**
 * Type definition for the processing function of a queue.
 */
export type ProcessingFunction<T> = (item: T) => Promise<void>;

/**
 * The options that can be used to configure a processing queue using the `useQueue` hook.
 *
 * @see useQueue
 * @see Queue
 */
export interface QueueOptions<T> {
  /**
   * If this value is set, the queue will have a maximum number of items. Trying to push an item in the queue while the
   * queue is full will result in an error being thrown. You can know if the queue is full using the `queue.isFull`
   * property.
   *
   * @see Queue.isFull
   */
  maxItems?: number;
  /**
   * If this value is set, the queue will have a maximum number of items being processed at the same time. Trying to
   * push an item in the queue while the queue is at max processing will result in the item being put on hold until more
   * space is available in the processing queue. You can know if the queue is at max processing using the
   * `queue.isAtMaxProcessing` property.
   *
   * @see Queue.isAtMaxProcessing
   */
  maxProcessingItems?: number;
  /**
   * Boolean indicating if the queue should store the items for which the processing failed (i.e. for which the Promise
   * resulting from the processing function for this item rejected). Items will be stored in the `queue.failedItems`
   * array, and this array can be cleared using the `queue.clearFailedItems` function.
   *
   * @default false
   * @see Queue.failedItems
   * @see Queue.clearFailedItems
   */
  storeFailedItems?: boolean;
  /**
   * Callback that will be called when the processing of an item successfully completes.
   */
  onItemComplete?: (item: T) => void;
  /**
   * Callback that will be called when the processing of an item fails.
   */
  onItemFail?: (item: T) => void;
}

/**
 * Object containing details on an item in the processing queue for which the processing failed (the Promise resulting
 * from the process function rejected).
 */
export interface QueueFailedItem<T> {
  /**
   * This item for which the processing failed.
   */
  item: T;
  /**
   * This value contains the rejection value of the processing function that caused the item to fail.
   */
  error?: unknown;
}

/**
 * This object is a processing queue created by the `useQueue` hook. This queue works as an aynchronous FIFO (First In,
 * First Out) processing queue, where items are processed in parallel. You can configure this queue using the options
 * (`QueueOptions`) passed as the second parameter of the `useQueue` hook.
 *
 * @see QueueOptions
 */
export interface Queue<T> {
  /**
   * The length of the queue. This number represents the total number of items currently in the queue (being processed
   * or being on hold).
   */
  length: number;
  /**
   * This number represents the total number of items currently being processed in the queue.
   */
  processingCount: number;
  /**
   * If `options.maxProcessingItems` is set, when pushing a new item in the queue while the queue is at max processing,
   * the item will be put on hold until the total number of items being processed goes below the maximum. This number
   * indicates the total number of items currently on hold in the queue.
   *
   * @see QueueOptions.maxProcessingItems
   * @see Queue.isAtMaxProcessing
   */
  onHoldCount: number;
  /**
   * This number indicates the total number of items that were pushed to the queue since the queue creation or since the
   * last queue clear.
   */
  totalItems: number;
  /**
   * If `options.maxItems` is set, this boolean will be set to `true` if the length of the queue is at its maximum.
   *
   * @see QueueOptions.maxItems
   */
  isFull: boolean;
  /**
   * If `options.maxProcessingItems` is set, this boolean will be set to `true` if the total number of items being
   * processed by the queue is at its maximum.
   *
   * @see QueueOptions.maxProcessingItems
   */
  isAtMaxProcessing: boolean;
  /**
   * This method is used to push an item in the queue.
   *
   * *Notes :*
   * - If `options.maxItems` is set and the queue is full, this method will throw an error.
   * - If `options.maxProcessingItems` is set and the queue is at max processing, this method will push the item and put
   * it on hold until more space in the processing queue is available.
   */
  push: (item: T) => void;
  /**
   * If `options.storeFailedItems` is set to `true`, this array contains every item for which the processing promise
   * rejected, along with their respective rejection values. This array can be cleared using the
   * `queue.clearFailedItems` function.
   *
   * @see QueueOptions.storeFailedItems
   * @see Queue.clearFailedItems
   */
  failedItems: QueueFailedItem<T>[];
  /**
   * This method is used to remove some items from the `failedItems` array.
   *
   * @see QueueOptions.storeFailedItems
   * @see Queue.failedItems
   */
  clearFailedItems: (items: T[]) => void;
  /**
   * This method is used to completely clear the queue and reset its state to the initial one. The boolean passed as the
   * parameter of this function indicates wether or not the ongoing processing should also be canceled or not :
   *
   * - If set to `false` (the default value), when items that were still being processed when the queue was cleared are
   * finished being processed, they wil still be treated by the end routines (`options.onItemComplete` and
   * `options.onItemFail` will be called, and failed items will be added to the `failedItems` array if
   * `options.storeFailedItems` is used).
   * - If set to `true`, even items that will be finished processing *after* the queue was cleared will not be
   * treated by the end routines (`options.onItemComplete` and `options.onItemFail` will **not** be called etc.).
   */
  clear: (cancelProcessing?: boolean) => void;
}

interface QueueState<T> {
  processedItems: T[];
  itemsOnHold: T[];
  canceledItems: T[];
  options: QueueOptions<T>;
}

const defaultOptions: QueueOptions<unknown> = {
  storeFailedItems: false,
};

/**
 * This hook is used to create a processing queue. The `process` function passed as a parameter is an async function
 * that is used to process items in the queue. You can find more details on how the queue works by taking a look at the
 * TSDoc of the `Queue` interface.
 *
 * @see Queue
 * @see QueueOptions
 */
export function useQueue<T>(
  process: ProcessingFunction<T>,
  optionsParams?: QueueOptions<T>,
): Queue<T> {
  const [processedItems, setProcessedItems] = useState<T[]>([]);
  const [itemsOnHold, setItemsOnHold] = useState<T[]>([]);
  const [canceledItems, setCanceledItems] = useState<T[]>([]);
  const [failedItems, setFailedItems] = useState<QueueFailedItem<T>[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const options = useMemo(() => ({ ...defaultOptions, ...(optionsParams ?? {}) }), [optionsParams]);
  const stateRef = useRef<QueueState<T>>();
  stateRef.current = { processedItems, itemsOnHold, canceledItems, options };

  const clear = (cancelProcessing = false) => {
    if (cancelProcessing) {
      setCanceledItems((items) => [...items, ...processedItems]);
    }
    setProcessedItems([]);
    setItemsOnHold([]);
    setFailedItems([]);
    setTotalItems(0);
  };

  const clearFailedItems = (itemsToClear: T[]) => {
    setFailedItems((items) => items.filter((i) => !itemsToClear.includes(i.item)));
  };

  const processItem = (item: T) => {
    setProcessedItems((items) => [...items, item]);
    return process(item)
      .then(() => {
        if (stateRef.current?.canceledItems.includes(item)) {
          setCanceledItems((items) => items.filter((i) => i !== item));
          return;
        }
        if (stateRef.current?.options.onItemComplete) {
          stateRef.current.options.onItemComplete(item);
        }
      })
      .catch((error) => {
        if (stateRef.current?.canceledItems.includes(item)) {
          setCanceledItems((items) => items.filter((i) => i !== item));
          return;
        }
        if (stateRef.current?.options.storeFailedItems) {
          setFailedItems((items) => [...items, { error, item }]);
        }
        if (stateRef.current?.options.onItemFail) {
          stateRef.current.options.onItemFail(item);
        }
      })
      .finally(() => {
        setProcessedItems((items) => items.filter((i) => i !== item));
      });
  };

  const shiftQueue = () => {
    if (stateRef.current) {
      if (stateRef.current.itemsOnHold.length === 0) {
        return;
      }
      const numberOfItemsToShift =
        stateRef.current.options.maxProcessingItems === undefined
          ? stateRef.current.itemsOnHold.length
          : Math.min(
              stateRef.current.options.maxProcessingItems - stateRef.current.processedItems.length,
              stateRef.current.itemsOnHold.length,
            );
      if (numberOfItemsToShift === 0) {
        return;
      }
      const itemsToShift = stateRef.current.itemsOnHold.slice(0, numberOfItemsToShift);
      itemsToShift.forEach((item) => {
        processItem(item)
          .catch(() => {})
          .finally(() => shiftQueue());
      });
      setItemsOnHold((items) => items.filter((item) => !itemsToShift.includes(item)));
    }
  };

  const push = (item: T) => {
    if (
      options.maxItems !== undefined &&
      processedItems.length + itemsOnHold.length >= options.maxItems
    ) {
      throw new Error('Queue is full.');
    }
    setTotalItems((total) => total + 1);
    if (
      options.maxProcessingItems !== undefined &&
      processedItems.length >= options.maxProcessingItems
    ) {
      setItemsOnHold((items) => [...items, item]);
      return;
    }
    processItem(item)
      .catch(() => {})
      .finally(() => shiftQueue());
  };

  return {
    length: processedItems.length + itemsOnHold.length,
    processingCount: processedItems.length,
    onHoldCount: itemsOnHold.length,
    totalItems,
    isFull:
      options.maxItems !== undefined &&
      processedItems.length + itemsOnHold.length >= options.maxItems,
    isAtMaxProcessing:
      options.maxProcessingItems !== undefined &&
      processedItems.length >= options.maxProcessingItems,
    push,
    failedItems,
    clearFailedItems,
    clear,
  };
}
