const Jimp = require("jimp");
const pngToIco = require("png-to-ico");
const fs = require("fs");

(async () => {

  const src = "./icons/icon-48.png";   // ← HERE (folder path included)
  const sizes = [16, 32, 48, 64, 128, 256];

  const resized = [];

  for (const size of sizes) {
    const img = await Jimp.read(src);
    const out = `tmp-${size}.png`;

    await img
      .clone()
      .resize(size, size)
      .writeAsync(out);

    resized.push(out);
  }

  const ico = await pngToIco(resized);

  fs.writeFileSync("favicon.ico", ico);

  console.log("✔ favicon.ico created successfully 🎉");

})();
