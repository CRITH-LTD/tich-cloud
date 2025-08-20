import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Department, CreateDepartmentDto, UpdateDepartmentDto } from '../types/department.types';
import { DepartmentService } from '../services/DepartmentService';

type ParentType = 'Faculty' | 'School' | 'CertificationProgram';

type UseDepartmentsOptions =
    | {
        mode: 'scoped';
        parentId: string;
        parentType: ParentType;
        initialFilters?: Partial<FilterOptions>;
    }
    | {
        mode: 'all';
        initialFilters?: Partial<FilterOptions>;
    };

type SortBy = 'name' | 'code' | 'students' | 'rating' | 'established';
type SortOrder = 'asc' | 'desc';

export interface FilterOptions {
    searchQuery?: string;
    filterStatus: 'all' | 'active' | 'inactive';
    ratingRange?: [number, number];
    studentRange?: [number, number];
    establishedDateRange?: [Date, Date];
    sortBy: SortBy;
    sortOrder: SortOrder;
}

const defaultFilters: FilterOptions = {
    filterStatus: 'all',
    sortBy: 'name',
    sortOrder: 'asc',
};

export interface DepartmentStats {
    totalActive: number;
    totalInactive: number;
    totalStudents: number;
    averageStudentsPerDepartment: number;
    averageRating: number;
    topRatedDepartments: Department[];
    largestDepartments: Department[];
    newestDepartments: Department[];
    performanceMetrics: {
        monthlyGrowth: number;
        satisfactionScore: number;
        capacityUtilization: number;
    };
    statusDistribution: Record<string, number>;
    ratingDistribution: Record<number, number>;
}

export interface BulkOperationResult {
    success: boolean;
    processedCount: number;
    errors: string[];
}

export interface UseDepartmentsReturn {
    // core data
    departments: Department[];
    filteredDepartments: Department[];
    loading: boolean;
    error: string | null;
    departmentStats: DepartmentStats | null;

    // core ops
    refreshDepartments: (force?: boolean) => Promise<void>;
    setDepartments: (d: Department[]) => void;
    onAddDepartment: (dto: CreateDepartmentDto) => Promise<void>;
    onEditDepartment: (index: number, dto: UpdateDepartmentDto) => Promise<void>;
    onDeleteDepartment: (index: number) => Promise<void>;

    // bulk ops
    onBulkDelete: (departmentIds: string[]) => Promise<BulkOperationResult>;
    onBulkStatusUpdate: (departmentIds: string[], status: string) => Promise<BulkOperationResult>;
    onBulkExport: (departmentIds?: string[]) => Promise<Blob>;

    // filters
    updateFilters: (newFilters: Partial<FilterOptions>) => void;
    clearFilters: () => void;

    // analytics demo
    getPerformanceTrends: () => Promise<any[]>;
    getDepartmentComparison: (departmentIds: string[]) => Promise<any>;

    // cache mgmt
    invalidateCache: () => void;
    preloadDepartment: (departmentId: string) => Promise<void>;
}

