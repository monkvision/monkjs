import { Button, DynamicSVG } from '@monkvision/common-ui-web';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { AddDamagePreviewMode, usePhotoHUDButtonBackground } from '../../hooks';
import { styles } from './CrosshairPreview.styles';
import { DamageCounter } from '../DamageCounter';
import { CancelButton } from '../CancelButton';

export interface CrosshairPreviewProps {
  onCancel: () => void;
}

export function CrosshairPreview({ onCancel }: CrosshairPreviewProps) {
  const [showInfoBtn, setShowInfoBtn] = useState(true);

  const { t } = useTranslation();
  const { bgColor } = usePhotoHUDButtonBackground();

  const svg =
    '<svg fill="none" viewBox="0 0 108 109" xmlns="http://www.w4.org/2000/svg"><g filter="url(#svgtest_svg__a)"><mask id="svgtest_svg__b" width="98" height="98" x="5" y="4" fill="#000" maskUnits="userSpaceOnUse"><path fill="#fff" d="M5 4h98v98H5z"/><path fill-rule="evenodd" d="M52 7a2 2 0 1 1 4 0v16a2 2 0 1 1-4 0V7Zm0 76a2 2 0 1 1 4 0v16a2 2 0 1 1-4 0V83ZM8 51a2 2 0 1 0 0 4h16a2 2 0 1 0 0-4H8Zm74 2a2 2 0 0 1 2-2h16a2 2 0 1 1 0 4H84a2 2 0 0 1-2-2Zm-28-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" clip-rule="evenodd"/></mask><path fill="#FFC000" fill-rule="evenodd" d="M52 7a2 2 0 1 1 4 0v16a2 2 0 1 1-4 0V7Zm0 76a2 2 0 1 1 4 0v16a2 2 0 1 1-4 0V83ZM8 51a2 2 0 1 0 0 4h16a2 2 0 1 0 0-4H8Zm74 2a2 2 0 0 1 2-2h16a2 2 0 1 1 0 4H84a2 2 0 0 1-2-2Zm-28-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" clip-rule="evenodd"/><path fill="#795900" d="M54 4.75A2.25 2.25 0 0 0 51.75 7h.5c0-.966.783-1.75 1.75-1.75v-.5ZM56.25 7A2.25 2.25 0 0 0 54 4.75v.5c.967 0 1.75.784 1.75 1.75h.5Zm0 16V7h-.5v16h.5ZM54 25.25A2.25 2.25 0 0 0 56.25 23h-.5A1.75 1.75 0 0 1 54 24.75v.5ZM51.75 23A2.25 2.25 0 0 0 54 25.25v-.5A1.75 1.75 0 0 1 52.25 23h-.5Zm0-16v16h.5V7h-.5ZM54 80.75A2.25 2.25 0 0 0 51.75 83h.5c0-.966.783-1.75 1.75-1.75v-.5ZM56.25 83A2.25 2.25 0 0 0 54 80.75v.5c.967 0 1.75.784 1.75 1.75h.5Zm0 16V83h-.5v16h.5ZM54 101.25A2.25 2.25 0 0 0 56.25 99h-.5a1.75 1.75 0 0 1-1.75 1.75v.5ZM51.75 99a2.25 2.25 0 0 0 2.25 2.25v-.5A1.75 1.75 0 0 1 52.25 99h-.5Zm0-16v16h.5V83h-.5ZM6.25 53c0-.967.784-1.75 1.75-1.75v-.5A2.25 2.25 0 0 0 5.75 53h.5ZM8 54.75A1.75 1.75 0 0 1 6.25 53h-.5A2.25 2.25 0 0 0 8 55.25v-.5Zm16 0H8v.5h16v-.5ZM25.75 53A1.75 1.75 0 0 1 24 54.75v.5A2.25 2.25 0 0 0 26.25 53h-.5ZM24 51.25c.966 0 1.75.783 1.75 1.75h.5A2.25 2.25 0 0 0 24 50.75v.5Zm-16 0h16v-.5H8v.5Zm76-.5A2.25 2.25 0 0 0 81.75 53h.5c0-.967.784-1.75 1.75-1.75v-.5Zm16 0H84v.5h16v-.5Zm2.25 2.25a2.25 2.25 0 0 0-2.25-2.25v.5c.966 0 1.75.783 1.75 1.75h.5ZM100 55.25a2.25 2.25 0 0 0 2.25-2.25h-.5a1.75 1.75 0 0 1-1.75 1.75v.5Zm-16 0h16v-.5H84v.5ZM81.75 53A2.25 2.25 0 0 0 84 55.25v-.5A1.75 1.75 0 0 1 82.25 53h-.5Zm-29.5 0c0-.967.783-1.75 1.75-1.75v-.5A2.25 2.25 0 0 0 51.75 53h.5ZM54 54.75A1.75 1.75 0 0 1 52.25 53h-.5A2.25 2.25 0 0 0 54 55.25v-.5ZM55.75 53A1.75 1.75 0 0 1 54 54.75v.5A2.25 2.25 0 0 0 56.25 53h-.5ZM54 51.25c.967 0 1.75.783 1.75 1.75h.5A2.25 2.25 0 0 0 54 50.75v.5Z" mask="url(#svgtest_svg__b)"/></g><defs><filter id="svgtest_svg__a" width="106.5" height="107.5" x=".75" y=".75" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="1"/><feGaussianBlur stdDeviation="2.5"/><feColorMatrix values="0 0 0 0 0.517647 0 0 0 0 0.517647 0 0 0 0 0.517647 0 0 0 0.2 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_1083_28985"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="3"/><feGaussianBlur stdDeviation="2"/><feColorMatrix values="0 0 0 0 0.517647 0 0 0 0 0.517647 0 0 0 0 0.517647 0 0 0 0.12 0"/><feBlend in2="effect1_dropShadow_1083_28985" result="effect2_dropShadow_1083_28985"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="2"/><feGaussianBlur stdDeviation="2"/><feColorMatrix values="0 0 0 0 0.517647 0 0 0 0 0.517647 0 0 0 0 0.517647 0 0 0 0.14 0"/><feBlend in2="effect2_dropShadow_1083_28985" result="effect3_dropShadow_1083_28985"/><feBlend in="SourceGraphic" in2="effect3_dropShadow_1083_28985" result="shape"/></filter></defs></svg>';

  return (
    <div style={styles['container']}>
      <DynamicSVG style={styles['svg']} svg={svg} />
      <div style={styles['top']}>
        <DamageCounter addDamagePreviewMode={AddDamagePreviewMode.DEFAULT} />
        <CancelButton onCancel={onCancel} />
      </div>
      {showInfoBtn && (
        <Button
          icon='close'
          style={{ ...styles['infoBtn'], backgroundColor: bgColor }}
          onClick={() => setShowInfoBtn(false)}
        >
          {t('photo.hud.addDamage.infoBtn')}
        </Button>
      )}
    </div>
  );
}
