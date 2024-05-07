import { ComplianceIssue, ImageStatus, TranslationObject } from '@monkvision/types';

/**
 * Translations available for image labels.
 */
export interface ImageLabels {
  /**
   * The title of the image status or compliance issue.
   */
  title: TranslationObject;
  /**
   * The description of the image status or compliance issue.
   */
  description: TranslationObject;
}

/**
 * Translation labels for the different image status.
 */
export const imageStatusLabels: Record<ImageStatus, ImageLabels> = {
  [ImageStatus.UPLOADING]: {
    title: {
      en: 'Uploading',
      fr: 'Upload en cours',
      de: 'Hochladen',
      nl: 'Bezig met uploaden',
    },
    description: {
      en: 'This image is being uploaded.',
      fr: "Upload de l'image en cours.",
      de: 'Dieses Bild wird gerade hochgeladen.',
      nl: 'Deze afbeelding wordt geüpload.',
    },
  },
  [ImageStatus.COMPLIANCE_RUNNING]: {
    title: {
      en: 'Analyzing',
      fr: 'Analyse',
      de: 'Analysieren Sie',
      nl: 'Analyseren',
    },
    description: {
      en: 'This image is being analyzed.',
      fr: "Cette image est en train d'être analysée.",
      de: 'Dieses Bild wird gerade analysiert.',
      nl: 'Deze afbeelding wordt geanalyseerd.', // Dutch translation for 'This image is being analyzed.'
    },
  },
  [ImageStatus.SUCCESS]: {
    title: {
      en: 'Success',
      fr: 'Succès',
      de: 'Erfolg',
      nl: 'Succes',
    },
    description: {
      en: 'This image seems good, but you can still retake it if you want.',
      fr: 'Cette image paraît bonne, mais vous pouvez quand-même la reprendre si besoin.',
      de: 'Dieses Bild scheint gut zu sein, aber Sie können es noch einmal aufnehmen, wenn Sie wollen.',
      nl: 'Dit beeld lijkt goed, maar je kunt het nog steeds opnieuw maken als je wilt.',
    },
  },
  [ImageStatus.UPLOAD_FAILED]: {
    title: {
      en: 'Upload failed',
      fr: 'Upload impossible',
      de: 'Upload fehlgeschlagen',
      nl: 'Upload mislukt',
    },
    description: {
      en: 'Make sure you have a good connection and take the photo again.',
      fr: 'Vérifiez que vous avez une bonne connexion et reprenez la photo.',
      de: 'Vergewissern Sie sich, dass Sie eine gute Verbindung haben, und machen Sie das Foto erneut.',
      nl: 'Zorg ervoor dat je een goede verbinding hebt en neem de foto opnieuw.',
    },
  },
  [ImageStatus.NOT_COMPLIANT]: {
    title: {
      en: 'Error',
      fr: 'Erreur',
      de: 'Fehler',
      nl: 'Fout',
    },
    description: {
      en: 'Make sure the image quality is good and take the photo again.',
      fr: "Vérifiez que la qualité de l'image est bonne et reprenez la photo.",
      de: 'Vergewissern Sie sich, dass die Bildqualität gut ist, und machen Sie das Foto erneut.',
      nl: 'Zorg ervoor dat de kwaliteit van de afbeelding goed is en neem de foto opnieuw.',
    },
  },
};

/**
 * Translation labels for the different compliance issues.
 */
