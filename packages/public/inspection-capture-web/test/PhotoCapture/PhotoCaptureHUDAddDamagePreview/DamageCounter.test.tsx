import { render, screen } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import { DamageCounter } from '../../../src/PhotoCapture/PhotoCaptureHUDAddDamagePreview/DamageCounter';
import { AddDamagePreviewMode } from '../../../src/PhotoCapture/hooks';

describe('DamageCounter component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call useTranslation hook and use t function from it', () => {
    const { unmount } = render(
      <DamageCounter addDamagePreviewMode={AddDamagePreviewMode.DEFAULT} />,
    );

    const { t } = (useTranslation as jest.Mock).mock.results[0].value;
    expect(t).toHaveBeenCalled();

    unmount();
  });

  it('should render the default text value', () => {
    const { unmount } = render(
      <DamageCounter addDamagePreviewMode={AddDamagePreviewMode.DEFAULT} />,
    );

    const counterText = screen.getByTestId('damage-counter').textContent;
    expect(counterText).toEqual('1 / 2 • photo.hud.addDamage.damagedPart');

    unmount();
  });

  it('should render the addDamageMode Closeup preview text value', () => {
    const { unmount } = render(
      <DamageCounter addDamagePreviewMode={AddDamagePreviewMode.CLOSEUP_PREVIEW} />,
    );

    const counterText = screen.getByTestId('damage-counter').textContent;
    expect(counterText).toEqual('2 / 2 • photo.hud.addDamage.closeupPicture');

    unmount();
  });
});
