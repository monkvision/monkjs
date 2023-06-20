import { CarOrientation } from '@monkvision/inspection-report';

const sightCarOrientationMap = {
  'jgc21-QIvfeg0X': CarOrientation.FRONT_LEFT, // Front Low
  'jgc21-KyUUVU2P': CarOrientation.FRONT_LEFT, // Hood
  'jgc21-zCrDwYWE': CarOrientation.FRONT_LEFT, // Front Bumper Side Left
  'jgc21-z15ZdJL6': CarOrientation.FRONT_LEFT, // Front Wheel Left
  'jgc21-RE3li6rE': CarOrientation.FRONT_LEFT, // Front Lateral Left
  'jgc21-omlus7Ui': CarOrientation.FRONT_LEFT, // Lateral Low Left
  'jgc21-m2dDoMup': CarOrientation.REAR_LEFT, // Rear Lateral Left
  'jgc21-3gjMwvQG': CarOrientation.REAR_LEFT, // Rear Wheel Left
  'jgc21-ezXzTRkj': CarOrientation.REAR_LEFT, // Rear Bumper Side Left
  'jgc21-tbF2Ax8v': CarOrientation.REAR_LEFT, // Rear
  'jgc21-3JJvM7_B': CarOrientation.REAR_RIGHT, // Rear Bumper Side Right
  'jgc21-RAVpqaE4': CarOrientation.REAR_RIGHT, // Rear Wheel Right
  'jgc21-F-PPd4qN': CarOrientation.REAR_RIGHT, // Rear Lateral Right
  'jgc21-XXh8GWm8': CarOrientation.FRONT_RIGHT, // Lateral Low Right
  'jgc21-TRN9Des4': CarOrientation.FRONT_RIGHT, // Front Lateral Low Right
  'jgc21-s7WDTRmE': CarOrientation.FRONT_RIGHT, // Front Wheel Right
  'jgc21-__JKllz9': CarOrientation.FRONT_RIGHT, // Front Bumper Side Right

  'fesc20-H1dfdfvH': CarOrientation.FRONT_LEFT, // Front Low
  'fesc20-WMUaKDp1': CarOrientation.FRONT_LEFT, // Hood
  'fesc20-LTe3X2bg': CarOrientation.FRONT_LEFT, // Front Bumper Side Left
  'fesc20-WIQsf_gX': CarOrientation.FRONT_LEFT, // Front Wheel Left
  'fesc20-hp3Tk53x': CarOrientation.FRONT_LEFT, // Front Lateral Left
  'fesc20-fOt832UV': CarOrientation.FRONT_LEFT, // Lateral Low Left
  'fesc20-NLdqASzl': CarOrientation.REAR_LEFT, // Rear Lateral Left
  'fesc20-4Wqx52oU': CarOrientation.REAR_LEFT, // Rear Wheel Left
  'fesc20-dfICsfSV': CarOrientation.REAR_LEFT, // Rear Bumper Side Left
  'fesc20-X8k7UFGf': CarOrientation.REAR_LEFT, // Rear
  'fesc20-LZc7p2kK': CarOrientation.REAR_RIGHT, // Rear Bumper Side Right
  'fesc20-5Ts1UkPT': CarOrientation.REAR_RIGHT, // Rear Wheel Right
  'fesc20-gg1Xyrpu': CarOrientation.REAR_RIGHT, // Rear Lateral Right
  'fesc20-P0oSEh8p': CarOrientation.FRONT_RIGHT, // Lateral Low Right
  'fesc20-j3H8Z415': CarOrientation.FRONT_RIGHT, // Front Lateral Low Right
  'fesc20-dKVLig1i': CarOrientation.FRONT_RIGHT, // Front Wheel Right
  'fesc20-Wzdtgqqz': CarOrientation.FRONT_RIGHT, // Front Bumper Side Right

  'haccord-8YjMcu0D': CarOrientation.FRONT_LEFT, // Front Low
  'haccord-DUPnw5jj': CarOrientation.FRONT_LEFT, // Hood
  'haccord-hsCc_Nct': CarOrientation.FRONT_LEFT, // Front Bumper Side Left
  'haccord-GQcZz48C': CarOrientation.FRONT_LEFT, // Front Wheel Left
  'haccord-QKfhXU7o': CarOrientation.FRONT_LEFT, // Front Lateral Left
  'haccord-mdZ7optI': CarOrientation.FRONT_LEFT, // Lateral Low Left
  'haccord-bSAv3Hrj': CarOrientation.REAR_LEFT, // Rear Lateral Left
  'haccord-W-Bn3bU1': CarOrientation.REAR_LEFT, // Rear Wheel Left
  'haccord-GdWvsqrm': CarOrientation.REAR_LEFT, // Rear Bumper Side Left
  'haccord-ps7cWy6K': CarOrientation.REAR_LEFT, // Rear
  'haccord-Jq65fyD4': CarOrientation.REAR_RIGHT, // Rear Bumper Side Right
  'haccord-OXYy5gET': CarOrientation.REAR_RIGHT, // Rear Wheel Right
  'haccord-5LlCuIfL': CarOrientation.REAR_RIGHT, // Rear Lateral Right
  'haccord-Gtt0JNQl': CarOrientation.FRONT_RIGHT, // Lateral Low Right
  'haccord-cXSAj2ez': CarOrientation.FRONT_RIGHT, // Front Lateral Low Right
  'haccord-KN23XXkX': CarOrientation.FRONT_RIGHT, // Front Wheel Right
  'haccord-Z84erkMb': CarOrientation.FRONT_RIGHT, // Front Bumper Side Right

  'ffocus18-XlfgjQb9': CarOrientation.FRONT_LEFT, // Front Low
  'ffocus18-3TiCVAaN': CarOrientation.FRONT_LEFT, // Hood
  'ffocus18-43ljK5xC': CarOrientation.FRONT_LEFT, // Front Bumper Side Left
  'ffocus18-x_1SE7X-': CarOrientation.FRONT_LEFT, // Front Wheel Left
  'ffocus18-QKfhXU7o': CarOrientation.FRONT_LEFT, // Front Lateral Left
  'ffocus18-yo9eBDW6': CarOrientation.FRONT_LEFT, // Lateral Low Left
  'ffocus18-cPUyM28L': CarOrientation.REAR_LEFT, // Rear Lateral Left
  'ffocus18-S3kgFOBb': CarOrientation.REAR_LEFT, // Rear Wheel Left
  'ffocus18-9MeSIqp7': CarOrientation.REAR_LEFT, // Rear Bumper Side Left
  'ffocus18-X2LDjCvr': CarOrientation.REAR_LEFT, // Rear
  'ffocus18-jWOq2CNN': CarOrientation.REAR_RIGHT, // Rear Bumper Side Right
  'ffocus18-P2jFq1Ea': CarOrientation.REAR_RIGHT, // Rear Wheel Right
  'ffocus18-U3Bcfc2Q': CarOrientation.REAR_RIGHT, // Rear Lateral Right
  'ffocus18-ts3buSD1': CarOrientation.FRONT_RIGHT, // Lateral Low Right
  'ffocus18-cXSAj2ez': CarOrientation.FRONT_RIGHT, // Front Lateral Low Right
  'ffocus18-KkeGvT-F': CarOrientation.FRONT_RIGHT, // Front Wheel Right
  'ffocus18-lRDlWiwR': CarOrientation.FRONT_RIGHT, // Front Bumper Side Right

  'ftransit18-wyXf7MTv': CarOrientation.FRONT_LEFT, // Front Low
  'ftransit18-UNAZWJ-r': CarOrientation.FRONT_LEFT, // Hood
  'ftransit18-5SiNC94w': CarOrientation.FRONT_LEFT, // Front Bumper Side Left
  'ftransit18-Y0vPhBVF': CarOrientation.FRONT_LEFT, // Front Wheel Left
  'ftransit18-xyp1rU0h': CarOrientation.FRONT_LEFT, // Front Lateral Left
  'ftransit18-6khKhof0': CarOrientation.FRONT_LEFT, // Lateral Low Left
  'ftransit18-eXJDDYmE': CarOrientation.REAR_LEFT, // Rear Lateral Left
  'ftransit18-3Sbfx_KZ': CarOrientation.REAR_LEFT, // Rear Wheel Left
  'ftransit18-iu1Vj2Oa': CarOrientation.REAR_LEFT, // Rear Bumper Side Left
  'ftransit18-aA2K898S': CarOrientation.REAR_LEFT, // Rear Up Left
  'ftransit18-NwBMLo3Z': CarOrientation.REAR_LEFT, // Rear
  'ftransit18-cf0e-pcB': CarOrientation.REAR_RIGHT, // Rear Up Right
  'ftransit18-FFP5b34o': CarOrientation.REAR_RIGHT, // Rear Bumper Side Right
  'ftransit18-RJ2D7DNz': CarOrientation.REAR_RIGHT, // Rear Wheel Right
  'ftransit18-3fnjrISV': CarOrientation.REAR_RIGHT, // Rear Lateral Right
  'ftransit18-eztNpSRX': CarOrientation.FRONT_RIGHT, // Lateral Low Right
  'ftransit18-TkXihCj4': CarOrientation.FRONT_RIGHT, // Front Lateral Low Right
  'ftransit18-4NMPqEV6': CarOrientation.FRONT_RIGHT, // Front Wheel Right
  'ftransit18-IIVI_pnX': CarOrientation.FRONT_RIGHT, // Front Bumper Side Right

  'tsienna20-YwrRNr9n': CarOrientation.FRONT_LEFT, // Front Low
  'tsienna20-HykkFbXf': CarOrientation.FRONT_LEFT, // Hood
  'tsienna20-TI4TVvT9': CarOrientation.FRONT_LEFT, // Front Bumper Side Left
  'tsienna20-65mfPdRD': CarOrientation.FRONT_LEFT, // Front Wheel Left
  'tsienna20-Ia0SGJ6z': CarOrientation.FRONT_LEFT, // Front Lateral Left
  'tsienna20-1LNxhgCR': CarOrientation.FRONT_LEFT, // Lateral Low Left
  'tsienna20-U_FqYq-a': CarOrientation.REAR_LEFT, // Rear Lateral Left
  'tsienna20-670P2H2V': CarOrientation.REAR_LEFT, // Rear Wheel Left
  'tsienna20-1n_z8bYy': CarOrientation.REAR_LEFT, // Rear Bumper Side Left
  'tsienna20-qA3aAUUq': CarOrientation.REAR_LEFT, // Rear
  'tsienna20--a2RmRcs': CarOrientation.REAR_RIGHT, // Rear Bumper Side Right
  'tsienna20-SebsoqJm': CarOrientation.REAR_RIGHT, // Rear Wheel Right
  'tsienna20-u57qDaN_': CarOrientation.REAR_RIGHT, // Rear Lateral Right
  'tsienna20-Rw0Gtt7O': CarOrientation.FRONT_RIGHT, // Lateral Low Right
  'tsienna20-TibS83Qr': CarOrientation.FRONT_RIGHT, // Front Lateral Low Right
  'tsienna20-cI285Gon': CarOrientation.FRONT_RIGHT, // Front Wheel Right
  'tsienna20-KHB_Cd9k': CarOrientation.FRONT_RIGHT, // Front Bumper Side Right

  'ff150-zXbg0l3z': CarOrientation.FRONT_LEFT, // Front Low
  'ff150-3he9UOwy': CarOrientation.FRONT_LEFT, // Hood
  'ff150-KgHVkQBW': CarOrientation.FRONT_LEFT, // Front Bumper Side Left
  'ff150-FqbrFVr2': CarOrientation.FRONT_LEFT, // Front Wheel Left
  'ff150-g_xBOOS2': CarOrientation.FRONT_LEFT, // Front Lateral Left
  'ff150-vwE3yqdh': CarOrientation.FRONT_LEFT, // Lateral Low Left
  'ff150-V-xzfWsx': CarOrientation.REAR_LEFT, // Rear Lateral Left
  'ff150-ouGGtRnf': CarOrientation.REAR_LEFT, // Rear Wheel Left
  'ff150--xPZZd83': CarOrientation.REAR_LEFT, // Rear Bumper Side Left
  'ff150-nF_oFvhI': CarOrientation.REAR_LEFT, // Rear
  'ff150-t3KBMPeD': CarOrientation.REAR_RIGHT, // Rear Bumper Side Right
  'ff150-3rM9XB0Z': CarOrientation.REAR_RIGHT, // Rear Wheel Right
  'ff150-eOjyMInj': CarOrientation.REAR_RIGHT, // Rear Lateral Right
  'ff150-18YVVN-G': CarOrientation.FRONT_RIGHT, // Lateral Low Right
  'ff150-BmXfb-qD': CarOrientation.FRONT_RIGHT, // Front Lateral Low Right
  'ff150-gFp78fQO': CarOrientation.FRONT_RIGHT, // Front Wheel Right
  'ff150-7nvlys8r': CarOrientation.FRONT_RIGHT, // Front Bumper Side Right
};

export default sightCarOrientationMap;
