const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');   // .default မလိုပါ
const pngToIco = require('png-to-ico');

async function convert() {
  try {
    const src = path.join(__dirname, 'icon-48.png');  
    const img = await Jimp.read(src);

    const resized = await img.resize(256, 256).getBufferAsync(Jimp.MIME_PNG);

    const icoBuffer = await pngToIco(resized);

    fs.writeFileSync('favicon.ico', icoBuffer);
    console.log('favicon.ico created!');
  } catch (err) {
    console.error(err);
  }
}

convert();
