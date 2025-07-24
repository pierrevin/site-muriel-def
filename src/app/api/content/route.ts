
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db, auth } from '@/firebase/firebaseAdmin';

const FIRESTORE_DOC_ID = 'main';
const FIRESTORE_COLLECTION = 'content';

// POST: Sauvegarde le nouveau contenu dans Firestore.
export async function POST(request: Request) {
  // 1. Vérifier si la base de données est connectée.
  if (!db || !auth) {
    console.error("Échec de la sauvegarde : la connexion à Firebase (db ou auth) n'est pas établie.");
    return NextResponse.json({ success: false, message: "Erreur serveur : la base de données est indisponible." }, { status: 500 });
  }

  // 2. Vérifier l'authentification de l'utilisateur.
  try {
    const authorizationHeader = request.headers.get('Authorization');
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Non autorisé : jeton manquant.' }, { status: 401 });
    }
    const idToken = authorizationHeader.split('Bearer ')[1];
    
    // Valider le jeton avec Firebase Admin SDK
    await auth.verifyIdToken(idToken);
    
  } catch (error) {
    console.error("Échec de la validation du jeton :", error);
    return NextResponse.json({ success: false, message: 'Non autorisé : jeton invalide.' }, { status: 403 });
  }

  // 3. Procéder à la sauvegarde si l'authentification est réussie.
  try {
    const content = await request.json();
    
    // Référence au document dans Firestore
    const docRef = db.collection(FIRESTORE_COLLECTION).doc(FIRESTORE_DOC_ID);
    
    // Écrit le contenu dans le document.
    // .set() sans merge va créer le document s'il n'existe pas ou l'écraser complètement,
    // ce qui est le comportement souhaité pour l'éditeur.
    await docRef.set(content);

    // Invalide le cache des pages pour forcer un rechargement des nouvelles données.
    revalidatePath('/');
    revalidatePath('/admin');
    
    return NextResponse.json({ success: true, message: "Contenu sauvegardé avec succès !" });

  } catch (error) {
    console.error("Échec de la sauvegarde dans Firestore:", error);
    return NextResponse.json(
      { success: false, message: "Échec de la sauvegarde du contenu." },
      { status: 500 }
    );
  }
}
