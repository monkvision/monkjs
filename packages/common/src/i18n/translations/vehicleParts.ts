import { TranslationObject, VehiclePart } from '@monkvision/types';

/**
 * The translated labels for each vehicle part available in the SDK.
 */
export const vehiclePartLabels: Record<VehiclePart, TranslationObject> = {
  [VehiclePart.IGNORE]: {
    en: 'IGNORE',
    fr: 'IGNORE',
    de: 'IGNORE',
    nl: 'IGNORE',
  },
  [VehiclePart.BUMPER_BACK]: {
    en: 'Rear Bumper',
    fr: 'Pare-chocs arrière',
    de: 'Hintere Stoßstange',
    nl: 'Achterbumper',
  },
  [VehiclePart.BUMPER_FRONT]: {
    en: 'Front Bumper',
    fr: 'Pare-chocs avant',
    de: 'Vordere Stoßstange',
    nl: 'Voorbumper',
  },
  [VehiclePart.DOOR_BACK_LEFT]: {
    en: 'Rear Door Left',
    fr: 'Portière arrière droite',
    de: 'Tür hinten rechts',
    nl: 'Achterdeur links',
  },
  [VehiclePart.DOOR_BACK_RIGHT]: {
    en: 'Rear Door Right',
    fr: 'Portière arrière gauche',
    de: 'Tür hinten links',
    nl: 'Achterdeur rechts',
  },
  [VehiclePart.DOOR_FRONT_LEFT]: {
    en: 'Front Door Left',
    fr: 'Portière avant droite',
    de: 'Vordertür rechts',
    nl: 'Voordeur links',
  },
  [VehiclePart.DOOR_FRONT_RIGHT]: {
    en: 'Front Door Right',
    fr: 'Portière avant gauche',
    de: 'Tür vorne links',
    nl: 'Voordeur rechts',
  },
  [VehiclePart.FENDER_BACK_LEFT]: {
    en: 'Rear Fender Left',
    fr: 'Aile arrière gauche',
    de: 'Kotflügel hinten links',
    nl: 'Achterkant linker spatbord',
  },
  [VehiclePart.FENDER_BACK_RIGHT]: {
    en: 'Rear Fender Right',
    fr: 'Aile arrière droite',
    de: 'Kotflügel hinten rechts',
    nl: 'Achterkant rechter spatbord',
  },
  [VehiclePart.FENDER_FRONT_LEFT]: {
    en: 'Front Fender Left',
    fr: 'Aile avant gauche',
    de: 'Linker vorderer Kotflügel',
    nl: 'Voorste linker spatbord',
  },
  [VehiclePart.FENDER_FRONT_RIGHT]: {
    en: 'Front Fender Right',
    fr: 'Aile avant droite',
    de: 'Rechter vorderer Flügel',
    nl: 'Voorste rechter spatbord',
  },
  [VehiclePart.FOG_LIGHT_BACK_LEFT]: {
    en: 'Rear Fog Light Left',
    fr: 'Phare anti-brouillard arrière gauche',
    de: 'Nebelscheinwerfer hinten links',
    nl: 'Achterste linker mistlamp',
  },
  [VehiclePart.FOG_LIGHT_BACK_RIGHT]: {
    en: 'Rear Fog Light Right',
    fr: 'Phare anti-brouillard arrière droit',
    de: 'Nebelscheinwerfer hinten rechts',
    nl: 'Achterste rechter mistlamp',
  },
  [VehiclePart.FOG_LIGHT_FRONT_LEFT]: {
    en: 'Front Fog Light Left',
    fr: 'Phare anti-brouillard avant gauche',
    de: 'Nebelscheinwerfer vorne links',
    nl: 'Voorste linker mistlamp',
  },
  [VehiclePart.FOG_LIGHT_FRONT_RIGHT]: {
    en: 'Front Fog Light Right',
    fr: 'Phare anti-brouillard avant droit',
    de: 'Nebelscheinwerfer vorne rechts',
    nl: 'Voorste rechter mistlamp',
  },
  [VehiclePart.GRILL]: {
    en: 'Grill',
    fr: 'Grille',
    de: 'Gitter',
    nl: 'Grill',
  },
  [VehiclePart.GRILL_LOW]: {
    en: 'Grill Low',
    fr: 'Grille bas',
    de: 'Gitter unten',
    nl: 'Lage grill',
  },
  [VehiclePart.GRILL_RADIATOR]: {
    en: 'Radiator Grill',
    fr: 'Grille radiateur',
    de: 'Heizkörpergitter',
    nl: 'Radiatorgrill',
  },
  [VehiclePart.HANDLE_BACK_LEFT]: {
    en: 'Rear Handle Left',
    fr: 'Poignée arrière gauche',
    de: 'Griff hinten links',
    nl: 'Achterste linker greep',
  },
  [VehiclePart.HANDLE_BACK_RIGHT]: {
    en: 'Rear Handle Right',
    fr: 'Poignée arrière droite',
    de: 'Griff hinten rechts',
    nl: 'Achterste rechter greep',
  },
  [VehiclePart.HANDLE_FRONT_LEFT]: {
    en: 'Front Handle Left',
    fr: 'Poignée avant gauche',
    de: 'Griff vorne links',
    nl: 'Voorste linker greep',
  },
  [VehiclePart.HANDLE_FRONT_RIGHT]: {
    en: 'Front Handle Right',
    fr: 'Poignée avant droite',
    de: 'Griff vorne rechts',
    nl: 'Voorste rechter greep',
  },
  [VehiclePart.HEADER_PANEL]: {
    en: 'Header Panel',
    fr: 'Panneau de tête',
    de: 'Kopfleiste',
    nl: 'Headerpaneel',
  },
  [VehiclePart.HEAD_LIGHT_LEFT]: {
    en: 'Head Light Left',
    fr: 'Phare gauche',
    de: 'Linker Scheinwerfer',
    nl: 'Linker koplamp',
  },
  [VehiclePart.HEAD_LIGHT_RIGHT]: {
    en: 'Head Light Right',
    fr: 'Phare droit',
    de: 'Rechter Scheinwerfer',
    nl: 'Rechter koplamp',
  },
  [VehiclePart.HOOK]: {
    en: 'Tow Hook',
    fr: 'Crochet de remorquage',
    de: 'Abschlepphaken',
    nl: 'Trekhaak',
  },
  [VehiclePart.HUBCAP]: {
    en: 'Hubcap',
    fr: 'Enjoliveur',
    de: 'Radkappe',
    nl: 'Velgmuts',
  },
  [VehiclePart.HUBCAP_BACK_LEFT]: {
    en: 'Rear Hubcap Left',
    fr: 'Enjoliveur arrière gauche',
    de: 'Radkappe hinten links',
    nl: 'Achterste linker velgmuts',
  },
  [VehiclePart.HUBCAP_BACK_RIGHT]: {
    en: 'Rear Hubcap Right',
    fr: 'Enjoliveur arrière droit',
    de: 'Radkappe hinten rechts',
    nl: 'Achterste rechter velgmuts',
  },
  [VehiclePart.HUBCAP_FRONT_LEFT]: {
    en: 'Front Hubcap Left',
    fr: 'Enjoliveur avant gauche',
    de: 'Radkappe vorne links',
    nl: 'Voorste linker velgmuts',
  },
  [VehiclePart.HUBCAP_FRONT_RIGHT]: {
    en: 'Front Hubcap Right',
    fr: 'Enjoliveur avant droite',
    de: 'Radkappe vorne rechts',
    nl: 'Voorste rechter velgmuts',
  },
  [VehiclePart.INDICATOR_LIGHT_LEFT]: {
    en: 'Indicator Light Left',
    fr: 'Clignotant gauche',
    de: 'Blinkend links',
    nl: 'Linker richtingaanwijzer',
  },
  [VehiclePart.INDICATOR_LIGHT_RIGHT]: {
    en: 'Indicator Light Right',
    fr: 'Clignotant droit',
    de: 'Blinkend rechts',
    nl: 'Rechter richtingaanwijzer',
  },
  [VehiclePart.LICENSE_PLATE_BACK]: {
    en: 'Rear License Plate',
    fr: "Plaque d'immatriculation arrière",
    de: 'Autokennzeichen hinten',
    nl: 'Achterste nummerplaat',
  },
  [VehiclePart.LICENSE_PLATE_FRONT]: {
    en: 'Front License Plate',
    fr: "Plaque d'immatriculation avant",
    de: 'Autokennzeichen vorne',
    nl: 'Voorste nummerplaat',
  },
  [VehiclePart.LOGO]: {
    en: 'Logo',
    fr: 'Logo',
    de: 'Logo',
    nl: 'Logo',
  },
  [VehiclePart.MIRROR_LEFT]: {
    en: 'Mirror Left',
    fr: 'Rétroviseur gauche',
    de: 'Linker Spiegel',
    nl: 'Linker spiegel',
  },
  [VehiclePart.MIRROR_RIGHT]: {
    en: 'Mirror Right',
    fr: 'Rétroviseur droit',
    de: 'Rechter Spiegel',
    nl: 'Rechter spiegel',
  },
  [VehiclePart.MIRROR_SUPPORT]: {
    en: 'Mirror Support',
    fr: 'Support de rétroviseur',
    de: 'Spiegelhalterung',
    nl: 'Spiegelsteun',
  },
  [VehiclePart.QUARTER_WINDOW_BACK_LEFT]: {
    en: 'Rear Quarter Window Left',
    fr: 'Vitres latérale arrière gauche',
    de: 'Seitenfenster hinten links',
    nl: 'Achterste linker zijkantvenster',
  },
  [VehiclePart.QUARTER_WINDOW_BACK_RIGHT]: {
    en: 'Rear Quarter Window Right',
    fr: 'Vitres latérale arrière droite',
    de: 'Seitenfenster hinten rechts',
    nl: 'Achterste rechter zijkantvenster',
  },
  [VehiclePart.QUARTER_WINDOW_FRONT_LEFT]: {
    en: 'Front Quarter Window Left',
    fr: 'Vitres latérale avant gauche',
    de: 'Seitenfenster vorne links',
    nl: 'Voorste linker zijkantvenster',
  },
  [VehiclePart.QUARTER_WINDOW_FRONT_RIGHT]: {
    en: 'Front Quarter Window Right',
    fr: 'Vitres latérale avant droite',
    de: 'Seitenfenster vorne rechts',
    nl: 'Voorste rechter zijkantvenster',
  },
  [VehiclePart.ROCKER_PANEL]: {
    en: 'Rocker Panel',
    fr: 'Bas de caisse',
    de: 'Schweller',
    nl: 'Rockerpaneel',
  },
  [VehiclePart.ROCKER_PANEL_LEFT]: {
    en: 'Rocker Panel Left',
    fr: 'Bas de caisse gauche',
    de: 'Schweller links',
    nl: 'Linker rockerpaneel',
  },
  [VehiclePart.ROCKER_PANEL_RIGHT]: {
    en: 'Rocker Panel Right',
    fr: 'Bas de caisse droit',
    de: 'Rechter Schweller',
    nl: 'Rechter rockerpaneel',
  },
  [VehiclePart.TAIL_LIGHT_CENTER]: {
    en: 'Tail Light Left',
    fr: 'Feu arrière centre',
    de: 'Rücklicht Mitte',
    nl: 'Achterlicht midden',
  },
  [VehiclePart.TAIL_LIGHT_LEFT]: {
    en: 'Tail Light Left',
    fr: 'Feu arrière gauche',
    de: 'Rücklicht links',
    nl: 'Linker achterlicht',
  },
  [VehiclePart.TAIL_LIGHT_RIGHT]: {
    en: 'Tail Light Right',
    fr: 'Feu arrière droite',
    de: 'Rücklicht rechts',
    nl: 'Rechter achterlicht',
  },
  [VehiclePart.TURN_SIGNAL_FRONT_LATERAL_LEFT]: {
    en: 'Front Turn Signal Lateral Left',
    fr: 'Clignotant avant latéral gauche',
    de: 'Blinker vorne seitlich links',
    nl: 'Voorste linker zijblinker',
  },
  [VehiclePart.TURN_SIGNAL_FRONT_LATERAL_RIGHT]: {
    en: 'Front Turn Signal Lateral Right',
    fr: 'Clignotant avant latéral droit',
    de: 'Blinker vorne seitlich rechts',
    nl: 'Voorste rechter zijblinker',
  },
  [VehiclePart.WHEEL]: {
    en: 'Wheel',
    fr: 'Roue',
    de: 'Rad',
    nl: 'Wiel',
  },
  [VehiclePart.WHEEL_BACK_LEFT]: {
    en: 'Rear Wheel Left',
    fr: 'Roue arrière gauche',
    de: 'Linkes Hinterrad',
    nl: 'Achterste linker wiel',
  },
  [VehiclePart.WHEEL_BACK_RIGHT]: {
    en: 'Rear Wheel Right',
    fr: 'Roue arrière droite',
    de: 'Rechtes Hinterrad',
    nl: 'Achterste rechter wiel',
  },
  [VehiclePart.WHEEL_FRONT_LEFT]: {
    en: 'Front Wheel Left',
    fr: 'Roue avant gauche',
    de: 'Vorderrad links',
    nl: 'Voorste linker wiel',
  },
  [VehiclePart.WHEEL_FRONT_RIGHT]: {
    en: 'Front Wheel Right',
    fr: 'Roue avant droite',
    de: 'Vorderrad rechts',
    nl: 'Voorste rechter wiel',
  },
  [VehiclePart.WINDOW_BACK_LEFT]: {
    en: 'Rear Window Left',
    fr: 'Vitre arrière gauche',
    de: 'Hintere linke Scheibe',
    nl: 'Achterste linker raam',
  },
  [VehiclePart.WINDOW_BACK_RIGHT]: {
    en: 'Rear Window Right',
    fr: 'Vitre arrière droite',
    de: 'Fenster hinten rechts',
    nl: 'Achterste rechter raam',
  },
  [VehiclePart.WINDOW_CORNER_LEFT]: {
    en: 'Corner Window Left',
    fr: "Vitre d'angle gauche",
    de: 'Fenster in der linken Ecke',
    nl: 'Linker hoekraam',
  },
  [VehiclePart.WINDOW_CORNER_RIGHT]: {
    en: 'Corner Window Right',
    fr: "Vitre d'angle droite",
    de: 'Fenster in der rechten Ecke',
    nl: 'Rechter hoekraam',
  },
  [VehiclePart.WINDOW_FRONT_LEFT]: {
    en: 'Front Window Left',
    fr: 'Vitre avant gauche',
    de: 'Linke vordere Fensterscheibe',
    nl: 'Voorste linker raam',
  },
  [VehiclePart.WINDOW_FRONT_RIGHT]: {
    en: 'Front Window Right',
    fr: 'Vitre avant droite',
    de: 'Fenster vorne rechts',
    nl: 'Voorste rechter raam',
  },
  [VehiclePart.WINDSHIELD_BACK]: {
    en: 'Windshield Back',
    fr: 'Pare-brise arrière',
    de: 'Hintere Windschutzscheibe',
    nl: 'Achterste ruit',
  },
  [VehiclePart.WINDSHIELD_FRONT]: {
    en: 'Windshield Front',
    fr: 'Pare-brise avant',
    de: 'Windschutzscheibe vorne',
    nl: 'Voorruit',
  },
  [VehiclePart.WIPER]: {
    en: 'Wiper',
    fr: 'Essuie-glace',
    de: 'Scheibenwischer',
    nl: 'Scheerwiper',
  },
  [VehiclePart.WIPER_BACK]: {
    en: 'Rear Wiper',
    fr: 'Essuie-glace arrière',
    de: 'Heckscheibenwischer',
    nl: 'Achterste scheerwiper',
  },
  [VehiclePart.WIPER_FRONT]: {
    en: 'Front Wiper',
    fr: 'Essuie-glace avant',
    de: 'Scheibenwischer vorne',
    nl: 'Voorste scheerwiper',
  },
  [VehiclePart.FRONT_SPOILER]: {
    en: 'Front Spoiler',
    fr: 'Aileron avant',
    de: 'Frontspoiler',
    nl: 'Voorste spoiler',
  },
  [VehiclePart.REAR_SPOILER]: {
    en: 'Rear Spoiler',
    fr: 'Aileron arrière',
    de: 'Heckspoiler',
    nl: 'Achterste spoiler',
  },
  [VehiclePart.HOOD]: {
    en: 'Hood',
    fr: 'Capot',
    de: 'Motorhaube',
    nl: 'Motorkap',
  },
  [VehiclePart.PETROL_DOOR]: {
    en: 'Petrol Door',
    fr: 'Trappe à essence',
    de: 'Tankklappe',
    nl: 'Brandstofklep',
  },
  [VehiclePart.PILLAR]: {
    en: 'Pillar',
    fr: 'Carrosserie',
    de: 'Karosserie',
    nl: 'Kolom',
  },
  [VehiclePart.ROOF]: {
    en: 'Roof',
    fr: 'Toit',
    de: 'Dach',
    nl: 'Dak',
  },
  [VehiclePart.TRUNK]: {
    en: 'Trunk',
    fr: 'Coffre',
    de: 'Kofferraum',
    nl: 'Kofferbak',
  },
  [VehiclePart.BACKGROUND]: {
    en: 'Background',
    fr: 'Arrière-plan',
    de: 'Hintergrund',
    nl: 'Achtergrond',
  },
  [VehiclePart.CAR_INSIDE]: {
    en: 'Car Inside',
    fr: 'Intérieur',
    de: 'Auto innen',
    nl: 'Auto binnen',
  },
  [VehiclePart.DAMAGED_CAR_INSIDE]: {
    en: 'Damaged Car Inside',
    fr: 'Intérieur endommagé',
    de: 'Beschädigtes Auto innen',
    nl: 'Beschadigde auto binnen',
  },
  [VehiclePart.HANDLE_BACK_CENTER]: {
    en: 'Handle Back Center',
    fr: 'Poignée arrière centre',
    de: 'Griff Rückseite Mitte',
    nl: 'Handgreep Terug Midden',
  },
  [VehiclePart.RIM_BACK_LEFT]: {
    en: 'Back left rim',
    fr: 'Jante arrière gauche',
    de: 'Hintere linke Felge',
    nl: 'Achtervelg links',
  },
  [VehiclePart.RIM_BACK_RIGHT]: {
    en: 'Back right rim',
    fr: 'Jante arrière droite',
    de: 'Hintere rechte Felge',
    nl: 'Achtervelg rechts',
  },
  [VehiclePart.RIM_FRONT_LEFT]: {
    en: 'Front left rim',
    fr: 'Jante avant gauche',
    de: 'Vordere linke Felge',
    nl: 'Voorvelg links',
  },
  [VehiclePart.RIM_FRONT_RIGHT]: {
    en: 'Front right rim',
    fr: 'Jante avant droite',
    de: 'Vordere rechte Felge',
    nl: 'Voorvelg rechts',
  },
  [VehiclePart.INTERIOR]: {
    en: 'Interior',
    fr: 'Intérieur',
    de: 'Innenraum',
    nl: 'Interieur',
  },
};
