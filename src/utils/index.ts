import { CreateStudentDto, UMSForm } from "../interfaces/types";

/**
 * Creates a URL for an image, either from a File object or a string URL.
 * @param fileOrUrl The File object or string URL.
 * @returns A string URL or undefined.
 */
export const getFileUrl = (fileOrUrl: File | string | undefined): string | undefined => {
  if (fileOrUrl instanceof File) {
    return URL.createObjectURL(fileOrUrl);
  }
  if (typeof fileOrUrl === 'string') {
    return fileOrUrl;
  }
  return undefined;
};

export const convertUrlToFile = async (url: string, fileName: string): Promise<File> => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);

    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type });
  } catch (error) {
    console.warn(`Failed to convert URL to file: ${fileName}`, error);
    throw error;
  }
};
export function isCreateStudentDto(obj: any): obj is CreateStudentDto {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.fullName === 'string' &&
    typeof obj.phone === 'string' &&
    typeof obj.level === 'string' &&
    typeof obj.gender === 'string' && 
    typeof obj.program === 'string' &&
    typeof obj.guardian === 'string' &&
    typeof obj.guardianPhone === 'string' &&
    typeof obj.guardianAddress === 'string' &&
    (obj.email === undefined || typeof obj.email === 'string') &&
    (obj.customFields === undefined || 
     (typeof obj.customFields === 'object' && obj.customFields !== null))
  );
}

// Usage:
// if (isCreateStudentDto(dto)) return;
// await onAddStudent(dto);
export const createFormPayload = async (currentData: UMSForm, originalData: any): Promise<FormData | null> => {
  const payload = new FormData();
  let hasChanges = false;

  console.log('=== Payload Creation Debug ===');
  console.log('Current data:', currentData);
  console.log('Original data:', originalData);

  for (const [key, currentValue] of Object.entries(currentData)) {
    if (key === 'id' || key === '_id') continue;

    const originalValue = originalData[key];

    // Special handling for image fields
    if (key === 'umsLogo' || key === 'umsPhoto') {
      console.log(`\n--- Checking ${key} ---`);
      console.log('Current value:', currentValue, typeof currentValue);
      console.log('Original value:', originalValue, typeof originalValue);
      console.log('Original URL field:', originalData[`${key}Url`]);

      // Consider it changed if:
      // 1. Current value is a File object (new upload)
      // 2. Current value is a data: or blob: URL (new upload from file input)
      // 3. String value changed and it's not the same as the original URL
      const isNewFile = currentValue instanceof File;
      const isDataUrl = typeof currentValue === 'string' &&
        (currentValue.startsWith('data:') || currentValue.startsWith('blob:'));
      const originalUrl = originalData[`${key}Url`] || originalData[key] || '';
      const isUrlChanged = typeof currentValue === 'string' &&
        currentValue !== originalUrl &&
        currentValue !== '' && // Don't treat empty string as change
        !currentValue.startsWith('data:') &&
        !currentValue.startsWith('blob:');

      const hasImageChanged = isNewFile || isDataUrl || isUrlChanged;

      console.log('Is new file:', isNewFile);
      console.log('Is data URL:', isDataUrl);
      console.log('Is URL changed:', isUrlChanged);
      console.log('Has image changed:', hasImageChanged);

      if (hasImageChanged) {
        hasChanges = true;

        if (isNewFile) {
          console.log(`Adding file for ${key}`);
          payload.append(key, currentValue);
        } else if (isDataUrl) {
          console.log(`Converting data URL to file for ${key}`);
          try {
            const fileName = key === 'umsLogo' ? 'ums-logo.png' : 'ums-photo.png';
            const file = await convertUrlToFile(currentValue, fileName);
            payload.append(key, file);
          } catch (error) {
            console.warn(`Failed to convert ${key} to file:`, error);
            payload.append(key, currentValue);
          }
        } else {
          console.log(`Adding URL string for ${key}`);
          payload.append(key, currentValue);
        }
      } else {
        console.log(`No change detected for ${key}, skipping`);
      }
      continue;
    }

    // General logic for other fields
    const hasChanged = currentValue instanceof File ||
      (typeof currentValue !== 'object' && currentValue !== originalValue) ||
      (typeof currentValue === 'object' && JSON.stringify(currentValue) !== JSON.stringify(originalValue));

    if (hasChanged) {
      console.log(`Field ${key} changed:`, originalValue, '->', currentValue);
      hasChanges = true;

      if (currentValue instanceof File) {
        payload.append(key, currentValue);
      } else if (typeof currentValue === 'object') {
        payload.append(key, JSON.stringify(currentValue));
      } else {
        payload.append(key, String(currentValue));
      }
    }
  }

  console.log('Has any changes:', hasChanges);
  console.log('=== End Debug ===\n');

  return hasChanges ? payload : null;
};

