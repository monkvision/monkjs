import { TaskName, ImageOcrType, WheelType } from '@monkvision/corejs/lib/types';

// These are the sights for the VIN recognition task
const vinSights = [
  'sLu0CfOt', // VIN Number
];

// These are the sights for the Wheel Analysis task (with the type of wheel they represent)
const wheelAnalysisSights = [
  { id: 'xQKQ0bXS', type: WheelType.WHEEL_FRONT_LEFT }, // Front Wheel Left
  { id: '8_W2PO8L', type: WheelType.WHEEL_BACK_LEFT }, // Rear Wheel Left
  { id: 'rN39Y3HR', type: WheelType.WHEEL_BACK_RIGHT }, // Rear Wheel Right
  { id: 'PuIw17h0', type: WheelType.WHEEL_FRONT_RIGHT }, // Front Wheel Right

  { id: 'jgc21-z15ZdJL6', type: WheelType.WHEEL_FRONT_LEFT }, // Front Lateral Low Left
  { id: 'jgc21-3gjMwvQG', type: WheelType.WHEEL_BACK_LEFT }, // Rear Lateral Low Left
  { id: 'jgc21-RAVpqaE4', type: WheelType.WHEEL_BACK_RIGHT }, // Rear Lateral Low Right
  { id: 'jgc21-s7WDTRmE', type: WheelType.WHEEL_FRONT_RIGHT }, // Front Lateral Low Right

  { id: 'fesc20-WIQsf_gX', type: WheelType.WHEEL_FRONT_LEFT }, // Front Lateral Low Left
  { id: 'fesc20-4Wqx52oU', type: WheelType.WHEEL_BACK_LEFT }, // Rear Lateral Low Left
  { id: 'fesc20-5Ts1UkPT', type: WheelType.WHEEL_BACK_RIGHT }, // Rear Lateral Low Right
  { id: 'fesc20-dKVLig1i', type: WheelType.WHEEL_FRONT_RIGHT }, // Front Lateral Low Right

  { id: 'haccord-GQcZz48C', type: WheelType.WHEEL_FRONT_LEFT }, // Front Lateral Low Left
  { id: 'haccord-W-Bn3bU1', type: WheelType.WHEEL_BACK_LEFT }, // Rear Lateral Low Left
  { id: 'haccord-OXYy5gET', type: WheelType.WHEEL_BACK_RIGHT }, // Rear Lateral Low Right
  { id: 'haccord-KN23XXkX', type: WheelType.WHEEL_FRONT_RIGHT }, // Front Lateral Low Right

  { id: 'ffocus18-x_1SE7X-', type: WheelType.WHEEL_FRONT_LEFT }, // Front Lateral Low Left
  { id: 'ffocus18-S3kgFOBb', type: WheelType.WHEEL_BACK_LEFT }, // Rear Lateral Low Left
  { id: 'ffocus18-P2jFq1Ea', type: WheelType.WHEEL_BACK_RIGHT }, // Rear Lateral Low Right
  { id: 'ffocus18-KkeGvT-F', type: WheelType.WHEEL_FRONT_RIGHT }, // Front Lateral Low Right

  { id: 'ftransit18-Y0vPhBVF', type: WheelType.WHEEL_FRONT_LEFT }, // Front Lateral Low Left
  { id: 'ftransit18-3Sbfx_KZ', type: WheelType.WHEEL_BACK_LEFT }, // Rear Lateral Low Left
  { id: 'ftransit18-RJ2D7DNz', type: WheelType.WHEEL_BACK_RIGHT }, // Rear Lateral Low Right
  { id: 'ftransit18-4NMPqEV6', type: WheelType.WHEEL_FRONT_RIGHT }, // Front Lateral Low Right

  { id: 'tsienna20-65mfPdRD', type: WheelType.WHEEL_FRONT_LEFT }, // Front Lateral Low Left
  { id: 'tsienna20-670P2H2V', type: WheelType.WHEEL_BACK_LEFT }, // Rear Lateral Low Left
  { id: 'tsienna20-SebsoqJm', type: WheelType.WHEEL_BACK_RIGHT }, // Rear Lateral Low Right
  { id: 'tsienna20-cI285Gon', type: WheelType.WHEEL_FRONT_RIGHT }, // Front Lateral Low Right

  { id: 'ff150-FqbrFVr2', type: WheelType.WHEEL_FRONT_LEFT }, // Front Lateral Low Left
  { id: 'ff150-ouGGtRnf', type: WheelType.WHEEL_BACK_LEFT }, // Rear Lateral Low Left
  { id: 'ff150-3rM9XB0Z', type: WheelType.WHEEL_BACK_RIGHT }, // Rear Lateral Low Right
  { id: 'ff150-7nvlys8r', type: WheelType.WHEEL_FRONT_RIGHT }, // Front Lateral Low Right
];

const mapTasksToSights = [
  ...vinSights.map((id) => ({
    id,
    task: {
      name: TaskName.IMAGES_OCR,
      image_details: { image_type: ImageOcrType.VIN },
    },
  })),
  ...wheelAnalysisSights.map(({ id, type }) => ({
    id,
    task: {
      name: TaskName.WHEEL_ANALYSIS,
      image_details: { wheel_name: type },
    },
    payload: {},
  })),
];

export default mapTasksToSights;
