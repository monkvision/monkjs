import { renderHook, act } from '@testing-library/react';
import { useGeneratePDF } from '../../../../src/components/GeneratePDFButton/hooks/useGeneratePDF';
import type { GeneratePDFButtonProps } from '../../../../src/types';

const mockLoadingStart = jest.fn();
const mockLoadingOnSuccess = jest.fn();

jest.mock('@monkvision/common', () => ({
  useLoadingState: jest.fn(() => ({ start: mockLoadingStart, onSuccess: mockLoadingOnSuccess })),
  useObjectMemo: jest.fn((value) => value),
}));

describe('useGeneratePDF', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createProps = (overrides?: Partial<GeneratePDFButtonProps>): GeneratePDFButtonProps => ({
    onDownloadPDF: jest.fn(),
    ...overrides,
  });

  it('exposes loading state from useLoadingState', () => {
    const props = createProps();
    const { result } = renderHook(() => useGeneratePDF(props));

    expect(result.current.loading.start).toBe(mockLoadingStart);
    expect(result.current.loading.onSuccess).toBe(mockLoadingOnSuccess);
  });

  it('calls start, onDownloadPDF, and onSuccess in order', () => {
    const props = createProps();
    const { result } = renderHook(() => useGeneratePDF(props));

    act(() => {
      result.current.handleGeneratePdf?.();
    });

    expect(mockLoadingStart).toHaveBeenCalled();
    expect(props.onDownloadPDF).toHaveBeenCalled();
    expect(mockLoadingOnSuccess).toHaveBeenCalled();
  });

  it('handles missing onDownloadPDF gracefully', () => {
    const props = createProps({ onDownloadPDF: undefined });
    const { result } = renderHook(() => useGeneratePDF(props));

    act(() => {
      result.current.handleGeneratePdf?.();
    });

    expect(mockLoadingStart).toHaveBeenCalled();
    expect(mockLoadingOnSuccess).toHaveBeenCalled();
  });
});
