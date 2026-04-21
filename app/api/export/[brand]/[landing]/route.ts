import { NextResponse } from "next/server";
import { getBrandBySlug, getLandingBySlug } from "../../../../../lib/data";
import { exportLandingHtml } from "../../../../../lib/exportLandingHtml";

type Params = Promise<{
  brand: string;
  landing: string;
}>;

export async function GET(_: Request, { params }: { params: Params }) {
  try {
    const { brand: brandSlug, landing: landingSlug } = await params;

    const brand = getBrandBySlug(brandSlug);
    const landing = getLandingBySlug(brandSlug, landingSlug);

    if (!brand || !landing) {
      return new NextResponse("Landing no encontrada", { status: 404 });
    }

    const html = await exportLandingHtml(brand, landing);
    const filename = `${brandSlug}-${landingSlug}.html`;

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("EXPORT ERROR:", error);
    return new NextResponse("Error al exportar HTML", { status: 500 });
  }
}
