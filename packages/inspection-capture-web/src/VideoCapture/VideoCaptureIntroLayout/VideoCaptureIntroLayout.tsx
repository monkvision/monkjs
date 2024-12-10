import { PropsWithChildren } from 'react';
import { Button, DynamicSVG } from '@monkvision/common-ui-web';
import { useTranslation } from 'react-i18next';
import { monkLogoSVG } from '../../assets/logos.asset';
import { styles, useVideoCaptureIntroLayoutStyles } from './VideoCaptureIntroLayout.styles';
import { VideoCaptureIntroLayoutProps } from './VideoCaptureIntroLayout.types';

/**
 * This component is used to display the same layout for every "introduction" screen for the VideoCapture process (the
 * premissions screen, the tutorial etc.).
 */
export function VideoCaptureIntroLayout({
  showBackdrop,
  confirmButtonProps,
  children,
}: PropsWithChildren<VideoCaptureIntroLayoutProps>) {
  const { t } = useTranslation();
  const { logoProps, containerStyle, titleStyle } = useVideoCaptureIntroLayoutStyles({
    showBackdrop,
  });

  return (
    <div style={containerStyle}>
      <DynamicSVG svg={monkLogoSVG} {...logoProps} />
      <div style={titleStyle}>{t('video.introduction.title')}</div>
      <div style={styles['childrenContainer']}>{children}</div>
      <div style={styles['confirmContainer']}>
        <Button {...(confirmButtonProps ?? {})} />
      </div>
    </div>
  );
}
