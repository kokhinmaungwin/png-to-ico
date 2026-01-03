# PNG to ICO Converter

Simple Node.js tool to convert PNG images into multi-size ICO files.

---

## Features

- Resize PNG images to multiple standard favicon sizes (16x16, 32x32, 48x48, 256x256, etc.)
- Generate ICO files usable as website favicons
- Easy to use CLI script

---

## Installation

```bash
git clone https://github.com/kokhinmaungwin/png-to-ico.git
```

```bash
cd png-to-ico
```

```bash
npm install
```

---

## Usage

- Edit `convert.js` to specify your PNG source file, then run:

```bash
node convert.js
```
- It will generate `favicon.ico` in the project root.

---

## Project Structure

png-to-ico/
├── png/            # PNG source images
├── convert.js      # Main converter script
├── package.json
├── README.md
├── favicon.ico     # Output ICO file (generated)
└── node_modules/

---

## Notes

-`node_modules/` and temporary PNG files are ignored by `.gitignore`.
Requires `Node.js` and npm installed.

---

## License

MIT License

---
