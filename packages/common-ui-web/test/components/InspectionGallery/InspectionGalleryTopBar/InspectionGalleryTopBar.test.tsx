import { useTranslation } from 'react-i18next';

jest.mock('../../../../src/components/Button', () => ({
  Button: jest.fn(() => <></>),
}));
jest.mock(
  '../../../../src/components/InspectionGallery/InspectionGalleryTopBar/InspectionGalleryFilterPill',
  () => ({
    InspectionGalleryFilterPill: jest.fn(() => <></>),
  }),
);

import { act, render, screen } from '@testing-library/react';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { Image, ImageStatus } from '@monkvision/types';
import { Button } from '../../../../src';
import { InspectionGalleryFilterPill } from '../../../../src/components/InspectionGallery/InspectionGalleryTopBar/InspectionGalleryFilterPill';
import {
  InspectionGalleryFilter,
  InspectionGalleryTopBar,
  InspectionGalleryTopBarProps,
} from '../../../../src/components/InspectionGallery/InspectionGalleryTopBar';
import { debug } from 'console';

function createProps(): InspectionGalleryTopBarProps {
  return {
    captureMode: true,
    showBackButton: true,
    items: [
      { isAddDamage: false, isTaken: true, image: { status: ImageStatus.SUCCESS } as Image },
      { isAddDamage: false, isTaken: true, image: { status: ImageStatus.SUCCESS } as Image },
      { isAddDamage: false, isTaken: false, sightId: '' },
      { isAddDamage: true },
    ],
    onValidate: jest.fn(),
    onBack: jest.fn(),
    currentFilter: null,
    allowSkipRetake: false,
    onUpdateFilter: jest.fn(),
    isInspectionCompleted: false,
  };
}

function expectFilterPillSelected(pill: 'retake' | 'approved', isSelected: boolean): void {
  expectPropsOnChildMock(InspectionGalleryFilterPill, {
    isSelected,
    label: pill === 'retake' ? 'topBar.retakeFilter' : 'topBar.approvedFilter',
  });
}

function clickOnFilterPill(
  pill: 'retake' | 'approved',
  props: InspectionGalleryTopBarProps,
): InspectionGalleryFilter | null {
  const { onClick } = (InspectionGalleryFilterPill as unknown as jest.Mock).mock.calls.find(
    ([callProps]) =>
      callProps.label === (pill === 'retake' ? 'topBar.retakeFilter' : 'topBar.approvedFilter'),
  )[0];
  (InspectionGalleryFilterPill as jest.Mock).mockClear();
  (props.onUpdateFilter as jest.Mock).mockClear();
  act(() => {
    onClick();
  });
  expect(props.onUpdateFilter).toHaveBeenCalled();
  const selectedFilter = (props.onUpdateFilter as jest.Mock).mock.calls[0][0];
  return props.currentFilter === selectedFilter ? null : selectedFilter;
}

