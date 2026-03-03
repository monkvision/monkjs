import { renderHook, act, waitFor } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { getLanguage, LoadingState, useLoadingState } from '@monkvision/common';
import { Image, Inspection } from '@monkvision/types';
import { useInspectionReviewProvider } from '../../../../src/hooks';
import { useDownloadImages } from '../../../../src/components/DownloadImagesButton/hooks/useDownloadImages';
import { DownloadImagesButtonProps } from '../../../../src/types/download-images.types';
import { GalleryItem, InspectionReviewProviderState } from '../../../../src/types';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

jest.mock('jszip');
jest.mock('file-saver');

jest.mock('@monkvision/common', () => ({
  ...jest.requireActual('@monkvision/common'),
  getLanguage: jest.fn(),
  useLoadingState: jest.fn(),
}));

jest.mock('../../../../src/hooks', () => ({
  useInspectionReviewProvider: jest.fn(),
}));

const mockUseTranslation = useTranslation as jest.MockedFunction<typeof useTranslation>;
const mockGetLanguage = getLanguage as jest.MockedFunction<typeof getLanguage>;
const mockUseLoadingState = useLoadingState as jest.MockedFunction<typeof useLoadingState>;
const mockUseInspectionReviewProvider = useInspectionReviewProvider as jest.MockedFunction<
  typeof useInspectionReviewProvider
>;
const MockJSZip = JSZip as jest.MockedClass<typeof JSZip>;
const mockSaveAs = saveAs as jest.MockedFunction<typeof saveAs>;

const MOCK_LANGUAGE = 'en';
const MOCK_IMAGE_PATH_1 = 'https://example.com/image1.jpg';
const MOCK_IMAGE_PATH_2 = 'https://example.com/image2.jpg';
const MOCK_IMAGE_LABEL_EN_1 = 'Front View';
const MOCK_IMAGE_LABEL_EN_2 = 'Back View';
const MOCK_VIN = 'ABC123XYZ';
const MOCK_INSPECTION_ID = 'inspection-123';

const mockLoadingStart = jest.fn();
const mockLoadingOnSuccess = jest.fn();
const mockOnDownloadImages = jest.fn();

const createMockGalleryItem = (overrides?: Partial<GalleryItem>): GalleryItem =>
  ({
    id: 'item-id',
    image: {
      id: 'image-id',
      path: MOCK_IMAGE_PATH_1,
      label: { [MOCK_LANGUAGE]: MOCK_IMAGE_LABEL_EN_1 },
    },
    sight: undefined,
    renderedOutput: undefined,
    hasDamage: false,
    parts: [],
    totalPolygonArea: 0,
    ...overrides,
  } as GalleryItem);

const MOCK_GALLERY_ITEMS = [
  createMockGalleryItem({
    image: {
      id: 'image-1',
      path: MOCK_IMAGE_PATH_1,
      label: { [MOCK_LANGUAGE]: MOCK_IMAGE_LABEL_EN_1 },
    } as unknown as Image,
  }),
  createMockGalleryItem({
    image: {
      id: 'image-2',
      path: MOCK_IMAGE_PATH_2,
      label: { [MOCK_LANGUAGE]: MOCK_IMAGE_LABEL_EN_2 },
    } as unknown as Image,
  }),
];

const createMockProps = (
  overrides?: Partial<DownloadImagesButtonProps>,
): DownloadImagesButtonProps => ({
  onDownloadImages: undefined,
  ...overrides,
});

