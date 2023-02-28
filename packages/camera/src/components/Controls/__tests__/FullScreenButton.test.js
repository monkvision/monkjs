import React from 'react';
import { render, screen } from '../../../testUtils/i18Test-utils';
import FullScreenButton from '../FullScreenButton';

describe('Fullscreen Button component', () => {
  it('renders the correct label', () => {
    render(<FullScreenButton />, { withI18: true });
    expect(screen.getByText('Fullscreen')).toBeOnTheScreen();
  });
});
