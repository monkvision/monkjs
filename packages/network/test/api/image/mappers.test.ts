import { ApiImage } from '../../../src/api/models';
import { mapApiImage } from '../../../src/api/image/mappers';
import {
  ComplianceIssue,
  ImageStatus,
  ImageSubtype,
  ImageType,
  MonkEntityType,
} from '@monkvision/types';

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
];

const EXPECTED_COMPLIANCE_ISSUES_ORDER = [
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
      label: {
        en: 'test-label-en',
        fr: 'test-label-fr',
        de: 'test-label-de',
        nl: 'test-label-nl',
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
      const sightId = 'test-sight-id';
      const apiImage = createApiImage({ sightId });
      expect(mapApiImage(apiImage, inspectionId)).toEqual({
        id: apiImage.id,
        entityType: MonkEntityType.IMAGE,
        inspectionId,
        label: apiImage.additional_data?.label,
        path: apiImage.path,
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
        expect(mapApiImage(apiImage, '')).toEqual(
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
        expect(mapApiImage(apiImage, '', { enableCompliance: false })).toEqual(
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
          mapApiImage(apiImage, '', {
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
        expect(mapApiImage(apiImage, '', { enableCompliance: true })).toEqual(
          expect.objectContaining({
            status: ImageStatus.SUCCESS,
            complianceIssues: undefined,
          }),
        );
      });

      it('should return the status COMPLIANCE_RUNNING if compliance is not defined', () => {
        const apiImage = createApiImage();
        apiImage.compliances = undefined;
        expect(mapApiImage(apiImage, '', { enableCompliance: true })).toEqual(
          expect.objectContaining({
            status: ImageStatus.COMPLIANCE_RUNNING,
          }),
        );
      });

      it('should return the status SUCCESS if compliance is not defined but not enabled either', () => {
        const apiImage = createApiImage();
        apiImage.compliances = undefined;
        expect(mapApiImage(apiImage, '', { enableCompliance: false })).toEqual(
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
        expect(
          mapApiImage(apiImage, '', {
            enableCompliance: true,
            complianceIssues: [ComplianceIssue.UNDEREXPOSURE, ComplianceIssue.NOT_ZOOMED_ENOUGH],
          }),
        ).toEqual(
          expect.objectContaining({
            status: ImageStatus.NOT_COMPLIANT,
            complianceIssues: expect.arrayContaining([
              ComplianceIssue.UNDEREXPOSURE,
              ComplianceIssue.NOT_ZOOMED_ENOUGH,
            ]),
          }),
        );
      });

      it('should return the SUCCESS status if there are no issues left after filtering', () => {
        const apiImage = createApiImage();
        apiImage.compliances = {
          should_retake: true,
          compliance_issues: ['overexposure'],
        };
        expect(
          mapApiImage(apiImage, '', {
            enableCompliance: true,
            complianceIssues: [ComplianceIssue.UNDEREXPOSURE],
          }),
        ).toEqual(
          expect.objectContaining({
            status: ImageStatus.SUCCESS,
            complianceIssues: undefined,
          }),
        );
      });

      it('should properly filter out unwanted issues per sight', () => {
        const sightId = 'test-sight-id';
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
        expect(
          mapApiImage(apiImage, '', {
            enableCompliance: true,
            complianceIssues: Object.values(ComplianceIssue),
            complianceIssuesPerSight: {
              [sightId]: [ComplianceIssue.UNDEREXPOSURE, ComplianceIssue.NOT_ZOOMED_ENOUGH],
            },
          }),
        ).toEqual(
          expect.objectContaining({
            status: ImageStatus.NOT_COMPLIANT,
            complianceIssues: expect.arrayContaining([
              ComplianceIssue.UNDEREXPOSURE,
              ComplianceIssue.NOT_ZOOMED_ENOUGH,
            ]),
          }),
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
        expect(
          mapApiImage(apiImage, '', {
            enableCompliance: true,
            complianceIssues: [ComplianceIssue.UNDEREXPOSURE, ComplianceIssue.NOT_ZOOMED_ENOUGH],
            complianceIssuesPerSight: {
              'test-sight-2': Object.values(ComplianceIssue),
            },
          }),
        ).toEqual(
          expect.objectContaining({
            status: ImageStatus.NOT_COMPLIANT,
            complianceIssues: expect.arrayContaining([
              ComplianceIssue.UNDEREXPOSURE,
              ComplianceIssue.NOT_ZOOMED_ENOUGH,
            ]),
          }),
        );
      });

      it('should use the proper default compliance issues', () => {
        const apiImage = createApiImage();
        apiImage.compliances = {
          should_retake: true,
          compliance_issues: Object.values(ComplianceIssue),
        };
        expect(mapApiImage(apiImage, '', { enableCompliance: true })).toEqual(
          expect.objectContaining({
            status: ImageStatus.NOT_COMPLIANT,
            complianceIssues: expect.arrayContaining(EXPECTED_DEFAULT_COMPLIANCE_ISSUES),
          }),
        );
      });

      it('should properly sort the output compliance issues', () => {
        const apiImage = createApiImage();
        apiImage.compliances = {
          should_retake: true,
          compliance_issues: Object.values(ComplianceIssue),
        };
        expect(
          mapApiImage(apiImage, '', {
            enableCompliance: true,
            complianceIssues: Object.values(ComplianceIssue),
          }),
        ).toEqual(
          expect.objectContaining({
            status: ImageStatus.NOT_COMPLIANT,
            complianceIssues: EXPECTED_COMPLIANCE_ISSUES_ORDER,
          }),
        );
      });
    });
  });
});
