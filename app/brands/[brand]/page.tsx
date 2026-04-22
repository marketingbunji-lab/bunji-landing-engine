/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import LandingCard from "../../../components/dashboard/LandingCard";
import { getBrandLogo } from "../../../lib/brandLogo";
import { getBrandBySlug, getLandingsByBrand } from "../../../lib/data";

type Props = {
  params: Promise<{
    brand: string;
  }>;
};

export default async function BrandPage({ params }: Props) {
  const { brand: brandSlug } = await params;

  const brand = getBrandBySlug(brandSlug);

  if (!brand) {
    notFound();
  }

  const landings = getLandingsByBrand(brandSlug);
  const headerLogo = getBrandLogo(brand, "light");

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/"
          className="mb-6 inline-block text-sm font-medium text-gray-600 hover:text-black"
        >
          ← Volver a marcas
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

            <Link
              href={`/brands/${brandSlug}/new`}
              className="rounded-xl px-5 py-3 font-semibold text-black"
              style={{ backgroundColor: brand.secondaryColor }}
            >
              + Nueva landing
            </Link>
          </div>
        </div>

        {landings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
            No hay landings creadas para esta marca.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {landings.map((landing) => (
              <LandingCard key={landing.slug} landing={landing} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
