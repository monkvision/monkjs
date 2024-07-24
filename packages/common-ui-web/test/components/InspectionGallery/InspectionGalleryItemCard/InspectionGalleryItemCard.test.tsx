jest.mock('../../../../src/components/SightOverlay', () => ({
  SightOverlay: jest.fn(() => <></>),
}));
jest.mock('../../../../src/icons', () => ({
  Icon: jest.fn(() => <></>),
}));
jest.mock('../../../../src/components/InspectionGallery/InspectionGalleryItemCard/hooks', () => ({
  ...jest.requireActual(
    '../../../../src/components/InspectionGallery/InspectionGalleryItemCard/hooks',
  ),
  useInspectionGalleryItemStatusIconName: jest.fn(() => 'error'),
  useInspectionGalleryItemLabel: jest.fn(() => 'item-label'),
}));

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { Image, ImageStatus } from '@monkvision/types';
import { changeAlpha, useMonkTheme } from '@monkvision/common';
import { Icon, SightOverlay } from '../../../../src';
import { InspectionGalleryItemCard } from '../../../../src/components/InspectionGallery/InspectionGalleryItemCard';
import {
  InspectionGalleryItemCardProps,
  useInspectionGalleryItemLabel,
  useInspectionGalleryItemStatusIconName,
} from '../../../../src/components/InspectionGallery/InspectionGalleryItemCard/hooks';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { sights } from '@monkvision/sights';

const CARD_BTN_TEST_ID = 'card-btn';
const CARD_PREVIEW_TEST_ID = 'preview';
const CARD_PREVIEW_OVERLAY_TEST_ID = 'preview-overlay';

const palette = {
  surface: { dark: '#010101' },
  alert: { base: '#123456' },
  caution: { dark: '#123123' },
  text: { primary: '#654321' },
  primary: { base: '#001122', dark: '#445522' },
};

(useMonkTheme as jest.Mock).mockImplementation(() => ({
  palette,
}));

function createProps(): InspectionGalleryItemCardProps {
  return {
    item: {
      isAddDamage: false,
      isTaken: true,
      image: {
        path: 'test-image-path',
        thumnailPath: 'test-image-thumbnail-path',
        status: ImageStatus.SUCCESS,
      } as unknown as Image,
    },
    captureMode: true,
    onClick: jest.fn(),
  };
}

