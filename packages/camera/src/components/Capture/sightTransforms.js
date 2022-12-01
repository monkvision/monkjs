/*
 * Note : This workaround is implemented because some overlays were created for a specific video
 * format (for instance 4:3), and when used on another video format, they appear too far off.
 * The optimal solution for this would be to have, for each sight in the index.json, a map
 * indicating the zoom to apply based on the video format. For instance :
 *
 * {
 *   "id": "ffocus18-vFR9PKjB",
 *   "zoom": {
 *     "1": 0.9,
 *     "4:3": 1,
 *     "16:9": 1.2,
 *   }
 * }
 *
 * But right now, since we just need a quick fix for data collection, im hard coding this
 * like that. At some point (in the package refacto ??) we should change that.
 *   - Samy 30/11/22
 *
 * And now we need to add even more tranformations like translate !! Yeehaaw !!
 *   - Samy 01/12/22
 */
export default {
  'fesc20-bD8CBhYZ': [{ scale: 1.15 }], // Front Full Left
  'fesc20-hp3Tk53x': [{ scale: 1.35 }, { translateY: -55 }], // Front Lateral Left
  'fesc20-fOt832UV': [{ scale: 1.1 }], // Lateral Low Left
  'fesc20-26n47kaO': [{ scale: 1.4 }], // Lateral Full Left
  'fesc20-NLdqASzl': [{ scale: 1.35 }, { translateY: -45 }], // Rear Lateral Left
  'fesc20-T4dIGLgy': [{ scale: 1.1 }], // Rear Full Left
  'fesc20-EJ0tXYBW': [{ scale: 1.1 }], // Rear Full Right
  'fesc20-gg1Xyrpu': [{ scale: 1.35 }, { translateY: -45 }], // Rear Lateral Right
  'fesc20-HYz5ziHi': [{ scale: 1.4 }], // Lateral Full Right
  'fesc20-P0oSEh8p': [{ scale: 1.1 }], // Lateral Low Right
  'fesc20-j3H8Z415': [{ scale: 1.35 }, { translateY: -55 }], // Front Lateral Right
  'fesc20-0mJeXBDf': [{ scale: 1.15 }], // Front Full Right

  'ff150-7UI3m9B3': [{ scale: 1.2 }], // Front Full Left
  'ff150-g_xBOOS2': [{ scale: 1.2 }, { translateY: -60 }], // Front Lateral Left
  'ff150-GOx2s_9L': [{ scale: 1.4 }], // Lateral Full Left
  'ff150-V-xzfWsx': [{ scale: 1.2 }, { translateY: -20 }], // Rear Lateral Left
  'ff150-phbX7Bef': [{ scale: 1.25 }], // Rear Full Left
  'ff150-tT8sqplK': [{ scale: 1.25 }], // Rear Full Right
  'ff150-eOjyMInj': [{ scale: 1.2 }, { translateY: -20 }], // Rear Lateral Right
  'ff150-_UIadfVL': [{ scale: 1.4 }], // Lateral Full Right
  'ff150-BmXfb-qD': [{ scale: 1.2 }, { translateY: -60 }], // Front Lateral Right
  'ff150-3lKZIoxw': [{ scale: 1.2 }], // Front Full Right

  'ffocus18-GgOSpLl6': [{ scale: 1.2 }], // Front Full Left
  'ffocus18-QKfhXU7o': [{ scale: 1.4 }, { translateY: -60 }], // Front Lateral Left
  'ffocus18-yo9eBDW6': [{ scale: 1.15 }, { translateY: -30 }], // Lateral Low Left
  'ffocus18-6FX31ty1': [{ scale: 1.4 }], // Lateral Full Left
  'ffocus18-cPUyM28L': [{ scale: 1.4 }, { translateY: -50 }], // Rear Lateral Left
  'ffocus18-IoqRrmlA': [{ scale: 1.2 }], // Rear Full Left
  'ffocus18-8WjvbtMD': [{ scale: 1.2 }], // Rear Full Right
  'ffocus18-U3Bcfc2Q': [{ scale: 1.4 }, { translateY: -50 }], // Rear Lateral Right
  'ffocus18-FdsQDaTW': [{ scale: 1.4 }], // Lateral Full Right
  'ffocus18-ts3buSD1': [{ scale: 1.15 }, { translateY: -30 }], // Lateral Low Right
  'ffocus18-cXSAj2ez': [{ scale: 1.4 }, { translateY: -60 }], // Front Lateral Right
  'ffocus18-seOy3jwd': [{ scale: 1.2 }], // Front Full Right

  'ftransit18-ffghVsNz': [{ scale: 1.1 }], // Front Full Left
  'ftransit18-xyp1rU0h': [{ scale: 1.05 }], // Front Lateral Left
  'ftransit18-rsXWUN8X': [{ scale: 1.35 }], // Lateral Full Left
  'ftransit18-y_wTc7ED': [{ scale: 1.1 }], // Rear Full Left
  'ftransit18-f2W6pHaR': [{ scale: 1.1 }], // Rear Full Right
  'ftransit18-G24AdP6r': [{ scale: 1.35 }], // Lateral Full Right
  'ftransit18-TkXihCj4': [{ scale: 1.05 }], // Front Lateral Right
  'ftransit18--w_ir_yH': [{ scale: 1.1 }], // Front Full Right

  'haccord-huAZfQJA': [{ scale: 1.25 }], // Front Full Left
  'haccord-QKfhXU7o': [{ scale: 1.3 }, { translateY: -55 }], // Front Lateral Left
  'haccord-mdZ7optI': [{ scale: 1.1 }, { translateY: -20 }], // Lateral Low Left
  'haccord-_YnTubBA': [{ scale: 1.4 }], // Lateral Full Left
  'haccord-bSAv3Hrj': [{ scale: 1.3 }, { translateY: -55 }], // Rear Lateral Left
  'haccord-k6MiX2MR': [{ scale: 1.25 }], // Rear Full Left
  'haccord-zNA0vVT0': [{ scale: 1.25 }], // Rear Full Right
  'haccord-5LlCuIfL': [{ scale: 1.3 }, { translateY: -55 }], // Rear Lateral Right
  'haccord-PGr3RzzP': [{ scale: 1.4 }], // Lateral Full Right
  'haccord-Gtt0JNQl': [{ scale: 1.1 }, { translateY: -20 }], // Lateral Low Right
  'haccord-cXSAj2ez': [{ scale: 1.3 }, { translateY: -55 }], // Front Lateral Right
  'haccord-KvP-pm8L': [{ scale: 1.25 }], // Front Full Right

  'jgc21-VHq_6BM-': [{ scale: 1.2 }], // Front Full Left
  'jgc21-RE3li6rE': [{ scale: 1.3 }, { translateY: -50 }], // Front Lateral Left
  'jgc21-TEoi50Ff': [{ scale: 1.4 }], // Lateral Full Left
  'jgc21-m2dDoMup': [{ scale: 1.2 }, { translateY: -60 }], // Rear Lateral Left
  'jgc21-Emzc8jJA': [{ scale: 1.2 }], // Rear Full Left
  'jgc21-2_5eHL-F': [{ scale: 1.2 }], // Rear Full Right
  'jgc21-F-PPd4qN': [{ scale: 1.2 }, { translateY: -60 }], // Rear Lateral Right
  'jgc21-1j-oTPag': [{ scale: 1.4 }], // Lateral Full Right
  'jgc21-TRN9Des4': [{ scale: 1.3 }, { translateY: -50 }], // Front Lateral Right
  'jgc21-zkvFMHnS': [{ scale: 1.2 }], // Front Full Right

  'tsienna20-jY3cR5vy': [{ scale: 1.15 }], // Front Full Left
  'tsienna20-Ia0SGJ6z': [{ scale: 1.4 }, { translateY: -60 }], // Front Lateral Left
  'tsienna20-4ihRwDkS': [{ scale: 1.4 }], // Lateral Full Left
  'tsienna20-U_FqYq-a': [{ scale: 1.2 }, { translateY: -60 }], // Rear Lateral Left
  'tsienna20-ZlRQXL-j': [{ scale: 1.1 }], // Rear Full Left
  'tsienna20-wlbzVAxz': [{ scale: 1.1 }], // Rear Full Right
  'tsienna20-u57qDaN_': [{ scale: 1.2 }, { translateY: -60 }], // Rear Lateral Right
  'tsienna20-uIHdpQ9y': [{ scale: 1.4 }], // Lateral Full Right
  'tsienna20-TibS83Qr': [{ scale: 1.4 }, { translateY: -60 }], // Front Lateral Right
  'tsienna20-MPCqHzeH': [{ scale: 1.15 }], // Front Full Right
};
