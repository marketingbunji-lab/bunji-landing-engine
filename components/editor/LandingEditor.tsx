"use client";

import { useState } from "react";
import type { AccordionItem, Brand, IconTextItem, Landing } from "@/lib/data";
import UamProgramLanding from "../templates/UamProgramLanding";

type Props = {
  brand: Brand;
  initialLanding: Landing;
};

type EditableLanding = Landing & Record<string, unknown>;
type EditableRecord = Record<string, unknown>;
type EditableArrayItem = Record<string, string>;

function isRecord(value: unknown): value is EditableRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function getRecordAtPath(target: EditableRecord, keys: string[]) {
  let current = target;

  for (const key of keys) {
    if (!isRecord(current[key])) {
      current[key] = {};
    }

    current = current[key] as EditableRecord;
  }

  return current;
}

function getArrayAtPath(target: EditableRecord, path: string) {
  const keys = path.split(".");
  const arrayKey = keys.at(-1);

  if (!arrayKey) return [];

  const parent = getRecordAtPath(target, keys.slice(0, -1));

  if (!Array.isArray(parent[arrayKey])) {
    parent[arrayKey] = [];
  }

  return parent[arrayKey] as EditableArrayItem[];
}

export default function LandingEditor({ brand, initialLanding }: Props) {
  const [landing, setLanding] = useState<Landing>(initialLanding);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [previewWidth, setPreviewWidth] = useState(1200);
  const [previewHeight, setPreviewHeight] = useState(820);

  const updateField = (path: string, value: string) => {
    setLanding((prev) => {
      const next = structuredClone(prev) as EditableLanding;
      const keys = path.split(".");
      const fieldKey = keys.at(-1);

      if (!fieldKey) {
        return next;
      }

      const current = getRecordAtPath(next, keys.slice(0, -1));
      current[fieldKey] = value;
      return next;
    });
  };

  const updateArrayItem = (
    arrayPath: string,
    index: number,
    field: string,
    value: string
  ) => {
    setLanding((prev) => {
      const next = structuredClone(prev) as EditableLanding;
      const current = getArrayAtPath(next, arrayPath);

      if (!current[index]) current[index] = {};
      current[index][field] = value;

      return next;
    });
  };

  const addArrayItem = (arrayPath: string, newItem: EditableArrayItem) => {
    setLanding((prev) => {
      const next = structuredClone(prev) as EditableLanding;
      const current = getArrayAtPath(next, arrayPath);

      current.push(newItem);
      return next;
    });
  };

  const removeArrayItem = (arrayPath: string, index: number) => {
    setLanding((prev) => {
      const next = structuredClone(prev) as EditableLanding;
      const current = getArrayAtPath(next, arrayPath);

      current.splice(index, 1);
      return next;
    });
  };

  const saveLanding = async () => {
    try {
      setSaving(true);
      setMessage("");

      const res = await fetch(`/api/landings/${landing.brand}/${landing.slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(landing),
      });

      if (!res.ok) {
        throw new Error("No se pudo guardar la landing");
      }

      setMessage("Cambios guardados correctamente");
    } catch {
      setMessage("Ocurrió un error al guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Editar landing</h2>
          <p className="mt-1 text-sm text-gray-500">
            Edita solo los contenidos visibles en la landing.
          </p>
        </div>

        <div className="space-y-6">
          {(landing.hero || landing.title || landing.fullTitle) && (
            <EditorSection title="Hero">
              <Field
                label="Título corto"
                value={landing.title || ""}
                onChange={(value) => updateField("title", value)}
              />

              <Field
                label="Título completo"
                value={landing.fullTitle || ""}
                onChange={(value) => updateField("fullTitle", value)}
              />

              <Field
                label="Texto superior"
                value={landing.hero?.eyebrow || ""}
                onChange={(value) => updateField("hero.eyebrow", value)}
              />

              <Field
                label="Texto resaltado"
                value={landing.hero?.highlight || ""}
                onChange={(value) => updateField("hero.highlight", value)}
              />

              <Field
                label="Título principal"
                value={landing.hero?.title || ""}
                onChange={(value) => updateField("hero.title", value)}
              />

              <Field
                label="Descripción"
                value={landing.hero?.description || ""}
                onChange={(value) => updateField("hero.description", value)}
              />

              <Field
                label="Texto de apoyo"
                value={landing.hero?.supportText || ""}
                onChange={(value) => updateField("hero.supportText", value)}
              />

              <Field
                label="Modalidad"
                value={landing.hero?.modality || ""}
                onChange={(value) => updateField("hero.modality", value)}
              />

              <Field
                label="Valor semestre"
                value={landing.hero?.semesterPrice || ""}
                onChange={(value) => updateField("hero.semesterPrice", value)}
              />

              <Field
                label="URL imagen de fondo"
                value={landing.hero?.backgroundImage || ""}
                onChange={(value) => updateField("hero.backgroundImage", value)}
                />

                <Field
                label="URL imagen persona/modelo"
                value={landing.hero?.personImage || ""}
                onChange={(value) => updateField("hero.personImage", value)}
                />
            </EditorSection>
          )}

          {landing.whyStudy && (
            <EditorSection title="Sección: ¿Por qué estudiar?">
              <Field
                label="Título de sección"
                value={landing.whyStudy?.title || ""}
                onChange={(value) => updateField("whyStudy.title", value)}
              />

              <TextareaField
                label="Descripción"
                value={landing.whyStudy?.description || ""}
                onChange={(value) => updateField("whyStudy.description", value)}
              />

              <Field
                label="URL imagen de apoyo"
                value={landing.whyStudy?.image || ""}
                onChange={(value) => updateField("whyStudy.image", value)}
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-900">
                    Items de la sección
                  </h4>

                  <button
                    type="button"
                    onClick={() =>
                      addArrayItem("whyStudy.items", {
                        title: "Nuevo título",
                        content: "Nuevo contenido",
                      })
                    }
                    className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700"
                  >
                    + Agregar item
                  </button>
                </div>

                {(landing.whyStudy?.items || []).map((item: AccordionItem, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900">
                        Item {index + 1}
                      </p>

                      <button
                        type="button"
                        onClick={() => removeArrayItem("whyStudy.items", index)}
                        className="text-xs font-medium text-red-600"
                      >
                        Eliminar
                      </button>
                    </div>

                    <div className="space-y-3">
                      <Field
                        label="Título"
                        value={item?.title || ""}
                        onChange={(value) =>
                          updateArrayItem("whyStudy.items", index, "title", value)
                        }
                      />

                      <TextareaField
                        label="Contenido"
                        value={item?.content || ""}
                        onChange={(value) =>
                          updateArrayItem("whyStudy.items", index, "content", value)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </EditorSection>
          )}

          {landing.supportSection && (
  <EditorSection title="Sección: Apoyamos tu carrera">
    <Field
      label="Título de sección"
      value={landing.supportSection?.title || ""}
      onChange={(value) => updateField("supportSection.title", value)}
    />

    <Field
      label="URL del video"
      value={landing.supportSection?.videoUrl || ""}
      onChange={(value) => updateField("supportSection.videoUrl", value)}
    />

    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-900">
          Cards de apoyo
        </h4>

        <button
          type="button"
          onClick={() =>
            addArrayItem("supportSection.items", {
              title: "Nuevo título",
              text: "Nuevo contenido",
              icon: "",
            })
          }
          className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700"
        >
          + Agregar item
        </button>
      </div>

      {(landing.supportSection?.items || []).map((item: IconTextItem, index) => (
        <div
                    key={index}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                    >
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900">
                        Card {index + 1}
                        </p>

                        <button
                        type="button"
                        onClick={() => removeArrayItem("supportSection.items", index)}
                        className="text-xs font-medium text-red-600"
                        >
                        Eliminar
                        </button>
                    </div>

                    <div className="space-y-3">
                        <Field
                        label="Título"
                        value={item?.title || ""}
                        onChange={(value) =>
                            updateArrayItem("supportSection.items", index, "title", value)
                        }
                        />

                        <TextareaField
                        label="Contenido"
                        value={item?.text || ""}
                        onChange={(value) =>
                            updateArrayItem("supportSection.items", index, "text", value)
                        }
                        />

                        <Field
                        label="URL icono"
                        value={item?.icon || ""}
                        onChange={(value) =>
                            updateArrayItem("supportSection.items", index, "icon", value)
                        }
                        />
                    </div>
                    </div>
                ))}
                </div>
            </EditorSection>
            )}

          {landing.benefits && (
  <EditorSection title="Sección: Beneficios">
    <Field
      label="Título de sección"
      value={landing.benefits?.title || ""}
      onChange={(value) => updateField("benefits.title", value)}
    />

    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-900">
          Items de beneficios
        </h4>

        <button
          type="button"
          onClick={() =>
            addArrayItem("benefits.items", {
              title: "Nuevo beneficio",
              text: "Nuevo contenido",
              icon: "",
            })
          }
          className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700"
        >
          + Agregar item
        </button>
      </div>

      {(landing.benefits?.items || []).map((item: IconTextItem, index) => (
                    <div
                    key={index}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                    >
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900">
                        Beneficio {index + 1}
                        </p>

                        <button
                        type="button"
                        onClick={() => removeArrayItem("benefits.items", index)}
                        className="text-xs font-medium text-red-600"
                        >
                        Eliminar
                        </button>
                    </div>

                    <div className="space-y-3">
                        <Field
                        label="Título"
                        value={item?.title || ""}
                        onChange={(value) =>
                            updateArrayItem("benefits.items", index, "title", value)
                        }
                        />

                        <TextareaField
                        label="Contenido"
                        value={item?.text || ""}
                        onChange={(value) =>
                            updateArrayItem("benefits.items", index, "text", value)
                        }
                        />

                        <Field
                        label="URL icono"
                        value={item?.icon || ""}
                        onChange={(value) =>
                            updateArrayItem("benefits.items", index, "icon", value)
                        }
                        />
                    </div>
                    </div>
                ))}
                </div>
            </EditorSection>
            )}

          {landing.cta && (
            <EditorSection title="CTA final">
              <Field
                label="Título CTA"
                value={landing.cta?.title || ""}
                onChange={(value) => updateField("cta.title", value)}
              />

              <Field
                label="Texto del botón"
                value={landing.cta?.button || ""}
                onChange={(value) => updateField("cta.button", value)}
              />
            </EditorSection>
          )}

          {landing.form && (
            <EditorSection title="Formulario">
              <Field
                label="Script URL"
                value={landing.form?.scriptUrl || ""}
                onChange={(value) => updateField("form.scriptUrl", value)}
              />

              <Field
                label="Nombre del programa"
                value={landing.form?.programName || ""}
                onChange={(value) => updateField("form.programName", value)}
              />
            </EditorSection>
          )}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={saveLanding}
            disabled={saving}
            className="rounded-xl bg-black px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>

          {message ? <p className="text-sm text-gray-600">{message}</p> : null}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-end gap-4 border-b border-gray-200 bg-gray-50 p-4">
          <PreviewControl
            label="Ancho"
            min={360}
            max={1440}
            value={previewWidth}
            onChange={setPreviewWidth}
          />
          <PreviewControl
            label="Alto"
            min={480}
            max={1200}
            value={previewHeight}
            onChange={setPreviewHeight}
          />
          <button
            type="button"
            onClick={() => {
              setPreviewWidth(390);
              setPreviewHeight(844);
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700"
          >
            Mobile
          </button>
          <button
            type="button"
            onClick={() => {
              setPreviewWidth(768);
              setPreviewHeight(900);
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700"
          >
            Tablet
          </button>
          <button
            type="button"
            onClick={() => {
              setPreviewWidth(1200);
              setPreviewHeight(820);
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700"
          >
            Desktop
          </button>
        </div>

        <div className="max-h-[calc(100vh-180px)] overflow-auto bg-gray-100 p-4">
          <div
            className="mx-auto overflow-auto bg-white shadow-sm"
            style={{
              width: previewWidth,
              height: previewHeight,
              maxWidth: "100%",
            }}
          >
            {landing.template === "UamProgramLanding" && (
              <UamProgramLanding brand={brand} landing={landing} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewControl({
  label,
  min,
  max,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid gap-1">
      <span className="text-xs font-semibold text-gray-700">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="w-28"
        />
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="w-20 rounded-lg border border-gray-300 px-2 py-1 text-xs text-gray-900"
        />
      </div>
    </label>
  );
}

function EditorSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-900">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-gray-900">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-black focus:ring-2 focus:ring-black/10"
      />
    </label>
  );
}

function TextareaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-gray-900">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-black focus:ring-2 focus:ring-black/10"
      />
    </label>
  );
}
