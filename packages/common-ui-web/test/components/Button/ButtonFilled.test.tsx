import { mockButtonDependencies } from './mocks';

mockButtonDependencies();

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Button } from '../../../src';

const BUTTON_TEST_ID = 'monk-btn';

describe('Filled variant', () => {
  it('should have no border', () => {
    const { unmount } = render(<Button variant='fill' />);
    expect(screen.getByTestId(BUTTON_TEST_ID)).toHaveStyle({
      borderWidth: 0,
    });
    unmount();
  });

  it('should have the primary color as background', () => {
    const primaryColor = '#123456';
    const { unmount } = render(<Button variant='fill' primaryColor={primaryColor} />);
    expect(screen.getByTestId(BUTTON_TEST_ID)).toHaveStyle({ backgroundColor: primaryColor });
    unmount();
  });

  it('should have the secondary color as foreground', () => {
    const secondaryColor = '#654321';
    const { unmount } = render(<Button variant='fill' secondaryColor={secondaryColor} />);
    expect(screen.getByTestId(BUTTON_TEST_ID)).toHaveStyle({ color: secondaryColor });
    unmount();
  });
});
