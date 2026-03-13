import { useTranslation } from 'react-i18next';
import { useObjectTranslation, viewpointLabels } from '@monkvision/common';
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
    successMessageStyle,
    tapMessageStyle,
    viewpointTextStyle,
    iconProps,
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

  if (props.view) {
    return (
      <div style={mainContainerStyle}>
        {props.showSuccessMessage && (
          <div style={successMessageStyle}>
            <Icon icon='check-circle' {...iconProps} />
            {t('successful')}
          </div>
        )}
        <div style={overlayDisplayStyle}>
          <div style={tapMessageStyle}>{t('tap')}</div>
          <div style={viewpointTextStyle}>{tObj(viewpointLabels[props.view])}</div>
        </div>
      </div>
    );
  }

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
          {props.captureMode && (
            <Button
              style={complianceRetakeButton.style}
              size={complianceRetakeButton.size}
              primaryColor={retakeOverlay.buttonColor}
              onClick={props.onRetake}
            >
              {t('retake')}
            </Button>
          )}
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
