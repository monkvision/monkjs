import { CameraHeight } from '@monkvision/types';
import { DynamicSVG } from '../DynamicSVG';
import {
  IconVerticalPositionProps,
  IconVerticalPositionVariant,
} from './IconVerticalPosition.types';
import { assets } from './assets';

function getSvg(position: CameraHeight, variant: IconVerticalPositionVariant): string {
  const { MONK_MID_SVG, HIGH_SVG, MONK_LOW_SVG, LOW_SVG, MID_SVG, MONK_HIGH_SVG } = assets;
  const svgMap = {
    [CameraHeight.HIGH]: {
      [IconVerticalPositionVariant.PRIMARY]: HIGH_SVG,
      [IconVerticalPositionVariant.SECONDARY]: MONK_HIGH_SVG,
    },
    [CameraHeight.MID]: {
      [IconVerticalPositionVariant.PRIMARY]: MID_SVG,
      [IconVerticalPositionVariant.SECONDARY]: MONK_MID_SVG,
    },
    [CameraHeight.LOW]: {
      [IconVerticalPositionVariant.PRIMARY]: LOW_SVG,
      [IconVerticalPositionVariant.SECONDARY]: MONK_LOW_SVG,
    },
  };

  return svgMap[position]?.[variant] || svgMap[CameraHeight.MID][variant];
}

/**
 * Component used to display an icon representing a vehicle and a point of view (POV) indicator.
 */
export function IconVerticalPosition({
  size = 50,
  position = CameraHeight.MID,
  variant = IconVerticalPositionVariant.PRIMARY,
}: IconVerticalPositionProps) {
  return <DynamicSVG svg={getSvg(position, variant)} width={size} height={size} />;
}
