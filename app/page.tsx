import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/LandingPage";
import { landingCopy } from "@/lib/landing-copy";

export const metadata: Metadata = {
  title: { absolute: "Selected Malaysian Property Projects | K Asset Ventures" },
  description:
    "Learn how K Asset Ventures by PICM Sdn Bhd identifies, assesses, improves and manages selected Malaysian residential property projects for approved members.",
  alternates: {
    canonical: "https://www.kassetventures.com",
    languages: {
      en: "https://www.kassetventures.com",
      ms: "https://www.kassetventures.com/ms",
    },
  },
  openGraph: {
    title: "Selected Malaysian Property Projects | K Asset Ventures",
    description:
      "K Asset Ventures presents selected Malaysian residential property projects with project context, member documents and risk information for approved members.",
    url: "https://www.kassetventures.com",
    locale: "en_MY",
    siteName: "K Asset Ventures",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "K Asset Ventures selected Malaysian residential property projects" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Selected Malaysian Property Projects | K Asset Ventures",
    description: "Selected Malaysian residential property projects for approved K Asset Ventures members.",
    images: ["/opengraph-image"],
  },
};

export default function Home() {
  return <LandingPage copy={landingCopy.en} />;
}
