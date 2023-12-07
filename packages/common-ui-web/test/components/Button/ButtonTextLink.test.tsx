import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BUTTON_TEST_ID } from './shared';

import { Button } from '../../../src';

describe('Text Link variant', () => {
  it('should have no border', () => {
    const { unmount } = render(<Button variant='text-link' />);
    expect(screen.getByTestId(BUTTON_TEST_ID)).toHaveStyle({
      borderWidth: 0,
    });
    unmount();
  });

  it('should have no background', () => {
    const { unmount } = render(<Button variant='text-link' />);
    expect(screen.getByTestId(BUTTON_TEST_ID)).toHaveStyle({ backgroundColor: 'transparent' });
    unmount();
  });

  it('should have the primary color as foreground', () => {
    const primaryColor = '#654321';
    const { unmount } = render(<Button variant='text-link' primaryColor={primaryColor} />);
    expect(screen.getByTestId(BUTTON_TEST_ID)).toHaveStyle({ color: primaryColor });
    unmount();
  });
});
