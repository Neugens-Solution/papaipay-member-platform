import type { Metadata } from "next";
import { IBM_Plex_Sans, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const bodyFont = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const editorialFont = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-editorial",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kassetventures.com"),
  applicationName: "K Asset Ventures",
  title: { default: "K Asset Ventures | Auction Property Participation", template: "%s | K Asset Ventures" },
  description: "Explore selected residential auction property opportunities through K Asset Ventures by PICM Sdn Bhd.",
  openGraph: {
    title: "K Asset Ventures | Auction Property Income Opportunities",
    description: "Selected residential auction property opportunities with a structured holding period and defined principal protection term.",
    url: "https://www.kassetventures.com",
    siteName: "K Asset Ventures",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "K Asset Ventures", description: "Build income through selected auction property opportunities." },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${bodyFont.variable} ${editorialFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
