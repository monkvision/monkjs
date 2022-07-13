const fr = {
  translation: {
    camera: {
      permissionDenied: 'Impossible d\'accéder à la caméra : permission refusée.',
    },
    controls: {
      takePicture: 'Prendre La Photo',
      fullScreen: 'Plein Écran',
      settings: 'Paramètres',
      quit: 'Quitter',
    },
    layout: {
      rotateDevice: 'Veuillez tourner votre appreil ↪',
      unlockPortraitMode: 'Vous avez peut-être besoin de déverouiller le mode portrait depuis les paramètres de votre appareil',
    },
    uploadCenter: {
      view: {
        title: 'Vérification de la qualité des images',
        subtitle: 'Plus la qualité est élevée, plus les résultats de l\'inspection seront précis',
        verifying: 'Vérification en cours...',
        tooMuchTodo: 'Impossible de vérifier toutes les images, cela pourrait affecter la précision des résultats',
        allRejected: 'Impossible d\'upload les images, veuillez réessayer',
        loading: 'Chargement...',
        retakeAll: 'Recommencer tout',
        submit: 'Passer',
      },
      subtitle: {
        unknown: 'Impossible de vérifier la qualité de l\'image',
        pending: 'Chargement...',
        failed: 'Impossible d\'upload l\'image, veuillez réessayer',
        idle: 'Dans la file d\'attente.',
        queueBlocked: 'Impossible de vérifier la qualité de l\'image (file d\'attente bloquée)',
        reasonsStart: 'Cette image',
        reasonsJoin: 'et',
        reasons: {
          blurriness: 'est floue',
          underexposure: 'est sous-exposée (trop sombre)',
          overexposure: 'est sur-exposée (trop lumineuse)',
          'TOO_ZOOMED--too zoomed': 'est trop zoomée',
          'NOT_ZOOMED_ENOUGH--not zoomed enough': 'est trop loin du véhicule',
          'WRONG_ANGLE--wrong angle': 'est prise depuis un angle incorrect',
          'UNKNOWN_VIEWPOINT--unknown viewpoint': 'ne s\'aligne pas avec le guide photo',
          'WRONG_CENTER_PART--picture centered on the wrong parts': 'n\'est pas centrée au bon endroit',
          'MISSING_PARTS--missing some parts': 'ne contient pas les bonnes parties de la voiture',
          'HIDDEN_PARTS--some parts not visible enough': 'contient certaines parties de voiture qui ne sont pas assez visibles',
          'NO_CAR_BODY--no car body detected': 'n\'a pas de véhicule clair',
        },
      },
      variant: {
        reupload: {
          label: 'Réupload l\'image',
          sublabel: 'appuyez ici pour réupload...',
        },
        inQueue: {
          label: 'Dans la file d\'attente',
        },
        recheck: {
          label: 'Revérifier l\'image',
          sublabel: 'appuyez ici pour revérifier...',
        },
        retake: {
          label: 'reprendre la photo',
          sublabel: 'appuyez ici pour reprendre la photo...',
        },
      },
    },
  },
};

export default fr;
