import {
  type AccordionItem,
  type Brand,
  type IconTextItem,
  type Landing,
  type LegalLink,
} from "./data";
import { getBrandLogo } from "./brandLogo";

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(value: unknown) {
  return escapeHtml(value).replace(/'/g, "&#39;");
}

function renderProgramInfo(items: string[]) {
  if (!items.length) return "";

  return `
    <div class="col-12 col-sm-6">
      <div class="hero-info-card h-100 p-3">
        <p class="text-light mb-0">
          <strong>Información general</strong><br>
          ${items.map((item) => `${escapeHtml(item)}<br>`).join("")}
        </p>
      </div>
    </div>
  `;
}

function renderAccordion(items: AccordionItem[]) {
  if (!items.length) {
    return `
      <div class="border border-dashed rounded-4 bg-light p-4 text-secondary">
        Esta landing todavía no tiene beneficios o razones del programa configuradas.
      </div>
    `;
  }

  return `
    <div class="accordion" id="whyStudyAccordion">
      ${items
        .map((item, index) => {
          const headingId = `whyStudyHeading${index}`;
          const collapseId = `whyStudyCollapse${index}`;
          const isFirst = index === 0;

          return `
            <div class="accordion-item">
              <h2 class="accordion-header" id="${headingId}">
                <button
                  class="accordion-button ${isFirst ? "" : "collapsed"}"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#${collapseId}"
                  aria-expanded="${isFirst ? "true" : "false"}"
                  aria-controls="${collapseId}"
                >
                  ${escapeHtml(item.title)}
                </button>
              </h2>
              <div
                id="${collapseId}"
                class="accordion-collapse collapse ${isFirst ? "show" : ""}"
                aria-labelledby="${headingId}"
                data-bs-parent="#whyStudyAccordion"
              >
                <div class="accordion-body">
                  ${escapeHtml(item.content)}
                </div>
              </div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderSupportItems(items: IconTextItem[], useColumns = false) {
  if (!items.length) {
    return `
      <div class="${useColumns ? "col-12" : ""}">
        <div class="support-card rounded-4 p-4 text-secondary">
          Esta sección aún no tiene cards configuradas.
        </div>
      </div>
    `;
  }

  return items
    .map(
      (item, index) => `
        <div class="${useColumns ? "col-12 col-md-4" : ""}">
          <div class="support-card rounded-4 p-4 d-flex gap-3 align-items-start">
            <div class="support-icon">
              ${
                item.icon
                  ? `<img src="${escapeAttr(item.icon)}" alt="${escapeAttr(
                      item.title || `Icono ${index + 1}`
                    )}">`
                  : ""
              }
            </div>
            <p class="mb-0">
              <strong>${escapeHtml(item.title || `Beneficio ${index + 1}`)}</strong><br>
              ${escapeHtml(item.text)}
            </p>
          </div>
        </div>
      `
    )
    .join("");
}

function renderBenefitItems(items: IconTextItem[]) {
  if (!items.length) {
    return `
      <div class="col-12">
        <div class="bg-white rounded-4 p-4 text-center text-secondary">
          Esta landing aún no tiene beneficios configurados.
        </div>
      </div>
    `;
  }

  return items
    .map(
      (item, index) => `
        <div class="col-12 col-md-4">
          <div class="benefit-card rounded-4 p-4 d-flex gap-3 align-items-start">
            <div class="benefit-icon">
              ${
                item.icon
                  ? `<img src="${escapeAttr(item.icon)}" alt="${escapeAttr(
                      item.title || `Icono ${index + 1}`
                    )}">`
                  : ""
              }
            </div>
            <p class="mb-0">
              <strong>${escapeHtml(item.title || `Beneficio ${index + 1}`)}</strong><br>
              ${escapeHtml(item.text)}
            </p>
          </div>
        </div>
      `
    )
    .join("");
}

function renderLegalLinks(links: LegalLink[]) {
  if (!links.length) {
    return `<div class="mt-4 small text-white-50">Links legales pendientes por configurar.</div>`;
  }

  return `
    <div class="footer-links mt-4 small">
      ${links
        .map(
          (link, index) => `
            <a href="${escapeAttr(link.url)}" target="_blank" rel="noreferrer">
              ${escapeHtml(link.label || `Link ${index + 1}`)}
            </a>
          `
        )
        .join("")}
    </div>
  `;
}

function renderClientifySelector(programName?: string) {
  if (!programName) return "";

  return `
    <script>
      const TARGET_TEXT = ${JSON.stringify(programName)};

      setTimeout(() => {
        function findSelectByOptionText(doc, text) {
          for (const sel of doc.querySelectorAll('select')) {
            const match = [...sel.options].find((option) => option.text.trim() === text);
            if (match) return { select: sel, option: match };
          }
          return null;
        }

        const docs = [document];
        for (const iframe of document.querySelectorAll('iframe')) {
          try {
            const idoc = iframe.contentDocument || iframe.contentWindow?.document;
            if (idoc) docs.push(idoc);
          } catch (error) {}
        }

        let chosen = null;
        for (const doc of docs) {
          chosen = findSelectByOptionText(doc, TARGET_TEXT);
          if (chosen) break;
        }

        if (!chosen) return;

        const { select } = chosen;
        select.style.display = 'none';
        select.setAttribute('aria-hidden', 'true');
      }, 4000);
    </script>
  `;
}

export function exportLandingHtml(brand: Brand, landing: Landing) {
  const hero = landing.hero ?? {};
  const whyStudy = landing.whyStudy ?? {};
  const supportSection = landing.supportSection ?? {};
  const benefits = landing.benefits ?? {};
  const cta = landing.cta ?? {};
  const form = landing.form ?? {};

  const primaryColor = brand.primaryColor || "#0069A3";
  const secondaryColor = brand.secondaryColor || "#F8D74A";
  const yellowSection = "#FED821";
  const yellowCard = "#FFDB47";
  const lightSection = "#F8F8FF";
  const blueSoft = "#0F79B5B3";

  const title = landing.title || "Programa";
  const fullTitle = landing.fullTitle || title;
  const heroTitle = hero.title || title;
  const backgroundImage = hero.backgroundImage || "";
  const logo = getBrandLogo(brand, landing.logoMode || "dark");
  const legalLinks = brand.legalLinks ?? [];
  const hasSupportVideo = Boolean(supportSection.videoUrl);
  const footerScripts = landing.footerScripts ?? [];

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(fullTitle)} | ${escapeHtml(brand.name)}</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <style>
    :root {
      --uam-blue: ${primaryColor};
      --uam-blue-soft: ${blueSoft};
      --uam-yellow: ${secondaryColor};
      --uam-yellow-section: ${yellowSection};
      --uam-yellow-card: ${yellowCard};
      --uam-light: ${lightSection};
    }

    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      overflow-x: hidden;
      font-family: Arial, Helvetica, sans-serif;
      color: #111827;
    }
    img, iframe { max-width: 100%; }
    .u_content_html { padding: 0 !important; }
    .grecaptcha-badge { bottom: 20% !important; }
    .section-padding {
      padding-top: 4rem;
      padding-bottom: 4rem;
    }
    .banner-hero {
      position: relative;
      overflow: hidden;
      background-image: ${
        backgroundImage
          ? `linear-gradient(90deg, rgba(0, 65, 105, 0), rgba(0, 105, 163, 0.62)), url("${escapeAttr(backgroundImage)}")`
          : "linear-gradient(90deg, rgba(0, 65, 105, 0.92), rgba(0, 105, 163, 0.62))"
      };
      background-position: center;
      background-size: cover;
    }
    .hero-content {
      position: relative;
      z-index: 2;
    }
    .hero-logo,
    .footer-logo {
      width: 280px;
      height: auto;
    }
    .hero-title {
      line-height: 1.05;
    }
    .text-uam-yellow {
      color: var(--uam-yellow);
    }
    .hero-info-card {
      background: var(--uam-blue-soft);
      border-left: 4px solid var(--uam-yellow);
    }
    .hero-person {
      position: absolute;
      bottom: 0;
      right: 32%;
      z-index: 1;
      width: min(38vw, 540px);
      height: auto;
      pointer-events: none;
    }
    .form-column {
      position: relative;
      z-index: 3;
    }
    .form-shell {
      width: 100%;
    }
    .support-section {
      background-color: var(--uam-yellow-section);
    }
    .support-card {
      background: var(--uam-yellow-card);
      min-height: 100%;
    }
    .support-icon {
      width: 64px;
      min-width: 64px;
      display: flex;
      justify-content: center;
    }
    .support-icon img {
      width: 48px;
      height: auto;
    }
    .benefits-section {
      background-color: var(--uam-light);
    }
    .benefit-card {
      background: #fff;
      height: 100%;
    }
    .benefit-icon {
      width: 48px;
      min-width: 48px;
    }
    .why-study-image {
      width: 100%;
      min-height: 520px;
      object-fit: contain;
      object-position: center bottom;
    }
    .bannerDos {
      background-image: linear-gradient(rgba(0, 68, 105, 0.6), rgba(0, 68, 105, 0.6)), url("https://bunjigrowth.io/wp-content/uploads/2026/04/students-group.jpg");
      background-position: center;
      background-size: cover;
    }
    .footerUam {
      background-color: var(--uam-blue);
    }
    .footer-links a {
      color: #fff;
      display: inline-block;
      margin: 0.15rem 0.25rem;
      text-decoration: none;
    }
    .accordion-button:focus {
      box-shadow: none;
    }
    .accordion-button:not(.collapsed) {
      background: #fff;
      color: #111827;
    }
    .row {
      margin-left: 0 !important;
      margin-right: 0 !important;
    }
    .container {
      padding-left: 0 !important;
      padding-right: 0 !important;
    }

    @media (max-width: 1199.98px) {
      .hero-person {
        right: 38%;
        width: min(34vw, 420px);
      }
    }

    @media (max-width: 991.98px) {
      .banner-hero {
        background-image: ${
          backgroundImage
            ? `linear-gradient(90deg, rgba(0, 65, 105, 0), rgba(0, 105, 163, 0.62)), url("${escapeAttr(backgroundImage)}")`
            : "linear-gradient(rgba(0, 65, 105, 0.88), rgba(0, 105, 163, 0.72))"
        };
      }
      .hero-title {
        font-size: clamp(2.35rem, 9vw, 4rem);
      }
      .hero-person {
        display: none;
      }
      .form-column {
        padding-top: 1.5rem;
      }
    }

    @media (max-width: 575.98px) {
      .section-padding {
        padding-top: 3rem;
        padding-bottom: 3rem;
      }
      .hero-logo,
      .footer-logo {
        width: 230px;
      }
      .support-card,
      .benefit-card {
        margin-left: 0;
        margin-right: 0;
      }
    }
  </style>

  <div class="banner-hero">
    <div class="container position-relative">
      <div class="row align-items-center justify-content-between g-4 py-4 py-lg-5">
        <div class="col-12 col-lg-6 hero-content">
          ${
            logo
              ? `<img class="hero-logo mb-4" src="${escapeAttr(logo)}" alt="${escapeAttr(
                  brand.description || brand.name
                )}">`
              : ""
          }
          <p class="text-light">${escapeHtml(hero.eyebrow || `Estudia en ${brand.name}`)}</p>
          <p class="text-light display-3 hero-title">
            <strong>${
              hero.highlight
                ? `<span class="text-uam-yellow">${escapeHtml(hero.highlight)}</span> `
                : ""
            }${escapeHtml(heroTitle)}</strong>
          </p>
          ${
            hero.description || hero.supportText
              ? `
                <p class="text-light">
                  ${hero.description ? `${escapeHtml(hero.description)}<br>` : ""}
                  ${hero.supportText ? `<strong>${escapeHtml(hero.supportText)}</strong>` : ""}
                </p>
              `
              : ""
          }
          ${
            hero.modality
              ? `
                <p class="text-light border-start border-warning px-2">
                  <span class="text-uam-yellow">Modalidad</span> ${escapeHtml(hero.modality)}
                </p>
              `
              : ""
          }

          <div class="row align-items-stretch g-3">
            ${
              hero.semesterPrice
                ? `
                  <div class="col-12 col-sm-6">
                    <p class="text-light mb-0">
                      <span class="display-6">${escapeHtml(hero.semesterPrice)}</span><br>
                      Valor semestre
                    </p>
                  </div>
                `
                : ""
            }
            ${renderProgramInfo(landing.programInfo ?? [])}
          </div>
        </div>

        <div class="col-12 col-lg-2">
          ${
            hero.personImage
              ? `<img class="hero-person" src="${escapeAttr(hero.personImage)}" alt="${escapeAttr(
                  fullTitle
                )}">`
              : ""
          }
        </div>

        <div class="col-12 col-lg-4 d-flex align-items-center pt-4 form-column" id="anclaForm">
          <div class="form-shell">
            ${
              form.scriptCode || form.scriptUrl
                ? `${form.scriptCode || `<script type="text/javascript" src="${escapeAttr(form.scriptUrl)}"></script>`}${renderClientifySelector(
                    form.programName
                  )}`
                : `
                  <div class="bg-white rounded-4 p-4 shadow">
                    <p class="fw-bold mb-2" style="color: var(--uam-blue);">Formulario no configurado</p>
                    <p class="mb-0 text-secondary">${escapeHtml(fullTitle)}</p>
                  </div>
                `
            }
          </div>
        </div>
      </div>
    </div>
  </div>

  <section class="section-padding">
    <div class="container">
      <div class="row align-items-end g-4">
        <div class="col-12 col-lg-7">
          ${
            whyStudy.title
              ? `<h2 class="display-6 fw-bold">${escapeHtml(whyStudy.title)}</h2>`
              : ""
          }
          ${
            whyStudy.description
              ? `<p class="lead text-secondary mb-4">${escapeHtml(whyStudy.description)}</p>`
              : ""
          }
          ${renderAccordion(whyStudy.items ?? [])}
        </div>
        <div class="col-12 col-lg-5 text-center">
          ${
            whyStudy.image
              ? `<img class="why-study-image" src="${escapeAttr(whyStudy.image)}" alt="${escapeAttr(
                  whyStudy.title || fullTitle
                )}">`
              : `
                <div class="rounded-4 d-flex align-items-center justify-content-center p-4 why-image-placeholder">
                  <p class="mb-0 text-secondary">Imagen de apoyo del programa</p>
                </div>
              `
          }
        </div>
      </div>
    </div>
  </section>

  <section class="support-section section-padding">
    <div class="container">
      ${
        supportSection.title
          ? `<h2 class="display-6 fw-bold text-center mb-4">${escapeHtml(supportSection.title)}</h2>`
          : ""
      }
      <div class="row g-4 align-items-start">
        ${
          hasSupportVideo
            ? `
              <div class="col-12 col-lg-7">
                <div class="ratio ratio-16x9 rounded-4 overflow-hidden bg-dark">
                  <iframe src="${escapeAttr(
                    supportSection.videoUrl
                  )}" title="${escapeAttr(
                    supportSection.title || fullTitle
                  )}" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"></iframe>
                </div>
              </div>
            `
            : ""
        }
        <div class="${hasSupportVideo ? "col-12 col-lg-5" : "col-12"}">
          <div class="${hasSupportVideo ? "d-grid gap-3" : "row g-3"}">
            ${renderSupportItems(supportSection.items ?? [], !hasSupportVideo)}
          </div>
        </div>
      </div>
      <div class="text-center mt-4">
        <a href="#anclaForm" class="btn btn-lg fw-bold text-white" style="background: var(--uam-blue);">
          ${escapeHtml(cta.button || "¡Inscríbete ahora!")}
        </a>
      </div>
    </div>
  </section>

  <section class="benefits-section section-padding">
    <div class="container">
      ${benefits.title ? `<h2 class="display-6 fw-bold text-center mb-4">${escapeHtml(benefits.title)}</h2>` : ""}
      <div class="row g-4">
        ${renderBenefitItems(benefits.items ?? [])}
      </div>
    </div>
  </section>

  <section class="bannerDos section-padding">
    <div class="container text-center">
      ${cta.title ? `<h2 class="display-5 fw-bold text-light mb-4">${escapeHtml(cta.title)}</h2>` : ""}
      <a href="#anclaForm" class="btn btn-lg fw-bold" style="background: var(--uam-yellow); color: #111827;">
        ${escapeHtml(cta.button || "¡Inscríbete ahora!")}
      </a>
    </div>
  </section>

  <footer class="footerUam text-center text-light py-5">
    <div class="container">
      ${
        logo
          ? `<img class="footer-logo" src="${escapeAttr(logo)}" alt="${escapeAttr(brand.name)}">`
          : ""
      }
      ${renderLegalLinks(legalLinks)}
    </div>
  </footer>

  <style>
    .why-image-placeholder {
      min-height: 520px;
      background: linear-gradient(180deg, rgba(0, 105, 163, 0.08), rgba(248, 215, 74, 0.18));
    }
    @media (max-width: 991.98px) {
      .why-image-placeholder {
        min-height: 320px;
      }
    }
  </style>

  ${footerScripts.join("\n")}
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>`;
}
