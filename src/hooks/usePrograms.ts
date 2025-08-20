import { useCallback, useState } from 'react';
import { ProgramService,  } from '../services/ProgramService';
import { Program, type CreateProgramDto, type UpdateProgramDto } from '../interfaces/types';

export interface UseProgramsReturn {
    programs: Program[];
    loading: boolean;
    error: string | null;
    refreshPrograms: () => Promise<void>;
    onAddProgram: (dto: CreateProgramDto) => Promise<void>;
    onEditProgram: (index: number, dto: UpdateProgramDto) => Promise<void>;
    onDeleteProgram: (index: number) => Promise<void>;
    setPrograms: (list: Program[]) => void;
}

export const usePrograms = (): UseProgramsReturn => {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const showError = useCallback((msg: string) => {
        setError(msg);
        setTimeout(() => setError(null), 5000);
    }, []);

    const refreshPrograms = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const list = await ProgramService.getPrograms();
            setPrograms(Array.isArray(list) ? list : []);
        } catch (e) {
            showError(e instanceof Error ? e.message : 'Failed to refresh programs');
        } finally {
            setLoading(false);
        }
    }, [showError]);

    const onAddProgram = useCallback(async (dto: CreateProgramDto) => {
        setLoading(true);
        setError(null);
        try {
            const created = await ProgramService.createProgram(dto);
            setPrograms(prev => [...prev, created]);
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Failed to create program';
            showError(msg);
            throw e;
        } finally {
            setLoading(false);
        }
    }, [showError]);

    const onEditProgram = useCallback(async (index: number, dto: UpdateProgramDto) => {
        const target = programs[index];
        if (!target?._id) {
            showError('Invalid program selected');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const updated = await ProgramService.updateProgram(target._id, dto);
            setPrograms(prev => {
                const next = [...prev];
                next[index] = updated;
                return next;
            });
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Failed to update program';
            showError(msg);
            throw e;
        } finally {
            setLoading(false);
        }
    }, [programs, showError]);

    const onDeleteProgram = useCallback(async (index: number) => {
        const target = programs[index];
        if (!target?._id) {
            showError('Invalid program selected');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await ProgramService.deleteProgram(target._id);
            setPrograms(prev => prev.filter((_, i) => i !== index));
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Failed to delete program';
            showError(msg);
            throw e;
        } finally {
            setLoading(false);
        }
    }, [programs, showError]);

    return {
        programs,
        loading,
        error,
        refreshPrograms,
        onAddProgram,
        onEditProgram,
        onDeleteProgram,
        setPrograms,
    };
};
