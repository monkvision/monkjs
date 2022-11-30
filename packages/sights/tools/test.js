const fs = require('fs');

const sightIds = {
  suv: [
    'jgc21-QIvfeg0X', // Front Low
    'jgc21-KyUUVU2P', // Hood
    'jgc21-VHq_6BM-', // Front Full Left
    'jgc21-RE3li6rE', // Front Lateral Left (updated)
    'jgc21-imomJ2V0', // Front Roof Left
    'jgc21-omlus7Ui', // Lateral Low Left
    'jgc21-TEoi50Ff', // Lateral Full Left
    'jgc21-m2dDoMup', // Rear Lateral Left (updated)
    'jgc21-Emzc8jJA', // Rear Full Left
    'jgc21-tbF2Ax8v', // Rear
    'jgc21-ZubJ48-U', // Rear Roof
    'jgc21-2_5eHL-F', // Rear Full Right
    'jgc21-F-PPd4qN', // Rear Lateral Right (updated)
    'jgc21-1j-oTPag', // Lateral Full Right
    'jgc21-XXh8GWm8', // Lateral Low Right
    'jgc21-TRN9Des4', // Front Lateral Right (updated)
    'jgc21-zkvFMHnS', // Front Full Right
  ],
  cuv: [
    'fesc20-H1dfdfvH', // Front Low
    'fesc20-WMUaKDp1', // Hood
    'fesc20-bD8CBhYZ', // Front Full Left
    'fesc20-hp3Tk53x', // Front Lateral Left (updated)
    'fesc20-6GPUkfYn', // Front Roof Left
    'fesc20-fOt832UV', // Lateral Low Left
    'fesc20-26n47kaO', // Lateral Full Left
    'fesc20-NLdqASzl', // Rear Lateral Left (updated)
    'fesc20-T4dIGLgy', // Rear Full Left
    'fesc20-X8k7UFGf', // Rear (updated ?)
    'fesc20-2bLRuhEQ', // Rear Roof
    'fesc20-EJ0tXYBW', // Rear Full Right
    'fesc20-gg1Xyrpu', // Rear Lateral Right (updated)
    'fesc20-HYz5ziHi', // Lateral Full Right
    'fesc20-P0oSEh8p', // Lateral Low Right
    'fesc20-j3H8Z415', // Front Lateral Right (updated)
    'fesc20-0mJeXBDf', // Front Full Right
  ],
  sedan: [
    'haccord-8YjMcu0D', // Front Low
    'haccord-DUPnw5jj', // Hood
    'haccord-huAZfQJA', // Front Full Left
    'haccord-QKfhXU7o', // Front Lateral Left (updated)
    'haccord-oiY_yPTR', // Front Roof Left
    'haccord-mdZ7optI', // Lateral Low Left
    'haccord-_YnTubBA', // Lateral Full Left
    'haccord-bSAv3Hrj', // Rear Lateral Left (updated)
    'haccord-k6MiX2MR', // Rear Full Left
    'haccord-ps7cWy6K', // Rear (updated ?)
    'haccord-pplCo6sV', // Rear Roof
    'haccord-zNA0vVT0', // Rear Full Right
    'haccord-5LlCuIfL', // Rear Lateral Right (updated)
    'haccord-PGr3RzzP', // Lateral Full Right
    'haccord-Gtt0JNQl', // Lateral Low Right
    'haccord-cXSAj2ez', // Front Lateral Right (updated)
    'haccord-KvP-pm8L', // Front Full Right
  ],
  hatchback: [
    'ffocus18-XlfgjQb9', // Front Low
    'ffocus18-3TiCVAaN', // Hood
    'ffocus18-GgOSpLl6', // Front Full Left
    'ffocus18-QKfhXU7o', // Front Lateral Left (updated)
    'ffocus18-ZXKOomlv', // Front Roof Left
    'ffocus18-yo9eBDW6', // Lateral Low Left
    'ffocus18-6FX31ty1', // Lateral Full Left
    'ffocus18-cPUyM28L', // Rear Lateral Left (updated)
    'ffocus18-IoqRrmlA', // Rear Full Left
    'ffocus18-X2LDjCvr', // Rear (updated ?)
    'ffocus18-p6mBZGcW', // Rear Roof
    'ffocus18-8WjvbtMD', // Rear Full Right
    'ffocus18-U3Bcfc2Q', // Rear Lateral Right (updated)
    'ffocus18-FdsQDaTW', // Lateral Full Right
    'ffocus18-ts3buSD1', // Lateral Low Right
    'ffocus18-cXSAj2ez', // Front Lateral Right (updated)
    'ffocus18-seOy3jwd', // Front Full Right
  ],
  van: [
    'ftransit18-wyXf7MTv', // Front Low
    'ftransit18-UNAZWJ-r', // Hood
    'ftransit18-ffghVsNz', // Front Full Left
    'ftransit18-xyp1rU0h', // Front Lateral Left (updated)
    'ftransit18-6khKhof0', // Lateral Low Left
    'ftransit18-rsXWUN8X', // Lateral Full Left
    'ftransit18-eXJDDYmE', // Rear Lateral Left (updated)
    'ftransit18-y_wTc7ED', // Rear Full Left
    'ftransit18-NwBMLo3Z', // Rear
    'ftransit18-cf0e-pcB', // Rear Up Right
    'ftransit18-f2W6pHaR', // Rear Full Right
    'ftransit18-3fnjrISV', // Rear Lateral Right (updated)
    'ftransit18-G24AdP6r', // Lateral Full Right
    'ftransit18-eztNpSRX', // Lateral Low Right
    'ftransit18-TkXihCj4', // Front Lateral Right (updated)
    'ftransit18--w_ir_yH', // Front Full Right
  ],
  minivan: [
    'tsienna20-YwrRNr9n', // Front Low
    'tsienna20-HykkFbXf', // Hood
    'tsienna20-jY3cR5vy', // Front Full Left
    'tsienna20-Ia0SGJ6z', // Front Lateral Left (updated)
    'tsienna20-is1tpnqR', // Front Roof Left
    'tsienna20-1LNxhgCR', // Lateral Low Left
    'tsienna20-4ihRwDkS', // Lateral Full Left
    'tsienna20-U_FqYq-a', // Rear Lateral Left (updated)
    'tsienna20-ZlRQXL-j', // Rear Full Left
    'tsienna20-qA3aAUUq', // Rear
    'tsienna20-OxFWgEPk', // Rear Roof
    'tsienna20-wlbzVAxz', // Rear Full Right
    'tsienna20-u57qDaN_', // Rear Lateral Right (updated)
    'tsienna20-uIHdpQ9y', // Lateral Full Right
    'tsienna20-Rw0Gtt7O', // Lateral Low Right
    'tsienna20-TibS83Qr', // Front Lateral Right (updated)
    'tsienna20-MPCqHzeH', // Front Full Right
  ],
  pickup: [
    'ff150-zXbg0l3z', // Front Low
    'ff150-3he9UOwy', // Hood
    'ff150-7UI3m9B3', // Front Full Left
    'ff150-g_xBOOS2', // Front Lateral Left (updated)
    'ff150-Ttsc7q6V', // Front Roof Left
    'ff150-vwE3yqdh', // Lateral Low Left
    'ff150-GOx2s_9L', // Lateral Full Left
    'ff150-V-xzfWsx', // Rear Lateral Left (updated)
    'ff150-phbX7Bef', // Rear Full Left
    'ff150-nF_oFvhI', // Rear (updated ?)
    'ff150-tT8sqplK', // Rear Full Right
    'ff150-eOjyMInj', // Rear Lateral Right (updated)
    'ff150-_UIadfVL', // Lateral Full Right
    'ff150-18YVVN-G', // Lateral Low Right
    'ff150-BmXfb-qD', // Front Lateral Right (updated)
    'ff150-3lKZIoxw', // Front Full Right
  ],
};

const sights = JSON.parse(fs.readFileSync('../index.json').toString());

const invalid = [];

Object.values(sightIds).forEach((vehicleSights) => vehicleSights.forEach((id) => {
  const sight = sights[id];
  if (!Array.isArray(sight.pointsOfInterest) || typeof sight.angle !== 'string') {
    invalid.push({ a: id, m: sight.mirror_sight });
  }
}));

console.log('Invalid :', JSON.stringify(invalid, null, 2));
