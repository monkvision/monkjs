/* eslint-disable import/prefer-default-export */
import { IconSeverityHigh, IconSeverityLow, IconSeverityMedium } from '../assets';

export const DisplayMode = {
  MINIMAL: 'minimal',
  FULL: 'full',
};

export const DamageMode = {
  SEVERITY: 'severity',
  PRICING: 'pricing',
  ALL: 'all',
};

export const Severity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

export const SeveritiesWithIcon = [
  { key: Severity.LOW, Icon: IconSeverityLow },
  { key: Severity.MEDIUM, Icon: IconSeverityMedium },
  { key: Severity.HIGH, Icon: IconSeverityHigh },
];

export const CarOrientation = {
  FRONT_LEFT: 0,
  REAR_LEFT: 1,
  REAR_RIGHT: 2,
  FRONT_RIGHT: 3,
};

export const VehicleType = {
  SUV: 'suv',
  CUV: 'cuv',
  SEDAN: 'sedan',
  HATCHBACK: 'hatchback',
  VAN: 'van',
  MINIVAN: 'minivan',
  PICKUP: 'pickup',
};
