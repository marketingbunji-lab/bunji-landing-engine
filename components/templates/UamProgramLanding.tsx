import Script from "next/script";
import ClientifyProgramSelector from "../forms/ClientifyProgramSelector";
import Accordion from "../ui/Accordion";

type Props = {
  brand: any;
  landing: any;
};

export default function UamProgramLanding({ brand, landing }: Props) {
  const hero = landing?.hero ?? {};
  const whyStudy = landing?.whyStudy ?? {};
  const supportSection = landing?.supportSection ?? {};
  const benefits = landing?.benefits ?? {};
  const cta = landing?.cta ?? {};
  const form = landing?.form ?? {};

  const programInfo = landing?.programInfo ?? [];
  const whyStudyItems = whyStudy?.items ?? [];
  const supportItems = supportSection?.items ?? [];
  const benefitItems = benefits?.items ?? [];
  const legalLinks = brand?.legalLinks ?? [];

  const primaryColor = brand?.primaryColor ?? "#0069A3";
  const secondaryColor = brand?.secondaryColor ?? "#F8D74A";
  const logo = brand?.logo ?? "";
  const brandName = brand?.name ?? "Brand";

  const title = landing?.title ?? "Programa";
  const fullTitle = landing?.fullTitle ?? title;

  return (
    <div style={{ fontFamily: "Inter, Arial, sans-serif", color: "#111827" }}>
      <section
        style={{
          backgroundImage: hero?.backgroundImage
            ? `linear-gradient(90deg, rgba(0, 65, 105, 0.92), rgba(0, 105, 163, 0.62)), url(${hero.backgroundImage})`
            : "linear-gradient(90deg, rgba(0, 65, 105, 0.92), rgba(0, 105, 163, 0.62))",
          backgroundPosition: "center",
          backgroundSize: "cover",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "48px 24px",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.4fr) minmax(320px, 420px)",
              gap: 32,
              alignItems: "center",
            }}
          >
            <div style={{ color: "#fff", position: "relative", zIndex: 2 }}>
              {logo ? (
                <img
                  src={logo}
                  alt={brandName}
                  style={{ width: 280, maxWidth: "100%", height: "auto", marginBottom: 24 }}
                />
              ) : null}

              <p style={{ margin: "0 0 16px 0", fontSize: 18 }}>
                {hero?.eyebrow ?? `Estudia en ${brandName}`}
              </p>

              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(2.3rem, 5vw, 4rem)",
                  lineHeight: 1.05,
                  fontWeight: 800,
                }}
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
                    <p style={{ margin: "20px 0 0 0", fontSize: 18 }}>{hero.description}</p>
                  ) : null}

                  {hero?.supportText ? (
                    <p style={{ margin: "4px 0 0 0", fontSize: 18, fontWeight: 700 }}>
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
                  }}
                >
                  <span style={{ color: secondaryColor, fontWeight: 700 }}>Modalidad</span>{" "}
                  {hero.modality}
                </div>
              ) : null}

              {(hero?.semesterPrice || programInfo.length > 0) && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: 16,
                    marginTop: 24,
                    maxWidth: 720,
                  }}
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

                              {hero?.personImage ? (
                <img
                  src={hero.personImage}
                  alt={fullTitle}
                  style={{
                    width: 280,
                    maxWidth: "100%",
                    height: "auto",
                    marginTop: 24,
                    borderRadius: 16,
                  }}
                />
              ) : null}
                </div>
              )}
            </div>

            <div style={{ position: "relative", zIndex: 3 }}>
              <div
                id="anclaForm"
                style={{
                  background: "#fff",
                  borderRadius: 20,
                  padding: 24,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.16)",
                }}
              >
                <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: primaryColor }}>
                  Solicita información
                </p>

                <p style={{ margin: "8px 0 20px 0", color: "#4B5563" }}>{fullTitle}</p>

                {form?.scriptUrl ? (
                  <>
                    <Script src={form.scriptUrl} strategy="afterInteractive" />
                    {form?.programName ? (
                      <ClientifyProgramSelector programName={form.programName} />
                    ) : null}
                  </>
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
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.1fr) minmax(280px, 0.9fr)",
              gap: 32,
              alignItems: "end",
            }}
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
                <div style={{ display: "grid", gap: 12 }}>
                  <Accordion items={whyStudyItems} />
                </div>
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
              style={{
                marginTop: 32,
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)",
                gap: 24,
                alignItems: "start",
              }}
            >
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
                {supportSection?.videoUrl ? (
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
                ) : (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#9CA3AF",
                    }}
                  >
                    Video pendiente por configurar
                  </div>
                )}
              </div>

              <div style={{ display: "grid", gap: 16 }}>
                {supportItems.length > 0 ? (
                  supportItems.map((item: any, i: number) => (
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
                style={{
                  marginTop: 32,
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: 24,
                }}
              >
                {benefitItems.map((item: any, i: number) => (
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
              {legalLinks.map((link: any, i: number) => (
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
    </div>
  );
}