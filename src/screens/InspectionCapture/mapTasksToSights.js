/* eslint-disable camelcase */
import monk from '@monkvision/corejs';

const WADDSights = [
  { id: 'jgc21-z15ZdJL6', wheel_name: monk.types.WheelType.WHEEL_FRONT_LEFT },
  { id: 'jgc21-3gjMwvQG', wheel_name: monk.types.WheelType.WHEEL_BACK_LEFT },
  { id: 'jgc21-RAVpqaE4', wheel_name: monk.types.WheelType.WHEEL_BACK_RIGHT },
  { id: 'jgc21-s7WDTRmE', wheel_name: monk.types.WheelType.WHEEL_FRONT_RIGHT },

  { id: 'fesc20-WIQsf_gX', wheel_name: monk.types.WheelType.WHEEL_FRONT_LEFT },
  { id: 'fesc20-4Wqx52oU', wheel_name: monk.types.WheelType.WHEEL_BACK_LEFT },
  { id: 'fesc20-5Ts1UkPT', wheel_name: monk.types.WheelType.WHEEL_BACK_RIGHT },
  { id: 'fesc20-dKVLig1i', wheel_name: monk.types.WheelType.WHEEL_FRONT_RIGHT },

  { id: 'haccord-GQcZz48C', wheel_name: monk.types.WheelType.WHEEL_FRONT_LEFT },
  { id: 'haccord-W-Bn3bU1', wheel_name: monk.types.WheelType.WHEEL_BACK_LEFT },
  { id: 'haccord-OXYy5gET', wheel_name: monk.types.WheelType.WHEEL_BACK_RIGHT },
  { id: 'haccord-KN23XXkX', wheel_name: monk.types.WheelType.WHEEL_FRONT_RIGHT },

  { id: 'ffocus18-x_1SE7X-', wheel_name: monk.types.WheelType.WHEEL_FRONT_LEFT },
  { id: 'ffocus18-S3kgFOBb', wheel_name: monk.types.WheelType.WHEEL_BACK_LEFT },
  { id: 'ffocus18-P2jFq1Ea', wheel_name: monk.types.WheelType.WHEEL_BACK_RIGHT },
  { id: 'ffocus18-KkeGvT-F', wheel_name: monk.types.WheelType.WHEEL_FRONT_RIGHT },

  { id: 'ftransit18-Y0vPhBVF', wheel_name: monk.types.WheelType.WHEEL_FRONT_LEFT },
  { id: 'ftransit18-3Sbfx_KZ', wheel_name: monk.types.WheelType.WHEEL_BACK_LEFT },
  { id: 'ftransit18-RJ2D7DNz', wheel_name: monk.types.WheelType.WHEEL_BACK_RIGHT },
  { id: 'ftransit18-4NMPqEV6', wheel_name: monk.types.WheelType.WHEEL_FRONT_RIGHT },

  { id: 'tsienna20-65mfPdRD', wheel_name: monk.types.WheelType.WHEEL_FRONT_LEFT },
  { id: 'tsienna20-670P2H2V', wheel_name: monk.types.WheelType.WHEEL_BACK_LEFT },
  { id: 'tsienna20-SebsoqJm', wheel_name: monk.types.WheelType.WHEEL_BACK_RIGHT },
  { id: 'tsienna20-cI285Gon', wheel_name: monk.types.WheelType.WHEEL_FRONT_RIGHT },

  { id: 'ff150-FqbrFVr2', wheel_name: monk.types.WheelType.WHEEL_FRONT_LEFT },
  { id: 'ff150-ouGGtRnf', wheel_name: monk.types.WheelType.WHEEL_BACK_LEFT },
  { id: 'ff150-3rM9XB0Z', wheel_name: monk.types.WheelType.WHEEL_BACK_RIGHT },
  { id: 'ff150-gFp78fQO', wheel_name: monk.types.WheelType.WHEEL_FRONT_RIGHT },
];

const mapTasksToSights = [
  {
    id: 'sLu0CfOt',
    task: {
      name: monk.types.TaskName.IMAGES_OCR,
      image_details: { image_type: monk.types.ImageOcrType.VIN },
    },
  },
  ...WADDSights.map(({ id, wheel_name }) => ({
    id,
    tasks: [
      monk.types.TaskName.DAMAGE_DETECTION,
      {
        name: monk.types.TaskName.WHEEL_ANALYSIS,
        image_details: { wheel_name },
      },
    ],
    payload: {},
  })),
];

export default mapTasksToSights;
