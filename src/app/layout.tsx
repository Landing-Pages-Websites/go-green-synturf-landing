import type { Metadata } from "next";
import { Montserrat, Syne } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Premium Synthetic Turf Systems | Go Green Synturf",
  description:
    "Purpose-built turf for pets, sports, pools & high-traffic areas. Shop PETMAXX, HEATMAXX, AQUAMAXX & more. Dealer pricing available. Get a free quote today.",
  openGraph: {
    title: "Premium Synthetic Turf Systems | Go Green Synturf",
    description:
      "Purpose-built synthetic turf engineered for every application. PETMAXX, HEATMAXX, AQUAMAXX, and more.",
    images: [
      "https://www.gogreensynturf.com/wp-content/uploads/2022/09/Platinum-Putt-CSmall.jpg",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${syne.variable}`}>
      <head>
        {/* MegaTag config — must be set BEFORE optimizer loads */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.MEGA_TAG_CONFIG={siteKey:"sk_mmv0e66a_pp52arhoujl",pixelId:"984548607190857"};window.API_ENDPOINT="https://optimizer.gomega.ai";window.TRACKING_API_ENDPOINT="https://events-api.gomega.ai";`,
          }}
        />
        <script src="https://cdn.gomega.ai/scripts/optimizer.min.js" data-site-id="5ef1ab2b-a778-4858-bb3d-d1cd9b311360" async />
      </head>
      <body className={`${montserrat.className} antialiased bg-white text-[#32373c]`}>
        {children}
        <Script src="https://572388.tctm.co/t.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
