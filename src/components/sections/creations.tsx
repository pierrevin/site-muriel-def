
"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Skeleton } from '../ui/skeleton';

const INITIAL_VISIBLE_ITEMS = 6;

const CreationsSection = ({ content }: { content: any }) => {
  const [activeCategory, setActiveCategory] = useState('Tout');
  const [visibleItems, setVisibleItems] = useState(INITIAL_VISIBLE_ITEMS);

  if (!content || !content.items) {
      return (
          <section id="creations" className="section-padding">
              <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-16">
                      <Skeleton className="h-12 w-1/2 mx-auto" />
                      <Skeleton className="h-6 w-3/4 mx-auto mt-4" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                      {Array.from({ length: 6 }).map((_, i) => (
                          <div key={i} className="aspect-[3/4]">
                            <Skeleton key={i} className="h-full w-full rounded-lg" />
                          </div>
                      ))}
                  </div>
              </div>
          </section>
      );
  }

  const allCategories = content.categories && Array.isArray(content.categories) ? content.categories : [];
  const categories = ['Tout', ...allCategories];

  const filteredItems = activeCategory === 'Tout' 
    ? content.items 
    : content.items.filter((item: any) => item.category === activeCategory);

  const showMore = () => {
    setVisibleItems(filteredItems.length);
  };

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    setVisibleItems(INITIAL_VISIBLE_ITEMS);
  };

  return (
    <section id="creations" className="bg-background section-padding">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-headline text-4xl md:text-5xl font-bold">{content.title}</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            {content.subtitle}
          </p>
        </div>

        <div className="flex justify-center flex-wrap gap-2 mb-12">
          {categories.map((category: string) => (
            <Button
              key={category}
              variant={activeCategory === category ? "secondary" : "outline"}
              onClick={() => handleCategoryClick(category)}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {filteredItems.slice(0, visibleItems).map((item: any, index: number) => (
            <Card key={`${item.src}-${index}`} className="group relative overflow-hidden rounded-lg shadow-lg border-none bg-transparent">
              <CardContent className="p-0">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image 
                    src={item.src} 
                    alt={item.title || `Création ${index + 1}`} 
                    fill 
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>
                <div className="absolute bottom-0 left-0 p-6 opacity-0 transform translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                    <h3 className="font-headline text-2xl font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="text-white/80 text-sm mt-1">{item.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length > visibleItems && (
          <div className="text-center mt-12">
            <Button onClick={showMore} variant="outline" size="lg">
              Voir plus de créations
            </Button>
          </div>
        )}
        
        <div className="text-center mt-16 pt-12 border-t border-border">
            <h3 className="font-headline text-3xl text-foreground">Une idée en tête ?</h3>
            <p className="mt-2 text-foreground/80 max-w-xl mx-auto">
              Chaque création est une inspiration. Si l'une d'elles a suscité une idée ou si vous avez un projet entièrement personnalisé, je suis à votre écoute pour le concrétiser.
            </p>
             <Button asChild size="lg" variant="secondary" className="mt-6">
                  <Link href="#contact">Une idée sur-mesure ?</Link>
              </Button>
        </div>
      </div>
    </section>
  );
};

export default CreationsSection;
