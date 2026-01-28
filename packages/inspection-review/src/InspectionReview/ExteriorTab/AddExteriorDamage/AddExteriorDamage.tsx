import { DamageType } from '@monkvision/types';
import { useMonkTheme } from '@monkvision/common';
import { SwitchButton } from '@monkvision/common-ui-web';
import { DamageChip } from './DamageChip';
import { DamagedPartDetails } from '../../types/damage.types';
import { useExteriorDamage } from './hooks/useExteriorDamage';

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
  const { hasDamage, setHasDamage, damageTypes, onDamageClicked, pricing, setPricing } =
    useExteriorDamage({ detailedPart });

  return (
    <div>
      <p>{detailedPart?.part}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <p>This part is damaged</p>
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
        <div>
          <p>Damages</p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '20px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {firstColumnDamages.map((damage) => (
                <DamageChip
                  key={damage}
                  damage={damage}
                  selectedDamages={damageTypes}
                  onDamageClicked={onDamageClicked}
                />
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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

          <div>
            <p>Price</p>
            <input
              type='text'
              maxLength={4}
              value={pricing ?? 0}
              onChange={(e) => {
                const { value } = e.target;
                if (value === '' || /^\d*$/.test(value)) {
                  setPricing(value === '' ? undefined : Number(value));
                }
              }}
            />
          </div>
        </div>
      )}

      <div>
        <button onClick={handleCancel}>Cancel</button>
        <button
          onClick={() => {
            if (!detailedPart) {
              return;
            }
            handleDone({ part: detailedPart.part, damageTypes, pricing, isDamaged: hasDamage });
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
}
