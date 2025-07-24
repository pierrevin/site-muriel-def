
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { unstable_noStore as noStore } from 'next/cache';

const contentFilePath = path.join(process.cwd(), 'src', 'data', 'content.json');

/**
 * Reads the content from the local content.json file.
 * This is the single source of truth for the site's content.
 */
export async function getContent() {
  // Ensures that the content is always read fresh on each request.
  noStore();

  try {
    const fileContent = await fs.readFile(contentFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("CRITICAL: Could not read content file.", error);
    // Fallback to an empty object to avoid crashing the site.
    return {};
  }
}
