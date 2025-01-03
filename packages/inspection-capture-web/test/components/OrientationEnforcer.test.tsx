jest.mock('../../src/hooks', () => ({
  useEnforceOrientation: jest.fn(() => false),
}));

import '@testing-library/jest-dom';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { render, screen } from '@testing-library/react';
import { DeviceOrientation } from '@monkvision/types';
import { useEnforceOrientation } from '../../src/hooks';
import { OrientationEnforcer } from '../../src/components';
import { Icon } from '@monkvision/common-ui-web';

describe('OrientationEnforcer component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return null if the orientation is valid', () => {
    const orientation = DeviceOrientation.PORTRAIT;
    const { container, unmount } = render(<OrientationEnforcer orientation={orientation} />);

    expect(useEnforceOrientation).toHaveBeenCalledWith(orientation);
    expect(container).toBeEmptyDOMElement();

    unmount();
  });

  it('should display an error message if the orientation is not valid', () => {
    (useEnforceOrientation as jest.Mock).mockImplementationOnce(() => true);
    const orientation = DeviceOrientation.LANDSCAPE;
    const { container, unmount } = render(<OrientationEnforcer orientation={orientation} />);

    expect(useEnforceOrientation).toHaveBeenCalledWith(orientation);
    expect(container).not.toBeEmptyDOMElement();

    expect(screen.queryByText('orientationEnforcer.title')).not.toBeNull();
    expect(screen.queryByText('orientationEnforcer.description')).not.toBeNull();
    expectPropsOnChildMock(Icon, {
      icon: 'rotate',
      primaryColor: 'text-primary',
      size: 30,
    });

    unmount();
  });
});
