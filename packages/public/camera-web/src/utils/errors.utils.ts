import { TranslationObject } from '@monkvision/types';
import { UserMediaErrorType } from '../Camera';

/**
 * Get a translation object (that can be translated using the useObjectTranslation hook) that contains the translations
 * for the error label corresponding to the camera error passed as an argument of this function.
 */
export function getCameraErrorLabel(error?: UserMediaErrorType): TranslationObject | null {
  switch (error) {
    case UserMediaErrorType.NOT_ALLOWED:
      return {
        en: 'Camera preview unavailable because camera access was not granted to the page.',
        fr: "L'apperçu de la caméra n'est pas disponible car l'accès à la caméra n'est pas autorisé.",
        de: 'Die Kameravorschau ist nicht verfügbar, da für die Seite kein Kamerazugriff gewährt wurde.',
      };
    case UserMediaErrorType.STREAM_INACTIVE:
      return {
        en: 'The camera video stream was closed unexpectedly.',
        fr: 'Le flux vidéo de la caméra a été coupé de manière inattendue.',
        de: 'Der Video-Stream der Kamera wurde unerwartet geschlossen.',
      };
    case UserMediaErrorType.INVALID_STREAM:
      return {
        en: 'Unable to process the camera video stream.',
        fr: 'Impossible de traiter le flux vidéo de la caméra.',
        de: 'Der Videostrom der Kamera kann nicht verarbeitet werden.',
      };
    default:
      return {
        en: 'An unexpected error occurred when fetching the camera video stream.',
        fr: 'Une erreur inattendue est survenue lors de la récupération du flux vidéo de la caméra.',
        de: 'Beim Abrufen des Kamera-Videostreams ist ein unerwarteter Fehler aufgetreten.',
      };
  }
}
