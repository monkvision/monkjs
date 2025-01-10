import { DeviceOrientation } from '@monkvision/types';
import { Icon } from '@monkvision/common-ui-web';
import { useTranslation } from 'react-i18next';
import { styles, useOrientationEnforcerStyles } from './OrientationEnforcer.styles';
import { useEnforceOrientation } from '../../hooks';

/**
 * Props accepted by the OrientationEnforcer component.
 */
export interface OrientationEnforcerProps {
  /**
   * The device orientation to enforce.
   */
  orientation?: DeviceOrientation;
}

/**
 * Component that enforces a certain device orientation. If the current device orientation is not equal to the one
 * passed as a prop, it will display an error on the screen asking the user to rotate their device.
 */
export function OrientationEnforcer({ orientation }: OrientationEnforcerProps) {
  const { t } = useTranslation();
  const { containerStyle } = useOrientationEnforcerStyles();
  const isViolatingEnforcedOrientation = useEnforceOrientation(orientation);

  if (!isViolatingEnforcedOrientation) {
    return null;
  }

  return (
    <div style={containerStyle}>
      <div style={styles['titleContainer']}>
        <Icon icon='rotate' primaryColor='text-primary' size={30} />
        <div style={styles['title']}>{t('orientationEnforcer.title')}</div>
      </div>
      <div style={styles['description']}>{t('orientationEnforcer.description')}</div>
    </div>
  );
}
