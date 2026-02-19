import { useState } from 'react';
import { InteriorDamage, SelectedDamageData } from '../InteriorTab';

interface AddInteriorDamageProps {
  damageData: SelectedDamageData | null;
  onSave: (data: InteriorDamage) => void;
  onCancel: () => void;
}

/**
 * The AddInteriorDamage component allows users to add new interior damage entries.
 */
export function AddInteriorDamage({ damageData, onCancel, onSave }: AddInteriorDamageProps) {
  const [currentDamage, setCurrentDamage] = useState<InteriorDamage | null>(
    damageData?.damage ?? null,
  );

  return (
    <div>
      <h2>{damageData ? 'Edit Interior Damage' : 'Add Interior Damage'}</h2>

      <div>
        <label>Area</label>
        <input
          type='text'
          value={currentDamage?.area || ''}
          onChange={(e) =>
            setCurrentDamage((prev) => ({
              ...prev!,
              area: e.target.value,
            }))
          }
        />
      </div>

      <div>
        <label>Damage Type</label>
        <input
          type='text'
          value={currentDamage?.damage_type || ''}
          onChange={(e) =>
            setCurrentDamage((prev) => ({
              ...prev!,
              damage_type: e.target.value,
            }))
          }
        />
      </div>

      <div>
        <label>Deduction</label>
        <input
          type='number'
          value={currentDamage?.repair_cost || ''}
          onChange={(e) =>
            setCurrentDamage((prev) => ({
              ...prev!,
              repair_cost: e.target.value ? Number(e.target.value) : null,
            }))
          }
        />
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
