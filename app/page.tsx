import BrandCard from "@/components/dashboard/BrandCard";
import { getBrands, getLandingsByBrand } from "@/lib/data";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function HomePage() {
  const brands = getBrands();

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
              Bunji
            </p>
            <h1 className="mt-2 text-4xl font-bold text-gray-900">
              Landing Engine
            </h1>
            <p className="mt-3 max-w-2xl text-gray-600">
              Administra tus marcas y organiza todas las landings desde un solo lugar.
            </p>
          </div>

          <Link
            href="/brands/new"
            className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            Nueva marca
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {brands.map((brand) => {
            const landings = getLandingsByBrand(brand.slug);

            return (
              <BrandCard
                key={brand.slug}
                brand={brand}
                landingCount={landings.length}
              />
            );
          })}
        </div>
      </div>
    </main>
  );
}
