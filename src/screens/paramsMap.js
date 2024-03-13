import { Clients } from '../contexts';

export const ClientParamMap = {
  d9m: Clients.DEFAULT,
  pd8: Clients.CAT,
  '2bd': Clients.FASTBACK,
  a3o: Clients.ALPHA,
  m4n: Clients.ALGODRIVEN_CAPTURE,
  zxg: Clients.ALGODRIVEN_REPORT,
  e5j: Clients.VIDEO_POC,
  vb4: Clients.HITL_DEMO,
};

export const VehicleTypes = {
  SUV: 'suv',
  CUV: 'cuv',
  SEDAN: 'sedan',
  HATCHBACK: 'hatchback',
  VAN: 'van',
  MINIVAN: 'minivan',
  PICKUP: 'pickup',
};

export const VehicleTypeMap = {
  0: VehicleTypes.SUV,
  1: VehicleTypes.CUV,
  2: VehicleTypes.SEDAN,
  3: VehicleTypes.HATCHBACK,
  4: VehicleTypes.VAN,
  5: VehicleTypes.MINIVAN,
  6: VehicleTypes.PICKUP,
};