describe('InspectionGalleryTopBar component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display a back button if showBackButton is set to true', () => {
    const props = createProps();
    props.showBackButton = true;
    const { unmount } = render(<InspectionGalleryTopBar {...props} />);

    expectPropsOnChildMock(Button, {
      variant: 'text',
      icon: 'arrow-back-ios',
      primaryColor: 'text-primary',
      shade: 'light',
      onClick: expect.any(Function),
    });
    const { onClick } = (Button as unknown as jest.Mock).mock.calls.find(
      ([callProps]) => callProps.icon === 'arrow-back-ios',
    )[0];
    expect(props.onBack).not.toHaveBeenCalled();
    onClick();
    expect(props.onBack).toHaveBeenCalled();

    unmount();
  });

  it('should not a back button if showBackButton is set to false', () => {
    const props = createProps();
    props.showBackButton = false;
    const { unmount } = render(<InspectionGalleryTopBar {...props} />);

    expect(Button).not.toHaveBeenCalledWith(
      expect.objectContaining({
        icon: 'arrow-back-ios',
      }),
      expect.anything(),
    );

    unmount();
  });

  it('should display a title', () => {
    const props = createProps();
    const { unmount } = render(<InspectionGalleryTopBar {...props} />);

    expect(useTranslation).toHaveBeenCalled();
    const { t } = (useTranslation as jest.Mock).mock.results[0].value;
    expect(t).toHaveBeenCalledWith('topBar.title');
    expect(screen.queryByText('topBar.title')).not.toBeNull();

    unmount();
  });

  it('should display a validate button', () => {
    const props = createProps();
    const { unmount } = render(<InspectionGalleryTopBar {...props} />);

    expect(useTranslation).toHaveBeenCalled();
    const { t } = (useTranslation as jest.Mock).mock.results[0].value;
    expect(t).toHaveBeenCalledWith('topBar.submit');
    expectPropsOnChildMock(Button, {
      onClick: expect.any(Function),
      children: 'topBar.submit',
    });
    const { onClick } = (Button as unknown as jest.Mock).mock.calls.find(
      ([callProps]) => callProps.children === 'topBar.submit',
    )[0];
    expect(props.onValidate).not.toHaveBeenCalled();
    onClick();
    expect(props.onValidate).toHaveBeenCalled();

    unmount();
  });

  it('should use validateButtonLabel to display validate button label if it is defined', () => {
    const customLabel = 'customLabel';
    const props = { validateButtonLabel: customLabel, ...createProps() };

    const { unmount } = render(<InspectionGalleryTopBar {...props} />);

    expectPropsOnChildMock(Button, { children: customLabel });

    unmount();
  });

  it('should disable the validate button if there are some untaken pictures', () => {
    const props = createProps();
    props.captureMode = true;
    props.items = [
      { isAddDamage: false, isTaken: true, image: { status: ImageStatus.SUCCESS } as Image },
      { isAddDamage: false, isTaken: true, image: { status: ImageStatus.SUCCESS } as Image },
      { isAddDamage: false, isTaken: false, sightId: '' },
      { isAddDamage: true },
    ];
    const { unmount } = render(<InspectionGalleryTopBar {...props} />);

    expectPropsOnChildMock(Button, {
      disabled: true,
      children: 'topBar.submit',
    });

    unmount();
  });

  [
    ImageStatus.UPLOADING,
    ImageStatus.COMPLIANCE_RUNNING,
    ImageStatus.UPLOAD_FAILED,
    ImageStatus.NOT_COMPLIANT,
  ].forEach((status) => {
    it(`should disable the validate button if there are some pictures with the ${status} status`, () => {
      const props = createProps();
      props.captureMode = true;
      props.items = [
        { isAddDamage: false, isTaken: true, image: { status } as Image },
        { isAddDamage: false, isTaken: true, image: { status: ImageStatus.SUCCESS } as Image },
        { isAddDamage: false, isTaken: true, image: { status: ImageStatus.SUCCESS } as Image },
        { isAddDamage: true },
      ];
      const { unmount } = render(<InspectionGalleryTopBar {...props} />);

      expectPropsOnChildMock(Button, {
        disabled: true,
        children: 'topBar.submit',
      });

      unmount();
    });
  });

  it('should enable the validate button if all of the pictures are taken and in success', () => {
    const props = createProps();
    props.captureMode = true;
    props.items = [
      { isAddDamage: false, isTaken: true, image: { status: ImageStatus.SUCCESS } as Image },
      { isAddDamage: false, isTaken: true, image: { status: ImageStatus.SUCCESS } as Image },
      { isAddDamage: false, isTaken: true, image: { status: ImageStatus.SUCCESS } as Image },
      { isAddDamage: true },
    ];
    const { unmount } = render(<InspectionGalleryTopBar {...props} />);

    expectPropsOnChildMock(Button, {
      disabled: false,
      children: 'topBar.submit',
    });

    unmount();
  });

  it('should not display any filter pill if not in capture mode', () => {
    const props = createProps();
    props.captureMode = false;
    const { unmount } = render(<InspectionGalleryTopBar {...props} />);

    expect(InspectionGalleryFilterPill).not.toHaveBeenCalled();

    unmount();
  });

  it('should display a retake filter pill in capture mode', () => {
    const props = createProps();
    props.captureMode = true;
    const { unmount } = render(<InspectionGalleryTopBar {...props} />);

    expect(useTranslation).toHaveBeenCalled();
    const { t } = (useTranslation as jest.Mock).mock.results[0].value;
    expect(t).toHaveBeenCalledWith('topBar.retakeFilter');
    expectPropsOnChildMock(InspectionGalleryFilterPill, {
      label: 'topBar.retakeFilter',
    });

    unmount();
  });

  it('should display an approved filter pill in capture mode', () => {
    const props = createProps();
    props.captureMode = true;
    const { unmount } = render(<InspectionGalleryTopBar {...props} />);

    expect(useTranslation).toHaveBeenCalled();
    const { t } = (useTranslation as jest.Mock).mock.results[0].value;
    expect(t).toHaveBeenCalledWith('topBar.approvedFilter');
    expectPropsOnChildMock(InspectionGalleryFilterPill, {
      label: 'topBar.approvedFilter',
    });

    unmount();
  });

  it('should properly handle the selected state of each filter pill', () => {
    const props = createProps();
    props.captureMode = true;
    const { unmount, rerender } = render(<InspectionGalleryTopBar {...props} />);

    expectFilterPillSelected('retake', false);
    expectFilterPillSelected('approved', false);

    props.currentFilter = clickOnFilterPill('retake', props);
    rerender(<InspectionGalleryTopBar {...props} />);
    expectFilterPillSelected('retake', true);
    expectFilterPillSelected('approved', false);

    props.currentFilter = clickOnFilterPill('approved', props);
    rerender(<InspectionGalleryTopBar {...props} />);
    expectFilterPillSelected('retake', false);
    expectFilterPillSelected('approved', true);

    props.currentFilter = clickOnFilterPill('retake', props);
    rerender(<InspectionGalleryTopBar {...props} />);
    expectFilterPillSelected('retake', true);
    expectFilterPillSelected('approved', false);

    props.currentFilter = clickOnFilterPill('retake', props);
    rerender(<InspectionGalleryTopBar {...props} />);
    expectFilterPillSelected('retake', false);
    expectFilterPillSelected('approved', false);

    props.currentFilter = clickOnFilterPill('approved', props);
    rerender(<InspectionGalleryTopBar {...props} />);
    expectFilterPillSelected('retake', false);
    expectFilterPillSelected('approved', true);

    props.currentFilter = clickOnFilterPill('approved', props);
    rerender(<InspectionGalleryTopBar {...props} />);
    expectFilterPillSelected('retake', false);
    expectFilterPillSelected('approved', false);

    unmount();
  });

  it('should properly filter the retake items', () => {
    const props = createProps();
    props.captureMode = true;
    const { unmount } = render(<InspectionGalleryTopBar {...props} />);

    const retakeFilter = clickOnFilterPill('retake', props);
    expect(retakeFilter).not.toBeNull();
    const { callback } = retakeFilter as InspectionGalleryFilter;
    expect(
      callback({
        isAddDamage: true,
      }),
    ).toEqual(false);
    expect(
      callback({
        isAddDamage: false,
        isTaken: false,
        sightId: 'test',
      }),
    ).toEqual(false);
    expect(
      callback({
        isAddDamage: false,
        isTaken: true,
        image: { status: ImageStatus.SUCCESS } as Image,
      }),
    ).toEqual(false);
    expect(
      callback({
        isAddDamage: false,
        isTaken: true,
        image: { status: ImageStatus.UPLOADING } as Image,
      }),
    ).toEqual(false);
    expect(
      callback({
        isAddDamage: false,
        isTaken: true,
        image: { status: ImageStatus.COMPLIANCE_RUNNING } as Image,
      }),
    ).toEqual(false);
    expect(
      callback({
        isAddDamage: false,
        isTaken: true,
        image: { status: ImageStatus.NOT_COMPLIANT } as Image,
      }),
    ).toEqual(true);
    expect(
      callback({
        isAddDamage: false,
        isTaken: true,
        image: { status: ImageStatus.UPLOAD_FAILED } as Image,
      }),
    ).toEqual(true);

    unmount();
  });

  it('should properly filter the approved items', () => {
    const props = createProps();
    props.captureMode = true;
    const { unmount } = render(<InspectionGalleryTopBar {...props} />);

    const approvedFilter = clickOnFilterPill('approved', props);
    expect(approvedFilter).not.toBeNull();
    const { callback } = approvedFilter as InspectionGalleryFilter;
    expect(
      callback({
        isAddDamage: true,
      }),
    ).toEqual(false);
    expect(
      callback({
        isAddDamage: false,
        isTaken: false,
        sightId: 'test',
      }),
    ).toEqual(false);
    expect(
      callback({
        isAddDamage: false,
        isTaken: true,
        image: { status: ImageStatus.UPLOADING } as Image,
      }),
    ).toEqual(false);
    expect(
      callback({
        isAddDamage: false,
        isTaken: true,
        image: { status: ImageStatus.COMPLIANCE_RUNNING } as Image,
      }),
    ).toEqual(false);
    expect(
      callback({
        isAddDamage: false,
        isTaken: true,
        image: { status: ImageStatus.NOT_COMPLIANT } as Image,
      }),
    ).toEqual(false);
    expect(
      callback({
        isAddDamage: false,
        isTaken: true,
        image: { status: ImageStatus.UPLOAD_FAILED } as Image,
      }),
    ).toEqual(false);
    expect(
      callback({
        isAddDamage: false,
        isTaken: true,
        image: { status: ImageStatus.SUCCESS } as Image,
      }),
    ).toEqual(true);

    unmount();
  });
  it('should display only message if isInspectionCompleted is true', () => {
    const props = createProps();
    props.isInspectionCompleted = true;
    render(<InspectionGalleryTopBar {...props} />);
    expect(Button).toHaveBeenCalledTimes(1);
    expect(screen.queryAllByText('topBar.submit')).toHaveLength(0);
  });
});
