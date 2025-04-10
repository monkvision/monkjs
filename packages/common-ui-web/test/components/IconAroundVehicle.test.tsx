jest.mock('../../src/components/DynamicSVG/', () => ({
  DynamicSVG: jest.fn(() => <></>),
}));
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { IconAroundVehicle } from '../../src/components/IconAroundVehicle/IconAroundVehicle';
import { assets } from '../../src/components/IconAroundVehicle/assets';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { DynamicSVG } from '../../src';

describe('IconAroundVehicle', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const { CAR_SVG, CIRCLE_SVG, POV_SVG } = assets;

  it('renders without crashing', () => {
    const { container } = render(<IconAroundVehicle />);
    expect(container).toBeInTheDocument();
  });

  it('renders the car and POV icon', () => {
    const { unmount } = render(<IconAroundVehicle />);

    expect(DynamicSVG).toHaveBeenCalledTimes(3);
    expectPropsOnChildMock(DynamicSVG, { svg: CAR_SVG });
    expectPropsOnChildMock(DynamicSVG, { svg: POV_SVG });
    expectPropsOnChildMock(DynamicSVG, { svg: CIRCLE_SVG });

    unmount();
  });

  it('renders the circle icon when showCircle is true', () => {
    const { unmount } = render(<IconAroundVehicle showCircle={true} />);

    expect(DynamicSVG).toHaveBeenCalledTimes(3);

    unmount();
  });
});
