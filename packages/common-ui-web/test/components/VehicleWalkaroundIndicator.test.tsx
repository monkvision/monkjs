import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { VehicleWalkaroundIndicator } from '../../src';

const PROGRESS_BAR_TEST_ID = 'progress-bar';
const KNOB_TEST_ID = 'knob';

describe('VehicleWalkaroundIndicator component', () => {
  it('should set the size of the SVG of the value of the size prop', () => {
    const size = 988;
    const { container, unmount } = render(<VehicleWalkaroundIndicator alpha={0} size={size} />);

    expect(container.children.length).toEqual(1);
    const svgEl = container.children.item(0) as SVGSVGElement;
    expect(svgEl).toBeDefined();
    expect(svgEl.tagName).toEqual('svg');
    expect(svgEl).toHaveAttribute('width', size.toString());
    expect(svgEl).toHaveAttribute('height', size.toString());
    expect(svgEl).toHaveAttribute('viewBox', `0 0 ${size} ${size}`);

    unmount();
  });

  it('should use 60 for the default size', () => {
    const defaultSize = '60';
    const { container, unmount } = render(<VehicleWalkaroundIndicator alpha={0} />);

    const svgEl = container.children.item(0) as SVGSVGElement;
    expect(svgEl).toHaveAttribute('width', defaultSize);
    expect(svgEl).toHaveAttribute('height', defaultSize);
    expect(svgEl).toHaveAttribute('viewBox', `0 0 ${defaultSize} ${defaultSize}`);

    unmount();
  });

  it('should display 8 circle steps, a progress bar and a knob', () => {
    const { container, unmount } = render(<VehicleWalkaroundIndicator alpha={0} />);

    const svgEl = container.children.item(0) as SVGSVGElement;
    expect(svgEl.children.length).toEqual(10);
    expect(screen.queryByTestId(PROGRESS_BAR_TEST_ID)).not.toBeNull();
    expect(screen.queryByTestId(KNOB_TEST_ID)).not.toBeNull();

    unmount();
  });

  it('should update the position of the knob when the alpha value changes', () => {
    const { rerender, unmount } = render(<VehicleWalkaroundIndicator alpha={34} />);

    let knobEl = screen.getByTestId(KNOB_TEST_ID);
    const cx = knobEl.getAttribute('cx');
    const cy = knobEl.getAttribute('cy');

    rerender(<VehicleWalkaroundIndicator alpha={300} />);
    knobEl = screen.getByTestId(KNOB_TEST_ID);
    expect(knobEl.getAttribute('cx')).not.toEqual(cx);
    expect(knobEl.getAttribute('cy')).not.toEqual(cy);

    unmount();
  });
});
