import { i18nWrap, MonkProvider, useI18nSync } from '@monkvision/common';
import { i18nInspectionReview } from '../i18n';
import { InspectionReview, InspectionReviewProps } from './InspectionReview';
import { InspectionReviewState } from './hooks/InspectionReviewProvider';

/**
 * The InspectionReview component is a ready-to-use, single page component that implements an Inspection Review app,
 * allowing users to review inspection data. In order to use this component, you first need to generate an Auth0
 * authentication token, the inspection ID to review, the api config (with the auth token) and everything will be
 * handled automatically for you.
 *
 * @example
 * import { InspectionReview } from '@monkvision/inspection-review';
 *
 * export function InspectionReviewScreen({ inspectionId, apiConfig }: InspectionReviewScreenProps) {
 *   const { i18n } = useTranslation();
 *
 *   return (
 *     <InspectionReview
 *       inspectionId={inspectionId}
 *       apiConfig={apiConfig}
 *       lang={i18n.language}
 *     />
 *   );
 * }
 */
export const InspectionReviewHOC = i18nWrap(function InspectionReviewHOC(
  props: InspectionReviewProps,
) {
  useI18nSync(props.lang);

  return (
    <MonkProvider>
      <InspectionReviewState inspectionId={props.inspectionId}>
        <InspectionReview {...props} />
      </InspectionReviewState>
    </MonkProvider>
  );
},
i18nInspectionReview);
