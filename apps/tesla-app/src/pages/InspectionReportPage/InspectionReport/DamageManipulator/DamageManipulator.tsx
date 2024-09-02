import {
  damages,
  getLanguage,
  i18nWrap,
  useMonkTheme,
  vehiclePartLabels,
} from '@monkvision/common';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { Button, Slider } from '@monkvision/common-ui-web';
import { CurrencyCode, DamageType, VehiclePart } from '@monkvision/types';
import { DamagesSwitchButton } from './DamageSwitchButton';
// import { SeveritySelection } from './SeveritySelection';
// import { PricingSlider } from './PricingSlider';
// import { PartPictureButton } from './PartPictureButton';
import { DoneButton } from './DoneButton';
import {
  DamageMode,
  DisplayMode,
  DamageInfo,
  useDamageManipulator,
  useDamageManipulatorStyle,
} from './hooks';
// import { i18nInspectionReportWeb } from '../i18n';
import { styles } from './DamageManipulator.styles';
import { ReplacementSwitchButton } from './ReplacementSwitchButton';

export interface DamageManipulatorProps {
  damage: DamageInfo;
  show: boolean;
  currency?: CurrencyCode;
  partName?: VehiclePart;
  damageMode?: DamageMode;
  displayMode?: DisplayMode;
  onConfirm?: (damage: DamageInfo) => void;
}

const firstColumnItems = [DamageType.SCRATCH, DamageType.DENT, DamageType.BROKEN_GLASS];
const secondColumnItems = [
  DamageType.MISSING_PIECE,
  DamageType.MISSING_HUBCAP,
  DamageType.BODY_CRACK,
  DamageType.RUSTINESS,
];

/**
 * Component which allow the user to update a damage
 */
export function DamageManipulator({
  partName,
  damageMode = DamageMode.ALL,
  displayMode = DisplayMode.MINIMAL,
  currency = CurrencyCode.USD,
  damage,
  show,
  onConfirm,
}: DamageManipulatorProps) {
  const {
    hasDamage,
    editedDamage,
    isShow,
    needsReplacement,
    showContent,
    listDamages,
    toggleDamageSwitch,
    toggleReplacementSwitch,
    toggleDamage,
    handleSeverityChange,
    handlePriceChange,
    handleConfirm,
    handleShowPicture,
  } = useDamageManipulator({ damage, show, onConfirm });
  const { container, price } = useDamageManipulatorStyle();
  const { t, i18n } = useTranslation();
  const { palette } = useMonkTheme();

  const damageDetails = useMemo(
    () =>
      isShow && (
        <div style={styles['content']}>
          <DamagesSwitchButton hasDamage={hasDamage} onSwitch={toggleDamageSwitch} />
          {hasDamage && (
            <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
              <Slider
                disabled={!hasDamage}
                step={10}
                value={editedDamage?.pricing}
                onChange={handlePriceChange}
              />
              <input disabled={!hasDamage} style={price} value={editedDamage?.pricing} />
            </div>
          )}
          <DoneButton onConfirm={handleConfirm}>{t('damageManipulator.doneBtn')}</DoneButton>
        </div>
      ),
    [isShow, partName, hasDamage, editedDamage, DamageMode, DisplayMode, damage, show],
  );
  return (
    <div style={container}>
      {isShow && (
        <div style={styles['content']}>
          {partName && (
            <div style={styles['title']}>
              {vehiclePartLabels[partName][getLanguage(i18n.language)]}
            </div>
          )}
          <DamagesSwitchButton hasDamage={hasDamage} onSwitch={toggleDamageSwitch} />
          {hasDamage && (
            <ReplacementSwitchButton
              hasDamage={needsReplacement}
              onSwitch={toggleReplacementSwitch}
            />
          )}
          {hasDamage && (
            <>
              <div style={styles['section']}>Damages</div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  flexWrap: 'wrap',
                  paddingBottom: '10px',
                }}
              >
                <div
                  style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', gap: '5px' }}
                >
                  {firstColumnItems.map((dam) => (
                    <Button
                      primaryColor={listDamages.includes(dam) ? 'primary' : 'secondary'}
                      onClick={() => toggleDamage(dam)}
                    >
                      {damages[dam][getLanguage(i18n.language)]}
                    </Button>
                  ))}
                </div>
                <div
                  style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', gap: '5px' }}
                >
                  {secondColumnItems.map((dam) => (
                    <Button
                      primaryColor={listDamages.includes(dam) ? 'primary' : 'secondary'}
                      onClick={() => toggleDamage(dam)}
                    >
                      {damages[dam][getLanguage(i18n.language)]}
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}
          {hasDamage && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
              }}
            >
              <div style={styles['section']}>{t('Price')}</div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  border: 'solid rgba(255,255,255,0.4)',
                  borderRadius: '10px',
                  paddingRight: '10px',
                }}
              >
                {currency === CurrencyCode.USD && (
                  <div style={{ alignSelf: 'center', paddingLeft: '20px', paddingRight: '5px' }}>
                    $
                  </div>
                )}
                <input
                  type='text'
                  disabled={!hasDamage}
                  style={price}
                  maxLength={4}
                  value={editedDamage?.pricing ?? ''}
                  onChange={(e) => {
                    const { value } = e.target;
                    if (value === '' || /^\d*$/.test(value)) {
                      handlePriceChange(value === '' ? null : Number(value));
                    }
                  }}
                />
                {currency === CurrencyCode.EUR && <div>€</div>}
              </div>
            </div>
          )}
          <DoneButton onConfirm={handleConfirm}>{t('damageManipulator.doneBtn')}</DoneButton>
        </div>
      )}
    </div>
  );
}
