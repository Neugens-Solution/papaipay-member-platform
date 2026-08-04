import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  metadataBase: new URL("https://www.kassetventures.com"),
  applicationName: "K Asset Ventures",
  title: { default: "K Asset Ventures | Auction Property Participation", template: "%s | K Asset Ventures" },
  description: "Review selected residential auction-property opportunities owned and managed by PICM Sdn Bhd through the K Asset Ventures member portal.",
  openGraph: {
    title: "K Asset Ventures | Selected Auction Property Opportunities",
    description: "A structured property participation platform owned and operated by PICM Sdn Bhd.",
    url: "https://www.kassetventures.com",
    siteName: "K Asset Ventures",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "K Asset Ventures", description: "Selected auction property opportunities, managed from acquisition to exit." },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>{children}</body>
    </html>
  );
}
