import { useInteractiveStatus } from '@monkvision/common';
import { sights } from '@monkvision/sights';
import {
  InspectionGalleryItemCardProps,
  useInspectionGalleryItemCardStyles,
  useInspectionGalleryItemLabel,
  useInspectionGalleryItemStatusIconName,
} from './hooks';
import { Icon } from '../../../icons';
import { SightOverlay } from '../../SightOverlay';

export function InspectionGalleryItemCard({
  item,
  captureMode,
  onClick,
}: InspectionGalleryItemCardProps) {
  const { status, eventHandlers } = useInteractiveStatus();
  const {
    cardStyle,
    previewStyle,
    previewOverlayStyle,
    labelStyle,
    statusIcon,
    sightOverlay,
    addDamageIcon,
  } = useInspectionGalleryItemCardStyles({ item, captureMode, status });
  const statusIconName = useInspectionGalleryItemStatusIconName({ item, captureMode });
  const label = useInspectionGalleryItemLabel(item);

  return (
    <button style={cardStyle} onClick={onClick} data-testid='card-btn' {...eventHandlers}>
      <div style={previewStyle} data-testid='preview'>
        {item.isAddDamage && (
          <Icon
            icon='add-circle'
            size={addDamageIcon.size}
            primaryColor={addDamageIcon.primaryColor}
          />
        )}
        {!item.isAddDamage && !item.isTaken && (
          <SightOverlay sight={sights[item.sightId]} height={sightOverlay.height} />
        )}
        <div data-testid='preview-overlay' style={previewOverlayStyle}></div>
        {statusIconName && (
          <Icon
            icon={statusIconName}
            size={statusIcon.size}
            primaryColor={statusIcon.primaryColor}
            style={statusIcon.style}
          />
        )}
      </div>
      <div style={labelStyle}>{label}</div>
    </button>
  );
}
