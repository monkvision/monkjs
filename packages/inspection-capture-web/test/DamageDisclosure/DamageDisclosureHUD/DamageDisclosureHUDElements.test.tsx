import { AddDamage } from '@monkvision/types';

jest.mock('../../../src/components', () => ({
  ZoomOutShot: jest.fn(() => <></>),
  CloseUpShot: jest.fn(() => <></>),
  PartSelection: jest.fn(() => <></>),
}));

import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { CaptureMode } from '../../../src/types';
import { DamageDisclosureHUDElements, DamageDisclosureHUDElementsProps } from '../../../src';
import { ZoomOutShot, CloseUpShot, PartSelection } from '../../../src/components';

function createProps(): DamageDisclosureHUDElementsProps {
  return {
    mode: CaptureMode.SIGHT,
    onAddDamage: jest.fn(),
    onCancelAddDamage: jest.fn(),
    previewDimensions: { height: 1234, width: 45678 },
    isLoading: false,
    error: null,
    onValidateVehicleParts: jest.fn(),
    vehicleParts: [],
    addDamage: AddDamage.PART_SELECT,
  };
}

describe('DamageDisclosureHUDElements component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return null if the capture is loading', () => {
    const props = createProps();
    props.isLoading = true;
    const { container, unmount } = render(<DamageDisclosureHUDElements {...props} />);

    expect(container).toBeEmptyDOMElement();

    unmount();
  });

  it('should return null if the capture is in error', () => {
    const props = createProps();
    props.error = true;
    const { container, unmount } = render(<DamageDisclosureHUDElements {...props} />);

    expect(container).toBeEmptyDOMElement();

    unmount();
  });

  it('should return the ZoomOutShot component if the mode is AD 1st Shot', () => {
    const props = createProps();
    props.mode = CaptureMode.ADD_DAMAGE_1ST_SHOT;
    const { unmount } = render(<DamageDisclosureHUDElements {...props} />);

    expectPropsOnChildMock(ZoomOutShot, {
      onCancel: props.onCancelAddDamage,
    });
    expect(CloseUpShot).not.toHaveBeenCalled();

    unmount();
  });

  it('should return the ClosuUpShot component if the mode is AD 2nd Shot', () => {
    const props = createProps();
    props.mode = CaptureMode.ADD_DAMAGE_2ND_SHOT;
    const { unmount } = render(<DamageDisclosureHUDElements {...props} />);

    expectPropsOnChildMock(CloseUpShot, {
      onCancel: props.onCancelAddDamage,
    });
    expect(ZoomOutShot).not.toHaveBeenCalled();

    unmount();
  });

  it('should return the ClosuUpShot component if the mode is AD PartSelect Shot', () => {
    const props = createProps();
    props.mode = CaptureMode.ADD_DAMAGE_PART_SELECT_SHOT;
    const { unmount } = render(<DamageDisclosureHUDElements {...props} />);

    expectPropsOnChildMock(CloseUpShot, {
      onCancel: props.onCancelAddDamage,
    });
    expect(ZoomOutShot).not.toHaveBeenCalled();
    expect(PartSelection).not.toHaveBeenCalled();

    unmount();
  });

  it('should return the PartSelection component if the mode is AD PartSelect', () => {
    const props = createProps();
    props.mode = CaptureMode.ADD_DAMAGE_PART_SELECT;
    const { unmount } = render(<DamageDisclosureHUDElements {...props} />);

    expectPropsOnChildMock(PartSelection, {
      onCancel: props.onCancelAddDamage,
    });
    expect(ZoomOutShot).not.toHaveBeenCalled();
    expect(CloseUpShot).not.toHaveBeenCalled();

    unmount();
  });
});
