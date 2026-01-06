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
      ro: 'Încărcare',
      fr: 'Upload en cours',
      de: 'Hochladen',
      nl: 'Bezig met uploaden',
      it: 'Caricamento in corso',
    },
    description: {
      en: 'This image is being uploaded.',
      ro: 'Imaginea este încărcată.',
      fr: "Upload de l'image en cours.",
      de: 'Dieses Bild wird gerade hochgeladen.',
      nl: 'Deze afbeelding wordt geüpload.',
      it: 'Questa immagine è in fase di caricamento.',
    },
  },
  [ImageStatus.COMPLIANCE_RUNNING]: {
    title: {
      en: 'Analyzing',
      ro: 'Analizare',
      fr: 'Analyse',
      de: 'Analysieren Sie',
      nl: 'Analyseren',
      it: 'Analizzando',
    },
    description: {
      en: 'This image is being analyzed.',
      ro: 'Imaginea este analizată.',
      fr: "Cette image est en train d'être analysée.",
      de: 'Dieses Bild wird gerade analysiert.',
      nl: 'Deze afbeelding wordt geanalyseerd.',
      it: 'Questa immagine è in fase di analisi.',
    },
  },
  [ImageStatus.SUCCESS]: {
    title: {
      en: 'Success',
      ro: 'Succes',
      fr: 'Succès',
      de: 'Erfolg',
      nl: 'Succes',
      it: 'Successo',
    },
    description: {
      en: 'This image seems good, but you can still retake it if you want.',
      ro: 'Imaginea pare bine, dar puteți să o refaceți dacă doriți.',
      fr: 'Cette image paraît bonne, mais vous pouvez quand-même la reprendre si besoin.',
      de: 'Dieses Bild scheint gut zu sein, aber Sie können es noch einmal aufnehmen, wenn Sie wollen.',
      nl: 'Dit beeld lijkt goed, maar je kunt het nog steeds opnieuw maken als je wilt.',
      it: 'Questa immagine sembra buona, ma puoi comunque rifarla se vuoi.',
    },
  },
  [ImageStatus.UPLOAD_FAILED]: {
    title: {
      en: 'Upload failed',
      ro: 'Eșuat încărcarea.',
      fr: 'Upload impossible',
      de: 'Upload fehlgeschlagen',
      nl: 'Upload mislukt',
      it: 'Caricamento non riuscito',
    },
    description: {
      en: 'Make sure you have a good connection and take the photo again.',
      ro: 'Asigurați-vă că aveți o conexiune bună și luați fotografia din nou.',
      fr: 'Vérifiez que vous avez une bonne connexion et reprenez la photo.',
      de: 'Vergewissern Sie sich, dass Sie eine gute Verbindung haben, und machen Sie das Foto erneut.',
      nl: 'Zorg ervoor dat je een goede verbinding hebt en neem de foto opnieuw.',
      it: 'Assicurati di avere una buona connessione e scatta di nuovo la foto.',
    },
  },
  [ImageStatus.UPLOAD_ERROR]: {
    title: {
      en: 'Upload error',
      ro: 'Eroare de încărcare',
      fr: "Erreur d'upload",
      de: 'Upload-Fehler',
      nl: 'Fout bij uploaden',
      it: 'Errore di caricamento',
    },
    description: {
      en: 'An error occurred during the image upload.',
      ro: 'A avut loc o eroare în timpul încărcării imaginii.',
      fr: "Une erreur s'est produite lors de l'upload de l'image.",
      de: 'Beim Hochladen des Bildes ist ein Fehler aufgetreten.',
      nl: 'Er is een fout opgetreden tijdens het uploaden van de afbeelding.',
      it: "Si è verificato un errore durante il caricamento dell'immagine.",
    },
  },
  [ImageStatus.NOT_COMPLIANT]: {
    title: {
      en: 'Error',
      ro: 'Eroare',
      fr: 'Erreur',
      de: 'Fehler',
      nl: 'Fout',
      it: 'Errore',
    },
    description: {
      en: 'Make sure the image quality is good and take the photo again.',
      ro: 'Asigurați-vă că calitatea imaginii este bună și luați o nouă fotografie.',
      fr: "Vérifiez que la qualité de l'image est bonne et reprenez la photo.",
      de: 'Vergewissern Sie sich, dass die Bildqualität gut ist, und machen Sie das Foto erneut.',
      nl: 'Zorg ervoor dat de kwaliteit van de afbeelding goed is en neem de foto opnieuw.',
      it: "Assicurati che la qualità dell'immagine sia buona e scatta di nuovo la foto.",
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
      ro: 'Neconform.',
      fr: 'Non valide',
      de: 'Nicht konform',
      nl: 'Niet-conform',
      it: 'Non conforme',
    },
    description: {
      en: 'Make sure that the image quality is good and that the vehicle is properly aligned with the guides.',
      ro: 'Asigurați-vă că calitatea imaginii este bună și că autovehiculul este corect aliniat cu ghidurile.',
      fr: "Assurez-vous que la qualité de l'image est bonne et que le véhicule est bien aligné avec les guides.",
      de: 'Vergewissern Sie sich, dass die Bildqualität gut ist und dass das Fahrzeug richtig an den Führungslinien ausgerichtet ist.',
      nl: 'Zorg ervoor dat de kwaliteit van de afbeelding goed is en dat het voertuig correct is uitgelijnd met de gidsen.',
      it: "Assicurati che la qualità dell'immagine sia buona e che il veicolo sia correttamente allineato con le guide.",
    },
  },
  [ComplianceIssue.LOW_RESOLUTION]: {
    title: {
      en: 'Low resolution',
      ro: 'Rezoluție scăzută',
      fr: 'Basse résolution',
      de: 'Niedrige Auflösung',
      nl: 'Lage resolutie',
      it: 'Bassa risoluzione',
    },
    description: {
      en: 'Make sure that the image has a good resolution.',
      ro: 'Asigurați-vă că imaginea are o rezoluție bună.',
      fr: "Assurez-vous que l'image ait une résolution suffisante.",
      de: 'Achten Sie darauf, dass das Bild eine gute Auflösung hat.',
      nl: 'Zorg ervoor dat de afbeelding een goede resolutie heeft.',
      it: "Assicurati che l'immagine abbia una buona risoluzione.",
    },
  },
  [ComplianceIssue.BLURRINESS]: {
    title: {
      en: 'Too blurry',
      ro: 'Prea neclar.',
      fr: 'Trop floue',
      de: 'Zu unscharf',
      nl: 'Te vaag',
      it: 'Troppo sfocata',
    },
    description: {
      en: 'Make sure that the image is not blurry.',
      ro: 'Asigurați-vă că imaginea nu este deranjată.',
      fr: "Assurez-vous que l'image ne soit pas trop floue.",
      de: 'Achten Sie darauf, dass das Bild nicht unscharf ist.',
      nl: 'Zorg ervoor dat de afbeelding niet vaag is.',
      it: "Assicurati che l'immagine non sia sfocata.",
    },
  },
  [ComplianceIssue.UNDEREXPOSURE]: {
    title: {
      en: 'Underexposed',
      ro: 'Subexpus',
      fr: 'Sousexposition',
      de: 'Unterbelichtet',
      nl: 'Onderbelicht',
      it: 'Sottoesposto',
    },
    description: {
      en: "Make sure that the image isn't too dark.",
      fr: "Assurez-vous que l'image ne soit pas trop sombre.",
      de: 'Achten Sie darauf, dass das Bild nicht zu dunkel ist.',
      nl: 'Zorg ervoor dat de afbeelding niet te donker is.',
      it: "Assicurati che l'immagine non sia troppo scura.",
    },
  },
  [ComplianceIssue.OVEREXPOSURE]: {
    title: {
      en: 'Overexposed',
      ro: 'Suprasolicitat',
      fr: 'Surexposition',
      de: 'Überbelichtet',
      nl: 'Overbelicht',
      it: 'Sovraesposto',
    },
    description: {
      en: "Make sure that the image isn't too bright.",
      fr: "Assurez-vous que l'image ne soit pas trop lumineuse.",
      de: 'Achten Sie darauf, dass das Bild nicht zu hell ist.',
      nl: 'Zorg ervoor dat de afbeelding niet te licht is.',
      it: "Assicurati che l'immagine non sia troppo luminosa.",
    },
  },
  [ComplianceIssue.LENS_FLARE]: {
    title: {
      en: 'Lens flares',
      ro: 'Focare de lentilă',
      fr: 'Reflets',
      de: 'Objektivreflexe',
      nl: 'Lensflares',
      it: 'Riflessi',
    },
    description: {
      en: "Make sure that there aren't any bright flare on the image.",
      fr: "Assurez-vous que l'image ne contienne pas de reflets.",
      de: 'Vergewissern Sie sich, dass keine hellen Streulichter auf dem Bild zu sehen sind.',
      nl: 'Zorg ervoor dat er geen heldere flares op de afbeelding staan.',
      it: "Assicurati che non ci siano riflessi luminosi sull'immagine.",
    },
  },
  [ComplianceIssue.DIRTINESS]: {
    title: {
      en: 'Vehicle dirty',
      ro: 'Vehicul murdar',
      fr: 'Véhicule sale',
      de: 'Fahrzeug verschmutzt',
      nl: 'Vervuilde auto',
      it: 'Veicolo sporco',
    },
    description: {
      en: 'Make sure that your vehicle is clean.',
      ro: 'Asigurați-vă că autovehiculul dumneavoastră este curat.',
      fr: 'Assurez-vous que le véhicule soit propre.',
      de: 'Stellen Sie sicher, dass Ihr Fahrzeug sauber ist.',
      nl: 'Zorg ervoor dat uw voertuig schoon is.',
      it: 'Assicurati che il tuo veicolo sia pulito.',
    },
  },
  [ComplianceIssue.SNOWNESS]: {
    title: {
      en: 'Vehicle snowy',
      ro: 'Vehicul zăpadat',
      fr: 'Véhicule enneigé',
      de: 'Fahrzeug verschneit',
      nl: 'Besneeuwde auto',
      it: 'Veicolo innevato',
    },
    description: {
      en: "Make sure that there aren't any snow on the vehicle.",
      fr: "Assurez-vous qu'il n'y ait pas de neige sur le véhicule.",
      de: 'Vergewissern Sie sich, dass sich kein Schnee auf dem Fahrzeug befindet.',
      nl: 'Zorg ervoor dat er geen sneeuw op het voertuig zit.',
      it: 'Assicurati che non ci sia neve sul veicolo.',
    },
  },
  [ComplianceIssue.WETNESS]: {
    title: {
      en: 'Vehicle wet',
      ro: 'Vehicul umed',
      fr: 'Véhicule mouillé',
      de: 'Fahrzeug nass',
      nl: 'Natte auto',
      it: 'Veicolo bagnato',
    },
    description: {
      en: 'Make sure that the vehicle is dry.',
      ro: 'Asigurați-vă că vehiculul este uscat.',
      fr: "Assurez-vous qu'il n'y ait pas d'eau sur le véhicule.",
      de: 'Stellen Sie sicher, dass das Fahrzeug trocken ist.',
      nl: 'Zorg ervoor dat het voertuig droog is.',
      it: 'Assicurati che il veicolo sia asciutto.',
    },
  },
  [ComplianceIssue.REFLECTIONS]: {
    title: {
      en: 'Reflections',
      ro: 'Reflecții',
      fr: 'Reflets',
      de: 'Reflexionen',
      nl: 'Reflecties',
      it: 'Riflessi',
    },
    description: {
      en: "Make sure that there are'nt any reflections on the vehicle.",
      fr: "Assurez-vous qu'il n'y ait pas de reflets sur le véhicule.",
      de: 'Vergewissern Sie sich, dass es keine Reflexionen auf dem Fahrzeug gibt.',
      nl: 'Zorg ervoor dat er geen reflecties op het voertuig zijn.',
      it: 'Assicurati che non ci siano riflessi sul veicolo.',
    },
  },
  [ComplianceIssue.UNKNOWN_SIGHT]: {
    title: {
      en: 'Unknown sight',
      ro: 'Vedere necunoscută',
      fr: 'Unknown sight',
      de: 'Unknown sight',
      nl: 'Unknown sight',
      it: 'Unknown sight',
    },
    description: {
      en: 'Internal Error : Unknown sight.',
      ro: 'Eroare Internă : Vizibilitate Necunoscută.',
      fr: 'Erreur interne : Unknown sight.',
      de: 'Interner Fehler : Unknown sight.',
      nl: 'Interne fout: Unknown sight.',
      it: 'Errore interno: Unknown sight.',
    },
  },
  [ComplianceIssue.UNKNOWN_VIEWPOINT]: {
    title: {
      en: 'Unknown viewpoint',
      ro: 'Punct de vedere necunoscut',
      fr: 'Unknown viewpoint',
      de: 'Unknown viewpoint',
      nl: 'Unknown viewpoint',
      it: 'Unknown viewpoint',
    },
    description: {
      en: 'Internal Error : Unknown viewpoint.',
      ro: 'Eroare Internă : Punct de vedere necunoscut.',
      fr: 'Erreur interne : Unknown viewpoint.',
      de: 'Interner Fehler : Unknown viewpoint.',
      nl: 'Interne fout: Unknown viewpoint.',
      it: 'Errore interno: Unknown viewpoint.',
    },
  },
  [ComplianceIssue.NO_VEHICLE]: {
    title: {
      en: 'No vehicle',
      ro: 'Nicio mașină.',
      fr: 'Pas de véhicule',
      de: 'Kein Fahrzeug',
      nl: 'Geen voertuig',
      it: 'Nessun veicolo',
    },
    description: {
      en: 'Make sure that there is a vehicle in the photo.',
      ro: 'Asigurați-vă că există un vehicul în fotografia prezentată.',
      fr: "Assurez-vous qu'il y ait un véhicule sur l'image",
      de: 'Vergewissern Sie sich, dass ein Fahrzeug auf dem Foto zu sehen ist.',
      nl: 'Zorg ervoor dat er een voertuig op de foto staat.',
      it: 'Assicurati che ci sia un veicolo nella foto.',
    },
  },
  [ComplianceIssue.WRONG_ANGLE]: {
    title: {
      en: 'Wrong angle',
      ro: 'Unghi greșit',
      fr: 'Mauvaise angle',
      de: 'Falscher Winkel',
      nl: 'Verkeerde hoek',
      it: 'Angolo sbagliato',
    },
    description: {
      en: 'Make sure to properly align the vehicle with the guides.',
      ro: 'Asigurați-vă că vehiculul este aliniat corect cu ghidurile.',
      fr: 'Assurez-vous de bien aligner le véhicule avec les guides.',
      de: 'Achten Sie darauf, dass das Fahrzeug richtig an den Führungen ausgerichtet ist.',
      nl: 'Zorg ervoor dat het voertuig goed is uitgelijnd met de gidsen.',
      it: 'Assicurati di allineare correttamente il veicolo con le guide.',
    },
  },
  [ComplianceIssue.WRONG_CENTER_PART]: {
    title: {
      en: 'Wrong center part',
      ro: 'Partea centrală greșită.',
      fr: 'Mauvais centrage',
      de: 'Falsches Mittelteil',
      nl: 'Verkeerd middenstuk',
      it: 'Parte centrale sbagliata',
    },
    description: {
      en: 'Make sure to properly align the vehicle with the guides.',
      ro: 'Asigurați-vă că vehiculul este aliniat corect cu ghidurile.',
      fr: 'Assurez-vous de bien aligner le véhicule avec les guides.',
      de: 'Achten Sie darauf, dass das Fahrzeug richtig an den Führungen ausgerichtet ist.',
      nl: 'Zorg ervoor dat het voertuig goed is uitgelijnd met de gidsen.',
      it: 'Assicurati di allineare correttamente il veicolo con le guide.',
    },
  },
  [ComplianceIssue.MISSING_PARTS]: {
    title: {
      en: 'Missing parts',
      ro: 'Părți lipsă',
      fr: 'Parties manquantes',
      de: 'Fehlende Teile',
      nl: 'Ontbrekende onderdelen',
      it: 'Parti mancanti',
    },
    description: {
      en: 'Make sure to properly align the vehicle with the guides.',
      ro: 'Asigurați-vă că vehiculul este aliniat corect cu ghidurile.',
      fr: 'Assurez-vous de bien aligner le véhicule avec les guides.',
      de: 'Achten Sie darauf, dass das Fahrzeug richtig an den Führungen ausgerichtet ist.',
      nl: 'Zorg ervoor dat het voertuig goed is uitgelijnd met de gidsen.',
      it: 'Assicurati di allineare correttamente il veicolo con le guide.',
    },
  },
  [ComplianceIssue.HIDDEN_PARTS]: {
    title: {
      en: 'Hidden parts',
      ro: 'Părți ascunse',
      fr: 'Parties masquées',
      de: 'Versteckte Teile',
      nl: 'Verborgen onderdelen',
      it: 'Parti nascoste',
    },
    description: {
      en: 'Make sure that nothing is obstructing the vehicule from the camera.',
      ro: 'Asigurați-vă că nimic nu împiedică vehiculul să fie vizibil de la cameră.',
      fr: 'Assurez-vous que rien ne masque le véhicule.',
      de: 'Vergewissern Sie sich, dass das Fahrzeug nicht von der Kamera verdeckt wird.',
      nl: 'Zorg ervoor dat er niets tussen het voertuig en de camera zit.',
      it: 'Assicurati che nulla ostruisca il veicolo dalla fotocamera.',
    },
  },
  [ComplianceIssue.TOO_ZOOMED]: {
    title: {
      en: 'Too close',
      ro: 'Prea aproape',
      fr: 'Trop près',
      de: 'Zu nah',
      nl: 'Te dichtbij',
      it: 'Troppo vicino',
    },
    description: {
      en: 'Make sure to stand far enough from the vehicle.',
      ro: 'Asigurați-vă că staționați la o distanță suficient de mare față de vehicul.',
      fr: 'Assurez-vous de vous tenir assez loin du véhicule.',
      de: 'Achten Sie darauf, dass Sie weit genug vom Fahrzeug entfernt stehen.',
      nl: 'Zorg ervoor dat je voldoende afstand houdt van het voertuig.',
      it: 'Assicurati di stare abbastanza lontano dal veicolo.',
    },
  },
  [ComplianceIssue.NOT_ZOOMED_ENOUGH]: {
    title: {
      en: 'Too far',
      ro: 'Prea departe',
      fr: 'Trop loin',
      de: 'Zu weit',
      nl: 'Te ver weg',
      it: 'Troppo lontano',
    },
    description: {
      en: 'Make sure to stand close enough from the vehicle.',
      ro: 'Asigurați-vă că staționați la o distanță suficient de mică față de vehicul.',
      fr: 'Assurez-vous de vous tenir assez proche du véhicule.',
      de: 'Achten Sie darauf, dass Sie nahe genug am Fahrzeug stehen.',
      nl: 'Zorg ervoor dat je dicht genoeg bij het voertuig staat.',
      it: 'Assicurati di stare abbastanza vicino al veicolo.',
    },
  },
  [ComplianceIssue.INTERIOR_NOT_SUPPORTED]: {
    title: {
      en: 'Interior not supported',
      ro: 'Interiorul nu este susținut.',
      fr: 'Interior not supported',
      de: 'Interior not supported',
      nl: 'Interior not supported',
      it: 'Interior not supported',
    },
    description: {
      en: 'Internal Error : Interior not supported.',
      ro: 'Eroare Internă : Interiorul nu este suportat.',
      fr: 'Erreur interne : Interior not supported.',
      de: 'Interner Fehler : Interior not supported.',
      nl: 'Interne fout: Interior not supported.',
      it: 'Errore interno: Interior not supported.',
    },
  },
  [ComplianceIssue.MISSING]: {
    title: {
      en: 'Missing',
      ro: 'Încărcarea lipsă',
      fr: 'Missing',
      de: 'Missing',
      nl: 'Missing',
      it: 'Missing',
    },
    description: {
      en: 'Internal Error : Missing.',
      ro: 'Eroare Internă: Lipsă.',
      fr: 'Erreur interne : Missing.',
      de: 'Interner Fehler : Missing.',
      nl: 'Interne fout: Missing.',
      it: 'Errore interno: Missing.',
    },
  },
  [ComplianceIssue.LOW_QUALITY]: {
    title: {
      en: 'Low quality',
      ro: 'Calitate scăzută',
      fr: 'Basse qualité',
      de: 'Geringe Qualität',
      nl: 'Lage kwaliteit',
      it: 'Bassa qualità',
    },
    description: {
      en: 'Make sure that the photo has a good quality.',
      ro: 'Asigurați-vă că fotografia are o calitate bună.',
      fr: 'Assurez-vous de labonne qualité de la photo.',
      de: 'Achten Sie darauf, dass das Foto eine gute Qualität hat.',
      nl: 'Zorg ervoor dat de foto van goede kwaliteit is.',
      it: 'Assicurati che la foto sia di buona qualità.',
    },
  },
  [ComplianceIssue.PORTRAIT_IMAGE]: {
    title: {
      en: 'Portrait Image',
      ro: 'Imaginea de profil',
      fr: 'Image en mode portrait',
      de: 'Hochformatbild',
      nl: 'Portretfoto',
      it: 'Immagine verticale',
    },
    description: {
      en: 'The picture is in portrait mode, please take it in landscape',
      ro: 'Imaginea este în mod portret, vă rog să o luați în mod peisaj.',
      fr: 'L’image est en mode portrait, veuillez la prendre en mode paysage',
      de: 'Das Bild ist im Hochformat, bitte fotografieren Sie im Querformat',
      nl: 'De foto is in portretstand, neem deze alstublieft in landschapmodus',
      it: "L'immagine è in modalità verticale, scattala in orizzontale",
    },
  },
};
