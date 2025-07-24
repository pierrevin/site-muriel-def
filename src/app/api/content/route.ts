
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/firebase/firebaseAdmin';
import { getContent } from '@/lib/content-loader';

// Helper pour obtenir la référence au document de manière sécurisée.
const getContentDocRef = () => {
  if (!db) {
    throw new Error("La connexion à Firestore n'est pas disponible.");
  }
  return db.collection('content').doc('site');
};

// GET: Récupère le contenu actuel (utilise la même logique que le site).
export async function GET() {
    try {
        const data = await getContent();
        return NextResponse.json(data, {
            status: 200,
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        });
    } catch (error) {
        console.error("Erreur lors de la récupération du contenu via l'API GET:", error);
        return NextResponse.json({ success: false, message: "Impossible de récupérer le contenu." }, { status: 500 });
    }
}

// POST: Sauvegarde le nouveau contenu dans Firestore.
export async function POST(request: Request) {
  try {
    // 1. Vérifier si la connexion à Firestore est active.
    if (!db) {
      console.error("Échec de la sauvegarde : la connexion à Firestore n'est pas établie.");
      return NextResponse.json(
        { success: false, message: "Le service de base de données est indisponible." },
        { status: 503 } // Service Unavailable
      );
    }
    
    // 2. Obtenir les nouvelles données depuis la requête.
    const content = await request.json();
    
    // 3. Obtenir la référence au document et sauvegarder.
    const contentDocRef = getContentDocRef();
    await contentDocRef.set(content, { merge: true }); // 'merge: true' pour éviter d'écraser des champs si l'objet est partiel.

    // 4. Invalider le cache des pages pour forcer un rechargement des nouvelles données.
    revalidatePath('/');
    revalidatePath('/admin');
    
    console.log("Contenu sauvegardé avec succès sur Firestore.");
    return NextResponse.json({ success: true, message: "Contenu sauvegardé avec succès !" });

  } catch (error) {
    console.error("Échec de la sauvegarde dans Firestore:", error);
    // On fournit une erreur générique au client pour des raisons de sécurité.
    return NextResponse.json(
      { success: false, message: "Échec de la sauvegarde du contenu." },
      { status: 500 }
    );
  }
}
