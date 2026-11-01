import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://alikhsanbeji.ponpes.id"),
  title: "Twibbon Haul Ke-10 KH. Abu Chamid | Ponpes Al Ikhsan Beji",
  description:
    "Website pembuatan Twibbon Haul Ke-10 Almarhum Almaghfurlah K.H. Abu Chamid & Silaturrahim Alumni IMAB 2026 Pondok Pesantren Al Ikhsan Beji Banyumas. Upload, sesuaikan foto, dan bagikan dengan mudah.",
  keywords: [
    "Twibbon Haul Mbah",
    "Haul KH Abu Chamid",
    "Ponpes Al Ikhsan Beji",
    "Alumni IMAB 2026",
    "Twibbon Generator",
  ],
  authors: [{ name: "Pondok Pesantren Al Ikhsan Beji" }],
  openGraph: {
    title: "Twibbon Haul Ke-10 KH. Abu Chamid",
    description: "Buat twibbon Haul Ke-10 KH. Abu Chamid & Silaturrahim Alumni IMAB 2026. Praktis & Kualitas HD.",
    images: ["/twibbon-frame.png"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${sans.variable} ${display.variable} scroll-smooth`}>
      <body className="font-sans antialiased text-stone-900 bg-[#FAF7F2] selection:bg-emerald-900 selection:text-white">
        {children}
      </body>
    </html>
  );
}

