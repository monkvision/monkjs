import { OrientationEnforcer } from '../../src/components';
import { render, screen } from '@testing-library/react';
import { Icon } from '@monkvision/common-ui-web';
import { DeviceOrientation } from '@monkvision/types';
import { useWindowDimensions } from '@monkvision/common';
import { expectPropsOnChildMock } from '@monkvision/test-utils';

describe('OrientationEnforcer component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the children when the orientation is not specified', () => {
    const testId = 'test-test';
    const { unmount } = render(
      <OrientationEnforcer>
        <div data-testid={testId} />
      </OrientationEnforcer>,
    );

    expect(screen.queryByTestId(testId)).not.toBeNull();
    expect(screen.queryByText('orientationEnforcer.title')).toBeNull();
    expect(screen.queryByText('orientationEnforcer.description')).toBeNull();
    expect(Icon).not.toHaveBeenCalled();

    unmount();
  });

  [DeviceOrientation.PORTRAIT, DeviceOrientation.LANDSCAPE].forEach((orientation) => {
    it(`should return the children when the orientation matches (${orientation})`, () => {
      const testId = 'testo';
      (useWindowDimensions as jest.Mock).mockImplementationOnce(() => ({
        isPortrait: orientation === DeviceOrientation.PORTRAIT,
      }));
      const { unmount } = render(
        <OrientationEnforcer orientation={orientation}>
          <div data-testid={testId} />
        </OrientationEnforcer>,
      );

      expect(screen.queryByTestId(testId)).not.toBeNull();
      expect(screen.queryByText('orientationEnforcer.title')).toBeNull();
      expect(screen.queryByText('orientationEnforcer.description')).toBeNull();
      expect(Icon).not.toHaveBeenCalled();

      unmount();
    });

    it(`should return an error when the orientation doesn't match (${orientation})`, () => {
      const testId = 'test';
      (useWindowDimensions as jest.Mock).mockImplementationOnce(() => ({
        isPortrait: orientation === DeviceOrientation.LANDSCAPE,
      }));
      const { unmount } = render(
        <OrientationEnforcer orientation={orientation}>
          <div data-testid={testId} />
        </OrientationEnforcer>,
      );

      expect(screen.queryByTestId(testId)).toBeNull();
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
});
