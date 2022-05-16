/**
 * Application entity representing an area containing damages.
 */
export interface DamageArea {
  /**
   * The id (uuid) of the damage area entity (uuid).
   */
  id: string;
  /**
   * Relevent areas where the damage is visible.
   */
  relevantElements: CenterOnElement[];
}

/**
 * Normalized application entity representing an area containing damages.
 */
export type NormalizedDamageArea = DamageArea;

/**
 * Car part displayed at the center of a damage area.
 *
 * *Swagger Schema Reference :* `CenterOnElement`
 */
export enum CenterOnElement {
  FRONT = 'front',
  BACK = 'back',
  LEFT = 'left',
  RIGHT = 'right',
  FRONT_LEFT = 'front_left',
  FRONT_RIGHT = 'front_right',
  BACK_LEFT = 'back_left',
  BACK_RIGHT = 'back_right',
  KEYS = 'keys',
  DASHBOARD = 'dashboard',
  UNDERCARRIAGE = 'undercarriage',
  SEATS = 'seats',
  TRUNK_INTERIOR = 'trunk_interior',
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
