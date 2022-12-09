/* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access */
import config, { PackageVersions } from '../config';

export interface DeviceSpecs {
  userAgent?: string,
  platform?: string,
  connection?: {
    downlink?: number,
    effectiveType?: string,
    type?: string,
    rtt?: number,
  },
  appVersion?: string,
}

export type EnvSpecs = DeviceSpecs & { packages: PackageVersions };

function getDeviceSpecs(): DeviceSpecs {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const navigator = window.navigator as any;
  return {
    userAgent: navigator?.userAgent,
    platform: navigator?.platform,
    connection: {
      downlink: navigator?.connection?.downlink,
      effectiveType: navigator?.connection?.effectiveType,
      type: navigator?.connection?.type,
      rtt: navigator?.connection?.rtt,
    },
    appVersion: navigator?.appVersion,
  };
}

export function getCurrentEnvSpecs(): EnvSpecs {
  return {
    ...getDeviceSpecs(),
    packages: config.packageVersions,
  };
}
