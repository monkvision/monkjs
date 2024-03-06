export default {
  additionalData: {
    created_at: '2024-02-06T10:28:56.504Z',
    label: {
      de: 'Hinten Seitlich Niedrig Links',
      en: 'Rear Lateral Low Left',
      fr: 'Arrière latéral gauche - vue basse',
      key: 'rear-lateral-low-left',
    },
    sight_id: 'haccord-W-Bn3bU1',
  },
  size: 108009,
  compliances: {
    coverage360: {
      isCompliant: false,
      reasons: ['test_reason'],
      status: 'DONE',
    },
    imageQualityAssessment: {
      isCompliant: false,
      reasons: ['test_reason_2'],
      status: 'DONE',
      details: {
        blurrinessScore: 0.8,
        overexposureScore: 0.6,
        underexposureScore: 0.4,
      },
    },
    zoomLevel: {
      isCompliant: false,
      reasons: ['test_reason_3'],
      status: 'DONE',
      details: {
        zoomScore: 0.1,
      },
    },
  },
  detailedViewpoint: {
    isExterior: true,
    distance: 99,
    centersOn: ['front', 'front_left'],
  },
  entityType: 'IMAGE',
  id: '6564fa84-7ae9-bccd-650e-58fb7dcf924b',
  height: 720,
  label: {
    de: 'Hinten Seitlich Niedrig Links',
    en: 'Rear Lateral Low Left',
    fr: 'Arrière latéral gauche - vue basse',
    key: 'rear-lateral-low-left',
  },
  subtype: 'test_image_subtype',
  type: 'beauty_shot',
  siblingKey: 'test_sibling_key',
  width: 1280,
  mimetype: 'image/jpeg',
  path: 'https://www.googleapis.com/download/storage/v1/b/core-preview-images/o/None-f3f8b6cc-21ea-47a8-8484-e327072c43a2.jpeg?generation=1707215333711124&alt=media',
  viewpoint: {
    prediction: 'test_prediction',
    confidence: 0.9,
  },
  views: [],
  renderedOutputs: [],
};
