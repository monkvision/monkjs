import ky from 'ky';
import { MonkPicture } from '@monkvision/camera-web';
import { getFileExtensions, MonkActionType, MonkCreatedOneImageAction } from '@monkvision/common';
import { Image, ImageSubtype, ImageType, TaskName } from '@monkvision/types';
import { labels, sights } from '@monkvision/sights';
import { Dispatch } from 'react';
import { getDefaultOptions, MonkAPIConfig } from '../config';
import { ApiImage, ApiImagePost } from '../models';
import { MonkApiResponse } from '../types';
import { mapApiImage } from './mappers';

/**
 * Options used to enable or disable certain compliance checks when uploading a picture to the Monk Api.
 */
export interface ComplianceOptions {
  /**
   * Set this parameter to `true` to enable the Image Quality Assessment (IQA) compliance check. This checks will verify
   * the picture bluriness and exposure.
   */
  iqa?: boolean;
}

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
   * Additional options used to enable certain compliance checks on the picture.
   */
  compliances?: ComplianceOptions;
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
   * Additional options used to enable certain compliance checks on the picture.
   */
  compliances?: ComplianceOptions;
}

/**
 * Union type describing the different options that can be specified when adding a picture to an inspection.
 */
export type AddImageOptions = AddBeautyShotImageOptions | Add2ShotCloseUpImageOptions;

const MULTIPART_KEY_IMAGE = 'image';
const MULTIPART_KEY_JSON = 'json';

function createBeautyShotImageData(
  options: AddBeautyShotImageOptions,
  filetype: string,
): { filename: string; body: ApiImagePost } {
  const filename = `${options.sightId}-${options.inspectionId}-${Date.now()}.${filetype}`;
  const label = sights[options.sightId] ? labels[sights[options.sightId].label] : undefined;

  const body: ApiImagePost = {
    acquisition: {
      strategy: 'upload_multipart_form_keys',
      file_key: MULTIPART_KEY_IMAGE,
    },
    compliances: {
      image_quality_assessment: options.compliances?.iqa ? {} : undefined,
    },
    image_type: ImageType.BEAUTY_SHOT,
    tasks: options.tasks,
    additional_data: {
      sight_id: options.sightId,
      label,
      created_at: new Date(),
    },
  };

  return { filename, body };
}

function createCloseUpImageData(
  options: Add2ShotCloseUpImageOptions,
  filetype: string,
): { filename: string; body: ApiImagePost } {
  const prefix = options.firstShot ? 'closeup-part' : 'closeup-damage';
  const filename = `${prefix}-${options.inspectionId}-${Date.now()}.${filetype}`;
  const label = {
    en: options.firstShot ? 'Close Up (part)' : 'Close Up (damage)',
    fr: options.firstShot ? 'Photo Zoomée (partie)' : 'Photo Zoomée (dégât)',
    de: options.firstShot ? 'Gezoomtes Foto (Teil)' : 'Close Up (Schaden)',
  };

  const body: ApiImagePost = {
    acquisition: {
      strategy: 'upload_multipart_form_keys',
      file_key: MULTIPART_KEY_IMAGE,
    },
    compliances: {
      image_quality_assessment: options.compliances?.iqa ? {} : undefined,
    },
    image_type: ImageType.CLOSE_UP,
    image_subtype: options.firstShot ? ImageSubtype.CLOSE_UP_PART : ImageSubtype.CLOSE_UP_DAMAGE,
    image_sibling_key: options.siblingKey,
    tasks: [TaskName.DAMAGE_DETECTION],
    additional_data: {
      label,
      created_at: new Date(),
    },
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

  const blob = await ky.get(options.picture.uri).blob();
  const file = new File([blob], filename, { type: filetype });

  const data = new FormData();
  data.append(MULTIPART_KEY_JSON, JSON.stringify(body));
  data.append(MULTIPART_KEY_IMAGE, file);

  return data;
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
  config: MonkAPIConfig,
  dispatch?: Dispatch<MonkCreatedOneImageAction>,
): Promise<MonkApiResponse<AddImageResponse, ApiImage>> {
  const kyOptions = getDefaultOptions(config);
  const formData = await createImageFormData(options);
  const response = await ky.post(`inspections/${options.inspectionId}/images`, {
    ...kyOptions,
    body: formData,
  });
  const body = await response.json<ApiImage>();
  const image = mapApiImage(body, options.inspectionId);
  dispatch?.({
    type: MonkActionType.CREATED_ONE_IMAGE,
    payload: {
      inspectionId: options.inspectionId,
      image,
    },
  });
  return { image, response, body };
}
