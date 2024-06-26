import { useTranslation } from 'react-i18next';
import { useObjectTranslation } from '@monkvision/common';
import {
  ImageDetailedViewOverlayProps,
  useRetakeOverlay,
  useImageDetailedViewOverlayStyles,
  useImageLabelIcon,
} from './hooks';
import { Icon } from '../../../icons';
import { Button } from '../../Button';

export function ImageDetailedViewOverlay(props: ImageDetailedViewOverlayProps) {
  const { t } = useTranslation();
  const { tObj } = useObjectTranslation();
  const labelIcon = useImageLabelIcon(props);
  const retakeOverlay = useRetakeOverlay(props);
  const {
    mainContainerStyle,
    overlayDisplayStyle,
    complianceContainerStyle,
    complianceMessageContainerStyle,
    complianceIcon,
    complianceRetakeButton,
    complianceMessageStyle,
    complianceTitleStyle,
    complianceDescriptionStyle,
    imageLabelStyle,
    imageLabelIcon,
  } = useImageDetailedViewOverlayStyles(props);

  return (
    <div style={mainContainerStyle}>
      <div style={overlayDisplayStyle}>
        <div style={complianceContainerStyle}>
          <div style={complianceMessageContainerStyle}>
            <Icon
              icon={retakeOverlay.icon}
              primaryColor={retakeOverlay.iconColor}
              size={complianceIcon.size}
            />
            <div style={complianceMessageStyle}>
              <div style={complianceTitleStyle}>{retakeOverlay.title}</div>
              <div style={complianceDescriptionStyle}>{retakeOverlay.description}</div>
            </div>
          </div>
          <Button
            style={complianceRetakeButton.style}
            size={complianceRetakeButton.size}
            primaryColor={retakeOverlay.buttonColor}
            onClick={props.onRetake}
          >
            {t('retake')}
          </Button>
        </div>
        {props.image.label && (
          <div style={imageLabelStyle}>
            {labelIcon && (
              <Icon
                icon={labelIcon.icon}
                primaryColor={labelIcon.primaryColor}
                style={imageLabelIcon.style}
                size={imageLabelIcon.size}
              />
            )}
            {tObj(props.image.label)}
          </div>
        )}
      </div>
    </div>
  );
}
