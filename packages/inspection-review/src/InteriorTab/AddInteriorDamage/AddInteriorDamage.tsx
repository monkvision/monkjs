import { useTranslation } from 'react-i18next';
import { DoneButton } from '../../DoneButton';
import { useInspectionReviewProvider } from '../../hooks/useInspectionReviewProvider';
import { styles } from './AddInteriorDamage.styles';
import { useInteriorDamage } from './hooks/useInteriorDamage';
import { InteriorTabState } from '../hooks/useInteriorTab';

/*
 * Props for the AddInteriorDamage component.
 */
export type AddInteriorDamageProps = Pick<
  InteriorTabState,
  'selectedDamage' | 'onCancelDamage' | 'onSave'
>;

/**
 * The AddInteriorDamage component allows users to add new interior damage entries.
 */
export function AddInteriorDamage({
  selectedDamage,
  onCancelDamage,
  onSave,
}: AddInteriorDamageProps) {
  const { t } = useTranslation();
  const { currency, isLeftSideCurrency } = useInspectionReviewProvider();
  const { currentDamage, isDoneDisabled, handleInputChange, handleDone } = useInteriorDamage({
    selectedDamage,
    onSave,
  });

  return (
    <div style={styles['container']}>
      <div style={styles['inputSectionContainer']}>
        <p style={styles['section']}>{t('tabs.interior.area')}</p>
        <div style={styles['inputSection']}>
          <input
            type='text'
            placeholder={t('tabs.interior.areaPlaceholder')}
            style={styles['input']}
            value={currentDamage.area}
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
            value={currentDamage.damage_type}
            onChange={(e) => handleInputChange({ damage_type: e.target.value })}
          />
        </div>
      </div>

      <div style={styles['inputSectionContainer']}>
        <p style={styles['section']}>{t('tabs.interior.deduction')}</p>
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
            value={currentDamage.repair_cost ?? ''}
            onChange={(e) =>
              handleInputChange({ repair_cost: e.target.value ? Number(e.target.value) : null })
            }
          />
          <div style={styles['currency']}>{currency}</div>
        </div>
      </div>

      <div style={styles['footerContainer']}>
        <button style={{ ...styles['button'], ...styles['cancel'] }} onClick={onCancelDamage}>
          {t('tabs.actionButtons.cancel')}
        </button>
        <DoneButton onConfirm={handleDone} disabled={isDoneDisabled}>
          {t('tabs.actionButtons.done')}
        </DoneButton>
      </div>
    </div>
  );
}
