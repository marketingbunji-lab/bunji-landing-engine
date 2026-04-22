import fs from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{
  brand: string;
}>;

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(req: NextRequest, { params }: { params: Params }) {
  try {
    const { brand } = await params;
    const body = await req.json();

    const title = (body.title || "").trim();
    const fullTitle = (body.fullTitle || "").trim();
    const template = (body.template || "UamProgramLanding").trim();

    if (!title || !fullTitle) {
      return NextResponse.json(
        { ok: false, error: "Título y título completo son obligatorios" },
        { status: 400 }
      );
    }

    const slug = slugify(title);

    const brandFolder = path.join(
      process.cwd(),
      "data",
      "landings",
      brand
    );

    if (!fs.existsSync(brandFolder)) {
      fs.mkdirSync(brandFolder, { recursive: true });
    }

    const filePath = path.join(brandFolder, `${slug}.json`);

    if (fs.existsSync(filePath)) {
      return NextResponse.json(
        { ok: false, error: "Ya existe una landing con ese slug" },
        { status: 409 }
      );
    }

    const landingData = {
      slug,
      brand,
      template,
      status: "draft",
      updatedAt: new Date().toISOString().slice(0, 10),
      logoMode: "dark",
      title,
      fullTitle,
      hero: {
        eyebrow: `Estudia en ${brand.toUpperCase()}`,
        highlight: "",
        title: fullTitle,
        description: "",
        supportText: "",
        modality: "",
        semesterPrice: "",
        backgroundImage: "",
        personImage: ""
      },
      programInfo: [],
      whyStudy: {
        title: "",
        description: "",
        image: "",
        items: []
      },
      supportSection: {
        title: "",
        videoUrl: "",
        items: []
      },
      benefits: {
        title: "",
        items: []
      },
      cta: {
        title: "",
        button: "¡Inscríbete ahora!"
      },
      form: {
        scriptUrl: "",
        scriptCode: "",
        programName: fullTitle
      },
      footerScripts: []
    };

    fs.writeFileSync(filePath, JSON.stringify(landingData, null, 2), "utf8");

    return NextResponse.json({
      ok: true,
      slug,
      redirectTo: `/brands/${brand}/${slug}`
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "No se pudo crear la landing" },
      { status: 500 }
    );
  }
}
