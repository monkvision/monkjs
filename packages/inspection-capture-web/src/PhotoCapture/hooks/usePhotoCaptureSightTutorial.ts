import { useObjectMemo } from '@monkvision/common';
import { useState } from 'react';

export interface HandlePhotoCaptureSightTutorial {
  /**
   * Boolean indicating whether the sight tutorial should be displayed.
   */
  showSightTutorial: boolean;
  /**
   * Callback called when the user clicks on the "help" button in PhotoCapture.
   */
  toggleSightTutorial: () => void;
}

/**
 * Custom hook used to manage the state of photo capture sight tutorial.
 */
export function usePhotoCaptureSightTutorial(): HandlePhotoCaptureSightTutorial {
  const [showSightTutorial, setShowSightTutorial] = useState<boolean>(false);

  const toggleSightTutorial = () => {
    setShowSightTutorial(!showSightTutorial);
  };

  return useObjectMemo({ showSightTutorial, toggleSightTutorial });
}
