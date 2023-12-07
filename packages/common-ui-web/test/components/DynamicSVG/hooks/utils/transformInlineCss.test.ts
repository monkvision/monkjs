import { transformInlineCss } from '../../../../../src/components/DynamicSVG/hooks/utils';

describe('transformInlineCss helper function', () => {
  it('should properly map CSS properties', () => {
    const inlineCss = 'height: 200px; border-radius: 600px; background-image: url(test.png)';
    const result = transformInlineCss(inlineCss);
    expect(result).toEqual({
      height: '200px',
      borderRadius: '600px',
      backgroundImage: 'url(test.png)',
    });
  });

  it('should properly map CSS properties even with badly formatted style', () => {
    const inlineCss = '    width  : 200px   ;;; stroke-width    : 2rem;   ;;;;';
    const result = transformInlineCss(inlineCss);
    expect(result).toEqual({
      width: '200px',
      strokeWidth: '2rem',
    });
  });

  it('should capitalize vendor prefixes', () => {
    const inlineCss =
      'transform: none; -webkit-transform: none; -moz-transform: none; -o-transform: none';
    const result = transformInlineCss(inlineCss);
    expect(result).toEqual({
      transform: 'none',
      WebkitTransform: 'none',
      MozTransform: 'none',
      OTransform: 'none',
    });
  });

  it('should not capitalize the MS vendor prefix', () => {
    const inlineCss = 'transform: none; -ms-transform: none';
    const result = transformInlineCss(inlineCss);
    expect(result).toEqual({
      transform: 'none',
      msTransform: 'none',
    });
  });

  it('should return an empty object when provided a null input', () => {
    const result = transformInlineCss(null);
    expect(result).toEqual({});
  });

  it('should return an empty object when provided an undefined input', () => {
    const result = transformInlineCss(undefined);
    expect(result).toEqual({});
  });

  it('should return an empty object when provided an empty string as input', () => {
    const result = transformInlineCss('');
    expect(result).toEqual({});
  });

  it('should throw when provided an invalid CSS', () => {
    expect(() => transformInlineCss('.test { width;')).toThrowError();
  });
});
