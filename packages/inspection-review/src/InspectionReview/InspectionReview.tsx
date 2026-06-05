import { i18nWrap, useI18nSync } from '@monkvision/common';
import { useTranslation } from 'react-i18next';
import { styles } from './InspectionReview.styles';
import { i18nInspectionReview } from '../i18n';

/**
 * Props accepted by the InspectionReview component.
 */
export type InspectionReviewProps = {
  /**
   * This prop can be used to specify the language to be used by the InspectionReview component.
   *
   * @default: en
   */
  lang?: string | null;
};

/**
 * The Inspection Review component provided by the Monk inspection-review package.
 */
export const InspectionReview = i18nWrap(function InspectionReview({
  lang,
}: InspectionReviewProps) {
  useI18nSync(lang);
  const { t } = useTranslation();

  return <div style={styles['container']}>{t('test')}</div>;
},
i18nInspectionReview);