describe('InspectionGalleryItemCard component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display a button that triggers the onClick event when clicked on', () => {
    const props = createProps();
    const { unmount } = render(<InspectionGalleryItemCard {...props} />);

    const button = screen.getByTestId(CARD_BTN_TEST_ID);
    expect(button.tagName).toEqual('BUTTON');
    expect(props.onClick).not.toHaveBeenCalled();
    fireEvent.click(button);
    expect(props.onClick).toHaveBeenCalled();

    unmount();
  });

  it('should display the picture taken if the item is a taken picture', () => {
    const props = createProps();
    const { unmount } = render(<InspectionGalleryItemCard {...props} />);

    const preview = screen.getByTestId(CARD_PREVIEW_TEST_ID);
    expect(preview).toHaveStyle({
      backgroundImage: `url(${(props.item as { image: Image }).image.thumbnailPath})`,
    });

    unmount();
  });

  it('should display an overlay on top of the picture if the image upload failed', () => {
    const props = createProps();
    (props.item as { image: Image }).image.status = ImageStatus.UPLOAD_FAILED;
    const { unmount } = render(<InspectionGalleryItemCard {...props} />);

    const overlay = screen.getByTestId(CARD_PREVIEW_OVERLAY_TEST_ID);
    expect(useMonkTheme).toHaveBeenCalled();
    expect(changeAlpha).toHaveBeenCalledWith(palette.caution.dark, 0.5);
    expect(overlay).toHaveStyle({
      backgroundColor: palette.caution.dark,
    });

    unmount();
  });

  it('should display an overlay on top of the picture if the image upload is in error', () => {
    const props = createProps();
    (props.item as { image: Image }).image.status = ImageStatus.UPLOAD_ERROR;
    const { unmount } = render(<InspectionGalleryItemCard {...props} />);

    const overlay = screen.getByTestId(CARD_PREVIEW_OVERLAY_TEST_ID);
    expect(useMonkTheme).toHaveBeenCalled();
    expect(changeAlpha).toHaveBeenCalledWith(palette.caution.dark, 0.5);
    expect(overlay).toHaveStyle({
      backgroundColor: palette.caution.dark,
    });

    unmount();
  });

  it('should display an overlay on top of the picture if the image is not compliant', () => {
    const props = createProps();
    (props.item as { image: Image }).image.status = ImageStatus.NOT_COMPLIANT;
    const { unmount } = render(<InspectionGalleryItemCard {...props} />);

    const overlay = screen.getByTestId(CARD_PREVIEW_OVERLAY_TEST_ID);
    expect(useMonkTheme).toHaveBeenCalled();
    expect(changeAlpha).toHaveBeenCalledWith(palette.alert.base, 0.5);
    expect(overlay).toHaveStyle({
      backgroundColor: palette.alert.base,
    });

    unmount();
  });

  it('should not display an overlay on top of the picture when not in capture mode', () => {
    const props = createProps();
    props.captureMode = false;
    (props.item as { image: Image }).image.status = ImageStatus.NOT_COMPLIANT;
    const { unmount } = render(<InspectionGalleryItemCard {...props} />);

    const overlay = screen.getByTestId(CARD_PREVIEW_OVERLAY_TEST_ID);
    expect(overlay).not.toHaveStyle({
      backgroundColor: palette.alert.base,
    });

    unmount();
  });

  it('should pass the proper params to the useInspectionGalleryItemStatusIconName hook', () => {
    const props = createProps();
    const { unmount } = render(<InspectionGalleryItemCard {...props} />);

    expect(useInspectionGalleryItemStatusIconName).toHaveBeenCalledWith({
      item: props.item,
      captureMode: props.captureMode,
    });

    unmount();
  });

  it('should display the icon obtained from the useInspectionGalleryItemStatusIconName hook', () => {
    const props = createProps();
    const { unmount } = render(<InspectionGalleryItemCard {...props} />);

    expect(useInspectionGalleryItemStatusIconName).toHaveBeenCalled();
    expectPropsOnChildMock(Icon, { icon: useInspectionGalleryItemStatusIconName({} as any) });

    unmount();
  });

  it('should pass the proper params to the useInspectionGalleryItemLabel hook', () => {
    const props = createProps();
    const { unmount } = render(<InspectionGalleryItemCard {...props} />);

    expect(useInspectionGalleryItemLabel).toHaveBeenCalledWith(props.item);

    unmount();
  });

  it('should display the label obtained from the useInspectionGalleryItemLabel hook', () => {
    const props = createProps();
    const { unmount } = render(<InspectionGalleryItemCard {...props} />);

    expect(screen.queryByText(useInspectionGalleryItemLabel({} as any))).not.toBeNull();

    unmount();
  });

  it('should display the sight overlay instead of the picture when the picture is not aken', () => {
    const props = createProps();
    const item = props.item as { isTaken: boolean; sightId: string };
    item.isTaken = false;
    item.sightId = 'test-sight-1';
    const { unmount } = render(<InspectionGalleryItemCard {...props} />);

    const preview = screen.getByTestId(CARD_PREVIEW_TEST_ID);
    expect(preview).not.toHaveStyle({
      backgroundImage: `url(${(props.item as { image: Image }).image.path})`,
    });
    expectPropsOnChildMock(SightOverlay, { sight: sights[item.sightId] });

    unmount();
  });

  it('should only display the add damage icon for the add damage item in the list', () => {
    const props = createProps();
    props.item.isAddDamage = true;
    const { unmount } = render(<InspectionGalleryItemCard {...props} />);

    const preview = screen.getByTestId(CARD_PREVIEW_TEST_ID);
    expect(preview).not.toHaveStyle({
      backgroundImage: `url(${(props.item as { image: Image }).image.path})`,
    });
    expect(SightOverlay).not.toHaveBeenCalled();
    expectPropsOnChildMock(Icon, {
      icon: 'add-circle',
    });

    unmount();
  });
});
