
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Playfair_Display, PT_Sans } from 'next/font/google';
import { AuthProvider } from '@/context/auth-context';

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

// Pas besoin de générer des métadonnées dynamiques pour le layout, 
// on va le faire sur la page.
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

  const logoUrl = "https://firebasestorage.googleapis.com/v0/b/les-trucs-de-mumu-g9rzm.firebasestorage.app/o/uploads%2FJmt1vFlq3UeVzjvpiTwBJ56dWu93%2F1752737122228-Logo_LTDM_V2%20jaune.png?alt=media&token=52cf14b4-f786-4f90-a790-39458b13f8ff";

  return (
    <html lang="fr" className={`${playfair.variable} ${pt_sans.variable}`}>
      <head>
        <link rel="icon" href={logoUrl} type="image/png" />
        <link rel="shortcut icon" href={logoUrl} type="image/png" />
        <link rel="apple-touch-icon" href={logoUrl} />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning={true}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
