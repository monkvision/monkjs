import {
  CentersOnElement,
  ComplianceResult,
  ComplianceResults,
  Image,
  ImageSubtype,
  ImageType,
  MonkEntityType,
  ProgressStatus,
  VehiclePart,
} from '@monkvision/types';
import { ApiComplianceResultBase, ApiImage, ApiImageComplianceResults } from '../models';

function mapBaseComplianceResult(result: ApiComplianceResultBase): ComplianceResult {
  return {
    status: result.status as ProgressStatus,
    isCompliant: result.is_compliant,
    reasons: result.reasons,
  };
}

function mapApiImageComplianceResults(
  compliances: ApiImageComplianceResults | undefined,
): ComplianceResults | undefined {
  if (!compliances) {
    return undefined;
  }
  return {
    imageQualityAssessment: compliances.image_quality_assessment
      ? {
          ...mapBaseComplianceResult(compliances.image_quality_assessment),
          details: compliances.image_quality_assessment.details
            ? {
                blurrinessScore: compliances.image_quality_assessment.details.blurriness_score,
                underexposureScore:
                  compliances.image_quality_assessment.details.underexposure_score,
                overexposureScore: compliances.image_quality_assessment.details.overexposure_score,
              }
            : undefined,
        }
      : undefined,
    coverage360: compliances.coverage_360
      ? mapBaseComplianceResult(compliances.coverage_360)
      : undefined,
    zoomLevel: compliances.zoom_level
      ? {
          ...mapBaseComplianceResult(compliances.zoom_level),
          details: compliances.zoom_level.details
            ? { zoomScore: compliances.zoom_level.details.zoom_score }
            : undefined,
        }
      : undefined,
  };
}

export function mapApiImage(image: ApiImage, inspectionId: string): Image {
  return {
    id: image.id,
    entityType: MonkEntityType.IMAGE,
    inspectionId,
    label: image.additional_data?.label,
    path: image.path,
    width: image.image_width,
    height: image.image_height,
    size: image.binary_size,
    mimetype: image.mimetype,
    type: image.image_type as ImageType,
    subtype: image.image_subtype as ImageSubtype | undefined,
    siblingKey: image.image_sibling_key,
    viewpoint: image.viewpoint,
    detailedViewpoint: image.detailed_viewpoint
      ? {
          isExterior: image.detailed_viewpoint.is_exterior,
          distance: image.detailed_viewpoint.distance,
          centersOn: image.detailed_viewpoint.centers_on as
            | (VehiclePart | CentersOnElement)[]
            | undefined,
        }
      : undefined,
    compliances: mapApiImageComplianceResults(image.compliances),
    additionalData: image.additional_data,
    renderedOutputs: [],
    views: [],
  };
}
