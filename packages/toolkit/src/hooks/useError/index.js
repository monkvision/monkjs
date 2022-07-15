import { Platform } from 'react-native';

export const SpanConstants = {
  type: {
    UPLOAD: 'upload', // logs linked to the upload
    CAMERA: 'camera', // logs linked to the camera
    FUNC: 'func', // logs linked to a function
    APP: 'app', // logs linked to the application
    HTTP: 'http', // logs linked to the api
  },
  operation: {
    HTTP: 'http',
    USER_TIME: 'user-time-per-action',
    USER_CAMERA_TIME: 'user-camera-time',
    USER_UPLOAD_CENTER_TIME: 'user-upload-center-time',
    USER_ACTION: 'user-action',
    RESPONSE_TIME: 'response-time',
    FUNC: 'func',
  },
};

export default function useError(Sentry) {
  class Span {
    constructor(name, op) {
      if (!Sentry) { throw new Error('Sentry is null'); }
      const t = Platform.select({ web: Sentry.Browser, native: Sentry.Native })
        .startTransaction({ name, op });
      this.transaction = t;
      this.spans = {};
      this.spans[op] = t.startChild({ op });
    }

    addDataToSpan(op, type, data) {
      this.transaction.setData(type, data);
    }

    addSpanToTransaction(op) {
      this.spans[op] = this.transaction.startChild({ op });
    }

    finishSpan(op) {
      this.spans[op].finish();
    }

    finish() {
      Object.values((span) => { span.finish(); });
      this.transaction.finish();
    }
  }

  /**
   * @param error {Error} - Caught error to send to Sentry.io
   * @param type {string} - tag of the error's type
   * @param extras {Record} - Useful information that can be sent (request's body for example)
   * @param additionalTags - (Optional) Additional tags to add to the error
   */
  const errorHandler = (error, type, extras = {}, additionalTags = {}) => {
    if (!Sentry || (!Sentry?.Browser && !Sentry?.Native)) { return null; }

    return Platform.select({
      native: Sentry.Native,
      web: Sentry.Browser,
    })
      .captureException(error, (scope) => {
        scope.setTags({ type, ...additionalTags });
        scope.setExtras(extras);

        return scope;
      });
  };

  return { errorHandler, Span };
}
