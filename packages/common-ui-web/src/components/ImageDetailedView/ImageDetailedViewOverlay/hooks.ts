import { ColorProp, Image, ImageStatus } from '@monkvision/types';
import {
  changeAlpha,
  useMonkTheme,
  useObjectTranslation,
  complianceIssueLabels,
  imageStatusLabels,
  useResponsiveStyle,
  useWindowDimensions,
} from '@monkvision/common';
import { useMemo } from 'react';
import { IconName } from '../../../icons';
import { styles } from './ImageDetailedViewOverlay.styles';
import { SMALL_WIDTH_BREAKPOINT } from '../ImageDetailedView.styles';
import { ButtonSize } from '../../Button';

export interface ImageDetailedViewOverlayProps {
  image: Image;
  captureMode: boolean;
  onRetake?: () => void;
}

export interface ImageLabelIcon {
  icon: IconName;
  primaryColor: ColorProp;
}

export function isImageValid(props: ImageDetailedViewOverlayProps): boolean {
  return (
    !props.captureMode ||
    ![ImageStatus.UPLOAD_FAILED, ImageStatus.NOT_COMPLIANT].includes(props.image.status)
  );
}

export function useRetakeOverlay(props: ImageDetailedViewOverlayProps): {
  title: string;
  description: string;
  icon: IconName;
  iconColor: ColorProp;
  buttonColor: ColorProp;
} {
  const { tObj } = useObjectTranslation();

  const success = {
    title: tObj(imageStatusLabels[ImageStatus.SUCCESS].title),
    description: tObj(imageStatusLabels[ImageStatus.SUCCESS].description),
    iconColor: 'text-secondary',
    icon: 'check-circle' as IconName,
    buttonColor: 'primary',
  };

  if (isImageValid(props)) {
    return success;
  }
  if (props.image.status === ImageStatus.UPLOAD_FAILED) {
    return {
      title: tObj(imageStatusLabels[ImageStatus.UPLOAD_FAILED].title),
      description: tObj(imageStatusLabels[ImageStatus.UPLOAD_FAILED].description),
      iconColor: 'alert',
      icon: 'error',
      buttonColor: 'alert',
    };
  }
  if (!props.image.complianceIssues || props.image.complianceIssues.length === 0) {
    return success;
  }
  return {
    title: tObj(complianceIssueLabels[props.image.complianceIssues[0]].title),
    description: tObj(complianceIssueLabels[props.image.complianceIssues[0]].description),
    iconColor: 'alert',
    icon: 'error',
    buttonColor: 'alert',
  };
}

export function useImageLabelIcon(props: ImageDetailedViewOverlayProps): ImageLabelIcon | null {
  const { palette } = useMonkTheme();
  const colors = useMemo(
    () => ({
      grey: changeAlpha(palette.text.black, 0.5),
    }),
    [palette],
  );

  if (!props.captureMode) {
    return null;
  }
  switch (props.image.status) {
    case ImageStatus.UPLOADING:
      return { icon: 'processing', primaryColor: colors.grey };
    case ImageStatus.COMPLIANCE_RUNNING:
      return { icon: 'processing', primaryColor: colors.grey };
    case ImageStatus.SUCCESS:
      return { icon: 'check-circle', primaryColor: 'text-black' };
    case ImageStatus.UPLOAD_FAILED:
      return { icon: 'error', primaryColor: 'alert' };
    case ImageStatus.NOT_COMPLIANT:
      return { icon: 'error', primaryColor: 'alert' };
    default:
      return null;
  }
}

export function useImageDetailedViewOverlayStyles(props: ImageDetailedViewOverlayProps) {
  const dimensions = useWindowDimensions();
  const { responsive } = useResponsiveStyle();
  const { palette } = useMonkTheme();

  return {
    mainContainerStyle: {
      ...styles['mainContainer'],
      ...responsive(styles['mainContainerSmall']),
    },
    overlayDisplayStyle: {
      ...styles['overlayDisplay'],
      justifyContent: props.image.label ? 'space-between' : 'start',
    },
    complianceContainerStyle: {
      ...styles['complianceContainer'],
      ...responsive(styles['complianceContainerSmall']),
    },
    complianceMessageContainerStyle: styles['complianceMessageContainer'],
    complianceIcon: {
      size: 20,
    },
    complianceRetakeButton: {
      style: {
        ...styles['complianceRetakeButton'],
        ...responsive(styles['complianceRetakeButtonSmall']),
      },
      size: (dimensions && dimensions.width >= SMALL_WIDTH_BREAKPOINT
        ? 'normal'
        : 'small') as ButtonSize,
    },
    complianceMessageStyle: {
      ...styles['complianceMessage'],
      color: palette.text.primary,
    },
    complianceTitleStyle: styles['complianceTitle'],
    complianceDescriptionStyle: styles['complianceDescription'],
    imageLabelStyle: {
      ...styles['imageLabel'],
      backgroundColor: palette.surface.light,
      color: palette.text.black,
    },
    imageLabelIcon: {
      style: styles['imageLabelIcon'],
      size: 20,
    },
  };
}
