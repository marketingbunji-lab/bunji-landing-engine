import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BrandEditor from "../../../components/editor/BrandEditor";

const emptyBrand = {
  slug: "",
  name: "",
  logo: "",
  logos: {
    light: "",
    dark: "",
  },
  primaryColor: "#111827",
  secondaryColor: "#F8D74A",
  description: "",
  legalLinks: [],
};

export default function NewBrandPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8 dark:bg-[#020617]">
      <div className="w-full">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-slate-400">Bunji</p>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-50">Crear nueva marca</h1>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm dark:border-slate-700 dark:text-slate-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
        </div>

        <BrandEditor mode="create" initialBrand={emptyBrand} />
      </div>
    </main>
  );
}
