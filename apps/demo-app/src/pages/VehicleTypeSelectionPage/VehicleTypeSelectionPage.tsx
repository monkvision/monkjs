import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { useMonkAppState } from '@monkvision/common';
import { CaptureWorkflow, SteeringWheelPosition } from '@monkvision/types';
import { VehicleType } from '@monkvision/types';
import {
  InspectionReviewHOC,
  PricingLevels,
  TabKeys,
  useInspectionReviewProvider,
} from '@monkvision/inspection-review';
import { Page } from '../pages';
import { Button, VehicleTypeSelection } from '@monkvision/common-ui-web';

function DocumentsView() {
  const { allGalleryItems, setCurrentGalleryItems } = useInspectionReviewProvider();
  return (
    <div>
      <p style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>Custom Documents</p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <Button onClick={() => setCurrentGalleryItems(allGalleryItems.slice(0, 6))}>
          Update gallery
        </Button>
        <Button onClick={() => setCurrentGalleryItems(allGalleryItems.slice(2, 8))}>
          Reset from here
        </Button>
      </div>
      <p>- Full control over the gallery items</p>
      <p>- Full control over Inspection updates: damages and pricings</p>
    </div>
  );
}

function OthersView() {
  const { allGalleryItems, setCurrentGalleryItems } = useInspectionReviewProvider();
  return (
    <div>
      <p>This is a custom Others view</p>
      <Button onClick={() => setCurrentGalleryItems(allGalleryItems.slice(0, 3))}>
        Update from Other
      </Button>
    </div>
  );
}

export function VehicleTypeSelectionPage() {
  const { config, vehicleType, authToken, inspectionId, setVehicleType } = useMonkAppState({
    requireWorkflow: CaptureWorkflow.PHOTO,
  });
  const { i18n } = useTranslation();

  if (vehicleType || !config.allowVehicleTypeSelection) {
    return <Navigate to={Page.PHOTO_CAPTURE} replace />;
  }

  // TODO Revert to original functionality
  return (
    <div style={{ padding: 20 }}>
      <InspectionReviewHOC
        apiConfig={{
          apiDomain: config.apiDomain,
          authToken: authToken as string,
          thumbnailDomain: config.thumbnailDomain,
        }}
        inspectionId={inspectionId as string}
        lang={i18n.language}
        steeringWheelPosition={SteeringWheelPosition.LEFT}
        vehicleType={VehicleType.SEDAN}
        sightsPerTab={{
          [TabKeys.Exterior]: [
            'haccord-8YjMcu0D',
            'haccord-Z84erkMb',
            'haccord-boMeNVsC',

            'haccord-EfRIciFr',
            'haccord-PGr3RzzP',
            'haccord-sorgeRJ7',
            'haccord-9fxMGSs6',

            'haccord-Jq65fyD4',
            'haccord-6kYUBv_e',

            'haccord-GdWvsqrm',
            'haccord-H_eRrLBl',

            'haccord-Qel0qUky',
            'haccord-_YnTubBA',
            'haccord-oiY_yPTR',
            'haccord-2a8VfA8m',
            'haccord-hsCc_Nct',
            'haccord-2v-2_QD5',
          ],
          [TabKeys.Interior]: [
            'all-qhKA2z',
            'all-e7663823',
            'all-mdwq0pl4',
            'all-11w-_e9c',

            'all-9cw4tn4s',
            'all-1pqg1sU3',
            'all-HWSQ9Svy',
            'all-Pj-K822I',
          ],
        }}
        additionalInfo={{
          'VIN': '1HGBH41JXMN109186',
          'License Plate': 'CUSTOM-PLATE',
          'Customer ID': '2026',
        }}
        customTabs={{
          Documents: {
            Component: DocumentsView,
            onActivate: ({ setCurrentGalleryItems, allGalleryItems }) => {
              setCurrentGalleryItems(allGalleryItems.slice(2, 8));
            },
          },
          Others: OthersView,
        }}
        pricings={{
          [PricingLevels.HIGH]: { color: 'purple', min: 600, max: 2000 },
          CustomOne: { color: 'orange', min: 2000, max: Infinity },
        }}
        onDownloadImages={(allGalleryItems) =>
          alert(`Downloading ${allGalleryItems.length} images within a custom function..`)
        }
        // isPDFGeneratorEnabled
        // onDownloadPDF={() => alert('Generating Custom PDF')}
      />
    </div>
  );

  // return (
  //   <VehicleTypeSelection
  //     onSelectVehicleType={setVehicleType}
  //     lang={i18n.language}
  //     inspectionId={inspectionId ?? ''}
  //     authToken={authToken ?? ''}
  //     apiDomain={config.apiDomain}
  //     thumbnailDomain={config.thumbnailDomain}
  //   />
  // );
}
