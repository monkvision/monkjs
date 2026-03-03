import { fireEvent, render } from '@testing-library/react';
import { PartSelectionOrientation, VehiclePart, VehicleType } from '@monkvision/types';
import { ExteriorTab } from '../../../src/components/ExteriorTab/ExteriorTab';
import {
  ExteriorViews,
  TabExteriorState,
} from '../../../src/components/ExteriorTab/hooks/useExteriorTab';

const mockUseExteriorTab = jest.fn();
const mockVehicleDynamicWireframe = jest.fn();
const mockIcon = jest.fn();
const mockPricings = jest.fn();
const mockAddExteriorDamage = jest.fn();

jest.mock('@monkvision/common-ui-web', () => ({
  VehicleDynamicWireframe: jest.fn(
    ({ vehicleType, orientation, validatedParts, onClickPart, getPartAttributes }) => (
      <div
        data-testid='wireframe'
        data-vehicletype={vehicleType}
        data-orientation={orientation}
        data-validatedparts={JSON.stringify(validatedParts)}
        onClick={() => onClickPart?.('click')}
      >
        {getPartAttributes?.('part') && null}
      </div>
    ),
  ),
  Icon: jest.fn(({ onClick, icon }: any) => (
    <button data-testid={`icon-${icon}`} onClick={onClick} />
  )),
}));

jest.mock('../../../src/components/ExteriorTab/Pricings', () => ({
  Pricings: jest.fn(() => <div data-testid='pricings' />),
}));

jest.mock('../../../src/components/ExteriorTab/AddExteriorDamage', () => ({
  AddExteriorDamage: jest.fn(({ onDone, onCancelDamage }: any) => (
    <div data-testid='add-exterior-damage'>
      <button data-testid='on-done' onClick={() => onDone?.({})} />
      <button data-testid='on-cancel' onClick={() => onCancelDamage?.()} />
    </div>
  )),
}));

jest.mock('../../../src/components/ExteriorTab/hooks/useExteriorTab', () => ({
  useExteriorTab: jest.fn(),
  ExteriorViews: {
    SVGCar: 'SVG Car',
    AddPartDamage: 'Add Part Damage',
  },
}));

function buildState(overrides: Partial<TabExteriorState> = {}): TabExteriorState {
  return {
    currentView: ExteriorViews.SVGCar,
    orientation: PartSelectionOrientation.FRONT_LEFT,
    vehicleType: VehicleType.SEDAN,
    validatedParts: [VehiclePart.BUMPER_FRONT],
    onRotateLeft: jest.fn(),
    onRotateRight: jest.fn(),
    onPartClicked: jest.fn(),
    onDone: jest.fn(),
    onGetPartAttributes: jest.fn(),
    onCancelDamage: jest.fn(),
    ...overrides,
  };
}

describe('ExteriorTab', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (
      require('../../../src/components/ExteriorTab/hooks/useExteriorTab')
        .useExteriorTab as jest.Mock
    ).mockImplementation(mockUseExteriorTab);
    mockVehicleDynamicWireframe.mockImplementation(
      require('@monkvision/common-ui-web').VehicleDynamicWireframe,
    );
    mockIcon.mockImplementation(require('@monkvision/common-ui-web').Icon);
    mockPricings.mockImplementation(
      require('../../../src/components/ExteriorTab/Pricings').Pricings,
    );
    mockAddExteriorDamage.mockImplementation(
      require('../../../src/components/ExteriorTab/AddExteriorDamage').AddExteriorDamage,
    );
  });

  it('renders SVG car view with wireframe and pricings', () => {
    const state = buildState();
    mockUseExteriorTab.mockReturnValue(state);

    const { getByTestId } = render(<ExteriorTab />);

    expect(require('@monkvision/common-ui-web').VehicleDynamicWireframe).toHaveBeenCalled();
    expect(getByTestId('wireframe')).toBeDefined();
    expect(require('../../../src/components/ExteriorTab/Pricings').Pricings).toHaveBeenCalled();
    expect(getByTestId('pricings')).toBeDefined();
  });

  it('passes props to VehicleDynamicWireframe and handles part click', () => {
    const state = buildState();
    mockUseExteriorTab.mockReturnValue(state);

    const { getByTestId } = render(<ExteriorTab />);

    const wireframe = getByTestId('wireframe');
    expect(wireframe.getAttribute('data-vehicletype')).toBe(String(state.vehicleType));
    expect(wireframe.getAttribute('data-orientation')).toBe(String(state.orientation));

    fireEvent.click(wireframe);

    expect(state.onPartClicked).toHaveBeenCalled();
  });

  it('handles rotate icons click', () => {
    const state = buildState();
    mockUseExteriorTab.mockReturnValue(state);

    const { getByTestId } = render(<ExteriorTab />);

    fireEvent.click(getByTestId('icon-rotate-left'));
    fireEvent.click(getByTestId('icon-rotate-right'));

    expect(state.onRotateLeft).toHaveBeenCalled();
    expect(state.onRotateRight).toHaveBeenCalled();
  });

  it('renders AddExteriorDamage view when currentView is AddPartDamage', () => {
    const state = buildState({ currentView: ExteriorViews.AddPartDamage });
    mockUseExteriorTab.mockReturnValue(state);

    const { getByTestId } = render(<ExteriorTab />);

    expect(getByTestId('add-exterior-damage')).toBeDefined();
  });

  it('forwards onDone and onCancelDamage to AddExteriorDamage', () => {
    const state = buildState({ currentView: ExteriorViews.AddPartDamage });
    mockUseExteriorTab.mockReturnValue(state);

    const { getByTestId } = render(<ExteriorTab />);

    fireEvent.click(getByTestId('on-done'));
    fireEvent.click(getByTestId('on-cancel'));

    expect(state.onDone).toHaveBeenCalled();
    expect(state.onCancelDamage).toHaveBeenCalled();
  });
});
