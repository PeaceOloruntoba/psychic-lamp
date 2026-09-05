import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Vozaro Global Resource Ltd. | Light Wey No Dey Fail",
    template: "%s | Vozaro Global Resource Ltd.",
  },
  description:
    "Vozaro Global Resource Limited supplies and installs solar panels, inverters, and batteries across Nigeria, plus electrical, CCTV, and electric fence services. Light wey no dey fail.",
  keywords: [
    "solar installation Nigeria",
    "inverter repair Delta State",
    "Vozaro Global Resource",
    "solar panels Oghara",
    "CCTV installation",
  ],
  openGraph: {
    title: "Vozaro Global Resource Ltd. | Light Wey No Dey Fail",
    description:
      "Solar, inverter, and electrical solutions you can trust — sales, installation, maintenance, and audits.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body>
        {children}
        <Toaster
          theme="dark"
          position="top-center"
          toastOptions={{
            style: {
              background: "#152238",
              border: "1px solid #23324a",
              color: "#e2e8f0",
            },
          }}
        />
      </body>
    </html>
  );
}
