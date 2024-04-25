import { TranslationObject, VehiclePart } from '@monkvision/types';

/**
 * The translated labels for each vehicle part available in the SDK.
 */
export const vehiclePartLabels: Record<VehiclePart, TranslationObject> = {
  [VehiclePart.BUMPER_BACK]: {
    en: 'Rear Bumper',
    fr: 'Pare-chocs arrière',
    de: 'Hintere Stoßstange',
  },
  [VehiclePart.BUMPER_FRONT]: {
    en: 'Front Bumper',
    fr: 'Pare-chocs avant',
    de: 'Vordere Stoßstange',
  },
  [VehiclePart.DOOR_BACK_LEFT]: {
    en: 'Rear Door Left',
    fr: 'Portière arrière droite',
    de: 'Tür hinten rechts',
  },
  [VehiclePart.DOOR_BACK_RIGHT]: {
    en: 'Rear Door Right',
    fr: 'Portière arrière gauche',
    de: 'Tür hinten links',
  },
  [VehiclePart.DOOR_FRONT_LEFT]: {
    en: 'Front Door Left',
    fr: 'Portière avant droite',
    de: 'Vordertür rechts',
  },
  [VehiclePart.DOOR_FRONT_RIGHT]: {
    en: 'Front Door Right',
    fr: 'Portière avant gauche',
    de: 'Tür vorne links',
  },
  [VehiclePart.FENDER_BACK_LEFT]: {
    en: 'Rear Fender Left',
    fr: 'Aile arrière gauche',
    de: 'Kotflügel hinten links',
  },
  [VehiclePart.FENDER_BACK_RIGHT]: {
    en: 'Rear Fender Right',
    fr: 'Aile arrière droite',
    de: 'Kotflügel hinten rechts',
  },
  [VehiclePart.FENDER_FRONT_LEFT]: {
    en: 'Front Fender Left',
    fr: 'Aile avant gauche',
    de: 'Linker vorderer Kotflügel',
  },
  [VehiclePart.FENDER_FRONT_RIGHT]: {
    en: 'Front Fender Right',
    fr: 'Aile avant droite',
    de: 'Rechter vorderer Flügel',
  },
  [VehiclePart.FOG_LIGHT_BACK_LEFT]: {
    en: 'Rear Fog Light Left',
    fr: 'Phare anti-brouillard arrière gauche',
    de: 'Nebelscheinwerfer hinten links',
  },
  [VehiclePart.FOG_LIGHT_BACK_RIGHT]: {
    en: 'Rear Fog Light Right',
    fr: 'Phare anti-brouillard arrière droit',
    de: 'Nebelscheinwerfer hinten rechts',
  },
  [VehiclePart.FOG_LIGHT_FRONT_LEFT]: {
    en: 'Front Fog Light Left',
    fr: 'Phare anti-brouillard avant gauche',
    de: 'Nebelscheinwerfer vorne links',
  },
  [VehiclePart.FOG_LIGHT_FRONT_RIGHT]: {
    en: 'Front Fog Light Right',
    fr: 'Phare anti-brouillard avant droit',
    de: 'Nebelscheinwerfer vorne rechts',
  },
  [VehiclePart.GRILL]: {
    en: 'Grill',
    fr: 'Grille',
    de: 'Gitter',
  },
  [VehiclePart.GRILL_LOW]: {
    en: 'Grill Low',
    fr: 'Grille bas',
    de: 'Gitter unten',
  },
  [VehiclePart.GRILL_RADIATOR]: {
    en: 'Radiator Grill',
    fr: 'Grille radiateur',
    de: 'Heizkörpergitter',
  },
  [VehiclePart.HANDLE_BACK_LEFT]: {
    en: 'Rear Handle Left',
    fr: 'Poignée arrière gauche',
    de: 'Griff hinten links',
  },
  [VehiclePart.HANDLE_BACK_RIGHT]: {
    en: 'Rear Handle Right',
    fr: 'Poignée arrière droite',
    de: 'Griff hinten rechts',
  },
  [VehiclePart.HANDLE_FRONT_LEFT]: {
    en: 'Front Handle Left',
    fr: 'Poignée avant gauche',
    de: 'Griff vorne links',
  },
  [VehiclePart.HANDLE_FRONT_RIGHT]: {
    en: 'Front Handle Right',
    fr: 'Poignée avant droite',
    de: 'Griff vorne rechts',
  },
  [VehiclePart.HEADER_PANEL]: {
    en: 'Header Panel',
    fr: 'Panneau de tête',
    de: 'Kopfleiste',
  },
  [VehiclePart.HEAD_LIGHT_LEFT]: {
    en: 'Head Light Left',
    fr: 'Phare gauche',
    de: 'Linker Scheinwerfer',
  },
  [VehiclePart.HEAD_LIGHT_RIGHT]: {
    en: 'Head Light Right',
    fr: 'Phare droit',
    de: 'Rechter Scheinwerfer',
  },
  [VehiclePart.HOOK]: {
    en: 'Tow Hook',
    fr: 'Crochet de remorquage',
    de: 'Abschlepphaken',
  },
  [VehiclePart.HUBCAP]: {
    en: 'Hubcap',
    fr: 'Enjoliveur',
    de: 'Radkappe',
  },
  [VehiclePart.HUBCAP_BACK_LEFT]: {
    en: 'Rear Hubcap Left',
    fr: 'Enjoliveur arrière gauche',
    de: 'Radkappe hinten links',
  },
  [VehiclePart.HUBCAP_BACK_RIGHT]: {
    en: 'Rear Hubcap Right',
    fr: 'Enjoliveur arrière droit',
    de: 'Radkappe hinten rechts',
  },
  [VehiclePart.HUBCAP_FRONT_LEFT]: {
    en: 'Front Hubcap Left',
    fr: 'Enjoliveur avant gauche',
    de: 'Radkappe vorne links',
  },
  [VehiclePart.HUBCAP_FRONT_RIGHT]: {
    en: 'Front Hubcap Right',
    fr: 'Enjoliveur avant droite',
    de: 'Radkappe vorne rechts',
  },
  [VehiclePart.INDICATOR_LIGHT_LEFT]: {
    en: 'Indicator Light Left',
    fr: 'Clignotant gauche',
    de: 'Blinkend links',
  },
  [VehiclePart.INDICATOR_LIGHT_RIGHT]: {
    en: 'Indicator Light Right',
    fr: 'Clignotant droit',
    de: 'Blinkend rechts',
  },
  [VehiclePart.LICENSE_PLATE_BACK]: {
    en: 'Rear License Plate',
    fr: "Plaque d'immatriculation arrière",
    de: 'Autokennzeichen hinten',
  },
  [VehiclePart.LICENSE_PLATE_FRONT]: {
    en: 'Front License Plate',
    fr: "Plaque d'immatriculation avant",
    de: 'Autokennzeichen vorne',
  },
  [VehiclePart.LOGO]: {
    en: 'Logo',
    fr: 'Logo',
    de: 'Logo',
  },
  [VehiclePart.MIRROR_LEFT]: {
    en: 'Mirror Left',
    fr: 'Rétroviseur gauche',
    de: 'Linker Spiegel',
  },
  [VehiclePart.MIRROR_RIGHT]: {
    en: 'Mirror Right',
    fr: 'Rétroviseur droit',
    de: 'Rechter Spiegel',
  },
  [VehiclePart.MIRROR_SUPPORT]: {
    en: 'Mirror Support',
    fr: 'Support de rétroviseur',
    de: 'Spiegelhalterung',
  },
  [VehiclePart.QUARTER_WINDOW_BACK_LEFT]: {
    en: 'Rear Quarter Window Left',
    fr: 'Vitres latérale arrière gauche',
    de: 'Seitenfenster hinten links',
  },
  [VehiclePart.QUARTER_WINDOW_BACK_RIGHT]: {
    en: 'Rear Quarter Window Right',
    fr: 'Vitres latérale arrière droite',
    de: 'Seitenfenster hinten rechts',
  },
  [VehiclePart.QUARTER_WINDOW_FRONT_LEFT]: {
    en: 'Front Quarter Window Left',
    fr: 'Vitres latérale avant gauche',
    de: 'Seitenfenster vorne links',
  },
  [VehiclePart.QUARTER_WINDOW_FRONT_RIGHT]: {
    en: 'Front Quarter Window Right',
    fr: 'Vitres latérale avant droite',
    de: 'Seitenfenster vorne rechts',
  },
  [VehiclePart.ROCKER_PANEL]: {
    en: 'Rocker Panel',
    fr: 'Bas de caisse',
    de: 'Schweller',
  },
  [VehiclePart.ROCKER_PANEL_LEFT]: {
    en: 'Rocker Panel Left',
    fr: 'Bas de caisse gauche',
    de: 'Schweller links',
  },
  [VehiclePart.ROCKER_PANEL_RIGHT]: {
    en: 'Rocker Panel Right',
    fr: 'Bas de caisse droit',
    de: 'Rechter Schweller',
  },
  [VehiclePart.TAIL_LIGHT_CENTER]: {
    en: 'Tail Light Left',
    fr: 'Feu arrière centre',
    de: 'Rücklicht Mitte',
  },
  [VehiclePart.TAIL_LIGHT_LEFT]: {
    en: 'Tail Light Left',
    fr: 'Feu arrière gauche',
    de: 'Rücklicht links',
  },
  [VehiclePart.TAIL_LIGHT_RIGHT]: {
    en: 'Tail Light Right',
    fr: 'Feu arrière droite',
    de: 'Rücklicht rechts',
  },
  [VehiclePart.TURN_SIGNAL_FRONT_LATERAL_LEFT]: {
    en: 'Front Turn Signal Lateral Left',
    fr: 'Clignotant avant latéral gauche',
    de: 'Blinker vorne seitlich links',
  },
  [VehiclePart.TURN_SIGNAL_FRONT_LATERAL_RIGHT]: {
    en: 'Front Turn Signal Lateral Right',
    fr: 'Clignotant avant latéral droit',
    de: 'Blinker vorne seitlich rechts',
  },
  [VehiclePart.WHEEL]: {
    en: 'Wheel',
    fr: 'Roue',
    de: 'Rad',
  },
  [VehiclePart.WHEEL_BACK_LEFT]: {
    en: 'Rear Wheel Left',
    fr: 'Roue arrière gauche',
    de: 'Linkes Hinterrad',
  },
  [VehiclePart.WHEEL_BACK_RIGHT]: {
    en: 'Rear Wheel Right',
    fr: 'Roue arrière droite',
    de: 'Rechtes Hinterrad',
  },
  [VehiclePart.WHEEL_FRONT_LEFT]: {
    en: 'Front Wheel Left',
    fr: 'Roue avant gauche',
    de: 'Vorderrad links',
  },
  [VehiclePart.WHEEL_FRONT_RIGHT]: {
    en: 'Front Wheel Right',
    fr: 'Roue avant droite',
    de: 'Vorderrad rechts',
  },
  [VehiclePart.WINDOW_BACK_LEFT]: {
    en: 'Rear Window Left',
    fr: 'Vitre arrière gauche',
    de: 'Hintere linke Scheibe',
  },
  [VehiclePart.WINDOW_BACK_RIGHT]: {
    en: 'Rear Window Right',
    fr: 'Vitre arrière droite',
    de: 'Fenster hinten rechts',
  },
  [VehiclePart.WINDOW_CORNER_LEFT]: {
    en: 'Corner Window Left',
    fr: "Vitre d'angle gauche",
    de: 'Fenster in der linken Ecke',
  },
  [VehiclePart.WINDOW_CORNER_RIGHT]: {
    en: 'Corner Window Right',
    fr: "Vitre d'angle droite",
    de: 'Fenster in der rechten Ecke',
  },
  [VehiclePart.WINDOW_FRONT_LEFT]: {
    en: 'Front Window Left',
    fr: 'Vitre avant gauche',
    de: 'Linke vordere Fensterscheibe',
  },
  [VehiclePart.WINDOW_FRONT_RIGHT]: {
    en: 'Front Window Right',
    fr: 'Vitre avant droite',
    de: 'Fenster vorne rechts',
  },
  [VehiclePart.WINDSHIELD_BACK]: {
    en: 'Windshield Back',
    fr: 'Pare-brise arrière',
    de: 'Hintere Windschutzscheibe',
  },
  [VehiclePart.WINDSHIELD_FRONT]: {
    en: 'Windshield Front',
    fr: 'Pare-brise avant',
    de: 'Windschutzscheibe vorne',
  },
  [VehiclePart.WIPER]: {
    en: 'Wiper',
    fr: 'Essuie-glace',
    de: 'Scheibenwischer',
  },
  [VehiclePart.WIPER_BACK]: {
    en: 'Rear Wiper',
    fr: 'Essuie-glace arrière',
    de: 'Heckscheibenwischer',
  },
  [VehiclePart.WIPER_FRONT]: {
    en: 'Front Wiper',
    fr: 'Essuie-glace avant',
    de: 'Scheibenwischer vorne',
  },
  [VehiclePart.FRONT_SPOILER]: {
    en: 'Front Spoiler',
    fr: 'Aileron avant',
    de: 'Frontspoiler',
  },
  [VehiclePart.REAR_SPOILER]: {
    en: 'Rear Spoiler',
    fr: 'Aileron arrière',
    de: 'Heckspoiler',
  },
  [VehiclePart.HOOD]: {
    en: 'Hood',
    fr: 'Capot',
    de: 'Motorhaube',
  },
  [VehiclePart.PETROL_DOOR]: {
    en: 'Petrol Door',
    fr: 'Trappe à essence',
    de: 'Tankklappe',
  },
  [VehiclePart.PILLAR]: {
    en: 'Pillar',
    fr: 'Carrosserie',
    de: 'Karosserie',
  },
  [VehiclePart.ROOF]: {
    en: 'Roof',
    fr: 'Toit',
    de: 'Dach',
  },
  [VehiclePart.TRUNK]: {
    en: 'Trunk',
    fr: 'Coffre',
    de: 'Kofferraum',
  },
  [VehiclePart.IGNORE]: {
    en: 'IGNORE',
    fr: 'IGNORE',
    de: 'IGNORE',
  },
  [VehiclePart.BACKGROUND]: {
    en: 'BACKGROUND',
    fr: 'BACKGROUND',
    de: 'BACKGROUND',
  },
};
