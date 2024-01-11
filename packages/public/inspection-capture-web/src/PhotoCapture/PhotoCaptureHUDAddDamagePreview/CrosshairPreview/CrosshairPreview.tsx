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
  const addDamagePreviewMode = AddDamagePreviewMode.DEFAULT;

  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="108" height="109" viewBox="0 0 108 109" fill="none"> <g filter="url(#filter0_ddd_1083_28985)"> <mask id="path-1-outside-1_1083_28985" maskUnits="userSpaceOnUse" x="5" y="4" width="98" height="98" fill="black"> <rect fill="white" x="5" y="4" width="98" height="98"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M52 7C52 5.89543 52.8954 5 54 5C55.1046 5 56 5.89543 56 7V23C56 24.1046 55.1046 25 54 25C52.8954 25 52 24.1046 52 23V7ZM52 83C52 81.8954 52.8954 81 54 81C55.1046 81 56 81.8954 56 83V99C56 100.105 55.1046 101 54 101C52.8954 101 52 100.105 52 99V83ZM8 51C6.89543 51 6 51.8954 6 53C6 54.1046 6.89543 55 8 55H24C25.1046 55 26 54.1046 26 53C26 51.8954 25.1046 51 24 51H8ZM82 53C82 51.8954 82.8954 51 84 51H100C101.105 51 102 51.8954 102 53C102 54.1046 101.105 55 100 55H84C82.8954 55 82 54.1046 82 53ZM54 51C52.8954 51 52 51.8954 52 53C52 54.1046 52.8954 55 54 55C55.1046 55 56 54.1046 56 53C56 51.8954 55.1046 51 54 51Z"/> </mask> <path fill-rule="evenodd" clip-rule="evenodd" d="M52 7C52 5.89543 52.8954 5 54 5C55.1046 5 56 5.89543 56 7V23C56 24.1046 55.1046 25 54 25C52.8954 25 52 24.1046 52 23V7ZM52 83C52 81.8954 52.8954 81 54 81C55.1046 81 56 81.8954 56 83V99C56 100.105 55.1046 101 54 101C52.8954 101 52 100.105 52 99V83ZM8 51C6.89543 51 6 51.8954 6 53C6 54.1046 6.89543 55 8 55H24C25.1046 55 26 54.1046 26 53C26 51.8954 25.1046 51 24 51H8ZM82 53C82 51.8954 82.8954 51 84 51H100C101.105 51 102 51.8954 102 53C102 54.1046 101.105 55 100 55H84C82.8954 55 82 54.1046 82 53ZM54 51C52.8954 51 52 51.8954 52 53C52 54.1046 52.8954 55 54 55C55.1046 55 56 54.1046 56 53C56 51.8954 55.1046 51 54 51Z" fill="#FFC000"/> <path d="M54 4.75C52.7574 4.75 51.75 5.75736 51.75 7H52.25C52.25 6.0335 53.0335 5.25 54 5.25V4.75ZM56.25 7C56.25 5.75736 55.2426 4.75 54 4.75V5.25C54.9665 5.25 55.75 6.0335 55.75 7H56.25ZM56.25 23V7H55.75V23H56.25ZM54 25.25C55.2426 25.25 56.25 24.2426 56.25 23H55.75C55.75 23.9665 54.9665 24.75 54 24.75V25.25ZM51.75 23C51.75 24.2426 52.7574 25.25 54 25.25V24.75C53.0335 24.75 52.25 23.9665 52.25 23H51.75ZM51.75 7V23H52.25V7H51.75ZM54 80.75C52.7574 80.75 51.75 81.7574 51.75 83H52.25C52.25 82.0335 53.0335 81.25 54 81.25V80.75ZM56.25 83C56.25 81.7574 55.2426 80.75 54 80.75V81.25C54.9665 81.25 55.75 82.0335 55.75 83H56.25ZM56.25 99V83H55.75V99H56.25ZM54 101.25C55.2426 101.25 56.25 100.243 56.25 99H55.75C55.75 99.9665 54.9665 100.75 54 100.75V101.25ZM51.75 99C51.75 100.243 52.7574 101.25 54 101.25V100.75C53.0335 100.75 52.25 99.9665 52.25 99H51.75ZM51.75 83V99H52.25V83H51.75ZM6.25 53C6.25 52.0335 7.0335 51.25 8 51.25V50.75C6.75736 50.75 5.75 51.7574 5.75 53H6.25ZM8 54.75C7.0335 54.75 6.25 53.9665 6.25 53H5.75C5.75 54.2426 6.75736 55.25 8 55.25V54.75ZM24 54.75H8V55.25H24V54.75ZM25.75 53C25.75 53.9665 24.9665 54.75 24 54.75V55.25C25.2426 55.25 26.25 54.2426 26.25 53H25.75ZM24 51.25C24.9665 51.25 25.75 52.0335 25.75 53H26.25C26.25 51.7574 25.2426 50.75 24 50.75V51.25ZM8 51.25H24V50.75H8V51.25ZM84 50.75C82.7574 50.75 81.75 51.7574 81.75 53H82.25C82.25 52.0335 83.0335 51.25 84 51.25V50.75ZM100 50.75H84V51.25H100V50.75ZM102.25 53C102.25 51.7574 101.243 50.75 100 50.75V51.25C100.966 51.25 101.75 52.0335 101.75 53H102.25ZM100 55.25C101.243 55.25 102.25 54.2426 102.25 53H101.75C101.75 53.9665 100.966 54.75 100 54.75V55.25ZM84 55.25H100V54.75H84V55.25ZM81.75 53C81.75 54.2426 82.7574 55.25 84 55.25V54.75C83.0335 54.75 82.25 53.9665 82.25 53H81.75ZM52.25 53C52.25 52.0335 53.0335 51.25 54 51.25V50.75C52.7574 50.75 51.75 51.7574 51.75 53H52.25ZM54 54.75C53.0335 54.75 52.25 53.9665 52.25 53H51.75C51.75 54.2426 52.7574 55.25 54 55.25V54.75ZM55.75 53C55.75 53.9665 54.9665 54.75 54 54.75V55.25C55.2426 55.25 56.25 54.2426 56.25 53H55.75ZM54 51.25C54.9665 51.25 55.75 52.0335 55.75 53H56.25C56.25 51.7574 55.2426 50.75 54 50.75V51.25Z" fill="#795900" mask="url(#path-1-outside-1_1083_28985)"/> </g> <defs> <filter id="filter0_ddd_1083_28985" x="0.75" y="0.75" width="106.5" height="107.5" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"> <feFlood flood-opacity="0" result="BackgroundImageFix"/> <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/> <feOffset dy="1"/> <feGaussianBlur stdDeviation="2.5"/> <feColorMatrix type="matrix" values="0 0 0 0 0.517647 0 0 0 0 0.517647 0 0 0 0 0.517647 0 0 0 0.2 0"/> <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1083_28985"/> <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/> <feOffset dy="3"/> <feGaussianBlur stdDeviation="2"/> <feColorMatrix type="matrix" values="0 0 0 0 0.517647 0 0 0 0 0.517647 0 0 0 0 0.517647 0 0 0 0.12 0"/> <feBlend mode="normal" in2="effect1_dropShadow_1083_28985" result="effect2_dropShadow_1083_28985"/> <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/> <feOffset dy="2"/> <feGaussianBlur stdDeviation="2"/> <feColorMatrix type="matrix" values="0 0 0 0 0.517647 0 0 0 0 0.517647 0 0 0 0 0.517647 0 0 0 0.14 0"/> <feBlend mode="normal" in2="effect2_dropShadow_1083_28985" result="effect3_dropShadow_1083_28985"/> <feBlend mode="normal" in="SourceGraphic" in2="effect3_dropShadow_1083_28985" result="shape"/> </filter> </defs> </svg>';
  return (
    <div style={styles['container']}>
      <DynamicSVG svg={svg} />
      <div style={styles['top']}>
        <DamageCounter addDamagePreviewMode={addDamagePreviewMode} />
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
