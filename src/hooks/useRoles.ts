import { useCallback, useEffect, useRef, useState } from 'react';
import { RoleService, RoleDto, Role } from '../services/RoleService';

export interface UseRolesReturn {
    roles: Role[];
    loading: boolean;
    error: string | null;

    page: number;
    limit: number;
    total: number;
    search: string;

    setPage: (p: number) => void;
    setSearch: (q: string) => void;

    refreshRoles: () => Promise<void>;
    createRole: (dto: RoleDto) => Promise<void>;
    updateRole: (id: string, dto: Partial<RoleDto>) => Promise<void>;
    deleteRole: (id: string) => Promise<void>;

    getRolePermissions: (id: string) => Promise<string[]>;
    assignPermissions: (id: string, permissionIds: string[]) => Promise<void>;
}

export const useRoles = (): UseRolesReturn => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');

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

    const withLoading = useCallback(async <T,>(fn: () => Promise<T>): Promise<T> => {
        if (mountedRef.current) setLoading(true);
        try { return await fn(); }
        finally { if (mountedRef.current) setLoading(false); }
    }, []);

    const refreshRoles = useCallback(async () => {
        await withLoading(async () => {
            try {
                const { items, total, page: p } = await RoleService.list({ search, page, limit });
                if (!mountedRef.current) return;
                setRoles(items ?? []);
                setTotal(total ?? 0);
                // server may coerce page; sync to it
                if (typeof p === 'number' && p !== page) setPage(p);
            } catch (e) {
                showError(e instanceof Error ? e.message : 'Failed to load roles');
            }
        });
    }, [search, page, limit, showError, withLoading]);

    const createRole = useCallback(async (dto: RoleDto) => {
        await withLoading(async () => {
            try {
                await RoleService.create(dto);
            } catch (e) {
                showError(e instanceof Error ? e.message : 'Failed to create role');
                throw e;
            }
        });
    }, [showError, withLoading]);

    const updateRole = useCallback(async (id: string, dto: Partial<RoleDto>) => {
        await withLoading(async () => {
            try {
                await RoleService.update(id, dto);
            } catch (e) {
                showError(e instanceof Error ? e.message : 'Failed to update role');
                throw e;
            }
        });
    }, [showError, withLoading]);

    const deleteRole = useCallback(async (id: string) => {
        await withLoading(async () => {
            try {
                await RoleService.remove(id);
            } catch (e) {
                showError(e instanceof Error ? e.message : 'Failed to delete role');
                throw e;
            }
        });
    }, [showError, withLoading]);

    const getRolePermissions = useCallback(async (id: string): Promise<string[]> => {
        try {
            return await RoleService.getPermissions(id);
        } catch (e) {
            showError(e instanceof Error ? e.message : 'Failed to fetch role permissions');
            throw e;
        }
    }, [showError]);

    const assignPermissions = useCallback(async (id: string, permissionIds: string[]) => {
        await withLoading(async () => {
            try {
                await RoleService.assignPermissions(id, permissionIds);
            } catch (e) {
                showError(e instanceof Error ? e.message : 'Failed to assign permissions');
                throw e;
            }
        });
    }, [showError, withLoading]);

    return {
        roles,
        loading,
        error,
        page,
        limit,
        total,
        search,
        setPage,
        setSearch,
        refreshRoles,
        createRole,
        updateRole,
        deleteRole,
        getRolePermissions,
        assignPermissions,
    };
};
