
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
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { heroImageUrl?: string };
}>) {

  // La prop heroImageUrl est maintenant passée depuis la page.
  // C'est une astuce pour permettre à une page enfant de modifier le <head> du layout parent.
  const { heroImageUrl } = params;

  return (
    <html lang="fr" className={`${playfair.variable} ${pt_sans.variable}`}>
      <head>
        {heroImageUrl && (
          <link
            rel="preload"
            href={heroImageUrl}
            as="image"
            // Les attributs suivants sont des optimisations pour le préchargement
            type="image/webp" 
            fetchPriority="high"
          />
        )}
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
