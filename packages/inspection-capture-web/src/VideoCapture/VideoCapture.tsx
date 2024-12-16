import { useI18nSync, useDeviceOrientation } from '@monkvision/common';
import { useState } from 'react';
import { Camera } from '@monkvision/camera-web';
import { MonkApiConfig } from '@monkvision/network';
import { styles } from './VideoCapture.styles';
import { VideoCapturePermissions } from './VideoCapturePermissions';
import { VideoCaptureHUD } from './VideoCaptureHUD';

/**
 * Props of the VideoCapture component.
 */
export interface VideoCaptureProps {
  /**
   * The ID of the inspection to add the video frames to.
   */
  inspectionId: string;
  /**
   * The api config used to communicate with the API. Make sure that the user described in the auth token is the same
   * one as the one that created the inspection provided in the `inspectionId` prop.
   */
  apiConfig: MonkApiConfig;
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
  const { requestCompassPermission, alpha } = useDeviceOrientation();

  const hudProps = { alpha };

  return (
    <div style={styles['container']}>
      {screen === VideoCaptureScreen.PERMISSIONS && (
        <VideoCapturePermissions
          requestCompassPermission={requestCompassPermission}
          onSuccess={() => setScreen(VideoCaptureScreen.CAPTURE)}
        />
      )}
      {screen === VideoCaptureScreen.CAPTURE && (
        <Camera HUDComponent={VideoCaptureHUD} hudProps={hudProps} />
      )}
    </div>
  );
}
