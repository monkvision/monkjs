import { useMonkTheme } from '@monkvision/common';
import { ColorProp } from '@monkvision/types';
import { forwardRef, SVGProps } from 'react';
import { useIconAsset } from './hooks';
import { IconName } from './names';

/**
 * Props that the Monk Icon component can take. Additional props are passed to the SVG element.
 *
 * Note : The `width` and `height` properties are not available. In order to define the dimensions of the button, please
 * use the `size` property.
 */
export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  /**
   * The name of the icon.
   */
  icon: IconName;
  /**
   * The size (width and height, in pixels) of the icon.
   *
   * @default 50
   */
  size?: number;
  /**
   * The name or the hexcode of the color to apply to the icon.
   *
   * @default black
   */
  primaryColor?: ColorProp;
}

/**
 * Icon component use to easily place an SVG icon into your page by just specifying the name if the icon to place.
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ icon, size = 50, primaryColor = '#000000', ...passThroughProps }, ref) => {
    const { utils } = useMonkTheme();
    const IconAsset = useIconAsset(icon);
    const fill = utils.getColor(primaryColor);
    return <IconAsset ref={ref} fill={fill} width={size} height={size} {...passThroughProps} />;
  },
);
