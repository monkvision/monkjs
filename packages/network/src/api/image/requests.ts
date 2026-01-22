import ky from 'ky';
import { Dispatch } from 'react';
import {
  getFileExtensions,
  MonkActionType,
  MonkCreatedOneImageAction,
  vehiclePartLabels,
  MonkDeletedOneImageAction,
} from '@monkvision/common';
import {
  ComplianceOptions,
  Image,
  ImageAdditionalData,
  ImageStatus,
  ImageSubtype,
  ImageType,
  MonkEntityType,
  MonkPicture,
  ProgressStatus,
  TaskName,
  TranslationObject,
  VehiclePart,
} from '@monkvision/types';
import { v4 } from 'uuid';
import { labels, sights } from '@monkvision/sights';
import { getDefaultOptions, MonkApiConfig } from '../config';
import {
  ApiCenterOnElement,
  ApiIdColumn,
  ApiImage,
  ApiImagePost,
  ApiImagePostTask,
} from '../models';
import { MonkApiResponse } from '../types';
import { mapApiImage } from './mappers';

/**
 * The different upload types for inspection images.
 */
export enum ImageUploadType {
  /**
   * Upload type corresponding to a sight image in the PhotoCapture process (beauty shot image).
   */
  BEAUTY_SHOT = 'beauty_shot',
  /**
   * Upload type corresponding to a close-up picture (add-damage) in the PhotoCapture process, when using the 2-shot
   * add damage workflow.
   */
  CLOSE_UP_2_SHOT = 'close_up_2_shot',
  /**
   * Upload type corresponding to a close-up picture (add-damage) in the PhotoCapture process, when using the
   * part-select-shot add damage workflow.
   */
  PART_SELECT_SHOT = 'part_select_shot',
  /**
   * Upload type corresponding to a video frame in the VideoCapture process.
   */
  VIDEO_FRAME = 'video_frame',
  /**
   * Upload type corresponding to a manual photo in the VideoCapture process.
   */
  VIDEO_MANUAL_PHOTO = 'video_manual_photo',
}

/**
 * Options specififed when adding a beauty shot (normal "sight" image) to an inspection.
 */
export interface AddBeautyShotImageOptions {
  /**
   * The type of the image upload : `ImageUploadType.BEAUTY_SHOT`;
   */
  uploadType: ImageUploadType.BEAUTY_SHOT;
  /**
   * The picture to add to the inspection.
   */
  picture: MonkPicture;
  /**
   * The ID of the inspection to add the image to.
   */
  inspectionId: string;
  /**
   * The ID of the sight of the image.
   */
  sightId: string;
  /**
   * The list of tasks to run for this image.
   */
  tasks: TaskName[];
  /**
   * Boolean indicating if a thumbnail request will be sent when addImage is called.
   */
  useThumbnailCaching?: boolean;
  /**
   * Additional options used to configure the compliance locally.
   */
  compliance?: ComplianceOptions;

  wheelAnalysisCloseUp?: boolean;
}

/**
 * Options specififed when adding a close up (an "add damage" image) to an inspection using the 2-shot process.
 */
export interface Add2ShotCloseUpImageOptions {
  /**
   * The type of the image upload : `ImageUploadType.CLOSE_UP_2_SHOT`;
   */
  uploadType: ImageUploadType.CLOSE_UP_2_SHOT;
  /**
   * The picture to add to the inspection.
   */
  picture: MonkPicture;
  /**
   * The ID of the inspection to add the image to.
   */
  inspectionId: string;
  /**
   * This parameter is used to link two close up pictures together. In the 2-shot process, you first upload a zoomed-out
   * picture of the damage, and then a close-up zoomed picture. In order to link these two pictures together, you need
   * to specify the same `siblingKey` parameter when uploading them. This key must be unique per pair of pictures in the
   * same inspection.
   */
  siblingKey: string;
  /**
   * Boolean indicating if this picture is the first picture or the second picture of the 2-shot process.
   */
  firstShot: boolean;
  /**
   * Boolean indicating if a thumbnail request will be sent when addImage is called.
   */
  useThumbnailCaching?: boolean;
  /**
   * Additional options used to configure the compliance locally.
   */
  compliance?: ComplianceOptions;
}

/**
 * Options specified when adding a close up (an "add damage" image) to an inspection using the part select process.
 */
