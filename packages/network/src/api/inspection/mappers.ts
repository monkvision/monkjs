import { MonkState } from '@monkvision/common';
import {
  CurrencyCode,
  CustomSeverityValue,
  Damage,
  DamageType,
  Image,
  ImageRegion,
  Inspection,
  MileageUnit,
  MonkEntityType,
  Part,
  PricingV2,
  PricingV2Details,
  PricingV2RelatedItemType,
  ProgressStatus,
  RenderedOutput,
  RepairOperation,
  RepairOperationType,
  Severity,
  SeverityResult,
  SeverityResultTargetType,
  Task,
  TaskName,
  Vehicle,
  VehiclePart,
  View,
  WheelAnalysis,
  WheelName,
} from '@monkvision/types';
import {
  ApiCommentSeverityValue,
  ApiImageRegion,
  ApiInspectionGet,
  ApiPartSeverityValue,
  ApiPricingV2Details,
  ApiRenderedOutput,
  ApiSeverityResult,
  ApiView,
} from '../models';
import { mapApiImage } from '../image/mappers';

function mapDamages(response: ApiInspectionGet): { damages: Damage[]; damageIds: string[] } {
  const damages: Damage[] = [];
  const damageIds: string[] = [];
  response.damages?.forEach((damage) => {
    damages.push({
      id: damage.id,
      entityType: MonkEntityType.DAMAGE,
      inspectionId: response.id,
      type: damage.damage_type as DamageType,
      size: damage.damage_size_cm,
      parts: damage.part_ids ?? [],
      relatedImages: damage.related_images?.map((relatedImage) => relatedImage.base_image_id) ?? [],
    });
    damageIds.push(damage.id);
  });
  return { damages, damageIds };
}

function mapRenderedOutput(renderedOutput: ApiRenderedOutput): RenderedOutput {
  return {
    id: renderedOutput.id,
    entityType: MonkEntityType.RENDERED_OUTPUT,
    baseImageId: renderedOutput.base_image_id,
    path: renderedOutput.path,
    additionalData: renderedOutput.additional_data,
  };
}

function mapImageRegion(imageRegion: ApiImageRegion): ImageRegion {
  return {
    specification: {
      boundingBox: imageRegion.specification?.bounding_box
        ? {
            xMin: imageRegion.specification.bounding_box.xmin,
            yMin: imageRegion.specification.bounding_box.ymin,
            width: imageRegion.specification.bounding_box.width,
            height: imageRegion.specification.bounding_box.height,
          }
        : undefined,
      polygons: imageRegion.specification?.polygons,
    },
  };
}

function mapView(view: ApiView): { view: View; renderedOutputs: RenderedOutput[] } {
  const renderedOutputs: RenderedOutput[] = [];
  const viewRenderedOutputs: string[] = [];

  view.rendered_outputs?.forEach((renderedOutput) => {
    viewRenderedOutputs.push(renderedOutput.id);
    renderedOutputs.push(mapRenderedOutput(renderedOutput));
  });

  return {
    view: {
      id: view.id,
      entityType: MonkEntityType.VIEW,
      elementId: view.element_id,
      imageRegion: mapImageRegion(view.image_region),
      renderedOutputs: viewRenderedOutputs,
    },
    renderedOutputs,
  };
}

function mapImages(response: ApiInspectionGet): {
  views: View[];
  renderedOutputs: RenderedOutput[];
  images: Image[];
  viewIds: string[];
  renderedOutputIds: string[];
  imageIds: string[];
} {
  const images: Image[] = [];
  const renderedOutputs: RenderedOutput[] = [];
  const views: View[] = [];
  const viewIds: string[] = [];
  const renderedOutputIds: string[] = [];
  const imageIds: string[] = [];

  response.images?.forEach((image) => {
    const imageRenderedOutputs: string[] = [];
    const imageViews: string[] = [];

    image.rendered_outputs?.forEach((renderedOutput) => {
      renderedOutputIds.push(renderedOutput.id);
      imageRenderedOutputs.push(renderedOutput.id);
      renderedOutputs.push(mapRenderedOutput(renderedOutput));
    });

    image.views?.forEach((apiView) => {
      const { view, renderedOutputs: viewRenderedOutputs } = mapView(apiView);
      viewIds.push(view.id);
      imageViews.push(view.id);
      views.push(view);
      renderedOutputs.push(...viewRenderedOutputs);
      renderedOutputIds.push(...view.renderedOutputs);
    });

    imageIds.push(image.id);
    images.push({
      ...mapApiImage(image, response.id),
      renderedOutputs: imageRenderedOutputs,
      views: imageViews,
    });
  });

  return {
    images,
    renderedOutputs,
    views,
    viewIds,
    renderedOutputIds,
    imageIds,
  };
}

