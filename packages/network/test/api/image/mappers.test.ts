import { ApiImage, ApiImageAnalysis, ApiVehicleAnalysis } from '../../../src/api/models';
import { mapApiImage } from '../../../src/api/image/mappers';
import {
  ComplianceIssue,
  ImageStatus,
  ImageSubtype,
  ImageType,
  MonkEntityType,
} from '@monkvision/types';
import { getThumbnailUrl } from '../../../src/api/utils';

const EXPECTED_DEFAULT_COMPLIANCE_ISSUES = [
  ComplianceIssue.BLURRINESS,
  ComplianceIssue.UNDEREXPOSURE,
  ComplianceIssue.OVEREXPOSURE,
  ComplianceIssue.LENS_FLARE,
  ComplianceIssue.REFLECTIONS,
  ComplianceIssue.UNKNOWN_SIGHT,
  ComplianceIssue.UNKNOWN_VIEWPOINT,
  ComplianceIssue.NO_VEHICLE,
  ComplianceIssue.WRONG_ANGLE,
  ComplianceIssue.WRONG_CENTER_PART,
  ComplianceIssue.MISSING_PARTS,
  ComplianceIssue.HIDDEN_PARTS,
  ComplianceIssue.TOO_ZOOMED,
  ComplianceIssue.NOT_ZOOMED_ENOUGH,
  ComplianceIssue.MISSING,
  ComplianceIssue.PORTRAIT_IMAGE,
];

const EXPECTED_COMPLIANCE_ISSUES_ORDER = [
  ComplianceIssue.PORTRAIT_IMAGE,
  ComplianceIssue.NO_VEHICLE,
  ComplianceIssue.BLURRINESS,
  ComplianceIssue.OVEREXPOSURE,
  ComplianceIssue.UNDEREXPOSURE,
  ComplianceIssue.LENS_FLARE,
  ComplianceIssue.TOO_ZOOMED,
  ComplianceIssue.NOT_ZOOMED_ENOUGH,
  ComplianceIssue.WRONG_ANGLE,
  ComplianceIssue.HIDDEN_PARTS,
  ComplianceIssue.MISSING_PARTS,
  ComplianceIssue.WRONG_CENTER_PART,
  ComplianceIssue.REFLECTIONS,
  ComplianceIssue.SNOWNESS,
  ComplianceIssue.WETNESS,
  ComplianceIssue.DIRTINESS,
  ComplianceIssue.LOW_QUALITY,
  ComplianceIssue.LOW_RESOLUTION,
  ComplianceIssue.UNKNOWN_SIGHT,
  ComplianceIssue.UNKNOWN_VIEWPOINT,
  ComplianceIssue.INTERIOR_NOT_SUPPORTED,
  ComplianceIssue.MISSING,
  ComplianceIssue.OTHER,
];

function createApiImage(params?: { sightId?: string }): ApiImage {
  return {
    additional_data: {
      sight_id: params?.sightId,
      created_at: '2032-04-10T11:33:03.987Z',
      label: {
        en: 'test-label-en',
        fr: 'test-label-fr',
        de: 'test-label-de',
        nl: 'test-label-nl',
        it: 'test-label-it',
      },
    },
    binary_size: 123456,
    compliances: {
      should_retake: false,
    },
    detailed_viewpoint: {
      centers_on: ['door_back_left', 'fender_front_right'],
      distance: 'test-distance-test',
      is_exterior: true,
    },
    has_vehicle: true,
    id: 'test-id-test',
    image_height: 1223,
    image_type: 'beauty_shot',
    image_subtype: 'close_up_damage',
    image_sibling_key: 'test-sibling-key',
    image_width: 4321,
    mimetype: 'image/jpeg',
    name: 'test-name-test',
    path: 'test-path-test',
    viewpoint: {
      prediction: 'test-viewpoint-test',
      confidence: 0.987,
    },
  };
}

