jest.mock('../../../../src/components/Button', () => ({
  Button: jest.fn(() => <></>),
}));
jest.mock('../../../../src/icons', () => ({
  Icon: jest.fn(() => <></>),
}));
jest.mock('../../../../src/components/ImageDetailedView/ImageDetailedViewOverlay/hooks', () => ({
  ...jest.requireActual(
    '../../../../src/components/ImageDetailedView/ImageDetailedViewOverlay/hooks',
  ),
  useImageLabelIcon: jest.fn(() => null),
  useRetakeOverlay: jest.fn(() => ({
    title: '',
    description: '',
    iconColor: '',
    icon: '',
    buttonColor: '',
  })),
  isImageValid: jest.fn(() => true),
}));

import { useTranslation } from 'react-i18next';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { render, screen } from '@testing-library/react';
import { ImageDetailedViewOverlay } from '../../../../src/components/ImageDetailedView/ImageDetailedViewOverlay';
import {
  ImageDetailedViewOverlayProps,
  isImageValid,
  useRetakeOverlay,
  useImageLabelIcon,
} from '../../../../src/components/ImageDetailedView/ImageDetailedViewOverlay/hooks';
import { Image, ImageStatus } from '@monkvision/types';
import { Button, Icon } from '../../../../src';
import { useObjectTranslation } from '@monkvision/common';

function createProps(): ImageDetailedViewOverlayProps {
  return {
    captureMode: true,
    image: { id: 'test-id', status: ImageStatus.SUCCESS } as Image,
    onRetake: jest.fn(),
  };
}

describe('ImageDetailedViewOverlay component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  [true, false].forEach((isValid) => {
    it(`should display a retake button if isImageValid is ${isValid}`, () => {
      (isImageValid as jest.Mock).mockImplementationOnce(() => isValid);
      const props = createProps();
      const { unmount } = render(<ImageDetailedViewOverlay {...props} />);

      expect(useTranslation).toHaveBeenCalled();
      const { t } = (useTranslation as jest.Mock).mock.results[0].value;
      expect(t).toHaveBeenCalledWith('retake');
      expectPropsOnChildMock(Button, {
        children: 'retake',
        onClick: expect.any(Function),
      });
      const { onClick } = (Button as unknown as jest.Mock).mock.calls.find(
        (args) => args[0].children === 'retake',
      )[0];
      expect(props.onRetake).not.toHaveBeenCalled();
      onClick();
      expect(props.onRetake).toHaveBeenCalled();

      unmount();
    });
  });

  it('should contain the retake labels', () => {
    const title = 'test-title-test';
    const description = 'test-description-test';
    (isImageValid as jest.Mock).mockImplementationOnce(() => true);
    (useRetakeOverlay as jest.Mock).mockImplementationOnce(() => ({ title, description }));
    const props = createProps();
    const { unmount } = render(<ImageDetailedViewOverlay {...props} />);

    expect(screen.queryByText(title)).not.toBeNull();
    expect(screen.queryByText(description)).not.toBeNull();

    unmount();
  });

  it('should display the image label with the proper icon', () => {
    const props = createProps();
    props.image.label = { en: 'test', fr: 'fr', de: 'test-de', nl: 'test-nl', it: 'test-it' };
    const icon = 'hello-test-icon';
    const primaryColor = 'test-primary-test';
    (useImageLabelIcon as jest.Mock).mockImplementationOnce(() => ({ icon, primaryColor }));
    const label = 'valid-test-label';
    const tObj = jest.fn((obj) => (obj === props.image.label ? label : null));
    (useObjectTranslation as jest.Mock).mockImplementationOnce(() => ({ tObj }));
    const { unmount } = render(<ImageDetailedViewOverlay {...props} />);

    expectPropsOnChildMock(Icon, { icon, primaryColor });
    expect(screen.queryByText(label)).not.toBeNull();

    unmount();
  });
});
