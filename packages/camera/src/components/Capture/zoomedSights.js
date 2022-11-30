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
  'fesc20-bD8CBhYZ': 1.15,
  'fesc20-T4dIGLgy': 1.1,
  'fesc20-EJ0tXYBW': 1.1,
  'fesc20-0mJeXBDf': 1.15,
  'ff150-7UI3m9B3': 1.2,
  'ff150-phbX7Bef': 1.25,
  'ff150-tT8sqplK': 1.25,
  'ff150-3lKZIoxw': 1.2,
  'ffocus18-GgOSpLl6': 1.2,
  'ffocus18-IoqRrmlA': 1.2,
  'ffocus18-8WjvbtMD': 1.2,
  'ffocus18-seOy3jwd': 1.2,
  'ftransit18-ffghVsNz': 1.1,
  'ftransit18-y_wTc7ED': 1.1,
  'ftransit18-f2W6pHaR': 1.1,
  'ftransit18--w_ir_yH': 1.1,
  'haccord-huAZfQJA': 1.25,
  'haccord-k6MiX2MR': 1.25,
  'haccord-zNA0vVT0': 1.25,
  'haccord-KvP-pm8L': 1.25,
  'jgc21-VHq_6BM-': 1.2,
  'jgc21-Emzc8jJA': 1.2,
  'jgc21-2_5eHL-F': 1.2,
  'jgc21-zkvFMHnS': 1.2,
  'tsienna20-jY3cR5vy': 1.15,
  'tsienna20-ZlRQXL-j': 1.1,
  'tsienna20-wlbzVAxz': 1.1,
  'tsienna20-MPCqHzeH': 1.15,
};
