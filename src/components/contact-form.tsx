
"use client";

import { useTransition, useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { sendContactForm } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";


interface FormState {
  message: string;
  success: boolean;
}

export function ContactForm({ title }: { title: string }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<FormState | null>(null);
  const formRef = useRef<HTMLFormElement>(null);


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    startTransition(async () => {
        const result = await sendContactForm(null, formData);
        setState(result);

        if (result.success) {
            formRef.current?.reset();
        }
    });
  };

  useEffect(() => {
    if (!state) return;

    if (state.success) {
      toast({
        title: "Succès !",
        description: state.message,
      });
    } else if (state.message) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: state.message,
      });
    }
  }, [state, toast]);
  

  return (
    <>
      <h3 className="font-headline text-3xl text-secondary mb-6">{title}</h3>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nom</Label>
          <Input id="name" name="name" placeholder="Votre nom complet" required minLength={2} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="votre.email@exemple.com" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone (Optionnel)</Label>
          <Input id="phone" name="phone" type="tel" placeholder="Votre numéro de téléphone" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">Sujet</Label>
          <Input id="subject" name="subject" placeholder="Sujet de votre message" required minLength={5} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" name="message" placeholder="Décrivez votre projet ou votre question ici..." className="min-h-[120px]" required minLength={10} />
        </div>
        
         <Button type="submit" className="w-full" variant="secondary" disabled={isPending}>
            {isPending ? "Envoi en cours..." : "Envoyer le message"}
        </Button>

        {state && !state.success && state.message && (
          <p className="text-sm font-medium text-destructive">{state.message}</p>
        )}
      </form>
    </>
  );
}
