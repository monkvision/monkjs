import { MonkState } from '@monkvision/common';
import {
  ComplianceOptions,
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
  VehicleType,
  View,
  WheelAnalysis,
  WheelName,
} from '@monkvision/types';
import {
  ApiCommentSeverityValue,
  ApiDamageDetectionTaskPostComponent,
  ApiHinlTaskPostComponent,
  ApiImageRegion,
  ApiImagesOCRTaskPostComponent,
  ApiInspectionGet,
  ApiInspectionPost,
  ApiPartSeverityValue,
  ApiPricingV2Details,
  ApiRenderedOutput,
  ApiSeverityResult,
  ApiTasksComponent,
  ApiView,
  ApiWheelAnalysisTaskPostComponent,
} from '../models';
import { mapApiImage } from '../image/mappers';
import { sdkVersion } from '../config';

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

function mapImages(
  response: ApiInspectionGet,
  complianceOptions?: ComplianceOptions,
): {
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
      ...mapApiImage(image, response.id, complianceOptions),
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

export function mapApiInspectionGet(
  response: ApiInspectionGet,
  complianceOptions?: ComplianceOptions,
): MonkState {
  const { images, renderedOutputs, views, imageIds, renderedOutputIds, viewIds } = mapImages(
    response,
    complianceOptions,
  );
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
    partOperations: [],
  };
}

/**
 * Options used to specify a callback that will be called by the API when a task is complete.
 */
export interface TaskCallbackOptions {
  /**
   * The URL of the callback.
   */
  url: string;
  /**
   * The headers of the request.
   */
  headers: Record<string, string>;
  /**
   * The parameters of the callback.
   */
  params?: Record<string, unknown>;
  /**
   * The event of the callback.
   */
  event?: string;
}

/**
 * Additional options that you can specify when adding the damage detection task to an inspection.
 */
export interface CreateDamageDetectionTaskOptions {
  /**
   * The name of the task : `TaskName.DAMAGE_DETECTION`.
   */
  name: TaskName.DAMAGE_DETECTION;
  /**
   * The confidence threshold between 0 and 1 for the damage detection to be triggered on AI results.
   *
   * @default 0.3
   */
  damageScoreThreshold?: number;
  /**
   * Boolean indicating if, in addition to the prediction outputs, the AI should also generate visual representations
   * of the damages detected. These representations will be available in the payload of the GET /inspections, where
   * the detected damages will be highlighted using polygons on top of the original pictures.
   *
   * @default false
   */
  generateDamageVisualOutput?: boolean;
  /**
   * Boolean indicating if, in addition to the prediction outputs, the AI should also generate cropped images focused
   * on each damage detected.
   *
   * @default true
   */
  generateSubimageDamages?: boolean;
  /**
   * Boolean indicating if, in addition to the prediction outputs, the AI should also generate cropped images focused
   * on each car part detected.
   *
   * @default false
   */
  generateSubimageParts?: boolean;
}

/**
 * Additional options that you can specify when adding the human in the loop task to an inspection.
 */
export interface CreateHinlTaskOptions {
  /**
   * The name of the task : `TaskName.HUMAN_IN_THE_LOOP`.
   */
  name: TaskName.HUMAN_IN_THE_LOOP;
  /**
   * The callbacks called at the end of the Human in the Loop task.
   */
  callbacks?: TaskCallbackOptions[];
}

/**
 * The tasks of the inspection to be created. It is either simply the name of the task to add, or an object with the
 * task name as well as additional configuration options for the task.
 */
export type InspectionCreateTask =
  | TaskName
  | CreateDamageDetectionTaskOptions
  | CreateHinlTaskOptions;

/**
 * Options that can be specified when creating a new inspection.
 */
export interface CreateInspectionOptions {
  /**
   * The tasks to add to the inspection. It is an array of either simply the name of the tasks to add, or an object with
   * the tasks name as well as additional configuration options for the task.
   */
  tasks: InspectionCreateTask[];
  /**
   * Additional details about the vehicle of the inspection (vehicle type, VIN etc.).
   */
  vehicleType?: VehicleType;
  /**
   * Boolean indicating if the API should generate dynamic crops or not.
   *
   * @default true
   */
  useDynamicCrops?: boolean;
}

function getHumanInTheLoopOptions(
  options: CreateInspectionOptions,
): ApiHinlTaskPostComponent | undefined {
  if (options.tasks.includes(TaskName.HUMAN_IN_THE_LOOP)) {
    return { status: ProgressStatus.NOT_STARTED };
  }
  const taskOptions = options.tasks.find(
    (task) => typeof task === 'object' && task.name === TaskName.HUMAN_IN_THE_LOOP,
  ) as CreateHinlTaskOptions | undefined;
  return taskOptions
    ? {
        status: ProgressStatus.NOT_STARTED,
        callbacks: taskOptions.callbacks,
      }
    : undefined;
}

function getDamageDetectionOptions(
  options: CreateInspectionOptions,
): ApiDamageDetectionTaskPostComponent | undefined {
  if (options.tasks.includes(TaskName.DAMAGE_DETECTION)) {
    return {
      status: ProgressStatus.NOT_STARTED,
      damage_score_threshold: 0.3,
      generate_subimages_parts: {
        generate_tight: false,
      },
      generate_visual_output: {
        generate_damages: true,
      },
    };
  }
  const taskOptions = options.tasks.find(
    (task) => typeof task === 'object' && task.name === TaskName.DAMAGE_DETECTION,
  ) as CreateDamageDetectionTaskOptions | undefined;
  return taskOptions
    ? {
        status: ProgressStatus.NOT_STARTED,
        damage_score_threshold: taskOptions.damageScoreThreshold,

        generate_visual_output: {
          generate_damages: taskOptions.generateDamageVisualOutput,
        },
        generate_subimages_damages: taskOptions.generateSubimageDamages ? {} : undefined,
        generate_subimages_parts: taskOptions.generateSubimageParts
          ? { generate_tight: false }
          : undefined,
      }
    : undefined;
}

function getWheelAnalysisOptions(
  options: CreateInspectionOptions,
): ApiWheelAnalysisTaskPostComponent | undefined {
  return options.tasks.includes(TaskName.WHEEL_ANALYSIS)
    ? {
        status: ProgressStatus.NOT_STARTED,
        use_longshots: true,
      }
    : undefined;
}

function getImagesOCROptions(
  options: CreateInspectionOptions,
): ApiImagesOCRTaskPostComponent | undefined {
  return options.tasks.includes(TaskName.IMAGES_OCR)
    ? {
        status: ProgressStatus.NOT_STARTED,
      }
    : undefined;
}

function getTasksOptions(options: CreateInspectionOptions): ApiTasksComponent {
  return {
    damage_detection: getDamageDetectionOptions(options),
    wheel_analysis: getWheelAnalysisOptions(options),
    images_ocr: getImagesOCROptions(options),
    human_in_the_loop: getHumanInTheLoopOptions(options),
  };
}

export function mapApiInspectionPost(options: CreateInspectionOptions): ApiInspectionPost {
  return {
    tasks: getTasksOptions(options),
    vehicle: options.vehicleType ? { vehicle_type: options.vehicleType } : undefined,
    damage_severity: { output_format: 'toyota' },
    additional_data: {
      user_agent: navigator.userAgent,
      connection: navigator.connection,
      monk_sdk_version: sdkVersion,
      damage_detection_version: 'v2',
      use_dynamic_crops: options.useDynamicCrops ?? true,
    },
  };
}
