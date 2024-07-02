import { TaskName } from './state';
import { TranslationObject } from './i18n';

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
   * A compact or subcompact sedan with a squared-off roof and a rear flip-up hatch door that provides access to the
   * vehicle's cargo area instead of a conventional trunk.
   */
  HATCHBACK = 'hatchback',
  /**
   * A vehicle that is built on a car platform but has an increased ride height with a higher ground clearance like an
   * SUV, that can handle any terrain.
   */
  CUV = 'cuv',
  /**
   * A light-duty truck that has an enclosed cabin, and a back end made up of a cargo bed that is enclosed by three low
   * walls with no roof.
   */
  PICKUP = 'pickup',
  /**
   * A small car designed to be used primarily in urban areas and conurbations.
   */
  CITY = 'city',
  /**
   * A type of road vehicle used for transporting goods or people.
   */
  VAN = 'van',
  /**
   * A 4-door passenger car with a trunk that is separate from the passengers with a three-box body: the engine, the
   * area for passengers, and the trunk.
   */
  SEDAN = 'sedan',
  /**
   * A large SUV, distinguishable by its ability to tow large items, handle rough terrain, contain plenty of space for
   * passengers and cargo, and has 3 rows of seats.
   */
  LARGE_SUV = 'large-suv',
  /**
   * A vehicle designed to transport passengers in the rear seating row(s), with reconfigurable seats in two or three
   * rows.
   */
  MINIVAN = 'minivan',
  /**
   * "Sports Utility Vehicle" : A sleek looking vehicles that offer elegant city driving but also handle rugged terrain
   * thanks to a typical 4x4 capability.
   */
  SUV = 'suv',
}

/**
 * The different vehicle models used in the Sights package.
 */
export enum VehicleModel {
  /**
   * All vehicle types. This vehicle type is used by sights that can be used in any vehicle.
   */
  ALL = 'all',
  /**
   * Audi A7 (Hatchback)
   */
  AUDIA7 = 'audia7',
  /**
   * Ford Escape SE 2020 (CUV)
   */
  FESC20 = 'fesc20',
  /**
   * Ford F-150 Super Cab XL 2014 (Pickup)
   */
  FF150 = 'ff150',
  /**
   * Ford Focus (City)
   */
  FFOCUS18 = 'ffocus18',
  /**
   * Ford Transit Fourgon L3H2 Trendline 2018 (Van)
   */
  FTRANSIT18 = 'ftransit18',
  /**
   * Honda Accord Sedan Sport US spec 2018 (Sedan)
   */
  HACCORD = 'haccord',
  /**
   * Jeep Grand Cherokee L Summit 2021 (Large SUV)
   */
  JGC21 = 'jgc21',
  /**
   * Toyota Sienna Limited 2020 (Minivan)
   */
  TSIENNA20 = 'tsienna20',
  /**
   * Volkswagen T-Roc (SUV)
   */
  VWTROC = 'vwtroc',
}

/**
 * Enumeration of the different sight label used in Sights package.
 */
