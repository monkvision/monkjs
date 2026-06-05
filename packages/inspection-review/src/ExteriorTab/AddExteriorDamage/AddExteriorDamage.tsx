import { useTranslation } from 'react-i18next';
import { DamageType } from '@monkvision/types';
import { useMonkTheme, useObjectTranslation, vehiclePartLabels } from '@monkvision/common';
import { SwitchButton } from '@monkvision/common-ui-web';
import { DamageChip } from './DamageChip';
import { useExteriorDamage } from './hooks/useExteriorDamage';
import { styles } from './AddExteriorDamage.styles';
import { DoneButton } from '../../DoneButton';
import { useInspectionReviewProvider } from '../../hooks/useInspectionReviewProvider';
import { TabExteriorState } from '../hooks/useExteriorTab';

const firstColumnDamages = [
  DamageType.BROKEN_GLASS,
  DamageType.DENT,
  DamageType.SCRATCH,
  DamageType.PAINT_DAMAGE,
];
const secondColumnDamages = [
  DamageType.BODY_CRACK,
  DamageType.MISSING_HUBCAP,
  DamageType.MISSING_PIECE,
  DamageType.RUSTINESS,
  DamageType.MISSHAPE,
];

/**
 * Props for the AddExteriorDamage component.
 */
export type AddExteriorDamageProps = Pick<
  TabExteriorState,
  'selectedPart' | 'onDone' | 'onCancelDamage'
>;

/**
 * Component for adding exterior damage details.
 */
export function AddExteriorDamage({
  selectedPart,
  onDone,
  onCancelDamage,
}: AddExteriorDamageProps) {
  const { palette } = useMonkTheme();
  const { tObj } = useObjectTranslation();
  const { t } = useTranslation();
  const { currency, isLeftSideCurrency } = useInspectionReviewProvider();
  const {
    hasDamage,
    setHasDamage,
    damageTypes,
    onDamageClicked,
    pricing,
    isDoneDisabled,
    handlePricingChange,
    handleDoneClick,
  } = useExteriorDamage({ selectedPart, onDone });

  return (
    <div>
      <div style={styles['title']}>
        <p>{selectedPart?.part ? tObj(vehiclePartLabels[selectedPart?.part]) : 'unknown'}</p>
      </div>
      <div style={styles['switchButtonContainer']}>
        <p>{t('tabs.exterior.addDamage.title')}</p>
        <SwitchButton
          checked={hasDamage}
          checkedPrimaryColor={palette.primary.base}
          checkedSecondaryColor={palette.text.white}
          uncheckedPrimaryColor={palette.secondary.base}
          uncheckedSecondaryColor={palette.background.light}
          onSwitch={setHasDamage}
        />
      </div>

      {hasDamage && (
        <>
          <p style={styles['section']}>{t('tabs.exterior.addDamage.listTitle')}</p>
          <div style={styles['damageContainer']}>
            <div style={styles['damagesColumnContainer']}>
              {firstColumnDamages.map((damage) => (
                <DamageChip
                  key={damage}
                  damage={damage}
                  selectedDamages={damageTypes}
                  onDamageClicked={onDamageClicked}
                />
              ))}
            </div>
            <div style={styles['damagesColumnContainer']}>
              {secondColumnDamages.map((damage) => (
                <DamageChip
                  key={damage}
                  damage={damage}
                  selectedDamages={damageTypes}
                  onDamageClicked={onDamageClicked}
                />
              ))}
            </div>
          </div>

          <div style={styles['inputSectionContainer']}>
            <p style={styles['section']}>{t('tabs.exterior.addDamage.priceLabel')}</p>
            <div
              style={{
                ...styles['inputSection'],
                ...(isLeftSideCurrency ? styles['inputSectionCurrencyLeft'] : {}),
              }}
            >
              <input
                type='text'
                style={{
                  ...styles['input'],
                  justifyItems: isLeftSideCurrency ? 'start' : 'end',
                }}
                maxLength={4}
                value={pricing}
                onChange={handlePricingChange}
              />
              <div style={styles['currency']}>{currency}</div>
            </div>
          </div>
        </>
      )}

      <div style={styles['footerContainer']}>
        <button style={{ ...styles['button'], ...styles['cancel'] }} onClick={onCancelDamage}>
          {t('tabs.actionButtons.cancel')}
        </button>
        <DoneButton onConfirm={handleDoneClick} disabled={isDoneDisabled}>
          {t('tabs.actionButtons.done')}
        </DoneButton>
      </div>
    </div>
  );
}
