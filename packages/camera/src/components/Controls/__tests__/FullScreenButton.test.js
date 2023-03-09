import React from 'react';
import { render, screen } from '../../../testUtils/wrapper-utils';
import FullScreenButton from '../FullScreenButton';

describe('Fullscreen Button component', () => {
  it('renders the fullscreen-exit label', () => {
    render(<FullScreenButton isInFullScreenMode />);
    expect(screen.getByText('fullscreen-exit')).toBeOnTheScreen();
  });
  it('renders the fullscreen label', () => {
    render(<FullScreenButton isInFullScreenMode={false} />);
    expect(screen.getByText('fullscreen')).toBeOnTheScreen();
  });
});
