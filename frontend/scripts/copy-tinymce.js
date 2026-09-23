// Copia los assets de TinyMCE (self-hosted, sin API key de tinymce cloud)
// a /public/tinymce para que se sirvan como estaticos de Next.js.
// Se corre antes de `dev` y `build` (ver package.json) en vez de via
// postinstall porque el Dockerfile hace `npm ci` antes de copiar el
// codigo fuente del proyecto.
const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "..", "node_modules", "tinymce");
const dest = path.join(__dirname, "..", "public", "tinymce");

if (!fs.existsSync(src)) {
  console.error("No se encontro node_modules/tinymce, corre npm install primero.");
  process.exit(1);
}

fs.rmSync(dest, { recursive: true, force: true });
fs.cpSync(src, dest, { recursive: true });

console.log("TinyMCE copiado a public/tinymce");
