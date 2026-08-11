import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/LandingPage";
import { landingCopy } from "@/lib/landing-copy";

export const metadata: Metadata = {
  title: { absolute: "Projek Hartanah Kediaman Terpilih | K Asset Ventures" },
  description:
    "Ketahui bagaimana K Asset Ventures by PICM Sdn Bhd mengenal pasti, menilai, menambah baik dan mengurus projek hartanah kediaman terpilih untuk ahli yang diluluskan.",
  alternates: {
    canonical: "https://www.kassetventures.com/ms",
    languages: {
      en: "https://www.kassetventures.com",
      ms: "https://www.kassetventures.com/ms",
    },
  },
  openGraph: {
    title: "Projek Hartanah Kediaman Terpilih | K Asset Ventures",
    description:
      "K Asset Ventures memperkenalkan projek hartanah kediaman terpilih dengan konteks projek, dokumen ahli dan maklumat risiko untuk ahli yang diluluskan.",
    url: "https://www.kassetventures.com/ms",
    locale: "ms_MY",
    siteName: "K Asset Ventures",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Projek hartanah kediaman terpilih K Asset Ventures" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projek Hartanah Kediaman Terpilih | K Asset Ventures",
    description: "Projek hartanah kediaman terpilih untuk ahli K Asset Ventures yang diluluskan.",
    images: ["/opengraph-image"],
  },
};

export default function MalayHome() {
  return <LandingPage copy={landingCopy.ms} />;
}
