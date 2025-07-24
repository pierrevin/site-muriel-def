
import { db } from '@/firebase/firebaseAdmin';
import { unstable_noStore as noStore } from 'next/cache';
import initialContent from '@/data/content.json';

const FIRESTORE_DOC_ID = 'main';
const FIRESTORE_COLLECTION = 'content';

// Structure par défaut robuste pour éviter les crashs si des champs sont manquants.
const getDefaultContent = () => JSON.parse(JSON.stringify(initialContent));

/**
 * Performs a deep merge of a default object with an override object.
 * This function is crucial for ensuring that the final content object
 * always has a complete and safe structure, even if the data from
* Firestore is partial or incomplete.
 */
function deepMerge(defaults: any, overrides: any) {
  const result: any = { ...defaults };
  for (const key in overrides) {
    if (overrides.hasOwnProperty(key)) {
      // If the property is an object in both, and not an array, recurse
      if (
        typeof result[key] === 'object' && result[key] !== null &&
        typeof overrides[key] === 'object' && overrides[key] !== null &&
        !Array.isArray(result[key]) && !Array.isArray(overrides[key])
      ) {
        result[key] = deepMerge(result[key], overrides[key]);
      } else {
        // Otherwise, the override value takes precedence
        result[key] = overrides[key];
      }
    }
  }
  return result;
}


export async function getContent() {
  noStore();

  const defaults = getDefaultContent();

  if (!db) {
    console.warn("CRITICAL: Firestore connection failed. Returning local file content.");
    return defaults;
  }

  try {
    const docRef = db.collection(FIRESTORE_COLLECTION).doc(FIRESTORE_DOC_ID);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const firestoreData = docSnap.data() || {};
      // Use a deep merge to combine defaults with Firestore data.
      // This ensures that even if a section in Firestore is missing fields,
      // those fields will be filled in from the default content, preventing crashes.
      return deepMerge(defaults, firestoreData);
    } else {
      console.warn(`Document '${FIRESTORE_DOC_ID}' not found in '${FIRESTORE_COLLECTION}'. Returning local file content. The site will function, but will not be editable until the document is created.`);
      return defaults;
    }
  } catch (error) {
    console.error("Critical error accessing Firestore. Returning local file content as a fallback.", error);
    return defaults;
  }
}
