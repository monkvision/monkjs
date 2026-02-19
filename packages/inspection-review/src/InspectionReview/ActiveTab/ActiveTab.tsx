/**
 * Props accepted by the ActiveTab component.
 */
export interface ActiveTabProps {
  activeTab: string;
}

/**
 * The ActiveTab component that displays content based on the currently active tab.
 */

export function ActiveTab({ activeTab }: ActiveTabProps) {
  return <div>Active Tab Content is {activeTab}</div>;
}
