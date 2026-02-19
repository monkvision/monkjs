import { useTranslation } from 'react-i18next';
import { DamageType } from '@monkvision/types';
import { useMonkTheme, useObjectTranslation, vehiclePartLabels } from '@monkvision/common';
import { SwitchButton } from '@monkvision/common-ui-web';
import { DamageChip } from './DamageChip';
import { DamagedPartDetails } from '../../types/damage.types';
import { useExteriorDamage } from './hooks/useExteriorDamage';
import { styles } from './AddExteriorDamage.styles';
import { DoneButton } from '../../DoneButton';
import { useInspectionReviewState } from '../../hooks/InspectionReviewProvider';

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
export interface AddExteriorDamageProps {
  /**
   * The selected vehicle part being inspected along with its damage details.
   */
  detailedPart: DamagedPartDetails | null;
  /**
   * Callback function invoked when the user indicates they are done adding damages and pricing.
   */
  handleDone: (damagedPart: DamagedPartDetails) => void;
  /**
   * Callback function invoked when the user cancels adding damages and pricing.
   */
  handleCancel: () => void;
}

/**
 * Component for adding exterior damage details.
 */
export function AddExteriorDamage({
  detailedPart,
  handleDone,
  handleCancel,
}: AddExteriorDamageProps) {
  const { palette } = useMonkTheme();
  const { tObj } = useObjectTranslation();
  const { t } = useTranslation();
  const { currency } = useInspectionReviewState();
  const isLeftCurrency = currency === '$';
  const { hasDamage, setHasDamage, damageTypes, onDamageClicked, pricing, setPricing } =
    useExteriorDamage({ detailedPart });

  return (
    <div>
      <div style={styles['title']}>
        <p>{detailedPart?.part ? tObj(vehiclePartLabels[detailedPart?.part]) : 'unknown'}</p>
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
                ...(isLeftCurrency ? styles['inputSectionCurrencyLeft'] : {}),
              }}
            >
              <input
                type='text'
                placeholder='0'
                style={{
                  ...styles['input'],
                  justifyItems: isLeftCurrency ? 'start' : 'end',
                }}
                maxLength={4}
                value={pricing ?? 0}
                onChange={(e) => {
                  const { value } = e.target;
                  if (value === '' || /^\d*$/.test(value)) {
                    setPricing(value === '' ? undefined : Number(value));
                  }
                }}
              />
              <div style={styles['currency']}>{currency}</div>
            </div>
          </div>
        </>
      )}

      <div style={styles['footerContainer']}>
        <button style={{ ...styles['button'], ...styles['cancel'] }} onClick={handleCancel}>
          {t('tabs.actionButtons.cancel')}
        </button>
        <DoneButton
          onConfirm={() => {
            if (!detailedPart) {
              return;
            }
            handleDone({ part: detailedPart.part, damageTypes, pricing, isDamaged: hasDamage });
          }}
        >
          {t('tabs.actionButtons.done')}
        </DoneButton>
      </div>
    </div>
  );
}
