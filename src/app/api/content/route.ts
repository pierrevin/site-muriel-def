
import { NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { revalidatePath } from 'next/cache';


const contentPath = join(process.cwd(), 'src', 'data', 'content.json');

export async function GET() {
  try {
    const fileContent = await readFile(contentPath, 'utf-8');
    const content = JSON.parse(fileContent);
    
    const headers = new Headers();
    headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');

    return new NextResponse(JSON.stringify(content), {
      status: 200,
      headers: headers,
    });
    
  } catch (error) {
    console.error("Failed to read content.json:", error);
    return new NextResponse(
      JSON.stringify({ message: "Failed to read content file." }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(request: Request) {
  try {
    const content = await request.json();
    await writeFile(contentPath, JSON.stringify(content, null, 2), 'utf-8');
    
    // Cette instruction est cruciale. Elle dit à Next.js d'invalider le cache
    // de la page d'accueil ('/') et de la page admin pour forcer une reconstruction
    // avec les nouvelles données.
    revalidatePath('/');
    revalidatePath('/admin');
    
    return NextResponse.json({ success: true, message: "Contenu sauvegardé avec succès !" });
  } catch (error) {
    console.error("Failed to save content:", error);
    return new NextResponse(
      JSON.stringify({ success: false, message: "Échec de la sauvegarde du contenu." }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
