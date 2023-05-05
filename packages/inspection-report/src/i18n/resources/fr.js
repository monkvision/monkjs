import { carPartLabels } from '../../resources';

const fr = {
  translation: {
    damageReport: {
      title: 'Rapport de Dégâts',
      tabs: {
        overviewTab: {
          label: 'Apperçu',
        },
        photosTab: {
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
      damaged: 'Cette partie est endommagée',
      notDamaged: 'Cette partie n\'est pas endommagée',
      severity: 'Sévérité',
      minor: 'Mineure',
      moderate: 'Modéré',
      major: 'Majeur',
      repairCost: 'Coût de réparation',
      done: 'Terminé',
    },
    severityLabels: {
      pricingOnly: 'Dégâts',
      low: 'Mineur',
      medium: 'Modéré',
      high: 'Majeur',
      none: 'Inconnu',
    },
  },
};

export default fr;
