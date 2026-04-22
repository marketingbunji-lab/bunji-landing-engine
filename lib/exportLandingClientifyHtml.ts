import type { Brand, Landing } from "./data";
import { exportLandingHtml } from "./exportLandingHtml";

const bootstrapCssUrl =
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css";

function collectStyleTags(html: string) {
  return html.match(/<style\b[^>]*>[\s\S]*?<\/style>/gi) ?? [];
}

function removeStyleTags(html: string) {
  return html.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
}

function getBodyContent(html: string) {
  const bodyMatch = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  return bodyMatch?.[1] ?? html;
}

export function exportLandingClientifyHtml(brand: Brand, landing: Landing) {
  const html = exportLandingHtml(brand, landing);
  const styleTags = collectStyleTags(html);
  const bodyContent = removeStyleTags(getBodyContent(html)).trim();

  return [
    `<style>
@import url("${bootstrapCssUrl}");
</style>`,
    ...styleTags,
    `<body>
${bodyContent}
</body>`,
  ].join("\n\n");
}
