// icoGenerator.js
async function createCanvasWithSize(img, size) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, size, size);

  const ratio = Math.min(size / img.width, size / img.height);
  const w = img.width * ratio;
  const h = img.height * ratio;
  const x = (size - w) / 2;
  const y = (size - h) / 2;

  ctx.drawImage(img, x, y, w, h);

  return canvas;
}

function createBMPFromCanvas(canvas, size) {
  const tctx = canvas.getContext("2d");
  const imgData = tctx.getImageData(0, 0, size, size);
  const pixels = imgData.data;
  const rowSize = Math.ceil((24 * size + 31) / 32) * 4;
  const imageSize = rowSize * size;
  const fileSize = 54 + imageSize;

  const buffer = new ArrayBuffer(fileSize);
  const dv = new DataView(buffer);

  dv.setUint16(0, 0x4d42, true); // BM
  dv.setUint32(2, fileSize, true);
  dv.setUint32(10, 54, true);
  dv.setUint32(14, 40, true);
  dv.setInt32(18, size, true);
  dv.setInt32(22, -size, true); // top-down bitmap
  dv.setUint16(26, 1, true);
  dv.setUint16(28, 24, true);
  dv.setUint32(34, imageSize, true);

  let offset = 54;
  let i = 0;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      dv.setUint8(offset++, pixels[i + 2]); // Blue
      dv.setUint8(offset++, pixels[i + 1]); // Green
      dv.setUint8(offset++, pixels[i]); // Red
      i += 4;
    }
    while ((offset - 54) % rowSize) dv.setUint8(offset++, 0);
  }

  return new Uint8Array(buffer);
}

async function generateICO(imageUrl, sizes) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const bmps = [];
      const previews = {};
      sizes.forEach((size) => {
        const canvas = createCanvasWithSize(img, size);
        previews[size] = canvas.toDataURL("image/png");
        const bmp = createBMPFromCanvas(canvas, size);
        bmps.push({ bmp, size });
      });

      const iconCount = bmps.length;
      const headerSize = 6 + 16 * iconCount;
      let imageOffset = headerSize;

      let totalSize = headerSize;
      bmps.forEach(({ bmp }) => (totalSize += bmp.length));

      const buffer = new ArrayBuffer(totalSize);
      const dv = new DataView(buffer);

      dv.setUint16(0, 0, true); // Reserved
      dv.setUint16(2, 1, true); // Type = ICO
      dv.setUint16(4, iconCount, true);

      let offset = 6;

      bmps.forEach(({ bmp, size }) => {
        dv.setUint8(offset++, size === 256 ? 0 : size); // width
        dv.setUint8(offset++, size === 256 ? 0 : size); // height
        dv.setUint8(offset++, 0); // color palette
        dv.setUint8(offset++, 0); // reserved
        dv.setUint16(offset, 1, true); // color planes
        offset += 2;
        dv.setUint16(offset, 24, true); // bits per pixel
        offset += 2;
        dv.setUint32(offset, bmp.length, true); // size of bitmap data
        offset += 4;
        dv.setUint32(offset, imageOffset, true); // offset of bitmap data
        offset += 4;

        new Uint8Array(buffer, imageOffset, bmp.length).set(bmp);
        imageOffset += bmp.length;
      });

      const blob = new Blob([buffer], { type: "image/x-icon" });
      const icoURL = URL.createObjectURL(blob);

      resolve({ icoURL, previews });
    };

    img.src = imageUrl;
  });
}
