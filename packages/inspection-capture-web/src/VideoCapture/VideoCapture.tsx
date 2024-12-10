import { useI18nSync, useDeviceOrientation } from '@monkvision/common';
import { useState } from 'react';
import { Camera } from '@monkvision/camera-web';
import { styles } from './VideoCapture.styles';
import { VideoCapturePermissions } from './VideoCapturePermissions';
import { VideoCaptureHUD } from './VideoCaptureHUD';

/**
 * Props of the VideoCapture component.
 */
export interface VideoCaptureProps {
  /**
   * The language to be used by this component.
   *
   * @default en
   */
  lang?: string | null;
}

enum VideoCaptureScreen {
  PERMISSIONS = 'permissions',
  CAPTURE = 'capture',
}

// No ts-doc for this component : the component exported is VideoCaptureHOC
export function VideoCapture({ lang }: VideoCaptureProps) {
  useI18nSync(lang);
  const [screen, setScreen] = useState(VideoCaptureScreen.PERMISSIONS);
  const { requestCompassPermission } = useDeviceOrientation();

  return (
    <div style={styles['container']}>
      {screen === VideoCaptureScreen.PERMISSIONS && (
        <VideoCapturePermissions
          requestCompassPermission={requestCompassPermission}
          onSuccess={() => setScreen(VideoCaptureScreen.CAPTURE)}
        />
      )}
      {screen === VideoCaptureScreen.CAPTURE && <Camera HUDComponent={VideoCaptureHUD} />}
    </div>
  );
}
