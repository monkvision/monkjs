const de = {
  translation: {
    appLoading: 'App wird gestartet...',
    snackbar: {
      dismiss: 'Schließen',
    },
    inspection: {
      vinNumber: {
        title: 'Fahrgestellnummer (Vehicle Identification Number)',
        description: 'Mit der Kamera erkennen oder manuell eingeben',
      },
      damageDetection: {
        title: 'Schadenserkennung',
        description: 'Karosserie und Felgen / Radkappen',
      },
      status: {
        NOT_STARTED: 'Wartet auf Start',
        TODO: 'In Bearbeitung...',
        IN_PROGRESS: 'In Bearbeitung...',
        DONE: 'Abgeschlossen!',
        ERROR: 'Fehlgeschlagen!',
      },
      vehicle: {
        type: {
          cuv: 'Crossover',
          hatchback: 'Fließheck',
          minivan: 'Minivan',
          pickup: 'Pickup',
          sedan: 'Limousine',
          suv: 'SUV',
          van: 'Van',
        },
      },
    },
    landing: {
      logoDescription: 'Inspektiere dein Auto mit',
      menuHeader: 'Klicken, um eine neue Inspektion zu starten',
      resetInspection: 'Inspektion zurücksetzen',
      lastInspection: 'Letzte Inspektion',
      signOut: 'Abmelden',
      workflowReminder: 'Alle Aufgaben abschließen, um den PDF-Bericht zu generieren.',
      downloadPdf: 'PDF herunterladen',
      downloadPdfDescription: 'Verfügbar, wenn alle Aufgaben abgeschlossen sind',
      appVersion: 'App-Version',
    },
    vinModal: {
      title: 'Wie wird die Fahrgestellnummer festgelegt?',
      camera: 'Mit Kamera erkennen',
      manual: 'Manuell eingeben',
      prompt: {
        title: 'Fahrgestellnummer (Vehicle Identification Number)',
        message: 'Bitte geben Sie die Fahrgestellnummer ein',
        backgroundMessage: 'Bitte füllen Sie den benötigten Inhalt im Prompt aus',
        backgroundGoBack: 'Zurück',
      },
    },
    signin: {
      authRequested: {
        title: 'Authentifizierung angefordert.',
        message: 'Bitte melden Sie sich an, um die Inspektion zu starten.',
        button: 'Anmelden',
      },
      success: {
        title: 'Authentifiziert!',
        message: 'Sie sind angemeldet! Jetzt können Sie die Inspektion starten.',
        button: 'Inspektion starten',
      },
      error: {
        title: 'Entschuldigung 😞',
        message: 'Bei der Authentifizierung ist ein Fehler aufgetreten. Bitte versuchen Sie es in einer Minute erneut.',
        button: 'Zurück zur Startseite',
      },
      loader: {
        signingIn: 'Anmeldung läuft',
        authenticating: 'Authentifizierung läuft',
        robot: 'Überprüfung, ob Sie kein Roboter sind',
        loading: 'Wird geladen',
      },
    },
    createInspection: {
      authError: {
        title: 'Entschuldigung 😞',
        message: 'Sie haben keine Berechtigung, um eine neue Inspektion zu erstellen. Verwenden Sie bitte einen anderen Benutzer oder kontaktieren Sie die Administratoren.',
        button: 'Zurück zur Startseite',
      },
      error: {
        title: 'Entschuldigung 😞',
        message: 'Bei der Erstellung der Inspektion ist ein Fehler aufgetreten. Bitte versuchen Sie es in einer Minute erneut.',
        button: 'Zurück zur Startseite',
      },
    },
    updateInspection: {
      loader: {
        updating: 'Aktualisiere die Inspektion',
        waking: 'Aktiviere die KI',
        processing: 'Verarbeite...',
      },
      error: {
        title: 'Entschuldigung 😞',
        message: 'Bei der Aktualisierung der Inspektion ist ein Fehler aufgetreten. Bitte versuchen Sie es in einer Minute erneut.',
        button: 'Zurück zur Startseite',
      },
    },
    inspectionList: {
      error: {
        title: 'Fehler',
        message: 'Beim Abrufen der Liste Ihrer Inspektionen ist ein Fehler aufgetreten.',
      },
      empty: {
        title: 'Leere Inspektionsliste',
        message: 'Fügen Sie eine neue Inspektion hinzu und sie wird hier angezeigt.',
      },
    },
    capture: {
      quit: {
        title: 'Möchten Sie die Erfassung wirklich beenden?',
        message: 'Ihre aufgenommenen Bilder für diese Aufgabe gehen verloren.',
        cancel: 'Abbrechen',
        ok: 'OK',
      },
      settings: {
        title: 'Einstellungen',
        resolution: 'Auflösung',
        compression: 'Bildkomprimierung',
        fullscreen: 'Vollbild',
        exitFullscreen: 'Vollbild beenden',
        on: 'Ein',
        off: 'Aus',
      },
      custom: '+',
    },
  },
};

export default de;
