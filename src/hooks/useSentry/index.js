import { Platform } from 'react-native';
import Sentry from '../../config/sentry';
import { transaction } from '../../config/sentryPlatform';

export default function useSentry() {
  const Constants = {
    type: {
      UPLOAD: 'upload',
      CAMERA: 'camera',
      CORE: 'core',
    },
  };

  class Span {
    constructor(name, op) {
      const t = transaction(name);
      this.transaction = t;
      this.span = t.startChild({ op });
    }

    finish() {
      this.span.finish();
      this.transaction.finish();
    }
  }

  /**
   * @param error {Error} - Caught error to send to Sentry.io
   * @param type {string} - tag of the error's type
   * @param extras {Record} - Useful information that can be sent (request's body for example)
   * @param additionalTags - (Optional) Additional tags to add to the error
   */
  const captureException = (error, type, extras = {}, additionalTags = {}) => (
    Platform.select({
      native: Sentry.Native,
      web: Sentry.Browser,
    })
      .captureException(error, (scope) => {
        scope.setTags({ type, ...additionalTags });
        scope.setExtras(extras);

        return scope;
      })
  );

  return { captureException, Constants, Span };
}
