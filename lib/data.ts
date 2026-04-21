import fs from "node:fs";
import path from "node:path";

export type Brand = {
  slug: string;
  name: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  description?: string;
  legalLinks?: LegalLink[];
};

export type LegalLink = {
  label: string;
  url: string;
};

export type AccordionItem = {
  title: string;
  content: string;
};

export type IconTextItem = {
  title: string;
  text: string;
  icon?: string;
};

export type LandingHero = {
  eyebrow?: string;
  highlight?: string;
  title?: string;
  description?: string;
  supportText?: string;
  modality?: string;
  semesterPrice?: string;
  backgroundImage?: string;
  personImage?: string;
};

export type Landing = {
  slug: string;
  brand: string;
  title: string;
  fullTitle: string;
  template: string;
  status: string;
  updatedAt: string;
  hero?: LandingHero;
  programInfo?: string[];
  whyStudy?: {
    title?: string;
    description?: string;
    image?: string;
    items?: AccordionItem[];
  };
  supportSection?: {
    title?: string;
    videoUrl?: string;
    items?: IconTextItem[];
  };
  benefits?: {
    title?: string;
    items?: IconTextItem[];
  };
  cta?: {
    title?: string;
    button?: string;
  };
  form?: {
    type?: string;
    scriptUrl?: string;
    programName?: string;
  };
};

const brandsDir = path.join(process.cwd(), "data", "brands");
const landingsDir = path.join(process.cwd(), "data", "landings");

export function getBrands(): Brand[] {
  const files = fs.readdirSync(brandsDir);

  return files.map((file) => {
    const filePath = path.join(brandsDir, file);
    const content = fs.readFileSync(filePath, "utf8");
    return JSON.parse(content) as Brand;
  });
}

export function getBrandBySlug(slug: string): Brand | null {
  const filePath = path.join(brandsDir, `${slug}.json`);

  if (!fs.existsSync(filePath)) return null;

  const content = fs.readFileSync(filePath, "utf8");
  return JSON.parse(content) as Brand;
}

export function getLandingsByBrand(brandSlug: string): Landing[] {
  const brandFolder = path.join(landingsDir, brandSlug);

  if (!fs.existsSync(brandFolder)) return [];

  const files = fs.readdirSync(brandFolder);

  return files.map((file) => {
    const filePath = path.join(brandFolder, file);
    const content = fs.readFileSync(filePath, "utf8");
    return JSON.parse(content) as Landing;
  });
}

export function getLandingBySlug(
  brandSlug: string,
  landingSlug: string
): Landing | null {
  const filePath = path.join(
    landingsDir,
    brandSlug,
    `${landingSlug}.json`
  );

  if (!fs.existsSync(filePath)) return null;

  const content = fs.readFileSync(filePath, "utf8");
  return JSON.parse(content) as Landing;
}
