import { i18nWrap, useI18nSync } from '@monkvision/common';
import { useMemo, useState } from 'react';
import { Image, ImageType } from '@monkvision/types';
import { InspectionGalleryItem, InspectionGalleryProps, NavigateToCaptureReason } from './types';
import {
  useInspectionGalleryEmptyLabel,
  useInspectionGalleryItems,
  useInspectionGalleryStyles,
  useItemListFillers,
} from './hooks';
import { i18nInspectionGallery } from './i18n';
import { InspectionGalleryFilter, InspectionGalleryTopBar } from './InspectionGalleryTopBar';
import { InspectionGalleryItemCard } from './InspectionGalleryItemCard';
import { ImageDetailedView } from '../ImageDetailedView';

function getItemKey(item: InspectionGalleryItem): string {
  if (item.isAddDamage) {
    return 'item-add-damage';
  }
  if (!item.isTaken) {
    return item.sightId;
  }
  return item.image.id;
}

/**
 * This component is used to display a gallery of pictures taken during an inspection. If this component is used
 * mid-capture, set the `captureMode` prop to `true` so that you'll enable features such as compliance errors, retakes
 * etc.
 */
export const InspectionGallery = i18nWrap((props: InspectionGalleryProps) => {
  useI18nSync(props.lang);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const items = useInspectionGalleryItems(props);
  const [currentFilter, setCurrentFilter] = useState<InspectionGalleryFilter | null>(null);
  const filteredItems = useMemo(
    () => (currentFilter ? items.filter(currentFilter.callback) : items),
    [items, currentFilter],
  );
  const { containerStyle, itemListStyle, itemStyle, fillerItemStyle, emptyStyle } =
    useInspectionGalleryStyles();
  const fillerCount = useItemListFillers(filteredItems.length);
  const emptyLabel = useInspectionGalleryEmptyLabel({
    captureMode: props.captureMode,
    isFilterActive: currentFilter !== null,
  });

  const handleItemClick = (item: InspectionGalleryItem) => {
    if (item.isAddDamage && props.captureMode) {
      props.onNavigateToCapture?.({ reason: NavigateToCaptureReason.ADD_DAMAGE });
    } else if (!item.isAddDamage && !item.isTaken && props.captureMode) {
      props.onNavigateToCapture?.({
        reason: NavigateToCaptureReason.CAPTURE_SIGHT,
        sightId: item.sightId,
      });
    } else if (!item.isAddDamage && item.isTaken) {
      setSelectedImage(item.image);
    }
  };

  const handleRetakeImage = (image: Image | null) => {
    if (props.captureMode && image?.sightId) {
      props.onNavigateToCapture?.({
        reason: NavigateToCaptureReason.RETAKE_PICTURE,
        sightId: image.sightId,
      });
    } else if (props.captureMode && image?.type === ImageType.CLOSE_UP) {
      props.onNavigateToCapture?.({
        reason: NavigateToCaptureReason.ADD_DAMAGE,
      });
    }
  };

  const imageDetailedviewCaptureProps = props.captureMode
    ? {
        captureMode: true,
        showCaptureButton: true,
        onNavigateToCapture: () =>
          props.onNavigateToCapture?.({ reason: NavigateToCaptureReason.NONE }),
        onRetake: () => handleRetakeImage(selectedImage),
      }
    : { captureMode: false };

  if (selectedImage) {
    return (
      <ImageDetailedView
        lang={props.lang}
        image={selectedImage}
        showGalleryButton={true}
        onClose={() => setSelectedImage(null)}
        onNavigateToGallery={() => setSelectedImage(null)}
        {...imageDetailedviewCaptureProps}
      />
    );
  }

  return (
    <div style={containerStyle}>
      <InspectionGalleryTopBar
        items={items}
        currentFilter={currentFilter}
        onUpdateFilter={(filter) => setCurrentFilter((c) => (c === filter ? null : filter))}
        showBackButton={props.showBackButton}
        onBack={props.onBack}
        captureMode={props.captureMode}
        onValidate={props.onValidate}
        allowSkipRetake={props.captureMode && !!props.allowSkipRetake}
        validateButtonLabel={props.validateButtonLabel}
      />
      <div style={itemListStyle}>
        {filteredItems.length === 0 && <div style={emptyStyle}>{emptyLabel}</div>}
        {filteredItems.map((item) => (
          <div style={itemStyle} key={getItemKey(item)}>
            <InspectionGalleryItemCard
              item={item}
              captureMode={props.captureMode}
              onClick={() => handleItemClick(item)}
            />
          </div>
        ))}
        {filteredItems.length > 0 &&
          Array.from(Array(fillerCount).keys()).map((key) => (
            <div style={fillerItemStyle} key={key} />
          ))}
      </div>
    </div>
  );
}, i18nInspectionGallery);
