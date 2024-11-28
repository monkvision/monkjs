import { BusinessClients, PricingMethodology, TaskName } from '@monkvision/types';

export default {
  tasks: [
    TaskName.WHEEL_ANALYSIS,
    {
      name: TaskName.DAMAGE_DETECTION,
      damageScoreThreshold: 0.5,
      generateDamageVisualOutput: true,
      generateSubimageDamages: true,
      generateSubimageParts: true,
    },
    {
      name: TaskName.PRICING,
      outputFormat: BusinessClients.VEB,
      config: 'config',
      methodology: PricingMethodology.FLAT_RATE,
    },
  ],
  vehicle: {
    brand: 'brand',
    model: 'model',
    serie: 'serie',
    plate: 'plate',
    type: 'hatchback',
    mileageUnit: 'mileageUnit',
    mileageValue: 34,
    marketValueUnit: 'marketValueUnit',
    marketValue: 45,
    vin: 'vin',
    color: 'color',
    exteriorCleanliness: 'exteriorCleanliness',
    interiorCleanliness: 'interiorCleanliness',
    dateOfCirculation: 'dateOfCirculation',
    duplicateKeys: true,
    expertiseRequested: true,
    carRegistration: true,
    vehicleQuotation: 12,
    tradeInOffer: 66,
    ownerInfo: {
      test: 'data',
    },
    additionalData: {
      additional: 'data',
    },
  },
  useDynamicCrops: true,
  isVideoCapture: true,
  additionalData: {
    test: 'uno',
    test2: 'dos',
  },
};
