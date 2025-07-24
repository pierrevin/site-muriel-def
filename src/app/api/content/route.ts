
'use server';

import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { promises as fs } from 'fs';
import path from 'path';
import { auth } from '@/firebase/firebaseAdmin';

const contentFilePath = path.join(process.cwd(), 'src', 'data', 'content.json');

// POST: Sauvegarde le nouveau contenu dans le fichier local content.json.
export async function POST(request: Request) {
  // 1. Vérifier l'authentification de l'utilisateur (on garde cette sécurité).
  try {
    const authorizationHeader = request.headers.get('Authorization');
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Non autorisé : jeton manquant.' }, { status: 401 });
    }
    const idToken = authorizationHeader.split('Bearer ')[1];
    
    // Si l'authentification Firebase Admin n'est pas initialisée, on ne peut pas valider.
    if (!auth) {
        console.error("Échec de la sauvegarde : Firebase Auth n'est pas initialisé côté serveur.");
        return NextResponse.json({ success: false, message: "Erreur serveur : le service d'authentification est indisponible." }, { status: 500 });
    }
    
    await auth.verifyIdToken(idToken);
    
  } catch (error) {
    console.error("Échec de la validation du jeton :", error);
    return NextResponse.json({ success: false, message: 'Non autorisé : jeton invalide.' }, { status: 403 });
  }

  // 2. Procéder à la sauvegarde dans le fichier local si l'authentification est réussie.
  try {
    const content = await request.json();
    const contentString = JSON.stringify(content, null, 2); // Le 2 et null servent à joli-imprimer le JSON
    
    // Écrit le contenu dans le fichier local.
    await fs.writeFile(contentFilePath, contentString, 'utf-8');

    // Invalide le cache des pages pour forcer un rechargement des nouvelles données.
    revalidatePath('/');
    revalidatePath('/admin');
    
    return NextResponse.json({ success: true, message: "Contenu sauvegardé avec succès !" });

  } catch (error) {
    console.error("Échec de la sauvegarde dans le fichier content.json:", error);
    return NextResponse.json(
      { success: false, message: "Échec de la sauvegarde du contenu dans le fichier." },
      { status: 500 }
    );
  }
}
