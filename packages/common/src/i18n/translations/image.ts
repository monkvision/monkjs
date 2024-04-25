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
    },
    description: {
      en: 'This image is being uploaded.',
      fr: "Upload de l'image en cours.",
      de: 'Dieses Bild wird gerade hochgeladen.',
    },
  },
  [ImageStatus.COMPLIANCE_RUNNING]: {
    title: {
      en: 'Analyzing',
      fr: 'Analyse',
      de: 'Analysieren Sie',
    },
    description: {
      en: 'This image is being analyzed.',
      fr: "Cette image est en train d'être analysée.",
      de: 'Dieses Bild wird gerade analysiert.',
    },
  },
  [ImageStatus.SUCCESS]: {
    title: {
      en: 'Success',
      fr: 'Succès',
      de: 'Erfolg',
    },
    description: {
      en: 'This image was uploaded successfully.',
      fr: "L'image a bien été uploadée.",
      de: 'Dieses Bild wurde erfolgreich hochgeladen.',
    },
  },
  [ImageStatus.UPLOAD_FAILED]: {
    title: {
      en: 'Upload failed',
      fr: 'Upload impossible',
      de: 'Upload fehlgeschlagen',
    },
    description: {
      en: 'Make sure you have a good connection and take the photo again.',
      fr: 'Vérifiez que vous avez une bonne connexion et reprenez la photo.',
      de: 'Vergewissern Sie sich, dass Sie eine gute Verbindung haben, und machen Sie das Foto erneut.',
    },
  },
  [ImageStatus.NOT_COMPLIANT]: {
    title: {
      en: 'Error',
      fr: 'Erreur',
      de: 'Fehler',
    },
    description: {
      en: 'Make sure the image quality is good and take the photo again.',
      fr: "Vérifiez que la qualité de l'image est bonne et reprenez la photo.",
      de: 'Vergewissern Sie sich, dass die Bildqualität gut ist, und machen Sie das Foto erneut.',
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
    },
    description: {
      en: 'Make sure that the image quality is good and that the vehicle is properly aligned with the guides.',
      fr: "Assurez-vous que la qualité de l'image est bonne et que le véhicule est bien aligné avec les guides.",
      de: 'Vergewissern Sie sich, dass die Bildqualität gut ist und dass das Fahrzeug richtig an den Führungslinien ausgerichtet ist.',
    },
  },
  [ComplianceIssue.LOW_RESOLUTION]: {
    title: {
      en: 'Low resolution',
      fr: 'Basse résolution',
      de: 'Niedrige Auflösung',
    },
    description: {
      en: 'Make sure that the image has a good resolution.',
      fr: "Assurez-vous que l'image ait une résolution suffisante.",
      de: 'Achten Sie darauf, dass das Bild eine gute Auflösung hat.',
    },
  },
  [ComplianceIssue.BLURRINESS]: {
    title: {
      en: 'Too blurry',
      fr: 'Trop floue',
      de: 'Zu unscharf',
    },
    description: {
      en: 'Make sure that the image is not blurry.',
      fr: "Assurez-vous que l'image ne soit pas trop floue.",
      de: 'Achten Sie darauf, dass das Bild nicht unscharf ist.',
    },
  },
  [ComplianceIssue.UNDEREXPOSURE]: {
    title: {
      en: 'Underexposed',
      fr: 'Sousexposition',
      de: 'Unterbelichtet',
    },
    description: {
      en: "Make sure that the image isn't too dark.",
      fr: "Assurez-vous que l'image ne soit pas trop sombre.",
      de: 'Achten Sie darauf, dass das Bild nicht zu dunkel ist.',
    },
  },
  [ComplianceIssue.OVEREXPOSURE]: {
    title: {
      en: 'Overexposed',
      fr: 'Surexposition',
      de: 'Überbelichtet',
    },
    description: {
      en: "Make sure that the image isn't too bright.",
      fr: "Assurez-vous que l'image ne soit pas trop lumineuse.",
      de: 'Achten Sie darauf, dass das Bild nicht zu hell ist.',
    },
  },
  [ComplianceIssue.LENS_FLARE]: {
    title: {
      en: 'Lens flares',
      fr: 'Reflets',
      de: 'Objektivreflexe',
    },
    description: {
      en: "Make sure that there aren't any bright flare on the image.",
      fr: "Assurez-vous que l'image ne contienne pas de reflets.",
      de: 'Vergewissern Sie sich, dass keine hellen Streulichter auf dem Bild zu sehen sind.',
    },
  },
  [ComplianceIssue.DIRTINESS]: {
    title: {
      en: 'Vehicle dirty',
      fr: 'Véhicule sale',
      de: 'Fahrzeug verschmutzt',
    },
    description: {
      en: 'Make sure that your vehicle is clean.',
      fr: 'Assurez-vous que le véhicule soit propre.',
      de: 'Stellen Sie sicher, dass Ihr Fahrzeug sauber ist.',
    },
  },
  [ComplianceIssue.SNOWNESS]: {
    title: {
      en: 'Vehicle snowy',
      fr: 'Véhicule enneigé',
      de: 'Fahrzeug verschneit',
    },
    description: {
      en: "Make sure that there aren't any snow on the vehicle.",
      fr: "Assurez-vous qu'il n'y ait pas de neige sur le véhicule.",
      de: 'Vergewissern Sie sich, dass sich kein Schnee auf dem Fahrzeug befindet.',
    },
  },
  [ComplianceIssue.WETNESS]: {
    title: {
      en: 'Vehicle wet',
      fr: 'Véhicule mouillé',
      de: 'Fahrzeug nass',
    },
    description: {
      en: 'Make sure that the vehicle is dry.',
      fr: "Assurez-vous qu'il n'y ait pas d'eau sur le véhicule.",
      de: 'Stellen Sie sicher, dass das Fahrzeug trocken ist.',
    },
  },
  [ComplianceIssue.REFLECTIONS]: {
    title: {
      en: 'Reflections',
      fr: 'Reflets',
      de: 'Reflexionen',
    },
    description: {
      en: "Make sure that there are'nt any reflections on the vehicle.",
      fr: "Assurez-vous qu'il n'y ait pas de reflets sur le véhicule.",
      de: 'Vergewissern Sie sich, dass es keine Reflexionen auf dem Fahrzeug gibt.',
    },
  },
  [ComplianceIssue.UNKNOWN_SIGHT]: {
    title: {
      en: 'Unknown sight',
      fr: 'Unknown sight',
      de: 'Unknown sight',
    },
    description: {
      en: 'Internal Error : Unknown sight.',
      fr: 'Erreur interne : Unknown sight.',
      de: 'Interner Fehler : Unknown sight.',
    },
  },
  [ComplianceIssue.UNKNOWN_VIEWPOINT]: {
    title: {
      en: 'Unknown viewpoint',
      fr: 'Unknown viewpoint',
      de: 'Unknown viewpoint',
    },
    description: {
      en: 'Internal Error : Unknown viewpoint.',
      fr: 'Erreur interne : Unknown viewpoint.',
      de: 'Interner Fehler : Unknown viewpoint.',
    },
  },
  [ComplianceIssue.NO_VEHICLE]: {
    title: {
      en: 'No vehicle',
      fr: 'Pas de véhicule',
      de: 'Kein Fahrzeug',
    },
    description: {
      en: 'Make sure that there is a vehicle in the photo.',
      fr: "Assurez-vous qu'il y ait un véhicule sur l'image",
      de: 'Vergewissern Sie sich, dass ein Fahrzeug auf dem Foto zu sehen ist.',
    },
  },
  [ComplianceIssue.WRONG_ANGLE]: {
    title: {
      en: 'Wrong angle',
      fr: 'Mauvaise angle',
      de: 'Falscher Winkel',
    },
    description: {
      en: 'Make sure to properly align the vehicle with the guides.',
      fr: 'Assurez-vous de bien aligner le véhicule avec les guides.',
      de: 'Achten Sie darauf, dass das Fahrzeug richtig an den Führungen ausgerichtet ist.',
    },
  },
  [ComplianceIssue.WRONG_CENTER_PART]: {
    title: {
      en: 'Wrong center part',
      fr: 'Mauvais centrage',
      de: 'Falsches Mittelteil',
    },
    description: {
      en: 'Make sure to properly align the vehicle with the guides.',
      fr: 'Assurez-vous de bien aligner le véhicule avec les guides.',
      de: 'Achten Sie darauf, dass das Fahrzeug richtig an den Führungen ausgerichtet ist.',
    },
  },
  [ComplianceIssue.MISSING_PARTS]: {
    title: {
      en: 'Missing parts',
      fr: 'Parties manquantes',
      de: 'Fehlende Teile',
    },
    description: {
      en: 'Make sure to properly align the vehicle with the guides.',
      fr: 'Assurez-vous de bien aligner le véhicule avec les guides.',
      de: 'Achten Sie darauf, dass das Fahrzeug richtig an den Führungen ausgerichtet ist.',
    },
  },
  [ComplianceIssue.HIDDEN_PARTS]: {
    title: {
      en: 'Hidden parts',
      fr: 'Parties masquées',
      de: 'Versteckte Teile',
    },
    description: {
      en: 'Make sure that nothing is obstructing the vehicule from the camera.',
      fr: 'Assurez-vous que rien ne masque le véhicule.',
      de: 'Vergewissern Sie sich, dass das Fahrzeug nicht von der Kamera verdeckt wird.',
    },
  },
  [ComplianceIssue.TOO_ZOOMED]: {
    title: {
      en: 'Too close',
      fr: 'Trop près',
      de: 'Zu nah',
    },
    description: {
      en: 'Make sure to stand far enough from the vehicle.',
      fr: 'Assurez-vous de vous tenir assez loin du véhicule.',
      de: 'Achten Sie darauf, dass Sie weit genug vom Fahrzeug entfernt stehen.',
    },
  },
  [ComplianceIssue.NOT_ZOOMED_ENOUGH]: {
    title: {
      en: 'Too far',
      fr: 'Trop loin',
      de: 'Zu weit',
    },
    description: {
      en: 'Make sure to stand close enough from the vehicle.',
      fr: 'Assurez-vous de vous tenir assez proche du véhicule.',
      de: 'Achten Sie darauf, dass Sie nahe genug am Fahrzeug stehen.',
    },
  },
  [ComplianceIssue.INTERIOR_NOT_SUPPORTED]: {
    title: {
      en: 'Interior not supported',
      fr: 'Interior not supported',
      de: 'Interior not supported',
    },
    description: {
      en: 'Internal Error : Interior not supported.',
      fr: 'Erreur interne : Interior not supported.',
      de: 'Interner Fehler : Interior not supported.',
    },
  },
  [ComplianceIssue.MISSING]: {
    title: {
      en: 'Missing',
      fr: 'Missing',
      de: 'Missing',
    },
    description: {
      en: 'Internal Error : Missing.',
      fr: 'Erreur interne : Missing.',
      de: 'Interner Fehler : Missing.',
    },
  },
  [ComplianceIssue.LOW_QUALITY]: {
    title: {
      en: 'Low quality',
      fr: 'Basse qualité',
      de: 'Geringe Qualität',
    },
    description: {
      en: 'Make sure that the photo has a good quality.',
      fr: 'Assurez-vous de labonne qualité de la photo.',
      de: 'Achten Sie darauf, dass das Foto eine gute Qualität hat.',
    },
  },
};
