import { log, noop } from '../utils';

export const ON_CALLBACKS = ['start', 'success', 'error', 'end'];

export default class Callbacks {
  /**
   * @param handlers {function[]}
   * @param title {string}
   */
  constructor(handlers, title = 'untitled') {
    const [
      handleSuccess,
      handleError,
      handleStart = noop,
      handleEnd = noop,
    ] = handlers;

    if (typeof handleSuccess !== 'function' || typeof handleError !== 'function') {
      throw Error(`
        Callbacks instance should have at least
        {handleSuccess} and {handleError} handlers,
        because there is a try and a catch.
        <code>
          const callbacks = new Callbacks([handleSuccess, handleError], 'getSomethingAsync');
        </code>
      `);
    }

    this.start = handleStart;
    this.success = handleSuccess;
    this.error = handleError;
    this.end = handleEnd;
    this.title = title;
  }

  static validate(paramName, value) {
    switch (paramName) {
      case 'on':
        if (!ON_CALLBACKS.includes(value)) {
          throw Error(`Invalid "on" type. Must be one of {${ON_CALLBACKS.join('|')}}`);
        }
        break;
      case 'handle':
        if (typeof value !== 'function') {
          throw Error(`Invalid "handle" callback. Must be a function`);
        }
        break;
      default:
        throw Error(`Invalid "paramName". Must be a one of {on|callback}`);
    }
  }

  /**
   * @returns {string}
   */
  get title() {
    return this.title;
  }

  /**
   * @param value {string}
   */
  set title(value) {
    if (typeof value !== 'string') {
      throw Error(`Invalid "value" param. Must be a string`);
    }

    this.title = value;
  }

  /**
   * @param on
   * @param handle
   */
  set callback([on, handle]) {
    Callbacks.validate('on', on);
    Callbacks.validate('handle', handle);

    this[on] = handle;
  }

  /**
   * @param on
   * @param payload
   */
  run([on, payload]) {
    const handle = this[on];

    if (handle !== undefined) {
      log(`Running ${handle} callback for function: ${this.title}`);
      Callbacks.validate('handle', handle);
      handle(payload);
    }
  }

  onStart(payload) {
    this.run(['start', payload]);
  }

  onSuccess(payload) {
    this.run(['success', payload]);
  }

  onError(payload) {
    this.run(['error', payload]);
  }

  onEnd(payload) {
    this.run(['end', payload]);
  }
}
