
"use client";

import { Gem, HandMetal, PencilRuler } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

const icons = [
  <Gem key="gem" className="h-10 w-10 text-accent" />,
  <HandMetal key="hand" className="h-10 w-10 text-accent" />,
  <PencilRuler key="ruler" className="h-10 w-10 text-accent" />,
];

const FeaturesSection = ({ content }: { content: any }) => {

  if (!content || !content.items) {
    return (
        <section id="features" className="bg-background">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 section-padding">
                <div className="text-center mb-16">
                    <Skeleton className="h-12 w-1/2 mx-auto" />
                    <Skeleton className="h-6 w-3/4 mx-auto mt-4" />
                </div>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    <Skeleton className="h-48 rounded-2xl" />
                    <Skeleton className="h-48 rounded-2xl" />
                    <Skeleton className="h-48 rounded-2xl" />
                </div>
            </div>
        </section>
    );
  }

  return (
    <section id="features" className="bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 section-padding">
        <div className="text-center mb-16">
          <h2 className="font-headline text-4xl md:text-5xl font-bold">
            {content.title}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            {content.subtitle}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {content.items.map((feature: any, index: number) => (
            <div key={index} className="flex flex-col items-center p-8 bg-card rounded-2xl shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20">
              <div className="mb-6 p-4 bg-primary/10 rounded-full">
                {icons[index % icons.length]}
              </div>
              <h3 className="text-xl font-bold font-headline mb-3 text-primary-foreground">
                {feature.title}
              </h3>
              <p className="text-foreground/70">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
