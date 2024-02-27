jest.mock('react');

import { MonkTheme } from '@monkvision/types';
import React from 'react';
import { MonkThemeContext, useMonkTheme } from '../../src';

describe('useMonkTheme hook', () => {
  it('should return the MonkThemeContext', () => {
    const context = {
      palette: {
        alert: {
          base: 'test',
        },
      },
    } as MonkTheme;
    (React.useContext as jest.Mock).mockImplementation(() => context);
    const spy = jest.spyOn(React, 'useContext');

    const theme = useMonkTheme();

    expect(spy).toHaveBeenCalledWith(MonkThemeContext);
    expect(theme).toBe(context);
  });
});
