const DYNAMIC_SVG_TEST_ID = 'dynamic-svg';
const DynamicSVGMock = jest.fn(() => <div data-testid={DYNAMIC_SVG_TEST_ID}></div>);

jest.mock('../../src/components/DynamicSVG', () => ({
  DynamicSVG: DynamicSVGMock,
}));

import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { render, screen } from '@testing-library/react';
import { Sight } from '@monkvision/types';
import { SightOverlay } from '../../src';

describe('SightOverlay component', () => {
  const sight = { overlay: 'test-overlay' } as unknown as Sight;

  it('should display a DynamicSVG component', () => {
    const { unmount } = render(<SightOverlay sight={sight} />);

    expect(screen.queryByTestId(DYNAMIC_SVG_TEST_ID)).toBeDefined();
    unmount();
  });

  it('should pass the sight overlay to the DynamicSVG component', () => {
    const { unmount } = render(<SightOverlay sight={sight} />);

    expectPropsOnChildMock(DynamicSVGMock, { svg: sight.overlay });
    unmount();
  });

  it('should pass other props down to the DynamicSVG component', () => {
    const otherProps = { width: 123, getAttributes: jest.fn() };
    const { unmount } = render(<SightOverlay sight={sight} {...otherProps} />);

    expectPropsOnChildMock(DynamicSVGMock, otherProps);
    unmount();
  });
});
