import { damageTypeLabels, useObjectTranslation } from '@monkvision/common';
import { Button } from '@monkvision/common-ui-web';
import { DamageType } from '@monkvision/types';

/**
 * Props for the DamageChip component.
 */
export interface DamageChipProps {
  /**
   * The type of damage represented by this chip.
   */
  damage: DamageType;
  /**
   * The list of currently selected damages.
   */
  selectedDamages: DamageType[];
  /**
   * Callback function invoked when a damage chip is clicked.
   */
  onDamageClicked: (damage: DamageType) => void;
}

/**
 * Component for displaying a damage chip.
 */
export function DamageChip({ damage, selectedDamages, onDamageClicked }: DamageChipProps) {
  const { tObj } = useObjectTranslation();

  return (
    <Button
      primaryColor={selectedDamages.includes(damage) ? 'primary' : 'secondary'}
      secondaryColor={'text-white'}
      onClick={() => onDamageClicked(damage)}
    >
      {damageTypeLabels[damage] ? tObj(damageTypeLabels[damage]) : 'unknown'}
    </Button>
  );
}
