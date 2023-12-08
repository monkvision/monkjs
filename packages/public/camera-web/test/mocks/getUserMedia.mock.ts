export type GetUserMediaFn = (constraints?: MediaStreamConstraints) => Promise<MediaStream>;

export interface MockGetUserMediaParams {
  tracks?: MediaStreamTrack[];
  createMock?: (stream: MediaStream) => GetUserMediaFn;
}

export interface GetUserMediaMock {
  tracks: MediaStreamTrack[];
  stream: MediaStream;
  getUserMediaSpy: jest.SpyInstance;
}

const defaultMockTrack = {
  kind: 'video',
  applyConstraints: jest.fn(() => Promise.resolve(undefined)),
  getSettings: jest.fn(() => ({ width: 456, height: 123 })),
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
    },
    configurable: true,
    writable: true,
  });
  return {
    tracks,
    stream,
    getUserMediaSpy: jest.spyOn(global.navigator.mediaDevices, 'getUserMedia'),
  };
}
