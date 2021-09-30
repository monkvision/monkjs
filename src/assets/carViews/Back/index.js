import React from 'react';

import BumperRear from './bumper_rear.svg';
import DoorBackRight from './door_back_right.svg';
import DoorFrontRight from './door_front_right.svg';
import FenderBackRight from './fender_back_right.svg';
import FenderFrontRight from './fender_front_right.svg';
import HubcapBackRight from './hubcap_back_right.svg';
import HubcapFrontRight from './hubcap_front_right.svg';
import MirrorRight from './mirror_right.svg';
import RockerPanelRight from './rocker_panel_right.svg';
import Roof from './roof.svg';
import TailLightLeft from './tail_light_left.svg';
import TailLightRight from './tail_light_right.svg';
import Trunk from './trunk.svg';
import WheelBackRight from './wheel_back_right.svg';
import WheelFrontRight from './wheel_front_right.svg';
import WindowBackRight from './window_back_right.svg';
import WindowFrontRight from './window_front_right.svg';
import WindshieldBack from './windshield_back.svg';

const backViewParts = {
  bumper_rear: BumperRear,
  door_back_right: DoorBackRight,
  door_front_right: DoorFrontRight,
  fender_back_right: FenderBackRight,
  fender_front_right: FenderFrontRight,
  hubcap_back_right: HubcapBackRight,
  hubcap_front_right: HubcapFrontRight,
  mirror_right: MirrorRight,
  rocker_panel_right: RockerPanelRight,
  roof: Roof,
  tail_light_left: TailLightLeft,
  tail_light_right: TailLightRight,
  trunk: Trunk,
  wheel_back_right: WheelBackRight,
  wheel_front_right: WheelFrontRight,
  window_back_right: WindowBackRight,
  window_front_right: WindowFrontRight,
  windshield_back: WindshieldBack,
};

export default function BackViewPart(props) {
  const Part = backViewParts[props.partName];
  return <Part width={30} height={30} />;
}
