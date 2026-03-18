import { render } from '@testing-library/react';
import { DownloadImagesButton } from '../../../src/components/DownloadImagesButton/DownloadImagesButton';
import { DownloadImagesButtonProps } from '../../../src/types/download-images.types';
import { useDownloadImages } from '../../../src/components/DownloadImagesButton/hooks/useDownloadImages';
import { LoadingState } from '@monkvision/common';

jest.mock('@monkvision/common-ui-web');
jest.mock('@monkvision/common');
jest.mock('react-i18next');
jest.mock('../../../src/components/DownloadImagesButton/hooks/useDownloadImages', () => ({
  useDownloadImages: jest.fn(),
}));

const MOCK_LOADING: LoadingState = { isLoading: false } as unknown as LoadingState;
const MOCK_HANDLE_DOWNLOAD = jest.fn();
const MOCK_TRANSLATED_TEXT = 'Download Images';
const MOCK_PRIMARY_COLOR = '#000000';

const MockButton = jest.requireMock('@monkvision/common-ui-web').Button as jest.Mock;
const mockUseMonkTheme = jest.requireMock('@monkvision/common').useMonkTheme as jest.Mock;
const mockUseTranslation = jest.requireMock('react-i18next').useTranslation as jest.Mock;
const mockUseDownloadImages = useDownloadImages as jest.MockedFunction<typeof useDownloadImages>;

function createMockProps(): DownloadImagesButtonProps {
  return {
    onDownloadImages: jest.fn(),
  };
}

describe('DownloadImagesButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    MockButton.mockImplementation(({ children, primaryColor, loading, ...props }) => (
      <button data-primarycolor={primaryColor} data-loading={JSON.stringify(loading)} {...props}>
        {children}
      </button>
    ));

    mockUseDownloadImages.mockReturnValue({
      loading: MOCK_LOADING,
      handleDownloadImages: MOCK_HANDLE_DOWNLOAD,
    });

    mockUseMonkTheme.mockReturnValue({
      palette: {
        text: {
          primary: MOCK_PRIMARY_COLOR,
        },
      },
    });

    mockUseTranslation.mockReturnValue({
      t: jest.fn((_: string) => MOCK_TRANSLATED_TEXT),
    });
  });

  describe('rendering', () => {
    it('should render Button component', () => {
      const props = createMockProps();
      render(<DownloadImagesButton {...props} />);

      expect(MockButton).toHaveBeenCalled();
    });

    it('should render with file-download icon', () => {
      const props = createMockProps();
      render(<DownloadImagesButton {...props} />);

      const lastCall = MockButton.mock.calls[MockButton.mock.calls.length - 1];
      expect(lastCall[0].icon).toBe('file-download');
    });

    it('should render with text variant', () => {
      const props = createMockProps();
      render(<DownloadImagesButton {...props} />);

      const lastCall = MockButton.mock.calls[MockButton.mock.calls.length - 1];
      expect(lastCall[0].variant).toBe('text');
    });

    it('should render with primary color from theme', () => {
      const props = createMockProps();
      render(<DownloadImagesButton {...props} />);

      const lastCall = MockButton.mock.calls[MockButton.mock.calls.length - 1];
      expect(lastCall[0].primaryColor).toBe(MOCK_PRIMARY_COLOR);
    });

    it('should render translated text', () => {
      const props = createMockProps();
      const { getByText } = render(<DownloadImagesButton {...props} />);

      expect(getByText(MOCK_TRANSLATED_TEXT)).toBeDefined();
    });

    it('should pass loading state from hook', () => {
      const props = createMockProps();
      render(<DownloadImagesButton {...props} />);

      const lastCall = MockButton.mock.calls[MockButton.mock.calls.length - 1];
      expect(lastCall[0].loading).toBe(MOCK_LOADING);
    });

    it('should pass loading state when loading is true', () => {
      mockUseDownloadImages.mockReturnValue({
        loading: { isLoading: true } as unknown as LoadingState,
        handleDownloadImages: MOCK_HANDLE_DOWNLOAD,
      });

      const props = createMockProps();
      render(<DownloadImagesButton {...props} />);

      const lastCall = MockButton.mock.calls[MockButton.mock.calls.length - 1];
      expect(lastCall[0].loading).toStrictEqual({ isLoading: true });
    });
  });

  describe('onClick behavior', () => {
    it('should pass handleDownloadImages as onClick handler', () => {
      const props = createMockProps();
      render(<DownloadImagesButton {...props} />);

      const lastCall = MockButton.mock.calls[MockButton.mock.calls.length - 1];
      expect(lastCall[0].onClick).toBe(MOCK_HANDLE_DOWNLOAD);
    });

    it('should call handleDownloadImages when button is clicked', () => {
      const props = createMockProps();
      const { getByRole } = render(<DownloadImagesButton {...props} />);

      const button = getByRole('button');
      button.click();

      expect(MOCK_HANDLE_DOWNLOAD).toHaveBeenCalled();
    });
  });

  describe('hook integration', () => {
    it('should call useDownloadImages with props', () => {
      const props = createMockProps();
      render(<DownloadImagesButton {...props} />);

      expect(mockUseDownloadImages).toHaveBeenCalledWith(props);
    });

    it('should call useMonkTheme', () => {
      const props = createMockProps();
      render(<DownloadImagesButton {...props} />);

      expect(mockUseMonkTheme).toHaveBeenCalled();
    });

    it('should call useTranslation', () => {
      const props = createMockProps();
      render(<DownloadImagesButton {...props} />);

      expect(mockUseTranslation).toHaveBeenCalled();
    });

    it('should translate actionButtons.downloadImages key', () => {
      const mockT = jest.fn((_: string) => MOCK_TRANSLATED_TEXT);
      mockUseTranslation.mockReturnValue({ t: mockT });

      const props = createMockProps();
      render(<DownloadImagesButton {...props} />);

      expect(mockT).toHaveBeenCalledWith('actionButtons.downloadImages');
    });
  });
});
