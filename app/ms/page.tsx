import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/LandingPage";
import { landingCopy } from "@/lib/landing-copy";

export const metadata: Metadata = {
  title: { absolute: "Peluang Pendapatan Hartanah Lelong | K Asset Ventures" },
  description:
    "Terokai peluang hartanah kediaman lelong terpilih dengan pulangan pegangan 1.5% sebulan, agihan keuntungan jualan berasingan dan perlindungan modal pokok selama 24 bulan.",
  alternates: {
    canonical: "https://www.kassetventures.com/ms",
    languages: {
      en: "https://www.kassetventures.com",
      ms: "https://www.kassetventures.com/ms",
    },
  },
  openGraph: {
    title: "Peluang Pendapatan Hartanah Lelong | K Asset Ventures",
    description: "Jana pendapatan melalui peluang hartanah kediaman lelong terpilih dengan tempoh pegangan yang tersusun dan perlindungan modal yang ditetapkan.",
    url: "https://www.kassetventures.com/ms",
    locale: "ms_MY",
    siteName: "K Asset Ventures",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Peluang hartanah lelong K Asset Ventures" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Peluang Pendapatan Hartanah Lelong | K Asset Ventures",
    description: "Jana pendapatan melalui peluang hartanah kediaman lelong terpilih.",
    images: ["/opengraph-image"],
  },
};

export default function MalayHome() {
  return <LandingPage copy={landingCopy.ms} />;
}
