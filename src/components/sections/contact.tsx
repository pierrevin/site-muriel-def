

import { Phone, MapPin } from 'lucide-react';
import { ContactForm } from '@/components/contact-form';

const ContactSection = ({ content }: { content: any }) => {
  return (
    <section id="contact" className="bg-background section-padding">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-headline text-4xl md:text-5xl font-bold text-foreground">{content.title}</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            {content.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <h3 className="font-headline text-3xl text-secondary">{content.detailsTitle}</h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-secondary/20 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-secondary">Téléphone</h4>
                  <p className="text-foreground/80">Pour un contact plus direct.</p>
                  <a href={`tel:${content.details.phone.replace(/\s/g, '')}`} className="text-accent hover:underline">
                    {content.details.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-secondary/20 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-secondary">Atelier</h4>
                  <p className="text-foreground/80">Visites sur rendez-vous.</p>
                  <p className="text-foreground">
                    {content.details.address}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-card p-8 rounded-2xl shadow-2xl">
            <ContactForm title={content.formTitle} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
