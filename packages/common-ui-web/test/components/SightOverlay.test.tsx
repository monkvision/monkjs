jest.mock('../../src/components/DynamicSVG', () => ({
  DynamicSVG: jest.fn(() => <></>),
}));

import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { render } from '@testing-library/react';
import { Sight } from '@monkvision/types';
import { DynamicSVG, SightOverlay } from '../../src';

describe('SightOverlay component', () => {
  const sight = { overlay: 'test-overlay' } as unknown as Sight;

  it('should display a DynamicSVG component', () => {
    const { unmount } = render(<SightOverlay sight={sight} />);

    expect(DynamicSVG).toHaveBeenCalled();
    unmount();
  });

  it('should pass the sight overlay to the DynamicSVG component', () => {
    const { unmount } = render(<SightOverlay sight={sight} />);

    expectPropsOnChildMock(DynamicSVG, { svg: sight.overlay });
    unmount();
  });

  it('should pass other props down to the DynamicSVG component', () => {
    const otherProps = { width: 123, getAttributes: jest.fn() };
    const { unmount } = render(<SightOverlay sight={sight} {...otherProps} />);

    expectPropsOnChildMock(DynamicSVG, otherProps);
    unmount();
  });
});
