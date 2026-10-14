/**
 * Utilidades para interactuar con Firebase Firestore de forma segura
 */

// Elimina recursivamente campos undefined para evitar que Firestore rechace addDoc()
export function sanitizeForFirestore<T extends Record<string, any>>(obj: T): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val === undefined) {
      continue;
    }
    if (val && typeof val === 'object' && !Array.isArray(val) && !(val instanceof Date)) {
      result[key] = sanitizeForFirestore(val);
    } else if (Array.isArray(val)) {
      result[key] = val
        .filter((item) => item !== undefined)
        .map((item) => (item && typeof item === 'object' && !(item instanceof Date) ? sanitizeForFirestore(item) : item));
    } else {
      result[key] = val;
    }
  }
  return result;
}
