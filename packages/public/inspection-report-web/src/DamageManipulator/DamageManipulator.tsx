import { i18nWrap } from '@monkvision/common';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { DamagesSwitchButton } from './DamagesSwitchButton';
import { SeveritySelection } from './SeveritySelection';
import { PricingSlider } from './PricingSlider';
import { DoneButton } from './DoneButton';
import {
  DamageMode,
  DisplayMode,
  DamageInfo,
  useDamageManipulator,
  useDamageManipulatorStyle,
} from './hooks';
import { i18nInspectionReportWeb } from '../i18n';
import { PartPictureButton } from './PartPictureButton';
import { styles } from './DamageManipulator.styles';

export interface DamageManipulatorProps {
  partName?: string;
  damageMode?: DamageMode;
  displayMode?: DisplayMode;
  onConfirm?: (damage: DamageInfo) => void;
  damage?: DamageInfo;
}

/**
 * Component which allow the user to update a damage
 */
export const DamageManipulator = i18nWrap(
  ({
    partName,
    damageMode = DamageMode.ALL,
    displayMode = DisplayMode.MINIMAL,
    damage,
    onConfirm,
  }: DamageManipulatorProps) => {
    const {
      hasDamage,
      editedDamage,
      isShow,
      showContent,
      toggleDamageSwitch,
      handleSeverityChange,
      handlePriceChange,
      handleConfirm,
      handleShowPicture,
    } = useDamageManipulator({ damage, onConfirm });
    const { container } = useDamageManipulatorStyle();
    const { t } = useTranslation();

    const damageDetails = useMemo(
      () =>
        isShow && (
          <div style={styles['content']}>
            <PartPictureButton partName={partName} onClick={handleShowPicture} />
            <DamagesSwitchButton hasDamage={hasDamage} onSwitch={toggleDamageSwitch} />
            <SeveritySelection
              damage={editedDamage}
              hasDamage={hasDamage}
              displayMode={displayMode}
              damageMode={damageMode}
              onSeverityChange={handleSeverityChange}
            />
            <PricingSlider
              displayMode={displayMode}
              damageMode={damageMode}
              hasDamage={hasDamage}
              onPriceChange={handlePriceChange}
            />
            <DoneButton onConfirm={handleConfirm}>{t('damageManipulator.doneBtn')}</DoneButton>
          </div>
        ),
      [isShow, partName, hasDamage, editedDamage, DamageMode, DisplayMode, damage],
    );
    return (
      <div style={container}>
        <button
          style={{ position: 'static', width: '40px', margin: '20px' }}
          onClick={showContent}
          data-testid='toggle-btn'
        />
        {damageDetails}
      </div>
    );
  },
  i18nInspectionReportWeb,
);
