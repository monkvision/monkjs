import { render, screen } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import { Counter } from '../../src/components';
import { CaptureMode } from '../../src/types';

describe('Counter component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display the sight count if the capture mode is Sight', () => {
    const totalSights = 51;
    const sightsTaken = 12;
    const { unmount } = render(
      <Counter mode={CaptureMode.SIGHT} totalSights={totalSights} sightsTaken={sightsTaken} />,
    );

    expect(screen.queryByText(`${sightsTaken} / ${totalSights}`)).not.toBeNull();

    unmount();
  });

  it('should display the proper labels for the AddDamage modes', () => {
    const label = 'fake-label';
    const tMock = jest.fn(() => label);
    (useTranslation as jest.Mock).mockImplementation(() => ({ t: tMock }));
    const { unmount, rerender } = render(<Counter mode={CaptureMode.ADD_DAMAGE_1ST_SHOT} />);

    expect(tMock).toHaveBeenCalledWith('photo.hud.addDamage.damagedPartCounter');
    expect(screen.queryByText(label)).not.toBeNull();

    rerender(<Counter mode={CaptureMode.ADD_DAMAGE_2ND_SHOT} />);
    expect(tMock).toHaveBeenCalledWith('photo.hud.addDamage.closeupPictureCounter');
    expect(screen.queryByText(label)).not.toBeNull();

    (useTranslation as jest.Mock).mockRestore();
    unmount();
  });
});