export interface AddPartSelectCloseUpImageOptions {
  /**
   * The type of the image upload : `ImageUploadType.PART_SELECT_SHOT`;
   */
  uploadType: ImageUploadType.PART_SELECT_SHOT;
  /**
   * The picture to add to the inspection.
   */
  picture: MonkPicture;
  /**
   * The ID of the inspection to add the image to.
   */
  inspectionId: string;
  /**
   * List of damage parts chosen by User with part selected wireframe
   */
  vehicleParts: VehiclePart[];
  /**
   * Boolean indicating if a thumbnail request will be sent when addImage is called.
   */
  useThumbnailCaching?: boolean;
  /**
   * Additional options used to configure the compliance locally.
   */
  compliance?: ComplianceOptions;
}

/**
 * Options specififed when adding a video frame to a VideoCapture inspection.
 */
export interface AddVideoFrameOptions {
  /**
   * The type of the image upload : `ImageUploadType.VIDEO_FRAME`;
   */
  uploadType: ImageUploadType.VIDEO_FRAME;
  /**
   * The picture to add to the inspection.
   */
  picture: MonkPicture;
  /**
   * The ID of the inspection to add the video frame to.
   */
  inspectionId: string;
  /**
   * The index of the frame in the video. This index starts at 0 and increases by 1 for each video frame uploaded.
   */
  frameIndex: number;
  /**
   * The duration (in milliseconds) between this video frame capture time and the previous one. For the first frame of
   * the video, this value is equal to 0.
   */
  timestamp: number;
}

/**
 * Options specififed when adding a manual video photo to a VideoCapture inspection.
 */
export interface AddVideoManualPhotoOptions {
  /**
   * The type of the image upload : `ImageUploadType.VIDEO_MANUAL_PHOTO`;
   */
  uploadType: ImageUploadType.VIDEO_MANUAL_PHOTO;
  /**
   * The picture to add to the inspection.
   */
  picture: MonkPicture;
  /**
   * The ID of the inspection to add the video frame to.
   */
  inspectionId: string;
}
/**
 * Union type describing the different options that can be specified when adding a picture to an inspection.
 */
export type AddImageOptions =
  | AddBeautyShotImageOptions
  | Add2ShotCloseUpImageOptions
  | AddVideoFrameOptions
  | AddVideoManualPhotoOptions
  | AddPartSelectCloseUpImageOptions;

interface AddImageData {
  filename: string;
  body: ApiImagePost;
}

function getImageType(options: AddImageOptions): ImageType {
  if (
    [ImageUploadType.CLOSE_UP_2_SHOT, ImageUploadType.PART_SELECT_SHOT].includes(options.uploadType)
  ) {
    return ImageType.CLOSE_UP;
  }
  return ImageType.BEAUTY_SHOT;
}

function getImageLabel(options: AddImageOptions): TranslationObject | undefined {
  if (options.uploadType === ImageUploadType.BEAUTY_SHOT) {
    return sights[options.sightId] ? labels[sights[options.sightId].label] : undefined;
  }
  if (options.uploadType === ImageUploadType.VIDEO_FRAME) {
    return {
      en: `Video Frame ${options.frameIndex}`,
      sv: `Videoram ${options.frameIndex}`,
      es: `Fotograma de video ${options.frameIndex}`,
      pt: `Fotograma de vídeo ${options.frameIndex}`,
      fr: `Trame Vidéo ${options.frameIndex}`,
      de: `Videobild ${options.frameIndex}`,
      nl: `Videoframe ${options.frameIndex}`,
      it: `Frame Video ${options.frameIndex}`,
    };
  }
  if (options.uploadType === ImageUploadType.VIDEO_MANUAL_PHOTO) {
    return {
      en: `Video Manual Photo`,
      sv: `Manuellt foto från video`,
      es: `Foto manual del video`,
      pt: `Foto manual do vídeo`,
      fr: `Photo Manuelle Vidéo`,
      de: `Foto Manuell Video`,
      nl: `Foto-handleiding Video`,
      it: `Foto Manuale Video`,
    };
  }
  if (options.uploadType === ImageUploadType.PART_SELECT_SHOT) {
    const partsTranslation = options.vehicleParts.map((part) => vehiclePartLabels[part]);
    return {
      en: `Close Up on ${partsTranslation.map((part) => part.en).join(', ')}`,
      sv: `Närbild på ${partsTranslation.map((part) => part.sv).join(', ')}`,
      es: `Primer plano de ${partsTranslation.map((part) => part.es).join(', ')}`,
      pt: `Plano Aproximado de ${partsTranslation.map((part) => part.pt).join(', ')}`,
      fr: `Photo Zoomée sur ${partsTranslation.map((part) => part.en).join(', ')}`,
      de: `Gezoomtes an ${partsTranslation.map((part) => part.en).join(', ')}`,
      nl: `Nabij aan ${partsTranslation.map((part) => part.en).join(', ')}`,
      it: `Close Up su ${partsTranslation.map((part) => part.en).join(', ')}`,
    };
  }
  return {
    en: options.firstShot ? 'Close Up (part)' : 'Close Up (damage)',
    sv: options.firstShot ? 'Närbild (del)' : 'Närbild (skada)',
    es: options.firstShot ? 'Primer plano (parte)' : 'Primer plano (daño)',
    pt: options.firstShot ? 'Plano Aproximado (parte)' : 'Plano Aproximado (dano)',
    fr: options.firstShot ? 'Photo Zoomée (partie)' : 'Photo Zoomée (dégât)',
    de: options.firstShot ? 'Gezoomtes Foto (Teil)' : 'Close Up (Schaden)',
    nl: options.firstShot ? 'Nabij (onderdeel)' : 'Nabij (schade)',
    it: options.firstShot ? 'Close Up (parte)' : 'Close Up (danno)',
  };
}

