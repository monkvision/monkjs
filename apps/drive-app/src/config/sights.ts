import { Sight, SteeringWheelPosition, VehicleType } from '@monkvision/types';
import { sights } from '@monkvision/sights';

const APP_SIGHTS_BY_VEHICLE_TYPE: Partial<Record<VehicleType, Sight[]>> = {
  [VehicleType.SUV]: [
    sights['jgc21-QIvfeg0X'], // Front Low
    sights['jgc21-imomJ2V0'], // Front Roof Left
    sights['jgc21-QIkcNhc_'], // Front Fender Left
    sights['jgc21-TEoi50Ff'], // Lateral Full Left
    sights['jgc21-ezXzTRkj'], // Rear Left
    sights['jgc21-TyJPUs8E'], // Rear Low
    sights['jgc21-3JJvM7_B'], // Rear Right
    sights['jgc21-1j-oTPag'], // Lateral Full Right
    sights['jgc21-QwNQX0Cr'], // Front Fender Right
    sights['all-IqwSM3'], // Front Seats
    sights['all-rSvk2C'], // Dashboard
  ],
  [VehicleType.CROSSOVER]: [
    sights['fesc20-H1dfdfvH'], // Front Low
    sights['fesc20-6GPUkfYn'], // Front Roof Left
    sights['fesc20-GdIxD-N'], // Front Fender Left
    sights['fesc20-26n47kaO'], // Lateral Full Left
    sights['fesc20-dfICsfSV'], // Rear Left
    sights['fesc20-xBFiEy-'], // Rear Low
    sights['fesc20-LZc7p2kK'], // Rear Right
    sights['fesc20-HYz5ziHi'], // Lateral Full Right
    sights['fesc20-CEGtqHkk'], // Front Fender Right
    sights['all-IqwSM3'], // Front Seats
    sights['all-rSvk2C'], // Dashboard
  ],
  [VehicleType.SEDAN]: [
    sights['haccord-8YjMcu0D'], // Front Low
    sights['haccord-oiY_yPTR'], // Front Roof Left
    sights['haccord-2a8VfA8m'], // Front Fender Left
    sights['haccord-_YnTubBA'], // Lateral Full Left
    sights['haccord-GdWvsqrm'], // Rear Left
    sights['haccord-6kYUBv_e'], // Rear Low
    sights['haccord-Jq65fyD4'], // Rear Right
    sights['haccord-PGr3RzzP'], // Lateral Full Right
    sights['haccord-EfRIciFr'], // Front Fender Right
    sights['all-IqwSM3'], // Front Seats
    sights['all-rSvk2C'], // Dashboard
  ],
  [VehicleType.HATCHBACK]: [
    sights['ffocus18-XlfgjQb9'], // Front Low
    sights['ffocus18-ZXKOomlv'], // Front Roof Left
    sights['ffocus18-GiTxaJUq'], // Front Fender Left
    sights['ffocus18-6FX31ty1'], // Lateral Full Left
    sights['ffocus18-9MeSIqp7'], // Rear Left
    sights['ffocus18-L2UM_68Q'], // Rear Low
    sights['ffocus18-jWOq2CNN'], // Rear Right
    sights['ffocus18-FdsQDaTW'], // Lateral Full Right
    sights['ffocus18-zgLKB-Do'], // Front Fender Right
    sights['all-IqwSM3'], // Front Seats
    sights['all-rSvk2C'], // Dashboard
  ],
  [VehicleType.VAN]: [
    sights['ftransit18-wyXf7MTv'], // Front Low
    sights['ftransit18-5SiNC94w'], // Front Bumper Side Left
    sights['ftransit18-rsXWUN8X'], // Lateral Full Left
    sights['ftransit18-iu1Vj2Oa'], // Rear Left
    sights['ftransit18-3dkU10af'], // Rear Low
    sights['ftransit18-FFP5b34o'], // Rear Right
    sights['ftransit18-G24AdP6r'], // Lateral Full Right
    sights['ftransit18-IIVI_pnX'], // Front Bumper Side Right
    sights['all-IqwSM3'], // Front Seats
    sights['all-rSvk2C'], // Dashboard
  ],
  [VehicleType.MINIVAN]: [
    sights['tsienna20-YwrRNr9n'], // Front Low
    sights['tsienna20-is1tpnqR'], // Front Roof Left
    sights['tsienna20-gkvZE2c7'], // Front Fender Left
    sights['tsienna20-4ihRwDkS'], // Lateral Full Left
    sights['tsienna20-1n_z8bYy'], // Rear Left
    sights['tsienna20-qA3aAUUq'], // Rear
    sights['tsienna20--a2RmRcs'], // Rear Right
    sights['tsienna20-uIHdpQ9y'], // Lateral Full Right
    sights['tsienna20-xtDcn3GS'], // Front Fender Right
    sights['all-IqwSM3'], // Front Seats
    sights['all-rSvk2C'], // Dashboard
  ],
  [VehicleType.PICKUP]: [
    sights['ff150-zXbg0l3z'], // Front Low
    sights['ff150-Ttsc7q6V'], // Front Roof Left
    sights['ff150-wO_fJ3DL'], // Front Fender Left
    sights['ff150-GOx2s_9L'], // Lateral Full Left
    sights['ff150--xPZZd83'], // Rear Left
    sights['ff150-3dkU10af'], // Rear Low
    sights['ff150-t3KBMPeD'], // Rear Right
    sights['ff150-_UIadfVL'], // Lateral Full Right
    sights['ff150-OviO2DlY'], // Front Fender Right
    sights['all-IqwSM3'], // Front Seats
    sights['all-rSvk2C'], // Dashboard
  ],
};

export function getSights(
  vehicleType: VehicleType | null,
  steeringWheel: SteeringWheelPosition | null,
): Sight[] {
  const type =
    !vehicleType || !Object.values(VehicleType).includes(vehicleType)
      ? VehicleType.CROSSOVER
      : vehicleType;
  const captureSights = APP_SIGHTS_BY_VEHICLE_TYPE[type] as Sight[];

  if (steeringWheel === SteeringWheelPosition.RIGHT) {
    return [
      captureSights[0],
      ...captureSights.slice(1, captureSights.length - 2).reverse(),
      sights['all-T4HrF8KA'],
      captureSights[captureSights.length - 1],
    ];
  }
  return captureSights;
}
