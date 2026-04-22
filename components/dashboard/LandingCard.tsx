"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Landing } from "@/lib/data";
import ExportHtmlButton from "@/components/export/ExportHtmlButton";

type Props = {
  landing: Landing;
};

function getModalityBadge(modality?: string) {
  const normalized = modality?.toLowerCase() ?? "";

  if (normalized.includes("presencial")) {
    return {
      label: "Presencial",
      className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    };
  }

  if (normalized.includes("virtual")) {
    return {
      label: "Virtual",
      className: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
    };
  }

  return null;
}

export default function LandingCard({ landing }: Props) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [duplicating, setDuplicating] = useState(false);
  const [error, setError] = useState("");
  const modalityBadge = getModalityBadge(landing.hero?.modality);

  const duplicateLanding = async () => {
    try {
      setDuplicating(true);
      setError("");

      const response = await fetch(
        `/api/landings/${landing.brand}/${landing.slug}/duplicate`,
        { method: "POST" }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo duplicar la landing");
      }

      router.push(data.redirectTo);
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "No se pudo duplicar");
    } finally {
      setDuplicating(false);
    }
  };

  const deleteLanding = async () => {
    try {
      setDeleting(true);
      setError("");

      const response = await fetch(`/api/landings/${landing.brand}/${landing.slug}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo eliminar la landing");
      }

      setShowDeleteModal(false);
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "No se pudo eliminar");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="relative rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{landing.title}</h3>
          <p className="text-sm text-gray-500">{landing.fullTitle}</p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          {modalityBadge ? (
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${modalityBadge.className}`}
            >
              {modalityBadge.label}
            </span>
          ) : null}

          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
            {landing.status}
          </span>
        </div>
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

        <ExportHtmlButton
          endpoint={`/api/export/${landing.brand}/${landing.slug}`}
          filename={`${landing.brand}-${landing.slug}.html`}
          clientifyEndpoint={`/api/export-clientify/${landing.brand}/${landing.slug}`}
          clientifyFilename={`${landing.brand}-${landing.slug}-clientify.html`}
        >
          Exportar
        </ExportHtmlButton>

        <button
          type="button"
          onClick={duplicateLanding}
          disabled={duplicating || deleting}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {duplicating ? "Duplicando..." : "Duplicar"}
        </button>

        <button
          type="button"
          onClick={() => {
            setError("");
            setShowDeleteModal(true);
          }}
          disabled={duplicating || deleting}
          className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Eliminar
        </button>
      </div>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      {showDeleteModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`delete-${landing.slug}-title`}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2
              id={`delete-${landing.slug}-title`}
              className="text-lg font-semibold text-gray-900"
            >
              Eliminar landing
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Vas a eliminar <strong>{landing.fullTitle}</strong>. Esta acción no se
              puede deshacer.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={deleteLanding}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {deleting ? "Eliminando..." : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
