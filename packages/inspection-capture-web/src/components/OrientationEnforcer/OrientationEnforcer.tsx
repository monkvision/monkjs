import { DeviceOrientation } from '@monkvision/types';
import { PropsWithChildren } from 'react';
import { useWindowDimensions } from '@monkvision/common';
import { Icon } from '@monkvision/common-ui-web';
import { useTranslation } from 'react-i18next';
import { styles } from './OrientationEnforcer.styles';

export interface OrientationEnforcerProps {
  orientation?: DeviceOrientation;
}

export function OrientationEnforcer({
  orientation,
  children,
}: PropsWithChildren<OrientationEnforcerProps>) {
  const { t } = useTranslation();
  const dimensions = useWindowDimensions();
  const isViolatingEnforcedOrientation =
    orientation && (orientation === DeviceOrientation.PORTRAIT) !== dimensions.isPortrait;

  return (
    <div style={styles['container']}>
      {isViolatingEnforcedOrientation && (
        <div style={styles['errorContainer']}>
          <div style={styles['errorTitleContainer']}>
            <Icon icon='rotate' primaryColor='text-primary' size={30} />
            <div style={styles['errorTitle']}>{t('orientationEnforcer.title')}</div>
          </div>
          <div style={styles['errorDescription']}>{t('orientationEnforcer.description')}</div>
        </div>
      )}
      {!isViolatingEnforcedOrientation && children}
    </div>
  );
}
