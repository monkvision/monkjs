import { getLanguage, MonkAppState, useMonkAppState } from '@monkvision/common';
import {
  BackdropDialog,
  BackdropDialogProps,
  Button,
  VehiclePartSelection,
} from '@monkvision/common-ui-web';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { VehiclePart, VehicleType } from '@monkvision/types';
import { act, fireEvent, prettyDOM, render } from '@testing-library/react';
import { PhotoCaptureHUDElementsAddPartSelectShot } from '../../../src/PhotoCapture/PhotoCaptureHUD/PhotoCaptureHUDElementsAddPartSelectShot';
import '@testing-library/jest-dom';

describe('PhotoCaptureHUDElementsAddPartSelectShot component', () => {
  beforeEach(() => {
    (useMonkAppState as jest.MockedFunction<typeof useMonkAppState>).mockReturnValue({
      vehicleType: VehicleType.CUV,
    } as ReturnType<MonkAppState extends (o: { requireInspection: true }) => infer R ? (args: any) => R : never>);
    (BackdropDialog as jest.MockedFunction<typeof BackdropDialog>).mockImplementation((props) => {
      const { dialog } = props as Extract<BackdropDialogProps, { dialog: any }>;
      return dialog;
    });
    (Button as jest.MockedFunction<typeof Button>).mockImplementation((props) => {
      const { children, onClick } = props;
      return <button onClick={onClick}>{children}</button>;
    });
  });
  afterEach(() => jest.clearAllMocks());

  it('should have message of select parts', () => {
    const { getByText } = render(
      <PhotoCaptureHUDElementsAddPartSelectShot onCancel={() => {}} onAddDamageParts={() => {}} />,
    );
    expect(getByText('photo.hud.addDamage.selectParts')).toBeInTheDocument();
  });

  it('should call VehiclePartSelection', () => {
    render(
      <PhotoCaptureHUDElementsAddPartSelectShot onCancel={() => {}} onAddDamageParts={() => {}} />,
    );
    expectPropsOnChildMock(VehiclePartSelection, {
      vehicleType: VehicleType.CUV,
    });
  });

  it('should have accept and cancel buttons', () => {
    const { getByText } = render(
      <PhotoCaptureHUDElementsAddPartSelectShot onCancel={() => {}} onAddDamageParts={() => {}} />,
    );
    expect(getByText('photo.hud.addDamage.accept')).toBeInTheDocument();
    expect(getByText('photo.hud.addDamage.cancel')).toBeInTheDocument();
  });

  it('should call onCancel when cancel button is clicked', () => {
    const onCancel = jest.fn();
    const { getByText } = render(
      <PhotoCaptureHUDElementsAddPartSelectShot onCancel={onCancel} onAddDamageParts={() => {}} />,
    );
    fireEvent.click(getByText('photo.hud.addDamage.cancel'));
    expect(onCancel).toHaveBeenCalled();
  });

  it('should call onAddDamageParts and hide the popup when accept button is clicked', () => {
    const onAddDamageParts = jest.fn();
    const { getByText } = render(
      <PhotoCaptureHUDElementsAddPartSelectShot
        onCancel={() => {}}
        onAddDamageParts={onAddDamageParts}
      />,
    );
    fireEvent.click(getByText('photo.hud.addDamage.accept'));
    expect(onAddDamageParts).toHaveBeenCalled();
  });

  it('should show the selected parts on UI', () => {
    (getLanguage as jest.MockedFunction<typeof getLanguage>).mockReturnValue('en');
    const { getByText, container } = render(
      <PhotoCaptureHUDElementsAddPartSelectShot onCancel={() => {}} onAddDamageParts={() => {}} />,
    );
    const onPartsSelected = (
      VehiclePartSelection as jest.MockedFunction<typeof VehiclePartSelection>
    ).mock.calls[0][0].onPartsSelected!;
    expect(getByText('photo.hud.addDamage.selectParts')).toBeInTheDocument();
    act(() => onPartsSelected([VehiclePart.BUMPER_BACK]));
    console.log(prettyDOM(container));
    expect(getByText('photo.hud.addDamage.selectPartsRear Bumper')).toBeInTheDocument();
  });

  it('should emit the selected parts to onAddDamageParts', () => {
    const onAddDamageParts = jest.fn();
    const { getByText } = render(
      <PhotoCaptureHUDElementsAddPartSelectShot
        onCancel={() => {}}
        onAddDamageParts={onAddDamageParts}
      />,
    );
    const onPartsSelected = (
      VehiclePartSelection as jest.MockedFunction<typeof VehiclePartSelection>
    ).mock.calls[0][0].onPartsSelected!;
    act(() => onPartsSelected([VehiclePart.BUMPER_BACK]));
    fireEvent.click(getByText('photo.hud.addDamage.accept'));
    expect(onAddDamageParts).toHaveBeenCalledWith([VehiclePart.BUMPER_BACK]);
  });
});
