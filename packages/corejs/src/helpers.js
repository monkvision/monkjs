import mlog from 'mocha-logger';

/**
 * @returns {function(): undefined}
 */
export function noop() {
  return () => undefined;
}

const ON_CALLBACKS = ['start', 'success', 'error', 'end'];
export class Callbacks {
  /**
   * @param handlers {function[]}
   * @param title {string}
   */
  constructor(handlers, title = 'untitled') {
    const [
      handleSuccess,
      handleError,
      handleStart,
      handleEnd,
    ] = handlers;

    this._start = handleStart || noop;
    this._success = handleSuccess || noop;
    this._error = handleError || noop;
    this._end = handleEnd || noop;
    this._title = title;
    this._handlers = handlers;
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

  get handlers() {
    return this._handlers;
  }

  set handlers(value) {
    this._handlers = value;
  }

  get title() {
    return this._title;
  }

  set title(value) {
    if (typeof value !== 'string') {
      throw Error(`Invalid "value" param. Must be a string`);
    }

    this._title = value;
  }

  get start() {
    return this._start;
  }

  set start(value) {
    this._start = value;
  }

  get success() {
    return this._success;
  }

  set success(value) {
    this._success = value;
  }

  get error() {
    return this._error;
  }

  set error(value) {
    this._error = value;
  }

  get end() {
    return this._end;
  }

  set end(value) {
    this._end = value;
  }

  /**
   * @param on
   * @param handle
   */
  setCallback([on, handle]) {
    Callbacks.validate('on', on);
    Callbacks.validate('handle', handle);

    this[`_${on}`] = handle;
  }

  /**
   * @param on
   * @param payload
   */
  run([on, payload]) {
    const handle = this[`_${on}`];

    if (handle !== undefined) {
      mlog.log(`Running ${on} callback for function: ${this.title}`);
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
