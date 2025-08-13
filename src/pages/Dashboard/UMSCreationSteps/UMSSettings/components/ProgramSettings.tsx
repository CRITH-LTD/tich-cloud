import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import {
    Plus,
    School,
    BookOpen,
    CalendarDays,
    Clock3,
    Edit,
    Trash2,
    RefreshCw,
    AlertCircle,
    GraduationCap,
    Clock,
    Building2,
    Calendar,
    FileText,
    Info,
} from 'lucide-react';

import ConfirmDialog from '../../../../../components/Common/ConfirmDialog';
import { useDepartments } from '../../../../../hooks/useDepartments';
import { usePrograms } from '../../../../../hooks/usePrograms';
import ShimmerLoader from '../../../../../components/Common/ShimmerLoader ';

// ----- Types (local to keep this file drop-in ready)
export interface Department {
    _id?: string;
    name: string;
    description?: string;
}

export interface Program {
    _id?: string;
    name: string;
    description?: string;
    duration: number;          // years
    startDate: string;         // ISO date string (YYYY-MM-DD)
    endDate: string;           // ISO date string (YYYY-MM-DD)
    departmentId: string;      // ref
    createdAt?: string;
    updatedAt?: string;
}

export type CreateProgramDto = Omit<Program, '_id' | 'createdAt' | 'updatedAt'>;
export type UpdateProgramDto = Partial<CreateProgramDto>;

// ----- Utilities
const fmtDate = (iso?: string) => (iso ? new Date(iso).toLocaleDateString() : '—');

// ----- Skeletons
const ProgramCardSkeleton: React.FC = () => (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-gray-400" />
                </div>
                <div className="space-y-2">
                    <ShimmerLoader width={160} height={14} />
                    <ShimmerLoader width={220} height={12} />
                </div>
            </div>
            <ShimmerLoader width={72} height={28} borderRadius={8} />
        </div>
    </div>
);

const ProgramsSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Array.from({ length: count }).map((_, i) => <ProgramCardSkeleton key={i} />)}
    </div>
);

// ----- Modal

const ProgramFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (dto: CreateProgramDto) => Promise<void>;
    departments: Department[];
    program?: Program | null;
    title?: string;
}> = ({ isOpen, onClose, onSubmit, departments, program, title = 'Add Program' }) => {
    const [form, setForm] = useState<CreateProgramDto>({
        name: '',
        description: '',
        duration: 1,
        startDate: '',
        endDate: '',
        departmentId: '',
    });
    const [errors, setErrors] = useState<Partial<Record<keyof CreateProgramDto, string>>>({});
    const [saving, setSaving] = useState(false);
    const [isEndDateManuallySet, setIsEndDateManuallySet] = useState(false);

    // Calculate end date based on start date and duration
    const calculateEndDate = useCallback((startDate: string, duration: number): string => {
        if (!startDate || !duration) return '';

        try {
            const start = new Date(startDate);
            const end = new Date(start);
            end.setFullYear(start.getFullYear() + duration);

            return end.toISOString().split('T')[0];
        } catch {
            return '';
        }
    }, []);

    // Auto-calculate end date when start date or duration changes
    useEffect(() => {
        if (form.startDate && form.duration && !isEndDateManuallySet) {
            const calculatedEndDate = calculateEndDate(form.startDate, form.duration);
            setForm(prev => ({ ...prev, endDate: calculatedEndDate }));
        }
    }, [form.startDate, form.duration, calculateEndDate, isEndDateManuallySet]);

    // Initialize form when modal opens or program changes
    useEffect(() => {
        if (program) {
            const startDate = program.startDate?.slice(0, 10) ?? '';
            const endDate = program.endDate?.slice(0, 10) ?? '';
            const duration = Number(program.duration ?? 1);

            setForm({
                name: program.name ?? '',
                description: program.description ?? '',
                duration,
                startDate,
                endDate,
                departmentId: program.departmentId ?? '',
            });

            // Check if end date was manually set (doesn't match calculated)
            const calculatedEnd = calculateEndDate(startDate, duration);
            setIsEndDateManuallySet(endDate !== calculatedEnd);
        } else {
            setForm({
                name: '',
                description: '',
                duration: 1,
                startDate: '',
                endDate: '',
                departmentId: ''
            });
            setIsEndDateManuallySet(false);
        }
        setErrors({});
    }, [program, isOpen, calculateEndDate]);

    const setField =
        (k: keyof CreateProgramDto) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
                const v = e.target.value;

                if (k === 'duration') {
                    const numValue = Number(v) || 0;
                    setForm(prev => ({ ...prev, [k]: numValue }));
                    setIsEndDateManuallySet(false); // Reset manual flag when duration changes
                } else if (k === 'startDate') {
                    setForm(prev => ({ ...prev, [k]: v }));
                    setIsEndDateManuallySet(false); // Reset manual flag when start date changes
                } else if (k === 'endDate') {
                    setForm(prev => ({ ...prev, [k]: v }));
                    setIsEndDateManuallySet(true); // Mark as manually set
                } else {
                    setForm(prev => ({ ...prev, [k]: v }));
                }

                // Clear error for this field
                if (errors[k]) setErrors(prev => ({ ...prev, [k]: undefined }));
            };

    const validate = (): boolean => {
        const e: Partial<Record<keyof CreateProgramDto, string>> = {};

        // Name validation
        if (!form.name.trim()) {
            e.name = 'Program name is required';
        } else if (form.name.trim().length < 3) {
            e.name = 'Program name must be at least 3 characters';
        } else if (form.name.trim().length > 100) {
            e.name = 'Program name must not exceed 100 characters';
        }

        // Department validation
        if (!form.departmentId) {
            e.departmentId = 'Please select a department';
        }

        // Duration validation
        if (!form.duration || form.duration < 1) {
            e.duration = 'Duration must be at least 1 year';
        } else if (form.duration > 10) {
            e.duration = 'Duration cannot exceed 10 years';
        }

        // Date validations
        if (!form.startDate) {
            e.startDate = 'Start date is required';
        }

        if (!form.endDate) {
            e.endDate = 'End date is required';
        }

        // Cross-field date validation
        if (form.startDate && form.endDate) {
            const startTime = new Date(form.startDate).getTime();
            const endTime = new Date(form.endDate).getTime();

            if (!Number.isNaN(startTime) && !Number.isNaN(endTime)) {
                if (endTime <= startTime) {
                    e.endDate = 'End date must be after start date';
                } else {
                    // Calculate expected duration
                    const startDate = new Date(form.startDate);
                    const endDate = new Date(form.endDate);
                    const actualDurationYears = (endDate.getFullYear() - startDate.getFullYear()) +
                        (endDate.getMonth() - startDate.getMonth()) / 12 +
                        (endDate.getDate() - startDate.getDate()) / 365;

                    // Allow some flexibility (±1 month)
                    const tolerance = 1 / 12; // 1 month in years
                    const minDuration = form.duration - tolerance;
                    const maxDuration = form.duration + tolerance;

                    if (actualDurationYears < minDuration || actualDurationYears > maxDuration) {
                        e.endDate = `End date should be approximately ${form.duration} year${form.duration !== 1 ? 's' : ''} from start date`;
                    }
                }
            }
        }

        // Description validation
        if (form.description && form.description.length > 800) {
            e.description = 'Description must not exceed 800 characters';
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (ev: React.FormEvent) => {
        ev.preventDefault();
        if (!validate()) return;

        setSaving(true);
        try {
            const dto: CreateProgramDto = {
                name: form.name.trim(),
                description: form.description?.trim() || undefined,
                duration: form.duration,
                startDate: form.startDate,
                endDate: form.endDate,
                departmentId: form.departmentId,
            };
            await onSubmit(dto);
            onClose();
        } catch {
            /* toast from parent/hook */
        } finally {
            setSaving(false);
        }
    };

    const getDepartmentName = (id: string) => {
        return departments.find(d => d._id === id)?.name || '';
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                                <p className="text-sm text-gray-500">
                                    {program ? 'Update program details and requirements' : 'Create a new academic program with curriculum details'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {/* Department Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                            <Building2 className="w-4 h-4 inline mr-1" />
                            Department <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={form.departmentId}
                            onChange={setField('departmentId')}
                            disabled={saving}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all
                ${errors.departmentId
                                    ? 'border-red-300 bg-red-50 focus:ring-red-500'
                                    : 'border-gray-300 hover:border-indigo-300 bg-white'
                                }`}
                        >
                            <option value="">Choose a department...</option>
                            {departments.map(d => (
                                <option key={d._id ?? d.name} value={d._id ?? ''}>
                                    {d.name}
                                </option>
                            ))}
                        </select>
                        {errors.departmentId && (
                            <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                {errors.departmentId}
                            </div>
                        )}
                    </div>

                    {/* Program Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                            <BookOpen className="w-4 h-4 inline mr-1" />
                            Program Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={setField('name')}
                            disabled={saving}
                            placeholder="e.g., Bachelor of Science in Computer Science"
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all
                ${errors.name
                                    ? 'border-red-300 bg-red-50 focus:ring-red-500'
                                    : 'border-gray-300 hover:border-indigo-300 bg-white'
                                }`}
                        />
                        <div className="mt-1 flex justify-between text-xs">
                            <span className={errors.name ? 'text-red-600' : 'text-gray-500'}>
                                {errors.name || 'Enter the full official program name'}
                            </span>
                            <span className="text-gray-400">{form.name.length}/100</span>
                        </div>
                    </div>

                    {/* Duration and Dates Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                        {/* Duration */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                <Clock className="w-4 h-4 inline mr-1" />
                                Duration <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    min={1}
                                    max={10}
                                    value={form.duration}
                                    onChange={setField('duration')}
                                    disabled={saving}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all pr-16
                    ${errors.duration
                                            ? 'border-red-300 bg-red-50 focus:ring-red-500'
                                            : 'border-gray-300 hover:border-indigo-300 bg-white'
                                        }`}
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                                    {form.duration === 1 ? 'year' : 'years'}
                                </span>
                            </div>
                            {errors.duration && (
                                <div className="mt-1 flex items-center gap-2 text-red-600 text-xs">
                                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                    {errors.duration}
                                </div>
                            )}
                        </div>

                        {/* Start Date */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                Start Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={form.startDate}
                                onChange={setField('startDate')}
                                disabled={saving}
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all
                  ${errors.startDate
                                        ? 'border-red-300 bg-red-50 focus:ring-red-500'
                                        : 'border-gray-300 hover:border-indigo-300 bg-white'
                                    }`}
                            />
                            {errors.startDate && (
                                <div className="mt-1 flex items-center gap-2 text-red-600 text-xs">
                                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                    {errors.startDate}
                                </div>
                            )}
                        </div>

                        {/* End Date */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                End Date <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={form.endDate}
                                    onChange={setField('endDate')}
                                    disabled={saving}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all
                    ${errors.endDate
                                            ? 'border-red-300 bg-red-50 focus:ring-red-500'
                                            : 'border-gray-300 hover:border-indigo-300 bg-white'
                                        }`}
                                />
                                {!isEndDateManuallySet && form.startDate && form.duration && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" title="Auto-calculated"></div>
                                    </div>
                                )}
                            </div>
                            {errors.endDate && (
                                <div className="mt-1 flex items-center gap-2 text-red-600 text-xs">
                                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                    {errors.endDate}
                                </div>
                            )}
                            {!isEndDateManuallySet && form.startDate && form.duration && (
                                <div className="mt-1 flex items-center gap-1 text-blue-600 text-xs">
                                    <Info className="w-3 h-3" />
                                    Auto-calculated from duration
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Program Summary Card */}
                    {form.name && form.departmentId && form.duration && (
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-4">
                            <h4 className="font-semibold text-indigo-900 mb-2">Program Summary</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                <div>
                                    <span className="text-gray-600">Department:</span>
                                    <span className="font-medium text-gray-900 ml-2">
                                        {getDepartmentName(form.departmentId)}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Duration:</span>
                                    <span className="font-medium text-gray-900 ml-2">
                                        {form.duration} {form.duration === 1 ? 'year' : 'years'}
                                    </span>
                                </div>
                                {form.startDate && form.endDate && (
                                    <>
                                        <div>
                                            <span className="text-gray-600">Start:</span>
                                            <span className="font-medium text-gray-900 ml-2">
                                                {new Date(form.startDate).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">End:</span>
                                            <span className="font-medium text-gray-900 ml-2">
                                                {new Date(form.endDate).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                            <FileText className="w-4 h-4 inline mr-1" />
                            Program Description
                        </label>
                        <textarea
                            rows={5}
                            value={form.description ?? ''}
                            onChange={setField('description')}
                            disabled={saving}
                            placeholder="Provide a detailed description of the program, including objectives, curriculum highlights, and career outcomes..."
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all
                ${errors.description
                                    ? 'border-red-300 bg-red-50 focus:ring-red-500'
                                    : 'border-gray-300 hover:border-indigo-300 bg-white'
                                }`}
                        />
                        <div className="mt-2 flex justify-between text-xs">
                            <span className={errors.description ? 'text-red-600' : 'text-gray-500'}>
                                {errors.description || 'Optional: Describe the program\'s goals and curriculum'}
                            </span>
                            <span className={`${(form.description?.length ?? 0) > 700 ? 'text-amber-600' : 'text-gray-400'}`}>
                                {(form.description?.length ?? 0)}/800
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving || !form.name.trim() || !form.departmentId}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"

                        // className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
                        >
                            {saving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>{program ? 'Updating...' : 'Creating...'}</span>
                                </>
                            ) : (
                                <>
                                    <GraduationCap className="w-4 h-4" />
                                    <span>{program ? 'Update Program' : 'Create Program'}</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// ----- Page
const ProgramSettings: React.FC = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const pendingDeleteRef = useRef<number | null>(null);
    const [editing, setEditing] = useState<{ program: Program; index: number } | null>(null);

    // data hooks
    const { departments, refreshDepartments, loading: depsLoading, error: depsError } = useDepartments();
    const {
        programs: progData,
        loading,
        error,
        onAddProgram,
        onEditProgram,
        onDeleteProgram,
        refreshPrograms,
    } = usePrograms();

    // stable array
    const programs: Program[] = Array.isArray(progData) ? progData : [];

    // first load
    const didInit = useRef(false);
    useEffect(() => {
        if (didInit.current) return;
        didInit.current = true;
        (async () => {
            await Promise.allSettled([refreshDepartments(), refreshPrograms()]);
        })();
    }, [refreshDepartments, refreshPrograms]);

    // toasts
    useEffect(() => { if (error) toast.error(error); }, [error]);
    useEffect(() => { if (depsError) toast.error(depsError); }, [depsError]);

    const handleOpenAdd = () => {
        setEditing(null);
        setModalOpen(true);
    };

    const handleOpenEdit = (index: number) => {
        const p = programs[index];
        if (!p) return;
        setEditing({ program: p, index });
        setModalOpen(true);
    };

    const handleSubmit = async (dto: CreateProgramDto) => {
        if (editing) {
            await onEditProgram(editing.index, dto);
            toast.success('Program updated');
        } else {
            await onAddProgram(dto);
            toast.success('Program created');
        }
        await refreshPrograms(); // auto-refresh
    };

    const requestDelete = (index: number) => {
        pendingDeleteRef.current = index;
        setConfirmOpen(true);
    };

    const confirmDelete = async () => {
        const idx = pendingDeleteRef.current;
        if (idx == null) return;
        try {
            await onDeleteProgram(idx);
            toast.success('Program deleted');
            await refreshPrograms();
        } finally {
            setConfirmOpen(false);
            pendingDeleteRef.current = null;
        }
    };

    const HeaderRight = useMemo(
        () => (
            <div className="flex items-center gap-2">
                <button
                    onClick={() => refreshPrograms()}
                    disabled={loading}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                </button>
                <button
                    onClick={handleOpenAdd}
                    disabled={loading || depsLoading || departments.length === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                    <Plus className="h-4 w-4" />
                    <span>Add Program</span>
                </button>
            </div>
        ),
        [loading, depsLoading, departments.length, refreshPrograms]
    );

    return (
        <>
            <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <School className="h-4 w-4 text-indigo-700" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Programs</h3>
                                <p className="text-sm text-gray-500">Create and manage academic programs under departments</p>
                            </div>
                        </div>
                        {HeaderRight}
                    </div>

                    {/* Empty departments guard */}
                    {(!depsLoading && departments.length === 0) && (
                        <div className="mb-4 p-3 rounded-md bg-amber-50 text-amber-800 text-sm">
                            No departments found. Create a department first to add programs.
                        </div>
                    )}

                    {/* Content */}
                    {loading && programs.length === 0 ? (
                        <ProgramsSkeleton />
                    ) : programs.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {programs.map((p, idx) => (
                                <div key={p._id ?? `program-${idx}`} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm bg-gray-50/30 transition">
                                    <div className="flex items-start justify-between">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="h-4 w-4 text-indigo-600" />
                                                <h4 className="font-medium text-gray-900 truncate">{p.name}</h4>
                                            </div>
                                            <div className="mt-1 text-sm text-gray-600">
                                                <span className="inline-flex items-center gap-1 mr-3">
                                                    <Clock3 className="h-4 w-4 text-gray-400" /> {p.duration} year{p.duration === 1 ? '' : 's'}
                                                </span>
                                                <span className="inline-flex items-center gap-1">
                                                    <CalendarDays className="h-4 w-4 text-gray-400" />
                                                    {fmtDate(p.startDate)} — {fmtDate(p.endDate)}
                                                </span>
                                            </div>
                                            {p.description && (
                                                <p className="mt-2 text-sm text-gray-500 line-clamp-2">{p.description}</p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-1 ml-3">
                                            <button
                                                onClick={() => handleOpenEdit(idx)}
                                                disabled={loading}
                                                title="Edit program"
                                                className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg disabled:opacity-50"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => requestDelete(idx)}
                                                disabled={loading}
                                                title="Delete program"
                                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg disabled:opacity-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
                            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                                <BookOpen className="h-6 w-6 text-gray-400" />
                            </div>
                            <h3 className="text-lg text-gray-900 mb-2">No programs yet</h3>
                            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                                Programs let you organize courses and academic timelines under departments. Create your first program to get started.
                            </p>
                            <button
                                onClick={handleOpenAdd}
                                disabled={loading || depsLoading || departments.length === 0}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Create First Program</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            <ProgramFormModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditing(null);
                }}
                onSubmit={handleSubmit}
                departments={departments}
                program={editing?.program ?? null}
                title={editing ? 'Edit Program' : 'Add Program'}
            />

            {/* Confirm Delete */}
            <ConfirmDialog
                isOpen={confirmOpen}
                onClose={() => { setConfirmOpen(false); pendingDeleteRef.current = null; }}
                onConfirm={confirmDelete}
                title="Delete program?"
                message="This program will be removed. This action cannot be undone."
            />
        </>
    );
};

export default ProgramSettings;
