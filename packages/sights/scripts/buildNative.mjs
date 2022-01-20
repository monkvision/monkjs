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

          newItems[key] = { ...newItems[key], overlay: data.replace(/^\s+|\s+$/gm,'') }

          fs.mkdir('./dist/native', { recursive: true }, (err) => {
            if (err) return console.log(err);

            fs.writeFile('./dist/native/index.json', JSON.stringify(newItems, null, 2), (err) => {
              if (err) return console.log(err);
            });
          });
        })
      }
    });
  })
}

start();
