
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import HeroSection from '@/components/sections/hero';
import FeaturesSection from '@/components/sections/features';
import AboutSection from '@/components/sections/about';
import CreationsSection from '@/components/sections/creations';
import TestimonialsSection from '@/components/sections/testimonials';
import ContactSection from '@/components/sections/contact';
import { join } from 'path';

// Utilise maintenant un appel fetch pour s'assurer que les données sont toujours fraîches.
async function getContent() {
  try {
    // On utilise une URL absolue pour le fetch côté serveur
    const apiUrl = process.env.NODE_ENV === 'production'
      ? 'https://www.lestrucsdemumu.fr/api/content' // Remplacez par votre URL de production
      : 'http://localhost:3000/api/content';

    const res = await fetch(`${apiUrl}`, { cache: 'no-store' });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch content: ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error("Failed to fetch content, returning default structure.", error);
    // Retourne une structure par défaut si le fichier n'est pas trouvé ou invalide.
    return {
      general: { logoUrl: '' },
      hero: { title: 'Les Trucs de Mumu', subtitle: 'Créations artisanales', imageUrl: 'https://placehold.co/1920x1080.png' },
      features: { title: 'Mes engagements', subtitle: 'La promesse d\'un art authentique', items: Array(3).fill({ title: 'Titre', description: 'Description' }) },
      about: { title: 'À propos', paragraph1: '', paragraph2: '', paragraph3: '', imageUrl: 'https://placehold.co/800x1000.png' },
      creations: { title: 'Mes créations', subtitle: 'Un aperçu de mon univers', categories: [], items: [] },
      testimonials: { title: 'Témoignages', items: [] },
      contact: { 
        title: 'Parlons de votre projet', 
        subtitle: 'Une question, une idée ? Contactez-moi.',
        detailsTitle: 'Mes coordonnées',
        formTitle: 'Formulaire de contact',
        details: { phone: '', address: '' }
      },
    };
  }
}


// La page d'accueil est maintenant un composant serveur asynchrone.
export default async function Home() {
  const content = await getContent();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header generalContent={content.general} />
      <main className="flex-1">
        <HeroSection content={content.hero} generalContent={content.general} />
        <FeaturesSection content={content.features} />
        <AboutSection content={content.about} />
        <CreationsSection content={content.creations} />
        <TestimonialsSection content={content.testimonials} />
        <ContactSection content={content.contact} />
      </main>
      <Footer />
    </div>
  );
}
