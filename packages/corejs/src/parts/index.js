import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import camelCase from 'lodash.camelcase';
import mapKeys from 'lodash.mapkeys';
import normalizr from 'normalizr';
import createEntityReducer from '../createEntityReducer';

export const key = 'parts';
export const idAttribute = 'id';
const processStrategy = (obj) => mapKeys(obj, (v, k) => camelCase(k));

export const schema = new normalizr.schema.Entity(key, {}, { idAttribute, processStrategy });

export const entityAdapter = createEntityAdapter({});
export const entityReducer = createEntityReducer(key, entityAdapter);

export default createSlice({
  name: key,
  initialState: entityAdapter.getInitialState({ entities: {}, ids: [] }),
  reducers: entityReducer,
});

export const TYPES = {
  ignore: '  ignore',
  background: 'background',
  bumperBack: 'bumper_back',
  bumperFront: 'bumper_front',
  doorBackLeft: 'door_back_left',
  doorBackRight: 'door_back_right',
  doorFrontLeft: 'door_front_left',
  doorFrontRight: 'door_front_right',
  fenderBackLeft: 'fender_back_left',
  fenderBackRight: 'fender_back_right',
  fenderFrontLeft: 'fender_front_left',
  fenderFrontRight: 'fender_front_right',
  fogLightBackLeft: 'fog_light_back_left',
  fogLightBackRight: 'fog_light_back_right',
  fogLightFrontLeft: 'fog_light_front_left',
  fogLightFrontRight: 'fog_light_front_right',
  grill: 'grill',
  grillLow: 'grill_low',
  grillRadiator: 'grill_radiator',
  handleBackLeft: 'handle_back_left',
  handleBackRight: 'handle_back_right',
  handleFrontLeft: 'handle_front_left',
  handleFrontRight: 'handle_front_right',
  headLightLeft: 'head_light_left',
  headLightRight: 'head_light_right',
  headerPanel: 'header_panel',
  hood: 'hood',
  hook: 'hook',
  hubcap: 'hubcap',
  hubcapBackLeft: 'hubcap_back_left',
  hubcapBackRight: 'hubcap_back_right',
  hubcapFrontLeft: 'hubcap_front_left',
  hubcapFrontRight: 'hubcap_front_right',
  indicatorLightLeft: 'indicator_light_left',
  indicatorLightRight: 'indicator_light_right',
  licensePlateBack: 'license_plate_back',
  licensePlateFront: 'license_plate_front',
  logo: 'logo',
  mirrorSupport: 'mirror_support',
  mirrorLeft: 'mirror_left',
  mirrorRight: 'mirror_right',
  petrolDoor: 'petrol_door',
  pillar: 'pillar',
  quarterWindowBackLeft: 'quarter_window_back_left',
  quarterWindowBackRight: 'quarter_window_back_right',
  quarterWindowFrontLeft: 'quarter_window_front_left',
  quarterWindowFrontRight: 'quarter_window_front_right',
  rearSpoiler: 'rear_spoiler',
  rockerPanel: 'rocker_panel',
  rockerPanelLeft: 'rocker_panel_left',
  rockerPanelRight: 'rocker_panel_right',
  roof: 'roof',
  tailLightCenter: 'tail_light_center',
  tailLightLeft: 'tail_light_left',
  tailLightRight: 'tail_light_right',
  trunk: 'trunk',
  turnSignalFrontLateralLeft: 'turn_signal_front_lateral_left',
  turnSignalFrontLateralRight: 'turn_signal_front_lateral_right',
  wheelBackLeft: 'wheel_back_left',
  wheelBackRight: 'wheel_back_right',
  wheelFrontLeft: 'wheel_front_left',
  wheelFrontRight: 'wheel_front_right',
  windowBackLeft: 'window_back_left',
  windowBackRight: 'window_back_right',
  windowCornerLeft: 'window_corner_left',
  windowCornerRight: 'window_corner_right',
  windowFrontLeft: 'window_front_left',
  windowFrontRight: 'window_front_right',
  windshieldBack: 'windshield_back',
  windshieldFront: 'windshield_front',
  wiper: 'wiper',
  wiperBack: 'wiper_back',
  wiperFront: 'wiper_front',
  wheel: 'wheel',
};
