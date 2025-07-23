
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import HeroSection from '@/components/sections/hero';
import FeaturesSection from '@/components/sections/features';
import AboutSection from '@/components/sections/about';
import CreationsSection from '@/components/sections/creations';
import TestimonialsSection from '@/components/sections/testimonials';
import ContactSection from '@/components/sections/contact';
import { getContent } from '@/lib/content-loader';


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
