import { TaskName } from '@monkvision/types';

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
  ],
  vehicleType: 'hatchback',
  useDynamicCrops: true,
  usePricingV2: true,
  isVideoCapture: true,
};
