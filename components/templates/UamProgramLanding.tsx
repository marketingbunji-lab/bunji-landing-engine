/* eslint-disable @next/next/no-img-element, @next/next/no-sync-scripts */
import Script from "next/script";
import { getBrandLogo } from "@/lib/brandLogo";
import type { Brand, IconTextItem, Landing, LegalLink } from "@/lib/data";
import ClientifyFormEmbed from "../forms/ClientifyFormEmbed";
import ClientifyProgramSelector from "../forms/ClientifyProgramSelector";
import LandingAccordion from "../ui/LandingAccordion";

type Props = {
  brand: Brand;
  landing: Landing;
  mode?: "preview" | "export";
};

function getClientifySelectorScript(programName: string) {
  return `
    const TARGET_TEXT = ${JSON.stringify(programName)};

    setTimeout(() => {
      function findSelectByOptionText(doc, text) {
        for (const sel of doc.querySelectorAll('select')) {
          const match = [...sel.options].find((o) => o.text.trim() === text);
          if (match) return { select: sel, option: match };
        }
        return null;
      }

      const docs = [document];
      for (const iframe of document.querySelectorAll('iframe')) {
        try {
          const idoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (idoc) docs.push(idoc);
        } catch (e) {}
      }

      let chosen = null;
      for (const d of docs) {
        chosen = findSelectByOptionText(d, TARGET_TEXT);
        if (chosen) break;
      }

      if (!chosen) return;

      const { select } = chosen;
      select.style.display = "none";
      select.setAttribute("aria-hidden", "true");
    }, 4000);
  `;
}

