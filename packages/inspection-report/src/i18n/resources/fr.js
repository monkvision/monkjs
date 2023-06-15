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
      error: {
        message: 'Une erreur inattendue est survenue lors de la récupération des résultats de l\'inspection.',
        retry: 'Réessayer',
      },
      loading: 'Récupération des résultats...',
      notReady: 'Inspection en cours...',
      newInspection: 'Nouvelle inspection',
      download: 'Télécharger le rapport',
      newInspectionModal: {
        message: 'Si vous commencer une nouvelle inspection vous perdrez ce rapport. Êtes-vous sûr(e) de vouloir continuer ?',
        yes: 'Oui',
        cancel: 'Annuler',
      },
    },
    gallery: {
      empty: 'Cette inspection n\'a pas encore de photo.',
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
