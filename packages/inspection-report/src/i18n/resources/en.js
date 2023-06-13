import { carPartLabels } from '../../resources';

const en = {
  translation: {
    damageReport: {
      title: 'Damage Report',
      tabs: {
        overviewTab: {
          label: 'Overview',
        },
        photosTab: {
          label: 'Photos',
        },
      },
      buttons: {
        done: 'Done',
      },
      parts: {
        ...carPartLabels.en,
      },
      error: {
        message: 'An unexpected error occurred while fetching the inspection results.',
        retry: 'Retry',
      },
      loading: 'Fetching inspection results...',
      notReady: 'Inspection still in progress...',
    },
    gallery: {
      empty: 'This inspection does not have any photo yet.',
    },
    damageManipulator: {
      damages: 'Damages',
      damaged: 'This part is damaged',
      notDamaged: 'This part isn\'t damaged',
      severity: 'Severity',
      minor: 'Minor',
      moderate: 'Moderate',
      major: 'Major',
      repairCost: 'Repair Cost',
      done: 'Done',
    },
    severityLabels: {
      pricingOnly: 'Damages',
      low: 'Minor',
      medium: 'Moderate',
      high: 'Major',
      none: 'Unknown',
    },
  },
};

export default en;
