jest.mock('@monkvision/common');

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { InteractiveStatus } from '@monkvision/types';
import * as common from '@monkvision/common';
import { Slider } from '../../src';

jest.spyOn(common, 'useInteractiveStatus').mockImplementation(() => ({
  status: InteractiveStatus.DEFAULT,
  eventHandlers: {
    onMouseLeave: jest.fn(),
    onMouseEnter: jest.fn(),
    onMouseDown: jest.fn(),
    onMouseUp: jest.fn(),
  },
}));

describe('Slider component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display the slider without any props', () => {
    const { unmount } = render(<Slider />);

    expect(screen.getByTestId('slider')).toBeInTheDocument();
    expect(screen.getByTestId('track')).toBeInTheDocument();
    expect(screen.getByTestId('value-track')).toBeInTheDocument();
    expect(screen.getByTestId('thumb')).toBeInTheDocument();
    expect(screen.getByTestId('hover-thumb')).toBeInTheDocument();

    const sliderEl = screen.getByTestId('slider');
    expect(sliderEl.style.opacity).toEqual('');
    expect(sliderEl.style.cursor).toEqual('pointer');

    unmount();
  });

  it('should not be clickable and have opacity ON when disabled is true', () => {
    jest.spyOn(common, 'useInteractiveStatus').mockImplementationOnce(() => ({
      status: InteractiveStatus.DISABLED,
      eventHandlers: {
        onMouseLeave: jest.fn(),
        onMouseEnter: jest.fn(),
        onMouseDown: jest.fn(),
        onMouseUp: jest.fn(),
      },
    }));
    const onChange = jest.fn();

    const { unmount } = render(<Slider disabled={true} onChange={onChange} />);
    const sliderEl = screen.getByTestId('slider');
    expect(sliderEl.style.opacity).not.toBeNull();
    expect(sliderEl.style.cursor).toEqual('default');

    fireEvent.mouseDown(sliderEl);
    fireEvent.click(sliderEl);
    fireEvent.mouseMove(sliderEl, { clientX: 100 });
    fireEvent.mouseUp(sliderEl);
    expect(onChange).not.toHaveBeenCalled();

    unmount();
  });

  it('should display the thumb in the most right when value is greater than max', () => {
    const { unmount } = render(<Slider value={200} max={100} />);
    const thumbEl = screen.getByTestId('thumb');
    expect(thumbEl.style.left).toEqual('100%');

    unmount();
  });

  it('should display the thumb in the most left when value is less than min', () => {
    const { unmount } = render(<Slider value={100} min={200} />);
    const thumbEl = screen.getByTestId('thumb');
    expect(thumbEl.style.left).toEqual('0%');

    unmount();
  });

  it('should call the onChange callback when clicked on and moved on', () => {
    const onChange = jest.fn();

    const { unmount } = render(<Slider onChange={onChange} />);
    const sliderEl = screen.getByTestId('slider');
    fireEvent.mouseDown(sliderEl);
    fireEvent.click(sliderEl);
    fireEvent.mouseMove(sliderEl, { clientX: 100 });
    fireEvent.mouseUp(sliderEl);
    expect(onChange).toHaveBeenCalledTimes(2);

    unmount();
  });

  it('should display and change left CSSProperty when mouseMove event is trigger', () => {
    const onChange = jest.fn();
    const { unmount } = render(<Slider value={20} onChange={onChange} />);

    const sliderEl = screen.getByTestId('slider');
    jest.spyOn(sliderEl, 'getBoundingClientRect').mockImplementation(() => ({
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      top: 0,
      left: 0,
      bottom: 100,
      right: 100,
      toJSON: () => ({}),
    }));
    const thumbEl = screen.getByTestId('thumb');
    let thumbElInitialPos = thumbEl.style.left;

    expect(thumbEl.style.cursor).toEqual('grab');
    fireEvent.mouseDown(thumbEl);
    expect(thumbEl.style.cursor).toEqual('grabbing');

    fireEvent.click(thumbEl, { clientX: 10 });
    expect(thumbEl.style.left).not.toEqual(thumbElInitialPos);

    thumbElInitialPos = thumbEl.style.left;
    fireEvent.mouseMove(thumbEl, { clientX: 100 });
    expect(thumbEl.style.left).not.toEqual(thumbElInitialPos);

    fireEvent.mouseUp(thumbEl);
    expect(thumbEl.style.cursor).toEqual('grab');

    unmount();
  });

  it('should have float percentage when step passed as props is a float number', () => {
    const onChange = jest.fn();

    const { unmount } = render(<Slider step={0.1} onChange={onChange} />);

    const sliderEl = screen.getByTestId('slider');
    jest.spyOn(sliderEl, 'getBoundingClientRect').mockImplementation(() => ({
      x: 0,
      y: 0,
      width: 1000,
      height: 1000,
      top: 0,
      left: 0,
      bottom: 100,
      right: 100,
      toJSON: () => ({}),
    }));
    const thumbEl = screen.getByTestId('thumb');
    fireEvent.mouseDown(thumbEl);
    fireEvent.click(thumbEl, { clientX: 57 });
    expect(thumbEl.style.left.toString().includes('.')).toBe(true);

    unmount();
  });
});
