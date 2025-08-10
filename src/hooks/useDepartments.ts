import { useState, useCallback, useRef, useEffect } from 'react';
import { Department, CreateDepartmentDto, UpdateDepartmentDto } from '../types/department.types';
import { DepartmentService } from '../services/DepartmentService';

export interface UseDepartmentsReturn {
    departments: Department[];
    loading: boolean;
    error: string | null;
    onAddDepartment: (department: CreateDepartmentDto) => Promise<void>;
    onEditDepartment: (index: number, department: UpdateDepartmentDto) => Promise<void>;
    onDeleteDepartment: (index: number) => Promise<void>;
    refreshDepartments: () => Promise<void>;
    setDepartments: (departments: Department[]) => void;
}

export const useDepartments = (): UseDepartmentsReturn => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // keep latest state without re-subscribing callbacks
    const depsRef = useRef(departments);
    depsRef.current = departments;

    // avoid setting state after unmount
    const mountedRef = useRef(true);
    useEffect(() => {
        return () => {
            mountedRef.current = false;
        };
    }, []);

    // auto-clear error with cleanup
    const showError = useCallback((message: string) => {
        if (!mountedRef.current) return;
        setError(message);
        const t = setTimeout(() => {
            if (mountedRef.current) setError(null);
        }, 5000);
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

    const refreshDepartments = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            console.log("Fetching departments...");
            const fetched = await DepartmentService.getDepartments();
            setDepartments(Array.isArray(fetched) ? fetched : fetched ? [fetched] : []);
            console.log("Departments fetched:", fetched);
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Failed to refresh departments';
            showError(msg);
        } finally {
            setLoading(false);
            console.log("Departments fetched:", depsRef.current);
        }
    }, [showError]);

    const onAddDepartment = useCallback(async (dto: CreateDepartmentDto) => {
        await withLoading(async () => {
            try {
                const created = await DepartmentService.createDepartment(dto);
                if (!mountedRef.current) return;
                setDepartments(prev => [...prev, created]);
                refreshDepartments(); // refresh to ensure latest data
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to create department';
                showError(message);
                throw err;
            }
        });
    }, [refreshDepartments, showError, withLoading]);

    const onEditDepartment = useCallback(async (index: number, dto: UpdateDepartmentDto) => {
        const current = depsRef.current[index];
        if (!current?._id) {
            showError('Invalid department selected');
            return;
        }

        await withLoading(async () => {
            try {
                const updated = await DepartmentService.updateDepartment(current._id as string, dto);
                if (!mountedRef.current) return;
                setDepartments(prev => {
                    if (!prev[index]) return prev; // index may be stale
                    const next = prev.slice();
                    next[index] = updated;
                    return next;
                });
                refreshDepartments(); // refresh to ensure latest data
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to update department';
                showError(message);
                throw err;
            }
        });
    }, [refreshDepartments, showError, withLoading]);

    const onDeleteDepartment = useCallback(async (index: number) => {
        const current = depsRef.current[index];
        if (!current?._id) {
            showError('Invalid department selected');
            return;
        }

        await withLoading(async () => {
            try {
                await DepartmentService.deleteDepartment(current._id as string);
                if (!mountedRef.current) return;
                setDepartments(prev => prev.filter((_, i) => i !== index));
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to delete department';
                showError(message);
                throw err;
            }
        });
    }, [showError, withLoading]);

    return {
        departments,
        loading,
        error,
        onAddDepartment,
        onEditDepartment,
        onDeleteDepartment,
        refreshDepartments,
        setDepartments,
    };
};
