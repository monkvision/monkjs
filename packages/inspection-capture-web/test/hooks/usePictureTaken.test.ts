import { TaskName, MonkPicture } from '@monkvision/types';
import { AddDamageHandle, usePictureTaken, UseTakePictureParams } from '../../src/hooks';
import { CaptureMode } from '../../src/types';
import { renderHook } from '@testing-library/react-hooks';
import { PhotoCaptureSightState } from '../../src/PhotoCapture/hooks';

function createParams(): UseTakePictureParams {
  return {
    captureState: {
      setLastPictureTakenUri: jest.fn(),
      takeSelectedSight: jest.fn(),
      selectedSight: { id: 'test-selected-sight', tasks: [TaskName.WHEEL_ANALYSIS] },
    },
    addDamageHandle: {
      mode: CaptureMode.SIGHT,
      updatePhotoCaptureModeAfterPictureTaken: jest.fn(),
    },
    uploadQueue: {
      push: jest.fn(),
    },
    onPictureTaken: jest.fn(),
  } as unknown as UseTakePictureParams;
}

function createMonkPicture(): MonkPicture {
  return {
    blob: {} as Blob,
    uri: 'test-monk-uri',
    mimetype: 'test-mimetype',
    height: 1234,
    width: 4567,
  };
}

describe('usePictureTaken hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update the last picture taken after a picture is taken', () => {
    const initialProps = createParams();
    const { result, unmount } = renderHook(usePictureTaken, { initialProps });

    expect(initialProps.captureState.setLastPictureTakenUri).not.toHaveBeenCalled();
    const picture = createMonkPicture();
    result.current(picture);
    expect(initialProps.captureState.setLastPictureTakenUri).toHaveBeenCalledWith(picture.uri);

    unmount();
  });

  it('should create a new sight upload and add it to the upload queue', () => {
    const initialProps = createParams();
    const { result, unmount } = renderHook(usePictureTaken, { initialProps });

    expect(initialProps.uploadQueue.push).not.toHaveBeenCalled();
    const picture = createMonkPicture();
    result.current(picture);
    expect(initialProps.uploadQueue.push).toHaveBeenCalledWith({
      mode: initialProps.addDamageHandle.mode,
      picture,
      sightId: (initialProps.captureState as PhotoCaptureSightState).selectedSight.id,
      tasks: (initialProps.captureState as PhotoCaptureSightState).selectedSight.tasks,
    });

    unmount();
  });

  it('should use the tasksBySight map if provided', () => {
    const tasks = [TaskName.WHEEL_ANALYSIS, TaskName.IMAGES_OCR];
    const initialProps = {
      ...createParams(),
      tasksBySight: {
        [(createParams().captureState as PhotoCaptureSightState).selectedSight.id]: tasks,
      },
    };
    const { result, unmount } = renderHook(usePictureTaken, { initialProps });

    expect(initialProps.uploadQueue.push).not.toHaveBeenCalled();
    const picture = createMonkPicture();
    result.current(picture);
    expect(initialProps.uploadQueue.push).toHaveBeenCalledWith(expect.objectContaining({ tasks }));

    unmount();
  });

  it('should create a new add damage upload and add it to the upload queue', () => {
    const defaultParams = createParams();
    const initialProps = {
      ...defaultParams,
      addDamageHandle: {
        ...defaultParams.addDamageHandle,
        mode: CaptureMode.ADD_DAMAGE_2ND_SHOT,
      } as unknown as AddDamageHandle,
    };
    const { result, unmount } = renderHook(usePictureTaken, { initialProps });

    expect(initialProps.uploadQueue.push).not.toHaveBeenCalled();
    const picture = createMonkPicture();
    result.current(picture);
    expect(initialProps.uploadQueue.push).toHaveBeenCalledWith({
      mode: initialProps.addDamageHandle.mode,
      picture,
    });

    unmount();
  });

  it('should take the current sight if the mode is sight', () => {
    const initialProps = createParams();
    const { result, unmount } = renderHook(usePictureTaken, { initialProps });

    expect(
      (initialProps.captureState as PhotoCaptureSightState).takeSelectedSight,
    ).not.toHaveBeenCalled();
    result.current(createMonkPicture());
    expect(
      (initialProps.captureState as PhotoCaptureSightState).takeSelectedSight,
    ).toHaveBeenCalled();

    unmount();
  });

  it('should not take the current sight if the mode is add damage', () => {
    const defaultParams = createParams();
    const initialProps = {
      ...defaultParams,
      addDamageHandle: {
        ...defaultParams.addDamageHandle,
        mode: CaptureMode.ADD_DAMAGE_2ND_SHOT,
      } as unknown as AddDamageHandle,
    };
    const { result, unmount } = renderHook(usePictureTaken, { initialProps });

    result.current(createMonkPicture());
    expect(
      (initialProps.captureState as PhotoCaptureSightState).takeSelectedSight,
    ).not.toHaveBeenCalled();

    unmount();
  });

  it('should update the photo capture mode', () => {
    const initialProps = createParams();
    const { result, unmount } = renderHook(usePictureTaken, { initialProps });

    expect(
      initialProps.addDamageHandle.updatePhotoCaptureModeAfterPictureTaken,
    ).not.toHaveBeenCalled();
    result.current(createMonkPicture());
    expect(initialProps.addDamageHandle.updatePhotoCaptureModeAfterPictureTaken).toHaveBeenCalled();

    unmount();
  });

  it('should call the onPictureTaken callback if passed', () => {
    const initialProps = createParams();
    const { result, unmount } = renderHook(usePictureTaken, { initialProps });

    const picture = createMonkPicture();
    expect(initialProps.onPictureTaken).not.toHaveBeenCalled();
    result.current(picture);
    expect(initialProps.onPictureTaken).toHaveBeenCalledWith(picture);

    unmount();
  });
});
