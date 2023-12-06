import { decodeMonkJwt } from '../../src/auth';
import { jwtDecode } from 'jwt-decode';

jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(),
}));

describe('Network package JWT utils', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('decodeMonkJwt function', () => {
    it('should call the jwtDecode function with the given token', () => {
      const encoded = 'testestest';
      const decoded = { test: 'coucou' };
      (jwtDecode as jest.Mock).mockImplementation(() => decoded);

      const result = decodeMonkJwt(encoded);

      expect(result).toEqual(decoded);
      expect(jwtDecode).toHaveBeenCalledWith(encoded);
    });
  });
});
