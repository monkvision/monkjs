import monk from '@monkvision/corejs';

const { HANDLE_FRONT_LEFT, DOOR_FRONT_LEFT, WHEEL_FRONT_RIGHT } = monk.types.PartType;

export const frames = [
  { src: 'https://monk-client-images.s3.eu-west-1.amazonaws.com/Test_API/xpertise/EAD/ead_0.jpg' },
  { src: 'https://monk-client-images.s3.eu-west-1.amazonaws.com/Test_API/xpertise/EAD/ead_1.jpg' },
  { src: 'https://monk-client-images.s3.eu-west-1.amazonaws.com/Test_API/xpertise/EAD/ead_2.jpg' },
  { src: 'https://monk-client-images.s3.eu-west-1.amazonaws.com/Test_API/xpertise/EAD/ead_3.jpg' },
];
const responses = [
  { frames, feedback: ['blurriness', 'underexposure'], coverage: [HANDLE_FRONT_LEFT, DOOR_FRONT_LEFT] },
  { frames, feedback: ['blurriness', 'TOO_ZOOMED--too zoomed'], coverage: [WHEEL_FRONT_RIGHT] },
  { frames, feedback: ['underexposure', 'NO_CAR_BODY--no car body detected'], coverage: [WHEEL_FRONT_RIGHT] },
  { frames, feedback: ['MISSING_PARTS--missing some parts'], coverage: [WHEEL_FRONT_RIGHT] },
];

// the ml feature shall process the cut
export const initiateProcessCut = async () => new Promise((resolve) => {
  setTimeout(() => {
    const index = Math.floor(Math.random() * (responses.length - 1));
    const response = responses[index];
    resolve(response);
  }, 1000);
});
