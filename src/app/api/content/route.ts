import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

const contentFilePath = path.join(process.cwd(), 'src', 'data', 'content.json');

// GET: Récupère le contenu actuel du fichier JSON.
export async function GET() {
    try {
        const fileContent = await fs.readFile(contentFilePath, 'utf-8');
        const data = JSON.parse(fileContent);
        return NextResponse.json(data, {
             headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        });
    } catch (error) {
        console.error("Erreur lors de la lecture de content.json:", error);
        return NextResponse.json({ success: false, message: "Impossible de lire le fichier de contenu." }, { status: 500 });
    }
}

// POST: Sauvegarde le nouveau contenu dans le fichier JSON.
export async function POST(request: Request) {
  try {
    const content = await request.json();
    
    // Écrit le contenu formaté dans le fichier pour une meilleure lisibilité.
    await fs.writeFile(contentFilePath, JSON.stringify(content, null, 2));

    // Invalide le cache des pages pour forcer un rechargement des nouvelles données.
    revalidatePath('/');
    revalidatePath('/admin');
    
    return NextResponse.json({ success: true, message: "Contenu sauvegardé avec succès !" });

  } catch (error) {
    console.error("Échec de la sauvegarde dans content.json:", error);
    return NextResponse.json(
      { success: false, message: "Échec de la sauvegarde du contenu." },
      { status: 500 }
    );
  }
}
