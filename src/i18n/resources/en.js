const en = {
  translation: {
    appLoading: 'Launching the App...',
    inspection: {
      vinNumber: {
        title: 'VIN (Vehicle Identification Number)',
        description: 'Detect it with your camera or type it manually',
      },
      damageDetection: {
        title: 'Vehicle tour (exterior)',
        description: 'Damage detection',
      },
      interior: {
        title: 'Vehicle tour (interior)',
        description: 'Damage detection',
      },
      wheelsAnalysis: {
        title: 'Wheels Analysis',
        description: 'Details about rims conditions',
      },
      status: {
        NOT_STARTED: 'Waiting to be started',
        TODO: 'In progress...',
        IN_PROGRESS: 'In progress...',
        DONE: 'Has finished!',
        ERROR: 'Failed!',
      },
    },
    landing: {
      logoDescription: 'Inspect your car with',
      menuHeader: 'Click to run a new inspection',
      resetInspection: 'Reset Inspection',
      lastInspection: 'Last inspection',
      signOut: 'Sign Out',
    },
    vinModal: {
      title: 'How to set VIN number?',
      camera: 'Detect with camera',
      manual: 'Type it manually',
      prompt: {
        title: 'VIN (Vehicle Identification Number)',
        message: 'Please enter the VIN',
        backgroundMessage: 'Please fill the needed content on the prompt',
        backgroundGoBack: 'Go Back',
      },
    },
    signin: {
      authRequested: {
        title: 'Authentication requested.',
        message: 'Please sign in to start the inspection.',
        button: 'Sign In',
      },
      success: {
        title: 'Authenticated!',
        message: 'You are logged in! Now you can start the inspection.',
        button: 'Start inspection',
      },
      error: {
        title: 'Sorry 😞',
        message: 'An error occurred while authenticating, please try again in a minute.',
        button: 'Go back to home page',
      },
      loader: {
        signingIn: 'Signing in',
        authenticating: 'Authenticating',
        robot: 'Checking you\'re not a robot',
        loading: 'Loading',
      },
    },
    createInspection: {
      error: {
        title: 'Sorry 😞',
        message: 'An error occurred while creating the inspection, please try again in a minute.',
        button: 'Go back to home page',
      },
    },
    updateInspection: {
      loader: {
        updating: 'Updating the inspection',
        waking: 'Waking up the AI',
        processing: 'Processing...',
      },
      error: {
        title: 'Sorry 😞',
        message: 'An error occurred while updating the inspection, please try again in a minute.',
        button: 'Go back to home page',
      },
    },
    inspectionList: {
      error: {
        title: 'Error',
        message: 'An error occurred while fetching the list of your inspections.',
      },
      empty: {
        title: 'Empty inspection list',
        message: 'Add new inspection and it will show up here.',
      },
    },
    capture: {
      quit: {
        title: 'Are you sure you want to quit the capture?',
        message: 'Your taken pictures for this task will be lost.',
        cancel: 'Cancel',
        ok: 'OK',
      },
      settings: {
        title: 'Settings',
        resolution: 'Resolution',
        compression: 'Image Compression',
        fullscreen: 'Fullscreen',
        exitFullscreen: 'Exit Fullscreen',
        on: 'On',
        off: 'Off',
      },
    },
  },
};

export default en;
