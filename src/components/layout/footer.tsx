
"use client";

import { useState, useEffect } from 'react';

const Footer = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-card">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 text-center text-foreground/60">
        <p className="text-sm">
          &copy; {currentYear} Les Trucs de Mumu - Tous droits réservés.
        </p>
        <p className="text-xs mt-1">
          Création artisanale par Muriel Fauthoux à Olonzac, France. (v5 - Forcing refresh)
        </p>
      </div>
    </footer>
  );
};

export default Footer;
