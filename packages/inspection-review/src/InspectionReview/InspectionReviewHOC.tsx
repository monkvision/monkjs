import { i18nWrap, MonkProvider, useI18nSync } from '@monkvision/common';
import { i18nInspectionReview } from '../i18n';
import { InspectionReview } from './InspectionReview';
import { InspectionReviewProps } from './types';
import { InspectionReviewProvider } from './hooks/InspectionReviewProvider';

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
 *     <InspectionReviewHOC
 *       inspectionId={inspectionId}
 *       apiConfig={apiConfig}
 *       lang={i18n.language}
 *       steeringWheelPosition={SteeringWheelPosition.LEFT}
 *       unmatchedSightsTab={TabKeys.EXTERIOR}
 *       vehicleTypes={[VehicleType.SUV]}
 *       sights={{
 *          [VehicleType.SUV]: [
 *           'jgc21-QIvfeg0X',
 *           'jgc21-KyUUVU2P',
 *        ],
 *      }}
 *     />
 *   );
 * }
 */
export const InspectionReviewHOC = i18nWrap(function InspectionReviewHOC({
  currency = '$',
  ...props
}: InspectionReviewProps) {
  useI18nSync(props.lang);

  return (
    <MonkProvider>
      <InspectionReviewProvider currency={currency} {...props}>
        <InspectionReview currency={currency} {...props} />
      </InspectionReviewProvider>
    </MonkProvider>
  );
},
i18nInspectionReview);
