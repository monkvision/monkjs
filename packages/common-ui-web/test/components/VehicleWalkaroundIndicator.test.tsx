jest.mock('../../src/components/DynamicSVG/', () => ({
  DynamicSVG: jest.fn(() => <></>),
}));
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { VehicleWalkaroundIndicator, DynamicSVG } from '../../src';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { assets } from '../../src/components/VehicleWalkaroundIndicator/assets';
import { CameraDistance } from '@monkvision/types';

const PROGRESS_BAR_TEST_ID = 'progress-bar';

describe('VehicleWalkaroundIndicator component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const { CAR_SVG, POV_SVG } = assets;

  it('renders without crashing', () => {
    const { container } = render(<VehicleWalkaroundIndicator alpha={0} />);
    expect(container).toBeInTheDocument();
  });

  it('should use 70 for the default size', () => {
    const defaultSize = 70;
    const { container, unmount } = render(<VehicleWalkaroundIndicator alpha={0} />);

    const divEl = container.children.item(0) as HTMLDivElement;
    expect(divEl).toBeDefined();
    expect(divEl.tagName).toEqual('DIV');
    expect(divEl.style.width).toEqual(`${defaultSize}px`);
    expect(divEl.style.height).toEqual(`${defaultSize}px`);

    unmount();
  });

  it('should set the size of the container to the value of the size prop', () => {
    const size = 988;
    const { container, unmount } = render(<VehicleWalkaroundIndicator alpha={0} size={size} />);

    expect(container.children.length).toEqual(1);
    const divEl = container.children.item(0) as HTMLDivElement;
    expect(divEl).toBeDefined();
    expect(divEl.tagName).toEqual('DIV');
    expect(divEl.style.width).toEqual(`${size}px`);
    expect(divEl.style.height).toEqual(`${size}px`);

    unmount();
  });

  it('renders the car and POV icon', () => {
    const { unmount } = render(<VehicleWalkaroundIndicator alpha={0} />);

    expect(DynamicSVG).toHaveBeenCalledTimes(2);
    expectPropsOnChildMock(DynamicSVG, { svg: CAR_SVG });
    expectPropsOnChildMock(DynamicSVG, { svg: POV_SVG });

    unmount();
  });

  it('displays the progress bar when showCircle is true', () => {
    const { unmount } = render(<VehicleWalkaroundIndicator alpha={0} showCircle={true} />);

    expect(screen.queryByTestId(PROGRESS_BAR_TEST_ID)).not.toBeNull();

    unmount();
  });

  it('does not display the progress bar when showProgressBar is false', () => {
    const { unmount } = render(<VehicleWalkaroundIndicator alpha={0} showProgressBar={false} />);

    expect(screen.queryByTestId(PROGRESS_BAR_TEST_ID)).toBeNull();

    unmount();
  });

  it('does not apply car fill attributes when showProgressBar is false', () => {
    const { unmount } = render(<VehicleWalkaroundIndicator alpha={180} showProgressBar={false} />);

    const carProps = (DynamicSVG as jest.Mock).mock.calls.find(
      (call) => call[0].svg === CAR_SVG
    )?.[0];
    
    expect(carProps).toBeDefined();
    expect(carProps.getAttributes).toBeDefined();

    const mockElement1 = {
      getAttribute: jest.fn(() => 'car-fill-stop-1'),
    } as unknown as SVGElement;

    const mockElement2 = {
      getAttribute: jest.fn(() => 'car-fill-stop-2'),
    } as unknown as SVGElement;
    
    const mockElement3 = {
      getAttribute: jest.fn(() => 'car-fill-stop-3'),
    } as unknown as SVGElement;
    
    const attributes1 = carProps.getAttributes(mockElement1);
    const attributes2 = carProps.getAttributes(mockElement2);
    const attributes3 = carProps.getAttributes(mockElement3);
    
    expect(attributes1).toEqual({ offset: '1' });
    expect(attributes2).toEqual({ offset: '1' });
    expect(attributes3).toEqual({ offset: '1' });

    unmount();
  });

  it('applies car fill attributes when showProgressBar is true', () => {
    const { unmount } = render(<VehicleWalkaroundIndicator alpha={180} showProgressBar={true} />);

    const carProps = (DynamicSVG as jest.Mock).mock.calls.find(
      (call) => call[0].svg === CAR_SVG
    )?.[0];
    
    expect(carProps).toBeDefined();
    expect(carProps.getAttributes).toBeDefined();

    const mockElement = {
      getAttribute: jest.fn(() => 'car-fill-stop-2'),
    } as unknown as SVGElement;
    
    const attributes = carProps.getAttributes(mockElement);
    expect(attributes).toHaveProperty('offset');
    expect(typeof attributes.offset).toBe('string');

    unmount();
  });

  it('displays the progress bar by default', () => {
    const { unmount } = render(<VehicleWalkaroundIndicator alpha={180} />);

    expect(screen.queryByTestId(PROGRESS_BAR_TEST_ID)).not.toBeNull();

    unmount();
  });

  it('hides the full bar circle when showCircle is false', () => {
    const { unmount } = render(<VehicleWalkaroundIndicator alpha={90} showCircle={false} />);

    expect(screen.queryByTestId('full-bar')).toBeNull();

    unmount();
  });

  it('shows the full bar circle when showCircle is true', () => {
    const { unmount } = render(<VehicleWalkaroundIndicator alpha={90} showCircle={true} />);

    expect(screen.queryByTestId('full-bar')).not.toBeNull();

    unmount();
  });

  it('passes through additional props to the container div', () => {
    const testId = 'test-container';
    const { container, unmount } = render(
      <VehicleWalkaroundIndicator alpha={0} data-testid={testId} />,
    );

    const divEl = container.children.item(0) as HTMLDivElement;
    expect(divEl).toHaveAttribute('data-testid', testId);

    unmount();
  });

  it('accepts CameraDistance.STANDARD distance prop', () => {
    const { unmount } = render(
      <VehicleWalkaroundIndicator alpha={90} distance={CameraDistance.STANDARD} />,
    );

    expect(DynamicSVG).toHaveBeenCalled();

    unmount();
  });

  it('accepts CameraDistance.CLOSE distance prop', () => {
    const { unmount } = render(
      <VehicleWalkaroundIndicator alpha={90} distance={CameraDistance.CLOSE} />,
    );

    expect(DynamicSVG).toHaveBeenCalled();

    unmount();
  });

  it('accepts CameraDistance.INTERIOR distance prop', () => {
    const { unmount } = render(
      <VehicleWalkaroundIndicator alpha={90} distance={CameraDistance.INTERIOR} />,
    );

    expect(DynamicSVG).toHaveBeenCalled();

    unmount();
  });

  it('accepts orientationAngle prop', () => {
    const orientationAngle = 45;
    const { unmount } = render(
      <VehicleWalkaroundIndicator alpha={90} orientationAngle={orientationAngle} />,
    );

    expect(DynamicSVG).toHaveBeenCalled();

    unmount();
  });

  it('renders correctly with all props combined', () => {
    const { container, unmount } = render(
      <VehicleWalkaroundIndicator
        alpha={180}
        size={100}
        orientationAngle={45}
        showCircle={true}
        distance={CameraDistance.CLOSE}
        showProgressBar={true}
      />,
    );

    expect(container).toBeInTheDocument();
    expect(DynamicSVG).toHaveBeenCalledTimes(2);
    expect(screen.queryByTestId('progress-bar')).not.toBeNull();
    expect(screen.queryByTestId('full-bar')).not.toBeNull();

    unmount();
  });
});
