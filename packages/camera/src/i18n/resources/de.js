const de = {
  translation: {
    closeEarlyModal: {
      cancel: 'Abbrechen',
      confirm: 'Bestätigen',
    },
    camera: {
      permissionDenied: 'Kamera nicht zugänglich: Berechtigung verweigert.',
    },
    controls: {
      takePicture: 'Foto aufnehmen',
      fullScreen: 'Vollbild',
      exitFullScreen: 'Vollbild verlassen',
      settings: 'Einstellungen',
      quit: 'Beenden',
    },
    layout: {
      rotateDevice: 'Bitte drehen Sie Ihr Gerät ↪',
      unlockPortraitMode: 'Sie müssen möglicherweise den Hochformatmodus in den Telefoneinstellungen aktivieren',
    },
    uploadCenter: {
      view: {
        title: 'Bildqualitätsprüfung',
        subtitle: 'Je besser die Bildqualität ist, desto genauere Ergebnisse können wir liefern',
        verifying: 'Überprüfung läuft...',
        tooMuchTodo: 'Wir konnten nicht alle Bilder auf Konformität prüfen, dies könnte die Genauigkeit des Ergebnisses beeinträchtigen',
        allRejected: 'Wir konnten kein Bild hochladen, bitte erneut hochladen',
        loading: 'Laden...',
        retakeAll: 'Alle neu aufnehmen',
        submit: 'Überspringen',
      },
      subtitle: {
        unknown: 'Die Bildqualität konnte nicht überprüft werden',
        pending: 'Laden...',
        failed: 'Wir konnten dieses Bild nicht hochladen',
        idle: 'In der Warteschlange für die Bildqualitätsprüfung...',
        queueBlocked: 'Die Bildqualität konnte nicht überprüft werden (Warteschlange blockiert)',
        reasonsStart: 'Dieses Bild',
        reasonsJoin: 'und',
        reasons: {
          blurriness: 'ist unscharf',
          underexposure: 'ist unterbelichtet (zu dunkel)',
          overexposure: 'ist überbelichtet (zu hell)',
          'TOO_ZOOMED--too zoomed': 'ist zu stark gezoomt',
          'NOT_ZOOMED_ENOUGH--not zoomed enough': 'ist zu weit vom Fahrzeug entfernt',
          'WRONG_ANGLE--wrong angle': 'wurde aus dem falschen Winkel aufgenommen',
          'UNKNOWN_VIEWPOINT--unknown viewpoint': 'entspricht nicht der Fotoanleitung',
          'WRONG_CENTER_PART--picture centered on the wrong parts': 'ist nicht auf dem richtigen Teil zentriert',
          'MISSING_PARTS--missing some parts': 'fehlen wichtige Fahrzeugteile',
          'HIDDEN_PARTS--some parts not visible enough': 'enthält Teile des Fahrzeugs, die nicht ausreichend sichtbar sind',
          'NO_CAR_BODY--no car body detected': 'hat kein deutliches Fahrzeug',
          'NO_CAR_BODY--No car body was detected. Car parts prediction is None.': 'es wurde kein Fahrzeug erkannt',
          UNKNOWN_SIGHT: 'kann nicht auf Fahrzeugabdeckung analysiert werden',
          INTERIOR_NOT_SUPPORTED: 'kann nicht auf Fahrzeugabdeckung analysiert werden',
          NO_CAR_BODY: 'enthält kein Fahrzeug',
          UNKNOWN_VIEWPOINT: 'wurde aus einem unbekannten Blickwinkel aufgenommen',
          WRONG_ANGLE: 'wurde aus dem falschen Winkel aufgenommen',
          WRONG_CENTER_PART: 'ist nicht auf dem richtigen Teil zentriert',
          MISSING_PARTS: 'fehlen einige Fahrzeugteile',
          HIDDEN_PARTS: 'enthält Fahrzeugteile, die nicht ausreichend sichtbar sind',
          TOO_ZOOMED: 'ist zu stark gezoomt',
          NOT_ZOOMED_ENOUGH: 'ist nicht ausreichend gezoomt',
        },
      },
      variant: {
        reupload: {
          label: 'Bild erneut hochladen',
          sublabel: 'hier drücken, um erneut hochzuladen...',
        },
        inQueue: {
          label: 'In der Warteschlange',
        },
        recheck: {
          label: 'Bild erneut überprüfen',
          sublabel: 'hier drücken, um erneut zu überprüfen...',
        },
        retake: {
          label: 'Bild neu aufnehmen',
          sublabel: 'hier drücken, um neu aufzunehmen...',
        },
      },
    },
    partSelector: {
      help: {
        title: 'Zusätzlicher Schaden',
        content: 'Um zusätzliche Fotos des Schadens hinzuzufügen, wählen Sie bitte das Fahrzeugteil aus, an dem der Schaden aufgetreten ist.',
        cancel: 'Abbrechen',
        okay: 'Okay!',
      },
      modal: {
        title: 'Fahrzeugteile auswählen',
        subtitle: 'Bitte wählen Sie Fahrzeugteile aus und verwenden Sie die Pfeiltasten zum Drehen.',
        cancel: 'Abbrechen',
        confirm: 'Bestätigen',
      },
      overlay: {
        title: 'Zusätzliches Foto',
        indication: 'Bitte stellen Sie sicher, dass der Schaden auf dem Bild erfasst ist.',
      },
      parts: {
        bumper_back: 'Heckstoßstange',
        bumper_front: 'Frontstoßstange',
        door_back_left: 'Hintere linke Tür',
        door_back_right: 'Hintere rechte Tür',
        door_front_left: 'Vordere linke Tür',
        door_front_right: 'Vordere rechte Tür',
        fender_back_left: 'Hinterer linker Kotflügel',
        fender_back_right: 'Hinterer rechter Kotflügel',
        fender_front_left: 'Vorderer linker Kotflügel',
        fender_front_right: 'Vorderer rechter Kotflügel',
        fog_light_back_left: 'Hinterer linker Nebelscheinwerfer',
        fog_light_back_right: 'Hinterer rechter Nebelscheinwerfer',
        fog_light_front_left: 'Vorderer linker Nebelscheinwerfer',
        fog_light_front_right: 'Vorderer rechter Nebelscheinwerfer',
        grill_low: 'Unterer Grill',
        grill_radiator: 'Kühlergrill',
        handle_back_left: 'Hinterer linker Türgriff',
        handle_back_right: 'Hinterer rechter Türgriff',
        handle_front_left: 'Vorderer linker Türgriff',
        handle_front_right: 'Vorderer rechter Türgriff',
        head_light_left: 'Linker Scheinwerfer',
        head_light_right: 'Rechter Scheinwerfer',
        mirror_left: 'Linker Spiegel',
        mirror_right: 'Spiegel Rechts',
        quarter_window_back_left: 'Hinteres Viertelfenster Links',
        quarter_window_back_right: 'Hinteres Viertelfenster Rechts',
        quarter_window_front_left: 'Vorderes Viertelfenster Links',
        quarter_window_front_right: 'Vorderes Viertelfenster Rechts',
        rocker_panel_left: 'Seitenschweller Links',
        rocker_panel_right: 'Seitenschweller Rechts',
        tail_light_left: 'Rücklicht Links',
        tail_light_right: 'Rücklicht Rechts',
        wheel_back_left: 'Hinteres Rad Links',
        wheel_back_right: 'Hinteres Rad Rechts',
        wheel_front_left: 'Vorderes Rad Links',
        wheel_front_right: 'Vorderes Rad Rechts',
        window_back_left: 'Hinteres Fenster Links',
        window_back_right: 'Hinteres Fenster Rechts',
        window_corner_left: 'Eckfenster Links',
        window_corner_right: 'Eckfenster Rechts',
        window_front_left: 'Vorderes Fenster Links',
        window_front_right: 'Vorderes Fenster Rechts',
        windshield_back: 'Heckscheibe',
        windshield_front: 'Frontscheibe',
        front_spoiler: 'Frontspoiler',
        rear_spoiler: 'Heckspoiler',
        hood: 'Motorhaube',
        petrol_door: 'Tankdeckel',
        pillar: 'Säule',
        roof: 'Dach',
        trunk: 'Kofferraum',
      },
    },
  },
};

export default de;