function getAdditionalData(options: AddImageOptions): ImageAdditionalData {
  const additionalData: ImageAdditionalData = {
    label: getImageLabel(options),
    created_at: new Date().toISOString(),
  };
  if (options.uploadType === ImageUploadType.BEAUTY_SHOT) {
    additionalData.sight_id = options.sightId;
  }
  if (options.uploadType === ImageUploadType.VIDEO_FRAME) {
    additionalData.frame_index = options.frameIndex;
    additionalData.timestamp = options.timestamp;
  }
  return additionalData;
}

const MULTIPART_KEY_IMAGE = 'image';
const MULTIPART_KEY_JSON = 'json';

function createBeautyShotImageData(
  options: AddBeautyShotImageOptions,
  filetype: string,
): AddImageData {
  const filename = `${options.sightId}-${options.inspectionId}-${Date.now()}.${filetype}`;
  const tasks = options.tasks.filter(
    (task) =>
      ![
        TaskName.COMPLIANCES,
        TaskName.HUMAN_IN_THE_LOOP,
        TaskName.IMAGES_OCR,
        TaskName.ODOMETER,
        TaskName.WARNING_LIGHTS,
        TaskName.WHEEL_ANALYSIS,
      ].includes(task),
  ) as ApiImagePostTask[];
  tasks.push({
    name: TaskName.COMPLIANCES,
    image_details: { sight_id: options.sightId },
    wait_for_result: options.compliance?.enableCompliance && options.compliance?.useLiveCompliance,
  });

  if (options.tasks.includes(TaskName.HUMAN_IN_THE_LOOP)) {
    tasks.push({
      name: TaskName.HUMAN_IN_THE_LOOP,
      image_details: { sight_label: sights[options.sightId].label },
    });
  }
  if (options.tasks.includes(TaskName.IMAGES_OCR)) {
    tasks.push({
      name: TaskName.IMAGES_OCR,
      image_details: { image_type: 'VIN' },
    });
  }
  if (options.tasks.includes(TaskName.ODOMETER)) {
    tasks.push({
      name: TaskName.ODOMETER,
      wait_for_result: true,
    });
  }
  if (options.tasks.includes(TaskName.WARNING_LIGHTS)) {
    tasks.push({
      name: TaskName.WARNING_LIGHTS,
      wait_for_result: true,
    });
  }
  if (options.tasks.includes(TaskName.WHEEL_ANALYSIS)) {
    const sightName = sights[options.sightId].wheelName;
    if (options.wheelAnalysisCloseUp && !sightName) {
      throw new Error('Wheel analysis task close-up requires a sight name.');
    }
    if (sightName) {
      tasks.push({
        name: TaskName.WHEEL_ANALYSIS,
        image_details: { wheel_name: sightName },
      });
    } else {
      tasks.push(TaskName.WHEEL_ANALYSIS);
    }
  }

  const body: ApiImagePost = {
    acquisition: {
      strategy: 'upload_multipart_form_keys',
      file_key: MULTIPART_KEY_IMAGE,
    },
    image_type: ImageType.BEAUTY_SHOT,
    tasks,
    additional_data: getAdditionalData(options),
  };

  return { filename, body };
}

