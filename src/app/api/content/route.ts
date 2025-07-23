
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

// Le chemin vers le fichier JSON, maintenant dans src/data.
const dataFilePath = path.join(process.cwd(), 'src', 'data', 'content.json');

// GET: Récupère le contenu depuis le fichier JSON.
export async function GET() {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    // Empêche la mise en cache de la réponse de l'API.
    // C'est une bonne pratique pour s'assurer que l'admin a toujours les données fraîches.
    const headers = new Headers();
    headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');

    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: headers,
    });
    
  } catch (error) {
    console.error("Failed to read from content.json:", error);
    // Si le fichier n'existe pas, on pourrait renvoyer un objet par défaut.
    // Pour l'instant, on renvoie une erreur 500.
    return new NextResponse(
      JSON.stringify({ message: "Failed to read content file." }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// POST: Sauvegarde le contenu dans le fichier JSON.
export async function POST(request: Request) {
  try {
    const content = await request.json();
    
    // Écrit les données dans le fichier, en formatant le JSON pour la lisibilité.
    await fs.writeFile(dataFilePath, JSON.stringify(content, null, 2));
    
    // Invalide le cache de la page d'accueil et de l'admin
    // pour forcer une reconstruction avec les nouvelles données du fichier.
    revalidatePath('/');
    revalidatePath('/admin');
    
    return NextResponse.json({ success: true, message: "Contenu sauvegardé avec succès !" });
  } catch (error) {
    console.error("Failed to save content to content.json:", error);
    return new NextResponse(
      JSON.stringify({ success: false, message: "Failed to save content." }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
