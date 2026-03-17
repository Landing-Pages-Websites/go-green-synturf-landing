import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display"
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: "Go Green Synthetic Turf - Premium Turf Systems",
  description: "Premium synthetic turf systems for dealers, installers, and commercial prospects. HEATMAXX, AQUAMAXX, LAWNMAXX, PETMAXX, SPORTMAXX, PLAYMAXX.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${inter.variable}`}>
      <head>
        {/* MegaTag Configuration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.MEGA_TAG_CONFIG = {
                siteKey: "sk_placeholder",
                pixelId: "984548607190857"
              };
              window.API_ENDPOINT = "https://optimizer.gomega.ai";
              window.TRACKING_API_ENDPOINT = "https://events-api.gomega.ai";
            `,
          }}
        />
        <script src="https://cdn.gomega.ai/scripts/optimizer.min.js" async />
        <Script src="https://572388.tctm.co/t.js" strategy="afterInteractive" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}