import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "PAPAIPAY Member Platform",
  description: "Clean Next.js foundation for the PAPAIPAY Member Platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
