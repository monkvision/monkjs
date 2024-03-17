import { HTTPError } from 'ky';
import { beforeError, MonkNetworkError } from '../../src/api/error';

function createMockError(status: number, message: string): HTTPError {
  return {
    name: 'test-name',
    message: 'test-message',
    response: {
      clone: jest.fn(() => ({
        status,
        json: jest.fn(() => Promise.resolve({ message })),
      })),
    },
  } as unknown as HTTPError;
}

describe('Network Api Error utils', () => {
  describe('beforeError Ky hook', () => {
    const beforeErrorTestCases = [
      {
        status: 401,
        messages: ['Authorization header is required'],
        expectedName: MonkNetworkError.MISSING_TOKEN,
        expectedMessage: 'Missing authentication token in request headers',
      },
      {
        status: 401,
        messages: [
          'Token payload schema unknown',
          'Token decode failed',
          'Token audience invalid, please check audience',
          'Token issuer invalid, please check issuer',
          'Wrong authorization header format, should be in the format : Bearer TOKEN',
          'Invalid authentication token in request.',
        ],
        expectedName: MonkNetworkError.INVALID_TOKEN,
        expectedMessage: 'Invalid authentication token in request',
      },
      {
        status: 401,
        messages: ['Token is expired'],
        expectedName: MonkNetworkError.EXPIRED_TOKEN,
        expectedMessage: 'Authentication token is expired',
      },
    ];

    beforeErrorTestCases.forEach((testCase) => {
      it(`should be able to detect ${testCase.expectedName} errors`, async () => {
        for (let i = 0; i < testCase.messages.length; i++) {
          const message = testCase.messages[i];
          // eslint-disable-next-line no-await-in-loop
          const result = await beforeError(createMockError(testCase.status, message));
          expect(result).toEqual(
            expect.objectContaining({
              name: testCase.expectedName,
              message: `${testCase.expectedMessage}.`,
            }),
          );
        }
      });
    });

    it('should put the body of the response in the error object', async () => {
      const message = 'test';
      const result = await beforeError(createMockError(111, message));
      expect(result).toEqual(
        expect.objectContaining({
          body: { message },
        }),
      );
    });

    it('should leave the name and message untouched if the error is not recognized', async () => {
      const result = await beforeError(createMockError(111, 'test'));
      const error = createMockError(111, 'test');
      expect(result).toEqual(
        expect.objectContaining({
          name: error.name,
          message: error.message,
        }),
      );
    });
  });
});
