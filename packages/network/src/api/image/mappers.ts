import {
  CentersOnElement,
  COMPLIANCE_ISSUES_PRIORITY,
  ComplianceIssue,
  ComplianceOptions,
  CustomComplianceThresholds,
  DEFAULT_COMPLIANCE_ISSUES,
  Image,
  ImageStatus,
  ImageSubtype,
  ImageType,
  MonkEntityType,
  VehiclePart,
} from '@monkvision/types';
import { ApiImage, ApiImageComplianceResults } from '../models';
import { getThumbnailUrl } from '../utils';

const DEFAULT_COMPLIANCE_OPTIONS = {
  enableCompliance: true,
  complianceIssues: DEFAULT_COMPLIANCE_ISSUES,
};

function getActiveComplianceOptions(
  sightId?: string,
  complianceOptions?: ComplianceOptions,
): {
  enableCompliance: boolean;
  complianceIssues: ComplianceIssue[];
  customComplianceThresholds?: CustomComplianceThresholds;
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
  const customComplianceThresholds = sightId
    ? complianceOptions?.customComplianceThresholdsPerSight?.[sightId]
    : complianceOptions?.customComplianceThresholds;
  return { enableCompliance, complianceIssues, customComplianceThresholds };
}

function getComplianceIssue(
  thresholdName: keyof CustomComplianceThresholds,
): ComplianceIssue | undefined {
  switch (thresholdName) {
    case 'blurriness':
      return ComplianceIssue.BLURRINESS;
    case 'overexposure':
      return ComplianceIssue.OVEREXPOSURE;
    case 'underexposure':
      return ComplianceIssue.UNDEREXPOSURE;
    case 'lensFlare':
      return ComplianceIssue.LENS_FLARE;
    case 'wetness':
      return ComplianceIssue.WETNESS;
    case 'snowness':
      return ComplianceIssue.SNOWNESS;
    case 'dirtiness':
      return ComplianceIssue.DIRTINESS;
    case 'reflections':
      return ComplianceIssue.REFLECTIONS;
    default:
      return undefined;
  }
}

function getComplianceScore(
  thresholdName: keyof CustomComplianceThresholds,
  complianceResult?: ApiImageComplianceResults,
): number | undefined {
  switch (thresholdName) {
    case 'blurriness':
      return complianceResult?.image_analysis?.blurriness;
    case 'overexposure':
      return complianceResult?.image_analysis?.overexposure;
    case 'underexposure':
      return complianceResult?.image_analysis?.underexposure;
    case 'lensFlare':
      return complianceResult?.image_analysis?.lens_flare;
    case 'wetness':
      return complianceResult?.vehicle_analysis?.wetness;
    case 'snowness':
      return complianceResult?.vehicle_analysis?.snowness;
    case 'dirtiness':
      return complianceResult?.vehicle_analysis?.dirtiness;
    case 'reflections':
      return complianceResult?.vehicle_analysis?.reflections;
    case 'zoom':
      return complianceResult?.image_analysis?.zoom;
    default:
      return undefined;
  }
}

function applyCustomComplianceThresholds(
  issues: string[] | undefined,
  complianceResult: ApiImageComplianceResults,
  customComplianceThresholds?: CustomComplianceThresholds,
): string[] {
  let complianceIssues = issues ?? [];
  if (!customComplianceThresholds) {
    return complianceIssues;
  }
  Object.keys(customComplianceThresholds).forEach((key) => {
    const thresholdName = key as keyof CustomComplianceThresholds;
    const complianceScore = getComplianceScore(thresholdName, complianceResult);
    if (thresholdName === 'zoom' && complianceScore && customComplianceThresholds.zoom) {
      complianceIssues = (complianceIssues as ComplianceIssue[]).filter(
        (issue) => ![ComplianceIssue.TOO_ZOOMED, ComplianceIssue.NOT_ZOOMED_ENOUGH].includes(issue),
      );
      if (complianceScore < customComplianceThresholds.zoom.min) {
        complianceIssues.push(ComplianceIssue.TOO_ZOOMED);
      } else if (complianceScore > customComplianceThresholds.zoom.max) {
        complianceIssues.push(ComplianceIssue.NOT_ZOOMED_ENOUGH);
      }
      return;
    }
    const customThreshold = customComplianceThresholds[thresholdName];
    const complianceIssue = getComplianceIssue(thresholdName);
    if (complianceScore && complianceIssue && customThreshold !== undefined) {
      complianceIssues = complianceIssues.filter((issue) => issue !== complianceIssue);
      if (complianceScore < customThreshold) {
        complianceIssues.push(complianceIssue);
      }
    }
  });
  return complianceIssues;
}

function filterCompliances(issues: string[], validIssues: ComplianceIssue[]): ComplianceIssue[] {
  return (issues as ComplianceIssue[]).filter((issue) => validIssues.includes(issue));
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
  const { enableCompliance, complianceIssues, customComplianceThresholds } =
    getActiveComplianceOptions(sightId, complianceOptions);
  if (!enableCompliance) {
    return { status: ImageStatus.SUCCESS };
  }
  if (!complianceResult) {
    return { status: ImageStatus.COMPLIANCE_RUNNING };
  }
  const newIssuesAfterCustomThresholds = applyCustomComplianceThresholds(
    complianceResult.compliance_issues,
    complianceResult,
    customComplianceThresholds,
  );
  const filteredCompliances = filterCompliances(newIssuesAfterCustomThresholds, complianceIssues);
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
  thumbnailDomain: string,
  complianceOptions?: ComplianceOptions,
): Image {
  const sightId = image.additional_data?.sight_id;
  const { status, complianceIssues } = mapCompliance(sightId, image.compliances, complianceOptions);
  return {
    id: image.id,
    entityType: MonkEntityType.IMAGE,
    inspectionId,
    label: image.additional_data?.label,
    sightId,
    createdAt: image.additional_data?.created_at
      ? Date.parse(image.additional_data.created_at)
      : undefined,
    path: image.path,
    thumbnailPath: getThumbnailUrl(thumbnailDomain, image.path, {
      height: image.image_height,
      width: image.image_width,
    }),
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
    odometer: image.odometer?.value,
    warningLights: image.warning_lights?.activated_warning_lights,
  };
}
