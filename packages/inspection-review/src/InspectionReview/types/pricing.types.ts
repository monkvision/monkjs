/**
 * Colors associated with different pricing levels.
 */
export enum PricingColors {
  NONE = 'lightgray',
  LOW = '#62b0ef',
  MID = '#e1a25b',
  HIGH = '#f49796',
}

/**
 * Pricing levels for vehicle parts.
 */
export enum PricingLevels {
  NONE = 'none',
  LOW = 'low',
  MID = 'mid',
  HIGH = 'high',
}

/**
 * Pricing data structure to display pricing legends and to colorize parts based on their pricing level.
 */
export interface PricingData {
  /**
   * Color associated with the pricing level.
   */
  color: PricingColors | string;
  /**
   * Minimum price for the pricing level.
   */
  min: number;
  /**
   * Maximum price for the pricing level, inclusive.
   */
  max: number;
}

/**
 * The default prices that are shown in the price legend section.
 */
export const DEFAULT_PRICINGS: Record<PricingLevels | string, PricingData> = {
  [PricingLevels.NONE]: {
    color: PricingColors.NONE,
    min: 0,
    max: 0,
  },
  [PricingLevels.LOW]: {
    color: PricingColors.LOW,
    min: 1,
    max: 299,
  },
  [PricingLevels.MID]: {
    color: PricingColors.MID,
    min: 300,
    max: 599,
  },
  [PricingLevels.HIGH]: {
    color: PricingColors.HIGH,
    min: 600,
    max: 999999,
  },
};
