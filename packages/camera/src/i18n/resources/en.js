const en = {
  translation: {
    closeEarlyModal: {
      cancel: 'Cancel',
      confirm: 'Confirm',
    },
    camera: {
      permissionDenied: 'Unable to access camera : permission denied.',
    },
    controls: {
      takePicture: 'Take Picture',
      fullScreen: 'Full Screen',
      exitFullScreen: 'Exit Full Screen',
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
        failed: 'We couldn\'t upload this image',
        idle: 'In the image quality check queue...',
        queueBlocked: 'We couldn\'t check the image quality (queue blocked)',
        reasonsStart: 'This image',
        reasonsJoin: 'and',
        reasons: {
          BLURRINESS: 'is blurry',
          UNDEREXPOSURE: 'is underexposed (too dark)',
          OVEREXPOSURE: 'is overexposed (too bright)',
          TOO_ZOOMED: 'is too zoomed',
          NOT_ZOOMED_ENOUGH: 'is too far from vehicle',
          WRONG_ANGLE: 'is taken from incorrect angle',
          UNKNOWN_VIEWPOINT: 'doesn\'t match photo guide',
          WRONG_CENTER_PART: 'is not centered on the right part',
          MISSING_PARTS: 'is missing important car parts',
          HIDDEN_PARTS: 'has some car parts not visible enough',
          NO_CAR_BODY: 'doesn\'t have a clear vehicle',
          UNKNOWN_SIGHT: 'can\'t be analysed for the car coverage',
          INTERIOR_NOT_SUPPORTED: 'can\'t be analysed for the car coverage',
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
    partSelector: {
      help: {
        title: 'Additional Damage',
        content: 'In order to add additional damage photos to your inspection, please select the vehicle part of the damage.',
        cancel: 'Cancel',
        okay: 'Okay!',
      },
      modal: {
        title: 'Select Vehicle Parts',
        subtitle: 'Please select vehicle parts and use the arrow buttons to rotate.',
        cancel: 'Cancel',
        confirm: 'Confirm',
      },
      overlay: {
        title: 'Additional Photo',
        indication: 'Please make sure to capture the damage on the picture.',
      },
      parts: {
        bumper_back: 'Rear Bumper',
        bumper_front: 'Front Bumper',
        door_back_left: 'Rear Door Left',
        door_back_right: 'Rear Door Right',
        door_front_left: 'Front Door Left',
        door_front_right: 'Front Door Right',
        fender_back_left: 'Rear Fender Left',
        fender_back_right: 'Rear Fender Right',
        fender_front_left: 'Front Fender Left',
        fender_front_right: 'Front Fender Right',
        fog_light_back_left: 'Rear Fog Light Left',
        fog_light_back_right: 'Rear Fog Light Right',
        fog_light_front_left: 'Front Fog Light Left',
        fog_light_front_right: 'Front Fog Light Right',
        grill_low: 'Grill Low',
        grill_radiator: 'Radiator Grill',
        handle_back_left: 'Rear Handle Left',
        handle_back_right: 'Rear Handle Right',
        handle_front_left: 'Front Handle Left',
        handle_front_right: 'Front Handle Right',
        head_light_left: 'Head Light Left',
        head_light_right: 'Head Light Right',
        mirror_left: 'Mirror Left',
        mirror_right: 'Mirror Right',
        quarter_window_back_left: 'Rear Quarter Window Left',
        quarter_window_back_right: 'Rear Quarter Window Right',
        quarter_window_front_left: 'Front Quarter Window Left',
        quarter_window_front_right: 'Front Quarter Window Right',
        rocker_panel_left: 'Rocker Panel Left',
        rocker_panel_right: 'Rocker Panel Right',
        tail_light_left: 'Tail Light Left',
        tail_light_right: 'Tail Light Right',
        wheel_back_left: 'Rear Wheel Left',
        wheel_back_right: 'Rear Wheel Right',
        wheel_front_left: 'Front Wheel Left',
        wheel_front_right: 'Front Wheel Right',
        window_back_left: 'Rear Window Left',
        window_back_right: 'Rear Window Right',
        window_corner_left: 'Corner Window Left',
        window_corner_right: 'Corner Window Right',
        window_front_left: 'Front Window Left',
        window_front_right: 'Front Window Right',
        windshield_back: 'Windshield Back',
        windshield_front: 'Windshield Front',
        front_spoiler: 'Front Spoiler',
        rear_spoiler: 'Rear Spoiler',
        hood: 'Hood',
        petrol_door: 'Petrol Door',
        pillar: 'Pillar',
        roof: 'Roof',
        trunk: 'Trunk',
      },
    },
  },
};

export default en;
