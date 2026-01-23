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
        ro: 'Previzualizarea camerei nu este disponibilă deoarece accesul la cameră nu a fost acordat paginii.',
        pl: 'Podgląd kamery jest niedostępny, ponieważ strona nie otrzymała uprawnień dostępu do kamery.',
        da: 'Kameraforhåndsvisning er ikke tilgængelig, fordi kameraadgang ikke blev givet til siden.',
        sv: 'Kameraview är inte tillgänglig eftersom sidan inte har tillgång till kameran.',
        es: 'La vista previa de la cámara no está disponible porque no se concedió permiso de acceso a la cámara a la página.',
        pt: 'A visualização da câmera não está disponível porque o acesso à câmera não foi concedido à página.',
        fr: "L'apperçu de la caméra n'est pas disponible car l'accès à la caméra n'est pas autorisé.",
        de: 'Die Kameravorschau ist nicht verfügbar, da für die Seite kein Kamerazugriff gewährt wurde.',
        nl: 'De cameravoorbeeld is niet beschikbaar omdat er geen toegang tot de camera is verleend aan de pagina.',
        it: "L'anteprima della fotocamera non è disponibile perché l'accesso alla fotocamera non è stato concesso alla pagina.",
      };
    case UserMediaErrorType.WEBPAGE_NOT_ALLOWED:
      return {
        en: 'Unable to get camera access. Make sure to press “Allow” when asked to grant camera permission for this web page.',
        ro: 'Nu s-a putut accesa camera. Asigurați-vă că apăsați „Permite” când vi se solicită să acordați permisiunea de utilizare a camerei pentru această pagină web.',
        pl: 'Nie można uzyskać dostępu do kamery. Upewnij się, że klikniesz „Zezwól”, gdy zostaniesz poproszony o udzielenie uprawnień dostępu do kamery dla tej strony internetowej.',
        da: 'Kunne ikke få adgang til kameraet. Sørg for at trykke på “Tillad”, når du bliver bedt om at give tilladelse til kameraadgang for denne webside.',
        sv: 'Kunde inte få åtkomst till kameran. Se till att du trycker på ”Tillåt” när du blir ombedd att ge kameratillstånd för den här webbsidan.”',
        es: 'No se pudo acceder a la cámara. Asegúrese de presionar “Permitir” cuando se le solicite conceder permiso de cámara para esta página web.',
        pt: 'Não foi possível obter acesso à câmera. Certifique-se de pressionar “Permitir” quando solicitado a conceder permissão para a câmera nesta página.',
        fr: "Impossible d'accéder à la caméra. Veuillez vous assurer d'appuyer sur “Autoriser” lorsqu'on vous propose d'autoriser l'accès à la caméra pour cette page web.",
        de: 'Die Kamera kann nicht zugelassen werden. Stellen Sie sicher, dass Sie auf „Zulassen“ drücken, wenn Sie aufgefordert werden, die Kamera für diese Webseite zuzulassen.',
        nl: 'Kan geen toestemming krijgen voor de camera. Zorg ervoor dat u op “Toestaan” drukt wanneer u wordt gevraagd om toestemming te geven voor het gebruik van de camera op deze webpagina.',
        it: 'Impossibile ottenere l\'accesso alla fotocamera. Assicurati di premere "Consenti" quando ti viene chiesto di concedere il permesso di utilizzare la fotocamera per questa pagina web.',
      };
    case UserMediaErrorType.BROWSER_NOT_ALLOWED:
      return {
        en: "Unable to get camera access. Make sure to grant camera access to your current internet browser in your device's settings.",
        ro: "Nu s-a putut accesa camera. Asigurați-vă că ați acordat permisiunea de acces la cameră pentru browserul dvs. în setările dispozitivului.",
        pl: "Nie można uzyskać dostępu do kamery. Upewnij się, że w ustawieniach urządzenia przyznałeś dostęp do kamery dla używanej przeglądarki internetowej.",
        da: "Kunne ikke få adgang til kameraet. Sørg for at give kameraadgang til din aktuelle webbrowser i dine enhedsindstillinger.",
        sv: "Kunde inte få åtkomst till kameran. Se till att du har tillåtit kameraåtkomst för din webbläsare i enheten.",
        es: "No se pudo acceder a la cámara. Asegúrese de otorgar permisos de cámara a su navegador web actual en la configuración de su dispositivo.",
        pt: "Não foi possível obter acesso à câmera. Certifique-se de conceder acesso à câmera ao seu navegador atual nas configurações do dispositivo.",
        fr: "Impossible d'accéder à la caméra. Veuillez vous assurer d'autoriser l'accès à la caméra pour ce navigateur internet dans les paramètres de votre téléphone.",
        de: 'Der Zugriff auf die Kamera ist nicht möglich. Stellen Sie sicher, dass Sie in den Einstellungen Ihres Geräts den Kamerazugriff für Ihren aktuellen Internetbrowser zulassen.',
        nl: 'Kan geen cameratoegang krijgen. Zorg ervoor dat u de camera toegang verleent tot uw huidige internet browser in de instellingen van uw apparaat.',
        it: "Impossibile ottenere l'accesso alla fotocamera. Assicurati di concedere l'accesso alla fotocamera al tuo browser internet corrente nelle impostazioni del tuo dispositivo.",
      };
    case UserMediaErrorType.STREAM_INACTIVE:
      return {
        en: 'The camera video stream was closed unexpectedly.',
        ro: 'Fluxul video al camerei a fost închis neașteptat.',
        pl: 'Strumień wideo z kamery został nieoczekiwanie przerwany.',
        da: 'Kameraets videostream blev uventet lukket.',
        sv: 'Kamerans videoström stängdes oväntat.',
        es: 'La transmisión de video de la cámara se cerró inesperadamente.',
        pt: 'O stream de vídeo da câmera foi encerrado inesperadamente.',
        fr: 'Le flux vidéo de la caméra a été coupé de manière inattendue.',
        de: 'Der Video-Stream der Kamera wurde unerwartet geschlossen.',
        nl: 'De videostream van de camera is onverwacht gesloten.',
        it: 'Il flusso video della fotocamera è stato chiuso inaspettatamente.',
      };
    case UserMediaErrorType.INVALID_STREAM:
      return {
        en: 'Unable to process the camera video stream.',
        ro: 'Nu se poate procesa fluxul video al camerei.',
        pl: 'Nie można przetworzyć strumienia wideo z kamery.',
        da: 'Kunne ikke behandle videostrømmen fra kameraet.',
        sv: 'Kunde inte bearbeta kamerans videoström.',
        es: 'No se puede procesar la transmisión de video de la cámara.',
        pt: 'Não foi possível processar o stream de vídeo da câmera.',
        fr: 'Impossible de traiter le flux vidéo de la caméra.',
        de: 'Der Videostrom der Kamera kann nicht verarbeitet werden.',
        nl: 'De videostream van de camera kan niet worden verwerkt.',
        it: 'Impossibile elaborare il flusso video della fotocamera.',
      };
    default:
      return {
        en: 'An unexpected error occurred when fetching the camera video stream.',
        ro: 'A apărut o eroare neașteptată la preluarea fluxului video de la cameră.',
        pl: 'Wystąpił nieoczekiwany błąd podczas pobierania strumienia wideo z kamery.',
        da: 'Der opstod en uventet fejl under hentning af kameravideostrømmen.',
        sv: 'Ett oväntat fel uppstod när kamerans videoström hämtades.',
        es: 'Se produjo un error inesperado al obtener la transmisión de video de la cámara.',
        pt: 'Ocorreu um erro inesperado ao obter o stream de vídeo da câmera.',
        fr: 'Une erreur inattendue est survenue lors de la récupération du flux vidéo de la caméra.',
        de: 'Beim Abrufen des Kamera-Videostreams ist ein unerwarteter Fehler aufgetreten.',
        nl: 'Er is een onverwachte fout opgetreden bij het ophalen van de videostream van de camera.',
        it: 'Si è verificato un errore imprevisto durante il recupero del flusso video della fotocamera.',
      };
  }
}
