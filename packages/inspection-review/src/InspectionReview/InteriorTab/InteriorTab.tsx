import { InteriorViews } from '../types';
import { AddInteriorDamage } from './AddInteriorDamage/AddInteriorDamage';
import { useInteriorTab } from './hooks/useInteriorTab';

/**
 * The InteriorTab component that displays content based on the currently active tab.
 */
export function InteriorTab() {
  const {
    interiorDamages,
    currentView,
    selectedDamage,
    setCurrentView,
    handleSave,
    editDamage,
    handleDeleteInteriorDamage,
    resetToListView,
  } = useInteriorTab();

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
