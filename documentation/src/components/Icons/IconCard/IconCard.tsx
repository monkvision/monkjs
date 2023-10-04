import { useColorMode } from '@docusaurus/theme-common';
import { Icon, IconName } from '@monkvision/common-ui-web';
import { CopyPopup, CopyPopupHandle } from '@site/src/components';
import React, { useCallback, useRef } from 'react';
import styles from './IconCard.module.css';

export interface IconCardProps {
  icon: IconName;
}

export function IconCard({ icon }: IconCardProps) {
  const copyPopupRef = useRef<CopyPopupHandle>(null);
  const isDarkTheme = useColorMode().colorMode === 'dark';

  const copyName = useCallback(async () => {
    await navigator.clipboard.writeText(icon);
    copyPopupRef.current?.openForMs(1000);
  }, [icon]);

  return (
    <button className={styles['icon-card']} onClick={copyName}>
      <Icon icon={icon} size={50} primaryColor={isDarkTheme ? '#cecece' : '#313131'} />
      <div className={styles['icon-name']}>
        <span>{icon}</span>
        <CopyPopup ref={copyPopupRef} />
      </div>
    </button>
  );
}
