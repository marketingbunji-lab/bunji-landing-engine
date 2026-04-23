import fs from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import type { Brand } from "../../../../lib/data";

type Params = Promise<{
  brand: string;
}>;

export async function PUT(req: NextRequest, { params }: { params: Params }) {
  try {
    const { brand } = await params;
    const body = (await req.json()) as Brand;

    const filePath = path.join(
      process.cwd(),
      "data",
      "brands",
      `${brand}.json`
    );

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { ok: false, error: "Marca no encontrada" },
        { status: 404 }
      );
    }

    const brandData: Brand = {
      slug: brand,
      name: body.name || "",
      logo: body.logo || "",
      logos: {
        light: body.logos?.light || "",
        dark: body.logos?.dark || "",
      },
      primaryColor: body.primaryColor || "#111827",
      secondaryColor: body.secondaryColor || "#F8D74A",
      description: body.description || "",
      legalLinks: body.legalLinks || [],
    };

    fs.writeFileSync(filePath, JSON.stringify(brandData, null, 2), "utf8");

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "No se pudo guardar la marca" },
      { status: 500 }
    );
  }
}
