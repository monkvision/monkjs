jest.mock('../../../src/PhotoCaptureHUD/PhotoCaptureHUDSightPreview/SightsCounter', () => ({
  SightsCounter: jest.fn(() => <></>),
}));
jest.mock('../../../src/PhotoCaptureHUD/PhotoCaptureHUDSightPreview/AddDamageButton', () => ({
  AddDamageButton: jest.fn(() => <></>),
}));
jest.mock('../../../src/PhotoCaptureHUD/PhotoCaptureHUDSightPreview/SightsSlider', () => ({
  SightsSlider: jest.fn(() => <></>),
}));

import { render } from '@testing-library/react';
import { Sight } from '@monkvision/types';
import { PhotoCaptureHUDSightPreview } from '../../../src/PhotoCaptureHUD/PhotoCaptureHUDSightPreview';
import { SightsCounter } from '../../../src/PhotoCaptureHUD/PhotoCaptureHUDSightPreview/SightsCounter';
import { SightsSlider } from '../../../src/PhotoCaptureHUD/PhotoCaptureHUDSightPreview/SightsSlider';
import { AddDamageButton } from '../../../src/PhotoCaptureHUD/PhotoCaptureHUDSightPreview/AddDamageButton';

const sights = [
  { id: 'id', label: { en: 'en', fr: 'fr', de: 'de' } },
  { id: 'id2', label: { en: 'en2', fr: 'fr2', de: 'de2' } },
] as unknown as Sight[];
const sightsTaken = [...sights].slice(0, 1);

describe('PhotoCaptureHUDPreview component', () => {
  it('should render 4 components: SightOverlay, SightsCounter, AddDamageButton, SightsSlider', () => {
    const { unmount } = render(
      <PhotoCaptureHUDSightPreview
        sights={sights}
        sightSelected={sights[0]}
        sightsTaken={sightsTaken}
      />,
    );

    expect(SightsCounter).toHaveBeenCalled();
    expect(AddDamageButton).toHaveBeenCalled();
    expect(SightsSlider).toHaveBeenCalled();
    unmount();
  });
});
