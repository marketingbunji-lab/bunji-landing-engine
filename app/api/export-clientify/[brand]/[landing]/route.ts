import { NextResponse } from "next/server";
import { getBrandBySlug, getLandingBySlug } from "../../../../../lib/data";
import { exportLandingClientifyHtml } from "../../../../../lib/exportLandingClientifyHtml";

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

    const html = exportLandingClientifyHtml(brand, landing);
    const filename = `${brandSlug}-${landingSlug}-clientify.html`;

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("CLIENTIFY EXPORT ERROR:", error);
    return new NextResponse("Error al exportar HTML para Clientify", {
      status: 500,
    });
  }
}
