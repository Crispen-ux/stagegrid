import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-space-grotesk" });

export const metadata: Metadata = {
  title: "STAGEGRID — Event Infrastructure & Production",
  description:
    "STAGEGRID engineers the sound, trussing, staging, lighting, AV and logistics infrastructure behind corporate events, brand activations, conferences and live events in South Africa.",
  openGraph: {
    title: "STAGEGRID — Event Infrastructure & Production",
    description: "Sound. Structure. Staging. Technology. Engineering the infrastructure behind exceptional events.",
    type: "website",
    locale: "en_ZA",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-bg text-text font-sans antialiased">
        <Providers>
          <Nav />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
