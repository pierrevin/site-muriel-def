
'use server';
/**
 * @fileOverview An AI flow for generating content for the "About" section of the website.
 *
 * - generateAboutContent - A function that generates title and paragraphs for the About section.
 * - GenerateAboutInput - The input type for the generateAboutContent function.
 * - GenerateAboutOutput - The return type for the generateAboutContent function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateAboutInputSchema = z.object({
  currentTitle: z.string().describe('The current title of the about section. Can be empty.'),
  currentParagraph1: z.string().describe('The current first paragraph of the about section. Can be empty.'),
  currentParagraph2: z.string().describe('The current second paragraph of the about section. Can be empty.'),
  currentParagraph3: z.string().describe('The current third paragraph of the about section. Can be empty.'),
});
export type GenerateAboutInput = z.infer<typeof GenerateAboutInputSchema>;

const GenerateAboutOutputSchema = z.object({
  title: z.string().describe("Un titre percutant et concis pour la section 'À Propos', mettant en valeur l'identité de Muriel Fauthoux en tant qu'artiste et artisane passionnée."),
  paragraph1: z.string().describe("Un paragraphe d'introduction présentant Muriel Fauthoux, son art (luminaires et sculptures), et sa localisation à Olonzac, dans l'Aude. Il doit transmettre sa passion et l'harmonie qu'elle recherche entre la matière et la lumière."),
  paragraph2: z.string().describe("Un deuxième paragraphe détaillant sa philosophie de travail : son attention portée aux clients particuliers et professionnels, son approche collaborative, et son objectif de créer des œuvres avec une histoire et une âme, qu'elles soient sur mesure ou issues de son catalogue."),
  paragraph3: z.string().describe("Un paragraphe de conclusion sur son attachement aux ressources locales et sa disponibilité à se déplacer dans toute la France pour des projets, soulignant sa flexibilité et son dévouement."),
});
export type GenerateAboutOutput = z.infer<typeof GenerateAboutOutputSchema>;


const aboutGenerationPrompt = ai.definePrompt({
    name: 'aboutGenerationPrompt',
    input: { schema: GenerateAboutInputSchema },
    output: { schema: GenerateAboutOutputSchema },
    prompt: `Vous êtes un rédacteur expert pour le site web d'une artiste. Votre tâche est de générer un nouveau contenu pour la section "À Propos" du site de Muriel Fauthoux, "Les Trucs de Mumu".

**Informations sur l'artiste :**
- **Nom :** Muriel Fauthoux
- **Marque :** Les Trucs de Mumu
- **Artisanat :** Créatrice artisanale de luminaires et sculptures uniques.
- **Lieu :** Olonzac, Aude, France.
- **Philosophie :** Recherche l'harmonie entre la matière et la lumière, créant des pièces avec une histoire et une âme. Travaille avec des particuliers et des entreprises sur des projets personnalisés ou à partir de son catalogue. Valorise les ressources locales mais se déplace dans toute la France pour des projets.

**Contenu actuel (pour contexte, peut être vide) :**
- **Titre actuel :** {{{currentTitle}}}
- **Paragraphe 1 actuel :** {{{currentParagraph1}}}
- **Paragraphe 2 actuel :** {{{currentParagraph2}}}
- **Paragraphe 3 actuel :** {{{currentParagraph3}}}

Veuillez générer un contenu nouveau, convaincant et bien écrit qui reflète son identité et son travail. Le ton doit être professionnel, chaleureux et inspirant. Assurez-vous que le résultat soit en français.
`,
});


export const generateAboutContentFlow = ai.defineFlow(
  {
    name: 'generateAboutContentFlow',
    inputSchema: GenerateAboutInputSchema,
    outputSchema: GenerateAboutOutputSchema,
  },
  async (input) => {
    const { output } = await aboutGenerationPrompt(input);
    return output!;
  }
);


export async function generateAboutContent(input: GenerateAboutInput): Promise<GenerateAboutOutput> {
  return generateAboutContentFlow(input);
}
