export const MonkTestId = {
  CAMERA_PREVIEW: 'camera-preview',
  TAKE_PICTURE_BTN: 'take-picture-btn',
  MONK_GALLERY_BTN: 'monk-gallery-btn',
  CAPTURE_BTN: 'capture-btn',
  CARD_BTN: 'card-btn',
  RECORD_VIDEO_BUTTON: 'record-video-button',
  WALKAROUND_INDICATOR_CONTAINER: 'walkaround-indicator-container',
} as const;
export type MonkTestId = (typeof MonkTestId)[keyof typeof MonkTestId];

export const MonkE2eId = {
  GALLERY_SUBMIT: 'gallery-submit',
  GALLERY_FILTER_MANUAL: 'gallery-filter-manual',
  GALLERY_FILTER_BEAUTY_SHOTS: 'gallery-filter-beauty-shots',
  GALLERY_FILTER_VIDEO: 'gallery-filter-video',
  GALLERY_FILTER_APPROVED: 'gallery-filter-approved',
  GALLERY_FILTER_RETAKE: 'gallery-filter-retake',
  GALLERY_CARD_PENDING: 'gallery-card-pending',
  GALLERY_CARD_SUCCESS: 'gallery-card-success',
  GALLERY_CARD_NON_COMPLIANT: 'gallery-card-non-compliant',
  GALLERY_CARD_ERROR: 'gallery-card-error',
  GALLERY_CARD_VIDEO: 'gallery-card-video',
  VEHICLE_TYPE_CONFIRM: 'vehicle-type-confirm',
  VEHICLE_TYPE_CARD_PREFIX: 'vehicle-type-card-',
  PHOTO_TUTORIAL_NEXT: 'photo-tutorial-next',
  PERMISSIONS_CONFIRM: 'permissions-confirm',
  TUTORIAL_CONTINUE: 'tutorial-continue',
  VIDEO_CAPTURE_PROCEED: 'video-capture-proceed',
} as const;
export type MonkE2eId = (typeof MonkE2eId)[keyof typeof MonkE2eId];
