import { render, screen, fireEvent } from '@testing-library/react';
import { useMonkTheme } from '@monkvision/common';
import { Button } from '@monkvision/common-ui-web';
import { DoneButton, type DoneButtonProps } from '../../../src/components/DoneButton';

jest.mock('@monkvision/common', () => ({
  useMonkTheme: jest.fn(),
}));

jest.mock('@monkvision/common-ui-web', () => ({
  Button: jest.fn(({ children, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled} data-testid='done-button'>
      {children}
    </button>
  )),
}));

const mockUseMonkTheme = useMonkTheme as jest.MockedFunction<typeof useMonkTheme>;
const MockButton = Button as jest.MockedFunction<typeof Button>;

const MOCK_BUTTON_TEXT = 'Confirm';
const MOCK_DISABLED_BUTTON_TEXT = 'Save Changes';
const MOCK_PALETTE_BLACK = '#000000';

const mockOnConfirm = jest.fn();

const createMockProps = (overrides?: Partial<DoneButtonProps>): DoneButtonProps => ({
  children: MOCK_BUTTON_TEXT,
  onConfirm: mockOnConfirm,
  disabled: false,
  ...overrides,
});

describe('DoneButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseMonkTheme.mockReturnValue({
      palette: {
        text: {
          black: MOCK_PALETTE_BLACK,
        },
      },
    } as any);
  });

  describe('rendering', () => {
    it('should render button with children text', () => {
      const props = createMockProps();
      render(<DoneButton {...props} />);

      expect(screen.getByTestId('done-button')).toBeTruthy();
      expect(screen.getByText(MOCK_BUTTON_TEXT)).toBeTruthy();
    });

    it('should render with custom children text', () => {
      const customText = 'Apply';
      const props = createMockProps({ children: customText });
      render(<DoneButton {...props} />);

      expect(screen.getByText(customText)).toBeTruthy();
    });

    it('should render button in container', () => {
      const props = createMockProps();
      const { container } = render(<DoneButton {...props} />);

      const containerDiv = container.querySelector('div');
      expect(containerDiv).toBeTruthy();
    });
  });

  describe('Button component props', () => {
    it('should pass disabled prop to Button', () => {
      const props = createMockProps({ disabled: true });
      render(<DoneButton {...props} />);

      const lastCall = MockButton.mock.calls[MockButton.mock.calls.length - 1];
      expect(lastCall[0].disabled).toBe(true);
    });

    it('should pass disabled false by default', () => {
      const props = createMockProps();
      render(<DoneButton {...props} />);

      const lastCall = MockButton.mock.calls[MockButton.mock.calls.length - 1];
      expect(lastCall[0].disabled).toBe(false);
    });

    it('should pass variant outline to Button', () => {
      const props = createMockProps();
      render(<DoneButton {...props} />);

      const lastCall = MockButton.mock.calls[MockButton.mock.calls.length - 1];
      expect(lastCall[0].variant).toBe('outline');
    });

    it('should pass primaryColor text-white to Button', () => {
      const props = createMockProps();
      render(<DoneButton {...props} />);

      const lastCall = MockButton.mock.calls[MockButton.mock.calls.length - 1];
      expect(lastCall[0].primaryColor).toBe('text-white');
    });

    it('should pass onClick handler to Button', () => {
      const props = createMockProps();
      render(<DoneButton {...props} />);

      const lastCall = MockButton.mock.calls[MockButton.mock.calls.length - 1];
      expect(lastCall[0].onClick).toBe(mockOnConfirm);
    });

    it('should apply backgroundColor from palette', () => {
      const props = createMockProps();
      render(<DoneButton {...props} />);

      const lastCall = MockButton.mock.calls[MockButton.mock.calls.length - 1];
      expect(lastCall[0].style?.backgroundColor).toBe(MOCK_PALETTE_BLACK);
    });
  });

  describe('interactions', () => {
    it('should call onConfirm when button is clicked', () => {
      const props = createMockProps();
      render(<DoneButton {...props} />);

      const button = screen.getByTestId('done-button');
      fireEvent.click(button);

      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });

    it('should not call onConfirm when disabled button is clicked', () => {
      const props = createMockProps({ disabled: true });
      render(<DoneButton {...props} />);

      const button = screen.getByTestId('done-button');
      fireEvent.click(button);

      expect(mockOnConfirm).not.toHaveBeenCalled();
    });

    it('should call onConfirm multiple times on multiple clicks', () => {
      const props = createMockProps();
      render(<DoneButton {...props} />);

      const button = screen.getByTestId('done-button');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(mockOnConfirm).toHaveBeenCalledTimes(3);
    });
  });

  describe('theme integration', () => {
    it('should call useMonkTheme hook', () => {
      const props = createMockProps();
      render(<DoneButton {...props} />);

      expect(mockUseMonkTheme).toHaveBeenCalled();
    });

    it('should apply different palette colors', () => {
      const customBlack = '#333333';
      mockUseMonkTheme.mockReturnValue({
        palette: {
          text: {
            black: customBlack,
          },
        },
      } as any);

      const props = createMockProps();
      render(<DoneButton {...props} />);

      const lastCall = MockButton.mock.calls[MockButton.mock.calls.length - 1];
      expect(lastCall[0].style?.backgroundColor).toBe(customBlack);
    });
  });

  describe('disabled state', () => {
    it('should render disabled button', () => {
      const props = createMockProps({ disabled: true, children: MOCK_DISABLED_BUTTON_TEXT });
      render(<DoneButton {...props} />);

      const button = screen.getByTestId('done-button') as HTMLButtonElement;
      expect(button.disabled).toBe(true);
    });

    it('should render enabled button by default', () => {
      const props = createMockProps();
      render(<DoneButton {...props} />);

      const button = screen.getByTestId('done-button') as HTMLButtonElement;
      expect(button.disabled).toBe(false);
    });

    it('should render enabled button when explicitly set to false', () => {
      const props = createMockProps({ disabled: false });
      render(<DoneButton {...props} />);

      const button = screen.getByTestId('done-button') as HTMLButtonElement;
      expect(button.disabled).toBe(false);
    });
  });
});
