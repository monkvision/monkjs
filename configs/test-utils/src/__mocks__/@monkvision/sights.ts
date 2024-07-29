import {
  PartSelectionOrientation,
  TaskName,
  VehicleModel,
  VehiclePart,
  VehicleType,
  WireframeDictionary,
} from '@monkvision/types';

const vehicles = {
  [VehicleModel.FESC20]: {
    id: VehicleModel.FESC20,
    make: 'Ford',
    model: 'Escape SE 2020',
    type: VehicleType.CUV,
  },
  [VehicleModel.FF150]: {
    id: VehicleModel.FF150,
    make: 'Ford',
    model: 'F-150 Super Cab XL 2014',
    type: VehicleType.PICKUP,
  },
};

const labels = {
  'test-label-1': {
    en: 'Test Label 1 EN',
    fr: 'Test Label 1 FR',
    de: 'Test Label 1 DE',
  },
  'test-label-2': {
    en: 'Test Label 2 EN',
    fr: 'Test Label 2 FR',
    de: 'Test Label 2 DE',
  },
  'test-label-3': {
    en: 'Test Label 3 EN',
    fr: 'Test Label 3 FR',
    de: 'Test Label 3 DE',
  },
  'test-label-4': {
    en: 'Test Label 4 EN',
    fr: 'Test Label 4 FR',
    de: 'Test Label 4 DE',
  },
  'test-label-5': {
    en: 'Test Label 5 EN',
    fr: 'Test Label 5 FR',
    de: 'Test Label 5 DE',
  },
};

const sights = {
  'test-sight-1': {
    id: 'test-sight-1',
    category: 'exterior',
    label: 'test-label-1',
    overlay: '<svg></svg>',
    vehicle: VehicleModel.FESC20,
    tasks: [TaskName.DAMAGE_DETECTION],
  },
  'test-sight-2': {
    id: 'test-sight-2',
    category: 'exterior',
    label: 'test-label-2',
    overlay: '<svg></svg>',
    vehicle: VehicleModel.FESC20,
    tasks: [TaskName.DAMAGE_DETECTION, TaskName.WHEEL_ANALYSIS],
  },
  'test-sight-3': {
    id: 'test-sight-3',
    category: 'exterior',
    label: 'test-label-3',
    overlay: '<svg></svg>',
    vehicle: VehicleModel.FESC20,
    tasks: [TaskName.DAMAGE_DETECTION],
  },
  'test-sight-4': {
    id: 'test-sight-4',
    category: 'exterior',
    label: 'test-label-4',
    overlay: '<svg></svg>',
    vehicle: VehicleModel.FESC20,
    tasks: [TaskName.DAMAGE_DETECTION, TaskName.WHEEL_ANALYSIS],
  },
  'test-sight-5': {
    id: 'test-sight-5',
    category: 'exterior',
    label: 'test-label-5',
    overlay: '<svg></svg>',
    vehicle: VehicleModel.FESC20,
    tasks: [TaskName.DAMAGE_DETECTION],
  },
};

const partSelectionWireframes: WireframeDictionary = {
  [VehicleModel.FESC20]: {
    [PartSelectionOrientation.FRONT_LEFT]: `<svg><path id="${VehiclePart.BUMPER_BACK}"></path></svg>`,
    [PartSelectionOrientation.REAR_LEFT]: '<svg>FR</svg>',
    [PartSelectionOrientation.REAR_RIGHT]: '<svg>RL</svg>',
    [PartSelectionOrientation.FRONT_RIGHT]: '<svg>RR</svg>',
  },
  [VehicleModel.AUDIA7]: {
    [PartSelectionOrientation.FRONT_LEFT]: `<svg><path id="${VehiclePart.BUMPER_FRONT}"></path></svg>`,
    [PartSelectionOrientation.REAR_LEFT]: `<svg><path id="${VehiclePart.BUMPER_BACK}"></path></svg>`,
    [PartSelectionOrientation.REAR_RIGHT]: `<svg><path id="${VehiclePart.TAIL_LIGHT_RIGHT}"></path></svg>`,
    [PartSelectionOrientation.FRONT_RIGHT]: `<svg><path id="${VehiclePart.WHEEL_BACK_RIGHT}"></path></svg>`,
  },
};

export = {
  vehicles,
  labels,
  sights,
  partSelectionWireframes,
};
