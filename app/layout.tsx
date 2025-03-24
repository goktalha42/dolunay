import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });
const DOMAIN = "ankara.dolunayisitmecihazlari.com"; // Gerçek domain adresi

export const metadata: Metadata = {
  title: "Dolunay İşitme Cihazları Merkezi | Keçiören Ankara",
  description: "Ankara Keçiören'de profesyonel işitme cihazı hizmetleri. Vista işitme cihazları yetkili satıcısı, ücretsiz işitme testi ve bakım hizmetleri.",
  keywords: ["işitme cihazı", "Ankara işitme merkezi", "Keçiören işitme cihazı", "Vista işitme cihazları", "işitme testi"],
  authors: [{ name: "Dolunay İşitme Cihazları Merkezi" }],
  openGraph: {
    title: "Dolunay İşitme Cihazları Merkezi | Keçiören Ankara",
    description: "Ankara Keçiören'de profesyonel işitme cihazı hizmetleri. Ücretsiz işitme testi, Vista işitme cihazları ve bakım hizmetleri.",
    url: `https://${DOMAIN}/`,
    siteName: "Dolunay İşitme Cihazları Merkezi",
    locale: "tr_TR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="scroll-smooth">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <div className="pt-16">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
