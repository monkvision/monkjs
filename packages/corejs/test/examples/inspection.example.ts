import { ImageAcquisitionStrategy } from '../../src/images/apiTypes';
import { CreateInspection } from '../../src/inspections/apiTypes';
import { ProgressStatusUpdate } from '../../src/sharedTypes';
import { TaskName } from '../../src/tasks/entityTypes';

const inspectionExample: CreateInspection = {
  images: [
    {
      name: 'test.jpg',
      acquisition: {
        strategy: ImageAcquisitionStrategy.DOWNLOAD_FROM_URL,
        url: 'https://monk-client-images.s3.eu-west-1.amazonaws.com/Test_API/xpertise/EAD/ead_0.jpg',
      },
      tasks: [
        TaskName.DAMAGE_DETECTION,
        TaskName.REPAIR_ESTIMATE,
      ],
    },
    {
      name: 'test.jpg',
      acquisition: {
        strategy: ImageAcquisitionStrategy.DOWNLOAD_FROM_URL,
        url: 'https://monk-client-images.s3.eu-west-1.amazonaws.com/Test_API/xpertise/EAD/ead_1.jpg',
      },
      tasks: [
        TaskName.DAMAGE_DETECTION,
        TaskName.REPAIR_ESTIMATE,
      ],
    },
    {
      name: 'test.jpg',
      acquisition: {
        strategy: ImageAcquisitionStrategy.DOWNLOAD_FROM_URL,
        url: 'https://monk-client-images.s3.eu-west-1.amazonaws.com/Test_API/xpertise/EAD/ead_2.jpg',
      },
      tasks: [
        TaskName.DAMAGE_DETECTION,
        TaskName.REPAIR_ESTIMATE,
        TaskName.WHEEL_ANALYSIS,
      ],
    },
    {
      name: 'test.jpg',
      acquisition: {
        strategy: ImageAcquisitionStrategy.DOWNLOAD_FROM_URL,
        url: 'https://monk-client-images.s3.eu-west-1.amazonaws.com/Test_API/xpertise/EAD/ead_3.jpg',
      },
      tasks: [
        TaskName.DAMAGE_DETECTION,
        TaskName.REPAIR_ESTIMATE,
      ],
    },
  ],
  additionalData: {
    ideaId: '2d369853-e262-4c2c-a14f-54ce23e6665b',
  },
  tasks: {
    damageDetection: {
      status: ProgressStatusUpdate.TODO,
      generateVisualOutput: {
        generateDamages: true,
      },
      generateSubimagesDamages: {
        generateTight: false,
      },
      damageScoreThreshold: 0.4,
    },
    repairEstimate: {},
    wheelAnalysis: {},
  },
};

export default inspectionExample;
