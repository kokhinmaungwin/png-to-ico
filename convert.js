const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');
const pngToIcoModule = require('png-to-ico');

async function convert() {
  try {
    const src = path.join(__dirname, 'icon-48.png');
    const img = await Jimp.read(src);

    const resized = await img.resize(256, 256).getBufferAsync(Jimp.MIME_PNG);

    // Use .default for ES module compatibility
    const icoBuffer = await pngToIcoModule.default(resized);

    fs.writeFileSync('favicon.ico', icoBuffer);
    console.log('favicon.ico created!');
  } catch (err) {
    console.error(err);
  }
}

convert();
