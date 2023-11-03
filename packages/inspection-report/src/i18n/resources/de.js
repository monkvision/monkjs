import { carPartLabels } from '../../resources';

const de = {
  translation: {
    damageReport: {
      title: 'Schadensbericht',
      tabs: {
        overviewTab: {
          label: 'Übersicht',
        },
        photosTab: {
          label: 'Fotos',
        },
      },
      buttons: {
        done: 'Erledigt',
      },
      parts: {
        ...carPartLabels.de,
      },
      error: {
        message: 'Beim Abrufen der Prüfergebnisse ist ein unerwarteter Fehler aufgetreten.',
        retry: 'Erneut versuchen',
      },
      inspectionInError: {
        message: 'Leider ist während der Inspektion ein unerwarteter Fehler aufgetreten. Bitte kontaktieren Sie den Support mit den folgenden Informationen:',
        id: 'Inspektions-ID',
        tasks: 'Fehlgeschlagene Aufgaben',
        startNewInspection: 'Neue Inspektion',
      },
      loading: 'Inspektionsergebnisse werden abgerufen...',
      notReady: 'Inspektion noch in Bearbeitung...',
      validate: 'Validieren',
      newInspection: 'Neue Inspektion',
      inspection: 'Inspektions-ID',
      vinNumber: 'Fahrgestellnummer',
      download: 'Bericht herunterladen',
      pdfStatus: {
        generating: 'Ihr PDF-Bericht wird gerade erstellt...',
        ready: 'Ihr PDF-Bericht ist fertig',
        error: 'Bei der Erstellung Ihres PDF-Berichts ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.',
      },
      modals: {
        validate: {
          message: 'Sind Sie sicher, dass Sie diesen Bericht validieren wollen? Sie werden den Bericht danach nicht mehr bearbeiten können.',
          yes: 'Ja',
          cancel: 'Abbrechen',
        },
        validateWithPDF: {
          message: 'Sind Sie sicher, dass Sie diesen Bericht validieren und die PDF-Datei generieren möchten? Sie werden den Bericht nicht mehr bearbeiten können.',
          yes: 'Ja',
          cancel: 'Abbrechen',
        },
        newInspection: {
          message: 'Wenn Sie eine neue Inspektion beginnen, verlieren Sie diesen Bericht. Sind Sie sicher, dass Sie fortfahren wollen?',
          yes: 'Ja',
          cancel: 'Abbrechen',
        },
      },
      pictures: 'Pictures',
      partsPictures: 'Teile-Bilder',
      zoomedPicturesOfThePart: 'Vergrößerte Bilder des Teils',
      showDamages: 'Schäden sehen',
      hideDamages: 'Schäden ausblenden',
    },
    gallery: {
      empty: 'Diese Inspektion hat noch kein Foto',
      withDamages: '(mit Schäden)',
    },
    damageManipulator: {
      damages: 'Beschädigungen',
      damaged: 'Dieses Teil ist beschädigt',
      notDamaged: 'Dieses Teil ist nicht beschädigt',
      replaced: 'Dieses Teil muss ersetzt werden',
      notReplaced: 'Dieses Teil muss nicht ersetzt werden',
      severity: 'Schweregrad',
      minor: 'Geringfügig',
      moderate: 'Mäßig',
      major: 'Major',
      repairCost: 'Reparaturkosten',
      done: 'Erledigt',
    },
    severityLabels: {
      pricingOnly: 'Damages',
      low: 'Geringfügig',
      medium: 'Mäßig',
      high: 'Groß',
      none: 'Unbekannt',
    },
  },
};

export default de;
