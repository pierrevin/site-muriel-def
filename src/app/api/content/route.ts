
'use server';

import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { promises as fs } from 'fs';
import path from 'path';

// Le chemin vers le fichier de contenu local.
const CONTENT_FILE = 'src/data/content.json';

/**
 * POST: Sauvegarde le nouveau contenu dans le fichier JSON local.
 * NOTE : Dans cette version, l'authentification a été retirée pour assurer la stabilité.
 * L'accès à la page /admin reste le principal mécanisme de protection.
 */
export async function POST(request: Request) {
  try {
    const content = await request.json();
    const filePath = path.join(process.cwd(), CONTENT_FILE);
    
    // Écrit les nouvelles données dans le fichier JSON, en formatant pour la lisibilité.
    await fs.writeFile(filePath, JSON.stringify(content, null, 2), 'utf-8');
    
    // Invalide le cache de la page d'accueil et de la page admin
    // pour forcer Next.js à les reconstruire avec les nouvelles données.
    revalidatePath('/');
    revalidatePath('/admin');
    
    // Retourne une réponse de succès.
    return NextResponse.json({ success: true, message: "Contenu sauvegardé avec succès !" });

  } catch (error) {
    // En cas d'erreur (ex: problème de permissions sur le fichier), on logue l'erreur
    // et on retourne une réponse d'erreur 500.
    console.error(`Échec de l'écriture dans le fichier ${CONTENT_FILE}:`, error);
    return new NextResponse(
      JSON.stringify({ success: false, message: "Échec de la sauvegarde du contenu dans le fichier." }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * GET: Méthode non utilisée pour cette route.
 */
export async function GET() {
    return new NextResponse(
        JSON.stringify({ message: "Méthode non autorisée" }),
        { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
}
