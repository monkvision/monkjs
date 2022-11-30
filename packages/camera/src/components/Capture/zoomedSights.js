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
 *
 *   - Samy 30/11/22
 */
export default {
  'fesc20-bD8CBhYZ': 1.15, // Front Full Left
  'fesc20-26n47kaO': 1.4, // Lateral Full Left
  'fesc20-T4dIGLgy': 1.1, // Rear Full Left
  'fesc20-EJ0tXYBW': 1.1, // Rear Full Right
  'fesc20-HYz5ziHi': 1.4, // Lateral Full Right
  'fesc20-0mJeXBDf': 1.15, // Front Full Right

  'ff150-7UI3m9B3': 1.2, // Front Full Left
  'ff150-GOx2s_9L': 1.4, // Lateral Full Left
  'ff150-phbX7Bef': 1.25, // Rear Full Left
  'ff150-tT8sqplK': 1.25, // Rear Full Right
  'ff150-_UIadfVL': 1.4, // Lateral Full Right
  'ff150-3lKZIoxw': 1.2, // Front Full Right

  'ffocus18-GgOSpLl6': 1.2, // Front Full Left
  'ffocus18-6FX31ty1': 1.4, // Lateral Full Left
  'ffocus18-IoqRrmlA': 1.2, // Rear Full Left
  'ffocus18-8WjvbtMD': 1.2, // Rear Full Right
  'ffocus18-FdsQDaTW': 1.4, // Lateral Full Right
  'ffocus18-seOy3jwd': 1.2, // Front Full Right

  'ftransit18-ffghVsNz': 1.1, // Front Full Left
  'ftransit18-rsXWUN8X': 3, // Lateral Full Left
  'ftransit18-y_wTc7ED': 1.1, // Rear Full Left
  'ftransit18-f2W6pHaR': 1.1, // Rear Full Right
  'ftransit18-G24AdP6r': 3, // Lateral Full Right
  'ftransit18--w_ir_yH': 1.1, // Front Full Right

  'haccord-huAZfQJA': 1.25, // Front Full Left
  'haccord-_YnTubBA': 1.4, // Lateral Full Left
  'haccord-k6MiX2MR': 1.25, // Rear Full Left
  'haccord-zNA0vVT0': 1.25, // Rear Full Right
  'haccord-PGr3RzzP': 1.4, // Lateral Full Right
  'haccord-KvP-pm8L': 1.25, // Front Full Right

  'jgc21-VHq_6BM-': 1.2, // Front Full Left
  'jgc21-TEoi50Ff': 1.4, // Lateral Full Left
  'jgc21-Emzc8jJA': 1.2, // Rear Full Left
  'jgc21-2_5eHL-F': 1.2, // Rear Full Right
  'jgc21-1j-oTPag': 1.4, // Lateral Full Right
  'jgc21-zkvFMHnS': 1.2, // Front Full Right

  'tsienna20-jY3cR5vy': 1.15, // Front Full Left
  'tsienna20-4ihRwDkS': 1.4, // Lateral Full Left
  'tsienna20-ZlRQXL-j': 1.1, // Rear Full Left
  'tsienna20-wlbzVAxz': 1.1, // Rear Full Right
  'tsienna20-uIHdpQ9y': 1.4, // Lateral Full Right
  'tsienna20-MPCqHzeH': 1.15, // Front Full Right
};
