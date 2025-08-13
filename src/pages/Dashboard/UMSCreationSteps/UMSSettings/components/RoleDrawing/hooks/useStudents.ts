import { useCallback, useState } from 'react';
import { Student, CreateStudentDto, UpdateStudentDto } from '../../../../../../../interfaces/types';
import { StudentService } from '../../../../../../../services/StudentService';

export interface UseStudentsReturn {
    students: Student[];
    loading: boolean;
    error: string | null;
    refreshStudents: () => Promise<void>;
    onAddStudent: (dto: CreateStudentDto) => Promise<void>;
    onEditStudent: (index: number, dto: UpdateStudentDto) => Promise<void>;
    onDeleteStudent: (index: number) => Promise<void>;
    setStudents: (list: Student[]) => void;
    searchStudents: (query: string) => Promise<Student[]>;
    getStudentsByProgram: (programId: string) => Promise<Student[]>;
    bulkCreateStudents: (students: CreateStudentDto[]) => Promise<void>;
}

export const useStudents = (): UseStudentsReturn => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const showError = useCallback((msg: string) => {
        setError(msg);
        setTimeout(() => setError(null), 5000);
    }, []);

    const refreshStudents = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const list = await StudentService.getStudents();
            setStudents(Array.isArray(list) ? list : []);
        } catch (e) {
            showError(e instanceof Error ? e.message : 'Failed to refresh students');
        } finally {
            setLoading(false);
        }
    }, [showError]);

    const onAddStudent = useCallback(async (dto: CreateStudentDto) => {
        setLoading(true);
        setError(null);
        try {
            const created = await StudentService.createStudent(dto);
            setStudents(prev => [...prev, created]);
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Failed to create student';
            showError(msg);
            throw e;
        } finally {
            setLoading(false);
        }
    }, [showError]);

    const onEditStudent = useCallback(async (index: number, dto: UpdateStudentDto) => {
        const target = students[index];
        if (!target?._id) {
            showError('Invalid student selected');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const updated = await StudentService.updateStudent(target._id, dto);
            setStudents(prev => {
                const next = [...prev];
                next[index] = updated;
                return next;
            });
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Failed to update student';
            showError(msg);
            throw e;
        } finally {
            setLoading(false);
        }
    }, [students, showError]);

    const onDeleteStudent = useCallback(async (index: number) => {
        const target = students[index];
        if (!target?._id) {
            showError('Invalid student selected');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await StudentService.deleteStudent(target._id);
            setStudents(prev => prev.filter((_, i) => i !== index));
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Failed to delete student';
            showError(msg);
            throw e;
        } finally {
            setLoading(false);
        }
    }, [students, showError]);

    const searchStudents = useCallback(async (query: string): Promise<Student[]> => {
        setLoading(true);
        setError(null);
        try {
            const results = await StudentService.searchStudents(query);
            return Array.isArray(results) ? results : [];
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Failed to search students';
            showError(msg);
            return [];
        } finally {
            setLoading(false);
        }
    }, [showError]);

    const getStudentsByProgram = useCallback(async (programId: string): Promise<Student[]> => {
        setLoading(true);
        setError(null);
        try {
            const results = await StudentService.getStudentsByProgram(programId);
            return Array.isArray(results) ? results : [];
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Failed to fetch students by program';
            showError(msg);
            return [];
        } finally {
            setLoading(false);
        }
    }, [showError]);

    const bulkCreateStudents = useCallback(async (studentDtos: CreateStudentDto[]) => {
        setLoading(true);
        setError(null);
        try {
            const created = await StudentService.bulkCreateStudents(studentDtos);
            setStudents(prev => [...prev, ...created]);
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Failed to create students in bulk';
            showError(msg);
            throw e;
        } finally {
            setLoading(false);
        }
    }, [showError]);

    return {
        students,
        loading,
        error,
        refreshStudents,
        onAddStudent,
        onEditStudent,
        onDeleteStudent,
        setStudents,
        searchStudents,
        getStudentsByProgram,
        bulkCreateStudents,
    };
};