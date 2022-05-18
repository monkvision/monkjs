/**
 * Application entity representing a car part on a specific inspection.
 */
export interface Part {
  /**
   * The id (uuid) of the part entity.
   */
  id: string;
  /**
   * Creation date of the part entity, in the ISO 8601 format.
   */
  createdAt?: string;
  /**
   * Deletion date of the part entity (if it has been deleted), in the ISO 8601 format.
   */
  deletedAt?: string;
  /**
   * The name of the car part.
   */
  partType?: PartType;
  /**
   * The id (uuid) of the user that created this part entity.
   */
  createdBy?: string;
  /**
   * The id (uuid) of the inspection that this car part belongs to.
   */
  inspectionId?: string;
  /**
   * The ids (uuids) of the damages that are located on this part.
   */
  damageIds?: string[];
  /**
   * The repair operation to be made on the part if there is one.
   */
  partOperation?: PartOperation;
}

/**
 * Normalized application entity representing a car part on a specific inspection.
 */
export type NormalizedPart = Part;

/**
 * An entity representing a repair operation to be made on a car part.
 *
 * *Swagger Schema Reference :* `PartOperationGet`
 */
export interface PartOperation {
  /**
   * The id (uuid) of the part operation entity.
   */
  id: string;
  /**
   * Creation date of the part operation entity, in the ISO 8601 format.
   */
  createdAt?: string;
  /**
   * Deletion date of the part operation entity (if it has been deleted), in the ISO 8601 format.
   */
  deletedAt?: string;
  /**
   * The id (uuid) of the car part that this operation is related to.
   */
  partId?: string;
  /**
   * The name of the repair operation.
   */
  name?: string;
  /**
   * The details of the work that has to be done on this operation.
   */
  labourDetails?: LabourDetails;
  /**
   * The cost of buying back the original equipment parts from the manufacturer.
   */
  piecesOemCost?: number;
  /**
   * The total cost of the repair operation.
   */
  totalCost?: number;
  /**
   * The severity of the damage that caused the need for this repair operation.
   */
  severity?: number;
}

/**
 * The details of the work that has to be done on a repair operation.
 *
 * *Swagger Schema Reference :* `LabourDetails`
 */
export interface LabourDetails {
  /**
   * Integer representing the duration (in hours) of work needed in the "type 1 - car body" category (disassembly,
   * reassembly etc...).
   */
  t1?: number;
  /**
   * Integer representing the duration (in hours) of work needed in the "type 2 - car body" category (restraigthening,
   * painting etc...).
   */
  t2?: number;
  /**
   * Integer representing the duration (in hours) of work needed in the "type 3 - car body" category (marbling,
   * measuring etc...).
   */
  t3?: number;
  /**
   * Integer representing the duration (in hours) of work needed in the "type 1 - mechanical" category (frequent work,
   * small reparations, maintenance etc...).
   */
  m1?: number;
  /**
   * Integer representing the duration (in hours) of work needed in the "type 2 - mechanical" category (electricity,
   * head gasket change etc...).
   */
  m2?: number;
  /**
   * Integer representing the duration (in hours) of work needed in the "type 1 - mechanical" category (frequent work,
   * small reparations, maintenance etc...).
   */
  m3?: number;
  /**
   * Integer representing the number of hours of painting needed in this repair.
   */
  paintHours?: number;
  /**
   * Integer representing the number of hours of work needed in this repair.
   */
  labourHours?: number;
}

/**
 * Known names of car parts.
 *
 * *Swagger Schema Reference :* `ReservedPartsNames`
 */
