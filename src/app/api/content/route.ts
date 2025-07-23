
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db, isFirebaseAdminConfigured } from '@/firebase/firebaseAdmin';

const contentDocRef = () => {
  if (!isFirebaseAdminConfigured || !db) {
    throw new Error("Le SDK Firebase Admin n'est pas configuré ou la base de données est indisponible.");
  }
  return db.collection('content').doc('site');
}

// GET: Récupère le contenu depuis Firestore.
export async function GET() {
  if (!isFirebaseAdminConfigured || !db) {
    return new NextResponse(
      JSON.stringify({ message: "La configuration du serveur Firebase est manquante ou la base de données est indisponible." }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const doc = await contentDocRef().get();
    
    if (!doc.exists) {
       return new NextResponse(
        JSON.stringify({ message: "Le document de contenu n'a pas été trouvé." }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const data = doc.data();
    
    const headers = new Headers();
    headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');

    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: headers,
    });
    
  } catch (error) {
    console.error("Échec de la lecture depuis Firestore:", error);
    return new NextResponse(
      JSON.stringify({ message: "Échec de la lecture du contenu depuis la base de données." }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// POST: Sauvegarde le contenu dans Firestore.
export async function POST(request: Request) {
   if (!isFirebaseAdminConfigured || !db) {
    return new NextResponse(
      JSON.stringify({ success: false, message: "La configuration du serveur Firebase est manquante ou la base de données est indisponible." }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const content = await request.json();
    
    // Écrit les données dans le document 'site' de la collection 'content'.
    await contentDocRef().set(content, { merge: true });
    
    // Invalide le cache de la page d'accueil et de l'admin
    // pour forcer une reconstruction avec les nouvelles données.
    revalidatePath('/');
    revalidatePath('/admin');
    
    return NextResponse.json({ success: true, message: "Contenu sauvegardé avec succès dans Firestore !" });
  } catch (error) {
    console.error("Échec de la sauvegarde dans Firestore:", error);
    return new NextResponse(
      JSON.stringify({ success: false, message: "Échec de la sauvegarde du contenu." }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
