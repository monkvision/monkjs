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
import { Image, ImageStatus, Viewpoint } from '@monkvision/types';
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

  it('should render the beauty shot overlay when view is set', () => {
    const props = createProps();
    (props as any).view = Viewpoint.FRONT;
    const { unmount } = render(<ImageDetailedViewOverlay {...props} />);

    expect(useTranslation).toHaveBeenCalled();
    const { t } = (useTranslation as jest.Mock).mock.results[0].value;
    expect(t).toHaveBeenCalledWith('tap');
    expect(screen.queryByText('tap')).not.toBeNull();

    unmount();
  });

  it('should render the success message with check-circle icon when view is set and showSuccessMessage is true', () => {
    const props = createProps();
    (props as any).view = Viewpoint.FRONT;
    (props as any).showSuccessMessage = true;
    const { unmount } = render(<ImageDetailedViewOverlay {...props} />);

    expect(useTranslation).toHaveBeenCalled();
    const { t } = (useTranslation as jest.Mock).mock.results[0].value;
    expect(t).toHaveBeenCalledWith('successful');
    expect(screen.queryByText('successful')).not.toBeNull();
    expectPropsOnChildMock(Icon, { icon: 'check-circle' });

    unmount();
  });

  it('should NOT render the success message when view is set and showSuccessMessage is false', () => {
    const props = createProps();
    (props as any).view = Viewpoint.FRONT;
    (props as any).showSuccessMessage = false;
    const { unmount } = render(<ImageDetailedViewOverlay {...props} />);

    expect(screen.queryByText('successful')).toBeNull();

    unmount();
  });

  it('should render the normal compliance overlay when view is NOT set', () => {
    const title = 'compliance-title';
    const description = 'compliance-description';
    (isImageValid as jest.Mock).mockImplementationOnce(() => true);
    (useRetakeOverlay as jest.Mock).mockImplementationOnce(() => ({ title, description }));
    const props = createProps();
    const { unmount } = render(<ImageDetailedViewOverlay {...props} />);

    expect(screen.queryByText(title)).not.toBeNull();
    expect(screen.queryByText(description)).not.toBeNull();
    expect(screen.queryByText('tap')).toBeNull();

    unmount();
  });

  it('should NOT render the retake button when captureMode is false', () => {
    const props = createProps();
    props.captureMode = false;
    const { unmount } = render(<ImageDetailedViewOverlay {...props} />);

    expect(Button).not.toHaveBeenCalled();

    unmount();
  });

  it('should NOT display the compliance overlay for video frames (frame_index defined)', () => {
    const title = 'compliance-title-vf';
    const description = 'compliance-desc-vf';
    (isImageValid as jest.Mock).mockImplementationOnce(() => false);
    (useRetakeOverlay as jest.Mock).mockImplementationOnce(() => ({
      title,
      description,
      icon: 'test',
      iconColor: 'red',
      buttonColor: 'blue',
    }));
    const props = createProps();
    props.image = {
      id: 'video-frame-id',
      status: ImageStatus.NOT_COMPLIANT,
      additionalData: { frame_index: 5 },
    } as unknown as Image;
    const { unmount } = render(<ImageDetailedViewOverlay {...props} />);

    expect(screen.queryByText(title)).toBeNull();
    expect(screen.queryByText(description)).toBeNull();

    unmount();
  });

  it('should NOT render the retake button for video frames even in captureMode', () => {
    (isImageValid as jest.Mock).mockImplementationOnce(() => false);
    const props = createProps();
    props.captureMode = true;
    props.image = {
      id: 'video-frame-id',
      status: ImageStatus.NOT_COMPLIANT,
      additionalData: { frame_index: 3 },
    } as unknown as Image;
    const { unmount } = render(<ImageDetailedViewOverlay {...props} />);

    const retakeButtonCalls = (Button as unknown as jest.Mock).mock.calls.filter(
      (args: any[]) => args[0].children === 'retake',
    );
    expect(retakeButtonCalls.length).toBe(0);

    unmount();
  });

  it('should NOT render the label icon for video frames', () => {
    const icon = 'test-icon-vf';
    const primaryColor = 'test-color-vf';
    (useImageLabelIcon as jest.Mock).mockImplementationOnce(() => ({ icon, primaryColor }));
    const props = createProps();
    props.image = {
      id: 'video-frame-id',
      status: ImageStatus.SUCCESS,
      label: { en: 'test-label' },
      additionalData: { frame_index: 10 },
    } as unknown as Image;
    const { unmount } = render(<ImageDetailedViewOverlay {...props} />);

    expect(Icon).not.toHaveBeenCalledWith(
      expect.objectContaining({ icon, primaryColor }),
      expect.anything(),
    );

    unmount();
  });
});