export default function UamProgramLanding({
  brand,
  landing,
  mode = "preview",
}: Props) {
  const hero = landing?.hero ?? {};
  const whyStudy = landing?.whyStudy ?? {};
  const supportSection = landing?.supportSection ?? {};
  const benefits = landing?.benefits ?? {};
  const cta = landing?.cta ?? {};
  const form = landing?.form ?? {};

  const programInfo = landing?.programInfo ?? [];
  const whyStudyItems = whyStudy?.items ?? [];
  const supportItems = supportSection?.items ?? [];
  const hasSupportVideo = Boolean(supportSection?.videoUrl);
  const benefitItems = benefits?.items ?? [];
  const legalLinks = brand?.legalLinks ?? [];
  const footerScripts = landing?.footerScripts ?? [];

  const primaryColor = brand?.primaryColor ?? "#0069A3";
  const secondaryColor = brand?.secondaryColor ?? "#F8D74A";
  const logo = brand ? getBrandLogo(brand, landing?.logoMode || "dark") : "";
  const brandName = brand?.name ?? "Brand";

  const title = landing?.title ?? "Programa";
  const fullTitle = landing?.fullTitle ?? title;

  return (
    <div
      className="uam-landing"
      style={{ fontFamily: "Inter, Arial, sans-serif", color: "#111827", margin: 0 }}
    >
      <style>{`
        .uam-landing img,
        .uam-landing iframe {
          max-width: 100%;
        }

        .uam-landing {
          container-type: inline-size;
        }

        .uam-container {
          max-width: 1200px;
          margin: 0 auto;
          padding-left: 24px;
          padding-right: 24px;
        }

        .uam-hero-shell {
          position: relative;
          padding-top: 48px;
          padding-bottom: 48px;
        }

        .uam-hero-grid {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: minmax(0, 1.02fr) minmax(120px, 0.34fr) minmax(320px, 420px);
          gap: 32px;
          align-items: center;
        }

        .uam-hero-content {
          color: #fff;
          position: relative;
          z-index: 2;
        }

        .uam-hero-title {
          margin: 0;
          font-size: clamp(2.3rem, 5vw, 4rem);
          line-height: 1.05;
          font-weight: 800;
        }

        .uam-hero-logo {
          width: 280px;
          max-width: 100%;
          height: auto;
          margin-bottom: 24px;
        }

        .uam-hero-info-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
          margin-top: 24px;
          max-width: 720px;
        }

        .uam-hero-person {
          position: absolute;
          bottom: 0;
          right: 32%;
          z-index: 1;
          width: min(38vw, 540px);
          height: auto;
          pointer-events: none;
        }

        .uam-form-column {
          position: relative;
          z-index: 3;
        }

        .uam-two-column-section {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(280px, 0.9fr);
          gap: 32px;
          align-items: end;
        }

        .uam-support-grid {
          margin-top: 32px;
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
          gap: 24px;
          align-items: start;
        }

        .uam-support-grid-full {
          grid-template-columns: 1fr;
        }

        .uam-support-items {
          display: grid;
          gap: 16px;
        }

        .uam-support-items-three {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .uam-benefits-grid {
          margin-top: 32px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
        }

        .uam-accordion {
          display: grid;
          gap: 12px;
        }

        .uam-accordion-item {
          border: 1px solid #E5E7EB;
          border-radius: 16px;
          background: #fff;
          overflow: hidden;
          position: relative;
        }

        .uam-accordion-input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .uam-accordion-summary {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          cursor: pointer;
          padding: 18px 20px;
          font-weight: 700;
          color: #111827;
        }

        .uam-accordion-icons {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          min-width: 24px;
          height: 24px;
          color: #6B7280;
          font-size: 18px;
          line-height: 1;
        }

        .uam-accordion-minus {
          display: none;
        }

        .uam-accordion-input:checked + .uam-accordion-summary .uam-accordion-plus {
          display: none;
        }

        .uam-accordion-input:checked + .uam-accordion-summary .uam-accordion-minus {
          display: inline;
        }

        .uam-accordion-panel {
          display: none;
          padding: 0 20px 18px;
          color: #4B5563;
          line-height: 1.6;
        }

        .uam-accordion-input:checked + .uam-accordion-summary + .uam-accordion-panel {
          display: block;
        }

        @media (max-width: 1199.98px) {
          .uam-hero-person {
            right: 38%;
            width: min(34vw, 420px);
          }
        }

        @media (max-width: 991.98px) {
          .uam-hero-grid,
          .uam-two-column-section,
          .uam-support-grid {
            grid-template-columns: 1fr;
          }

          .uam-hero-grid {
            gap: 24px;
          }

          .uam-hero-spacer {
            display: none;
          }

          .uam-hero-title {
            font-size: clamp(2.35rem, 9vw, 4rem);
          }

          .uam-hero-person {
            display: none;
          }

          .uam-form-column {
            grid-row: 2;
          }

          .uam-support-items-three {
            grid-template-columns: 1fr;
          }
        }

        @container (max-width: 991.98px) {
          .uam-hero-grid,
          .uam-two-column-section,
          .uam-support-grid {
            grid-template-columns: 1fr;
          }

          .uam-hero-grid {
            gap: 24px;
          }

          .uam-hero-spacer {
            display: none;
          }

          .uam-hero-title {
            font-size: clamp(2.35rem, 9cqw, 4rem);
          }

          .uam-hero-person {
            display: none;
          }

          .uam-form-column {
            grid-row: 2;
          }

          .uam-support-items-three {
            grid-template-columns: 1fr;
          }
        }

        @container (max-width: 767.98px) {
          .uam-benefits-grid {
            grid-template-columns: 1fr;
          }
        }

        @container (max-width: 575.98px) {
          .uam-container {
            padding-left: 16px;
            padding-right: 16px;
          }

          .uam-hero-shell {
            padding-top: 36px;
            padding-bottom: 40px;
          }

          .uam-hero-logo {
            width: 230px;
          }

          .uam-hero-info-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 767.98px) {
          .uam-benefits-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 575.98px) {
          .uam-container {
            padding-left: 16px;
            padding-right: 16px;
          }

          .uam-hero-shell {
            padding-top: 36px;
            padding-bottom: 40px;
          }

          .uam-hero-logo {
            width: 230px;
          }

          .uam-hero-info-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <section
        style={{
          backgroundImage: hero?.backgroundImage
            ? `linear-gradient(90deg, rgba(0, 65, 105, 0), rgba(0, 105, 163, 0.62)), url(${hero.backgroundImage})`
            : "linear-gradient(90deg, rgba(0, 65, 105, 0.92), rgba(0, 105, 163, 0.62))",
          backgroundPosition: "center",
          backgroundSize: "cover",
          overflow: "hidden",
        }}
      >
        <div
          className="uam-container uam-hero-shell"
        >
          <div
            className="uam-hero-grid"
          >
            <div className="uam-hero-content">
              {logo ? (
                <img
                  src={logo}
                  alt={brandName}
                  className="uam-hero-logo"
                />
              ) : null}

              <p style={{ margin: "0 0 16px 0", fontSize: 18, color: "#fff" }}>
                {hero?.eyebrow ?? `Estudia en ${brandName}`}
              </p>

              <h1
                className="uam-hero-title"
                style={{ color: "#fff" }}
              >
                {hero?.highlight ? (
                  <>
                    <span style={{ color: secondaryColor }}>{hero.highlight}</span>{" "}
                    {hero?.title ?? title}
                  </>
                ) : (
                  hero?.title ?? fullTitle
                )}
              </h1>

              {(hero?.description || hero?.supportText) && (
                <>
                  {hero?.description ? (
                    <p style={{ margin: "20px 0 0 0", fontSize: 18, color: "#fff" }}>
                      {hero.description}
                    </p>
                  ) : null}

                  {hero?.supportText ? (
                    <p
                      style={{
                        margin: "4px 0 0 0",
                        fontSize: 18,
                        fontWeight: 700,
                        color: "#fff",
                      }}
                    >
                      {hero.supportText}
                    </p>
                  ) : null}
                </>
              )}

              {hero?.modality ? (
                <div
                  style={{
                    marginTop: 20,
                    borderLeft: `4px solid ${secondaryColor}`,
                    paddingLeft: 12,
                    color: "#fff",
                  }}
                >
                  <span style={{ color: secondaryColor, fontWeight: 700 }}>Modalidad</span>{" "}
                  {hero.modality}
                </div>
              ) : null}

              {(hero?.semesterPrice || programInfo.length > 0) && (
                <div
                  className="uam-hero-info-grid"
                >
                  <div>
                    {hero?.semesterPrice ? (
                      <p style={{ margin: 0, color: "#fff" }}>
                        <span style={{ fontSize: "2.2rem", fontWeight: 700 }}>
                          {hero.semesterPrice}
                        </span>
                        <br />
                        Valor semestre
                      </p>
                    ) : null}
                  </div>

                  {programInfo.length > 0 ? (
                    <div
                      style={{
                        background: "rgba(15, 121, 181, 0.7)",
                        borderLeft: `4px solid ${secondaryColor}`,
                        padding: 16,
                      }}
                    >
                      <p style={{ margin: 0, color: "#fff", lineHeight: 1.5 }}>
                        <strong>Información general</strong>
                        <br />
                        {programInfo.map((item: string, i: number) => (
                          <span key={i}>
                            {item}
                            <br />
                          </span>
                        ))}
                      </p>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {hero?.personImage ? (
              <img
                src={hero.personImage}
                alt={fullTitle}
                className="uam-hero-person"
              />
            ) : null}

            <div className="uam-hero-spacer" />

            <div className="uam-form-column">
              <div
                id="anclaForm"
                className="form-shell"
              >
                {form?.scriptCode || form?.scriptUrl ? (
                  mode === "export" ? (
                    <>
                      {form?.scriptCode ? (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: form.scriptCode,
                          }}
                        />
                      ) : (
                        <script type="text/javascript" src={form.scriptUrl} />
                      )}
                      {form?.programName ? (
                        <script
                          dangerouslySetInnerHTML={{
                            __html: getClientifySelectorScript(form.programName),
                          }}
                        />
                      ) : null}
                    </>
                  ) : (
                    <>
                      {form?.scriptCode ? (
                        <ClientifyFormEmbed code={form.scriptCode} />
                      ) : (
                        <Script src={form.scriptUrl} strategy="afterInteractive" />
                      )}
                      {form?.programName ? (
                        <ClientifyProgramSelector programName={form.programName} />
                      ) : null}
                    </>
                  )
                ) : (
                  <div
                    style={{
                      border: "1px dashed #D1D5DB",
                      borderRadius: 16,
                      padding: 20,
                      background: "#F9FAFB",
                    }}
                  >
                    <p style={{ margin: 0, fontWeight: 700 }}>Formulario no configurado</p>
                    <p style={{ margin: "8px 0 0 0", fontSize: 14, color: "#6B7280" }}>
                      Puedes agregar <code>form.scriptUrl</code> en el JSON de esta landing.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {(whyStudy?.title || whyStudy?.description || whyStudyItems.length > 0) && (
        <section style={{ padding: "64px 24px" }}>
          <div
            className="uam-two-column-section"
          >
            <div>
              {whyStudy?.title ? (
                <h2
                  style={{
                    margin: 0,
                    fontSize: 36,
                    lineHeight: 1.1,
                    fontWeight: 800,
                    color: "#111827",
                  }}
                >
                  {whyStudy.title}
                </h2>
              ) : null}

              {whyStudy?.description ? (
                <p style={{ margin: "16px 0 24px 0", fontSize: 18, color: "#374151" }}>
                  {whyStudy.description}
                </p>
              ) : null}

              {whyStudyItems.length > 0 ? (
                <LandingAccordion items={whyStudyItems} id="whyStudyAccordion" />
              ) : (
                <div
                  style={{
                    border: "1px dashed #D1D5DB",
                    borderRadius: 14,
                    background: "#F9FAFB",
                    padding: 18,
                    color: "#6B7280",
                  }}
                >
                  Esta landing todavía no tiene beneficios o razones del programa configuradas.
                </div>
              )}
            </div>

            <div style={{ textAlign: "center" }}>
              {whyStudy?.image ? (
                <img
                  src={whyStudy.image}
                  alt={whyStudy?.title ?? fullTitle}
                  style={{
                    width: "100%",
                    minHeight: 520,
                    objectFit: "contain",
                    objectPosition: "center bottom",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    minHeight: 520,
                    borderRadius: 24,
                    background:
                      "linear-gradient(180deg, rgba(0,105,163,0.08), rgba(248,215,74,0.18))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 24,
                  }}
                >
                  <p style={{ margin: 0, color: "#6B7280" }}>Imagen de apoyo del programa</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {(supportSection?.title || supportSection?.videoUrl || supportItems.length > 0) && (
        <section
          style={{
            background: "#FED821",
            padding: "64px 24px",
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            {supportSection?.title ? (
              <h2
                style={{
                  margin: 0,
                  textAlign: "center",
                  fontSize: 36,
                  fontWeight: 800,
                  color: "#111827",
                }}
              >
                {supportSection.title}
              </h2>
            ) : null}

            <div
              className={`uam-support-grid ${
                hasSupportVideo ? "" : "uam-support-grid-full"
              }`}
            >
              {hasSupportVideo ? (
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    paddingTop: "56.25%",
                    background: "#111827",
                    borderRadius: 20,
                    overflow: "hidden",
                  }}
                >
                  <iframe
                    src={supportSection.videoUrl}
                    title={supportSection.title ?? fullTitle}
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      border: 0,
                    }}
                  />
                </div>
              ) : null}

              <div
                className={`uam-support-items ${
                  hasSupportVideo ? "" : "uam-support-items-three"
                }`}
              >
                {supportItems.length > 0 ? (
                  supportItems.map((item: IconTextItem, i) => (
                    <div
                      key={i}
                      style={{
                        background: "#FFDB47",
                        borderRadius: 18,
                        padding: 20,
                        display: "flex",
                        gap: 16,
                        alignItems: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          width: 64,
                          minWidth: 64,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        {item?.icon ? (
                          <img
                            src={item.icon}
                            alt={item?.title ?? `Icono ${i + 1}`}
                            style={{ width: 48, height: "auto" }}
                          />
                        ) : null}
                      </div>

                      <div>
                        <p style={{ margin: 0, lineHeight: 1.6 }}>
                          <strong>{item?.title ?? `Beneficio ${i + 1}`}</strong>
                          <br />
                          {item?.text ?? ""}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      background: "#FFDB47",
                      borderRadius: 18,
                      padding: 20,
                      color: "#374151",
                    }}
                  >
                    Esta sección aún no tiene cards configuradas.
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
              <a
                href="#anclaForm"
                style={{
                  display: "inline-block",
                  padding: "14px 24px",
                  borderRadius: 12,
                  textDecoration: "none",
                  background: primaryColor,
                  color: "#fff",
                  fontWeight: 700,
                }}
              >
                ¡Inscríbete ahora!
              </a>
            </div>
          </div>
        </section>
      )}

      {(benefits?.title || benefitItems.length > 0) && (
        <section
          style={{
            background: "#F8F8FF",
            padding: "64px 24px",
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            {benefits?.title ? (
              <h2
                style={{
                  margin: 0,
                  textAlign: "center",
                  fontSize: 36,
                  fontWeight: 800,
                  color: "#111827",
                }}
              >
                {benefits.title}
              </h2>
            ) : null}

            {benefitItems.length > 0 ? (
              <div
                className="uam-benefits-grid"
              >
                {benefitItems.map((item: IconTextItem, i) => (
                  <div
                    key={i}
                    style={{
                      background: "#fff",
                      borderRadius: 18,
                      padding: 24,
                      display: "flex",
                      gap: 16,
                      alignItems: "flex-start",
                      minHeight: 180,
                    }}
                  >
                    <div style={{ width: 48, minWidth: 48 }}>
                      {item?.icon ? (
                        <img
                          src={item.icon}
                          alt={item?.title ?? `Icono ${i + 1}`}
                          style={{ width: "100%", height: "auto" }}
                        />
                      ) : null}
                    </div>

                    <div>
                      <p style={{ margin: 0, lineHeight: 1.6 }}>
                        <strong>{item?.title ?? `Beneficio ${i + 1}`}</strong>
                        <br />
                        {item?.text ?? ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  marginTop: 24,
                  border: "1px dashed #D1D5DB",
                  borderRadius: 18,
                  padding: 24,
                  background: "#fff",
                  textAlign: "center",
                  color: "#6B7280",
                }}
              >
                Esta landing aún no tiene beneficios configurados.
              </div>
            )}
          </div>
        </section>
      )}

      {(cta?.title || cta?.button) && (
        <section
          style={{
            backgroundImage:
              "linear-gradient(rgba(0, 68, 105, 0.6), rgba(0, 68, 105, 0.6)), url('https://bunjigrowth.io/wp-content/uploads/2026/04/students-group.jpg')",
            backgroundPosition: "center",
            backgroundSize: "cover",
            padding: "72px 24px",
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
            {cta?.title ? (
              <h2
                style={{
                  margin: 0,
                  color: "#fff",
                  fontSize: 40,
                  fontWeight: 800,
                }}
              >
                {cta.title}
              </h2>
            ) : null}

            {cta?.button ? (
              <a
                href="#anclaForm"
                style={{
                  marginTop: 24,
                  display: "inline-block",
                  padding: "14px 24px",
                  borderRadius: 12,
                  textDecoration: "none",
                  background: secondaryColor,
                  color: "#111827",
                  fontWeight: 700,
                }}
              >
                {cta.button}
              </a>
            ) : null}
          </div>
        </section>
      )}

      <footer
        style={{
          background: primaryColor,
          color: "#fff",
          padding: "40px 24px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          {logo ? (
            <img
              src={logo}
              alt={brandName}
              style={{ width: 280, maxWidth: "100%", height: "auto" }}
            />
          ) : null}

          {legalLinks.length > 0 ? (
            <div style={{ marginTop: 20, fontSize: 14, lineHeight: 1.8 }}>
              {legalLinks.map((link: LegalLink, i) => (
                <span key={i}>
                  <a
                    href={link?.url ?? "#"}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#fff", textDecoration: "none" }}
                  >
                    {link?.label ?? `Link ${i + 1}`}
                  </a>
                  {i < legalLinks.length - 1 ? " | " : ""}
                </span>
              ))}
            </div>
          ) : (
            <div style={{ marginTop: 20, fontSize: 14, color: "rgba(255,255,255,0.8)" }}>
              Links legales pendientes por configurar.
            </div>
          )}
        </div>
      </footer>

      {footerScripts.map((script, index) =>
        mode === "export" ? (
          <div
            key={`footer-script-${index}`}
            dangerouslySetInnerHTML={{ __html: script }}
          />
        ) : (
          <ClientifyFormEmbed
            key={`footer-script-${index}`}
            code={script}
            className="hidden"
          />
        )
      )}
    </div>
  );
}
