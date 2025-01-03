import { getInteractiveVariants, InteractiveVariation } from '@monkvision/common';
import { Styles } from '@monkvision/types';

export const TAKE_PICTURE_BUTTON_COLORS = getInteractiveVariants(
  '#f3f3f3',
  InteractiveVariation.DARKEN,
);

export const styles: Styles = {
  outerLayer: {
    borderStyle: 'solid',
    borderRadius: '50%',
    display: 'inline-block',
    cursor: 'pointer',
  },
  outerLayerDisabled: {
    opacity: 0.75,
    cursor: 'default',
  },
  innerLayer: {
    borderRadius: '50%',
    cursor: 'pointer',
  },
  innerLayerDisabled: {
    cursor: 'default',
  },
};
