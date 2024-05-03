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

const COMPLIANCE_ISSUES_PRIORITY = [
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

const DEFAULT_COMPLIANCE_OPTIONS = {
  enableCompliance: true,
  complianceIssues: DEFAULT_COMPLIANCE_ISSUES,
};

function filterCompliances(
  issues: string[] | undefined,
  validIssues: ComplianceIssue[],
): ComplianceIssue[] {
  return (
    (issues as ComplianceIssue[] | undefined)?.filter((issue) => validIssues.includes(issue)) ?? []
  );
}

function compareComplianceIssues(a: ComplianceIssue, b: ComplianceIssue): number {
  return COMPLIANCE_ISSUES_PRIORITY.indexOf(a) - COMPLIANCE_ISSUES_PRIORITY.indexOf(b);
}

function mapCompliance(
  sightId?: string,
  complianceResult?: ApiImageComplianceResults,
  complianceOptions?: ComplianceOptions,
): {
  status: ImageStatus;
  complianceIssues?: ComplianceIssue[];
} {
  const enableComplianceGlobal =
    complianceOptions?.enableCompliance ?? DEFAULT_COMPLIANCE_OPTIONS.enableCompliance;
  const enableCompliance =
    sightId && complianceOptions?.enableCompliancePerSight
      ? complianceOptions.enableCompliancePerSight.includes(sightId)
      : enableComplianceGlobal;
  const complianceIssuesGlobal =
    complianceOptions?.complianceIssues ?? DEFAULT_COMPLIANCE_OPTIONS.complianceIssues;
  const complianceIssues =
    sightId && complianceOptions?.complianceIssuesPerSight?.[sightId]
      ? complianceOptions.complianceIssuesPerSight[sightId]
      : complianceIssuesGlobal;
  if (!enableCompliance) {
    return { status: ImageStatus.SUCCESS };
  }
  if (!complianceResult) {
    return { status: ImageStatus.COMPLIANCE_RUNNING };
  }
  if (!complianceResult.should_retake) {
    return { status: ImageStatus.SUCCESS };
  }
  const filteredCompliances = filterCompliances(
    complianceResult.compliance_issues,
    complianceIssues,
  );
  if (filteredCompliances.length === 0) {
    return { status: ImageStatus.SUCCESS };
  }
  return {
    status: ImageStatus.NOT_COMPLIANT,
    complianceIssues: filteredCompliances.sort(compareComplianceIssues),
  };
}

export function mapApiImage(
  image: ApiImage,
  inspectionId: string,
  complianceOptions?: ComplianceOptions,
): Image {
  const { status, complianceIssues } = mapCompliance(
    image.additional_data?.sight_id,
    image.compliances,
    complianceOptions,
  );
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
