import { TaskName, VehicleModel, VehicleType } from '@monkvision/types';

const vehicles = {
  [VehicleModel.FESC20]: {
    id: VehicleModel.FESC20,
    make: 'Ford',
    model: 'Escape SE 2020',
    type: VehicleType.CROSSOVER,
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

export = {
  vehicles,
  labels,
  sights,
};