function create2ShotCloseUpImageData(
  options: Add2ShotCloseUpImageOptions,
  filetype: string,
): AddImageData {
  const prefix = options.firstShot ? 'closeup-part' : 'closeup-damage';
  const filename = `${prefix}-${options.inspectionId}-${Date.now()}.${filetype}`;

  const body: ApiImagePost = {
    acquisition: {
      strategy: 'upload_multipart_form_keys',
      file_key: MULTIPART_KEY_IMAGE,
    },
    image_type: ImageType.CLOSE_UP,
    image_subtype: options.firstShot ? ImageSubtype.CLOSE_UP_PART : ImageSubtype.CLOSE_UP_DAMAGE,
    image_sibling_key: options.siblingKey,
    tasks: [
      TaskName.DAMAGE_DETECTION,
      {
        name: TaskName.COMPLIANCES,
        wait_for_result:
          options.compliance?.enableCompliance && options.compliance?.useLiveCompliance,
      },
    ],
    additional_data: getAdditionalData(options),
  };

  return { filename, body };
}

function createPartSelectCloseUpImageData(
  options: AddPartSelectCloseUpImageOptions,
  filetype: string,
): AddImageData {
  const filename = `part-select-${options.inspectionId}-${Date.now()}.${filetype}`;

  const body: ApiImagePost = {
    acquisition: {
      strategy: 'upload_multipart_form_keys',
      file_key: MULTIPART_KEY_IMAGE,
    },
    image_type: ImageType.CLOSE_UP,
    tasks: [
      TaskName.DAMAGE_DETECTION,
      {
        name: TaskName.COMPLIANCES,
        wait_for_result:
          options.compliance?.enableCompliance && options.compliance?.useLiveCompliance,
      },
    ],
    detailed_viewpoint: {
      centers_on: options.vehicleParts as ApiCenterOnElement[],
    },
    additional_data: getAdditionalData(options),
  };

  return { filename, body };
}

function createVideoFrameData(options: AddVideoFrameOptions, filetype: string): AddImageData {
  const filename = `video-frame-${options.frameIndex}.${filetype}`;

  const body: ApiImagePost = {
    acquisition: {
      strategy: 'upload_multipart_form_keys',
      file_key: MULTIPART_KEY_IMAGE,
    },
    tasks: [TaskName.DAMAGE_DETECTION],
    additional_data: getAdditionalData(options),
  };

  return { filename, body };
}

function createVideoManualPhotoData(
  options: AddVideoManualPhotoOptions,
  filetype: string,
): AddImageData {
  const filename = `video-manual-photo-${Date.now()}.${filetype}`;

  const body: ApiImagePost = {
    acquisition: {
      strategy: 'upload_multipart_form_keys',
      file_key: MULTIPART_KEY_IMAGE,
    },
    tasks: [TaskName.DAMAGE_DETECTION],
    additional_data: getAdditionalData(options),
  };

  return { filename, body };
}

function getAddImageData(options: AddImageOptions, filetype: string): AddImageData {
  switch (options.uploadType) {
    case ImageUploadType.BEAUTY_SHOT:
      return createBeautyShotImageData(options, filetype);
    case ImageUploadType.CLOSE_UP_2_SHOT:
      return create2ShotCloseUpImageData(options, filetype);
    case ImageUploadType.PART_SELECT_SHOT:
      return createPartSelectCloseUpImageData(options, filetype);
    case ImageUploadType.VIDEO_FRAME:
      return createVideoFrameData(options, filetype);
    case ImageUploadType.VIDEO_MANUAL_PHOTO:
      return createVideoManualPhotoData(options, filetype);
    default:
      throw new Error('Unknown image upload type.');
  }
}

async function createImageFormData(options: AddImageOptions): Promise<FormData> {
  const extensions = getFileExtensions(options.picture.mimetype);
  if (!extensions) {
    throw new Error(`Unknown picture mimetype : ${options.picture.mimetype}`);
  }
  const filetype = extensions[0];

  const { filename, body } = getAddImageData(options, filetype);

  const file = new File([options.picture.blob], filename, { type: filetype });

  const data = new FormData();
  data.append(MULTIPART_KEY_JSON, JSON.stringify(body));
  data.append(MULTIPART_KEY_IMAGE, file);

  return data;
}

