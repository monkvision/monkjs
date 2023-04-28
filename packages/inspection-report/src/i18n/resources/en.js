import { carPartLabels } from '../../resources';

const en = {
  translation: {
    damageReport: {
      title: 'Damage Report',
      tabs: {
        overview_tab: {
          label: 'Overview',
        },
        photos_tab: {
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
  },
};

export default en;
