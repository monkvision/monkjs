import axios from 'axios';
import { useCallback, useMemo } from 'react';
import { monkApi } from '@monkvision/corejs';
import { Platform } from 'react-native';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

import Actions from '../../actions';
import Constants from '../../const';

import log from '../../utils/log';
import getOS from '../../utils/getOS';

const COVERAGE_360_WHITELIST = [
  // T-ROCK
  'GHbWVnMB', 'GvCtVnoD', 'IVcF1dOP', 'LE9h1xh0',
  'PLh198NC', 'UHZkpCuK', 'XyeyZlaU', 'vLcBGkeh',
  'Pzgw0WGe', 'EqLDVYj3', 'jqJOb6Ov', 'j3E2UHFc',
  'AoO-nOoM', 'B5s1CWT-',
  // AUDI A7
  'vxRr9chD', // Front Bumper Side Left
  'cDe2q69X', // Front Fender Left
  'R_f4g8MN', // Doors Left
  'vedHBC2n', // Front Roof Left
  'McR3TJK0', // Rear Lateral Left
  '7bTC-nGS', // Rear Fender Left
  'hhCBI9oZ', // Rear
  'e_QIW30o', // Rear Fender Right
  'fDo5M0Fp', // Rear Lateral Right
  'fDKWkHHp', // Doors Right
  '5CFsFvj7', // Front Fender Right
  'g30kyiVH', // Front Bumper Side Right
  'I0cOpT1e', // Front
];

/**
 * @param current
 * @return {string}
 */
export function useTitle({ current }) {
  return useMemo(() => {
    if (!current.metadata) { return ''; }
    const { label, id } = current.metadata;

    if (Constants.PRODUCTION) { return label; }

    return `${label} - ${id}`;
  }, [current]);
}

/**
 * @param camera
 * @return {function({ quality: number=, base64: boolean=, exif: boolean= }): Promise<picture>}
 */
export function useTakePictureAsync({ camera }) {
  return useCallback(async (options = {
    quality: 1,
    base64: true,
    exif: true,
  }) => {
    log([`Awaiting picture to be taken...`]);

    // if (Platform.OS === 'web') {
    //   const mediaStream = await navigator.mediaDevices.getUserMedia({
    //     video: {
    //       facingMode: 'environment',
    //       width,
    //       height,
    //     },
    //   });
    //
    //   const track = mediaStream.getVideoTracks()[0];
    //
    //   const imageCapture = new ImageCapture(track);
    //
    //   const blob = await imageCapture.takePhoto();
    //   const uri = URL.createObjectURL(blob);
    //
    //   log([`ImageCapture 'takePhoto' has fulfilled with blob:`, uri]);
    //
    //   return { uri };
    // }

    console.log(camera);

    const picture = await camera.takePictureAsync(options);

    log([`Camera 'takePictureAsync' has fulfilled with picture:`, picture]);

    return picture;
  }, [camera]);
}

/**
 * @param current
 * @param settings
 * @param sights
 * @param uploads
 * @return {(function(pictureOrBlob:*, isBlob:boolean=): Promise<void>)|void}
 */
export function useSetPictureAsync({ current, sights, uploads }) {
  return useCallback(async (picture) => {
    const uri = picture.localUri || picture.uri;

    const actions = [{ resize: { width: 133 } }];
    const saveFormat = Platform.OS === 'web' ? SaveFormat.WEBP : SaveFormat.JPEG;
    const saveOptions = { compress: 1, format: saveFormat };
    const imageResult = await manipulateAsync(uri, actions, saveOptions);

    const payload = {
      id: current.id,
      picture: { uri: imageResult.uri },
    };

    sights.dispatch({ type: Actions.sights.SET_PICTURE, payload });
    uploads.dispatch({ type: Actions.uploads.UPDATE_UPLOAD, payload });
  }, [current.id, sights, uploads]);
}

/**
 * @param sights
 * @return {((function(): void))[]}
 */
