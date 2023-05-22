import { DamageMode, Severity } from './resources';

export function cleanMockDamages(damageMode, damages) {
  return damages.map((dmg) => {
    const cleanedDmg = { part: dmg.part, images: dmg.images };
    if ([DamageMode.SEVERITY, DamageMode.ALL].includes(damageMode)) {
      cleanedDmg.severity = dmg.severity;
    }
    if ([DamageMode.PRICING, DamageMode.ALL].includes(damageMode)) {
      cleanedDmg.pricing = dmg.pricing;
    }
    return cleanedDmg;
  });
}

const AppStateMock = {
  damages: [
    {
      part: 'bumper_front',
      severity: Severity.LOW,
      pricing: 45,
      images: [
        { url: 'https://i.ytimg.com/vi/GCXMUeL2uPY/maxresdefault.jpg' },
        { url: 'https://fastly-production.24c.in/inspection-car/appointments/spincar/prod/AE/AE_CAR_1197329124/POST_REFURB/1628168106219/cu-1.jpg?w=700&auto=format' },
      ],
    },
    {
      part: 'door_front_left',
      severity: Severity.HIGH,
      pricing: 550,
      images: [
        { url: 'https://fastly-production.24c.in/inspection-car/appointments/spincar/prod/AE/AE_CAR_1197329124/POST_REFURB/1628168106219/cu-1.jpg?w=700&auto=format' },
        { url: 'https://as1.ftcdn.net/v2/jpg/02/97/34/18/1000_F_297341865_fbyQOLOiUKQOdS3jA0wmVGzJyAOfbsO6.jpg' },
      ],
    },
    {
      part: 'wheel_back_right',
      severity: Severity.MEDIUM,
      pricing: 200,
      images: [
        { url: 'https://as1.ftcdn.net/v2/jpg/02/97/34/18/1000_F_297341865_fbyQOLOiUKQOdS3jA0wmVGzJyAOfbsO6.jpg' },
      ],
    },
    {
      part: 'hood',
      severity: Severity.LOW,
      pricing: 120,
      images: [
        { url: 'https://ymimg1.b8cdn.com/uploads/used_car/2022/12/20/1380389/pictures/9271585/Toyota_Yaris_2017_in_Manama_1380389_1.jpg' },
        { url: 'https://as1.ftcdn.net/v2/jpg/02/97/34/18/1000_F_297341865_fbyQOLOiUKQOdS3jA0wmVGzJyAOfbsO6.jpg' },
      ],
    },
    {
      part: 'trunk',
      severity: Severity.MEDIUM,
      pricing: 210,
      images: [
        { url: 'https://ymimg1.b8cdn.com/resized/used_car/2022/7/24/1320196/pictures/8603986/mobile_listing_main_Toyota_Yaris_Sedan_2007_in_Sharjah_1320196_5.jpeg' },
      ],
    },
    {
      part: 'windshield_back',
      severity: Severity.HIGH,
      pricing: 435,
      images: [
        { url: 'https://atfpro.co.uk/wp-content/uploads/2021/09/More-than-14-million-cars-driven-with-damage-feat.jpg' },
        { url: 'https://img.indianauto.com/crop/500x375/2020/04/25/9345ac68-ce8c-456d-a5e1-e402b37dd386-29c4.jpg' },
      ],
    },
    {
      part: 'fender_front_left',
      severity: Severity.LOW,
      pricing: 25,
      images: [
        { url: 'https://as1.ftcdn.net/v2/jpg/02/97/34/18/1000_F_297341865_fbyQOLOiUKQOdS3jA0wmVGzJyAOfbsO6.jpg' },
        { url: 'https://atfpro.co.uk/wp-content/uploads/2021/09/More-than-14-million-cars-driven-with-damage-feat.jpg' },
        { url: 'https://i.ytimg.com/vi/GCXMUeL2uPY/maxresdefault.jpg' },
        { url: 'https://img.indianauto.com/crop/500x375/2020/04/25/9345ac68-ce8c-456d-a5e1-e402b37dd386-29c4.jpg' },
      ],
    },
  ],
  gallery: [
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
  ],
};

export default AppStateMock;
