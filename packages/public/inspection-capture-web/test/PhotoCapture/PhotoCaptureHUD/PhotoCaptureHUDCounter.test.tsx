import { render, screen } from '@testing-library/react';
import { PhotoCaptureHUDCounter } from '../../../src';
import { PhotoCaptureMode } from '../../../src/PhotoCapture/hooks';
import { useTranslation } from 'react-i18next';

describe('PhotoCaptureHUDCounter component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display the sight count if the capture mode is Sight', () => {
    const totalSights = 51;
    const sightsTaken = 12;
    const { unmount } = render(
      <PhotoCaptureHUDCounter
        mode={PhotoCaptureMode.SIGHT}
        totalSights={totalSights}
        sightsTaken={sightsTaken}
      />,
    );

    expect(screen.queryByText(`${sightsTaken} / ${totalSights}`)).not.toBeNull();

    unmount();
  });

  it('should display the proper labels for the AddDamage modes', () => {
    const label = 'fake-label';
    const tMock = jest.fn(() => label);
    (useTranslation as jest.Mock).mockImplementation(() => ({ t: tMock }));
    const { unmount, rerender } = render(
      <PhotoCaptureHUDCounter mode={PhotoCaptureMode.ADD_DAMAGE_1ST_SHOT} />,
    );

    expect(tMock).toHaveBeenCalledWith('photo.hud.addDamage.damagedPartCounter');
    expect(screen.queryByText(label)).not.toBeNull();

    rerender(<PhotoCaptureHUDCounter mode={PhotoCaptureMode.ADD_DAMAGE_2ND_SHOT} />);
    expect(tMock).toHaveBeenCalledWith('photo.hud.addDamage.closeupPictureCounter');
    expect(screen.queryByText(label)).not.toBeNull();

    (useTranslation as jest.Mock).mockRestore();
    unmount();
  });
});
