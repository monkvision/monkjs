import { mockButtonDependencies } from './mocks';

mockButtonDependencies();

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Button } from '../../../src';

const BUTTON_TEST_ID = 'monk-btn';

describe('Outline variant', () => {
  it('should have a border with the proper color', () => {
    const foregroundColor = '#101010';
    const { unmount } = render(<Button variant='outline' primaryColor={foregroundColor} />);
    expect(screen.getByTestId(BUTTON_TEST_ID)).toHaveStyle({
      borderWidth: 2,
      borderColor: foregroundColor,
    });
    unmount();
  });

  it('should have the primary color as foreground', () => {
    const primaryColor = '#123456';
    const { unmount } = render(<Button variant='outline' primaryColor={primaryColor} />);
    expect(screen.getByTestId(BUTTON_TEST_ID)).toHaveStyle({ color: primaryColor });
    unmount();
  });

  it('should have the secondary color as background', () => {
    const secondaryColor = '#654321';
    const { unmount } = render(<Button variant='outline' secondaryColor={secondaryColor} />);
    expect(screen.getByTestId(BUTTON_TEST_ID)).toHaveStyle({ backgroundColor: secondaryColor });
    unmount();
  });
});