function mapParts(response: ApiInspectionGet): { parts: Part[]; partIds: string[] } {
  const parts: Part[] = [];
  const partIds: string[] = [];

  response.parts?.forEach((part) => {
    partIds.push(part.id);
    parts.push({
      id: part.id,
      entityType: MonkEntityType.PART,
      inspectionId: response.id,
      type: part.part_type as VehiclePart,
      damages: part.damage_ids ?? [],
      relatedImages: part.related_images?.map((relatedImage) => relatedImage.base_image_id) ?? [],
    });
  });
  return { partIds, parts };
}

function mapPricingV2Details(
  apiPricingV2Details: ApiPricingV2Details | undefined,
  inspectionId: string,
): PricingV2Details {
  const details = apiPricingV2Details as ApiPricingV2Details;
  return {
    inspectionId,
    relatedItemType: details.related_item_type as PricingV2RelatedItemType,
    relatedItemId: details.related_item_id,
    pricing: details.pricing,
    operations: details.operations as RepairOperationType[] | undefined,
    hours: details.hours,
  };
}

function mapPricingV2(response: ApiInspectionGet): PricingV2 | undefined {
  if (!response.pricing) {
    return undefined;
  }
  return {
    details: response?.pricing.details
      ? Object.keys(response.pricing.details).reduce(
          (prev, curr) => ({
            ...prev,
            [curr]: mapPricingV2Details(response.pricing?.details[curr], response.id),
          }),
          {} as Record<string, PricingV2Details>,
        )
      : {},
    totalPrice: response.pricing.total_price,
  };
}

function mapSeverityResultRepairOperation(
  severityResult: ApiSeverityResult | undefined,
): RepairOperation | undefined {
  const partSeverity = severityResult as ApiPartSeverityValue | undefined;
  if (!partSeverity?.repair_operation) {
    return undefined;
  }
  return {
    t1: partSeverity.repair_operation.T1,
    t2: partSeverity.repair_operation.T2,
    paint: partSeverity.repair_operation.PAINT,
    replace: partSeverity.repair_operation.REPLACE,
    additional: partSeverity.repair_operation.ADDITIONAL,
  };
}

function mapSeverityResultValue(
  severityResult: ApiSeverityResult | undefined,
): CustomSeverityValue | undefined {
  if (!severityResult?.value?.custom_severity) {
    return undefined;
  }
  return {
    comment: (severityResult.value.custom_severity as ApiCommentSeverityValue).comment,
    level: (severityResult.value.custom_severity as ApiPartSeverityValue).level as Severity,
    pricing: severityResult.value.custom_severity.pricing,
    repairOperation: mapSeverityResultRepairOperation(severityResult),
  };
}

function mapSeverityResults(response: ApiInspectionGet): {
  severityResults: SeverityResult[];
  severityResultIds: string[];
} {
  const severityResults: SeverityResult[] = [];
  const severityResultIds: string[] = [];

  response.severity_results?.forEach((severityResult) => {
    severityResultIds.push(severityResult.id);
    severityResults.push({
      id: severityResult.id,
      inspectionId: response.id,
      entityType: MonkEntityType.SEVERITY_RESULT,
      label: severityResult.label as VehiclePart,
      isUserModified: severityResult.is_user_modified,
      relatedItemId: severityResult.related_item_id,
      relatedItemType: severityResult.related_item_type as SeverityResultTargetType | undefined,
      value: mapSeverityResultValue(severityResult),
    });
  });

  return { severityResultIds, severityResults };
}

