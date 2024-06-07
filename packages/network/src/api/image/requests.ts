import ky from 'ky';
import { Dispatch } from 'react';
import { getFileExtensions, MonkActionType, MonkCreatedOneImageAction } from '@monkvision/common';
import {
  ComplianceOptions,
  Image,
  ImageAdditionalData,
  ImageStatus,
  ImageSubtype,
  ImageType,
  MonkEntityType,
  MonkPicture,
  TaskName,
  TranslationObject,
} from '@monkvision/types';
import { v4 } from 'uuid';
import { labels, sights } from '@monkvision/sights';
import { getDefaultOptions, MonkApiConfig } from '../config';
import { ApiImage, ApiImagePost, ApiImagePostTask } from '../models';
import { MonkApiResponse } from '../types';
import { mapApiImage } from './mappers';

/**
 * Options specififed when adding a beauty shot (normal "sight" image) to an inspection.
 */
export interface AddBeautyShotImageOptions {
  /**
   * The type of the image : `ImageType.BEAUTY_SHOT`;
   */
  type: ImageType.BEAUTY_SHOT;
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
   * Additional options used to configure the compliance locally.
   */
  compliance?: ComplianceOptions;
}

/**
 * Options specififed when adding a close up (an "add damage" image) to an inspection using the 2-shot process.
 */
export interface Add2ShotCloseUpImageOptions {
  /**
   * The type of the image : `ImageType.CLOSE_UP`;
   */
  type: ImageType.CLOSE_UP;
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
   * Additional options used to configure the compliance locally.
   */
  compliance?: ComplianceOptions;
}

/**
 * Union type describing the different options that can be specified when adding a picture to an inspection.
 */
export type AddImageOptions = AddBeautyShotImageOptions | Add2ShotCloseUpImageOptions;

function getImageLabel(options: AddImageOptions): TranslationObject | undefined {
  if (options.type === ImageType.BEAUTY_SHOT) {
    return sights[options.sightId] ? labels[sights[options.sightId].label] : undefined;
  }
  return {
    en: options.firstShot ? 'Close Up (part)' : 'Close Up (damage)',
    fr: options.firstShot ? 'Photo Zoomée (partie)' : 'Photo Zoomée (dégât)',
    de: options.firstShot ? 'Gezoomtes Foto (Teil)' : 'Close Up (Schaden)',
    nl: options.firstShot ? 'Nabij (onderdeel)' : 'Nabij (schade)',
  };
}

function getAdditionalData(options: AddImageOptions): ImageAdditionalData {
  const additionalData: ImageAdditionalData = {
    label: getImageLabel(options),
    created_at: new Date().toISOString(),
  };
  if (options.type === ImageType.BEAUTY_SHOT) {
    additionalData.sight_id = options.sightId;
  }
  return additionalData;
}

const MULTIPART_KEY_IMAGE = 'image';
const MULTIPART_KEY_JSON = 'json';

function createBeautyShotImageData(
  options: AddBeautyShotImageOptions,
  filetype: string,
): { filename: string; body: ApiImagePost } {
  const filename = `${options.sightId}-${options.inspectionId}-${Date.now()}.${filetype}`;
  const tasks = options.tasks.filter(
    (task) => ![TaskName.COMPLIANCES, TaskName.HUMAN_IN_THE_LOOP].includes(task),
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

function createCloseUpImageData(
  options: Add2ShotCloseUpImageOptions,
  filetype: string,
): { filename: string; body: ApiImagePost } {
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

async function createImageFormData(
  options: AddImageOptions | Add2ShotCloseUpImageOptions,
): Promise<FormData> {
  const extensions = getFileExtensions(options.picture.mimetype);
  if (!extensions) {
    throw new Error(`Unknown picture mimetype : ${options.picture.mimetype}`);
  }
  const filetype = extensions[0];
  const { filename, body } =
    options.type === ImageType.BEAUTY_SHOT
      ? createBeautyShotImageData(options, filetype)
      : createCloseUpImageData(options, filetype);

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
    width: options.picture.width,
    height: options.picture.height,
    size: -1,
    mimetype: options.picture.mimetype,
    type: options.type,
    status: ImageStatus.UPLOADING,
    label: getImageLabel(options),
    additionalData,
    sightId: additionalData.sight_id,
    createdAt: additionalData.created_at ? Date.parse(additionalData.created_at) : undefined,
    views: [],
    renderedOutputs: [],
  };
  if (options.type === ImageType.CLOSE_UP) {
    image.siblingKey = options.siblingKey;
    image.subtype = options.firstShot ? ImageSubtype.CLOSE_UP_PART : ImageSubtype.CLOSE_UP_DAMAGE;
  }
  return image;
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
    const image = mapApiImage(body, options.inspectionId, options.compliance);
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
