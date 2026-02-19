import { useTabViews } from '../hooks';

enum InteriorViews {
  DamagesList = 'Damages List',
  AddDamage = 'Add Damage',
}

/**
 * The InteriorTab component that displays content based on the currently active tab.
 */
export function InteriorTab() {
  const { currentView, setCurrentView } = useTabViews({ views: Object.values(InteriorViews) });

  if (currentView === InteriorViews.DamagesList)
    return (
      <div>
        <p>Active Tab Content is Interior</p>
        <div>Displaying Damages List</div>
        <button onClick={() => setCurrentView(InteriorViews.AddDamage)}>Add Damage</button>
      </div>
    );

  return (
    <div>
      <p>Active Tab Content is Interior</p>
      <div>Adding a New Damage</div>
      <button onClick={() => setCurrentView(InteriorViews.DamagesList)}>
        Back to Damages List
      </button>
    </div>
  );
}
