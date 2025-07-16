jest.mock('../../src/components/DynamicSVG/', () => ({
  DynamicSVG: jest.fn(() => <></>),
}));
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { IconVerticalPosition } from '../../src/components/IconVerticalPosition';
import { assets } from '../../src/components/IconVerticalPosition/assets';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { DynamicSVG } from '../../src';
import { CameraHeight } from '@monkvision/types';
import { IconVerticalPositionVariant } from '../../src/components/IconVerticalPosition/IconVerticalPosition.types';

describe('IconVerticalPosition', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const { MONK_LOW_SVG, MID_SVG, HIGH_SVG } = assets;

  it('renders without crashing', () => {
    const { container } = render(<IconVerticalPosition />);
    expect(container).toBeInTheDocument();
  });

  it('renders default MID position when no position is provided', () => {
    const { unmount } = render(<IconVerticalPosition />);

    expectPropsOnChildMock(DynamicSVG, { svg: MID_SVG });

    unmount();
  });

  it('renders the PRIMARY variant when no variant is provided', () => {
    const { unmount } = render(<IconVerticalPosition position={CameraHeight.HIGH} />);

    expectPropsOnChildMock(DynamicSVG, { svg: HIGH_SVG });

    unmount();
  });

  it('renders the correct SVG based on position and variant', () => {
    const { unmount } = render(
      <IconVerticalPosition
        position={CameraHeight.LOW}
        variant={IconVerticalPositionVariant.SECONDARY}
      />,
    );

    expect(DynamicSVG).toHaveBeenCalled();
    expectPropsOnChildMock(DynamicSVG, { svg: MONK_LOW_SVG });

    unmount();
  });
});