export enum SightLabel {
  /**
   * Hood label
   */
  HOOD = 'hood',
  /**
   * Front bumper side left label
   */
  FRONT_BUMPER_SIDE_LEFT = 'front-bumper-side-left',
  /**
   * Lateral full left label
   */
  LATERAL_FULL_LEFT = 'lateral-full-left',
  /**
   * Rear lateral full right label
   */
  REAR_LATERAL_FULL_RIGHT = 'rear-lateral-full-right',
  /**
   * Rear left label
   */
  REAR_LEFT = 'rear-left',
  /**
   * Lateral left label
   */
  LATERAL_LEFT = 'lateral-left',
  /**
   * Lateral full right label
   */
  LATERAL_FULL_RIGHT = 'lateral-full-right',
  /**
   * Beauty shot left label
   */
  BEAUTY_SHOT_LEFT = 'beauty-shot-left',
  /**
   * Front fender left label
   */
  FRONT_FENDER_LEFT = 'front-fender-left',
  /**
   * Rear lateral full left label
   */
  REAR_LATERAL_FULL_LEFT = 'rear-lateral-full-left',
  /**
   * Front lateral low right label
   */
  FRONT_LATERAL_LOW_RIGHT = 'front-lateral-low-right',
  /**
   * Rear low label
   */
  REAR_LOW = 'rear-low',
  /**
   * Rear lateral low right label
   */
  REAR_LATERAL_LOW_RIGHT = 'rear-lateral-low-right',
  /**
   * Front door left label
   */
  FRONT_DOOR_LEFT = 'front-door-left',
  /**
   * Rear lateral low left label
   */
  REAR_LATERAL_LOW_LEFT = 'rear-lateral-low-left',
  /**
   * Rear door right label
   */
  REAR_DOOR_RIGHT = 'rear-door-right',
  /**
   * Rear zoomed label
   */
  REAR_ZOOMED = 'rear-zoomed',
  /**
   * Rear lateral right label
   */
  REAR_LATERAL_RIGHT = 'rear_lateral-right',
  /**
   * Rear label
   */
  REAR = 'rear',
  /**
   * Front low label
   */
  FRONT_LOW = 'front-low',
  /**
   * Front roof left label
   */
  FRONT_ROOF_LEFT = 'front-roof-left',
  /**
   * Rear door left label
   */
  REAR_DOOR_LEFT = 'rear-door-left',
  /**
   * Front door right label
   */
  FRONT_DOOR_RIGHT = 'front-door-right',
  /**
   * Rear roof right label
   */
  REAR_ROOF_RIGHT = 'rear-roof-right',
  /**
   * Rear right label
   */
  REAR_RIGHT = 'rear-right',
  /**
   * Front bumper side right label
   */
  FRONT_BUMPER_SIDE_RIGHT = 'front-bumper-side-right',
  /**
   * Rear roof label
   */
  REAR_ROOF = 'rear-roof',
  /**
   * Front lateral full right label
   */
  FRONT_LATERAL_FULL_RIGHT = 'front-lateral-full-right',
  /**
   * Lateral low right label
   */
  LATERAL_LOW_RIGHT = 'lateral-low-right',
  /**
   * Rear lateracl left label
   */
  REAR_LATERAL_LEFT = 'rear-lateral-left',
  /**
   * Front lateral low left label
   */
  FRONT_LATERAL_LOW_LEFT = 'front-lateral-low-left',
  /**
   * Lateral low left label
   */
  LATERAL_LOW_LEFT = 'lateral-low-left',
  /**
   * Front fender right label
   */
  FRONT_FENDER_RIGHT = 'front-fender-right',
}

/**
 * Interface describing the sight guideline.
 */
export interface SightGuideline {
  /**
   * The list of sight IDs associated with this guideline.
   */
  sightIds: string[];
  /**
   * The guideline text in English.
   */
  en: string;
  /**
   * The guideline text in French.
   */
  fr?: string;
  /**
   * The guideline text in German.
   */
  de?: string;
  /**
   * The guideline text in Dutch.
   */
  nl?: string;
  /**
   * Divers information about guideline.
   */
  information?: string;
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
  label: SightLabel;
  /**
   * The sight's overlay as an SVG string.
   */
  overlay: string;
  /**
   * The vehicle model used in the sight overlay.
   */
  vehicle: VehicleModel;
  /**
   * The list of tasks that must be run on this sight.
   */
  tasks: TaskName[];
}

/**
 * Details of a vehicle used in the Sights overlays.
 */
export interface VehicleDetails {
  /**
   * The ID of the vehicle.
   */
  id: Exclude<VehicleModel, VehicleModel.ALL>;
  /**
   * The make of the vehicle.
   */
  make: string;
  /**
   * The model of the vehicle.
   */
  model: string;
  /**
   * The type of the vehicle (CUV, SUV...).
   */
  type: VehicleType;
  /**
   * The dimensions of the vehicle in meters in the following format : [X, Y, Z].
   *
   * Note that this info is not available yet for `audia7` and `vwtroc`.
   */
  dimensionsXYZ?: number[];
}

/**
 * The translation of labels for Sights, VehicleTypes etc.
 */
export interface LabelTranslation extends TranslationObject {
  /**
   * The key of the label.
   */
  key: string;
}

/**
 * A dictionary that maps vehicle types to vehicle details objects.
 */
export type VehicleDictionary = Record<Exclude<VehicleModel, VehicleModel.ALL>, VehicleDetails>;

/**
 * A dictionary that maps translation keys (strings) to label translations objects.
 */
export type LabelDictionary = Record<string, LabelTranslation>;

/**
 * A dictionary that maps sight ids to sight objects.
 */
export type SightDictionary = Record<string, Sight>;

/**
 * Enumeration of the two positions in which the steering wheel can be.
 */
export enum SteeringWheelPosition {
  /**
   * Steering wheel on the left (France, US etc.).
   */
  LEFT = 'left',
  /**
   * Steering wheel on the right (UK etc.).
   */
  RIGHT = 'right',
}
