import fs from "node:fs";
import { generateHTML } from "../lib/exportHtml.tsx";
import data from "../data/landings/landing-uam-admin.json";

const html = generateHTML();

const slug = data.title
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");

const filename = `output-${data.brand}-${slug}.html`;

fs.writeFileSync(filename, html, "utf8");

console.log(`Landing exportada en ${filename} 🚀`);