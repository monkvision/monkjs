import { fireEvent, render, screen } from '@testing-library/react';
import {
  expectComponentToPassDownClassNameToHTMLElement,
  expectComponentToPassDownOtherPropsToHTMLElement,
  expectComponentToPassDownRefToHTMLElement,
  expectComponentToPassDownStyleToHTMLElement,
} from '@monkvision/test-utils';

import { TakePictureButton } from '../../src';

const TAKE_PICTURE_BTN_TEST_ID = 'take-picture-btn';
const OUTER_LAYER_TEST_ID = 'take-picture-btn-outer-layer';

describe('TakePictureButton component', () => {
  function expectSize(size: number): void {
    const innerButtonSizeRatio = 0.84;
    const expectedInnerSize = size * innerButtonSizeRatio;
    const expectedBorderRadius = (size * (1 - innerButtonSizeRatio)) / 4;
    const expectedOuterSize = size - 2 * expectedBorderRadius;
    const outerLayer = screen.getByTestId(OUTER_LAYER_TEST_ID);
    const innerLayer = screen.getByTestId(TAKE_PICTURE_BTN_TEST_ID);

    expect(outerLayer.style.width).toEqual(`${expectedOuterSize}px`);
    expect(outerLayer.style.height).toEqual(`${expectedOuterSize}px`);
    expect(outerLayer.style.borderWidth).toEqual(`${expectedBorderRadius}px`);
    expect(innerLayer.style.width).toEqual(`${expectedInnerSize}px`);
    expect(innerLayer.style.height).toEqual(`${expectedInnerSize}px`);
    expect(innerLayer.style.margin).toEqual(`${expectedBorderRadius}px`);
  }

  it('should take the size prop into account', () => {
    const size = 100;
    const { unmount } = render(<TakePictureButton size={size} />);

    expectSize(size);
    unmount();
  });

  it('should use a size of 60 by default', () => {
    const { unmount } = render(<TakePictureButton />);

    expectSize(60);
    unmount();
  });

  it('should pass the onClick prop to the button', () => {
    const onClick = jest.fn();
    const { unmount } = render(<TakePictureButton onClick={onClick} />);

    fireEvent.click(screen.getByTestId(TAKE_PICTURE_BTN_TEST_ID));
    expect(onClick).toHaveBeenCalled();
    unmount();
  });

  it('should pass the disabled prop down to the button element', () => {
    expectComponentToPassDownOtherPropsToHTMLElement(TakePictureButton, TAKE_PICTURE_BTN_TEST_ID, {
      disabled: true,
    });
  });

  it('should pass the className down to the button element', () => {
    expectComponentToPassDownClassNameToHTMLElement(TakePictureButton, TAKE_PICTURE_BTN_TEST_ID);
  });

  it('should pass the style down to the outer layer element', () => {
    expectComponentToPassDownStyleToHTMLElement(TakePictureButton, OUTER_LAYER_TEST_ID);
  });

  it('should pass other props down to the button element', () => {
    expectComponentToPassDownOtherPropsToHTMLElement(TakePictureButton, TAKE_PICTURE_BTN_TEST_ID);
  });

  it('should pass the ref down to the button element', () => {
    expectComponentToPassDownRefToHTMLElement(TakePictureButton, TAKE_PICTURE_BTN_TEST_ID);
  });
});
