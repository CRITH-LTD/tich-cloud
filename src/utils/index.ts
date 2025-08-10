import { UMSForm } from "../interfaces/types";

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