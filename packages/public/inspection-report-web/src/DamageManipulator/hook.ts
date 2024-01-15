import { Severity } from '@monkvision/types';

export enum DamageMode {
  SEVERITY = 'severity',
  PRICING = 'pricing',
  ALL = 'all',
}

export enum DisplayMode {
  MINIMAL = 'minimal',
  FULL = 'full',
}
export interface Damage {
  severity?: Severity;
  pricing?: number;
}

export const severitiesWithIcons = [
  { key: Severity.LOW, buttonName: 'severity.low' },
  { key: Severity.MODERATE, buttonName: 'severity.moderate' },
  { key: Severity.HIGH, buttonName: 'severity.high' },
];
