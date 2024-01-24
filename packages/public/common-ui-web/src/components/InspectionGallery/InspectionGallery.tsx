import { useMemo } from 'react';
import { useMonkState, useObjectTranslation } from '@monkvision/common';
import { ImageType } from '@monkvision/types';
import { styles } from './InspectionGallery.styles';
import { useInspectionGallery } from './hooks';

/**
 * Props that can be passed to the Inspection Gallery component.
 */
export interface InspectionGalleryProps {
  inspectionID: string;
}

/**
 * Inspection Gallery component that can be used to display a gallery of pictures taken by the user for a given inspection
 */
export function InspectionGallery({ inspectionID }: InspectionGalleryProps) {
  const { state } = useMonkState();
  const { content, text } = useInspectionGallery();
  const { tObj } = useObjectTranslation();

  const inspectionPictures = useMemo(() => {
    if (!state.inspections.find((inspection) => inspection.id === inspectionID)) {
      return [];
    }
    return state.images.filter(
      (image) =>
        image.inspectionId === inspectionID &&
        [ImageType.BEAUTY_SHOT, ImageType.CLOSE_UP].includes(image.type),
    );
  }, [state]);

  function onShowModal() {
    // TODO: FullscreenModal component
    console.log(state);
  }

  return (
    <div style={styles['container']} data-testid='container'>
      {inspectionPictures.length === 0 ? (
        <div style={text} data-testid='no-picture'>
          There are no pictures in the inspection yet.
        </div>
      ) : (
        inspectionPictures.map((image, index) => (
          <div style={content} key={image.id} data-testid={`div-${index}`}>
            <div
              style={styles['imageContainer']}
              role='button'
              tabIndex={0}
              onClick={onShowModal}
              onKeyDown={() => {}}
            >
              <img
                style={styles['image']}
                src={image.path}
                alt={image.label ? tObj(image.label) : 'no label'}
                data-testid={`img-${index}`}
              />
            </div>
            <div style={text} data-testid={`label-${index}`}>
              {image.label ? tObj(image.label) : 'no label'}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
