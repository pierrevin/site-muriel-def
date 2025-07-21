
"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';
import { useAuth } from '@/context/auth-context';

const navLinks = [
  { href: '#about', label: 'À propos' },
  { href: '#creations', label: 'Créations' },
  { href: '#testimonials', label: 'Témoignages' },
  { href: '#contact', label: 'Contact' },
];

const Header = ({ generalContent }: { generalContent: any }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setIsClient(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isClient) {
    return <header className="sticky top-0 z-50 w-full h-16 bg-transparent" />;
  }
  
  const adminHref = user ? '/admin' : '/login';

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      isScrolled ? "bg-background/80 backdrop-blur border-b border-border/40" : "bg-transparent"
    )}>
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2 transition-opacity duration-300" aria-label="Accueil - Les Trucs de Mumu">
          {generalContent?.logoUrl ? (
            <div className={cn("relative h-10 w-32 transition-opacity duration-300", isScrolled ? "opacity-100" : "opacity-0")}>
              <Image
                src={generalContent.logoUrl}
                alt="Logo Les Trucs de Mumu"
                fill
                sizes="128px"
                className="object-contain"
              />
            </div>
          ) : (
             <span className="font-headline text-2xl font-bold text-secondary">Les Trucs de Mumu</span>
          )}
        </Link>
        
        <div className="flex items-center space-x-2">
            <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary">
                {link.label}
                </Link>
            ))}
              <Button variant="ghost" size="icon" asChild>
                <Link href={adminHref} aria-label={user ? "Espace administration" : "Connexion"}>
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            </nav>

            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Ouvrir le menu</span>
                    </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[240px] bg-card">
                        <SheetHeader>
                            <SheetTitle className="font-headline text-2xl text-secondary text-left">Les Trucs de Mumu</SheetTitle>
                            <SheetDescription className="sr-only">Menu principal de navigation du site Les Trucs de Mumu.</SheetDescription>
                        </SheetHeader>
                        <nav className="flex flex-col space-y-2 mt-8">
                        {navLinks.map((link) => (
                            <SheetClose key={link.href} asChild>
                            <Link href={link.href} className="px-4 py-2 text-foreground/80 transition-colors hover:text-primary hover:bg-primary/10 rounded-md">
                                {link.label}
                            </Link>
                            </SheetClose>
                        ))}
                        <Separator className="my-2"/>
                        <SheetClose asChild>
                            <Link href={adminHref} className="flex items-center px-4 py-2 text-foreground/80 transition-colors hover:text-primary hover:bg-primary/10 rounded-md">
                            <User className="mr-2 h-4 w-4" />
                            {user ? 'Admin' : 'Connexion'}
                            </Link>
                        </SheetClose>
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
