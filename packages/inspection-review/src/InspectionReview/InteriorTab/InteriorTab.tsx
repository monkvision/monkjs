import { useMemo, useState } from 'react';
import { useInspectionReviewState, useTabViews } from '../hooks';
import { AddInteriorDamage } from './AddInteriorDamage/AddInteriorDamage';
import { useMonkState } from '@monkvision/common';

/**
 * Interface representing an interior damage item.
 */
export interface InteriorDamage {
  /**
   * The area of the interior where the damage is located.
   */
  area: string;
  /**
   * The type of damage.
   */
  damage_type: string;
  /**
   * The estimated repair cost for the damage.
   */
  repair_cost: number | null;
}

/**
 * Interface representing selected damage data along with its index in other_damages list.
 */
export interface SelectedDamageData {
  /**
   * The index of the damage in the other_damages list.
   */
  index: number;
  /**
   * The interior damage details.
   */
  damage: InteriorDamage;
}

enum InteriorViews {
  DamagesList = 'Damages List',
  AddDamage = 'Add Damage',
}

/**
 * The InteriorTab component that displays content based on the currently active tab.
 */
export function InteriorTab() {
  const { state } = useMonkState();
  const { inspection, handleAddDamage, handleDeleteDamage } = useInspectionReviewState();
  const { currentView, setCurrentView } = useTabViews({ views: Object.values(InteriorViews) });
  const [selectedDamage, setSelectedDamage] = useState<SelectedDamageData | null>(null);

  const interiorDamages: InteriorDamage[] = useMemo(
    () =>
      (state.inspections.find((i) => i.id === inspection?.id)?.additionalData?.[
        'other_damages'
      ] as InteriorDamage[]) || [],
    [inspection, state.inspections],
  );

  const handleSave = (newDamage: InteriorDamage) => {
    handleAddDamage(newDamage, selectedDamage?.index);
    resetToListView();
  };

  const editDamage = (index: number, damage: InteriorDamage) => {
    setSelectedDamage({ index, damage });
    setCurrentView(InteriorViews.AddDamage);
  };

  const resetToListView = () => {
    setCurrentView(InteriorViews.DamagesList);
    setSelectedDamage(null);
  };

  if (currentView === InteriorViews.AddDamage)
    return (
      <AddInteriorDamage
        damageData={selectedDamage}
        onCancel={resetToListView}
        onSave={handleSave}
      />
    );

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Area</th>
            <th>Damage Types</th>
            <th>Deduction</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {interiorDamages.map((damage, index) => (
            <tr key={index}>
              <td>{damage.area}</td>
              <td>{damage.damage_type}</td>
              <td>{damage.repair_cost}</td>
              <td>
                <div>
                  <button onClick={() => editDamage(index, damage)}>Edit</button>
                  <button onClick={() => handleDeleteDamage(index)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>
              <button onClick={() => setCurrentView(InteriorViews.AddDamage)}>ADD DAMAGE</button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
