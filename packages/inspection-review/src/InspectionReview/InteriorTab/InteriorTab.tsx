import { Button } from '@monkvision/common-ui-web';
import { InteriorViews } from '../types';
import { AddInteriorDamage } from './AddInteriorDamage/AddInteriorDamage';
import { useInteriorTab } from './hooks/useInteriorTab';
import { styles } from './InteriorTab.styles';

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
    <div style={styles['container']}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          borderWidth: '1px',
          borderColor: '#e5e7eb',
          borderStyle: 'solid',
        }}
      >
        <thead>
          <tr>
            <th>
              <div style={styles['thContent']}>Area</div>
            </th>
            <th>
              <div style={styles['thContent']}>Damage Types</div>
            </th>
            <th>
              <div style={styles['thContent']}>Deduction</div>
            </th>
            <th>
              <div style={styles['thContent']} />
            </th>
          </tr>
        </thead>
        <tbody style={styles['tbody']}>
          {interiorDamages.map((damage, index) => (
            <tr key={index} style={styles['tr']}>
              <td style={styles['td']}>{damage.area}</td>
              <td style={styles['td']}>{damage.damage_type}</td>
              <td style={styles['td']}>{damage.repair_cost}</td>
              <td style={styles['td']}>
                <div>
                  <button onClick={() => editDamage(index, damage)}>Edit</button>
                  <button onClick={() => handleDeleteInteriorDamage(index)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={styles['addDamageContainer']}>
        <Button variant='outline' onClick={() => setCurrentView(InteriorViews.AddDamage)}>
          ADD DAMAGE
        </Button>
      </div>
    </div>
  );
}