export const useDepartments = (opts: UseDepartmentsOptions): UseDepartmentsReturn => {
    // derive scoped values
    const isScoped = opts.mode === 'scoped';
    const parentId = isScoped ? opts.parentId : undefined;
    const parentType = isScoped ? opts.parentType : undefined;

    // Core state
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [filters, setFilters] = useState<FilterOptions>({
        ...defaultFilters,
        ...(opts.initialFilters ?? {}),
    });

    // Cache
    const [cache, setCache] = useState<Map<string, { data: Department[]; timestamp: number }>>(new Map());
    const [lastFetchTime, setLastFetchTime] = useState<number>(0);
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    // Refs
    const depsRef = useRef(departments);
    depsRef.current = departments;

    const mountedRef = useRef(true);
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
        return () => {
            mountedRef.current = false;
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        };
    }, []);

    // error helper
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

    // cache helpers
    const getCacheKey = useCallback(() => {
        return isScoped ? `${parentType}-${parentId}` : 'ALL_DEPARTMENTS';
    }, [isScoped, parentId, parentType]);

    const isValidCache = useCallback((timestamp: number) => {
        return Date.now() - timestamp < CACHE_DURATION;
    }, []);

    // fetch
    const refreshDepartments = useCallback(
        async (force = false): Promise<void> => {
            if (isScoped && !parentId) return;

            const cacheKey = getCacheKey();

            if (!force) {
                const cached = cache.get(cacheKey);
                if (cached && isValidCache(cached.timestamp)) {
                    setDepartments(cached.data);
                    return;
                }
            } else {
                // invalidate this key
                setCache(prev => {
                    const next = new Map(prev);
                    next.delete(cacheKey);
                    return next;
                });
            }

            setLoading(true);
            setError(null);

            try {
                const fetched = isScoped
                    ? await DepartmentService.findAll(parentId!, parentType!)
                    : await DepartmentService.findAllByUMS(); // your "all" endpoint

                const arr = Array.isArray(fetched) ? fetched : [];
                setDepartments(arr);
                setLastFetchTime(Date.now());

                setCache(prev => {
                    const next = new Map(prev);
                    next.set(cacheKey, { data: arr, timestamp: Date.now() });
                    return next;
                });
            } catch (err) {
                const msg = err instanceof Error ? err.message : 'Failed to refresh departments';
                showError(msg);
            } finally {
                setLoading(false);
            }
        },
        [isScoped, parentId, parentType, cache, getCacheKey, isValidCache, showError]
    );

    // auto fetch on change
    useEffect(() => {
        void refreshDepartments();
    }, [isScoped, parentId, parentType, refreshDepartments]);

    // filtering/sorting
    const filteredDepartments = useMemo(() => {
        let result = [...departments];

        if (filters.searchQuery) {
            const q = filters.searchQuery.toLowerCase();
            result = result.filter(d =>
                d.name.toLowerCase().includes(q) ||
                d.code?.toLowerCase().includes(q) ||
                d.description?.toLowerCase().includes(q) ||
                (d as any).keywords?.some((k: string) => k.toLowerCase().includes(q)) // optional
            );
        }

        if (filters.filterStatus !== 'all') {
            result = result.filter(d => (d as any).status ?? 'active' === filters.filterStatus);
        }

        if (filters.ratingRange) {
            const [min, max] = filters.ratingRange;
            result = result.filter(d => {
                const r = (d as any).rating ?? 0;
                return r >= min && r <= max;
            });
        }

        if (filters.studentRange) {
            const [min, max] = filters.studentRange;
            result = result.filter(d => {
                const s = (d as any).studentCount ?? 0;
                return s >= min && s <= max;
            });
        }

        if (filters.establishedDateRange) {
            const [start, end] = filters.establishedDateRange;
            result = result.filter(d => {
                const dt = (d as any).establishedDate ? new Date((d as any).establishedDate) : null;
                return !!dt && dt >= start && dt <= end;
            });
        }

        result.sort((a, b) => {
            let av: any;
            let bv: any;

            switch (filters.sortBy) {
                case 'name':
                    av = a.name.toLowerCase(); bv = b.name.toLowerCase(); break;
                case 'code':
                    av = a.code?.toLowerCase() ?? ''; bv = b.code?.toLowerCase() ?? ''; break;
                case 'students':
                    av = (a as any).studentCount ?? 0; bv = (b as any).studentCount ?? 0; break;
                case 'rating':
                    av = (a as any).rating ?? 0; bv = (b as any).rating ?? 0; break;
                case 'established':
                    av = (a as any).establishedDate ? new Date((a as any).establishedDate) : new Date(0);
                    bv = (b as any).establishedDate ? new Date((b as any).establishedDate) : new Date(0);
                    break;
                default:
                    av = a.name.toLowerCase(); bv = b.name.toLowerCase();
            }

            if (av < bv) return filters.sortOrder === 'asc' ? -1 : 1;
            if (av > bv) return filters.sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [departments, filters]);

    // stats
    const departmentStats = useMemo<DepartmentStats | null>(() => {
        if (!departments.length) return null;

        const statusOf = (d: Department) => ((d as any).status ?? 'active') as 'active' | 'inactive';

        const totalActive = departments.filter(d => statusOf(d) === 'active').length;
        const totalInactive = departments.length - totalActive;
        const totalStudents = departments.reduce((s, d) => s + ((d as any).studentCount ?? 0), 0);
        const averageStudentsPerDepartment = totalStudents / departments.length;

        const withRatings = departments.filter(d => (d as any).rating && (d as any).rating > 0);
        const averageRating = withRatings.length
            ? withRatings.reduce((s, d) => s + ((d as any).rating ?? 0), 0) / withRatings.length
            : 0;

        const topRatedDepartments = [...departments]
            .filter(d => (d as any).rating && (d as any).rating > 0)
            .sort((a, b) => ((b as any).rating ?? 0) - ((a as any).rating ?? 0))
            .slice(0, 5);

        const largestDepartments = [...departments]
            .filter(d => (d as any).studentCount && (d as any).studentCount > 0)
            .sort((a, b) => ((b as any).studentCount ?? 0) - ((a as any).studentCount ?? 0))
            .slice(0, 5);

        const newestDepartments = [...departments]
            .filter(d => (d as any).establishedDate)
            .sort(
                (a, b) =>
                    new Date((b as any).establishedDate!).getTime() -
                    new Date((a as any).establishedDate!).getTime()
            )
            .slice(0, 5);

        const statusDistribution: Record<string, number> = {};
        const ratingDistribution: Record<number, number> = {};
        departments.forEach(d => {
            const st = statusOf(d);
            statusDistribution[st] = (statusDistribution[st] || 0) + 1;
            const r = (d as any).rating ?? 0;
            if (r) {
                const bucket = Math.floor(r);
                ratingDistribution[bucket] = (ratingDistribution[bucket] || 0) + 1;
            }
        });

        const performanceMetrics = {
            monthlyGrowth: Math.round((Math.random() * 10 - 2) * 100) / 100,
            satisfactionScore: Math.round(averageRating * 20),
            capacityUtilization: Math.round((totalStudents / (departments.length * 200)) * 100),
        };

        return {
            totalActive,
            totalInactive,
            totalStudents,
            averageStudentsPerDepartment: Math.round(averageStudentsPerDepartment),
            averageRating: Math.round(averageRating * 100) / 100,
            topRatedDepartments,
            largestDepartments,
            newestDepartments,
            performanceMetrics,
            statusDistribution,
            ratingDistribution,
        };
    }, [departments]);

    // CRUD (scoped-only)
    const requireScoped = () => {
        if (!isScoped) throw new Error('This operation requires scoped mode (parentId + parentType).');
        if (!parentId || !parentType) throw new Error('Missing parentId or parentType.');
    };

    const onAddDepartment = useCallback(async (dto: CreateDepartmentDto) => {
        requireScoped();

        await withLoading(async () => {
            try {
                const created = await DepartmentService.create(dto, parentId!, parentType!);
                if (!mountedRef.current) return;
                setDepartments(prev => [...prev, created]);

                const cacheKey = getCacheKey();
                setCache(prev => {
                    const next = new Map(prev);
                    next.delete(cacheKey);
                    return next;
                });

                await refreshDepartments();
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to create department';
                showError(message);
                throw err;
            }
        });
    }, [isScoped, parentId, parentType, getCacheKey, refreshDepartments, showError, withLoading]);

    const onEditDepartment = useCallback(async (index: number, dto: UpdateDepartmentDto) => {
        requireScoped();

        const current = depsRef.current[index];
        if (!current?._id) {
            showError('Invalid department selected');
            return;
        }

        await withLoading(async () => {
            try {
                const updated = await DepartmentService.update(current._id, dto, parentId!, parentType!);
                if (!mountedRef.current) return;

                setDepartments(prev => {
                    if (!prev[index]) return prev;
                    const next = prev.slice();
                    next[index] = updated;
                    return next;
                });

                const cacheKey = getCacheKey();
                setCache(prev => {
                    const next = new Map(prev);
                    next.delete(cacheKey);
                    return next;
                });

                await refreshDepartments();
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to update department';
                showError(message);
                throw err;
            }
        });
    }, [isScoped, parentId, parentType, getCacheKey, refreshDepartments, showError, withLoading]);

    const onDeleteDepartment = useCallback(async (index: number) => {
        requireScoped();

        const current = depsRef.current[index];
        if (!current?._id) {
            showError('Invalid department selected');
            return;
        }

        await withLoading(async () => {
            try {
                await DepartmentService.remove(current._id, parentId!, parentType!);
                if (!mountedRef.current) return;

                setDepartments(prev => prev.filter((_, i) => i !== index));

                const cacheKey = getCacheKey();
                setCache(prev => {
                    const next = new Map(prev);
                    next.delete(cacheKey);
                    return next;
                });
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to delete department';
                showError(message);
                throw err;
            }
        });
    }, [isScoped, parentId, parentType, getCacheKey, showError, withLoading]);

    // bulk ops (scoped-only)
    const onBulkDelete = useCallback(async (departmentIds: string[]): Promise<BulkOperationResult> => {
        requireScoped();

        return await withLoading(async () => {
            const results: BulkOperationResult = { success: true, processedCount: 0, errors: [] };

            try {
                const batchSize = 5;
                for (let i = 0; i < departmentIds.length; i += batchSize) {
                    const batch = departmentIds.slice(i, i + batchSize);
                    await Promise.all(
                        batch.map(async id => {
                            try {
                                await DepartmentService.remove(id, parentId!, parentType!);
                                results.processedCount++;
                            } catch (err) {
                                const message = err instanceof Error ? err.message : 'Unknown error';
                                results.errors.push(`Failed to delete department ${id}: ${message}`);
                                results.success = false;
                            }
                        })
                    );
                }

                if (mountedRef.current) {
                    setDepartments(prev => prev.filter(d => !departmentIds.includes(d._id)));
                    const cacheKey = getCacheKey();
                    setCache(prev => {
                        const next = new Map(prev);
                        next.delete(cacheKey);
                        return next;
                    });
                }

                return results;
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Bulk delete operation failed';
                showError(message);
                results.success = false;
                results.errors.push(message);
                return results;
            }
        });
    }, [isScoped, parentId, parentType, getCacheKey, showError, withLoading]);

    const onBulkStatusUpdate = useCallback(async (departmentIds: string[], status: string): Promise<BulkOperationResult> => {
        requireScoped();

        return await withLoading(async () => {
            const results: BulkOperationResult = { success: true, processedCount: 0, errors: [] };

            try {
                const batchSize = 10;
                for (let i = 0; i < departmentIds.length; i += batchSize) {
                    const batch = departmentIds.slice(i, i + batchSize);
                    await Promise.all(
                        batch.map(async id => {
                            try {
                                await DepartmentService.update(id, { status } as any, parentId!, parentType!);
                                results.processedCount++;
                            } catch (err) {
                                const message = err instanceof Error ? err.message : 'Unknown error';
                                results.errors.push(`Failed to update department ${id}: ${message}`);
                                results.success = false;
                            }
                        })
                    );
                }

                if (mountedRef.current) {
                    await refreshDepartments(true);
                }

                return results;
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Bulk status update failed';
                showError(message);
                results.success = false;
                results.errors.push(message);
                return results;
            }
        });
    }, [isScoped, parentId, parentType, refreshDepartments, showError, withLoading]);

    // export
    const onBulkExport = useCallback(async (departmentIds?: string[]): Promise<Blob> => {
        const exportData = departmentIds ? departments.filter(d => departmentIds.includes(d._id)) : departments;

        const headers = ['Name', 'Code', 'Description', 'Status', 'Student Count', 'Rating', 'Established Date'];
        const csv = [
            headers.join(','),
            ...exportData.map(d => [
                `"${d.name}"`,
                `"${d.code ?? ''}"`,
                `"${d.description ?? ''}"`,
                `"${(d as any).status ?? 'active'}"`,
                (d as any).studentCount ?? 0,
                (d as any).rating ?? '',
                (d as any).establishedDate ? new Date((d as any).establishedDate).toLocaleDateString() : '',
            ].join(',')),
        ].join('\n');

        return new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    }, [departments]);

    // filter mgmt
    const updateFilters = useCallback((newFilters: Partial<FilterOptions>) => {
        if (newFilters.searchQuery !== undefined) {
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = setTimeout(() => {
                setFilters(prev => ({ ...prev, ...newFilters }));
            }, 300);
        } else {
            setFilters(prev => ({ ...prev, ...newFilters }));
        }
    }, []);

    const clearFilters = useCallback(() => {
        setFilters(defaultFilters);
    }, []);

    // analytics demos
    const getPerformanceTrends = useCallback(async (): Promise<any[]> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const trends = Array.from({ length: 12 }, (_, i) => ({
                    month: new Date(2024, i).toLocaleDateString('en', { month: 'short' }),
                    enrollments: Math.floor(Math.random() * 1000) + 500,
                    satisfaction: Math.round((Math.random() * 2 + 3) * 10) / 10,
                    retention: Math.round(Math.random() * 20 + 75),
                }));
                resolve(trends);
            }, 500);
        });
    }, []);

    const getDepartmentComparison = useCallback(async (departmentIds: string[]): Promise<any> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const comparison = departmentIds.map(id => {
                    const d = departments.find(x => x._id === id);
                    return {
                        id,
                        name: d?.name ?? 'Unknown',
                        metrics: {
                            students: (d as any)?.studentCount ?? 0,
                            rating: (d as any)?.rating ?? 0,
                            growth: Math.round((Math.random() * 20 - 5) * 100) / 100,
                            efficiency: Math.round(Math.random() * 100),
                        },
                    };
                });
                resolve({ departments: comparison, generatedAt: new Date().toISOString() });
            }, 300);
        });
    }, [departments]);

    // cache mgmt
    const invalidateCache = useCallback(() => {
        setCache(new Map());
        setLastFetchTime(0);
    }, []);

    const preloadDepartment = useCallback(async (departmentId: string): Promise<void> => {
        try {
            // e.g., await DepartmentService.findById(departmentId);
            console.log('Preloading department', departmentId);
        } catch (err) {
            console.warn('Failed to preload department:', err);
        }
    }, []);

    return {
        // data
        departments,
        filteredDepartments,
        loading,
        error,
        departmentStats,

        // core ops
        refreshDepartments,
        setDepartments,

        onAddDepartment,
        onEditDepartment,
        onDeleteDepartment,

        // bulk
        onBulkDelete,
        onBulkStatusUpdate,

        onBulkExport,

        // filters
        updateFilters,
        clearFilters,

        // analytics
        getPerformanceTrends,
        getDepartmentComparison,

        // cache
        invalidateCache,
        preloadDepartment,
    };
};
