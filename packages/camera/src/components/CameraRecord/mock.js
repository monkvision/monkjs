import monk from '@monkvision/corejs';

const { HANDLE_FRONT_LEFT, DOOR_FRONT_LEFT, WHEEL_FRONT_RIGHT } = monk.types.PartType;

const frames = [{ src: '' }];
const responses = [
  { frames, feedback: ['blurriness', 'underexposure'], coverage: [HANDLE_FRONT_LEFT, DOOR_FRONT_LEFT] },
  { frames, feedback: ['blurriness'], coverage: [WHEEL_FRONT_RIGHT] },
];

// the ml feature shall process the cut
const processCut = async () => new Promise((resolve) => {
  setTimeout(() => {
    const index = Math.floor(Math.random() * (responses.length - 1));
    const response = responses[index];
    resolve(response);
  }, 1000);
});

export default processCut;
