const express = require('express');
const multer = require('multer');
const pngToIco = require('png-to-ico');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const icoBuffer = await pngToIco(req.file.path);
    fs.unlinkSync(req.file.path); // PNG ဖိုင်ဖျက်
    res.set({
      'Content-Type': 'image/x-icon',
      'Content-Disposition': 'attachment; filename="favicon.ico"',
    });
    res.send(icoBuffer);
  } catch (error) {
    res.status(500).send('Conversion failed');
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