function createLocalImage(options: AddImageOptions): Image {
  const additionalData = getAdditionalData(options);
  const image: Image = {
    entityType: MonkEntityType.IMAGE,
    id: v4(),
    inspectionId: options.inspectionId,
    path: options.picture.uri,
    thumbnailPath: options.picture.uri,
    width: options.picture.width,
    height: options.picture.height,
    size: -1,
    mimetype: options.picture.mimetype,
    type: getImageType(options),
    status: ImageStatus.UPLOADING,
    label: getImageLabel(options),
    additionalData,
    sightId: additionalData.sight_id,
    createdAt: additionalData.created_at ? Date.parse(additionalData.created_at) : undefined,
    views: [],
    renderedOutputs: [],
  };
  if (options.uploadType === ImageUploadType.CLOSE_UP_2_SHOT) {
    image.siblingKey = options.siblingKey;
    image.subtype = options.firstShot ? ImageSubtype.CLOSE_UP_PART : ImageSubtype.CLOSE_UP_DAMAGE;
  }
  return image;
}

function precacheThumbnail(image: Image): Promise<void> {
  return ky.get(image.thumbnailPath).then(() => {});
}

/**
 * Type definition for the result of the `addImage` API request.
 */
export interface AddImageResponse {
  /**
   * The image object that has been created.
   */
  image: Image;
}

/**
 * Add a new image to an inspection.
 *
 * @param options Upload options for the image.
 * @param config The API config.
 * @param [dispatch] Optional MonkState dispatch function that you can pass if you want this request to handle React
 * state management for you.
 */
export async function addImage(
  options: AddImageOptions,
  config: MonkApiConfig,
  dispatch?: Dispatch<MonkCreatedOneImageAction>,
): Promise<MonkApiResponse<AddImageResponse, ApiImage>> {
  const localImage = createLocalImage(options);
  dispatch?.({
    type: MonkActionType.CREATED_ONE_IMAGE,
    payload: {
      inspectionId: options.inspectionId,
      image: localImage,
    },
  });
  try {
    const kyOptions = getDefaultOptions(config);
    const formData = await createImageFormData(options);
    const response = await ky.post(`inspections/${options.inspectionId}/images`, {
      ...kyOptions,
      body: formData,
    });
    const body = await response.json<ApiImage>();
    const image = mapApiImage(
      body,
      options.inspectionId,
      config.thumbnailDomain,
      (options as AddBeautyShotImageOptions).compliance,
    );
    if (
      options.uploadType !== ImageUploadType.VIDEO_FRAME &&
      options.uploadType !== ImageUploadType.VIDEO_MANUAL_PHOTO &&
      options.useThumbnailCaching !== false
    ) {
      precacheThumbnail(image).catch((error) =>
        console.error(`Thumbnail GET request failed: ${error}`),
      );
    }
    dispatch?.({
      type: MonkActionType.CREATED_ONE_IMAGE,
      payload: {
        inspectionId: options.inspectionId,
        image,
        localId: localImage.id,
      },
    });
    return { image, response, body };
  } catch (err) {
    const status =
      err instanceof Error && (err.name === 'TimeoutError' || err.message === 'Failed to fetch')
        ? ImageStatus.UPLOAD_FAILED
        : ImageStatus.UPLOAD_ERROR;
    dispatch?.({
      type: MonkActionType.CREATED_ONE_IMAGE,
      payload: {
        inspectionId: options.inspectionId,
        image: {
          ...localImage,
          status,
        },
      },
    });
    throw err;
  }
}

/**
 * Options specified when deleting an image from an inspection.
 */
export interface DeleteImageOptions {
  /**
   * The ID of the inspection to update via the API.
   */
  id: string;
  /**
   * Image ID that will be deleted.
   */
  imageId: string;
}

/**
 * Delete an image from an inspection.
 *
 * @param options Deletion options for the image.
 * @param config The API config.
 * @param [dispatch] Optional MonkState dispatch function that you can pass if you want this request to handle React
 * state management for you.
 */
export async function deleteImage(
  options: DeleteImageOptions,
  config: MonkApiConfig,
  dispatch?: Dispatch<MonkDeletedOneImageAction>,
): Promise<MonkApiResponse> {
  const kyOptions = getDefaultOptions(config);
  try {
    const response = await ky.delete(`inspections/${options.id}/images/${options.imageId}`, {
      ...kyOptions,
      json: { authorized_tasks_statuses: [ProgressStatus.NOT_STARTED] },
    });
    const body = await response.json<ApiIdColumn>();
    dispatch?.({
      type: MonkActionType.DELETED_ONE_IMAGE,
      payload: {
        inspectionId: options.id,
        imageId: body.id,
      },
    });
    return {
      id: body.id,
      response,
      body,
    };
  } catch (err) {
    console.error(`Failed to delete image: ${(err as Error).message}`);
    throw err;
  }
}
