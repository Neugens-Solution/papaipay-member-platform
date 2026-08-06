import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/LandingPage";
import { landingCopy } from "@/lib/landing-copy";

export const metadata: Metadata = {
  title: { absolute: "Auction Property Income Opportunities | K Asset Ventures" },
  description:
    "Explore selected residential auction property opportunities with a 1.5% monthly holding return, separate sale-profit distribution and a defined 24-month principal protection term.",
  alternates: {
    canonical: "https://www.kassetventures.com",
    languages: {
      en: "https://www.kassetventures.com",
      ms: "https://www.kassetventures.com/ms",
    },
  },
  openGraph: {
    title: "Auction Property Income Opportunities | K Asset Ventures",
    description: "Build income through selected residential auction property opportunities with a structured holding period and defined principal protection term.",
    url: "https://www.kassetventures.com",
    locale: "en_MY",
    siteName: "K Asset Ventures",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "K Asset Ventures auction property opportunities" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Auction Property Income Opportunities | K Asset Ventures",
    description: "Build income through selected residential auction property opportunities.",
    images: ["/opengraph-image"],
  },
};

export default function Home() {
  return <LandingPage copy={landingCopy.en} />;
}
