import { renderToStaticMarkup } from "react-dom/server";
import LandingBasic from "../components/templates/LandingBasic";

import brand from "../data/brands/uam.json";
import data from "../data/landings/landing-uam-admin.json";

export function generateHTML() {
  const html = renderToStaticMarkup(
    <LandingBasic brand={brand} data={data} />
  );

  return `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${data.title}</title>
  </head>
  <body>
    ${html}
  </body>
</html>`;
}