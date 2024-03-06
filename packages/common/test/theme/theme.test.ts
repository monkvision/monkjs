import { MonkPalette } from '@monkvision/types';
import { createTheme, MonkDefaultPalette } from '../../src';
import { accentColorNames, getExpectedOutput, getInputName, inputs } from '../__utils__';

describe('createTheme function', () => {
  it('should return the default palette if no palette is provided', () => {
    const themeNoParam = createTheme();
    const themeNoPalette = createTheme({});

    expect(themeNoParam.palette).toEqual(themeNoPalette.palette);
    expect(themeNoParam).toEqual({
      palette: MonkDefaultPalette,
      utils: expect.any(Object),
    });
  });

  it('should fill a partial palette from the default palette', () => {
    const partialPalette: Partial<MonkPalette> = {
      alert: {
        xdark: 'test-xdark',
        dark: 'test-dark',
        base: 'test-base',
        light: 'test-light',
        xlight: 'test-xlight',
      },
    };

    const theme = createTheme({ palette: partialPalette });

    expect(theme).toEqual({
      palette: {
        ...MonkDefaultPalette,
        ...partialPalette,
      },
      utils: expect.any(Object),
    });
  });

  describe('create theme utils', () => {
    describe('getColor function', () => {
      it('should return the color value from the palette when provided a valid color name', () => {
        const partialPalette: Partial<MonkPalette> = {
          alert: {
            xdark: 'test-xdark',
            dark: 'test-dark',
            base: 'test-base',
            light: 'test-light',
            xlight: 'test-xlight',
          },
        };

        const { palette, utils } = createTheme({ palette: partialPalette });

        inputs.forEach((input) => {
          const color = utils.getColor(getInputName(input));
          expect(color).toEqual(getExpectedOutput(palette, input));
        });
      });

      it('should return the base color for accent color names with no variant', () => {
        const { palette, utils } = createTheme();

        accentColorNames.forEach((name) => {
          const color = utils.getColor(name);
          expect(color).toEqual(getExpectedOutput(palette, { name, variant: 'base' }));
        });
      });

      it('should return the input directly if it is not a recognized color name', () => {
        const { utils } = createTheme();
        const testValues = [
          '#FF590E',
          'rgb(122, 200, 122)',
          'rgba(122, 134, 122, 1)',
          'transparent',
          'test-value',
        ];

        testValues.forEach((value) => {
          expect(utils.getColor(value)).toEqual(value);
        });
      });
    });
  });
});
