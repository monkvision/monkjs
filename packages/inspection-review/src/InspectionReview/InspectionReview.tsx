import { MonkProvider, useI18nSync } from '@monkvision/common';
import { useTranslation } from 'react-i18next';
import { styles } from './InspectionReview.styles';
import { MonkApiConfig } from '@monkvision/network';
import { InspectionInfo } from './InspectionInfo';
import { Shortcuts } from './Shortcuts';
import { Tabs } from './Tabs';
import { DocumentActions } from './DocumentActions';
import { ReviewGallery } from './ReviewGallery';

/**
 * Props accepted by the InspectionReview component.
 */
export type InspectionReviewProps = {
  /**
   * The ID of the inspection to review.
   */
  inspectionId: string;
  /**
   * The api config used to communicate with the API. Make sure that the user described in the auth token is the same
   * one as the one that created the inspection provided in the `inspectionId` prop.
   */
  apiConfig: MonkApiConfig;
  /**
   * This prop can be used to specify the language to be used by the InspectionReview component.
   *
   * @default: en
   */
  lang?: string | null;
  /**
   * Additional information to display in the top left corner, apart from VIN number.
   * Maximum of 2 entries.
   *
   * @example
   *  {
   *    "License Plate": "ABC-1234",
   *    "Owner": "John Doe"
   *  }
   */
  additionalInfo?: Record<string, string | number>;
  /**
   * Enable or disable PDF generation feature in the document actions.
   *
   * @default true
   */
  isPDFGeneratorEnabled?: boolean;
  /**
   * TODO.
   */
  tabs?: string[];
  /**
   * Currency to be used for cost estimates.
   *
   * @default USD
   */
  currency?: string;
};

/**
 * The Inspection Review component provided by the Monk inspection-review package.
 */
export function InspectionReview({ lang }: InspectionReviewProps) {
  useI18nSync(lang);
  const { t } = useTranslation();

  return (
    <MonkProvider>
      <div style={styles['container']}>
        <p>{t('test')}</p>

        <div style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <InspectionInfo />
          <Shortcuts />
        </div>
        <div style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Tabs />
          <DocumentActions />
        </div>
        <div style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <div>Current tabs logic</div>
          <ReviewGallery />
        </div>
      </div>
    </MonkProvider>
  );
}
