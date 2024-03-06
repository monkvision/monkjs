import { JwtPayload } from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';

/**
 * Enumeration of the API permissions included in the Monk authentication token.
 *
 * Note that this enum is not extensive and only declares permissions useful for the MonkJs SDK.
 */
export enum MonkApiPermission {
  TASK_COMPLIANCES = 'monk_core_api:compliances',
  TASK_DAMAGE_DETECTION = 'monk_core_api:damage_detection',
  TASK_DAMAGE_IMAGES_OCR = 'monk_core_api:images_ocr',
  TASK_DAMAGE_REPAIR_ESTIMATE = 'monk_core_api:repair_estimate',
  TASK_WHEEL_ANALYSIS = 'monk_core_api:wheel_analysis',
  INSPECTION_CREATE = 'monk_core_api:inspections:create',
  INSPECTION_READ = 'monk_core_api:inspections:read',
  INSPECTION_READ_ALL = 'monk_core_api:inspections:read_all',
  INSPECTION_READ_ORGANIZATION = 'monk_core_api:inspections:read_organization',
  INSPECTION_UPDATE = 'monk_core_api:inspections:update',
  INSPECTION_UPDATE_ALL = 'monk_core_api:inspections:update_all',
  INSPECTION_UPDATE_ORGANIZATION = 'monk_core_api:inspections:update_organization',
  INSPECTION_WRITE = 'monk_core_api:inspections:write',
  INSPECTION_WRITE_ALL = 'monk_core_api:inspections:write_all',
  INSPECTION_WRITE_ORGANIZATION = 'monk_core_api:inspections:write_organization',
}

/**
 * The payload of the authentication token used with the Monk API.
 */
export interface MonkJwtPayload extends JwtPayload {
  /**
   * The array of permissions that the user has.
   */
  permissions?: MonkApiPermission[];
}

/**
 * Decode the given Monk auth token and returns the MonkJwtPayload.
 */
export function decodeMonkJwt(token: string): MonkJwtPayload {
  return jwtDecode<MonkJwtPayload>(token);
}
