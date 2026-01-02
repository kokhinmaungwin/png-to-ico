const input = document.getElementById("imgInput");
const genBtn = document.getElementById("genBtn");
const downloadBtn = document.getElementById("downloadBtn");
const preview = document.getElementById("preview");
const sizeText = document.getElementById("sizeText");
const canvas = document.getElementById("canvas");

let imgBlobURL = null;

genBtn.onclick = () => {
  if (!input.files[0]) {
    alert("Choose an image first");
    return;
  }

  const file = input.files[0];
  const reader = new FileReader();

  reader.onload = function(e){
    const img = new Image();
    img.onload = function(){

      const size = 64; // favicon standard 16/32/48/64
      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0,0,size,size);
      ctx.drawImage(img, 0, 0, size, size);

      // show preview
      const url = canvas.toDataURL("image/png");
      preview.innerHTML = `<img src="${url}">`;

      sizeText.textContent = "Generated Size: " + size + " x " + size;

      imgBlobURL = url;

      downloadBtn.style.display = "inline-block";
    };
    img.src = e.target.result;
  };
reader.readAsDataURL(file);
};

downloadBtn.onclick = () => {
  const a = document.createElement("a");
  a.href = imgBlobURL;
  a.download = "favicon.png"; // safe
  a.click();
};
