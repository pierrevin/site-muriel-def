
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db, isFirebaseAdminConfigured } from '@/firebase/firebaseAdmin';

// La collection et le document où le contenu est stocké.
const COLLECTION_NAME = 'content';
const DOCUMENT_ID = 'site';

// GET: Récupère le contenu depuis Firestore.
export async function GET() {
  if (!isFirebaseAdminConfigured || !db) {
    return new NextResponse(
      JSON.stringify({ message: "Le service de base de données n'est pas configuré." }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  try {
    const doc = await db.collection(COLLECTION_NAME).doc(DOCUMENT_ID).get();
    
    if (!doc.exists) {
        return new NextResponse(
            JSON.stringify({ message: "Le document de contenu n'existe pas." }),
            { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
    }
    
    const content = doc.data();
    
    // Empêche la mise en cache de la réponse de l'API.
    const headers = new Headers();
    headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');

    return new NextResponse(JSON.stringify(content), {
      status: 200,
      headers: headers,
    });
    
  } catch (error) {
    console.error("Failed to read from Firestore:", error);
    return new NextResponse(
      JSON.stringify({ message: "Échec de la lecture depuis Firestore." }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// POST: Sauvegarde le contenu dans Firestore.
export async function POST(request: Request) {
    if (!isFirebaseAdminConfigured || !db) {
    return new NextResponse(
      JSON.stringify({ success: false, message: "Le service de base de données n'est pas configuré." }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const content = await request.json();
    const contentDocRef = db.collection(COLLECTION_NAME).doc(DOCUMENT_ID);
    
    await contentDocRef.set(content, { merge: true });
    
    // Invalide le cache de la page d'accueil et de l'admin
    // pour forcer une reconstruction avec les nouvelles données de Firestore.
    revalidatePath('/');
    revalidatePath('/admin');
    
    return NextResponse.json({ success: true, message: "Contenu sauvegardé dans Firestore avec succès !" });
  } catch (error) {
    console.error("Failed to save content to Firestore:", error);
    return new NextResponse(
      JSON.stringify({ success: false, message: "Échec de la sauvegarde dans Firestore." }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
