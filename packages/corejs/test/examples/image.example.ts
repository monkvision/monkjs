import { CreateImage, ImageAcquisitionStrategy } from '../../src/images/apiTypes';
import { TaskName } from '../../src/tasks/entityTypes';

const imageExample: CreateImage = {
  name: 'test1.jpg',
  acquisition: {
    strategy: ImageAcquisitionStrategy.DOWNLOAD_FROM_URL,
    url: 'https://monk-client-images.s3.eu-west-1.amazonaws.com/Test_API/Clean_images/P2170234.jpeg',
  },
  tasks: [TaskName.WHEEL_ANALYSIS],
};

export default imageExample;
