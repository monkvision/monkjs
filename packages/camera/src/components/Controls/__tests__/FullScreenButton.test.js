import React from 'react';
import { render, screen } from '@testing-library/react-native';
import '@testing-library/jest-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n';
import FullScreenButton from '../FullScreenButton';

describe('Fullscreen Button component', () => {
  it('renders the correct label', () => {
    render(
      <I18nextProvider>
        <FullScreenButton i18n={i18n} />
      </I18nextProvider>,
    );
    expect(screen.getByText('Fullscreen')).toBeTruthy();
  });
});
