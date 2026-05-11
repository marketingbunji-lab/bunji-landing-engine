import fs from "node:fs";
import path from "node:path";

export type LandingTemplateOption = {
  value: string;
  label: string;
};

const templatesDir = path.join(process.cwd(), "components", "templates");
const excludedTemplates = new Set(["renderLandingTemplate"]);

export function getLandingTemplateOptions(): LandingTemplateOption[] {
  const files = fs.readdirSync(templatesDir);

  return files
    .filter((file) => file.endsWith(".tsx"))
    .map((file) => path.basename(file, ".tsx"))
    .filter((template) => !excludedTemplates.has(template))
    .sort((a, b) => a.localeCompare(b))
    .map((template) => ({
      value: template,
      label: template,
    }));
}
