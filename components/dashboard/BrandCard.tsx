import Link from "next/link";
import { Brand } from "@/lib/data";

type Props = {
  brand: Brand;
  landingCount: number;
};

export default function BrandCard({ brand, landingCount }: Props) {
  return (
    <Link
      href={`/brands/${brand.slug}`}
      className="block rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
    >
      <div className="flex items-center gap-4">
        <img
          src={brand.logo}
          alt={brand.name}
          className="h-14 w-auto object-contain"
        />

        <div>
          <h2 className="text-xl font-semibold">{brand.name}</h2>
          <p className="text-sm text-gray-500">{brand.description}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-sm text-gray-600">
          {landingCount} landing{landingCount === 1 ? "" : "s"}
        </span>

        <span
          className="rounded-full px-3 py-1 text-sm font-medium"
          style={{
            backgroundColor: brand.secondaryColor,
            color: "#111827",
          }}
        >
          Ver marca
        </span>
      </div>
    </Link>
  );
}