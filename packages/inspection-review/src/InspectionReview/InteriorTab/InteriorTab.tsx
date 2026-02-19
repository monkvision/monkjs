import { useMemo, useState } from 'react';
import { useMonkState } from '@monkvision/common';
import { useInspectionReviewState } from '../hooks/InspectionReviewProvider';
import { useTabViews } from '../hooks/useTabViews';
import { AddInteriorDamage } from './AddInteriorDamage/AddInteriorDamage';
import { InteriorDamage, SelectedInteriorDamageData } from '../types';

enum InteriorViews {
  DamagesList = 'Damages List',
  AddDamage = 'Add Damage',
}

/**
 * The InteriorTab component that displays content based on the currently active tab.
 */
export function InteriorTab() {
  const { state } = useMonkState();
  const { inspection, handleAddInteriorDamage, handleDeleteInteriorDamage } =
    useInspectionReviewState();
  const { currentView, setCurrentView } = useTabViews({ views: Object.values(InteriorViews) });
  const [selectedDamage, setSelectedDamage] = useState<SelectedInteriorDamageData | null>(null);

  const interiorDamages: InteriorDamage[] = useMemo(
    () =>
      (state.inspections.find((i) => i.id === inspection?.id)?.additionalData?.[
        'other_damages'
      ] as InteriorDamage[]) || [],
    [inspection, state.inspections],
  );

  const resetToListView = () => {
    setCurrentView(InteriorViews.DamagesList);
    setSelectedDamage(null);
  };

  const handleSave = (newDamage: InteriorDamage) => {
    handleAddInteriorDamage(newDamage, selectedDamage?.index);
    resetToListView();
  };

  const editDamage = (index: number, damage: InteriorDamage) => {
    setSelectedDamage({ index, damage });
    setCurrentView(InteriorViews.AddDamage);
  };

  if (currentView === InteriorViews.AddDamage) {
    return (
      <AddInteriorDamage
        damageData={selectedDamage}
        onCancel={resetToListView}
        onSave={handleSave}
      />
    );
  }

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
                  <button onClick={() => handleDeleteInteriorDamage(index)}>Delete</button>
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
