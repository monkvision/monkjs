import { Sight } from '@monkvision/types';

jest.mock('@monkvision/sights');

import { render } from '@testing-library/react';
import { PhotoCaptureHUDPreview } from '../../src';

const sights = [
  { id: 'id', label: { en: 'en', fr: 'fr', de: 'de' } },
  { id: 'id2', label: { en: 'en2', fr: 'fr2', de: 'de2' } },
] as unknown as Sight[];
const sightsTaken = [...sights].slice(0, 1);
const currentSightSliderIndex = 0;

describe('PhotoCaptureHUDPreview component', () => {
  it('render HUDPreview with no props', () => {
    // TODO: how can I test this?
    const { unmount } = render(
      <PhotoCaptureHUDPreview
        sights={sights}
        currentSight={sights[0]}
        sightsTaken={sightsTaken}
        currentSightSliderIndex={currentSightSliderIndex}
      />,
    );
    unmount();
  });
});
