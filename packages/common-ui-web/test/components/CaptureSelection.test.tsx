import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import { CaptureSelection } from '../../src';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('CaptureSelection', () => {
  it('renders correctly', () => {
    const { unmount } = render(<CaptureSelection />);

    expect(screen.getByText('addDamage.title')).toBeInTheDocument();
    expect(screen.getByText('addDamage.description')).toBeInTheDocument();
    expect(screen.getByText('addDamage.button')).toBeInTheDocument();
    expect(screen.getByText('capture.title')).toBeInTheDocument();
    expect(screen.getByText('capture.description')).toBeInTheDocument();
    expect(screen.getByText('capture.button')).toBeInTheDocument();

    unmount();
  });

  it('calls onAddDamage when "Add Damage" button is clicked', () => {
    const onAddDamage = jest.fn();
    const { unmount } = render(<CaptureSelection onAddDamage={onAddDamage} />);

    fireEvent.click(screen.getByText('addDamage.button'));
    expect(onAddDamage).toHaveBeenCalled();

    unmount();
  });

  it('calls onCapture when "Take Picture" button is clicked', () => {
    const onCapture = jest.fn();
    const { unmount } = render(<CaptureSelection onCapture={onCapture} />);

    fireEvent.click(screen.getByText('capture.button'));
    expect(onCapture).toHaveBeenCalled();

    unmount();
  });
});
