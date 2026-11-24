import { uniq } from '@monkvision/common';
import { ComplianceOptions, PhotoCaptureAppConfig } from '@monkvision/types';
import { AddImageOptions, ImageUploadType } from '@monkvision/network';
import { CaptureMode } from '../types';
import type { PictureUpload } from './useUploadQueue';

/**
 * Maps a picture upload to the options of the `addImage` API request.
 */
export function createAddImageOptions(
  upload: PictureUpload,
  inspectionId: string,
  siblingId: number,
  enableThumbnail: boolean,
  retakeCount?: number,
  additionalTasks?: PhotoCaptureAppConfig['additionalTasks'],
  compliance?: ComplianceOptions,
  wheelAnalysisCloseUp?: boolean,
): AddImageOptions {
  if (upload.mode === CaptureMode.SIGHT) {
    return {
      uploadType: ImageUploadType.BEAUTY_SHOT,
      picture: upload.picture,
      sightId: upload.sightId,
      tasks: additionalTasks ? uniq([...upload.tasks, ...additionalTasks]) : upload.tasks,
      inspectionId,
      compliance,
      useThumbnailCaching: enableThumbnail,
      wheelAnalysisCloseUp,
      retakeCount,
    };
  }
  if (upload.mode === CaptureMode.ADD_DAMAGE_PART_SELECT_SHOT) {
    return {
      uploadType: ImageUploadType.PART_SELECT_SHOT,
      picture: upload.picture,
      inspectionId,
      vehicleParts: upload.vehicleParts,
      compliance,
      useThumbnailCaching: enableThumbnail,
    };
  }
  return {
    uploadType: ImageUploadType.CLOSE_UP_2_SHOT,
    picture: upload.picture,
    siblingKey: `closeup-sibling-key-${siblingId}`,
    firstShot: upload.mode === CaptureMode.ADD_DAMAGE_1ST_SHOT,
    inspectionId,
    compliance,
    useThumbnailCaching: enableThumbnail,
  };
}
