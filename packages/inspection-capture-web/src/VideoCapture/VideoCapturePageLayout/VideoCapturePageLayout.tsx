import { PropsWithChildren } from 'react';
import { Button, DynamicSVG } from '@monkvision/common-ui-web';
import { useTranslation } from 'react-i18next';
import { monkLogoSVG } from '../../assets/logos.asset';
import { styles, useVideoCapturePageLayoutStyles } from './VideoCapturePageLayout.styles';
import { VideoCapturePageLayoutProps } from './VideoCapturePageLayout.types';

/**
 * This component is used to display the same layout for every "default" screen for the VideoCapture process (the
 * premissions screen, the tutorial etc.).
 */
export function VideoCapturePageLayout({
  showLogo = true,
  showBackdrop = false,
  showTitle = true,
  confirmButtonProps,
  showConfirmButton = true,
  children,
}: PropsWithChildren<VideoCapturePageLayoutProps>) {
  const { t } = useTranslation();
  const { logoProps, containerStyle, titleStyle } = useVideoCapturePageLayoutStyles({
    showBackdrop,
  });
  const { children: _, ...restConfirmButtonProps } = confirmButtonProps ?? {};
  return (
    <div style={containerStyle}>
      {showLogo && <DynamicSVG svg={monkLogoSVG} {...logoProps} />}
      {showTitle && <div style={titleStyle}>{t('video.introduction.title')}</div>}
      <div style={styles['childrenContainer']}>{children}</div>
      {showConfirmButton && (
        <div style={styles['confirmContainer']}>
          <Button {...restConfirmButtonProps} />
        </div>
      )}
    </div>
  );
}
