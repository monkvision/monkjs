import {
  CaptureAppConfig,
  DeviceOrientation,
  IQA_COMPLIANCE_ISSUES,
  MonkApiPermission,
  SteeringWheelPosition,
  TaskName,
  VehicleType,
} from '@monkvision/types';
import { flatten, getEnvOrThrow, uniq } from '@monkvision/common';
import { sights } from '@monkvision/sights';

const sightIds = {
  [SteeringWheelPosition.LEFT]: {
    [VehicleType.SUV]: [
      'jgc21-QIvfeg0X', // Front Low
      'jgc21-QwNQX0Cr', // Front Fender Right
      'jgc21-1j-oTPag', // Lateral Full Right
      'jgc21-3JJvM7_B', // Rear Right
      'jgc21-TyJPUs8E', // Rear Low
      'jgc21-ezXzTRkj', // Rear Left
      'jgc21-TEoi50Ff', // Lateral Full Left
      'jgc21-QIkcNhc_', // Front Fender Left
      'jgc21-imomJ2V0', // Front Roof Left
      'all-IqwSM3', // Front Seats
      'all-rSvk2C', // Dashboard
    ],
    [VehicleType.CUV]: [
      'fesc20-H1dfdfvH', // Front Low
      'fesc20-CEGtqHkk', // Front Fender Right
      'fesc20-HYz5ziHi', // Lateral Full Right
      'fesc20-LZc7p2kK', // Rear Right
      'fesc20-xBFiEy-_', // Rear Low
      'fesc20-dfICsfSV', // Rear Left
      'fesc20-26n47kaO', // Lateral Full Left
      'fesc20-GdIxD-_N', // Front Fender Left
      'fesc20-6GPUkfYn', // Front Roof Left
      'all-IqwSM3', // Front Seats
      'all-rSvk2C', // Dashboard
    ],
    [VehicleType.SEDAN]: [
      'haccord-8YjMcu0D', // Front Low
      'haccord-EfRIciFr', // Front Fender Right
      'haccord-PGr3RzzP', // Lateral Full Right
      'haccord-Jq65fyD4', // Rear Right
      'haccord-6kYUBv_e', // Rear Low
      'haccord-GdWvsqrm', // Rear Left
      'haccord-_YnTubBA', // Lateral Full Left
      'haccord-2a8VfA8m', // Front Fender Left
      'haccord-oiY_yPTR', // Front Roof Left
      'all-IqwSM3', // Front Seats
      'all-rSvk2C', // Dashboard
    ],
    [VehicleType.HATCHBACK]: [
      'ffocus18-XlfgjQb9', // Front Low
      'ffocus18-zgLKB-Do', // Front Fender Right
      'ffocus18-FdsQDaTW', // Lateral Full Right
      'ffocus18-jWOq2CNN', // Rear Right
      'ffocus18-L2UM_68Q', // Rear Low
      'ffocus18-9MeSIqp7', // Rear Left
      'ffocus18-6FX31ty1', // Lateral Full Left
      'ffocus18-GiTxaJUq', // Front Fender Left
      'ffocus18-ZXKOomlv', // Front Roof Left
      'all-IqwSM3', // Front Seats
      'all-rSvk2C', // Dashboard
    ],
    [VehicleType.VAN]: [
      'ftransit18-wyXf7MTv', // Front Low
      'ftransit18-IIVI_pnX', // Front Bumper Side Right
      'ftransit18-G24AdP6r', // Lateral Full Right
      'ftransit18-FFP5b34o', // Rear Right
      'ftransit18-3dkU10af', // Rear Low
      'ftransit18-iu1Vj2Oa', // Rear Left
      'ftransit18-rsXWUN8X', // Lateral Full Left
      'ftransit18-5SiNC94w', // Front Bumper Side Left
      'all-IqwSM3', // Front Seats
      'all-rSvk2C', // Dashboard
    ],
    [VehicleType.MINIVAN]: [
      'tsienna20-YwrRNr9n', // Front Low
      'tsienna20-xtDcn3GS', // Front Fender Right
      'tsienna20-uIHdpQ9y', // Lateral Full Right
      'tsienna20--a2RmRcs', // Rear Right
      'tsienna20-qA3aAUUq', // Rear
      'tsienna20-1n_z8bYy', // Rear Left
      'tsienna20-4ihRwDkS', // Lateral Full Left
      'tsienna20-gkvZE2c7', // Front Fender Left
      'tsienna20-is1tpnqR', // Front Roof Left
      'all-IqwSM3', // Front Seats
      'all-rSvk2C', // Dashboard
    ],
    [VehicleType.PICKUP]: [
      'ff150-zXbg0l3z', // Front Low
      'ff150-OviO2DlY', // Front Fender Right
      'ff150-_UIadfVL', // Lateral Full Right
      'ff150-t3KBMPeD', // Rear Right
      'ff150-3dkU10af', // Rear Low
      'ff150--xPZZd83', // Rear Left
      'ff150-GOx2s_9L', // Lateral Full Left
      'ff150-wO_fJ3DL', // Front Fender Left
      'ff150-Ttsc7q6V', // Front Roof Left
      'all-IqwSM3', // Front Seats
      'all-rSvk2C', // Dashboard
    ],
  },
  [SteeringWheelPosition.RIGHT]: {
    [VehicleType.SUV]: [
      'jgc21-QIvfeg0X', // Front Low
      'jgc21-imomJ2V0', // Front Roof Left
      'jgc21-QIkcNhc_', // Front Fender Left
      'jgc21-TEoi50Ff', // Lateral Full Left
      'jgc21-ezXzTRkj', // Rear Left
      'jgc21-TyJPUs8E', // Rear Low
      'jgc21-3JJvM7_B', // Rear Right
      'jgc21-1j-oTPag', // Lateral Full Right
      'jgc21-QwNQX0Cr', // Front Fender Right
      'all-T4HrF8KA', // Front Seats
      'all-rSvk2C', // Dashboard
    ],
    [VehicleType.CUV]: [
      'fesc20-H1dfdfvH', // Front Low
      'fesc20-6GPUkfYn', // Front Roof Left
      'fesc20-GdIxD-_N', // Front Fender Left
      'fesc20-26n47kaO', // Lateral Full Left
      'fesc20-dfICsfSV', // Rear Left
      'fesc20-xBFiEy-_', // Rear Low
      'fesc20-LZc7p2kK', // Rear Right
      'fesc20-HYz5ziHi', // Lateral Full Right
      'fesc20-CEGtqHkk', // Front Fender Right
      'all-T4HrF8KA', // Front Seats
      'all-rSvk2C', // Dashboard
    ],
    [VehicleType.SEDAN]: [
      'haccord-8YjMcu0D', // Front Low
      'haccord-oiY_yPTR', // Front Roof Left
      'haccord-2a8VfA8m', // Front Fender Left
      'haccord-_YnTubBA', // Lateral Full Left
      'haccord-GdWvsqrm', // Rear Left
      'haccord-6kYUBv_e', // Rear Low
      'haccord-Jq65fyD4', // Rear Right
      'haccord-PGr3RzzP', // Lateral Full Right
      'haccord-EfRIciFr', // Front Fender Right
      'all-T4HrF8KA', // Front Seats
      'all-rSvk2C', // Dashboard
    ],
    [VehicleType.HATCHBACK]: [
      'ffocus18-XlfgjQb9', // Front Low
      'ffocus18-ZXKOomlv', // Front Roof Left
      'ffocus18-GiTxaJUq', // Front Fender Left
      'ffocus18-6FX31ty1', // Lateral Full Left
      'ffocus18-9MeSIqp7', // Rear Left
      'ffocus18-L2UM_68Q', // Rear Low
      'ffocus18-jWOq2CNN', // Rear Right
      'ffocus18-FdsQDaTW', // Lateral Full Right
      'ffocus18-zgLKB-Do', // Front Fender Right
      'all-T4HrF8KA', // Front Seats
      'all-rSvk2C', // Dashboard
    ],
    [VehicleType.VAN]: [
      'ftransit18-wyXf7MTv', // Front Low
      'ftransit18-5SiNC94w', // Front Bumper Side Left
      'ftransit18-rsXWUN8X', // Lateral Full Left
      'ftransit18-iu1Vj2Oa', // Rear Left
      'ftransit18-3dkU10af', // Rear Low
      'ftransit18-FFP5b34o', // Rear Right
      'ftransit18-G24AdP6r', // Lateral Full Right
      'ftransit18-IIVI_pnX', // Front Bumper Side Right
      'all-T4HrF8KA', // Front Seats
      'all-rSvk2C', // Dashboard
    ],
    [VehicleType.MINIVAN]: [
      'tsienna20-YwrRNr9n', // Front Low
      'tsienna20-is1tpnqR', // Front Roof Left
      'tsienna20-gkvZE2c7', // Front Fender Left
      'tsienna20-4ihRwDkS', // Lateral Full Left
      'tsienna20-1n_z8bYy', // Rear Left
      'tsienna20-qA3aAUUq', // Rear
      'tsienna20--a2RmRcs', // Rear Right
      'tsienna20-uIHdpQ9y', // Lateral Full Right
      'tsienna20-xtDcn3GS', // Front Fender Right
      'all-T4HrF8KA', // Front Seats
      'all-rSvk2C', // Dashboard
    ],
    [VehicleType.PICKUP]: [
      'ff150-zXbg0l3z', // Front Low
      'ff150-Ttsc7q6V', // Front Roof Left
      'ff150-wO_fJ3DL', // Front Fender Left
      'ff150-GOx2s_9L', // Lateral Full Left
      'ff150--xPZZd83', // Rear Left
      'ff150-3dkU10af', // Rear Low
      'ff150-t3KBMPeD', // Rear Right
      'ff150-_UIadfVL', // Lateral Full Right
      'ff150-OviO2DlY', // Front Fender Right
      'all-T4HrF8KA', // Front Seats
      'all-rSvk2C', // Dashboard
    ],
  },
};

