const express = require('express');
const multer = require('multer');
const pngToIco = require('png-to-ico');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// POST /upload to convert PNG to ICO
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const icoBuffer = await pngToIco(req.file.path);
    fs.unlinkSync(req.file.path);
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
