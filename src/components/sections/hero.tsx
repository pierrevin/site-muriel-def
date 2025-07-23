
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowDown } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';

const HeroSection = ({ content, generalContent }: { content: any, generalContent: any }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isClient) {
      return (
      <section id="home" className="relative h-screen min-h-[700px] w-full flex items-center justify-center text-center">
        <Skeleton className="absolute inset-0" />
      </section>
    );
  }

  if (!content) {
    return (
      <section id="home" className="relative h-screen min-h-[700px] w-full flex items-center justify-center text-center">
        <Skeleton className="absolute inset-0" />
        <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
            <Skeleton className="w-3/4 h-24 max-w-4xl rounded-md" />
            <Skeleton className="w-1/2 h-8 mt-6 max-w-lg rounded-md" />
            <Skeleton className="w-48 h-12 mt-8 rounded-full" />
        </div>
      </section>
    );
  }

  return (
    <section id="home" className="relative h-screen min-h-[700px] w-full flex items-center justify-center text-center text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/60 z-10" />
      <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${content.imageUrl})` }}
          aria-label="Atelier de création de Muriel Fauthoux"
          data-ai-hint="artisan workshop"
          role="img"
        />

      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {generalContent?.logoUrl && (
          <div className={cn("relative h-24 w-56 mb-8 drop-shadow-lg transition-opacity duration-300", isScrolled ? 'opacity-0' : 'opacity-100')}>
            <Image
              src={generalContent.logoUrl}
              alt="Logo Les Trucs de Mumu"
              fill
              priority
              sizes="224px"
              className="object-contain"
            />
          </div>
        )}
        <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight drop-shadow-lg">
          {content.title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg md:text-xl text-neutral-200 drop-shadow-md">
          {content.subtitle}
        </p>
        <Button asChild size="lg" className="mt-8 bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300">
          <Link href="#features">
            Explorer mon univers
            <ArrowDown className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
