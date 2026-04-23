/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowRight, FolderOpen, Pencil } from "lucide-react";
import { getBrandLogo } from "@/lib/brandLogo";
import type { Brand } from "@/lib/data";

type Props = {
  brand: Brand;
  landingCount: number;
};

export default function BrandCard({ brand, landingCount }: Props) {
  const logo = getBrandLogo(brand, "light");

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <Link href={`/brands/${brand.slug}`} className="block">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="min-w-0">
            <img
              src={logo}
              alt={brand.name}
              className="h-14 max-w-full object-contain object-left"
            />
          </div>

          <div className="max-w-28 shrink-0">
            <h2 className="text-xl font-semibold">{brand.name}</h2>
            <p className="break-words text-sm leading-5 text-gray-500">
              {brand.description}
            </p>
          </div>
        </div>
      </Link>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-gray-600">
          {landingCount} landing{landingCount === 1 ? "" : "s"}
        </span>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/brands/${brand.slug}/edit`}
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700"
          >
            <Pencil className="h-4 w-4" />
            Editar
          </Link>

          <Link
            href={`/brands/${brand.slug}`}
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium"
            style={{
              backgroundColor: brand.secondaryColor,
              color: "#111827",
            }}
          >
            <FolderOpen className="h-4 w-4" />
            Ver marca
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
