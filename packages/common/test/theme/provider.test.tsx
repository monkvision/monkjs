import { fireEvent, render, screen } from '@testing-library/react';
import React, { useState } from 'react';
import { MonkDefaultPalette, MonkThemeProvider, useMonkTheme } from '../../src';
import { getExpectedOutput, getInputName, inputs } from '../__utils__';

function TestComponent() {
  const { palette, utils } = useMonkTheme();
  const [color, setColor] = useState('#FFFFFF');

  return (
    <MonkThemeProvider>
      <div>
        <input
          data-testid='color-input'
          onChange={(event) => setColor(utils.getColor(event.target.value))}
        />
        <div data-testid='color'>{color}</div>
        <div data-testid='primary-xlight'>{palette.primary.xlight}</div>
        <div data-testid='surface-s5'>{palette.surface.s5}</div>
      </div>
    </MonkThemeProvider>
  );
}

describe('MonkThemeProvider component', () => {
  it('should provide the palette in the theme', () => {
    const { unmount } = render(<TestComponent />);

    expect(screen.getByTestId('primary-xlight').textContent).toEqual(
      MonkDefaultPalette.primary.xlight,
    );
    expect(screen.getByTestId('surface-s5').textContent).toEqual(MonkDefaultPalette.surface.s5);
    unmount();
  });

  it('should provide a getColor function in the theme utils', () => {
    const { unmount } = render(<TestComponent />);

    inputs.forEach((input) => {
      fireEvent.change(screen.getByTestId('color-input'), {
        target: { value: getInputName(input) },
      });
      expect(screen.getByTestId('color').textContent).toEqual(
        getExpectedOutput(MonkDefaultPalette, input),
      );
    });
    unmount();
  });
});
