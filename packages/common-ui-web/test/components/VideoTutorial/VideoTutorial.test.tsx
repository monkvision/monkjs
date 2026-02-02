jest.mock('../../../src/components/VideoTutorial/PhoneRotation', () => ({
  PhoneRotation: jest.fn(() => <div data-testid="phone-rotation" />),
}));
jest.mock('../../../src/components/VideoTutorial/VehicleOrbit', () => ({
  VehicleOrbit: jest.fn(() => <div data-testid="vehicle-orbit" />),
}));
jest.mock('../../../src/components/VideoTutorial/VehicleSurroundings', () => ({
  VehicleSurroundings: jest.fn(() => <div data-testid="vehicle-surroundings" />),
}));
jest.mock('../../../src/components/VideoTutorial/VehiclePhone', () => ({
  VehiclePhone: jest.fn(() => <div data-testid="vehicle-phone" />),
}));
jest.mock('../../../src/components/VideoTutorial/VehicleCovered', () => ({
  VehicleCovered: jest.fn(() => <div data-testid="vehicle-covered" />),
}));
jest.mock('../../../src/components/Button', () => ({
  Button: jest.fn(({ children, secondaryColor, variant, ...props }) => (
    <button {...props}>{children}</button>
  )),
}));

import '@testing-library/jest-dom';
import { render, screen, waitFor, act } from '@testing-library/react';
import { DeviceOrientation } from '@monkvision/types';
import { VideoTutorial } from '../../../src/components/VideoTutorial';
import { PhoneRotation } from '../../../src/components/VideoTutorial/PhoneRotation';
import { VehicleOrbit } from '../../../src/components/VideoTutorial/VehicleOrbit';
import { VehicleSurroundings } from '../../../src/components/VideoTutorial/VehicleSurroundings';
import { VehiclePhone } from '../../../src/components/VideoTutorial/VehiclePhone';
import { VehicleCovered } from '../../../src/components/VideoTutorial/VehicleCovered';
import { Button } from '../../../src/components/Button';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import userEvent from '@testing-library/user-event';

