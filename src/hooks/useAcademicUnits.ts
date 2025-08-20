import { useState, useCallback, useRef, useEffect } from 'react';
import {
    Faculty,
    School,
    CertificationProgram,
    CreateFacultyDto,
    UpdateFacultyDto,
    CreateSchoolDto,
    UpdateSchoolDto,
    CreateCertificationProgramDto,
    UpdateCertificationProgramDto,
} from '../types/academicUnits.types';
import {
    FacultyService,
    SchoolService,
    CertificationProgramService,
} from '../services/AcademicUnitsService';

// Faculty Hook
export interface UseFacultiesReturn {
    faculties: Faculty[];
    loading: boolean;
    error: string | null;
    onAddFaculty: (faculty: CreateFacultyDto) => Promise<void>;
    onEditFaculty: (index: number, faculty: UpdateFacultyDto) => Promise<void>;
    onDeleteFaculty: (index: number) => Promise<void>;
    refreshFaculties: () => Promise<void>;
    setFaculties: (faculties: Faculty[]) => void;
}

export const useFaculties = (): UseFacultiesReturn => {
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const facultiesRef = useRef(faculties);
    facultiesRef.current = faculties;

    const mountedRef = useRef(true);
    useEffect(() => {
        return () => {
            mountedRef.current = false;
        };
    }, []);

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

    const refreshFaculties = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const fetched = await FacultyService.getFaculties();
            setFaculties(Array.isArray(fetched) ? fetched : fetched ? [fetched] : []);
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Failed to refresh faculties';
            showError(msg);
        } finally {
            setLoading(false);
        }
    }, [showError]);

    const onAddFaculty = useCallback(async (dto: CreateFacultyDto) => {
        await withLoading(async () => {
            try {
                const created = await FacultyService.createFaculty(dto);
                if (!mountedRef.current) return;
                setFaculties(prev => [...prev, created]);
                refreshFaculties();
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to create faculty';
                showError(message);
                throw err;
            }
        });
    }, [refreshFaculties, showError, withLoading]);

    const onEditFaculty = useCallback(async (index: number, dto: UpdateFacultyDto) => {
        const current = facultiesRef.current[index];
        if (!current?._id) {
            showError('Invalid faculty selected');
            return;
        }

        await withLoading(async () => {
            try {
                const updated = await FacultyService.updateFaculty(current._id as string, dto);
                if (!mountedRef.current) return;
                setFaculties(prev => {
                    if (!prev[index]) return prev;
                    const next = prev.slice();
                    next[index] = updated;
                    return next;
                });
                refreshFaculties();
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to update faculty';
                showError(message);
                throw err;
            }
        });
    }, [refreshFaculties, showError, withLoading]);

    const onDeleteFaculty = useCallback(async (index: number) => {
        const current = facultiesRef.current[index];
        if (!current?._id) {
            showError('Invalid faculty selected');
            return;
        }

        await withLoading(async () => {
            try {
                await FacultyService.deleteFaculty(current._id as string);
                if (!mountedRef.current) return;
                setFaculties(prev => prev.filter((_, i) => i !== index));
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to delete faculty';
                showError(message);
                throw err;
            }
        });
    }, [showError, withLoading]);

    return {
        faculties,
        loading,
        error,
        onAddFaculty,
        onEditFaculty,
        onDeleteFaculty,
        refreshFaculties,
        setFaculties,
    };
};

// Schools Hook
export interface UseSchoolsReturn {
    schools: School[];
    loading: boolean;
    error: string | null;
    onAddSchool: (school: CreateSchoolDto) => Promise<void>;
    onEditSchool: (index: number, school: UpdateSchoolDto) => Promise<void>;
    onDeleteSchool: (index: number) => Promise<void>;
    refreshSchools: () => Promise<void>;
    setSchools: (schools: School[]) => void;
}

