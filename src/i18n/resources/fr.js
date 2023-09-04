const fr = {
  translation: {
    appLoading: 'Lancement de l\'app...',
    snackbar: {
      dismiss: 'Fermer',
    },
    inspection: {
      vinNumber: {
        title: 'Lecture du VIN (Vehicle Identification Number)',
        description: 'Détectez-le avec votre caméra ou rentrez-le manuellement',
      },
      damageDetection: {
        title: 'Détection de dégâts',
        description: 'Carrosserie et jantes / enjoliveurs',
      },
      status: {
        NOT_STARTED: 'En attente de lancement',
        TODO: 'En cours...',
        IN_PROGRESS: 'En cours...',
        DONE: 'Terminé !',
        ERROR: 'Erreur !',
      },
      vehicle: {
        type: {
          cuv: 'Crossover',
          hatchback: 'Citadine',
          minivan: 'Familiale',
          pickup: 'Pick-up',
          sedan: 'Berline',
          suv: 'SUV',
          van: 'Utilitaire',
        },
      },
    },
    landing: {
      logoDescription: 'Inspectez votre voiture avec',
      menuHeader: 'Cliquez pour lancer une nouvelle inspection',
      resetInspection: 'Recommencer l\'inspection',
      lastInspection: 'Dernière inspection',
      signOut: 'Se Déconnecter',
      workflowReminder: 'Veuillez compléter toutes les tâches afin de pouvoir générer votre rapport PDF.',
      downloadPdf: 'Télécharger le PDF',
      downloadPdfDescription: 'Disponible lorsque toutes les tâches sont terminées',
      appVersion: 'Version de l\'application',
    },
    vinModal: {
      title: 'Comment définir le numéro VIN ?',
      camera: 'Détection avec caméra',
      manual: 'Le rentrer manuellement',
      prompt: {
        title: 'Numéro VIN (Vehicle Identification Number)',
        backgroundMessage: 'Veuillez renseigner le contenu demandé dans la fenêtre',
        backgroundGoBack: 'Retour',
      },
    },
    signin: {
      authRequested: {
        title: 'Authentification nécessaire.',
        message: 'Veuillez vous connecter pour commencer l\'inspection.',
        button: 'Se Connecter',
      },
      success: {
        title: 'Connecté !',
        message: 'Vous êtes connecté ! Vous pouvez à présent commencer l\'inspection.',
        button: 'Commencer l\'inspection',
      },
      error: {
        title: 'Désolé 😞',
        message: 'Une erreur est survenue lors de l\'authentification, veuillez réessayer dans un instant.',
        button: 'Retour à la page d\'accueil',
      },
      loader: {
        signingIn: 'Connection en cours',
        authenticating: 'Authentification en cours',
        robot: 'Nous vérifions que vous n\'êtes pas un robot',
        loading: 'Chargement',
      },
    },
    createInspection: {
      authError: {
        title: 'Désolé 😞',
        message: 'Vous n\'avez pas les autorisations nécessaires pour créer une nouvelle inspection. Veuillez utiliser un autre utilisateur ou contacter les administrateurs',
        button: 'Retourner à la page d\'accueil',
      },
      error: {
        title: 'Désolé 😞',
        message: 'Une erreur est survenue lors de la création de l\'inspection, veuillez réessayer dans un instant.',
        button: 'Retour à la page d\'accueil',
      },
    },
    updateInspection: {
      loader: {
        updating: 'Mise à jour de l\'inspection',
        waking: 'Reveil de l\'IA',
        processing: 'Traîtement...',
      },
      error: {
        title: 'Désolé 😞',
        message: 'Une erreur est survenue lors de la mise à jour de l\'inspection, veuillez réessayer dans un instant.',
        button: 'Retour à la page d\'accueil',
      },
    },
    inspectionList: {
      error: {
        title: 'Erreur',
        message: 'Une erreur est survenue lors de la récupération de vos inspections.',
      },
      empty: {
        title: 'Aucune inspection',
        message: 'Créez une inspection et elle apparaîtra ici.',
      },
    },
    capture: {
      quit: {
        title: 'Êtes-vous certain de vouloir quitter la capture ?',
        message: 'Les photos prises pour cette tâche seront perdues.',
        cancel: 'Annuler',
        ok: 'OK',
      },
      settings: {
        title: 'Paramètres',
        resolution: 'Résolution',
        compression: 'Compression d\'image',
        fullscreen: 'Plein écran',
        exitFullscreen: 'Quitter le plein écran',
        on: 'Activer',
        off: 'Désactiver',
      },
      skipRetake: {
        error: {
          message: 'Désolé, nous n\'avons pas pu terminer l\'inspection',
          label: 'Commencer une nouvelle inspection',
        },
      },
      custom: '+',
    },
  },
};

export default fr;
