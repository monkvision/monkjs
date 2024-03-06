import { isMobileDevice } from '../../src';

describe('isMobileDevice', () => {
  it('should return true for mobile user agents', () => {
    jest.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue('iphone');

    const result = isMobileDevice();
    expect(result).toBe(true);
  });

  it('should return false for non-mobile user agents', () => {
    jest.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue('safari');

    const result = isMobileDevice();
    expect(result).toBe(false);
  });
});
