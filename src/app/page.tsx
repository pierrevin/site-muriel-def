
'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import HeroSection from '@/components/sections/hero';
import FeaturesSection from '@/components/sections/features';
import AboutSection from '@/components/sections/about';
import CreationsSection from '@/components/sections/creations';
import TestimonialsSection from '@/components/sections/testimonials';
import ContactSection from '@/components/sections/contact';
import { Skeleton } from '@/components/ui/skeleton';
import { LoaderCircle } from 'lucide-react';

// Fonction pour charger le contenu depuis l'API
async function getContent() {
  try {
    const res = await fetch('/api/content', { 
      cache: 'no-store' 
    });

    if (!res.ok) {
      console.error(`Failed to fetch content: ${res.statusText}`);
      return null;
    }
    
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch content from API.", error);
    return null;
  }
}

const defaultContent = {
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


export default function Home() {
  const [content, setContent] = useState<any | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      const fetchedContent = await getContent();
      setContent(fetchedContent || defaultContent);
    };

    loadContent();
  }, []);

  if (!content) {
    return (
       <div className="flex flex-col min-h-screen bg-background">
          <Header generalContent={defaultContent.general} />
          <main className="flex-1 flex items-center justify-center">
             <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
          </main>
          <Footer />
       </div>
    );
  }

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
