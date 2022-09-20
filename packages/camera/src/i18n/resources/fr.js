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
    partSelector: {
      title: 'Choisissez une partie de voiture',
      notification: 'Photo prise avec succès !',
      sections: {
        bumpers: {
          name: 'Pare-chocs',
          elements: {
            bumper_back: 'Pare-chocs arrière',
            bumper_front: 'Pare-chocs avant',
          },
        },
        doors: {
          name: 'Portières',
          elements: {
            door_back_right: 'Portière arrière droite',
            door_back_left: 'Portière arrière gauche',
            door_front_left: 'Portière avant droite',
            door_front_right: 'Portière avant gauche',
          },
        },
        mirrors: {
          name: 'Rétroviseurs',
          elements: {
            mirror_left: 'Rétroviseur gauche',
            mirror_right: 'Rétroviseur droit',
          },
        },
        grills: {
          name: 'Grilles',
          elements: {
            grill_radiator: 'Grille radiateur',
            grill_low: 'Grille bas',
          },
        },
        fogLights: {
          name: 'Phares anti-brouillard',
          elements: {
            fog_light_back_left: 'Phare anti-brouillard arrière gauche',
            fog_light_back_right: 'Phare anti-brouillard arrière droit',
            fog_light_front_left: 'Phare anti-brouillard avant gauche',
            fog_light_front_right: 'Phare anti-brouillard avant droit',
          },
        },
        headLights: {
          name: 'Phares',
          elements: {
            head_light_left: 'Phare gauche',
            head_light_right: 'Phare droit',
          },
        },
        handles: {
          name: 'Poignées',
          elements: {
            handle_back_left: 'Poignée arrière gauche',
            handle_back_right: 'Poignée arrière droite',
            handle_front_left: 'Poignée avant gauche',
            handle_front_right: 'Poignée avant droite',
          },
        },
        spoilers: {
          name: 'Aileron',
          elements: {
            front_spoiler: 'Aileron avant',
            rear_spoiler: 'Aileron arrière',
          },
        },
        fenders: {
          name: 'Ailes',
          elements: {
            fender_back_left: 'Aile arrière gauche',
            fender_back_right: 'Aile arrière droite',
            fender_front_left: 'Aile avant gauche',
            fender_front_right: 'Aile avant droite',
          },
        },
        rockerPanels: {
          name: 'Bas de caisse',
          elements: {
            rocker_panel_right: 'Bas de caisse droit',
            rocker_panel_left: 'Bas de caisse gauche',
          },
        },
        wheels: {
          name: 'Roues',
          elements: {
            wheel_back_left: 'Roue arrière gauche',
            wheel_back_right: 'Roue arrière droite',
            wheel_front_left: 'Roue avant gauche',
            wheel_front_right: 'Roue avant droite',
          },
        },
        windshields: {
          name: 'Pare-brises',
          elements: {
            windshield_back: 'Pare-brise arrière',
            windshield_front: 'Pare-brise avant',
          },
        },
        quarterWindows: {
          name: 'Vitres latérales',
          elements: {
            quarter_window_back_left: 'Vitres latérale arrière gauche',
            quarter_window_back_right: 'Vitres latérale arrière droite',
            quarter_window_front_left: 'Vitres latérale avant gauche',
            quarter_window_front_right: 'Vitres latérale avant droite',
          },
        },
        windows: {
          name: 'Vitres',
          elements: {
            window_back_left: 'Vitre arrière gauche',
            window_back_right: 'Vitre arrière droite',
            window_corner_left: 'Vitre d\'angle gauche',
            window_corner_right: 'Vitre d\'angle droite',
            window_front_left: 'Vitre avant gauche',
            window_front_right: 'Vitre avant droite',
          },
        },
        others: {
          name: 'Autres',
          elements: {
            hood: 'Capot',
            petrol_door: 'Trappe à essence',
            pillar: 'Carrosserie',
            roof: 'Toit',
            trunk: 'Coffre',
          },
        },
      },
    },
  },
};

export default fr;