export const fmtDate = (iso?: string) => (iso ? new Date(iso).toLocaleDateString() : '—');
export const fmtPhone = (phone: string) => {
  // Format Cameroon phone numbers nicely
  if (phone.startsWith('+237')) {
    const num = phone.slice(4);
    return `+237 ${num.slice(0, 3)} ${num.slice(3, 5)} ${num.slice(5)}`;
  }
  return phone;
};

// Put these above your component (or in a utils file)
const STOP_WORDS = new Set([
  'of', 'and', 'for', 'to', 'the', 'in', 'on', 'at', 'by', 'with',
  'dept', 'department', 'school', 'faculty', 'center', 'centre', 'institute', 'studies', 'program', 'programme'
]);

const COMMON_ABBREVIATIONS: Record<string, string> = {
  'computer science': 'CS',
  'information technology': 'IT',
  'electrical and electronic engineering': 'EEE',
  'electrical and electronics engineering': 'EEE',
  'electrical engineering': 'EE',
  'mechanical engineering': 'ME',
  'civil engineering': 'CE',
  'chemical engineering': 'ChE',
  'business administration': 'BA',
  'business management': 'BM',
  'public administration': 'PA',
  'accountancy': 'ACC',
  'accounting': 'ACC',
  'economics': 'ECO',
  'mathematics': 'MTH',
  'statistics': 'STA',
  'physics': 'PHY',
  'chemistry': 'CHE',
  'biology': 'BIO',
  'biochemistry': 'BCH',
  'microbiology': 'MIC',
  'philosophy': 'PHI',
  'sociology': 'SOC',
  'psychology': 'PSY',
  'law': 'LAW',
  'medicine': 'MED',
};

const lettersOnly = (s: string) => s.replace(/[^A-Za-z]/g, '').toUpperCase();

const tokenize = (name: string): string[] => {
  const normalized = name
    .replace(/&/g, ' and ')
    .replace(/[-_/.,]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
  return normalized.split(' ').filter(Boolean);
};

const significantWords = (name: string): string[] =>
  tokenize(name).filter(w => !STOP_WORDS.has(w));

const initialsFromWords = (words: string[], len: number): string => {
  // first pass: first letters of up to len significant words
  let acc = words.map(w => w[0] ?? '').join('');
  acc = lettersOnly(acc).slice(0, len);

  if (acc.length === len) return acc;

  // second pass: pull extra letters from the first word, preferring consonants
  const first = (words[0] ?? '').replace(/[^a-z]/g, '');
  const consonants = first.replace(/[aeiou]/g, '');
  const vowels = first.replace(/[^aeiou]/g, '');

  for (const pool of [consonants.slice(1), vowels]) {
    for (const ch of pool) {
      if (acc.length >= len) break;
      if (!acc.includes(ch.toUpperCase())) acc += ch.toUpperCase();
    }
    if (acc.length >= len) break;
  }
  return acc.padEnd(len, 'X'); // hard fallback to preserve length
};

const singleWordCode = (word: string, len: number): string => {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  const cons = w.replace(/[aeiou]/g, '');
  const vows = w.replace(/[^aeiou]/g, '');
  let out = lettersOnly((cons + vows).slice(0, len));
  if (out.length < len) out = lettersOnly(w).padEnd(len, 'X');
  return out;
};

const avoidCollision = (base: string, len: number, existing?: Set<string>): string => {
  if (!existing || !existing.size) return base;
  if (!existing.has(base)) return base;
  // simple suffix chooser A..Z that keeps total length = len
  for (let i = 0; i < 26; i++) {
    const candidate = (base.slice(0, len - 1) + String.fromCharCode(65 + i)).toUpperCase();
    if (!existing.has(candidate)) return candidate;
  }
  // extreme fallback: rotate letters
  for (let i = 0; i < len; i++) {
    const candidate = (base.slice(i) + base.slice(0, i)).toUpperCase();
    if (!existing.has(candidate)) return candidate;
  }
  return base; // give up
};

/**
 * Smart code generator
 */
export const generateCode = (
  name: string,
  len: number,
  existingCodes?: string[]
): string => {
  const L = Math.max(2, Math.min(4, len | 0));
  const cleaned = (name || '').trim();
  if (!cleaned) return ''.padEnd(L, 'X');

  // 1) Common abbreviations exact match
  const phrase = tokenize(cleaned).join(' ');
  const common = COMMON_ABBREVIATIONS[phrase];
  if (common) {
    const code = lettersOnly(common).slice(0, L).padEnd(L, 'X');
    return avoidCollision(code, L, existingCodes ? new Set(existingCodes) : undefined);
  }

  // 2) Use significant words
  const words = significantWords(cleaned);
  let code: string;

  if (words.length === 0) {
    code = lettersOnly(cleaned).slice(0, L).padEnd(L, 'X');
  } else if (words.length === 1) {
    code = singleWordCode(words[0], L);
  } else {
    code = initialsFromWords(words, L);
  }

  return avoidCollision(code, L, existingCodes ? new Set(existingCodes) : undefined);
};
