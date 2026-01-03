const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');
const pngToIcoModule = require('png-to-ico');

async function convert() {
  try {
    const src = path.join(__dirname, 'png', 'icon-48.png');

    // read PNG
    const img = await Jimp.read(src);

    // resize to 256
    const resized = await img.resize(256, 256).getBufferAsync(Jimp.MIME_PNG);

    // support both CJS / ESM exports
    const pngToIco = pngToIcoModule.default || pngToIcoModule;

    // IMPORTANT: png-to-ico requires ARRAY of images
    const icoBuffer = await pngToIco([resized]);

    fs.writeFileSync('favicon.ico', icoBuffer);
    console.log('favicon.ico created!');
  } catch (err) {
    console.error(err);
  }
}

convert();
