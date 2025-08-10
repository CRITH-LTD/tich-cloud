// hooks/usePermissions.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import { PermissionService, Permission, PermissionGroups } from '../services/PermissionService';

export interface UsePermissionsReturn {
  permissions: Permission[];
  grouped: PermissionGroups;
  loading: boolean;
  error: string | null;
  refreshPermissions: (mode?: 'flat' | 'grouped' | 'both') => Promise<void>;
}

export const usePermissionz = (): UsePermissionsReturn => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [grouped, setGrouped] = useState<PermissionGroups>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mountedRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const showError = useCallback((msg: string) => {
    if (!mountedRef.current) return;
    setError(msg);
    const t = setTimeout(() => mountedRef.current && setError(null), 5000);
    return () => clearTimeout(t);
  }, []);

  const refreshPermissions = useCallback(async (mode: 'flat' | 'grouped' | 'both' = 'grouped') => {
    if (mountedRef.current) setLoading(true);
    try {
      if (mode === 'flat' || mode === 'both') {
        const list = await PermissionService.listAll();
        if (mountedRef.current) setPermissions(list);
      }
      if (mode === 'grouped' || mode === 'both') {
        const g = await PermissionService.listGrouped();
        if (mountedRef.current) setGrouped(g);
      }
    } catch (e) {
      showError(e instanceof Error ? e.message : 'Failed to load permissions');
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [showError]);

  return { permissions, grouped, loading, error, refreshPermissions };
};
