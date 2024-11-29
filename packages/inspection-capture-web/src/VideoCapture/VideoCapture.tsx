import { useI18nSync, useDeviceOrientation } from '@monkvision/common';
import { styles } from './VideoCapture.styles';
import { VideoCapturePermissions } from './VideoCapturePermissions';

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

// No ts-doc for this component : the component exported is VideoCaptureHOC
export function VideoCapture({ lang }: VideoCaptureProps) {
  useI18nSync(lang);
  const { requestCompassPermission } = useDeviceOrientation();
  return (
    <div style={styles['container']}>
      <VideoCapturePermissions
        requestCompassPermission={requestCompassPermission}
        onSuccess={() => console.log('Success!')}
      />
    </div>
  );
}
