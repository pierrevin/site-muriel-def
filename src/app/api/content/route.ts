
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

// Le chemin vers le fichier de contenu.
// process.cwd() donne le répertoire racine du projet.
const contentFilePath = path.join(process.cwd(), 'src', 'data', 'content.json');

async function getContentData() {
    try {
        const fileContent = await fs.readFile(contentFilePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error("Erreur lors de la lecture du fichier content.json:", error);
        // En cas d'erreur (ex: fichier non trouvé), on retourne null ou une structure vide
        return null;
    }
}

// GET: Récupère le contenu depuis le fichier JSON.
export async function GET() {
    const data = await getContentData();

    if (!data) {
        return new NextResponse(
            JSON.stringify({ message: "Le document de contenu n'a pas été trouvé ou est invalide." }),
            { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
    }
    
    // Ajout de headers pour s'assurer que les données ne sont pas mises en cache par le navigateur
    const headers = new Headers();
    headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');

    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: headers,
    });
}

// POST: Sauvegarde le contenu dans le fichier JSON.
export async function POST(request: Request) {
  try {
    const content = await request.json();
    
    // Écrit les données dans le fichier, en écrasant le contenu existant.
    // JSON.stringify avec null, 2 pour une indentation propre (plus lisible).
    await fs.writeFile(contentFilePath, JSON.stringify(content, null, 2), 'utf-8');
    
    // Invalide le cache de la page d'accueil et de l'admin
    // pour forcer une reconstruction avec les nouvelles données.
    revalidatePath('/');
    revalidatePath('/admin');
    
    return NextResponse.json({ success: true, message: "Contenu sauvegardé avec succès !" });
  } catch (error) {
    console.error("Échec de la sauvegarde dans le fichier content.json:", error);
    return new NextResponse(
      JSON.stringify({ success: false, message: "Échec de la sauvegarde du contenu." }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

