import fs from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import type { Brand } from "../../../lib/data";

const brandsDir = path.join(process.cwd(), "data", "brands");

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Brand;
    const name = (body.name || "").trim();
    const requestedSlug = (body.slug || "").trim();
    const slug = slugify(requestedSlug || name);

    if (!name || !slug) {
      return NextResponse.json(
        { ok: false, error: "Nombre y slug son obligatorios" },
        { status: 400 }
      );
    }

    const filePath = path.join(brandsDir, `${slug}.json`);

    if (fs.existsSync(filePath)) {
      return NextResponse.json(
        { ok: false, error: "Ya existe una marca con ese slug" },
        { status: 409 }
      );
    }

    const brandData: Brand = {
      slug,
      name,
      logo: body.logo || "",
      logos: {
        light: body.logos?.light || "",
        dark: body.logos?.dark || "",
      },
      typography: {
        fontFamily: body.typography?.fontFamily || "",
        googleFontHref: body.typography?.googleFontHref || "",
      },
      primaryColor: body.primaryColor || "#111827",
      secondaryColor: body.secondaryColor || "#F8D74A",
      description: body.description || "",
      legalLinks: body.legalLinks || [],
    };

    fs.writeFileSync(filePath, JSON.stringify(brandData, null, 2), "utf8");

    return NextResponse.json({
      ok: true,
      slug,
      redirectTo: `/brands/${slug}/edit`,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "No se pudo crear la marca" },
      { status: 500 }
    );
  }
}
