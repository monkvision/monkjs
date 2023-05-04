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
    },
    damageManipulator: {
      damages: 'Damages',
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
