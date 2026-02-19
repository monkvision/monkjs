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
  const { currency } = useInspectionReviewState();
  const { currentDamage, handleInputChange } = useInteriorDamage({ damageData });

  return (
    <div style={styles['container']}>
      <div style={styles['inputSectionContainer']}>
        <p style={styles['section']}>Area</p>
        <div style={styles['inputSection']}>
          <input
            type='text'
            style={styles['price']}
            value={currentDamage?.area || ''}
            onChange={(e) => handleInputChange({ area: e.target.value })}
          />
        </div>
      </div>

      <div style={styles['inputSectionContainer']}>
        <p style={styles['section']}>Damage Type</p>
        <div style={styles['inputSection']}>
          <input
            type='text'
            style={styles['price']}
            value={currentDamage?.damage_type || ''}
            onChange={(e) => handleInputChange({ damage_type: e.target.value })}
          />
        </div>
      </div>

      <div style={styles['inputSectionContainer']}>
        <p style={styles['section']}>Deduction</p>
        <div style={styles['inputSection']}>
          <input
            type='text'
            style={{
              ...styles['price'],
              justifyItems: currency === '$' ? 'start' : 'end',
            }}
            maxLength={4}
            value={currentDamage?.repair_cost || ''}
            onChange={(e) =>
              handleInputChange({ repair_cost: e.target.value ? Number(e.target.value) : null })
            }
          />
          {currency !== '$' && (
            <div style={{ alignSelf: 'center', paddingLeft: '5px', paddingRight: '20px' }}>
              {currency}
            </div>
          )}
        </div>
      </div>

      <div style={styles['footerContainer']}>
        <button style={{ ...styles['button'], ...styles['cancel'] }} onClick={onCancel}>
          CANCEL
        </button>
        <DoneButton
          onConfirm={() => {
            if (currentDamage) {
              onSave(currentDamage);
            }
          }}
        >
          DONE
        </DoneButton>
      </div>
    </div>
  );
}
