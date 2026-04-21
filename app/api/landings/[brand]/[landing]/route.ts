import fs from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{
  brand: string;
  landing: string;
}>;

export async function PUT(req: NextRequest, { params }: { params: Params }) {
  try {
    const { brand, landing } = await params;
    const body = await req.json();

    const filePath = path.join(
      process.cwd(),
      "data",
      "landings",
      brand,
      `${landing}.json`
    );

    fs.writeFileSync(filePath, JSON.stringify(body, null, 2), "utf8");

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "No se pudo guardar la landing" },
      { status: 500 }
    );
  }
}