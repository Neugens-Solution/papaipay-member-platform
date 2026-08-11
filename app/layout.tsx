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
  title: { default: "K Asset Ventures | Selected Property Projects", template: "%s | K Asset Ventures" },
  description: "Explore how K Asset Ventures by PICM Sdn Bhd manages selected Malaysian residential property projects for approved members.",
  icons: {
    icon: [
      { url: "/kav-favicon.svg", type: "image/svg+xml" },
      { url: "/kav-favicon.png", sizes: "500x500", type: "image/png" },
    ],
    shortcut: "/kav-favicon.png",
    apple: [{ url: "/kav-favicon.png", sizes: "500x500", type: "image/png" }],
  },
  openGraph: {
    title: "K Asset Ventures | Selected Malaysian Property Projects",
    description: "Selected Malaysian residential property projects with project context, member documents and risk information for approved members.",
    url: "https://www.kassetventures.com",
    siteName: "K Asset Ventures",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "K Asset Ventures residential property opportunities",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "K Asset Ventures",
    description: "Selected Malaysian residential property projects for approved K Asset Ventures members.",
    images: ["/opengraph-image"],
  },
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
