import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MINI Electric Türkiye",
  description: "Türkiye'nin en büyük elektrikli MINI topluluğu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}