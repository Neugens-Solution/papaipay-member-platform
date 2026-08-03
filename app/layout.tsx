import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  metadataBase: new URL("https://www.kassetventures.com"),
  title: { default: "PAPAIPAY | Kasset Ventures Member Portal", template: "%s | PAPAIPAY" },
  description: "Access PAPAIPAY property participation opportunities, manual verification, payment receipt submission, portfolio updates and distribution records.",
  openGraph: {
    title: "PAPAIPAY | Kasset Ventures Member Portal",
    description: "A clear and secure portal for your property participation journey.",
    url: "https://www.kassetventures.com",
    siteName: "PAPAIPAY",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "PAPAIPAY Member Portal", description: "A clear and secure portal for your property participation journey." },
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
