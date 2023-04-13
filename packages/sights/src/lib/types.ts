/**
 * The category of a Sight.
 */
export enum SightCategory {
  /**
   * The category for sights representing the interior of a car.
   */
  INTERIOR = 'interior',
  /**
   * The category for sights representing the exterior of a car.
   */
  EXTERIOR = 'exterior',
  /**
   * The category for sights representing miscellaneous parts of a car (VIN number...)
   */
  MISC = 'misc',
}

/**
 * The different types of vehicle available in the Sights package.
 */
export enum VehicleType {
  /**
   * All vehicle types. This vehicle type is used by sights that can be used in any vehicle.
   */
  ALL = 'all',
  /**
   * Hatchback : Audi A7
   */
  AUDIA7 = 'audia7',
  /**
   * Crossover : Ford Escape SE 2020
   */
  FESC20 = 'fesc20',
  /**
   * Pickup : Ford F-150 Super Cab XL 2014
   */
  FF150 = 'ff150',
  /**
   * City : Ford Focus
   */
  FFOCUS18 = 'ffocus18',
  /**
   * Van : Ford Transit Fourgon L3H2 Trendline 2018
   */
  FTRANSIT18 = 'ftransit18',
  /**
   * Sedan : Honda Accord Sedan Sport US spec 2018
   */
  HACCORD = 'haccord',
  /**
   * Large SUV : Jeep Grand Cherokee L Summit 2021
   */
  JGC21 = 'jgc21',
  /**
   * Minivan : Toyota Sienna Limited 2020
   */
  TSIENNA20 = 'tsienna20',
  /**
   * Small Crossover/SUV : Volkswagen T-Roc
   */
  VWTROC = 'vwtroc',
}

/**
 * Names of the tasks that can be executed during an inspection.
 *
 * *Swagger Schema Reference :* `TaskName`
 */
export enum TaskName {
  /**
   * Detection of damages on different parts of the car (except the wheels).
   */
  DAMAGE_DETECTION = 'damage_detection',
  /**
   * Inspection of the condition of the wheels.
   */
  WHEEL_ANALYSIS = 'wheels_analysis',
  /**
   * Estimation of the repair operations (and their cost) that has to be done to fix the damages detected by the
   * damage detection task.
   */
  REPAIR_ESTIMATE = 'repair_estimate',
  /**
   * Optical character recognition  : this task is used to automatically "scan" some text like the VIN number for
   * instance.
   */
  IMAGES_OCR = 'images_ocr',
}

/**
 * Details of a sight with its overlay as an SVG string.
 */
export interface Sight {
  /**
   * The id of the sight.
   */
  id: string;
  /**
   * The category of the sight.
   */
  category: SightCategory;
  /**
   * The translation key of the sight's label.
   */
  label: string;
  /**
   * The sight's overlay as an SVG string.
   */
  overlay: string;
  /**
   * The vehicle type used in the sight overlay.
   */
  vehicleType: VehicleType;
  /**
   * The name of the task.
   */
  tasks: TaskName[];
}

/**
 * Details of a vehicle used in the Sights overlays.
 */
export interface VehicleDetails {
  /**
   * The make of the vehicle.
   */
  make: string;
  /**
   * The model of the vehicle.
   */
  model: string;
  /**
   * The type of the vehicle (Crossover, SUV...).
   */
  type: string;
  /**
   * The dimensions of the vehicle in meters in the following format : [X, Y, Z].
   *
   * Note that this info is not available yet for `audia7` and `vwtroc`.
   */
  dimensionsXYZ?: number[];
}

/**
 * The translation of a Sight label.
 */
export interface LabelTranslation {
  /**
   * The English translation of the Sight's label.
   */
  en: string;
  /**
   * The French translation of the Sight's label.
   */
  fr: string;
}

/**
 * A dictionary that maps vehicle types to vehicle details objects.
 */
export type VehicleDictionary = {
  [type in VehicleType]: VehicleDetails;
};

/**
 * A dictionary that maps translation keys (strings) to label translations objects.
 */
export type LabelDictionary = {
  [key: string]: LabelTranslation;
};

/**
 * A dictionary that maps sight ids to sight objects.
 */
export type SightDictionary = {
  [id: string]: Sight;
};

/**
 * An object that maps vehicle types to a list of sights for this vehicle.
 */
export type VehicleSights = {
  [key in VehicleType]: SightDictionary;
};
