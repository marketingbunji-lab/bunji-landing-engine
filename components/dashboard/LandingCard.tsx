import Link from "next/link";
import { Landing } from "@/lib/data";

type Props = {
  landing: Landing;
};

export default function LandingCard({ landing }: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{landing.title}</h3>
          <p className="text-sm text-gray-500">{landing.fullTitle}</p>
        </div>

        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
          {landing.status}
        </span>
      </div>

      <div className="mt-4 space-y-1 text-sm text-gray-600">
        <p>
          <strong>Template:</strong> {landing.template}
        </p>
        <p>
          <strong>Slug:</strong> {landing.slug}
        </p>
        <p>
          <strong>Actualizado:</strong> {landing.updatedAt}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href={`/brands/${landing.brand}/${landing.slug}`}
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
        >
          Ver detalle
        </Link>

        <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700">
          Exportar
        </button>
      </div>
    </div>
  );
}