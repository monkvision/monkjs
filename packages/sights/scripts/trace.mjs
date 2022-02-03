import fs from 'fs';
import ImageTracer from 'imagetracerjs';
import PNG from 'png-js';

const options = {
  colorsampling: 0,
  viewbox: true,
  qtres: 0.01,
  linefilter: false,
  strokewidth: 1.5,
  pal: [
    { r: 0, g: 0, b: 0, a: 255 },
    { r: 0, g: 0, b: 255, a: 255 },
    { r: 255, g: 255, b: 0, a: 255 },
  ],
};

function trace({ id, templateImage }) {
  console.log(id, templateImage);

  const path = `./assets/templates/${templateImage}`;
  const out = `./assets/traces/${id}.svg`;

  if (templateImage && fs.existsSync(path)) {
    const png = new PNG(path);

    if (png) {
      console.log(png);
      myimage.decode(function (pixels) {
        const imageData = { width: png.width, height: png.height, data: pixels };
        const svg = ImageTracer.imagedataToSVG(imageData, options);
        fs.writeFile(out, svg);
      });
    }
  }
}

fs.readFile('./index.json', 'utf8', (err, json) => {
  Object.values(JSON.parse(json)).forEach(trace);
});