export function useNavigationBetweenSights({ sights }) {
  const goPrevSight = useCallback(() => {
    sights.dispatch({ type: Actions.sights.PREVIOUS_SIGHT });
  }, [sights]);

  const goNextSight = useCallback(() => {
    sights.dispatch({ type: Actions.sights.NEXT_SIGHT });
  }, [sights]);

  return [goPrevSight, goNextSight];
}

/**
 * @return {function(*=): Promise<*>}
 */
export function useCreateDamageDetectionAsync() {
  return useCallback(async (
    tasks = { damage_detection: { status: 'NOT_STARTED' } },
  ) => {
    const result = await monkApi.inspections.createOne({ data: { tasks } });
    return result.data;
  }, []);
}

/**
 * @param inspectionId
 * @param sights
 * @param uploads
 * @param task
 * @return {(function({ inspectionId, sights, uploads }): Promise<result|error>)|*}
 */
export function useStartUploadAsync({ inspectionId, sights, uploads, task, onFinish }) {
  return useCallback(async (picture) => {
    const { dispatch } = uploads;
    if (!inspectionId) {
      throw Error(`Please provide a valid "inspectionId". Got ${inspectionId}.`);
    }

    const { current, ids } = sights.state;
    const { id, label } = current.metadata;

    try {
      dispatch({
        type: Actions.uploads.UPDATE_UPLOAD,
        increment: true,
        payload: { id, status: 'pending', label },
      });

      // call onFinish callback when capturing the last picture
      if (ids[ids.length - 1] === id) { onFinish(); }

      const fileType = Platform.OS === 'web' ? 'webp' : 'jpg';
      const filename = `${id}-${inspectionId}.${fileType}`;
      const multiPartKeys = { image: 'image', json: 'json', filename, type: `image/${fileType}` };

      const json = JSON.stringify({
        acquisition: {
          strategy: 'upload_multipart_form_keys',
          file_key: multiPartKeys.image,
        },
        compliances: {
          image_quality_assessment: {},
          coverage_360: COVERAGE_360_WHITELIST.includes(id) ? {
            sight_id: id,
          } : undefined,
        },
        tasks: [task],
        additional_data: {
          ...current.metadata,
          overlay: undefined,
        },
      });

      const data = new FormData();
      data.append(multiPartKeys.json, json);

      const res = await axios.get(picture.uri, { responseType: 'blob' });

      const file = await new File(
        [res.data],
        multiPartKeys.filename,
        { type: multiPartKeys.type },
      );

      data.append(multiPartKeys.image, file);

      const result = await monkApi.images.addOne({ inspectionId, data });

      dispatch({
        type: Actions.uploads.UPDATE_UPLOAD,
        payload: { id, status: 'fulfilled' },
      });

      return result;
    } catch (err) {
      dispatch({
        type: Actions.uploads.UPDATE_UPLOAD,
        increment: true,
        payload: { id, status: 'rejected', error: err },
      });

      throw err;
    }
  }, [inspectionId, sights, task, uploads, onFinish]);
}

/**
 * @param compliance
 * @param inspectionId
 * @param sightId
 * @return {(function(pictureId: string): Promise<result|error>)|*}
 */
export function useCheckComplianceAsync({ compliance, inspectionId, sightId }) {
  return useCallback(async (imageId) => {
    const { dispatch } = compliance;

    if (!imageId) {
      throw Error(`Please provide a valid "pictureId". Got ${imageId}.`);
    }

    try {
      dispatch({
        type: Actions.compliance.UPDATE_COMPLIANCE,
        increment: true,
        payload: { id: sightId, status: 'pending', imageId },
      });

      const result = await monkApi.images.getOne({ inspectionId, imageId });

      dispatch({
        type: Actions.compliance.UPDATE_COMPLIANCE,
        payload: { id: sightId, status: 'fulfilled', result, imageId },
      });

      return result;
    } catch (err) {
      dispatch({
        type: Actions.uploads.UPDATE_UPLOAD,
        increment: true,
        payload: { id: sightId, status: 'rejected', error: err, result: null, imageId },
      });

      return err;
    }
  }, [compliance, inspectionId, sightId]);
}
