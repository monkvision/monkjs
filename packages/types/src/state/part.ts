import { MonkEntity, MonkEntityType } from './entity';

/**
 * Enumeration of the different vehicle part names used by Monk backend and frontend apps.
 */
export enum VehiclePart {
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
  FRONT_SPOILER = 'front_spoiler',
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

/**
 * A vehicle part detected on the vehicle during the inspection.
 */
export interface Part extends MonkEntity {
  /**
   * The type of the entity.
   */
  entityType: MonkEntityType.PART;
  /**
   * The ID of the inspection associated with this part.
   */
  inspectionId: string;
  /**
   * The type of the vehicle part.
   */
  type: VehiclePart;
  /**
   * The IDs of the damages detected on this part.
   */
  damages: string[];
  /**
   * The ID of the part operation if the part needs repair.
   */
  partOperation?: string;
  /**
   * The IDs of the images related to this part.
   */
  relatedImages?: string[];
}
