
'use server';

import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { promises as fs } from 'fs';
import path from 'path';
import { auth } from '@/firebase/firebaseAdmin';

const CONTENT_FILE = 'src/data/content.json';

// POST: Sauvegarde le contenu dans le fichier JSON local.
export async function POST(request: Request) {
  // 1. Vérification de la disponibilité du service d'authentification
  if (!auth) {
    console.error("Échec de la sauvegarde : le service d'authentification Firebase Admin n'est pas disponible.");
    return new NextResponse(
      JSON.stringify({ success: false, message: "Erreur serveur : le service d'authentification est indisponible." }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 2. Validation du jeton d'authentification de l'utilisateur
  const authorization = request.headers.get('Authorization');
  if (!authorization?.startsWith('Bearer ')) {
    return new NextResponse(JSON.stringify({ success: false, message: 'Non autorisé : Jeton manquant.' }), { status: 401 });
  }
  const idToken = authorization.split('Bearer ')[1];

  try {
    await auth.verifyIdToken(idToken);
  } catch (error) {
    console.error("Échec de la validation du jeton :", error);
    return new NextResponse(JSON.stringify({ success: false, message: 'Non autorisé : Jeton invalide.' }), { status: 403 });
  }

  // 3. Traitement de la sauvegarde dans le fichier
  try {
    const content = await request.json();
    const filePath = path.join(process.cwd(), CONTENT_FILE);
    
    // Écrit les données dans le fichier JSON, en formatant pour la lisibilité.
    await fs.writeFile(filePath, JSON.stringify(content, null, 2), 'utf-8');
    
    // Invalide le cache de la page d'accueil et de l'admin
    // pour forcer une reconstruction avec les nouvelles données.
    revalidatePath('/');
    revalidatePath('/admin');
    
    return NextResponse.json({ success: true, message: "Contenu sauvegardé avec succès !" });

  } catch (error) {
    console.error(`Échec de l'écriture dans le fichier ${CONTENT_FILE}:`, error);
    return new NextResponse(
      JSON.stringify({ success: false, message: "Échec de la sauvegarde du contenu dans le fichier." }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// GET n'est pas nécessaire car le contenu est chargé directement par le serveur.
export async function GET(request: Request) {
    return new NextResponse(
        JSON.stringify({ message: "Méthode non autorisée" }),
        { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
}
