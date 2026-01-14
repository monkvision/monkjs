import { useObjectMemo } from '@monkvision/common';
import { useState } from 'react';

/**
 * Handle used to manage tab views.
 */
export interface HandleTabViews {
  /**
   * The currently active view.
   */
  currentView: string;
  /**
   * Function to change the active view.
   */
  setCurrentView: (view: string) => void;
}

/**
 * Props accepted by the useTabViews hook.
 */
export interface TabViewsProps {
  /**
   * All available views for the tab.
   */
  views: string[];
}

/**
 * Custom hook to manage tab views within a tab component.
 */
export function useTabViews(props: TabViewsProps): HandleTabViews {
  const [currentView, setCurrentView] = useState<string>(props.views[0] || '');

  return useObjectMemo({
    currentView,
    setCurrentView,
  });
}
