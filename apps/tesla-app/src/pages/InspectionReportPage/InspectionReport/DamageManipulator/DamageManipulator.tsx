import { damages, getLanguage, useMonkTheme, vehiclePartLabels } from '@monkvision/common';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { Button, Slider } from '@monkvision/common-ui-web';
import { CurrencyCode, DamageType, SightCategory, VehiclePart } from '@monkvision/types';
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

interface InteriorDamage {
  area: string;
  damage_type: string;
  repair_cost: number | null;
}

export interface DamageManipulatorProps {
  damage: DamageInfo;
  show: boolean;
  currency?: CurrencyCode;
  partName?: VehiclePart;
  damageMode?: DamageMode;
  displayMode?: DisplayMode;
  mode?: SightCategory;
  isInterior?: boolean;
  onConfirm?: (damage: DamageInfo) => void;
  onCancel?: () => void;
  interiorDamage?: InteriorDamage;
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
  mode = SightCategory.EXTERIOR,
  currency = CurrencyCode.USD,
  isInterior = false,
  damage,
  show,
  interiorDamage,
  onConfirm,
  onCancel,
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
    handleAreaChange,
    handleInteriorDamageTypeChange,
    handleInteriorDeductionChange,
  } = useDamageManipulator({ damage, show, onConfirm, interiorDamage });
  const { container, price } = useDamageManipulatorStyle();
  const { t, i18n } = useTranslation();
  const { palette } = useMonkTheme();

  if (isInterior && isShow) {
    return (
      <div style={container}>
        <div style={styles['inputSectionContainer']}>
          <div style={styles['section']}>{t('Area')}</div>
          <div style={styles['inputSection']}>
            <input
              type='text'
              style={price}
              value={editedDamage?.interiorDamage?.area ?? ''}
              placeholder='Input Area'
              onChange={(e) => {
                const { value } = e.target;
                handleAreaChange(value);
              }}
            />
          </div>
        </div>
        <div style={styles['inputSectionContainer']}>
          <div style={styles['section']}>{t('Damage Types')}</div>
          <div style={styles['inputSection']}>
            <input
              type='text'
              style={price}
              value={editedDamage?.interiorDamage?.damage_type ?? ''}
              placeholder='Input Damage types'
              onChange={(e) => {
                const { value } = e.target;
                handleInteriorDamageTypeChange(value);
              }}
            />
          </div>
          <div style={styles['inputSectionContainer']}>
            <div style={styles['section']}>{t('Deduction')}</div>
            <div style={styles['inputSection']}>
              {currency === CurrencyCode.USD && (
                <div style={{ alignSelf: 'center', paddingLeft: '20px', paddingRight: '5px' }}>
                  $
                </div>
              )}
              <input
                type='text'
                style={price}
                maxLength={4}
                value={editedDamage?.interiorDamage?.repair_cost ?? ''}
                onChange={(e) => {
                  const { value } = e.target;
                  if (value === '' || /^\d*$/.test(value)) {
                    handleInteriorDeductionChange(value === '' ? null : Number(value));
                  }
                }}
              />
              {currency === CurrencyCode.EUR && <div>€</div>}
            </div>
          </div>
        </div>
        <div style={styles['footerContainer']}>
          <button style={styles['button']} onClick={onCancel}>
            CANCEL
          </button>
          <DoneButton onConfirm={handleConfirm}>
            {t('damageManipulator.doneBtn').toUpperCase()}
          </DoneButton>
        </div>
      </div>
    );
  }

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
            <div style={styles['inputSectionContainer']}>
              <div style={styles['section']}>{t('Price')}</div>
              <div style={styles['inputSection']}>
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
          <div style={styles['footerContainer']}>
            <button style={styles['button']} onClick={onCancel}>
              CANCEL
            </button>
            <DoneButton onConfirm={handleConfirm}>
              {t('damageManipulator.doneBtn').toUpperCase()}
            </DoneButton>
          </div>
        </div>
      )}
    </div>
  );
}