describe('useDownloadImages', () => {
  let mockZipInstance: JSZip;
  let mockBlob: Blob;

  beforeEach(() => {
    jest.clearAllMocks();

    mockBlob = new Blob(['image data'], { type: 'image/jpeg' });

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      blob: jest.fn().mockResolvedValue(mockBlob),
    });

    mockZipInstance = {
      file: jest.fn(),
      generateAsync: jest
        .fn()
        .mockResolvedValue(new Blob(['zip data'], { type: 'application/zip' })),
    } as unknown as JSZip;

    MockJSZip.mockImplementation(() => mockZipInstance);

    mockUseLoadingState.mockReturnValue({
      start: mockLoadingStart,
      onSuccess: mockLoadingOnSuccess,
      onError: jest.fn(),
      isLoading: false,
    } as unknown as LoadingState);

    mockUseTranslation.mockReturnValue({
      i18n: { language: MOCK_LANGUAGE },
    } as unknown as ReturnType<typeof useTranslation>);

    mockGetLanguage.mockReturnValue(MOCK_LANGUAGE);

    mockUseInspectionReviewProvider.mockReturnValue({
      allGalleryItems: MOCK_GALLERY_ITEMS,
      inspection: { id: MOCK_INSPECTION_ID } as Inspection,
      additionalInfo: undefined,
    } as InspectionReviewProviderState);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('initialization', () => {
    it('should return loading state and handleDownloadImages function', () => {
      const props = createMockProps();
      const { result } = renderHook(() => useDownloadImages(props));

      expect(result.current.loading).toBeDefined();
      expect(result.current.handleDownloadImages).toBeDefined();
      expect(typeof result.current.handleDownloadImages).toBe('function');
    });

    it('should call useLoadingState hook', () => {
      const props = createMockProps();
      renderHook(() => useDownloadImages(props));

      expect(mockUseLoadingState).toHaveBeenCalled();
    });

    it('should call useInspectionReviewProvider hook', () => {
      const props = createMockProps();
      renderHook(() => useDownloadImages(props));

      expect(mockUseInspectionReviewProvider).toHaveBeenCalled();
    });

    it('should call useTranslation hook', () => {
      const props = createMockProps();
      renderHook(() => useDownloadImages(props));

      expect(mockUseTranslation).toHaveBeenCalled();
    });
  });

  describe('custom download handler', () => {
    it('should call custom onDownloadImages when provided', () => {
      const props = createMockProps({ onDownloadImages: mockOnDownloadImages });
      const { result } = renderHook(() => useDownloadImages(props));

      act(() => {
        result.current.handleDownloadImages();
      });

      expect(mockOnDownloadImages).toHaveBeenCalledWith(MOCK_GALLERY_ITEMS);
    });

    it('should call loading.start when custom handler is provided', () => {
      const props = createMockProps({ onDownloadImages: mockOnDownloadImages });
      const { result } = renderHook(() => useDownloadImages(props));

      act(() => {
        result.current.handleDownloadImages();
      });

      expect(mockLoadingStart).toHaveBeenCalled();
    });

    it('should call loading.onSuccess when custom handler is provided', () => {
      const props = createMockProps({ onDownloadImages: mockOnDownloadImages });
      const { result } = renderHook(() => useDownloadImages(props));

      act(() => {
        result.current.handleDownloadImages();
      });

      expect(mockLoadingOnSuccess).toHaveBeenCalled();
    });

    it('should not fetch images when custom handler is provided', () => {
      const props = createMockProps({ onDownloadImages: mockOnDownloadImages });
      const { result } = renderHook(() => useDownloadImages(props));

      act(() => {
        result.current.handleDownloadImages();
      });

      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe('default download handler', () => {
    it('should fetch all gallery item images', async () => {
      const props = createMockProps();
      const { result } = renderHook(() => useDownloadImages(props));

      act(() => {
        result.current.handleDownloadImages();
      });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(MOCK_IMAGE_PATH_1);
        expect(global.fetch).toHaveBeenCalledWith(MOCK_IMAGE_PATH_2);
        expect(global.fetch).toHaveBeenCalledTimes(MOCK_GALLERY_ITEMS.length);
      });
    });

    it('should create zip file with images', async () => {
      const props = createMockProps();
      const { result } = renderHook(() => useDownloadImages(props));

      act(() => {
        result.current.handleDownloadImages();
      });

      await waitFor(() => {
        expect(MockJSZip).toHaveBeenCalled();
        expect(mockZipInstance.file).toHaveBeenCalled();
      });
    });

    it('should use kebab-case labels for image filenames', async () => {
      const props = createMockProps();
      const { result } = renderHook(() => useDownloadImages(props));

      act(() => {
        result.current.handleDownloadImages();
      });

      await waitFor(() => {
        expect(mockZipInstance.file).toHaveBeenCalledWith('front-view.jpg', expect.any(Blob));
        expect(mockZipInstance.file).toHaveBeenCalledWith('back-view.jpg', expect.any(Blob));
      });
    });

    it('should use index for filename when label is missing', async () => {
      mockUseInspectionReviewProvider.mockReturnValue({
        allGalleryItems: [
          createMockGalleryItem({
            image: { id: 'image-1', path: MOCK_IMAGE_PATH_1, label: undefined } as Image,
          }),
        ],
        inspection: { id: MOCK_INSPECTION_ID } as Inspection,
        additionalInfo: undefined,
      } as InspectionReviewProviderState);

      const props = createMockProps();
      const { result } = renderHook(() => useDownloadImages(props));

      act(() => {
        result.current.handleDownloadImages();
      });

      await waitFor(() => {
        expect(mockZipInstance.file).toHaveBeenCalledWith('0.jpg', expect.any(Blob));
      });
    });

    it('should generate zip file as blob', async () => {
      const props = createMockProps();
      const { result } = renderHook(() => useDownloadImages(props));

      act(() => {
        result.current.handleDownloadImages();
      });

      await waitFor(() => {
        expect(mockZipInstance.generateAsync).toHaveBeenCalledWith({ type: 'blob' });
      });
    });

    it('should save zip file with VIN as filename when available', async () => {
      mockUseInspectionReviewProvider.mockReturnValue({
        allGalleryItems: MOCK_GALLERY_ITEMS,
        inspection: { id: MOCK_INSPECTION_ID } as Inspection,
        additionalInfo: { vin: MOCK_VIN },
      } as unknown as InspectionReviewProviderState);

      const props = createMockProps();
      const { result } = renderHook(() => useDownloadImages(props));

      act(() => {
        result.current.handleDownloadImages();
      });

      await waitFor(() => {
        expect(mockSaveAs).toHaveBeenCalledWith(expect.any(Blob), `${MOCK_VIN}.zip`);
      });
    });

    it('should save zip file with uppercase VIN when lowercase not available', async () => {
      mockUseInspectionReviewProvider.mockReturnValue({
        allGalleryItems: MOCK_GALLERY_ITEMS,
        inspection: { id: MOCK_INSPECTION_ID } as Inspection,
        additionalInfo: { VIN: MOCK_VIN },
      } as unknown as InspectionReviewProviderState);

      const props = createMockProps();
      const { result } = renderHook(() => useDownloadImages(props));

      act(() => {
        result.current.handleDownloadImages();
      });

      await waitFor(() => {
        expect(mockSaveAs).toHaveBeenCalledWith(expect.any(Blob), `${MOCK_VIN}.zip`);
      });
    });

    it('should save zip file with inspection ID when VIN not available', async () => {
      const props = createMockProps();
      const { result } = renderHook(() => useDownloadImages(props));

      act(() => {
        result.current.handleDownloadImages();
      });

      await waitFor(() => {
        expect(mockSaveAs).toHaveBeenCalledWith(expect.any(Blob), `${MOCK_INSPECTION_ID}.zip`);
      });
    });

    it('should save zip file with default name when VIN and inspection ID not available', async () => {
      mockUseInspectionReviewProvider.mockReturnValue({
        allGalleryItems: MOCK_GALLERY_ITEMS,
        inspection: undefined,
        additionalInfo: undefined,
      } as unknown as InspectionReviewProviderState);

      const props = createMockProps();
      const { result } = renderHook(() => useDownloadImages(props));

      act(() => {
        result.current.handleDownloadImages();
      });

      await waitFor(() => {
        expect(mockSaveAs).toHaveBeenCalledWith(expect.any(Blob), 'inspection-images.zip');
      });
    });

    it('should call loading.start before download', () => {
      const props = createMockProps();
      const { result } = renderHook(() => useDownloadImages(props));

      act(() => {
        result.current.handleDownloadImages();
      });

      expect(mockLoadingStart).toHaveBeenCalled();
    });

    it('should call loading.onSuccess after download', () => {
      const props = createMockProps();
      const { result } = renderHook(() => useDownloadImages(props));

      act(() => {
        result.current.handleDownloadImages();
      });

      expect(mockLoadingOnSuccess).toHaveBeenCalled();
    });
  });

  describe('language handling', () => {
    it('should call getLanguage with current language', async () => {
      const props = createMockProps();
      const { result } = renderHook(() => useDownloadImages(props));

      act(() => {
        result.current.handleDownloadImages();
      });

      await waitFor(() => {
        expect(mockGetLanguage).toHaveBeenCalledWith(MOCK_LANGUAGE);
      });
    });

    it('should use label for current language', async () => {
      const frenchLabel = 'Vue Avant';
      mockGetLanguage.mockReturnValue('fr');

      mockUseInspectionReviewProvider.mockReturnValue({
        allGalleryItems: [
          createMockGalleryItem({
            image: {
              id: 'image-1',
              path: MOCK_IMAGE_PATH_1,
              label: { en: MOCK_IMAGE_LABEL_EN_1, fr: frenchLabel },
            } as Image,
          }),
        ],
        inspection: { id: MOCK_INSPECTION_ID } as Inspection,
        additionalInfo: undefined,
      } as unknown as InspectionReviewProviderState);

      const props = createMockProps();
      const { result } = renderHook(() => useDownloadImages(props));

      act(() => {
        result.current.handleDownloadImages();
      });

      await waitFor(() => {
        expect(mockZipInstance.file).toHaveBeenCalledWith('vue-avant.jpg', expect.any(Blob));
      });
    });
  });

  describe('kebab-case transformation', () => {
    it('should transform spaces to hyphens', async () => {
      mockUseInspectionReviewProvider.mockReturnValue({
        allGalleryItems: [
          createMockGalleryItem({
            image: {
              id: 'image-1',
              path: MOCK_IMAGE_PATH_1,
              label: { [MOCK_LANGUAGE]: 'Multiple Word Label' },
            } as Image,
          }),
        ],
        inspection: { id: MOCK_INSPECTION_ID } as Inspection,
        additionalInfo: undefined,
      } as unknown as InspectionReviewProviderState);

      const props = createMockProps();
      const { result } = renderHook(() => useDownloadImages(props));

      act(() => {
        result.current.handleDownloadImages();
      });

      await waitFor(() => {
        expect(mockZipInstance.file).toHaveBeenCalledWith(
          'multiple-word-label.jpg',
          expect.any(Blob),
        );
      });
    });

    it('should convert to lowercase', async () => {
      mockUseInspectionReviewProvider.mockReturnValue({
        allGalleryItems: [
          createMockGalleryItem({
            image: {
              id: 'image-1',
              path: MOCK_IMAGE_PATH_1,
              label: { [MOCK_LANGUAGE]: 'UPPERCASE LABEL' },
            } as Image,
          }),
        ],
        inspection: { id: MOCK_INSPECTION_ID } as Inspection,
        additionalInfo: undefined,
      } as unknown as InspectionReviewProviderState);

      const props = createMockProps();
      const { result } = renderHook(() => useDownloadImages(props));

      act(() => {
        result.current.handleDownloadImages();
      });

      await waitFor(() => {
        expect(mockZipInstance.file).toHaveBeenCalledWith('uppercase-label.jpg', expect.any(Blob));
      });
    });
  });
});
