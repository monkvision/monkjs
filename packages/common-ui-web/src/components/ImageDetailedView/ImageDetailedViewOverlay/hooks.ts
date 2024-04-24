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

export function isComplianceContainerDisplayed(props: ImageDetailedViewOverlayProps): boolean {
  return (
    props.captureMode &&
    [ImageStatus.UPLOAD_FAILED, ImageStatus.NOT_COMPLIANT].includes(props.image.status)
  );
}

export function useComplianceLabels(
  props: ImageDetailedViewOverlayProps,
): { title: string; description: string } | null {
  const { tObj } = useObjectTranslation();

  if (!isComplianceContainerDisplayed(props)) {
    return null;
  }
  if (props.image.status === ImageStatus.UPLOAD_FAILED) {
    return {
      title: tObj(imageStatusLabels[ImageStatus.UPLOAD_FAILED].title),
      description: tObj(imageStatusLabels[ImageStatus.UPLOAD_FAILED].description),
    };
  }
  if (!props.image.complianceIssues || props.image.complianceIssues.length === 0) {
    return null;
  }
  return {
    title: tObj(complianceIssueLabels[props.image.complianceIssues[0]].title),
    description: tObj(complianceIssueLabels[props.image.complianceIssues[0]].description),
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

  let overlayDisplayJustifyContent = 'space-between';
  if (!isComplianceContainerDisplayed(props)) {
    overlayDisplayJustifyContent = 'end';
  }
  if (!props.image.label) {
    overlayDisplayJustifyContent = 'start';
  }

  return {
    mainContainerStyle: {
      ...styles['mainContainer'],
      ...responsive(styles['mainContainerSmall']),
      background: isComplianceContainerDisplayed(props)
        ? 'linear-gradient(rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0) 50%)'
        : 'transparent',
    },
    overlayDisplayStyle: {
      ...styles['overlayDisplay'],
      justifyContent: overlayDisplayJustifyContent,
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
