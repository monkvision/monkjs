import { InteriorDamage, SelectedInteriorDamageData } from '../../types';
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
  const { currentDamage, handleInputChange } = useInteriorDamage({ damageData });

  return (
    <div>
      <h2>{damageData ? 'Edit Interior Damage' : 'Add Interior Damage'}</h2>

      <div>
        <label>
          Area
          <input
            type='text'
            value={currentDamage?.area || ''}
            onChange={(e) => handleInputChange({ area: e.target.value })}
          />
        </label>
      </div>

      <div>
        <label>
          Damage Type
          <input
            type='text'
            value={currentDamage?.damage_type || ''}
            onChange={(e) => handleInputChange({ damage_type: e.target.value })}
          />
        </label>
      </div>

      <div>
        <label>
          Deduction
          <input
            type='number'
            value={currentDamage?.repair_cost || ''}
            onChange={(e) =>
              handleInputChange({ repair_cost: e.target.value ? Number(e.target.value) : null })
            }
          />
        </label>
      </div>

      <div style={{ display: 'flex' }}>
        <button onClick={onCancel}>Cancel</button>
        <button
          onClick={() => {
            if (currentDamage) {
              onSave(currentDamage);
            }
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}