export const useSchools = (): UseSchoolsReturn => {
    const [schools, setSchools] = useState<School[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const schoolsRef = useRef(schools);
    schoolsRef.current = schools;

    const mountedRef = useRef(true);
    useEffect(() => {
        return () => {
            mountedRef.current = false;
        };
    }, []);

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

    const refreshSchools = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const fetched = await SchoolService.getSchools();
            setSchools(Array.isArray(fetched) ? fetched : fetched ? [fetched] : []);
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Failed to refresh schools';
            showError(msg);
        } finally {
            setLoading(false);
        }
    }, [showError]);

    const onAddSchool = useCallback(async (dto: CreateSchoolDto) => {
        await withLoading(async () => {
            try {
                const created = await SchoolService.createSchool(dto);
                if (!mountedRef.current) return;
                setSchools(prev => [...prev, created]);
                refreshSchools();
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to create school';
                showError(message);
                throw err;
            }
        });
    }, [refreshSchools, showError, withLoading]);

    const onEditSchool = useCallback(async (index: number, dto: UpdateSchoolDto) => {
        const current = schoolsRef.current[index];
        if (!current?._id) {
            showError('Invalid school selected');
            return;
        }

        await withLoading(async () => {
            try {
                const updated = await SchoolService.updateSchool(current._id as string, dto);
                if (!mountedRef.current) return;
                setSchools(prev => {
                    if (!prev[index]) return prev;
                    const next = prev.slice();
                    next[index] = updated;
                    return next;
                });
                refreshSchools();
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to update school';
                showError(message);
                throw err;
            }
        });
    }, [refreshSchools, showError, withLoading]);

    const onDeleteSchool = useCallback(async (index: number) => {
        const current = schoolsRef.current[index];
        if (!current?._id) {
            showError('Invalid school selected');
            return;
        }

        await withLoading(async () => {
            try {
                await SchoolService.deleteSchool(current._id as string);
                if (!mountedRef.current) return;
                setSchools(prev => prev.filter((_, i) => i !== index));
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to delete school';
                showError(message);
                throw err;
            }
        });
    }, [showError, withLoading]);

    return {
        schools,
        loading,
        error,
        onAddSchool,
        onEditSchool,
        onDeleteSchool,
        refreshSchools,
        setSchools,
    };
};

// Certification Programs Hook
export interface UseCertificationProgramsReturn {
    certificationPrograms: CertificationProgram[];
    loading: boolean;
    error: string | null;
    onAddCertificationProgram: (program: CreateCertificationProgramDto) => Promise<void>;
    onEditCertificationProgram: (index: number, program: UpdateCertificationProgramDto) => Promise<void>;
    onDeleteCertificationProgram: (index: number) => Promise<void>;
    refreshCertificationPrograms: () => Promise<void>;
    setCertificationPrograms: (programs: CertificationProgram[]) => void;
}

export const useCertificationPrograms = (): UseCertificationProgramsReturn => {
    const [certificationPrograms, setCertificationPrograms] = useState<CertificationProgram[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const programsRef = useRef(certificationPrograms);
    programsRef.current = certificationPrograms;

    const mountedRef = useRef(true);
    useEffect(() => {
        return () => {
            mountedRef.current = false;
        };
    }, []);

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

    const refreshCertificationPrograms = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const fetched = await CertificationProgramService.getCertificationPrograms();
            setCertificationPrograms(Array.isArray(fetched) ? fetched : fetched ? [fetched] : []);
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Failed to refresh certification programs';
            showError(msg);
        } finally {
            setLoading(false);
        }
    }, [showError]);

    const onAddCertificationProgram = useCallback(async (dto: CreateCertificationProgramDto) => {
        await withLoading(async () => {
            try {
                const created = await CertificationProgramService.createCertificationProgram(dto);
                if (!mountedRef.current) return;
                setCertificationPrograms(prev => [...prev, created]);
                refreshCertificationPrograms();
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to create certification program';
                showError(message);
                throw err;
            }
        });
    }, [refreshCertificationPrograms, showError, withLoading]);

    const onEditCertificationProgram = useCallback(async (index: number, dto: UpdateCertificationProgramDto) => {
        const current = programsRef.current[index];
        if (!current?._id) {
            showError('Invalid certification program selected');
            return;
        }

        await withLoading(async () => {
            try {
                const updated = await CertificationProgramService.updateCertificationProgram(current._id as string, dto);
                if (!mountedRef.current) return;
                setCertificationPrograms(prev => {
                    if (!prev[index]) return prev;
                    const next = prev.slice();
                    next[index] = updated;
                    return next;
                });
                refreshCertificationPrograms();
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to update certification program';
                showError(message);
                throw err;
            }
        });
    }, [refreshCertificationPrograms, showError, withLoading]);

    const onDeleteCertificationProgram = useCallback(async (index: number) => {
        const current = programsRef.current[index];
        if (!current?._id) {
            showError('Invalid certification program selected');
            return;
        }

        await withLoading(async () => {
            try {
                await CertificationProgramService.deleteCertificationProgram(current._id as string);
                if (!mountedRef.current) return;
                setCertificationPrograms(prev => prev.filter((_, i) => i !== index));
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to delete certification program';
                showError(message);
                throw err;
            }
        });
    }, [showError, withLoading]);

    return {
        certificationPrograms,
        loading,
        error,
        onAddCertificationProgram,
        onEditCertificationProgram,
        onDeleteCertificationProgram,
        refreshCertificationPrograms,
        setCertificationPrograms,
    };
};