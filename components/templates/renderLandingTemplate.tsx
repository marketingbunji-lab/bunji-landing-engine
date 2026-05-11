import type { Brand, Landing } from "@/lib/data";
import DefaultLanding from "./DefaultLanding";
import LandingBasic from "./LandingBasic";
import UamProgramLanding from "./UamProgramLanding";

type RenderLandingTemplateProps = {
  brand: Brand;
  landing: Landing;
  mode?: "preview" | "export";
};

export function renderLandingTemplate({
  brand,
  landing,
  mode = "preview",
}: RenderLandingTemplateProps) {
  if (landing.template === "UamProgramLanding") {
    return <UamProgramLanding brand={brand} landing={landing} mode={mode} />;
  }

  if (landing.template === "LandingBasic") {
    return (
      <LandingBasic
        brand={{
          fontBody:
            brand.typography?.fontFamily?.trim() || "Inter, Arial, sans-serif",
          fontHeading:
            brand.typography?.fontFamily?.trim() || "Inter, Arial, sans-serif",
          primaryColor: brand.primaryColor,
          secondaryColor: brand.secondaryColor,
          textColor: "#ffffff",
        }}
        data={{
          title: landing.hero?.title || landing.fullTitle || landing.title,
          subtitle: landing.hero?.description,
          cta: landing.cta?.button,
          benefits: [
            ...(landing.programInfo ?? []),
            ...((landing.benefits?.items ?? []).map((item) => item.title)),
          ],
        }}
      />
    );
  }

  return <DefaultLanding brand={brand} landing={landing} mode={mode} />;
}
