‎    const fileInput = document.getElementById("fileInput");
‎    const sizeSelect = document.getElementById("sizeSelect");
‎    const generateBtn = document.getElementById("generateBtn");
‎    const preview = document.getElementById("preview");
‎    const downloadBtn = document.getElementById("downloadBtn");
‎
‎    generateBtn.onclick = async () => {
‎      if (!fileInput.files.length) {
‎        alert("Please select an image file.");
‎        return;
‎      }
‎
‎      const selectedSizes = Array.from(sizeSelect.selectedOptions).map(
‎        (opt) => parseInt(opt.value)
‎      );
‎
‎      if (selectedSizes.length === 0) {
‎        alert("Please select at least one size.");
‎        return;
‎      }
‎
‎      const file = fileInput.files[0];
‎      const imgUrl = URL.createObjectURL(file);
‎      const icoData = await generateICO(imgUrl, selectedSizes);
‎
‎      // Show previews
‎      preview.innerHTML = "";
‎      selectedSizes.forEach((size) => {
‎        const img = document.createElement("img");
‎        img.src = icoData.previews[size];
‎        img.width = size;
‎        img.height = size;
‎        preview.appendChild(img);
‎      });
‎
‎      downloadBtn.style.display = "inline-block";
‎
‎      downloadBtn.onclick = () => {
‎        const a = document.createElement("a");
‎        a.href = icoData.icoURL;
‎        a.download = "favicon.ico";
‎        a.click();
‎      };
‎    };
