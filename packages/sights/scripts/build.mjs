import fs from 'fs';

function start() {

  fs.readFile('./index.json', 'utf8' , (err, items) => {
    if (err) return console.log(err);

    const newItems = { ...JSON.parse(items) };


    Object.keys(newItems).forEach((key) => {
      const path = `./assets/overlays/${key}.svg`;

      if (fs.existsSync(path)) {
        fs.readFile(path, 'utf8' , (err, data) => {
          if (err) return console.log(err);

          const item = newItems[key];

          newItems[key] = {
            id: item.id,
            label: item.label,
            category: item.category,
            vehicleType: item.vehicleType,
            overlay: data.replace(/^\s+|\s+$/gm,'')
          }

          fs.mkdir('./dist', { recursive: true }, (err) => {
            if (err) return console.log(err);

            fs.writeFile('./dist/index.json', JSON.stringify(newItems, null, 2), (err) => {
              if (err) return console.log(err);
            });
          });
        })
      }
    });
  })
}

start();
