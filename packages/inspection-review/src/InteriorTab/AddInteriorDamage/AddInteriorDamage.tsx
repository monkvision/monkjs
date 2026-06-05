import { useTranslation } from 'react-i18next';
import { DoneButton } from '../../DoneButton';
import { useInspectionReviewState } from '../../hooks/InspectionReviewProvider';
import { InteriorDamage, SelectedInteriorDamageData } from '../../types';
import { styles } from './AddInteriorDamage.styles';
import { useInteriorDamage } from './hooks/useInteriorDamage';

/*
 * Props for the AddInteriorDamage component.
 */
export interface AddInteriorDamageProps {
  /**
   * The interior damage data to be edited, or null if adding new damage.
   */
  damageData: SelectedInteriorDamageData | null;
  /**
   * Callback function invoked when the user saves the damage data.
   */
  onSave: (data: InteriorDamage) => void;
  /**
   * Callback function invoked when the user cancels the operation.
   */
  onCancel: () => void;
}

/**
 * The AddInteriorDamage component allows users to add new interior damage entries.
 */
export function AddInteriorDamage({ damageData, onCancel, onSave }: AddInteriorDamageProps) {
  const { t } = useTranslation();
  const { currency } = useInspectionReviewState();
  const { currentDamage, handleInputChange } = useInteriorDamage({ damageData });
  const isLeftCurrency = currency === '$';

  return (
    <div style={styles['container']}>
      <div style={styles['inputSectionContainer']}>
        <p style={styles['section']}>{t('tabs.interior.area')}</p>
        <div style={styles['inputSection']}>
          <input
            type='text'
            placeholder={t('tabs.interior.areaPlaceholder')}
            style={styles['input']}
            value={currentDamage?.area || ''}
            onChange={(e) => handleInputChange({ area: e.target.value })}
          />
        </div>
      </div>

      <div style={styles['inputSectionContainer']}>
        <p style={styles['section']}>{t('tabs.interior.damageTypes')}</p>
        <div style={styles['inputSection']}>
          <input
            type='text'
            placeholder={t('tabs.interior.damageTypesPlaceholder')}
            style={styles['input']}
            value={currentDamage?.damage_type || ''}
            onChange={(e) => handleInputChange({ damage_type: e.target.value })}
          />
        </div>
      </div>

      <div style={styles['inputSectionContainer']}>
        <p style={styles['section']}>{t('tabs.interior.deduction')}</p>
        <div
          style={{
            ...styles['inputSection'],
            ...(isLeftCurrency ? styles['inputSectionCurrencyLeft'] : {}),
          }}
        >
          <input
            type='text'
            placeholder={t('tabs.interior.deductionPlaceholder')}
            style={{
              ...styles['input'],
              justifyItems: isLeftCurrency ? 'start' : 'end',
            }}
            maxLength={4}
            value={currentDamage?.repair_cost || ''}
            onChange={(e) =>
              handleInputChange({ repair_cost: e.target.value ? Number(e.target.value) : null })
            }
          />
          <div style={styles['currency']}>{currency}</div>
        </div>
      </div>

      <div style={styles['footerContainer']}>
        <button style={{ ...styles['button'], ...styles['cancel'] }} onClick={onCancel}>
          {t('tabs.actionButtons.cancel')}
        </button>
        <DoneButton
          onConfirm={() => {
            if (currentDamage) {
              onSave(currentDamage);
            }
          }}
        >
          {t('tabs.actionButtons.done')}
        </DoneButton>
      </div>
    </div>
  );
}
