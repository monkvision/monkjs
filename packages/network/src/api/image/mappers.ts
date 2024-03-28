import {
  CentersOnElement,
  ComplianceIssue,
  ComplianceOptions,
  Image,
  ImageStatus,
  ImageSubtype,
  ImageType,
  MonkEntityType,
  VehiclePart,
} from '@monkvision/types';
import { ApiImage, ApiImageComplianceResults } from '../models';

const DEFAULT_COMPLIANCE_ISSUES = [
  // ComplianceIssue.OTHER,
  // ComplianceIssue.LOW_RESOLUTION,
  ComplianceIssue.BLURRINESS,
  ComplianceIssue.UNDEREXPOSURE,
  ComplianceIssue.OVEREXPOSURE,
  ComplianceIssue.LENS_FLARE,
  // ComplianceIssue.DIRTINESS,
  // ComplianceIssue.SNOWNESS,
  // ComplianceIssue.WETNESS,
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
  // ComplianceIssue.INTERIOR_NOT_SUPPORTED,
  ComplianceIssue.MISSING,
  // ComplianceIssue.LOW_QUALITY,
];

const DEFAULT_COMPLIANCE_OPTIONS: ComplianceOptions = {
  enableCompliance: true,
  complianceIssues: DEFAULT_COMPLIANCE_ISSUES,
};

function mapCompliance(
  complianceResult?: ApiImageComplianceResults,
  complianceOptions?: ComplianceOptions,
): {
  status: ImageStatus;
  complianceIssues?: ComplianceIssue[];
} {
  const options = {
    ...DEFAULT_COMPLIANCE_OPTIONS,
    ...(complianceOptions ?? {}),
  } as Required<ComplianceOptions>;
  if (!options.enableCompliance) {
    return { status: ImageStatus.SUCCESS };
  }
  if (!complianceResult) {
    return { status: ImageStatus.COMPLIANCE_RUNNING };
  }
  if (complianceResult.vehicle_analysis?.is_vehicle_present === false) {
    return { status: ImageStatus.NOT_COMPLIANT, complianceIssues: [ComplianceIssue.NO_VEHICLE] };
  }
  if (!complianceResult.should_retake) {
    return { status: ImageStatus.SUCCESS };
  }
  const filteredCompliances =
    (complianceResult.compliance_issues as ComplianceIssue[] | undefined)?.filter((issue) =>
      options.complianceIssues.includes(issue),
    ) ?? [];
  if (filteredCompliances.length > 0) {
    return { status: ImageStatus.NOT_COMPLIANT, complianceIssues: filteredCompliances };
  }
  return { status: ImageStatus.SUCCESS };
}

export function mapApiImage(
  image: ApiImage,
  inspectionId: string,
  complianceOptions?: ComplianceOptions,
): Image {
  const { status, complianceIssues } = mapCompliance(image.compliances, complianceOptions);
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
    status,
    complianceIssues,
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
    additionalData: image.additional_data,
    renderedOutputs: [],
    views: [],
  };
}
