import { i18nWrap, useI18nSync, useMonkState } from '@monkvision/common';
import { useMemo, useState } from 'react';
import { Image, ImageType, Viewpoint } from '@monkvision/types';
import { useMonkApi } from '@monkvision/network';
import {
  InspectionGalleryItem,
  InspectionGalleryProps,
  NavigateToCaptureReason,
  BeautyShotCandidates,
} from './types';
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
  if (item.beautyShotCandidates) {
    return item.beautyShotCandidates.view;
  }
  return item.image.id;
}

/**
 * This component is used to display a gallery of pictures taken during an inspection. If this component is used
 * mid-capture, set the `captureMode` prop to `true` so that you'll enable features such as compliance errors, retakes
 * etc.
 */
export const InspectionGallery = i18nWrap(function InspectionGallery(
  props: InspectionGalleryProps,
) {
  useI18nSync(props.lang);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [selectedBeautyShotCandidates, setSelectedBeautyShotCandidates] =
    useState<BeautyShotCandidates | null>(null);
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
  const { state } = useMonkState();
  const { updateAdditionalData } = useMonkApi(props.apiConfig);

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
      if (item.beautyShotCandidates?.candidates) {
        setSelectedBeautyShotCandidates(item.beautyShotCandidates);
      }
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

  const handleValidateNewBeautyShot = (image: Image, view: Viewpoint) => {
    try {
      updateAdditionalData({
        id: props.inspectionId,
        callback: () => {
          const addData = state.inspections.find(
            (inspection) => inspection.id === props.inspectionId,
          )?.additionalData?.['beauty_shots'] as Record<Viewpoint, string>;
          return { beauty_shots: { ...addData, [view]: image.id } };
        },
      });
    } catch (error) {
      console.error('Failed to update beauty shot:', error);
    }
  };

  const handleCloseImageDetailedView = () => {
    setSelectedImage(null);
    setSelectedBeautyShotCandidates(null);
  };

  const imageDetailedViewCaptureProps = props.captureMode
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
        view={selectedBeautyShotCandidates?.view}
        alternativeImages={selectedBeautyShotCandidates?.candidates}
        showGalleryButton={true}
        onClose={handleCloseImageDetailedView}
        onNavigateToGallery={handleCloseImageDetailedView}
        onValidateAlternative={handleValidateNewBeautyShot}
        {...imageDetailedViewCaptureProps}
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
        isInspectionCompleted={props.isInspectionCompleted}
        enableBeautyShotExtraction={props.enableBeautyShotExtraction}
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
},
i18nInspectionGallery);