describe('Image API Mappers', () => {
  describe('ApiImage mapper', () => {
    it('should properly map the basic image fields', () => {
      const inspectionId = 'test-inspection-test';
      const thumbnailDomain = 'test-thumbnail-domain';
      const sightId = 'test-sight-id';
      const apiImage = createApiImage({ sightId });
      const thumbnailUrl = getThumbnailUrl(thumbnailDomain, apiImage.path, {
        width: apiImage.image_width,
        height: apiImage.image_height,
      });
      expect(mapApiImage(apiImage, inspectionId, thumbnailDomain)).toEqual({
        id: apiImage.id,
        sightId: apiImage.additional_data?.sight_id,
        createdAt: Date.parse(apiImage.additional_data?.created_at ?? ''),
        entityType: MonkEntityType.IMAGE,
        inspectionId,
        label: apiImage.additional_data?.label,
        path: apiImage.path,
        thumbnailPath: thumbnailUrl,
        width: apiImage.image_width,
        height: apiImage.image_height,
        size: apiImage.binary_size,
        mimetype: apiImage.mimetype,
        type: apiImage.image_type as ImageType,
        subtype: apiImage.image_subtype as ImageSubtype | undefined,
        status: expect.any(String),
        complianceIssues: undefined,
        siblingKey: apiImage.image_sibling_key,
        viewpoint: apiImage.viewpoint,
        detailedViewpoint: {
          isExterior: apiImage.detailed_viewpoint?.is_exterior,
          distance: apiImage.detailed_viewpoint?.distance,
          centersOn: apiImage.detailed_viewpoint?.centers_on,
        },
        additionalData: apiImage.additional_data,
        renderedOutputs: [],
        views: [],
      });
    });

    describe('Compliance mapper', () => {
      it('should enable the compliance by default and return the proper compliance issues', () => {
        const apiImage = createApiImage();
        apiImage.compliances = {
          should_retake: true,
          compliance_issues: ['overexposure'],
        };
        expect(mapApiImage(apiImage, '', '')).toEqual(
          expect.objectContaining({
            status: ImageStatus.NOT_COMPLIANT,
            complianceIssues: [ComplianceIssue.OVEREXPOSURE],
          }),
        );
      });

      it('should return the SUCCESS status if enableCompliance is false', () => {
        const apiImage = createApiImage();
        apiImage.compliances = {
          should_retake: true,
          compliance_issues: ['overexposure'],
        };
        expect(mapApiImage(apiImage, '', '', { enableCompliance: false })).toEqual(
          expect.objectContaining({
            status: ImageStatus.SUCCESS,
            complianceIssues: undefined,
          }),
        );
      });

      it('should return the SUCCESS status if the compliance is not enabled for the given sight', () => {
        const apiImage = createApiImage({ sightId: 'test-sight-1' });
        apiImage.compliances = {
          should_retake: true,
          compliance_issues: ['overexposure'],
        };
        expect(
          mapApiImage(apiImage, '', '', {
            enableCompliance: true,
            enableCompliancePerSight: ['test-sight-2'],
          }),
        ).toEqual(
          expect.objectContaining({
            status: ImageStatus.SUCCESS,
            complianceIssues: undefined,
          }),
        );
      });

      it('should return the status SUCCESS if compliance is enabled but there are no issues', () => {
        const apiImage = createApiImage();
        apiImage.compliances = {
          should_retake: false,
          compliance_issues: [],
        };
        expect(mapApiImage(apiImage, '', '', { enableCompliance: true })).toEqual(
          expect.objectContaining({
            status: ImageStatus.SUCCESS,
            complianceIssues: undefined,
          }),
        );
      });

      it('should return the status COMPLIANCE_RUNNING if compliance is not defined', () => {
        const apiImage = createApiImage();
        apiImage.compliances = undefined;
        expect(mapApiImage(apiImage, '', '', { enableCompliance: true })).toEqual(
          expect.objectContaining({
            status: ImageStatus.COMPLIANCE_RUNNING,
          }),
        );
      });

      it('should return the status SUCCESS if compliance is not defined but not enabled either', () => {
        const apiImage = createApiImage();
        apiImage.compliances = undefined;
        expect(mapApiImage(apiImage, '', '', { enableCompliance: false })).toEqual(
          expect.objectContaining({
            status: ImageStatus.SUCCESS,
          }),
        );
      });

      it('should properly filter out unwanted issues', () => {
        const apiImage = createApiImage();
        apiImage.compliances = {
          should_retake: true,
          compliance_issues: [
            'overexposure',
            'underexposure',
            'unknown_viewpoint',
            'not_zoomed_enough',
          ],
        };
        const result = mapApiImage(apiImage, '', '', {
          enableCompliance: true,
          complianceIssues: [ComplianceIssue.UNDEREXPOSURE, ComplianceIssue.NOT_ZOOMED_ENOUGH],
        });
        expect(result.status).toEqual(ImageStatus.NOT_COMPLIANT);
        expect(result.complianceIssues?.sort()).toEqual(
          [ComplianceIssue.UNDEREXPOSURE, ComplianceIssue.NOT_ZOOMED_ENOUGH].sort(),
        );
      });

      it('should return the SUCCESS status if there are no issues left after filtering', () => {
        const apiImage = createApiImage();
        apiImage.compliances = {
          should_retake: true,
          compliance_issues: ['overexposure'],
        };
        const result = mapApiImage(apiImage, '', '', {
          enableCompliance: true,
          complianceIssues: [ComplianceIssue.UNDEREXPOSURE],
        });
        expect(result.status).toEqual(ImageStatus.SUCCESS);
        expect(result.complianceIssues).toBeUndefined();
      });

      it('should properly filter out unwanted issues per sight', () => {
        const sightId = 'test-sight-id';
        const apiImage = createApiImage({ sightId });
        apiImage.compliances = {
          should_retake: true,
          compliance_issues: [
            'overexposure',
            'underexposure',
            'unknown_viewpoint',
            'not_zoomed_enough',
          ],
        };
        const result = mapApiImage(apiImage, '', '', {
          enableCompliance: true,
          complianceIssues: Object.values(ComplianceIssue),
          complianceIssuesPerSight: {
            [sightId]: [ComplianceIssue.UNDEREXPOSURE, ComplianceIssue.NOT_ZOOMED_ENOUGH],
          },
        });
        expect(result.status).toEqual(ImageStatus.NOT_COMPLIANT);
        expect(result.complianceIssues?.sort()).toEqual(
          [ComplianceIssue.UNDEREXPOSURE, ComplianceIssue.NOT_ZOOMED_ENOUGH].sort(),
        );
      });

      it('should default out to the global complianceIssues if the sight is not in the complianceIssuesPerSight map', () => {
        const apiImage = createApiImage({ sightId: 'test-sight-1' });
        apiImage.compliances = {
          should_retake: true,
          compliance_issues: [
            'overexposure',
            'underexposure',
            'unknown_viewpoint',
            'not_zoomed_enough',
          ],
        };
        const result = mapApiImage(apiImage, '', '', {
          enableCompliance: true,
          complianceIssues: [ComplianceIssue.UNDEREXPOSURE, ComplianceIssue.NOT_ZOOMED_ENOUGH],
          complianceIssuesPerSight: {
            'test-sight-2': Object.values(ComplianceIssue),
          },
        });
        expect(result.status).toEqual(ImageStatus.NOT_COMPLIANT);
        expect(result.complianceIssues?.sort()).toEqual(
          [ComplianceIssue.UNDEREXPOSURE, ComplianceIssue.NOT_ZOOMED_ENOUGH].sort(),
        );
      });

      it('should use the proper default compliance issues', () => {
        const apiImage = createApiImage();
        apiImage.compliances = {
          should_retake: true,
          compliance_issues: Object.values(ComplianceIssue),
        };
        const result = mapApiImage(apiImage, '', '', { enableCompliance: true });
        expect(result.status).toEqual(ImageStatus.NOT_COMPLIANT);
        expect(result.complianceIssues?.sort()).toEqual(EXPECTED_DEFAULT_COMPLIANCE_ISSUES.sort());
      });

      it('should properly sort the output compliance issues', () => {
        const apiImage = createApiImage();
        apiImage.compliances = {
          should_retake: true,
          compliance_issues: Object.values(ComplianceIssue),
        };
        const result = mapApiImage(apiImage, '', '', {
          enableCompliance: true,
          complianceIssues: Object.values(ComplianceIssue),
        });
        expect(result.status).toEqual(ImageStatus.NOT_COMPLIANT);
        expect(result.complianceIssues).toEqual(EXPECTED_COMPLIANCE_ISSUES_ORDER);
      });

      it('should properly apply custom compliances', () => {
        const apiImage = createApiImage();
        apiImage.image_height = 2000;
        apiImage.image_width = 500;

        const result = mapApiImage(apiImage, '', '', { enableCompliance: true });
        console.log('result:', result);

        expect(result.status).toEqual(ImageStatus.NOT_COMPLIANT);
      });

      it('should properly apply custom thresholds', () => {
        const apiImage = createApiImage();
        apiImage.compliances = {
          should_retake: true,
          compliance_issues: ['blurriness', 'overexposure', 'wetness', 'snowness'],
          image_analysis: {
            blurriness: 0.6,
            overexposure: 0.35,
            underexposure: 0.6,
            lens_flare: 0.89,
          } as ApiImageAnalysis,
          vehicle_analysis: {
            wetness: 0.11,
            snowness: 0.57,
            dirtiness: 0.33,
            reflections: 0.86,
          } as ApiVehicleAnalysis,
        };
        const result = mapApiImage(apiImage, '', '', {
          enableCompliance: true,
          complianceIssues: Object.values(ComplianceIssue),
          customComplianceThresholds: {
            blurriness: 0.5,
            overexposure: 0.349,
            underexposure: 0.61,
            lensFlare: 0.99,
            wetness: 0.05,
            snowness: 0.2,
            dirtiness: 0.9,
            reflections: 0.99,
          },
        });
        expect(result.status).toEqual(ImageStatus.NOT_COMPLIANT);
        expect(result.complianceIssues?.sort()).toEqual(
          [
            ComplianceIssue.UNDEREXPOSURE,
            ComplianceIssue.LENS_FLARE,
            ComplianceIssue.DIRTINESS,
            ComplianceIssue.REFLECTIONS,
          ].sort(),
        );
      });

      it('should properly apply custom thresholds for the zoom level', () => {
        const apiImage = createApiImage();
        apiImage.compliances = {
          should_retake: true,
          compliance_issues: ['too_zoomed', 'underexposure'],
          image_analysis: { zoom: 0.6 } as ApiImageAnalysis,
        };
        let result = mapApiImage(apiImage, '', '', {
          enableCompliance: true,
          complianceIssues: Object.values(ComplianceIssue),
          customComplianceThresholds: {
            zoom: { min: 0.3, max: 0.5 },
          },
        });
        expect(result.status).toEqual(ImageStatus.NOT_COMPLIANT);
        expect(result.complianceIssues?.sort()).toEqual(
          [ComplianceIssue.NOT_ZOOMED_ENOUGH, ComplianceIssue.UNDEREXPOSURE].sort(),
        );

        apiImage.compliances = {
          should_retake: true,
          compliance_issues: ['not_zoomed_enough', 'overexposure'],
          image_analysis: { zoom: 0.6 } as ApiImageAnalysis,
        };
        result = mapApiImage(apiImage, '', '', {
          enableCompliance: true,
          complianceIssues: Object.values(ComplianceIssue),
          customComplianceThresholds: {
            zoom: { min: 0.7, max: 0.9 },
          },
        });
        expect(result.status).toEqual(ImageStatus.NOT_COMPLIANT);
        expect(result.complianceIssues?.sort()).toEqual(
          [ComplianceIssue.TOO_ZOOMED, ComplianceIssue.OVEREXPOSURE].sort(),
        );

        apiImage.compliances = {
          should_retake: true,
          compliance_issues: ['not_zoomed_enough'],
          image_analysis: { zoom: 0.3 } as ApiImageAnalysis,
        };
        result = mapApiImage(apiImage, '', '', {
          enableCompliance: true,
          complianceIssues: Object.values(ComplianceIssue),
          customComplianceThresholds: {
            zoom: { min: 0.2, max: 0.4 },
          },
        });
        expect(result.status).toEqual(ImageStatus.SUCCESS);
        expect(result.complianceIssues).toBeUndefined();
      });

      it('should properly apply custom thresholds per sight', () => {
        const sightId = 'test-sight-id-test';
        const apiImage = createApiImage({ sightId });
        apiImage.compliances = {
          should_retake: true,
          compliance_issues: ['blurriness', 'snowness'],
          image_analysis: {
            blurriness: 0.9,
            overexposure: 0.7,
          } as ApiImageAnalysis,
          vehicle_analysis: {
            snowness: 0.22,
            dirtiness: 0.1,
          } as ApiVehicleAnalysis,
        };
        const result = mapApiImage(apiImage, '', '', {
          enableCompliance: true,
          complianceIssues: Object.values(ComplianceIssue),
          customComplianceThresholds: {
            blurriness: 0.99,
            overexposure: 0.5,
            snowness: 0.5,
            dirtiness: 0.05,
          },
          customComplianceThresholdsPerSight: {
            [sightId]: {
              blurriness: 0.5,
              overexposure: 0.8,
              snowness: 0.1,
              dirtiness: 0.5,
            },
          },
        });
        expect(result.status).toEqual(ImageStatus.NOT_COMPLIANT);
        expect(result.complianceIssues?.sort()).toEqual(
          [ComplianceIssue.OVEREXPOSURE, ComplianceIssue.DIRTINESS].sort(),
        );
      });
    });
  });
});
