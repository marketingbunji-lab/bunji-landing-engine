"use client";

import { useState } from "react";

type FilePickerHandle = {
  createWritable: () => Promise<{
    write: (data: Blob) => Promise<void>;
    close: () => Promise<void>;
  }>;
};

type WindowWithSavePicker = Window & {
  showSaveFilePicker?: (options?: {
    suggestedName?: string;
    types?: Array<{
      description: string;
      accept: Record<string, string[]>;
    }>;
  }) => Promise<FilePickerHandle>;
};

type Props = {
  endpoint: string;
  filename: string;
  children?: React.ReactNode;
  className?: string;
};

export default function ExportHtmlButton({
  endpoint,
  filename,
  children = "Exportar HTML",
  className = "rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700",
}: Props) {
  const [exporting, setExporting] = useState(false);

  const fallbackDownload = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    try {
      setExporting(true);

      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error("No se pudo exportar el HTML");
      }

      const blob = await response.blob();
      const picker = (window as WindowWithSavePicker).showSaveFilePicker;

      if (picker) {
        try {
          const handle = await picker({
            suggestedName: filename,
            types: [
              {
                description: "HTML",
                accept: {
                  "text/html": [".html"],
                },
              },
            ],
          });
          const writable = await handle.createWritable();

          await writable.write(blob);
          await writable.close();
          return;
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") {
            return;
          }

          throw error;
        }
      }

      fallbackDownload(blob);
    } catch (error) {
      console.error(error);
      window.alert("No se pudo exportar el HTML.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={exporting}
      className={`${className} disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {exporting ? "Exportando..." : children}
    </button>
  );
}
