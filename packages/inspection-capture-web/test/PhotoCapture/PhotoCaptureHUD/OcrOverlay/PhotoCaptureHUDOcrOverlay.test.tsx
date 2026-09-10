jest.mock(
  '../../../../src/PhotoCapture/PhotoCaptureHUD/OcrOverlay/PhotoCaptureHUDOcrConfirmModal',
  () => ({
    PhotoCaptureHUDOcrConfirmModal: jest.fn(() => <div data-testid='ocr-confirm-modal' />),
  }),
);

import React from 'react';
import '@testing-library/jest-dom';
import { act, render, screen } from '@testing-library/react';
import { useOcr } from '@monkvision/ml-web';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import {
  PhotoCaptureHUDOcrOverlay,
  PhotoCaptureHUDOcrOverlayProps,
} from '../../../../src/PhotoCapture/PhotoCaptureHUD/OcrOverlay/PhotoCaptureHUDOcrOverlay';
import { PhotoCaptureHUDOcrConfirmModal } from '../../../../src/PhotoCapture/PhotoCaptureHUD/OcrOverlay/PhotoCaptureHUDOcrConfirmModal';

function createOcrResult(overrides: Record<string, unknown> = {}) {
  return {
    isReady: true,
    isLoading: false,
    isInferring: false,
    fatalError: null,
    confirmedText: null,
    detectedText: '',
    chars: [],
    consistencyCount: 0,
    loadModels: jest.fn(),
    unloadModels: jest.fn(),
    processFrame: jest.fn(),
    reset: jest.fn(),
    ...overrides,
  };
}

function createProps(overrides?: Partial<PhotoCaptureHUDOcrOverlayProps>): PhotoCaptureHUDOcrOverlayProps {
  return {
    config: { recModelUrl: 'test-rec-model-url', dictUrl: 'test-dict-url' },
    getImageData: jest.fn(() => new ImageData(100, 100)),
    isCameraLoading: false,
    isActive: true,
    previewDimensions: { width: 1920, height: 1080 },
    mode: 'vin',
    ...overrides,
  };
}

describe('PhotoCaptureHUDOcrOverlay', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('renders nothing when isActive is false', () => {
    (useOcr as jest.Mock).mockReturnValue(createOcrResult());
    const { container } = render(
      <PhotoCaptureHUDOcrOverlay {...createProps({ isActive: false })} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders the overlay container when isActive is true', () => {
    (useOcr as jest.Mock).mockReturnValue(createOcrResult());
    const { container } = render(<PhotoCaptureHUDOcrOverlay {...createProps()} />);
    expect(container.firstChild).not.toBeNull();
  });

  it('calls loadModels on mount', () => {
    const mockLoadModels = jest.fn();
    (useOcr as jest.Mock).mockReturnValue(createOcrResult({ loadModels: mockLoadModels }));
    render(<PhotoCaptureHUDOcrOverlay {...createProps()} />);
    expect(mockLoadModels).toHaveBeenCalled();
  });

  it('calls reset when isActive changes to false', () => {
    const mockReset = jest.fn();
    (useOcr as jest.Mock).mockReturnValue(createOcrResult({ reset: mockReset }));
    const props = createProps();
    const { rerender } = render(<PhotoCaptureHUDOcrOverlay {...props} />);
    mockReset.mockClear();
    rerender(<PhotoCaptureHUDOcrOverlay {...props} isActive={false} />);
    expect(mockReset).toHaveBeenCalled();
  });

  it('calls reset when sightId changes', () => {
    const mockReset = jest.fn();
    (useOcr as jest.Mock).mockReturnValue(createOcrResult({ reset: mockReset }));
    const props = createProps({ sightId: 'sight-1' });
    const { rerender } = render(<PhotoCaptureHUDOcrOverlay {...props} />);
    mockReset.mockClear();
    rerender(<PhotoCaptureHUDOcrOverlay {...props} sightId='sight-2' />);
    expect(mockReset).toHaveBeenCalled();
  });

  it('calls onFallbackReady when the OCR timeout expires', async () => {
    jest.useFakeTimers();
    const onFallbackReady = jest.fn();
    (useOcr as jest.Mock).mockReturnValue(createOcrResult());
    render(
      <PhotoCaptureHUDOcrOverlay
        {...createProps({
          config: { recModelUrl: 'test-rec', dictUrl: 'test-dict', ocrTimeoutMs: 5000 },
          onFallbackReady,
        })}
      />,
    );
    await act(async () => {
      jest.advanceTimersByTime(5100);
    });
    expect(onFallbackReady).toHaveBeenCalled();
  });

  it('shows the shutter hint after the OCR timeout expires', async () => {
    jest.useFakeTimers();
    (useOcr as jest.Mock).mockReturnValue(createOcrResult());
    render(
      <PhotoCaptureHUDOcrOverlay
        {...createProps({ config: { recModelUrl: 'test-rec', dictUrl: 'test-dict', ocrTimeoutMs: 5000 } })}
      />,
    );
    await act(async () => {
      jest.advanceTimersByTime(5100);
    });
    expect(screen.getByText('Use the shutter button to take a picture')).toBeInTheDocument();
  });

  it('does not show the confirm modal when no text is confirmed yet', () => {
    (useOcr as jest.Mock).mockReturnValue(createOcrResult({ confirmedText: null }));
    render(<PhotoCaptureHUDOcrOverlay {...createProps()} />);
    expect(screen.queryByTestId('ocr-confirm-modal')).not.toBeInTheDocument();
  });

  describe('onFallbackReady is not called before the timeout', () => {
    it('does not fire onFallbackReady immediately on mount', () => {
      jest.useFakeTimers();
      const onFallbackReady = jest.fn();
      (useOcr as jest.Mock).mockReturnValue(createOcrResult());
      render(
        <PhotoCaptureHUDOcrOverlay
          {...createProps({
            config: { recModelUrl: 'test-rec', dictUrl: 'test-dict', ocrTimeoutMs: 5000 },
            onFallbackReady,
          })}
        />,
      );
      jest.advanceTimersByTime(1000);
      expect(onFallbackReady).not.toHaveBeenCalled();
    });
  });

  describe('OCR modal props', () => {
    it('shows the shutter hint in fallback mode before a picture is taken', async () => {
      jest.useFakeTimers();
      (useOcr as jest.Mock).mockReturnValue(createOcrResult());
      render(
        <PhotoCaptureHUDOcrOverlay
          {...createProps({
            config: { recModelUrl: 'test-rec', dictUrl: 'test-dict', ocrTimeoutMs: 5000 },
            mode: 'vin',
          })}
        />,
      );
      await act(async () => {
        jest.advanceTimersByTime(5100);
      });
      // isFallbackReady=true and ocrPicture=null → shutter hint is visible.
      expect(screen.getByText('Use the shutter button to take a picture')).toBeInTheDocument();
    });
  });

  it('does not show the confirm modal when confirmedText is set but no crop canvas exists yet', () => {
    // The modal requires ocrPicture to be non-null. ocrPicture is only set after the
    // interval runs (which is mocked as a no-op), so the modal stays hidden even when
    // the OCR hook reports a confirmed reading.
    (useOcr as jest.Mock).mockReturnValue(
      createOcrResult({ confirmedText: 'INVALID!VIN', consistencyCount: 3 }),
    );
    render(<PhotoCaptureHUDOcrOverlay {...createProps({ mode: 'vin' })} />);
    expect(screen.queryByTestId('ocr-confirm-modal')).not.toBeInTheDocument();
  });
});
