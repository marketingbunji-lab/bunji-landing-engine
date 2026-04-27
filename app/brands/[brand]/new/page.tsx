import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import NewLandingForm from "../../../../components/editor/NewLandingForm";
import { getBrandBySlug } from "../../../../lib/data";

type Props = {
  params: Promise<{
    brand: string;
  }>;
};

export default async function NewLandingPage({ params }: Props) {
  const { brand: brandSlug } = await params;

  const brand = getBrandBySlug(brandSlug);

  if (!brand) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">{brand.name}</p>
            <h1 className="text-2xl font-bold text-gray-900">
              Crear nueva landing
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/brands/${brandSlug}/new/ai`}
              className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white"
            >
              <Sparkles className="h-4 w-4" />
              Crear con AI
            </Link>

            <Link
              href={`/brands/${brandSlug}`}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>
          </div>
        </div>

        <NewLandingForm brandSlug={brandSlug} brandName={brand.name} />
      </div>
    </main>
  );
}
