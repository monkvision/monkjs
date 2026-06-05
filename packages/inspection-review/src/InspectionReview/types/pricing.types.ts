/**
 * Colors associated with different pricing levels.
 */
export enum PriceColors {
  NONE = 'lightgray',
  LOW = '#62b0ef',
  MID = '#e1a25b',
  HIGH = '#f49796',
}

/**
 * Pricing levels for vehicle parts.
 */
export enum PriceLevels {
  NONE = 'none',
  LOW = 'low',
  MID = 'mid',
  HIGH = 'high',
}

/**
 * Pricing data structure to display pricing legends and to colorize parts based on their pricing level.
 */
export interface PriceData {
  color: PriceColors | string;
  min: number;
  max: number;
}

/**
 * The default prices that are shown in the price legend section.
 */
export const DEFAULT_PRICES: Record<PriceLevels | string, PriceData> = {
  [PriceLevels.NONE]: {
    color: PriceColors.NONE,
    min: 0,
    max: 0,
  },
  [PriceLevels.LOW]: {
    color: PriceColors.LOW,
    min: 1,
    max: 300,
  },
  [PriceLevels.MID]: {
    color: PriceColors.MID,
    min: 300,
    max: 600,
  },
  [PriceLevels.HIGH]: {
    color: PriceColors.HIGH,
    min: 600,
    max: 999999,
  },
};
