
"use client";

import Image from 'next/image';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import Link from 'next/link';

const AboutSection = ({ content }: { content: any }) => {

  if (!content) {
    return (
        <section id="about" className="bg-muted section-padding">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div className="space-y-6">
                        <Skeleton className="h-12 w-3/4" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-5/6" />
                         <Skeleton className="h-12 w-48 mt-4" />
                    </div>
                    <div className="flex justify-center">
                        <Skeleton className="w-full max-w-md h-96 md:h-[500px] rounded-lg" />
                    </div>
                </div>
            </div>
        </section>
    );
  }
  
  return (
    <section id="about" className="bg-muted section-padding">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-6 text-lg text-muted-foreground/90">
            <h2 className="font-headline text-4xl md:text-5xl font-bold text-foreground">
              {content.title}
            </h2>
            <p className="text-foreground/80">{content.paragraph1}</p>
            <p className="text-foreground/80">{content.paragraph2}</p>
            <p className="text-foreground/80">{content.paragraph3}</p>
            <div className="pt-4">
                <Button asChild size="lg" variant="secondary">
                    <Link href="#contact">Discutons de votre projet</Link>
                </Button>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <div className="relative w-full max-w-md h-96 md:h-[500px] rounded-lg overflow-hidden shadow-2xl shadow-secondary/30 transform rotate-3 transition hover:rotate-0 hover:scale-105 duration-500">
                <Image
                    src={content.imageUrl}
                    alt="Portrait de Muriel Fauthoux, artisan créatrice"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    data-ai-hint="artisan portrait"
                />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