export const complianceIssueLabels: Record<ComplianceIssue, ImageLabels> = {
  [ComplianceIssue.OTHER]: {
    title: {
      en: 'Not compliant',
      fr: 'Non valide',
      de: 'Nicht konform',
      nl: 'Niet-conform',
    },
    description: {
      en: 'Make sure that the image quality is good and that the vehicle is properly aligned with the guides.',
      fr: "Assurez-vous que la qualité de l'image est bonne et que le véhicule est bien aligné avec les guides.",
      de: 'Vergewissern Sie sich, dass die Bildqualität gut ist und dass das Fahrzeug richtig an den Führungslinien ausgerichtet ist.',
      nl: 'Zorg ervoor dat de kwaliteit van de afbeelding goed is en dat het voertuig correct is uitgelijnd met de gidsen.',
    },
  },
  [ComplianceIssue.LOW_RESOLUTION]: {
    title: {
      en: 'Low resolution',
      fr: 'Basse résolution',
      de: 'Niedrige Auflösung',
      nl: 'Lage resolutie',
    },
    description: {
      en: 'Make sure that the image has a good resolution.',
      fr: "Assurez-vous que l'image ait une résolution suffisante.",
      de: 'Achten Sie darauf, dass das Bild eine gute Auflösung hat.',
      nl: 'Zorg ervoor dat de afbeelding een goede resolutie heeft.',
    },
  },
  [ComplianceIssue.BLURRINESS]: {
    title: {
      en: 'Too blurry',
      fr: 'Trop floue',
      de: 'Zu unscharf',
      nl: 'Te vaag',
    },
    description: {
      en: 'Make sure that the image is not blurry.',
      fr: "Assurez-vous que l'image ne soit pas trop floue.",
      de: 'Achten Sie darauf, dass das Bild nicht unscharf ist.',
      nl: 'Zorg ervoor dat de afbeelding niet vaag is.',
    },
  },
  [ComplianceIssue.UNDEREXPOSURE]: {
    title: {
      en: 'Underexposed',
      fr: 'Sousexposition',
      de: 'Unterbelichtet',
      nl: 'Onderbelicht',
    },
    description: {
      en: "Make sure that the image isn't too dark.",
      fr: "Assurez-vous que l'image ne soit pas trop sombre.",
      de: 'Achten Sie darauf, dass das Bild nicht zu dunkel ist.',
      nl: 'Zorg ervoor dat de afbeelding niet te donker is.',
    },
  },
  [ComplianceIssue.OVEREXPOSURE]: {
    title: {
      en: 'Overexposed',
      fr: 'Surexposition',
      de: 'Überbelichtet',
      nl: 'Overbelicht',
    },
    description: {
      en: "Make sure that the image isn't too bright.",
      fr: "Assurez-vous que l'image ne soit pas trop lumineuse.",
      de: 'Achten Sie darauf, dass das Bild nicht zu hell ist.',
      nl: 'Zorg ervoor dat de afbeelding niet te licht is.',
    },
  },
  [ComplianceIssue.LENS_FLARE]: {
    title: {
      en: 'Lens flares',
      fr: 'Reflets',
      de: 'Objektivreflexe',
      nl: 'Lensflares',
    },
    description: {
      en: "Make sure that there aren't any bright flare on the image.",
      fr: "Assurez-vous que l'image ne contienne pas de reflets.",
      de: 'Vergewissern Sie sich, dass keine hellen Streulichter auf dem Bild zu sehen sind.',
      nl: 'Zorg ervoor dat er geen heldere flares op de afbeelding staan.',
    },
  },
  [ComplianceIssue.DIRTINESS]: {
    title: {
      en: 'Vehicle dirty',
      fr: 'Véhicule sale',
      de: 'Fahrzeug verschmutzt',
      nl: 'Vervuilde auto',
    },
    description: {
      en: 'Make sure that your vehicle is clean.',
      fr: 'Assurez-vous que le véhicule soit propre.',
      de: 'Stellen Sie sicher, dass Ihr Fahrzeug sauber ist.',
      nl: 'Zorg ervoor dat uw voertuig schoon is.',
    },
  },
  [ComplianceIssue.SNOWNESS]: {
    title: {
      en: 'Vehicle snowy',
      fr: 'Véhicule enneigé',
      de: 'Fahrzeug verschneit',
      nl: 'Besneeuwde auto',
    },
    description: {
      en: "Make sure that there aren't any snow on the vehicle.",
      fr: "Assurez-vous qu'il n'y ait pas de neige sur le véhicule.",
      de: 'Vergewissern Sie sich, dass sich kein Schnee auf dem Fahrzeug befindet.',
      nl: 'Zorg ervoor dat er geen sneeuw op het voertuig zit.',
    },
  },
  [ComplianceIssue.WETNESS]: {
    title: {
      en: 'Vehicle wet',
      fr: 'Véhicule mouillé',
      de: 'Fahrzeug nass',
      nl: 'Natte auto',
    },
    description: {
      en: 'Make sure that the vehicle is dry.',
      fr: "Assurez-vous qu'il n'y ait pas d'eau sur le véhicule.",
      de: 'Stellen Sie sicher, dass das Fahrzeug trocken ist.',
      nl: 'Zorg ervoor dat het voertuig droog is.',
    },
  },
  [ComplianceIssue.REFLECTIONS]: {
    title: {
      en: 'Reflections',
      fr: 'Reflets',
      de: 'Reflexionen',
      nl: 'Reflecties',
    },
    description: {
      en: "Make sure that there are'nt any reflections on the vehicle.",
      fr: "Assurez-vous qu'il n'y ait pas de reflets sur le véhicule.",
      de: 'Vergewissern Sie sich, dass es keine Reflexionen auf dem Fahrzeug gibt.',
      nl: 'Zorg ervoor dat er geen reflecties op het voertuig zijn.',
    },
  },
  [ComplianceIssue.UNKNOWN_SIGHT]: {
    title: {
      en: 'Unknown sight',
      fr: 'Unknown sight',
      de: 'Unknown sight',
      nl: 'Unknown sight',
    },
    description: {
      en: 'Internal Error : Unknown sight.',
      fr: 'Erreur interne : Unknown sight.',
      de: 'Interner Fehler : Unknown sight.',
      nl: 'Interne fout: Unknown sight.',
    },
  },
  [ComplianceIssue.UNKNOWN_VIEWPOINT]: {
    title: {
      en: 'Unknown viewpoint',
      fr: 'Unknown viewpoint',
      de: 'Unknown viewpoint',
      nl: 'Unknown viewpoint',
    },
    description: {
      en: 'Internal Error : Unknown viewpoint.',
      fr: 'Erreur interne : Unknown viewpoint.',
      de: 'Interner Fehler : Unknown viewpoint.',
      nl: 'Interne fout: Unknown viewpoint.',
    },
  },
  [ComplianceIssue.NO_VEHICLE]: {
    title: {
      en: 'No vehicle',
      fr: 'Pas de véhicule',
      de: 'Kein Fahrzeug',
      nl: 'Geen voertuig',
    },
    description: {
      en: 'Make sure that there is a vehicle in the photo.',
      fr: "Assurez-vous qu'il y ait un véhicule sur l'image",
      de: 'Vergewissern Sie sich, dass ein Fahrzeug auf dem Foto zu sehen ist.',
      nl: 'Zorg ervoor dat er een voertuig op de foto staat.',
    },
  },
  [ComplianceIssue.WRONG_ANGLE]: {
    title: {
      en: 'Wrong angle',
      fr: 'Mauvaise angle',
      de: 'Falscher Winkel',
      nl: 'Verkeerde hoek',
    },
    description: {
      en: 'Make sure to properly align the vehicle with the guides.',
      fr: 'Assurez-vous de bien aligner le véhicule avec les guides.',
      de: 'Achten Sie darauf, dass das Fahrzeug richtig an den Führungen ausgerichtet ist.',
      nl: 'Zorg ervoor dat het voertuig goed is uitgelijnd met de gidsen.',
    },
  },
  [ComplianceIssue.WRONG_CENTER_PART]: {
    title: {
      en: 'Wrong center part',
      fr: 'Mauvais centrage',
      de: 'Falsches Mittelteil',
      nl: 'Verkeerd middenstuk',
    },
    description: {
      en: 'Make sure to properly align the vehicle with the guides.',
      fr: 'Assurez-vous de bien aligner le véhicule avec les guides.',
      de: 'Achten Sie darauf, dass das Fahrzeug richtig an den Führungen ausgerichtet ist.',
      nl: 'Zorg ervoor dat het voertuig goed is uitgelijnd met de gidsen.',
    },
  },
  [ComplianceIssue.MISSING_PARTS]: {
    title: {
      en: 'Missing parts',
      fr: 'Parties manquantes',
      de: 'Fehlende Teile',
      nl: 'Ontbrekende onderdelen',
    },
    description: {
      en: 'Make sure to properly align the vehicle with the guides.',
      fr: 'Assurez-vous de bien aligner le véhicule avec les guides.',
      de: 'Achten Sie darauf, dass das Fahrzeug richtig an den Führungen ausgerichtet ist.',
      nl: 'Zorg ervoor dat het voertuig goed is uitgelijnd met de gidsen.',
    },
  },
  [ComplianceIssue.HIDDEN_PARTS]: {
    title: {
      en: 'Hidden parts',
      fr: 'Parties masquées',
      de: 'Versteckte Teile',
      nl: 'Verborgen onderdelen',
    },
    description: {
      en: 'Make sure that nothing is obstructing the vehicule from the camera.',
      fr: 'Assurez-vous que rien ne masque le véhicule.',
      de: 'Vergewissern Sie sich, dass das Fahrzeug nicht von der Kamera verdeckt wird.',
      nl: 'Zorg ervoor dat er niets tussen het voertuig en de camera zit.',
    },
  },
  [ComplianceIssue.TOO_ZOOMED]: {
    title: {
      en: 'Too close',
      fr: 'Trop près',
      de: 'Zu nah',
      nl: 'Te dichtbij',
    },
    description: {
      en: 'Make sure to stand far enough from the vehicle.',
      fr: 'Assurez-vous de vous tenir assez loin du véhicule.',
      de: 'Achten Sie darauf, dass Sie weit genug vom Fahrzeug entfernt stehen.',
      nl: 'Zorg ervoor dat je voldoende afstand houdt van het voertuig.',
    },
  },
  [ComplianceIssue.NOT_ZOOMED_ENOUGH]: {
    title: {
      en: 'Too far',
      fr: 'Trop loin',
      de: 'Zu weit',
      nl: 'Te ver weg',
    },
    description: {
      en: 'Make sure to stand close enough from the vehicle.',
      fr: 'Assurez-vous de vous tenir assez proche du véhicule.',
      de: 'Achten Sie darauf, dass Sie nahe genug am Fahrzeug stehen.',
      nl: 'Zorg ervoor dat je dicht genoeg bij het voertuig staat.',
    },
  },
  [ComplianceIssue.INTERIOR_NOT_SUPPORTED]: {
    title: {
      en: 'Interior not supported',
      fr: 'Interior not supported',
      de: 'Interior not supported',
      nl: 'Interior not supported',
    },
    description: {
      en: 'Internal Error : Interior not supported.',
      fr: 'Erreur interne : Interior not supported.',
      de: 'Interner Fehler : Interior not supported.',
      nl: 'Interne fout: Interior not supported.',
    },
  },
  [ComplianceIssue.MISSING]: {
    title: {
      en: 'Missing',
      fr: 'Missing',
      de: 'Missing',
      nl: 'Missing',
    },
    description: {
      en: 'Internal Error : Missing.',
      fr: 'Erreur interne : Missing.',
      de: 'Interner Fehler : Missing.',
      nl: 'Interne fout: Missing.',
    },
  },
  [ComplianceIssue.LOW_QUALITY]: {
    title: {
      en: 'Low quality',
      fr: 'Basse qualité',
      de: 'Geringe Qualität',
      nl: 'Lage kwaliteit',
    },
    description: {
      en: 'Make sure that the photo has a good quality.',
      fr: 'Assurez-vous de labonne qualité de la photo.',
      de: 'Achten Sie darauf, dass das Foto eine gute Qualität hat.',
      nl: 'Zorg ervoor dat de foto van goede kwaliteit is.',
    },
  },
};
