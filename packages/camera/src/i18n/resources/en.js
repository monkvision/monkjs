const en = {
  translation: {
    camera: {
      permissionDenied: 'Unable to access camera : permission denied.',
    },
    controls: {
      takePicture: 'Take Picture',
      fullScreen: 'Fullscreen',
      settings: 'Settings',
      quit: 'Quit',
      toggleOverlays: 'Toggle Overlays',
    },
    layout: {
      rotateDevice: 'Please rotate your device ↪',
      unlockPortraitMode: 'You may need to unlock portrait mode through phone settings',
      anglePill: {
        low: 'LOW',
        mid: 'MID',
        high: 'HIGH',
      },
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
    partSelector: {
      title: 'Choose a Car Part',
      notification: 'Picture successfully taken !',
      sections: {
        bumpers: {
          name: 'Bumpers',
          elements: {
            bumper_back: 'Rear Bumper',
            bumper_front: 'Front Bumper',
          },
        },
        doors: {
          name: 'Doors',
          elements: {
            door_back_right: 'Rear Door Right',
            door_back_left: 'Rear Door Left',
            door_front_left: 'Front Door Left',
            door_front_right: 'Front Door Right',
          },
        },
        mirrors: {
          name: 'Mirrors',
          elements: {
            mirror_left: 'Mirror Left',
            mirror_right: 'Mirror Right',
          },
        },
        grills: {
          name: 'Grills',
          elements: {
            grill_radiator: 'Radiator Grill',
            grill_low: 'Grill Low',
          },
        },
        fogLights: {
          name: 'Fog Lights',
          elements: {
            fog_light_back_left: 'Rear Fog Light Left',
            fog_light_back_right: 'Rear Fog Light Right',
            fog_light_front_left: 'Front Fog Light Left',
            fog_light_front_right: 'Front Fog Light Right',
          },
        },
        headLights: {
          name: 'Head Lights',
          elements: {
            head_light_left: 'Head Light Left',
            head_light_right: 'Head Light Right',
          },
        },
        handles: {
          name: 'Handles',
          elements: {
            handle_back_left: 'Rear Handle Left',
            handle_back_right: 'Rear Handle Right',
            handle_front_left: 'Front Handle Left',
            handle_front_right: 'Front Handle Right',
          },
        },
        spoilers: {
          name: 'Spoilers',
          elements: {
            front_spoiler: 'Front Spoiler',
            rear_spoiler: 'Rear Spoiler',
          },
        },
        fenders: {
          name: 'Fenders',
          elements: {
            fender_back_left: 'Rear Fender Left',
            fender_back_right: 'Rear Fender Right',
            fender_front_left: 'Front Fender Left',
            fender_front_right: 'Front Fender Right',
          },
        },
        rockerPanels: {
          name: 'Rocker Panels',
          elements: {
            rocker_panel_right: 'Rocker Panel Right',
            rocker_panel_left: 'Rocker Panel Left',
          },
        },
        wheels: {
          name: 'Wheels',
          elements: {
            wheel_back_left: 'Rear Wheel Left',
            wheel_back_right: 'Rear Wheel Right',
            wheel_front_left: 'Front Wheel Left',
            wheel_front_right: 'Front Wheel Right',
          },
        },
        windshields: {
          name: 'Windshields',
          elements: {
            windshield_back: 'Windshield Back',
            windshield_front: 'Windshield Front',
          },
        },
        quarterWindows: {
          name: 'Quarter Windows',
          elements: {
            quarter_window_back_left: 'Rear Quarter Window Left',
            quarter_window_back_right: 'Rear Quarter Window Right',
            quarter_window_front_left: 'Front Quarter Window Left',
            quarter_window_front_right: 'Front Quarter Window Right',
          },
        },
        windows: {
          name: 'Windows',
          elements: {
            window_back_left: 'Rear Window Left',
            window_back_right: 'Rear Window Right',
            window_corner_left: 'Corner Window Left',
            window_corner_right: 'Corner Window Right',
            window_front_left: 'Front Window Left',
            window_front_right: 'Front Window Right',
          },
        },
        others: {
          name: 'Others',
          elements: {
            hood: 'Hood',
            petrol_door: 'Petrol Door',
            pillar: 'Pillar',
            roof: 'Roof',
            trunk: 'Trunk',
          },
        },
      },
    },
  },
};

export default en;
