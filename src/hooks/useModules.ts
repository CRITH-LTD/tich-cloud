import { useCallback, useRef, useState } from 'react';
import { UMSService } from '../services/UMSService';

export interface UseModulesReturn {
    enabledModules: string[];
    loading: boolean;
    error: string | null;
    refreshModules: () => Promise<void>;
    updateModules: (modules: string[]) => Promise<void>;
}

export const useModules = (): UseModulesReturn => {
    const [enabledModules, setEnabledModules] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const mountedRef = useRef(true);

    const showError = useCallback((msg: string) => {
        if (!mountedRef.current) return;
        setError(msg);
        setTimeout(() => mountedRef.current && setError(null), 4000);
    }, []);

    const refreshModules = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const mods = await UMSService.getModules(); // -> string[]
            setEnabledModules(Array.isArray(mods) ? mods : []);
        } catch (e) {
            showError(e instanceof Error ? e.message : 'Failed to load modules');
        } finally {
            if (mountedRef.current) setLoading(false);
        }
    }, [showError]);

    const updateModules = useCallback(async (modules: string[]) => {
        setLoading(true);
        setError(null);
        try {
            await UMSService.updateModules(modules);
            setEnabledModules(modules);
        } catch (e) {
            showError(e instanceof Error ? e.message : 'Failed to update modules');
            throw e;
        } finally {
            if (mountedRef.current) setLoading(false);
        }
    }, [showError]);

    return { enabledModules, loading, error, refreshModules, updateModules };
};
