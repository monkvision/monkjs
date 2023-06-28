import { Severity } from '../../resources';

export const damages = [
  {
    id: '1',
    part: 'bumper_front',
    images: [
      { url: 'https://i.ytimg.com/vi/GCXMUeL2uPY/maxresdefault.jpg' },
      { url: 'https://fastly-production.24c.in/inspection-car/appointments/spincar/prod/AE/AE_CAR_1197329124/POST_REFURB/1628168106219/cu-1.jpg?w=700&auto=format' },
    ],
    severity: Severity.HIGH,
    pricing: 333,
  },
  {
    id: '2',
    part: 'windshield_front',
    images: [
      { url: 'https://fastly-production.24c.in/inspection-car/appointments/spincar/prod/AE/AE_CAR_1197329124/POST_REFURB/1628168106219/cu-1.jpg?w=700&auto=format' },
      { url: 'https://as1.ftcdn.net/v2/jpg/02/97/34/18/1000_F_297341865_fbyQOLOiUKQOdS3jA0wmVGzJyAOfbsO6.jpg' },
    ],
    severity: Severity.MEDIUM,
    pricing: 222,
  },
  {
    id: '3',
    part: 'window_front_left',
    images: [
      { url: 'https://as1.ftcdn.net/v2/jpg/02/97/34/18/1000_F_297341865_fbyQOLOiUKQOdS3jA0wmVGzJyAOfbsO6.jpg' },
    ],
    severity: Severity.LOW,
    pricing: 111,
  },
];

export const pictures = [
  {
    url: 'https://i.ytimg.com/vi/GCXMUeL2uPY/maxresdefault.jpg',
    label: { fr: 'Rear', en: 'Arrière' },
  },
  {
    url: 'https://fastly-production.24c.in/inspection-car/appointments/spincar/prod/AE/AE_CAR_1197329124/POST_REFURB/1628168106219/cu-1.jpg?w=700&auto=format',
    label: { fr: 'Avant', en: 'Front' },
  },
  {
    url: 'https://img.indianauto.com/crop/500x375/2020/04/25/9345ac68-ce8c-456d-a5e1-e402b37dd386-29c4.jpg',
    label: { fr: 'Avant Droite', en: 'Front Right' },
  },
  {
    url: 'https://as1.ftcdn.net/v2/jpg/02/97/34/18/1000_F_297341865_fbyQOLOiUKQOdS3jA0wmVGzJyAOfbsO6.jpg',
  },
  {
    url: 'https://ymimg1.b8cdn.com/uploads/used_car/2022/12/20/1380389/pictures/9271585/Toyota_Yaris_2017_in_Manama_1380389_1.jpg',
    label: { fr: 'Arrière Gauche', en: 'Rear Left' },
  },
  {
    url: 'https://ymimg1.b8cdn.com/resized/used_car/2022/7/24/1320196/pictures/8603986/mobile_listing_main_Toyota_Yaris_Sedan_2007_in_Sharjah_1320196_5.jpeg',
    label: { fr: 'Arrière Droite', en: 'Rear Right' },
  },
  {
    url: '',
    label: { fr: 'Gauche Vue Basse', en: 'Left Low' },
  },
  {
    url: 'https://atfpro.co.uk/wp-content/uploads/2021/09/More-than-14-million-cars-driven-with-damage-feat.jpg',
  },
];
