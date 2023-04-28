import { carPartLabels } from '../../resources';

const fr = {
  translation: {
    damageReport: {
      title: 'Rapport de Dégâts',
      tabs: {
        overview_tab: {
          label: 'Apperçu',
        },
        photos_tab: {
          label: 'Photos',
        },
      },
      buttons: {
        done: 'Done',
      },
      parts: {
        ...carPartLabels.fr,
      },
    },
    damageManipulator: {
      damages: 'Dégâts',
      notDamaged: 'Cette fête n\'est pas endommagée',
      severity: 'Gravité',
      minor: 'Mineure',
      moderate: 'Modéré',
      major: 'Majeur',
      repairCost: 'Coût de réparation',
      done: 'Fait',
    },
  },
};

export default fr;
