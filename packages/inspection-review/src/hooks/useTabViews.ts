import { useObjectMemo } from '@monkvision/common';
import { useState } from 'react';

/**
 * Handle used to manage tab views.
 */
export interface HandleTabViews<T> {
  /**
   * The currently active view.
   */
  currentView: T;
  /**
   * Function to change the active view.
   */
  setCurrentView: (view: T) => void;
}

/**
 * Props accepted by the useTabViews hook.
 */
export interface TabViewsProps<T> {
  /**
   * All available views for the tab.
   */
  views: T[];
}

/**
 * Custom hook to manage tab views within a tab component.
 */
export function useTabViews<T>(props: TabViewsProps<T>): HandleTabViews<T> {
  const [currentView, setCurrentView] = useState<T>(props.views[0]);

  return useObjectMemo({
    currentView,
    setCurrentView,
  });
}
