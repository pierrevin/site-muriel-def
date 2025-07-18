
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Playfair_Display, PT_Sans } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const pt_sans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.lestrucsdemumu.fr'),
  title: 'Les Trucs de Mumu - Artisan Créateur',
  description: "Muriel Fauthoux, artisan créatrice de luminaires et sculptures uniques. Basée à Olonzac, Aude. Créations sur mesure et catalogue pour particuliers et entreprises.",
  keywords: "artisan, créateur, luminaires, sculptures, sur mesure, Olonzac, Aude, décoration, design, art, Muriel Fauthoux",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="fr" className={`${playfair.variable} ${pt_sans.variable}`}>
      <head />
      <body className="font-body antialiased" suppressHydrationWarning={true}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
