import { renderHook, act } from '@testing-library/react';
import { useTabViews, type TabViewsProps } from '../../src/hooks/useTabViews';
import { InteriorViews } from '../../src/types';

const MOCK_VIEWS = [InteriorViews.DamagesList, InteriorViews.AddDamage];
const CUSTOM_VIEWS = ['view1', 'view2', 'view3'];

const createMockProps = <T>(overrides?: Partial<TabViewsProps<T>>): TabViewsProps<T> => ({
  views: MOCK_VIEWS as T[],
  ...overrides,
});

describe('useTabViews', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with first view from views array', () => {
      const props = createMockProps<InteriorViews>();
      const { result } = renderHook(() => useTabViews(props));

      expect(result.current.currentView).toBe(MOCK_VIEWS[0]);
    });

    it('should handle different view types', () => {
      const props = createMockProps<string>({ views: CUSTOM_VIEWS });
      const { result } = renderHook(() => useTabViews(props));

      expect(result.current.currentView).toBe(CUSTOM_VIEWS[0]);
    });

    it('should handle single view in array', () => {
      const SINGLE_VIEW = [InteriorViews.DamagesList];
      const props = createMockProps<InteriorViews>({ views: SINGLE_VIEW });
      const { result } = renderHook(() => useTabViews(props));

      expect(result.current.currentView).toBe(SINGLE_VIEW[0]);
    });
  });

  describe('view changes', () => {
    it('should update currentView when setCurrentView is called', () => {
      const props = createMockProps<InteriorViews>();
      const { result } = renderHook(() => useTabViews(props));

      act(() => {
        result.current.setCurrentView(MOCK_VIEWS[1]);
      });

      expect(result.current.currentView).toBe(MOCK_VIEWS[1]);
    });

    it('should allow switching between multiple views', () => {
      const props = createMockProps<string>({ views: CUSTOM_VIEWS });
      const { result } = renderHook(() => useTabViews(props));

      act(() => {
        result.current.setCurrentView(CUSTOM_VIEWS[1]);
      });

      expect(result.current.currentView).toBe(CUSTOM_VIEWS[1]);

      act(() => {
        result.current.setCurrentView(CUSTOM_VIEWS[2]);
      });

      expect(result.current.currentView).toBe(CUSTOM_VIEWS[2]);

      act(() => {
        result.current.setCurrentView(CUSTOM_VIEWS[0]);
      });

      expect(result.current.currentView).toBe(CUSTOM_VIEWS[0]);
    });

    it('should maintain view state across multiple renders', () => {
      const props = createMockProps<InteriorViews>();
      const { result, rerender } = renderHook(() => useTabViews(props));

      act(() => {
        result.current.setCurrentView(MOCK_VIEWS[1]);
      });

      rerender();

      expect(result.current.currentView).toBe(MOCK_VIEWS[1]);
    });
  });

  describe('return value stability', () => {
    it('should return new reference when currentView changes', () => {
      const props = createMockProps<InteriorViews>();
      const { result } = renderHook(() => useTabViews(props));

      const firstResult = result.current;

      act(() => {
        result.current.setCurrentView(MOCK_VIEWS[1]);
      });

      const secondResult = result.current;

      expect(firstResult).not.toBe(secondResult);
      expect(firstResult.currentView).toBe(MOCK_VIEWS[0]);
      expect(secondResult.currentView).toBe(MOCK_VIEWS[1]);
    });

    it('should provide consistent setCurrentView function', () => {
      const props = createMockProps<InteriorViews>();
      const { result } = renderHook(() => useTabViews(props));

      const setViewFn = result.current.setCurrentView;

      act(() => {
        result.current.setCurrentView(MOCK_VIEWS[1]);
      });

      expect(result.current.setCurrentView).toBe(setViewFn);
    });
  });
});