export const AppConfig: CaptureAppConfig = {
  enforceOrientation: DeviceOrientation.LANDSCAPE,
  defaultVehicleType: VehicleType.CUV,
  allowManualLogin: process.env['REACT_APP_ALLOW_LOGIN'] === 'true',
  allowVehicleTypeSelection: true,
  fetchFromSearchParams: true,
  enableAddDamage: false,
  useLiveCompliance: true,
  allowSkipRetake: process.env['REACT_APP_ALLOW_SKIP_RETAKE'] === 'true',
  allowCreateInspection: process.env['REACT_APP_ALLOW_CREATE_INSPECTION'] === 'true',
  createInspectionOptions: { tasks: [TaskName.DAMAGE_DETECTION, TaskName.WHEEL_ANALYSIS] },
  apiDomain: getEnvOrThrow('REACT_APP_API_DOMAIN'),
  requiredApiPermissions: [
    MonkApiPermission.TASK_COMPLIANCES,
    MonkApiPermission.TASK_DAMAGE_DETECTION,
    MonkApiPermission.TASK_DAMAGE_IMAGES_OCR,
    MonkApiPermission.TASK_WHEEL_ANALYSIS,
    MonkApiPermission.INSPECTION_CREATE,
    MonkApiPermission.INSPECTION_READ,
    MonkApiPermission.INSPECTION_UPDATE,
    MonkApiPermission.INSPECTION_WRITE,
  ],
  enableSteeringWheelPosition: true,
  defaultSteeringWheelPosition: SteeringWheelPosition.LEFT,
  tasksBySight: uniq(
    flatten(
      Object.values(sightIds).map((sightIdsByVehicleType) => Object.values(sightIdsByVehicleType)),
    ),
  ).reduce(
    (prev, curr) => ({
      ...prev,
      [curr]:
        process.env['REACT_APP_DISABLE_HINL'] === 'true'
          ? sights[curr].tasks
          : [...sights[curr].tasks, TaskName.HUMAN_IN_THE_LOOP],
    }),
    {},
  ),
  sights: sightIds,
  complianceIssuesPerSight: {
    'all-IqwSM3': IQA_COMPLIANCE_ISSUES,
    'all-rSvk2C': IQA_COMPLIANCE_ISSUES,
    'all-T4HrF8KA': IQA_COMPLIANCE_ISSUES,
  },
};
