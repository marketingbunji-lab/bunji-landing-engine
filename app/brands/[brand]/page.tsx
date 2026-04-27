/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil, Plus } from "lucide-react";
import BrandLandingsList from "../../../components/dashboard/BrandLandingsList";
import type { LandingCardData } from "../../../components/dashboard/LandingCard";
import { getBrandLogo } from "../../../lib/brandLogo";
import { getBrandBySlug, getLandingsByBrand } from "../../../lib/data";
import type { Landing } from "../../../lib/data";

type Props = {
  params: Promise<{
    brand: string;
  }>;
};

function toLandingCardData(
  landing: Landing,
): LandingCardData & { programType: string } {
  return {
    slug: landing.slug,
    brand: landing.brand,
    title: landing.title,
    fullTitle: landing.fullTitle,
    template: landing.template,
    status: landing.status,
    updatedAt: landing.updatedAt,
    schedule: landing.schedule,
    programType: landing.programType?.trim() || "Sin tipo",
    hero: {
      modality: landing.hero?.modality,
    },
  };
}

export default async function BrandPage({ params }: Props) {
  const { brand: brandSlug } = await params;

  const brand = getBrandBySlug(brandSlug);

  if (!brand) {
    notFound();
  }

  const landings = getLandingsByBrand(brandSlug);
  const headerLogo = getBrandLogo(brand, "light");
  const landingItems = landings.map(toLandingCardData);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a marcas
        </Link>

        <div
          className="mb-8 rounded-3xl p-8 text-white"
          style={{ backgroundColor: brand.primaryColor }}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <img
                src={headerLogo}
                alt={brand.name}
                className="h-16 w-auto rounded bg-white p-2 object-contain"
              />
              <div>
                <h1 className="text-3xl font-bold">{brand.name}</h1>
                <p className="text-white/80">{brand.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/brands/${brandSlug}/edit`}
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 font-semibold text-white"
              >
                <Pencil className="h-4 w-4" />
                Editar marca
              </Link>

              <Link
                href={`/brands/${brandSlug}/new`}
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold text-black"
                style={{ backgroundColor: brand.secondaryColor }}
              >
                <Plus className="h-4 w-4" />
                Nueva landing
              </Link>
            </div>
          </div>
        </div>

        {landings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
            No hay landings creadas para esta marca.
          </div>
        ) : (
          <BrandLandingsList landings={landingItems} />
        )}
      </div>
    </main>
  );
}
