import { i18nWrap, MonkProvider, useI18nSync, useLoadingState } from '@monkvision/common';
import { i18nInspectionReview } from '../i18n';
import { InspectionReview, InspectionReviewProps } from './InspectionReview';
import { InspectionReviewState } from './hooks/InspectionReviewProvider';

// TODO: Props to receive:
// a single steering wheel direction
// a list of vehicle type
//  each vehicle has a list of sights ordered
//  any sight in the inspection that doesn't match the above list of sights, should go into a specific Tab, decided by the user (mandatory prop)

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
  const loading = useLoadingState(true);
  useI18nSync(props.lang);

  return (
    <MonkProvider>
      <InspectionReviewState
        inspectionId={props.inspectionId}
        apiConfig={props.apiConfig}
        loading={loading}
      >
        <InspectionReview {...props} />
      </InspectionReviewState>
    </MonkProvider>
  );
},
i18nInspectionReview);
