const input = document.getElementById("fileInput");
const generateBtn = document.getElementById("generateBtn");
const preview = document.getElementById("preview");
const downloads = document.getElementById("downloads");

function canvasToPNG(canvas) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}

// Create ICO with single PNG inside (per size)
function createSingleICO(pngArrayBuffer) {
  const pngBytes = new Uint8Array(pngArrayBuffer);
  const iconCount = 1;
  const headerSize = 6 + 16 * iconCount;
  const imageOffset = headerSize;
  const totalSize = headerSize + pngBytes.length;

  const buffer = new ArrayBuffer(totalSize);
  const dv = new DataView(buffer);

  dv.setUint16(0, 0, true); // reserved
  dv.setUint16(2, 1, true); // type icon
  dv.setUint16(4, 1, true); // number of images

  // directory entry (we won't force width here)
  dv.setUint8(6, 0); // width auto
  dv.setUint8(7, 0); // height auto
  dv.setUint8(8, 0);
  dv.setUint8(9, 0);
  dv.setUint16(10, 1, true);
  dv.setUint16(12, 32, true);
  dv.setUint32(14, pngBytes.length, true);
  dv.setUint32(18, imageOffset, true);

  new Uint8Array(buffer, imageOffset).set(pngBytes);

  return new Blob([buffer], { type: "image/x-icon" });
}

generateBtn.onclick = async () => {
  if (!input.files.length) {
    alert("Choose an image first");
    return;
  }

  const file = input.files[0];
  const img = new Image();
  img.src = URL.createObjectURL(file);

  await img.decode();

  const sizes = [16, 32, 48, 64, 128, 256];

  preview.innerHTML = "";
  downloads.innerHTML = "";

  for (const size of sizes) {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");

    const ratio = Math.min(size / img.width, size / img.height);
    const w = img.width * ratio;
    const h = img.height * ratio;
    const x = (size - w) / 2;
    const y = (size - h) / 2;

    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(img, x, y, w, h);

    const prev = document.createElement("div");
    prev.style.display = "inline-block";
    prev.style.margin = "6px";
    prev.style.textAlign = "center";

    const im = document.createElement("img");
    im.src = canvas.toDataURL();
    im.style.border = "1px solid #ddd";
    im.style.borderRadius = "6px";
    im.width = size;
    im.height = size;

    const label = document.createElement("div");
    label.innerText = size + "x" + size;

    prev.appendChild(im);
    prev.appendChild(label);
    preview.appendChild(prev);

    const pngBlob = await canvasToPNG(canvas);
    const pngUrl = URL.createObjectURL(pngBlob);

    const pngBtn = document.createElement("button");
    pngBtn.innerText = `Download PNG ${size}x${size}`;
    pngBtn.onclick = () => {
      const a = document.createElement("a");
      a.href = pngUrl;
      a.download = `icon-${size}.png`;
      a.click();
    };

    const arrayBuffer = await pngBlob.arrayBuffer();
    const icoBlob = createSingleICO(arrayBuffer);
    const icoUrl = URL.createObjectURL(icoBlob);

    const icoBtn = document.createElement("button");
    icoBtn.innerText = `Download ICO ${size}x${size}`;
    icoBtn.onclick = () => {
      const a = document.createElement("a");
      a.href = icoUrl;
      a.download = `icon-${size}.ico`;
      a.click();
    };

    const line = document.createElement("div");
    line.style.margin = "4px 0";
    line.appendChild(pngBtn);
    line.appendChild(document.createTextNode(" "));
    line.appendChild(icoBtn);

    downloads.appendChild(line);
  }
};