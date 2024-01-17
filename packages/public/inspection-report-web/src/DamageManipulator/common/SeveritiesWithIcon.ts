import { Severity } from '@monkvision/types';

export interface SeverityWithIcon {
  key: Severity;
  buttonName: string;
  icon: string;
}

const iconSeverityLow =
  '<svg fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="8.5" stroke="#64B5F6" stroke-width="3"/></svg>';
const iconSeverityModerate =
  '<svg fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="8.5" stroke="#D4E157" stroke-width="3"/><mask id="test_svg__a" fill="#fff"><path fill-rule="evenodd" d="M10 20V0C4.477 0 0 4.477 0 10s4.477 10 10 10Z" clip-rule="evenodd"/></mask><path fill="#D4E157" fill-rule="evenodd" d="M10 20V0C4.477 0 0 4.477 0 10s4.477 10 10 10Z" clip-rule="evenodd"/><path fill="#D4E157" d="M10 20v4h4v-4h-4Zm0-20h4v-4h-4v4Zm4 20V0H6v20h8ZM4 10a6 6 0 0 1 6-6v-8C2.268-4-4 2.268-4 10h8Zm6 6a6 6 0 0 1-6-6h-8c0 7.732 6.268 14 14 14v-8Z" mask="url(#test_svg__a)"/></svg>';
const iconSeverityHigh =
  '<svg fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="8" fill="#F59896" stroke="#F59896" stroke-width="4"/></svg>';

/**
 * Array of SeveritiesWithIcon Object key: Severity type, Json key for translation, svg string
 */
export const severitiesWithIcon: SeverityWithIcon[] = [
  {
    key: Severity.LOW,
    buttonName: 'damageManipulator.severitySelection.low',
    icon: iconSeverityLow,
  },
  {
    key: Severity.MODERATE,
    buttonName: 'damageManipulator.severitySelection.moderate',
    icon: iconSeverityModerate,
  },
  {
    key: Severity.HIGH,
    buttonName: 'damageManipulator.severitySelection.high',
    icon: iconSeverityHigh,
  },
];
