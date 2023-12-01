import { fireEvent } from '@testing-library/react';

/**
 * Resizes the test window and fires a resize event.
 */
export function resizeWindow(dimensions?: { innerWidth?: number; innerHeight?: number }): void {
  if (dimensions?.innerWidth) {
    global.innerWidth = dimensions.innerWidth;
  }
  if (dimensions?.innerHeight) {
    global.innerHeight = dimensions.innerHeight;
  }
  fireEvent(window, new Event('resize'));
}
