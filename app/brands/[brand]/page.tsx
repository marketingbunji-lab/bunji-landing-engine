/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil, Plus } from "lucide-react";
import LandingCard from "../../../components/dashboard/LandingCard";
import type { LandingCardData } from "../../../components/dashboard/LandingCard";
import { getBrandLogo } from "../../../lib/brandLogo";
import { getBrandBySlug, getLandingsByBrand } from "../../../lib/data";
import type { Landing } from "../../../lib/data";

type Props = {
  params: Promise<{
    brand: string;
  }>;
};

function groupLandingsByProgramType(landings: Landing[]) {
  const groups = new Map<string, Landing[]>();

  for (const landing of landings) {
    const programType = landing.programType?.trim() || "Sin tipo";
    const group = groups.get(programType) ?? [];

    group.push(landing);
    groups.set(programType, group);
  }

  return Array.from(groups.entries()).map(([programType, items]) => ({
    programType,
    items,
  }));
}

function toLandingCardData(landing: Landing): LandingCardData {
  return {
    slug: landing.slug,
    brand: landing.brand,
    title: landing.title,
    fullTitle: landing.fullTitle,
    template: landing.template,
    status: landing.status,
    updatedAt: landing.updatedAt,
    schedule: landing.schedule,
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
  const groupedLandings = groupLandingsByProgramType(landings);

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
          <div className="space-y-10">
            {groupedLandings.map((group) => (
              <section key={group.programType}>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {group.programType}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {group.items.length} landing
                      {group.items.length === 1 ? "" : "s"}
                    </p>
                  </div>

                  <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm">
                    {group.items.length}
                  </span>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {group.items.map((landing) => (
                    <LandingCard
                      key={landing.slug}
                      landing={toLandingCardData(landing)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
