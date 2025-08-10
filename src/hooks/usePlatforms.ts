// hooks/usePlatforms.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import { UMSService } from '../services/UMSService';

export type Platforms = {
    teacherApp: boolean;
    studentApp: boolean;
    desktopOffices: string[];
};

export interface UsePlatformsReturn {
    platforms: Platforms | null;
    loading: boolean;
    error: string | null;
    refreshPlatforms: () => Promise<void>;
    updatePlatforms: (p: Platforms) => Promise<void>;
    setPlatforms: (p: Platforms) => void; // exposed for local overrides if needed
}

export const usePlatforms = (): UsePlatformsReturn => {
    const [platforms, setPlatforms] = useState<Platforms | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const mountedRef = useRef(false);
    useEffect(() => {
        mountedRef.current = true;
        return () => { mountedRef.current = false; };
    }, []);

    const showError = useCallback((message: string) => {
        if (!mountedRef.current) return;
        setError(message);
        const t = setTimeout(() => mountedRef.current && setError(null), 5000);
        return () => clearTimeout(t);
    }, []);

    const withLoading = useCallback(async <T,>(fn: () => Promise<T>): Promise<T> => {
        if (mountedRef.current) setLoading(true);
        try {
            return await fn();
        } finally {
            if (mountedRef.current) setLoading(false);
        }
    }, []);

    const refreshPlatforms = useCallback(async () => {
        await withLoading(async () => {
            try {
                const data = await UMSService.getPlatforms(); // { teacherApp, studentApp, desktopOffices }
                if (!mountedRef.current) return;            // safe guard
                setPlatforms({
                    teacherApp: !!data.teacherApp,
                    studentApp: !!data.studentApp,
                    desktopOffices: Array.isArray(data.desktopOffices) ? data.desktopOffices : [],
                });
            } catch (e) {
                if (mountedRef.current) {
                    showError(e instanceof Error ? e.message : 'Failed to load platforms');
                }
            }
        });
    }, [showError, withLoading]);


    const updatePlatforms = useCallback(async (p: Platforms) => {
        // optimistic update with rollback
        const prev = platforms;
        if (mountedRef.current) setPlatforms(p);

        try {
            await withLoading(async () => {
                const saved = await UMSService.updatePlatforms(p); // backend returns normalized object
                if (!mountedRef.current) return;
                setPlatforms({
                    teacherApp: !!saved.teacherApp,
                    studentApp: !!saved.studentApp,
                    desktopOffices: Array.isArray(saved.desktopOffices) ? saved.desktopOffices : [],
                });
            });
        } catch (e) {
            if (mountedRef.current) setPlatforms(prev ?? null);
            showError(e instanceof Error ? e.message : 'Failed to update platforms');
            throw e; // let UI show toast if desired
        }
    }, [platforms, showError, withLoading]);

    return {
        platforms,
        loading,
        error,
        refreshPlatforms,
        updatePlatforms,
        setPlatforms,
    };
};
