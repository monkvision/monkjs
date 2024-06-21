export type GetUserMediaFn = (constraints?: MediaStreamConstraints) => Promise<MediaStream>;

export interface MockGetUserMediaParams {
  tracks?: MediaStreamTrack[];
  createMock?: (stream: MediaStream) => GetUserMediaFn;
}

export interface GetUserMediaMock {
  tracks: MediaStreamTrack[];
  stream: MediaStream;
  getUserMediaSpy: jest.SpyInstance;
  enumerateDevicesSpy: jest.SpyInstance;
  matchMedia: jest.SpyInstance;
}

const defaultMockTrack = {
  kind: 'video',
  applyConstraints: jest.fn(() => Promise.resolve(undefined)),
  getSettings: jest.fn(() => ({ width: 456, height: 123, deviceId: 'test-device-id-test' })),
  stop: jest.fn(),
} as unknown as MediaStreamTrack;

const tracks: MediaStreamTrack[] = [];
const stream = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  getTracks: jest.fn(() => tracks),
  getVideoTracks: jest.fn(() => tracks),
} as unknown as MediaStream;

export function mockGetUserMedia(params?: MockGetUserMediaParams): GetUserMediaMock {
  tracks.length = 0;
  if (params?.tracks) {
    tracks.push(...params.tracks);
  } else {
    tracks.push(defaultMockTrack);
  }
  Object.defineProperty(global.navigator, 'mediaDevices', {
    value: {
      getUserMedia: params?.createMock
        ? params.createMock(stream)
        : jest.fn(() => Promise.resolve(stream)),
      enumerateDevices: jest.fn(() => Promise.resolve([])),
    },
    configurable: true,
    writable: true,
  });
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(() => ({ matches: true })),
  });
  return {
    tracks,
    stream,
    getUserMediaSpy: jest.spyOn(global.navigator.mediaDevices, 'getUserMedia'),
    enumerateDevicesSpy: jest.spyOn(global.navigator.mediaDevices, 'enumerateDevices'),
    matchMedia: jest.spyOn(global.window, 'matchMedia'),
  };
}
