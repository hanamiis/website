import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MACAN OMPONG PRODUCTION | Spesialis Produksi Kreatif & Pameran",
  description:
    "MACAN OMPONG PRODUCTION (MOP) adalah perusahaan produksi kreatif profesional di Tangerang Selatan yang mengkhususkan diri pada desain pameran, solusi interior, produksi event, pengembangan studio, dan pembuatan konten digital.",
  keywords: [
    "Desain Pameran Tangerang Selatan",
    "Event Organizer Tangerang Selatan",
    "Desain Interior Banten",
    "Studio YouTube Tangerang Selatan",
    "Produksi Kreatif Indonesia",
    "Macan Ompong Production",
  ],
  openGraph: {
    title: "MACAN OMPONG PRODUCTION | Spesialis Produksi Kreatif & Pameran",
    description:
      "Produksi kreatif premium, desain pameran, solusi interior, dan konten digital yang dirancang di Tangerang Selatan.",
    type: "website",
    locale: "id_ID",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${inter.className} min-h-full bg-[#050505] text-white`}>{children}</body>
    </html>
  );
}
