import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrandBySlug, getLandingBySlug } from "../../../../lib/data";
import LandingEditor from "../../../../components/editor/LandingEditor";
import ExportHtmlButton from "../../../../components/export/ExportHtmlButton";

type Props = {
  params: Promise<{
    brand: string;
    landing: string;
  }>;
};

export default async function LandingDetailPage({ params }: Props) {
  const { brand: brandSlug, landing: landingSlug } = await params;

  const brand = getBrandBySlug(brandSlug);
  const landing = getLandingBySlug(brandSlug, landingSlug);

  if (!brand || !landing) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-auto">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">{brand.name}</p>
            <h1 className="text-2xl font-bold text-gray-900">
              {landing.fullTitle}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/brands/${brandSlug}`}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
            >
              ← Volver
            </Link>

            <ExportHtmlButton
              endpoint={`/api/export/${brandSlug}/${landingSlug}`}
              filename={`${brandSlug}-${landingSlug}.html`}
              className="rounded-lg bg-black px-4 py-2 text-sm text-white"
            >
              Exportar HTML
            </ExportHtmlButton>
          </div>
        </div>

        <LandingEditor brand={brand} initialLanding={landing} />
      </div>
    </main>
  );
}
