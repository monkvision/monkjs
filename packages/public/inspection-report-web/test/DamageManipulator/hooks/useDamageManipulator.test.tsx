import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { Severity } from '@monkvision/types';
import { useDamageManipulator } from '../../../src/DamageManipulator/hooks';

describe('useDamageManipulator hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useDamageManipulator({}));

    expect(result.current.hasDamage).toBe(false);
    expect(result.current.editedDamage).toBeUndefined();
    expect(result.current.isShow).toBe(true);
  });

  it('should toggle damage switch correctly', () => {
    const { result } = renderHook(() => useDamageManipulator({}));

    expect(result.current.hasDamage).toBe(false);

    act(() => {
      result.current.toggleDamageSwitch();
    });

    expect(result.current.hasDamage).toBe(true);
    expect(result.current.editedDamage).toEqual({
      pricing: 1,
      severity: Severity.LOW,
    });
  });

  it('should handle severity change correctly', () => {
    const { result } = renderHook(() => useDamageManipulator({}));

    expect(result.current.editedDamage?.severity).toBeUndefined();

    act(() => {
      result.current.handleSeverityChange(Severity.MODERATE);
    });

    expect(result.current.editedDamage?.severity).toBe(Severity.MODERATE);
  });

  it('should handle price change correctly', () => {
    const { result } = renderHook(() => useDamageManipulator({}));

    expect(result.current.editedDamage?.pricing).toBeUndefined();

    act(() => {
      result.current.handlePriceChange(5);
    });

    expect(result.current.editedDamage?.pricing).toBe(5);
  });

  it('should handle show content correctly', () => {
    const { result } = renderHook(() => useDamageManipulator({}));

    expect(result.current.isShow).toBe(true);

    act(() => {
      result.current.showContent();
    });

    expect(result.current.isShow).toBe(false);
  });

  it('should handle confirm correctly', () => {
    const onConfirmMock = jest.fn();
    const { result } = renderHook(() => useDamageManipulator({ onConfirm: onConfirmMock }));

    act(() => {
      result.current.handleConfirm();
    });

    expect(onConfirmMock).not.toHaveBeenCalled();

    act(() => {
      result.current.handlePriceChange(5);
      result.current.handleSeverityChange(Severity.HIGH);
    });

    act(() => {
      result.current.handleConfirm();
    });

    expect(onConfirmMock).toHaveBeenCalledWith({ pricing: 5, severity: Severity.HIGH });
  });
});
