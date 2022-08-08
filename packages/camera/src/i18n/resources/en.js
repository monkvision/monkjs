const en = {
  translation: {
    embeddedModels: {
      error: {
        message: 'An unexpected error occurred during the download of the models.',
        retry: 'Retry',
      },
      skip: 'Validate Anyway',
    },
    camera: {
      permissionDenied: 'Unable to access camera : permission denied.',
    },
    controls: {
      takePicture: 'Take Picture',
      fullScreen: 'Fullscreen',
      settings: 'Settings',
      quit: 'Quit',
    },
    layout: {
      rotateDevice: 'Please rotate your device ↪',
      unlockPortraitMode: 'You may need to unlock portrait mode through phone settings',
    },
    uploadCenter: {
      view: {
        title: 'Image quality check',
        subtitle: 'The better image quality, the more accurate result we can provide',
        verifying: 'Verifying...',
        tooMuchTodo: 'We couldn\'t check all pictures compliance, this might affect the result accuracy',
        allRejected: 'We couldn\'t upload any picture, please re-upload',
        loading: 'Loading...',
        retakeAll: 'Retake all',
        submit: 'Skip retaking',
      },
      subtitle: {
        unknown: 'Couldn\'t check the image quality',
        pending: 'Loading...',
        failed: 'We couldn\'t upload this image, please reupload',
        idle: 'In the image quality check queue...',
        queueBlocked: 'We couldn\'t check the image quality (queue blocked)',
        reasonsStart: 'This image',
        reasonsJoin: 'and',
        reasons: {
          blurriness: 'is blurry',
          underexposure: 'is underexposed (too dark)',
          overexposure: 'is overexposed (too bright)',
          'TOO_ZOOMED--too zoomed': 'is too zoomed',
          'NOT_ZOOMED_ENOUGH--not zoomed enough': 'is too far from vehicle',
          'WRONG_ANGLE--wrong angle': 'is taken from incorrect angle',
          'UNKNOWN_VIEWPOINT--unknown viewpoint': 'doesn\'t match photo guide',
          'WRONG_CENTER_PART--picture centered on the wrong parts': 'is not centered on the right part',
          'MISSING_PARTS--missing some parts': 'is missing important car parts',
          'HIDDEN_PARTS--some parts not visible enough': 'has some car parts not visible enough',
          'NO_CAR_BODY--no car body detected': 'doesn\'t have a clear vehicle',
        },
      },
      variant: {
        reupload: {
          label: 'Reupload picture',
          sublabel: 'press here to reupload...',
        },
        inQueue: {
          label: 'In queue',
        },
        recheck: {
          label: 'Recheck picture',
          sublabel: 'press here to recheck...',
        },
        retake: {
          label: 'Retake picture',
          sublabel: 'press here to retake...',
        },
      },
    },
  },
};

export default en;