function mapTasks(response: ApiInspectionGet): { tasks: Task[]; taskIds: string[] } {
  const tasks: Task[] = [];
  const taskIds: string[] = [];

  response.tasks?.forEach((task) => {
    taskIds.push(task.id);
    tasks.push({
      id: task.id,
      entityType: MonkEntityType.TASK,
      inspectionId: response.id,
      name: task.name as TaskName,
      status: task.status as ProgressStatus,
      images: task.images?.map((image) => image.image_id) ?? [],
    });
  });

  return { taskIds, tasks };
}

function mapVehicle(response: ApiInspectionGet): Vehicle | undefined {
  return response?.vehicle
    ? {
        id: response.vehicle.id,
        entityType: MonkEntityType.VEHICLE,
        brand: response.vehicle.brand,
        model: response.vehicle.model,
        plate: response.vehicle.plate,
        type: response.vehicle.type,
        mileageUnit: response.vehicle.mileage_unit as MileageUnit | undefined,
        mileageValue: response.vehicle.mileage_value,
        marketValueUnit: response.vehicle.market_value_unit as CurrencyCode | undefined,
        marketValue: response.vehicle.market_value_value,
        vin: response.vehicle.vin,
        color: response.vehicle.color,
        exteriorCleanliness: response.vehicle.exterior_cleanliness,
        interior_cleanliness: response.vehicle.interior_cleanliness,
        dateOfCirculation: response.vehicle.date_of_circulation,
        duplicateKeys: response.vehicle.duplicate_keys,
        expertiseRequested: response.vehicle.expertise_requested,
        carRegistration: response.vehicle.car_registration,
        vehicleQuotation: response.vehicle.vehicle_quotation,
        tradeInOffer: response.vehicle.trade_in_offer,
        ownerInfo: response.vehicle.owner_info,
        additionalData: response.vehicle.additional_data,
      }
    : undefined;
}

function mapWheelAnalysis(response: ApiInspectionGet): WheelAnalysis[] {
  return (
    response.wheel_analysis?.map((wheelAnalysis) => ({
      inspectionId: response.id,
      rimCondition: wheelAnalysis.rim_condition,
      rimMaterial: wheelAnalysis.rim_material,
      rimVisualAspect: wheelAnalysis.rim_visual_aspect,
      hubcapOverRim: wheelAnalysis.hubcap_over_rim,
      hubcapCondition: wheelAnalysis.hubcap_condition,
      hubcapVisualAspect: wheelAnalysis.hubcap_visual_aspect,
      imageId: wheelAnalysis.image_id,
      wheelName: wheelAnalysis.wheel_name as WheelName | undefined,
    })) ?? []
  );
}

function mapInspection(
  response: ApiInspectionGet,
  ids: {
    imageIds: string[];
    renderedOutputIds: string[];
    viewIds: string[];
    damageIds: string[];
    partIds: string[];
    severityResultIds: string[];
    taskIds: string[];
    vehicleId?: string;
  },
): Inspection {
  return {
    id: response.id,
    entityType: MonkEntityType.INSPECTION,
    tasks: ids.taskIds,
    images: ids.imageIds,
    damages: ids.damageIds,
    parts: ids.partIds,
    vehicle: ids.vehicleId,
    wheelAnalysis: mapWheelAnalysis(response),
    severityResults: ids.severityResultIds,
    pricing: mapPricingV2(response),
    additionalData: response.additional_data,
  };
}

export function mapApiInspectionGet(response: ApiInspectionGet): Partial<MonkState> {
  const { images, renderedOutputs, views, imageIds, renderedOutputIds, viewIds } =
    mapImages(response);
  const { damages, damageIds } = mapDamages(response);
  const { parts, partIds } = mapParts(response);
  const { severityResults, severityResultIds } = mapSeverityResults(response);
  const { tasks, taskIds } = mapTasks(response);
  const vehicle = mapVehicle(response);
  const inspection = mapInspection(response, {
    imageIds,
    renderedOutputIds,
    viewIds,
    damageIds,
    partIds,
    severityResultIds,
    taskIds,
  });

  return {
    damages,
    images,
    inspections: [inspection],
    parts,
    renderedOutputs,
    severityResults,
    tasks,
    vehicles: vehicle ? [vehicle] : [],
    views,
  };
}
