
"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { sendContactForm } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LoaderCircle } from "lucide-react";


const initialState = {
  message: "",
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" variant="secondary" disabled={pending}>
      {pending ? (
        <>
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          Envoi en cours...
        </>
      ) : (
        "Envoyer le message"
      )}
    </Button>
  );
}

export function ContactForm({ title }: { title: string }) {
  const { toast } = useToast();
  const [state, formAction] = useFormState(sendContactForm, initialState);

  useEffect(() => {
    if (!state.message) return;

    if (state.success) {
      toast({
        title: "Succès !",
        description: state.message,
      });
      // Note: Le formulaire ne se réinitialise pas automatiquement avec useFormState,
      // c'est le comportement attendu pour conserver les données en cas d'erreur.
      // Une réinitialisation manuelle pourrait être ajoutée si nécessaire.
    } else {
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
      <form action={formAction} className="space-y-6">
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
        
        <SubmitButton />

      </form>
    </>
  );
}