export enum PartType {
  IGNORE = 'ignore',
  BACKGROUND = 'background',
  BUMPER_BACK = 'bumper_back',
  BUMPER_FRONT = 'bumper_front',
  DOOR_BACK_LEFT = 'door_back_left',
  DOOR_BACK_RIGHT = 'door_back_right',
  DOOR_FRONT_LEFT = 'door_front_left',
  DOOR_FRONT_RIGHT = 'door_front_right',
  FENDER_BACK_LEFT = 'fender_back_left',
  FENDER_BACK_RIGHT = 'fender_back_right',
  FENDER_FRONT_LEFT = 'fender_front_left',
  FENDER_FRONT_RIGHT = 'fender_front_right',
  FOG_LIGHT_BACK_LEFT = 'fog_light_back_left',
  FOG_LIGHT_BACK_RIGHT = 'fog_light_back_right',
  FOG_LIGHT_FRONT_LEFT = 'fog_light_front_left',
  FOG_LIGHT_FRONT_RIGHT = 'fog_light_front_right',
  GRILL = 'grill',
  GRILL_LOW = 'grill_low',
  GRILL_RADIATOR = 'grill_radiator',
  HANDLE_BACK_LEFT = 'handle_back_left',
  HANDLE_BACK_RIGHT = 'handle_back_right',
  HANDLE_FRONT_LEFT = 'handle_front_left',
  HANDLE_FRONT_RIGHT = 'handle_front_right',
  HEAD_LIGHT_LEFT = 'head_light_left',
  HEAD_LIGHT_RIGHT = 'head_light_right',
  HEADER_PANEL = 'header_panel',
  HOOD = 'hood',
  HOOK = 'hook',
  HUBCAP = 'hubcap',
  HUBCAP_BACK_LEFT = 'hubcap_back_left',
  HUBCAP_BACK_RIGHT = 'hubcap_back_right',
  HUBCAP_FRONT_LEFT = 'hubcap_front_left',
  HUBCAP_FRONT_RIGHT = 'hubcap_front_right',
  INDICATOR_LIGHT_LEFT = 'indicator_light_left',
  INDICATOR_LIGHT_RIGHT = 'indicator_light_right',
  LICENSE_PLATE_BACK = 'license_plate_back',
  LICENSE_PLATE_FRONT = 'license_plate_front',
  LOGO = 'logo',
  MIRROR_SUPPORT = 'mirror_support',
  MIRROR_LEFT = 'mirror_left',
  MIRROR_RIGHT = 'mirror_right',
  PETROL_DOOR = 'petrol_door',
  PILLAR = 'pillar',
  QUARTER_WINDOW_BACK_LEFT = 'quarter_window_back_left',
  QUARTER_WINDOW_BACK_RIGHT = 'quarter_window_back_right',
  QUARTER_WINDOW_FRONT_LEFT = 'quarter_window_front_left',
  QUARTER_WINDOW_FRONT_RIGHT = 'quarter_window_front_right',
  REAR_SPOILER = 'rear_spoiler',
  ROCKER_PANEL = 'rocker_panel',
  ROCKER_PANEL_LEFT = 'rocker_panel_left',
  ROCKER_PANEL_RIGHT = 'rocker_panel_right',
  ROOF = 'roof',
  TAIL_LIGHT_CENTER = 'tail_light_center',
  TAIL_LIGHT_LEFT = 'tail_light_left',
  TAIL_LIGHT_RIGHT = 'tail_light_right',
  TRUNK = 'trunk',
  TURN_SIGNAL_FRONT_LATERAL_LEFT = 'turn_signal_front_lateral_left',
  TURN_SIGNAL_FRONT_LATERAL_RIGHT = 'turn_signal_front_lateral_right',
  WHEEL_BACK_LEFT = 'wheel_back_left',
  WHEEL_BACK_RIGHT = 'wheel_back_right',
  WHEEL_FRONT_LEFT = 'wheel_front_left',
  WHEEL_FRONT_RIGHT = 'wheel_front_right',
  WINDOW_BACK_LEFT = 'window_back_left',
  WINDOW_BACK_RIGHT = 'window_back_right',
  WINDOW_CORNER_LEFT = 'window_corner_left',
  WINDOW_CORNER_RIGHT = 'window_corner_right',
  WINDOW_FRONT_LEFT = 'window_front_left',
  WINDOW_FRONT_RIGHT = 'window_front_right',
  WINDSHIELD_BACK = 'windshield_back',
  WINDSHIELD_FRONT = 'windshield_front',
  WIPER = 'wiper',
  WIPER_BACK = 'wiper_back',
  WIPER_FRONT = 'wiper_front',
  WHEEL = 'wheel',
}
