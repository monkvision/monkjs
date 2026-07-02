import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { ImageStatus, MonkE2eId } from '@monkvision/types';
import { InspectionGalleryItem, InspectionGalleryProps } from '../types';
import { useInspectionGalleryTopBarStyles } from './hooks';
import { Button } from '../../Button';
import { InspectionGalleryFilterPill } from './InspectionGalleryFilterPill';

export interface InspectionGalleryFilter {
  label: string;
  id?: string;
  callback: (item: InspectionGalleryItem) => boolean;
}

export type InspectionGalleryTopBarProps = Pick<
  InspectionGalleryProps,
  | 'showBackButton'
  | 'onBack'
  | 'captureMode'
  | 'onValidate'
  | 'validateButtonLabel'
  | 'isInspectionCompleted'
  | 'enableBeautyShotExtraction'
> & {
  items: InspectionGalleryItem[];
  currentFilter: InspectionGalleryFilter | null;
  allowSkipRetake: boolean;
  onUpdateFilter?: (filter: InspectionGalleryFilter | null) => void;
};

export const FILTERS: InspectionGalleryFilter[] = [
  {
    label: 'topBar.retakeFilter',
    id: MonkE2eId.GALLERY_FILTER_RETAKE,
    callback: (item) =>
      !item.isAddDamage &&
      item.isTaken &&
      [ImageStatus.UPLOAD_FAILED, ImageStatus.NOT_COMPLIANT].includes(item.image.status),
  },
  {
    label: 'topBar.approvedFilter',
    id: MonkE2eId.GALLERY_FILTER_APPROVED,
    callback: (item) =>
      !item.isAddDamage && item.isTaken && item.image.status === ImageStatus.SUCCESS,
  },
];

export const FILTERS_EXTRACT_BEAUTY_SHOTS: InspectionGalleryFilter[] = [
  {
    label: 'topBar.beautyShotsFilter',
    id: MonkE2eId.GALLERY_FILTER_BEAUTY_SHOTS,
    callback: (item) => !item.isAddDamage && item.isTaken && !!item.beautyShotCandidates,
  },
  {
    label: 'topBar.manualFilter',
    id: MonkE2eId.GALLERY_FILTER_MANUAL,
    callback: (item) => !item.isAddDamage && item.isTaken && !!item.image.additionalData?.sight_id,
  },
  {
    label: 'topBar.videoFilter',
    id: MonkE2eId.GALLERY_FILTER_VIDEO,
    callback: (item) =>
      !item.isAddDamage &&
      item.isTaken &&
      !item.beautyShotCandidates &&
      item.image.additionalData?.frame_index !== undefined,
  },
];

export function InspectionGalleryTopBar(props: InspectionGalleryTopBarProps) {
  const { t } = useTranslation();
  const { barStyle, leftContainerStyle, pillContainerStyle, backButtonStyle, titleStyle } =
    useInspectionGalleryTopBarStyles();

  const isSubmitAvailable = useMemo(
    () =>
      props.items.every(
        (item) =>
          item.isAddDamage ||
          (item.isTaken &&
            item.image.status === ImageStatus.NOT_COMPLIANT &&
            props.allowSkipRetake) ||
          (item.isTaken && item.image.status === ImageStatus.SUCCESS) ||
          (item.isTaken && item.image.additionalData?.frame_index !== undefined),
      ),
    [props.items, props.allowSkipRetake],
  );

  return (
    <div style={barStyle}>
      <div style={leftContainerStyle}>
        {props.showBackButton && (
          <Button
            onClick={props.onBack}
            variant='text'
            icon='arrow-back-ios'
            primaryColor='text-primary'
            shade='light'
            style={backButtonStyle}
          />
        )}
        <div style={titleStyle}>{t('topBar.title')}</div>
        {(props.captureMode || props.enableBeautyShotExtraction) && (
          <div style={pillContainerStyle}>
            {(props.enableBeautyShotExtraction ? FILTERS_EXTRACT_BEAUTY_SHOTS : FILTERS).map(
              (filter) => (
                <InspectionGalleryFilterPill
                  key={filter.label}
                  id={filter.id}
                  isSelected={props.currentFilter === filter}
                  label={t(filter.label)}
                  count={props.items.filter(filter.callback).length}
                  onClick={() => props.onUpdateFilter?.(filter)}
                />
              ),
            )}
          </div>
        )}
      </div>
      {props.isInspectionCompleted ? (
        <div style={titleStyle}>{t('topBar.completed')}</div>
      ) : (
        <Button
          disabled={!isSubmitAvailable}
          onClick={props.onValidate}
          data-e2e={MonkE2eId.GALLERY_SUBMIT}
        >
          {props.validateButtonLabel || t('topBar.submit')}
        </Button>
      )}
    </div>
  );
}
