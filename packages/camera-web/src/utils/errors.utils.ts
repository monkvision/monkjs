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
        pl: 'Kamera preview niedostępna z powodu braku uprawnień do dostępu do strony.',
        ro: 'Prevederea imaginii camerei nu este disponibilă deoarece accesul la camera a fost refuzat paginii.',
        es: 'La vista previa de la cámara no está disponible porque no se le ha concedido acceso a la cámara en esta página.',
        pt: 'A prévia da câmera não está disponível porque o acesso à câmera não foi concedido à página.',
        da: 'Kameraforringer er ikke tilgængelig på grund af, at adgang til kameraet ikke blev givet tilladelse til siden.',
        sv: 'Kameravyn är otillgänglig eftersom kamerahållning inte har beviljats sidan.',
        fr: "L'apperçu de la caméra n'est pas disponible car l'accès à la caméra n'est pas autorisé.",
        de: 'Die Kameravorschau ist nicht verfügbar, da für die Seite kein Kamerazugriff gewährt wurde.',
        nl: 'De cameravoorbeeld is niet beschikbaar omdat er geen toegang tot de camera is verleend aan de pagina.',
        it: "L'anteprima della fotocamera non è disponibile perché l'accesso alla fotocamera non è stato concesso alla pagina.",
      };
    case UserMediaErrorType.WEBPAGE_NOT_ALLOWED:
      return {
        en: 'Unable to get camera access. Make sure to press “Allow” when asked to grant camera permission for this web page.',
        pl: 'Nie można uzyskać dostępu do kamery. Upewnij się, że naciśnij przycisk „Zgodź się“ gdy zostanie Ci zapytany o udzielenie pozwolenia na dostęp do kamery dla tej strony internetowej.',
        ro: 'Nepotrivnică la obținerea accesului la camera. Așezați-vă să apăsați butonul „Da” când vă va solicita permisiunea de acces la camera pentru această pagină web.',
        es: 'No se puede obtener acceso a la cámara. Asegúrese de presionar "Permitir" cuando le soliciten permiso para acceder a esta página web con cámara.',
        pt: 'Não foi possível obter acesso à câmera. Certifique-se de pressionar "Permitir" quando solicitado para conceder permissão de câmera para essa página web.',
        da: 'Udover kan ikke få adgang til kamera. Sørg for at trykke på "Tillad" når du bliver bedt om at give adgang til kamera tilladelse for denne webside.',
        sv: 'Ochkänt att få tillgång till kameran. Se till att trycka på ”Låt in” när du frågas om att ge tillstånd för kamerauppgift för denna webbsida.',
        fr: "Impossible d'accéder à la caméra. Veuillez vous assurer d'appuyer sur “Autoriser” lorsqu'on vous propose d'autoriser l'accès à la caméra pour cette page web.",
        de: 'Die Kamera kann nicht zugelassen werden. Stellen Sie sicher, dass Sie auf „Zulassen“ drücken, wenn Sie aufgefordert werden, die Kamera für diese Webseite zuzulassen.',
        nl: 'Kan geen toestemming krijgen voor de camera. Zorg ervoor dat u op “Toestaan” drukt wanneer u wordt gevraagd om toestemming te geven voor het gebruik van de camera op deze webpagina.',
        it: 'Impossibile ottenere l\'accesso alla fotocamera. Assicurati di premere "Consenti" quando ti viene chiesto di concedere il permesso di utilizzare la fotocamera per questa pagina web.',
      };
    case UserMediaErrorType.BROWSER_NOT_ALLOWED:
      return {
        en: "Unable to get camera access. Make sure to grant camera access to your current internet browser in your device's settings.",
        pl: 'Nie można uzyskać dostępu do kamery. Upewnij się, że przyznałeś dostęp do kamery dla swojej przeglądarki internetowej w ustawieniach urządzenia.',
        ro: 'Nu se poate accesa camera. Asigură-te că ai acordat acces la cameră pentru browserul tău de internet în setările dispozitivului.',
        es: 'No se puede acceder a la cámara. Asegúrate de conceder acceso a la cámara a tu navegador de internet actual en la configuración de tu dispositivo.',
        pt: 'Não é possível obter acesso à câmera. Certifique-se de conceder acesso à câmera ao seu navegador de internet atual nas configurações do seu dispositivo.',
        da: 'Kan ikke få adgang til kameraet. Sørg for at give kameraadgang til din nuværende internetbrowser i din enheds indstillinger.',
        sv: 'Kan inte få åtkomst till kameran. Se till att bevilja kameraåtkomst till din nuvarande webbläsare i enhetens inställningar.',
        fr: "Impossible d'accéder à la caméra. Veuillez vous assurer d'autoriser l'accès à la caméra pour ce navigateur internet dans les paramètres de votre téléphone.",
        de: 'Der Zugriff auf die Kamera ist nicht möglich. Stellen Sie sicher, dass Sie in den Einstellungen Ihres Geräts den Kamerazugriff für Ihren aktuellen Internetbrowser zulassen.',
        nl: 'Kan geen cameratoegang krijgen. Zorg ervoor dat u de camera toegang verleent tot uw huidige internet browser in de instellingen van uw apparaat.',
        it: "Impossibile ottenere l'accesso alla fotocamera. Assicurati di concedere l'accesso alla fotocamera al tuo browser internet corrente nelle impostazioni del tuo dispositivo.",
      };
    case UserMediaErrorType.STREAM_INACTIVE:
      return {
        en: 'The camera video stream was closed unexpectedly.',
        pl: 'Kamera wyświetlała nieprzewidzianie niewydostępny strumień wideo.',
        ro: 'Câmpia de imagine a camerei a fost închisă neașteptat.',
        es: 'La señal de video del cámara se cerró inesperadamente.',
        pt: 'A stream de vídeo da câmera foi fechado inesperadamente.',
        da: 'Kamera-videostrømmen blev afsluttet uventet.',
        sv: 'Kameravideoströmmen stängdes oavsiktligt.',
        fr: 'Le flux vidéo de la caméra a été coupé de manière inattendue.',
        de: 'Der Video-Stream der Kamera wurde unerwartet geschlossen.',
        nl: 'De videostream van de camera is onverwacht gesloten.',
        it: 'Il flusso video della fotocamera è stato chiuso inaspettatamente.',
      };
    case UserMediaErrorType.INVALID_STREAM:
      return {
        en: 'Unable to process the camera video stream.',
        pl: 'Nie można przetłumaczyć strumienia wideo kamery.',
        ro: 'Imposibil să proceseze fluxul videoului de la camera.',
        es: 'No se puede procesar el flujo de video de la cámara.',
        pt: 'Não é possível processar o fluxo de vídeo da câmera.',
        da: 'Udover kan ikke procesere kameraløb.',
        sv: 'Ochjämn att bearbeta kameravideostreamen.',
        fr: 'Impossible de traiter le flux vidéo de la caméra.',
        de: 'Der Videostrom der Kamera kann nicht verarbeitet werden.',
        nl: 'De videostream van de camera kan niet worden verwerkt.',
        it: 'Impossibile elaborare il flusso video della fotocamera.',
      };
    default:
      return {
        en: 'An unexpected error occurred when fetching the camera video stream.',
        pl: 'Nastąpił nieoczekiwany błąd podczas pobierania strumienia wideo kamery.',
        ro: 'A aparținut un eror neașteptat la momentul când s-a încarcat fluxul videoului camerei.',
        es: 'Ocurrió un error inesperado al obtener el flujo de video del canal de cámara.',
        pt: 'Erro inesperado ocorreu ao carregar o fluxo de vídeo da câmera.',
        da: 'En uventet fejl opstod ved at hente videostreamen fra kameraet.',
        sv: 'En oövervägd felaktighet inträffade när man hämtade videostreamen från kameran.',
        fr: 'Une erreur inattendue est survenue lors de la récupération du flux vidéo de la caméra.',
        de: 'Beim Abrufen des Kamera-Videostreams ist ein unerwarteter Fehler aufgetreten.',
        nl: 'Er is een onverwachte fout opgetreden bij het ophalen van de videostream van de camera.',
        it: 'Si è verificato un errore imprevisto durante il recupero del flusso video della fotocamera.',
      };
  }
}
