
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import HeroSection from '@/components/sections/hero';
import FeaturesSection from '@/components/sections/features';
import AboutSection from '@/components/sections/about';
import CreationsSection from '@/components/sections/creations';
import TestimonialsSection from '@/components/sections/testimonials';
import ContactSection from '@/components/sections/contact';
import { promises as fs } from 'fs';
import path from 'path';

async function getContent() {
  try {
    const contentPath = path.join(process.cwd(), 'src', 'data', 'content.json');
    const fileContent = await fs.readFile(contentPath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Failed to read content file, returning default structure.", error);
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
