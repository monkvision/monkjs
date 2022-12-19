import { CarOrientation } from './useCarOrientation';
import * as Assets from '../assets';

export default [
  {
    key: 'bumper_back',
    components: {
      [CarOrientation.FRONT_LEFT]: null,
      [CarOrientation.REAR_LEFT]: Assets.RearLeftBumperBack,
      [CarOrientation.REAR_RIGHT]: Assets.RearRightBumperBack,
      [CarOrientation.FRONT_RIGHT]: null,
    },
  },
  {
    key: 'bumper_front',
    components: {
      [CarOrientation.FRONT_LEFT]: Assets.FrontLeftBumperFront,
      [CarOrientation.REAR_LEFT]: null,
      [CarOrientation.REAR_RIGHT]: null,
      [CarOrientation.FRONT_RIGHT]: Assets.FrontRightBumperFront,
    },
  },
  {
    key: 'door_back_left',
    components: {
      [CarOrientation.FRONT_LEFT]: Assets.FrontLeftDoorBackLeft,
      [CarOrientation.REAR_LEFT]: Assets.RearLeftDoorBackLeft,
      [CarOrientation.REAR_RIGHT]: null,
      [CarOrientation.FRONT_RIGHT]: null,
    },
  },
  {
    key: 'door_back_right',
    components: {
      [CarOrientation.FRONT_LEFT]: null,
      [CarOrientation.REAR_LEFT]: null,
      [CarOrientation.REAR_RIGHT]: Assets.RearRightDoorBackRight,
      [CarOrientation.FRONT_RIGHT]: Assets.FrontRightDoorBackRight,
    },
  },
  {
    key: 'door_front_left',
    components: {
      [CarOrientation.FRONT_LEFT]: Assets.FrontLeftDoorFrontLeft,
      [CarOrientation.REAR_LEFT]: Assets.RearLeftDoorFrontLeft,
      [CarOrientation.REAR_RIGHT]: null,
      [CarOrientation.FRONT_RIGHT]: null,
    },
  },
  {
    key: 'door_front_right',
    components: {
      [CarOrientation.FRONT_LEFT]: null,
      [CarOrientation.REAR_LEFT]: null,
      [CarOrientation.REAR_RIGHT]: Assets.RearRightDoorFrontRight,
      [CarOrientation.FRONT_RIGHT]: Assets.FrontRightDoorFrontRight,
    },
  },
  {
    key: 'fender_back_left',
    components: {
      [CarOrientation.FRONT_LEFT]: null,
      [CarOrientation.REAR_LEFT]: Assets.RearLeftFenderBackLeft,
      [CarOrientation.REAR_RIGHT]: null,
      [CarOrientation.FRONT_RIGHT]: null,
    },
  },
  {
    key: 'fender_back_right',
    components: {
      [CarOrientation.FRONT_LEFT]: null,
      [CarOrientation.REAR_LEFT]: null,
      [CarOrientation.REAR_RIGHT]: Assets.RearRightFenderBackRight,
      [CarOrientation.FRONT_RIGHT]: null,
    },
  },
  {
    key: 'fender_front_left',
    components: {
      [CarOrientation.FRONT_LEFT]: Assets.FrontLeftFenderFrontLeft,
      [CarOrientation.REAR_LEFT]: null,
      [CarOrientation.REAR_RIGHT]: null,
      [CarOrientation.FRONT_RIGHT]: null,
    },
  },
  {
    key: 'fender_front_right',
    components: {
      [CarOrientation.FRONT_LEFT]: null,
      [CarOrientation.REAR_LEFT]: null,
      [CarOrientation.REAR_RIGHT]: null,
      [CarOrientation.FRONT_RIGHT]: Assets.FrontRightFenderFrontRight,
    },
  },
  {
    key: 'fog_light_back_left',
    components: {
      [CarOrientation.FRONT_LEFT]: null,
      [CarOrientation.REAR_LEFT]: null,
      [CarOrientation.REAR_RIGHT]: null,
      [CarOrientation.FRONT_RIGHT]: null,
    },
  },
  {
    key: 'fog_light_back_right',
    components: {
      [CarOrientation.FRONT_LEFT]: null,
      [CarOrientation.REAR_LEFT]: null,
      [CarOrientation.REAR_RIGHT]: null,
      [CarOrientation.FRONT_RIGHT]: null,
    },
  },
  {
    key: 'fog_light_front_left',
    components: {
      [CarOrientation.FRONT_LEFT]: Assets.FrontLeftFogLightFrontLeft,
      [CarOrientation.REAR_LEFT]: null,
      [CarOrientation.REAR_RIGHT]: null,
      [CarOrientation.FRONT_RIGHT]: null,
    },
  },
  {
    key: 'fog_light_front_right',
    components: {
      [CarOrientation.FRONT_LEFT]: null,
      [CarOrientation.REAR_LEFT]: null,
      [CarOrientation.REAR_RIGHT]: null,
      [CarOrientation.FRONT_RIGHT]: Assets.FrontRightFogLightFrontRight,
    },
  },
  {
    key: 'grill_low',
    components: {
      [CarOrientation.FRONT_LEFT]: null,
      [CarOrientation.REAR_LEFT]: null,
      [CarOrientation.REAR_RIGHT]: null,
      [CarOrientation.FRONT_RIGHT]: null,
    },
  },
  {
    key: 'grill_radiator',
    components: {
      [CarOrientation.FRONT_LEFT]: Assets.FrontLeftGrillRadiator,
      [CarOrientation.REAR_LEFT]: null,
      [CarOrientation.REAR_RIGHT]: null,
      [CarOrientation.FRONT_RIGHT]: Assets.FrontRightGrillRadiator,
    },
  },
  {
    key: 'handle_back_left',
    components: {
      [CarOrientation.FRONT_LEFT]: null,
      [CarOrientation.REAR_LEFT]: null,
      [CarOrientation.REAR_RIGHT]: null,
      [CarOrientation.FRONT_RIGHT]: null,
    },
  },
  {
    key: 'handle_back_right',
    components: {
      [CarOrientation.FRONT_LEFT]: null,
      [CarOrientation.REAR_LEFT]: null,
      [CarOrientation.REAR_RIGHT]: null,
      [CarOrientation.FRONT_RIGHT]: null,
    },
  },
  {
    key: 'handle_front_left',
    components: {
      [CarOrientation.FRONT_LEFT]: null,
      [CarOrientation.REAR_LEFT]: null,
      [CarOrientation.REAR_RIGHT]: null,
      [CarOrientation.FRONT_RIGHT]: null,
    },
  },
  {
    key: 'handle_front_right',
    components: {
      [CarOrientation.FRONT_LEFT]: null,
      [CarOrientation.REAR_LEFT]: null,
      [CarOrientation.REAR_RIGHT]: null,
      [CarOrientation.FRONT_RIGHT]: null,
    },
  },
  {
    key: 'head_light_left',
    components: {
      [CarOrientation.FRONT_LEFT]: Assets.FrontLeftHeadLightLeft,
      [CarOrientation.REAR_LEFT]: null,
      [CarOrientation.REAR_RIGHT]: null,
      [CarOrientation.FRONT_RIGHT]: null,
    },
  },
  {
    key: 'head_light_right',
    components: {
      [CarOrientation.FRONT_LEFT]: null,
      [CarOrientation.REAR_LEFT]: null,
      [CarOrientation.REAR_RIGHT]: null,
      [CarOrientation.FRONT_RIGHT]: Assets.FrontRightHeadLightRight,
    },
  },
  {
    key: 'mirror_left',
    components: {
      [CarOrientation.FRONT_LEFT]: Assets.FrontLeftMirrorLeft,
      [CarOrientation.REAR_LEFT]: Assets.RearLeftMirrorLeft,
      [CarOrientation.REAR_RIGHT]: null,
      [CarOrientation.FRONT_RIGHT]: null,
    },
  },
  {
    key: 'mirror_right',
    components: {
      [CarOrientation.FRONT_LEFT]: null,
      [CarOrientation.REAR_LEFT]: null,
      [CarOrientation.REAR_RIGHT]: Assets.RearRightMirrorRight,
      [CarOrientation.FRONT_RIGHT]: Assets.FrontRightMirrorRight,
    },
  },
  {
    key: 'quarter_window_back_left',
    components: {
      [CarOrientation.FRONT_LEFT]: null,
      [CarOrientation.REAR_LEFT]: Assets.RearLeftQuarterWindowBackLeft,
      [CarOrientation.REAR_RIGHT]: null,
      [CarOrientation.FRONT_RIGHT]: null,
    },
  },
  {
    key: 'quarter_window_back_right',
    components: {
      [CarOrientation.FRONT_LEFT]: null,
      [CarOrientation.REAR_LEFT]: null,
      [CarOrientation.REAR_RIGHT]: Assets.RearRightQuarterWindowBackRight,
      [CarOrientation.FRONT_RIGHT]: null,
    },
  },
  {
    key: 'quarter_window_front_left',
    components: {
      [CarOrientation.FRONT_LEFT]: null,
      [CarOrientation.REAR_LEFT]: null,
      [CarOrientation.REAR_RIGHT]: null,
      [CarOrientation.FRONT_RIGHT]: null,
    },
  },
  {
    key: 'quarter_window_front_right',
    components: {
      [CarOrientation.FRONT_LEFT]: null,
      [CarOrientation.REAR_LEFT]: null,
      [CarOrientation.REAR_RIGHT]: null,
      [CarOrientation.FRONT_RIGHT]: null,
    },
  },
  {
    key: 'rocker_panel_left',
    components: {
      [CarOrientation.FRONT_LEFT]: Assets.FrontLeftRockerPanelLeft,
      [CarOrientation.REAR_LEFT]: Assets.RearLeftRockerPanelLeft,
      [CarOrientation.REAR_RIGHT]: null,
      [CarOrientation.FRONT_RIGHT]: null,
    },
  },
  {
    key: 'rocker_panel_right',
    components: {
      [CarOrientation.FRONT_LEFT]: null,
      [CarOrientation.REAR_LEFT]: null,
      [CarOrientation.REAR_RIGHT]: Assets.RearRightRockerPanelRight,
      [CarOrientation.FRONT_RIGHT]: Assets.FrontRightRockerPanelRight,
    },
  },
  {
    key: 'tail_light_left',
    components: {
      [CarOrientation.FRONT_LEFT]: null,
      [CarOrientation.REAR_LEFT]: Assets.RearLeftTailLightLeft,
      [CarOrientation.REAR_RIGHT]: null,
      [CarOrientation.FRONT_RIGHT]: null,
    },
  },
  {
    key: 'tail_light_right',
    components: {
      [CarOrientation.FRONT_LEFT]: null,
      [CarOrientation.REAR_LEFT]: null,
      [CarOrientation.REAR_RIGHT]: Assets.RearRightTailLightRight,
      [CarOrientation.FRONT_RIGHT]: null,
    },
  },
  {
    key: 'wheel_back_left',
    components: {
      [CarOrientation.FRONT_LEFT]: null,
      [CarOrientation.REAR_LEFT]: Assets.RearLeftWheelBackLeft,
      [CarOrientation.REAR_RIGHT]: null,
      [CarOrientation.FRONT_RIGHT]: null,
    },
  },
  {
    key: 'wheel_back_right',
    components: {
      [CarOrientation.FRONT_LEFT]: null,
      [CarOrientation.REAR_LEFT]: null,
      [CarOrientation.REAR_RIGHT]: Assets.RearRightWheelBackRight,
      [CarOrientation.FRONT_RIGHT]: null,
    },
  },
  {
    key: 'wheel_front_left',
    components: {
      [CarOrientation.FRONT_LEFT]: Assets.FrontLeftWheelFrontLeft,
      [CarOrientation.REAR_LEFT]: null,
      [CarOrientation.REAR_RIGHT]: null,
      [CarOrientation.FRONT_RIGHT]: null,
    },
  },
  {
    key: 'wheel_front_right',
    components: {
      [CarOrientation.FRONT_LEFT]: null,
      [CarOrientation.REAR_LEFT]: null,
      [CarOrientation.REAR_RIGHT]: null,
      [CarOrientation.FRONT_RIGHT]: Assets.FrontRightWheelFrontRight,
    },
  },
  {
    key: 'window_back_left',
    components: {
      [CarOrientation.FRONT_LEFT]: Assets.FrontLeftWindowBackLeft,
      [CarOrientation.REAR_LEFT]: Assets.RearLeftWindowBackLeft,
      [CarOrientation.REAR_RIGHT]: null,
      [CarOrientation.FRONT_RIGHT]: null,
    },
  },
  {
    key: 'window_back_right',
    components: {
      [CarOrientation.FRONT_LEFT]: null,
      [CarOrientation.REAR_LEFT]: null,
      [CarOrientation.REAR_RIGHT]: Assets.RearRightWindowBackRight,
      [CarOrientation.FRONT_RIGHT]: Assets.FrontRightWindowBackRight,
    },
  },
  {
    key: 'window_corner_left',
    components: {
      [CarOrientation.FRONT_LEFT]: null,
      [CarOrientation.REAR_LEFT]: null,
      [CarOrientation.REAR_RIGHT]: null,
      [CarOrientation.FRONT_RIGHT]: null,
    },
  },
  {
    key: 'window_corner_right',
    components: {
      [CarOrientation.FRONT_LEFT]: null,
      [CarOrientation.REAR_LEFT]: null,
      [CarOrientation.REAR_RIGHT]: null,
      [CarOrientation.FRONT_RIGHT]: null,
    },
  },
  {
    key: 'window_front_left',
    components: {
      [CarOrientation.FRONT_LEFT]: Assets.FrontLeftWindowFrontLeft,
      [CarOrientation.REAR_LEFT]: Assets.RearLeftWindowFrontLeft,
      [CarOrientation.REAR_RIGHT]: null,
      [CarOrientation.FRONT_RIGHT]: null,
    },
  },
  {
    key: 'window_front_right',
    components: {
      [CarOrientation.FRONT_LEFT]: null,
      [CarOrientation.REAR_LEFT]: null,
      [CarOrientation.REAR_RIGHT]: Assets.RearRightWindowFrontRight,
      [CarOrientation.FRONT_RIGHT]: Assets.FrontRightWindowFrontRight,
    },
  },
  {
    key: 'windshield_back',
    components: {
      [CarOrientation.FRONT_LEFT]: null,
      [CarOrientation.REAR_LEFT]: Assets.RearLeftWindshieldBack,
      [CarOrientation.REAR_RIGHT]: Assets.RearRightWindshieldBack,
      [CarOrientation.FRONT_RIGHT]: null,
    },
  },
  {
    key: 'windshield_front',
    components: {
      [CarOrientation.FRONT_LEFT]: Assets.FrontLeftWindshieldFront,
      [CarOrientation.REAR_LEFT]: null,
      [CarOrientation.REAR_RIGHT]: null,
      [CarOrientation.FRONT_RIGHT]: Assets.FrontRightWindshieldFront,
    },
  },
  {
    key: 'front_spoiler',
    components: {
      [CarOrientation.FRONT_LEFT]: null,
      [CarOrientation.REAR_LEFT]: null,
      [CarOrientation.REAR_RIGHT]: null,
      [CarOrientation.FRONT_RIGHT]: null,
    },
  },
  {
    key: 'rear_spoiler',
    components: {
      [CarOrientation.FRONT_LEFT]: null,
      [CarOrientation.REAR_LEFT]: null,
      [CarOrientation.REAR_RIGHT]: null,
      [CarOrientation.FRONT_RIGHT]: null,
    },
  },
  {
    key: 'hood',
    components: {
      [CarOrientation.FRONT_LEFT]: Assets.FrontLeftHood,
      [CarOrientation.REAR_LEFT]: null,
      [CarOrientation.REAR_RIGHT]: null,
      [CarOrientation.FRONT_RIGHT]: Assets.FrontRightHood,
    },
  },
  {
    key: 'petrol_door',
    components: {
      [CarOrientation.FRONT_LEFT]: null,
      [CarOrientation.REAR_LEFT]: null,
      [CarOrientation.REAR_RIGHT]: null,
      [CarOrientation.FRONT_RIGHT]: null,
    },
  },
  {
    key: 'pillar',
    components: {
      [CarOrientation.FRONT_LEFT]: null,
      [CarOrientation.REAR_LEFT]: null,
      [CarOrientation.REAR_RIGHT]: null,
      [CarOrientation.FRONT_RIGHT]: null,
    },
  },
  {
    key: 'roof',
    components: {
      [CarOrientation.FRONT_LEFT]: Assets.FrontLeftRoof,
      [CarOrientation.REAR_LEFT]: Assets.RearLeftRoof,
      [CarOrientation.REAR_RIGHT]: Assets.RearRightRoof,
      [CarOrientation.FRONT_RIGHT]: Assets.FrontRightRoof,
    },
  },
  {
    key: 'trunk',
    components: {
      [CarOrientation.FRONT_LEFT]: null,
      [CarOrientation.REAR_LEFT]: Assets.RearLeftTrunk,
      [CarOrientation.REAR_RIGHT]: Assets.RearRightTrunk,
      [CarOrientation.FRONT_RIGHT]: null,
    },
  },
];
