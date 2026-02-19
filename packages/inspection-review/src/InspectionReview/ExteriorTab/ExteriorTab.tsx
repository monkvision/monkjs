import { useTabViews } from '../hooks';

enum ExteriorViews {
  SVGCar = 'SVG Car',
  AddPartDamage = 'Add Part Damage',
}

/**
 * The ExteriorTab component that displays content based on the currently active tab.
 */
export function ExteriorTab() {
  const { currentView, setCurrentView } = useTabViews({ views: Object.values(ExteriorViews) });

  if (currentView === ExteriorViews.SVGCar)
    return (
      <div>
        <p>Active Tab Content is Exterior</p>
        <div>Displaying Damages List</div>
        <button onClick={() => setCurrentView(ExteriorViews.AddPartDamage)}>Add Part Damage</button>
      </div>
    );

  return (
    <div>
      <p>Active Tab Content is Exterior</p>
      <div>Adding a New Damage</div>
      <button onClick={() => setCurrentView(ExteriorViews.SVGCar)}>Back to Damages List</button>
    </div>
  );
}
