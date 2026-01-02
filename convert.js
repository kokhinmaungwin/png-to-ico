const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');
const pngToIco = require('png-to-ico');

async function convert() {
  try {
    const src = path.join(__dirname, 'icon-48.png');  // root folder path now
    const img = await Jimp.read(src);

    const sizes = [16, 32, 48, 64, 128, 256];

    const buffers = await Promise.all(
      sizes.map(size => img.clone().resize(size, size).getBufferAsync(Jimp.MIME_PNG))
    );

    const icoBuffer = await pngToIco(buffers);

    fs.writeFileSync('favicon.ico', icoBuffer);
    console.log('favicon.ico created with multiple sizes!');
  } catch (err) {
    console.error('Error:', err);
  }
}

convert();