describe('VideoTutorial component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    localStorage.clear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should render the PhoneRotation step initially', () => {
    const { unmount } = render(<VideoTutorial />);

    expect(screen.getByTestId('phone-rotation')).toBeInTheDocument();
    expect(screen.queryByTestId('vehicle-orbit')).not.toBeInTheDocument();

    unmount();
  });

  it('should pass the orientation prop to PhoneRotation', () => {
    const { unmount } = render(<VideoTutorial orientation={DeviceOrientation.PORTRAIT} />);

    expectPropsOnChildMock(PhoneRotation, {
      orientation: DeviceOrientation.PORTRAIT,
    });

    unmount();
  });

  it('should default to LANDSCAPE orientation', () => {
    const { unmount } = render(<VideoTutorial />);

    expectPropsOnChildMock(PhoneRotation, {
      orientation: DeviceOrientation.LANDSCAPE,
    });

    unmount();
  });

  it('should show the continue button after delay', () => {
    const { unmount } = render(<VideoTutorial />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(button).not.toBeDisabled();

    unmount();
  });

  it('should advance to the next step when continue is clicked', () => {
    const { unmount } = render(<VideoTutorial />);

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    const button = screen.getByRole('button');
    
    act(() => {
      button.click();
      jest.advanceTimersByTime(600);
      jest.advanceTimersByTime(100);
    });

    expect(screen.getByTestId('vehicle-orbit')).toBeInTheDocument();
    expect(screen.queryByTestId('phone-rotation')).not.toBeInTheDocument();

    unmount();
  });

  it('should show all tutorial steps in order', () => {
    const { unmount } = render(<VideoTutorial />);

    expect(screen.getByTestId('phone-rotation')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    act(() => {
      screen.getByRole('button').click();
    });
    
    act(() => {
      jest.advanceTimersByTime(700);
    });

    expect(screen.getByTestId('vehicle-orbit')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    act(() => {
      screen.getByRole('button').click();
    });
    
    act(() => {
      jest.advanceTimersByTime(700);
    });

    expect(screen.getByTestId('vehicle-surroundings')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    act(() => {
      screen.getByRole('button').click();
    });
    
    act(() => {
      jest.advanceTimersByTime(700);
    });

    expect(screen.getByTestId('vehicle-phone')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    act(() => {
      screen.getByRole('button').click();
    });
    
    act(() => {
      jest.advanceTimersByTime(700);
    });

    expect(screen.getByTestId('vehicle-covered')).toBeInTheDocument();

    unmount();
  });

  it('should pass orientation to VehiclePhone component', () => {
    const { unmount } = render(<VideoTutorial orientation={DeviceOrientation.PORTRAIT} />);

    // Navigate to VehiclePhone step (step 4, so 3 clicks)
    for (let i = 0; i < 3; i++) {
      act(() => {
        jest.advanceTimersByTime(3000);
      });
      
      act(() => {
        screen.getByRole('button').click();
      });
      
      act(() => {
        jest.advanceTimersByTime(700);
      });
    }

    expectPropsOnChildMock(VehiclePhone, {
      orientation: DeviceOrientation.PORTRAIT,
    });

    unmount();
  });

  it('should show checkbox on the last step', () => {
    const { unmount } = render(<VideoTutorial />);

    // Navigate to last step (4 clicks to get from step 1 to step 5)
    for (let i = 0; i < 4; i++) {
      act(() => {
        jest.advanceTimersByTime(3000);
      });
      
      act(() => {
        screen.getByRole('button').click();
      });
      
      act(() => {
        jest.advanceTimersByTime(700);
      });
    }

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();

    unmount();
  });

  it('should update checkbox state when clicked', () => {
    const { unmount } = render(<VideoTutorial />);

    // Navigate to last step
    for (let i = 0; i < 4; i++) {
      act(() => {
        jest.advanceTimersByTime(3000);
      });
      
      act(() => {
        screen.getByRole('button').click();
      });
      
      act(() => {
        jest.advanceTimersByTime(700);
      });
    }

    const checkbox = screen.getByRole('checkbox');
    
    act(() => {
      checkbox.click();
    });

    expect(checkbox).toBeChecked();

    unmount();
  });

  it('should call onComplete when completing the tutorial', () => {
    const onComplete = jest.fn();
    const { unmount } = render(<VideoTutorial onComplete={onComplete} />);

    // Complete all steps
    for (let i = 0; i < 5; i++) {
      act(() => {
        jest.advanceTimersByTime(3000);
      });
      
      act(() => {
        screen.getByRole('button').click();
      });
      
      act(() => {
        jest.advanceTimersByTime(700);
      });
    }

    expect(onComplete).toHaveBeenCalledWith(false);

    unmount();
  });

  it('should call onComplete with true when checkbox is checked', () => {
    const onComplete = jest.fn();
    const { unmount } = render(<VideoTutorial onComplete={onComplete} />);

    // Navigate to last step
    for (let i = 0; i < 4; i++) {
      act(() => {
        jest.advanceTimersByTime(3000);
      });
      
      act(() => {
        screen.getByRole('button').click();
      });
      
      act(() => {
        jest.advanceTimersByTime(700);
      });
    }

    const checkbox = screen.getByRole('checkbox');
    
    act(() => {
      checkbox.click();
    });
    
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    act(() => {
      screen.getByRole('button').click();
    });
    
    act(() => {
      jest.advanceTimersByTime(700);
    });

    expect(onComplete).toHaveBeenCalledWith(true);

    unmount();
  });

  it('should store preference in localStorage when checkbox is checked', () => {
    const onComplete = jest.fn();
    const { unmount } = render(<VideoTutorial onComplete={onComplete} />);

    // Navigate to last step
    for (let i = 0; i < 4; i++) {
      act(() => {
        jest.advanceTimersByTime(3000);
      });
      
      act(() => {
        screen.getByRole('button').click();
      });
      
      act(() => {
        jest.advanceTimersByTime(700);
      });
    }

    const checkbox = screen.getByRole('checkbox');
    
    act(() => {
      checkbox.click();
    });
    
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    act(() => {
      screen.getByRole('button').click();
    });
    
    act(() => {
      jest.advanceTimersByTime(700);
    });

    expect(localStorage.getItem('@monk_videoTutorial')).toBe('@monk_videoTutorial');

    unmount();
  });

  it('should not store preference in localStorage when checkbox is not checked', () => {
    const onComplete = jest.fn();
    const { unmount } = render(<VideoTutorial onComplete={onComplete} />);

    // Complete all steps
    for (let i = 0; i < 5; i++) {
      act(() => {
        jest.advanceTimersByTime(3000);
      });
      
      act(() => {
        screen.getByRole('button').click();
      });
      
      act(() => {
        jest.advanceTimersByTime(700);
      });
    }

    expect(localStorage.getItem('@monk_videoTutorial')).toBeNull();

    unmount();
  });

  it('should show progress indicators for all steps', () => {
    const { unmount, container } = render(<VideoTutorial />);

    const progressSegments = container.querySelectorAll('[style*="flex"]');
    expect(progressSegments.length).toBeGreaterThan(0);

    unmount();
  });

  it('should render title and subtitle from translations', () => {
    const { unmount, container } = render(<VideoTutorial />);

    const title = container.querySelector('h1');
    const subtitle = container.querySelector('p');

    expect(title).toBeInTheDocument();
    expect(subtitle).toBeInTheDocument();

    unmount();
  });

  it('should change button text on last step', () => {
    const { unmount } = render(<VideoTutorial />);

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expectPropsOnChildMock(Button, {
      children: 'button.continue',
    });

    // Navigate to last step
    for (let i = 0; i < 4; i++) {
      act(() => {
        jest.advanceTimersByTime(3000);
      });
      
      act(() => {
        screen.getByRole('button').click();
      });
      
      act(() => {
        jest.advanceTimersByTime(700);
      });
    }

    const buttonCalls = (Button as jest.Mock).mock.calls;
    const lastCall = buttonCalls[buttonCalls.length - 1][0];
    expect(lastCall.children).toBe('button.get-started');

    unmount();
  });

  it('should call onComplete immediately if localStorage indicates tutorial was seen', () => {
    localStorage.setItem('@monk_videoTutorial', '@monk_videoTutorial');
    const onComplete = jest.fn();

    const { unmount } = render(<VideoTutorial onComplete={onComplete} />);

    expect(onComplete).toHaveBeenCalledWith(true);

    unmount();
  });

  it('should render with custom lang prop', () => {
    const { unmount } = render(<VideoTutorial lang="fr" />);

    expect(screen.getByTestId('phone-rotation')).toBeInTheDocument();

    unmount();
  });
});
