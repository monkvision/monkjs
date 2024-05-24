import { VehicleType } from '@monkvision/types';

jest.mock('@monkvision/sights', () => ({
  labels: Object.values(VehicleType).reduce(
    (prev, curr) => ({ ...prev, [curr]: `label-${curr}` }),
    {},
  ),
}));
jest.mock('../../../src/components/VehicleTypeAsset', () => ({
  VehicleTypeAsset: jest.fn(() => <></>),
}));

import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { fireEvent, render, screen } from '@testing-library/react';
import { useObjectTranslation } from '@monkvision/common';
import { labels } from '@monkvision/sights';
import { VehicleTypeAsset } from '../../../src';
import {
  VehicleTypeSelectionCard,
  VehicleTypeSelectionCardProps,
} from '../../../src/components/VehicleTypeSelection/VehicleTypeSelectionCard';

function createProps(): VehicleTypeSelectionCardProps {
  return {
    vehicleType: VehicleType.LARGE_SUV,
    isSelected: false,
    onClick: jest.fn(),
  };
}

describe('VehicleTypeSelectionCard component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display a button that calls the onClick event when clicked', () => {
    const props = createProps();
    const { container, unmount } = render(<VehicleTypeSelectionCard {...props} />);

    const button = container.getElementsByTagName('button').item(0);
    expect(button).not.toBeNull();
    expect(props.onClick).not.toHaveBeenCalled();
    fireEvent.click(button as HTMLButtonElement);
    expect(props.onClick).toHaveBeenCalled();

    unmount();
  });

  it('should not call the onClick event if the vehicle type is already selected', () => {
    const props = createProps();
    props.isSelected = true;
    const { container, unmount } = render(<VehicleTypeSelectionCard {...props} />);

    const button = container.getElementsByTagName('button').item(0);
    expect(button).not.toBeNull();
    fireEvent.click(button as HTMLButtonElement);
    expect(props.onClick).not.toHaveBeenCalled();

    unmount();
  });

  it('should display the vehicle type asset', () => {
    const props = createProps();
    const { unmount } = render(<VehicleTypeSelectionCard {...props} />);

    expectPropsOnChildMock(VehicleTypeAsset, { vehicleType: props.vehicleType });

    unmount();
  });

  it('should display the label of the vehicle type', () => {
    const label = 'hello-test-label';
    const tObj = jest.fn(() => label);
    (useObjectTranslation as jest.Mock).mockImplementationOnce(() => ({ tObj }));
    const props = createProps();
    const { unmount } = render(<VehicleTypeSelectionCard {...props} />);

    expect(tObj).toHaveBeenCalledWith(labels[props.vehicleType]);
    expect(screen.queryByText(label)).not.toBeNull();

    unmount();
  });
});
