/**
 * Enumeration of the types of items that a PricingV2 object can refer to.
 */
export enum PricingV2RelatedItemType {
  /**
   * The PricingV2 object is referring to a vehicle part.
   */
  PART = 'part',
  /**
   * The PricingV2 object is referring to the entirety of the vehicle.
   */
  VEHICLE = 'vehicle',
}

/**
 * Enumeration of the different operations that can be performed in order to repair a vehicle (used in PricingV2).
 */
export enum RepairOperationType {
  POLISHING = 'polishing',
  SANDING = 'sanding',
  PAINTING = 'painting',
  REPLACING = 'replacing',
  PAINTLESS_DENT_REPAIR = 'paintless_dent_repair',
  DENT_REPAIR = 'dent_repair',
  REFINISHING = 'refinishing',
  REMOVING = 'removing',
  PAINTING_HARD = 'painting_hard',
  PAINT_PREPARATION = 'paint_preparation',
}

/**
 * Details of the pricing using the expanded pricing feature. Provides details about the operations and the hours of
 * labour required and the cost of repairs for a specific part or on the entirety of the vehicle.
 */
export interface PricingV2Details {
  /**
   * The ID of the inspection associated with this pricing information.
   */
  inspectionId: string;
  /**
   * The type of item that this pricing information is referring to.
   */
  relatedItemType: PricingV2RelatedItemType;
  /**
   * The ID of the item that this pricing information is referring to.
   */
  relatedItemId?: string;
  /**
   * The total cost of the reparations needed to repair the item.
   */
  pricing?: number;
  /**
   * The list of operations needed to repair the item.
   */
  operations?: RepairOperationType[];
  /**
   * A map associating labour type keywords to the number of hours of work needed for this type of labour in the
   * reparation of the item.
   */
  hours?: Record<string, number>;
}

/**
 * Pricing information for the reparation of a vehicle, in its entirety and for each part.
 */
export interface PricingV2 {
  /**
   * The details of the pricing information. It associates each element name to its pricing details if it has some.
   */
  details: Record<string, PricingV2Details>;
  /**
   * The total cost of the reparations.
   */
  totalPrice?: number;
}
