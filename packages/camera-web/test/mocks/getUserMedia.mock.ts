export type GetUserMediaFn = (constraints?: MediaStreamConstraints) => Promise<MediaStream>;

export interface MockGetUserMediaParams {
  tracks?: MediaStreamTrack[];
  stream?: MediaStream;
  createMock?: (stream: MediaStream) => GetUserMediaFn;
}

export interface GetUserMediaSpys {
  getUserMedia: jest.SpyInstance;
  streamAddEventListener: jest.SpyInstance;
  tracksApplyConstraints: jest.SpyInstance[];
}

export interface GetUserMediaMock {
  tracks: MediaStreamTrack[];
  stream: MediaStream;
  spys: GetUserMediaSpys;
}

let tracks: MediaStreamTrack[] = [];
let stream: MediaStream = {} as MediaStream;

export function mockGetUserMedia(params?: MockGetUserMediaParams): GetUserMediaMock {
  tracks =
    params?.tracks ??
    ([
      {
        kind: 'video',
        applyConstraints: jest.fn(() => Promise.resolve(undefined)),
      },
    ] as unknown as MediaStreamTrack[]);
  stream =
    params?.stream ??
    ({
      addEventListener: jest.fn(),
      getTracks: jest.fn(() => tracks),
    } as unknown as MediaStream);
  Object.defineProperty(global.navigator, 'mediaDevices', {
    value: {
      getUserMedia: params?.createMock
        ? params.createMock(stream)
        : jest.fn(() => Promise.resolve(stream)),
    },
    configurable: true,
    writable: true,
  });
  const spys: GetUserMediaSpys = {
    getUserMedia: jest.spyOn(global.navigator.mediaDevices, 'getUserMedia'),
    streamAddEventListener: jest.spyOn(stream, 'addEventListener'),
    tracksApplyConstraints: tracks.map((track) => jest.spyOn(track, 'applyConstraints')),
  };
  return {
    tracks,
    stream,
    spys,
  };
}
