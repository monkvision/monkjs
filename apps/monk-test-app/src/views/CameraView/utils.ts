import { CameraFacingMode, CameraResolution, CompressionFormat } from '@monkvision/camera-web';

export type TestOptionType = CameraFacingMode | CameraResolution | CompressionFormat | string;

function formatLabel(value: string | TestOptionType): string {
  switch (value) {
    case CameraFacingMode.USER:
      return 'Front';
    case CameraFacingMode.ENVIRONMENT:
      return 'Back';
    case CameraResolution.QNHD_180P:
      return '180p (320x180)';
    case CameraResolution.NHD_360P:
      return '360p (640x360)';
    case CameraResolution.HD_720P:
      return '720p (1280x720)';
    case CameraResolution.FHD_1080P:
      return '1080p (1920x1080)';
    case CameraResolution.QHD_2K:
      return '2K (2560x1440)';
    case CameraResolution.UHD_4K:
      return '4K (3840x2160)';
    case CompressionFormat.JPEG:
      return 'JPEG';
    default:
      return value;
  }
}

export function format(value: string | TestOptionType): string;
export function format(value: TestOptionType[] | Record<string, TestOptionType>): string[];
export function format(
  value: string | TestOptionType | TestOptionType[] | Record<string, TestOptionType>,
): string | string[] {
  if (Array.isArray(value)) {
    return value.map((v) => formatLabel(v));
  }
  if (typeof value === 'object') {
    return Object.values(value).map((v) => formatLabel(v));
  }
  return formatLabel(value);
}
