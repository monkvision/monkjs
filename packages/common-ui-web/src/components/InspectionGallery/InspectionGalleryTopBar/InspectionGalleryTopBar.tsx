import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { ImageStatus } from '@monkvision/types';
import { InspectionGalleryItem, InspectionGalleryProps } from '../types';
import { useInspectionGalleryTopBarStyles } from './hooks';
import { Button } from '../../Button';
import { InspectionGalleryFilterPill } from './InspectionGalleryFilterPill';

export interface InspectionGalleryFilter {
  label: string;
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
> & {
  items: InspectionGalleryItem[];
  currentFilter: InspectionGalleryFilter | null;
  allowSkipRetake: boolean;
  onUpdateFilter?: (filter: InspectionGalleryFilter | null) => void;
};

export const FILTERS: InspectionGalleryFilter[] = [
  {
    label: 'topBar.retakeFilter',
    callback: (item) =>
      !item.isAddDamage &&
      item.isTaken &&
      [ImageStatus.UPLOAD_FAILED, ImageStatus.NOT_COMPLIANT].includes(item.image.status),
  },
  {
    label: 'topBar.approvedFilter',
    callback: (item) =>
      !item.isAddDamage && item.isTaken && item.image.status === ImageStatus.SUCCESS,
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
          (item.isTaken && item.image.status === ImageStatus.SUCCESS),
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
        {props.captureMode && (
          <div style={pillContainerStyle}>
            {FILTERS.map((filter) => (
              <InspectionGalleryFilterPill
                key={filter.label}
                isSelected={props.currentFilter === filter}
                label={t(filter.label)}
                count={props.items.filter(filter.callback).length}
                onClick={() => props.onUpdateFilter?.(filter)}
              />
            ))}
          </div>
        )}
      </div>
      {props.isInspectionCompleted ? (
        <div style={titleStyle}>{t('topBar.completed')}</div>
      ) : (
        <Button disabled={!isSubmitAvailable} onClick={props.onValidate}>
          {props.validateButtonLabel || t('topBar.submit')}
        </Button>
      )}
    </div>
  );
}
