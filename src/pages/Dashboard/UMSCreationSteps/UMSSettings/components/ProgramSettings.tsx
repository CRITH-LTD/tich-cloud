import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import {
    Plus,
    School,
    BookOpen,
    Clock3,
    Edit,
    Trash2,
    RefreshCw,
} from 'lucide-react';

import ConfirmDialog from '../../../../../components/Common/ConfirmDialog';
import { useDepartments } from '../../../../../hooks/useDepartments';
import { usePrograms } from '../../../../../hooks/usePrograms';
import ShimmerLoader from '../../../../../components/Common/ShimmerLoader ';
import ProgramFormModal from './ProgramFormModal';
import { CreateProgramDto, Program } from '../../../../../interfaces/types';

// ----- Types (local to keep this file drop-in ready)
export interface Department {
    _id?: string;
    name: string;
    description?: string;
}





// ----- Skeletons
const ProgramCardSkeleton: React.FC = () => (
    <div className="rounded-xl p-px bg-gradient-to-br from-slate-200 via-slate-100 to-white">
        <div className="rounded-xl border border-[gainsboro] bg-white/90 shadow-sm p-4">
            {/* Header row */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-100 rounded-lg animate-pulse" />
                    <div className="space-y-2">
                        <div className="h-4 w-40 bg-slate-100 rounded animate-pulse" />
                        <div className="flex gap-2">
                            <div className="h-5 w-24 bg-slate-100 rounded-full animate-pulse" />
                            <div className="h-5 w-20 bg-slate-100 rounded-full animate-pulse" />
                        </div>
                    </div>
                </div>
                <div className="h-8 w-16 bg-slate-100 rounded-md animate-pulse" />
            </div>

            {/* Description lines */}
            <div className="mt-4 space-y-2">
                <div className="h-3.5 w-full bg-slate-100 rounded animate-pulse" />
                <div className="h-3.5 w-10/12 bg-slate-100 rounded animate-pulse" />
                <div className="h-3.5 w-8/12 bg-slate-100 rounded animate-pulse" />
            </div>

            {/* Footer row */}
            <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between">
                <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
                <div className="h-7 w-20 bg-slate-100 rounded-md animate-pulse" />
            </div>
        </div>
    </div>
);

const ProgramsSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: count }).map((_, i) => (
            <ProgramCardSkeleton key={i} />
        ))}
    </div>
);

// ----- Modal




// ----- Page
const ProgramSettings: React.FC = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const pendingDeleteRef = useRef<number | null>(null);
    const [editing, setEditing] = useState<{ program: Program; index: number } | null>(null);

    // data hooks
    const { departments, refreshDepartments, loading: depsLoading, error: depsError } = useDepartments({ mode: 'all' });
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
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {programs.map((p, idx) => {
                                const type = (p.programType ?? 'Program').toString();
                                const typeStyles =
                                    type.toLowerCase().includes('under')
                                        ? { bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-200' }
                                        : type.toLowerCase().includes('post')
                                            ? { bg: 'bg-indigo-50', text: 'text-indigo-700', ring: 'ring-indigo-200' }
                                            : type.toLowerCase().includes('diploma')
                                                ? { bg: 'bg-amber-50', text: 'text-amber-700', ring: 'ring-amber-200' }
                                                : type.toLowerCase().includes('cert')
                                                    ? { bg: 'bg-sky-50', text: 'text-sky-700', ring: 'ring-sky-200' }
                                                    : { bg: 'bg-slate-50', text: 'text-slate-700', ring: 'ring-slate-200' };

                                return (
                                    <div
                                        key={p._id ?? `program-${idx}`}
                                        className="group relative"
                                    >
                                        {/* gradient border wrapper */}
                                        <div className="rounded-xl p-px bg-gradient-to-br from-slate-200 via-slate-100 to-white">
                                            <div
                                                className={[
                                                    'rounded-xl h-full backdrop-blur-lg bg-white/90',
                                                    'border border-[gainsboro]', // 1px solid gainsboro
                                                    'hover:shadow-sm transition-all duration-300',
                                                    'hover:-translate-y-0.5 focus-within:-translate-y-0.5',
                                                ].join(' ')}
                                                role="article"
                                                aria-label={`${p.name} program card`}
                                                tabIndex={0}
                                            >
                                                {/* Header */}
                                                <div className="flex items-start justify-between p-4">
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-9 w-9 rounded-lg bg-indigo-50 flex items-center justify-center">
                                                                <BookOpen className="h-4 w-4 text-indigo-600" />
                                                            </div>
                                                            <h4
                                                                className="font-semibold text-slate-900 truncate max-w-[18rem] md:max-w-[14rem]"
                                                                title={p.name}
                                                            >
                                                                {p.name}
                                                            </h4>
                                                        </div>

                                                        <div className="mt-2 flex flex-wrap items-center gap-2">
                                                            {/* program type pill */}
                                                            <span
                                                                className={[
                                                                    'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
                                                                    typeStyles.bg,
                                                                    typeStyles.text,
                                                                    'ring-1', typeStyles.ring,
                                                                ].join(' ')}
                                                                title="Program type"
                                                            >
                                                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-current opacity-80" />
                                                                {type}
                                                            </span>

                                                            {/* duration pill */}
                                                            <span
                                                                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium bg-slate-50 text-slate-700 ring-1 ring-slate-200"
                                                                title="Approximate duration"
                                                            >
                                                                <Clock3 className="h-3.5 w-3.5 text-slate-500" />
                                                                {p.duration} year{p.duration === 1 ? '' : 's'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* actions */}
                                                    <div className="flex items-center gap-1 ml-3">
                                                        <button
                                                            onClick={() => handleOpenEdit(idx)}
                                                            disabled={loading}
                                                            title="Edit program"
                                                            aria-label={`Edit ${p.name}`}
                                                            className="p-2 rounded-md text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-50"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => requestDelete(idx)}
                                                            disabled={loading}
                                                            title="Delete program"
                                                            aria-label={`Delete ${p.name}`}
                                                            className="p-2 rounded-md text-rose-600 hover:text-rose-800 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-500/30 disabled:opacity-50"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Description */}
                                                {p.description ? (
                                                    <div className="px-4 pb-4">
                                                        <p className="text-sm text-slate-600 line-clamp-3">
                                                            {p.description}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="px-4 pb-4">
                                                        <p className="text-sm italic text-slate-400">No description provided.</p>
                                                    </div>
                                                )}

                                                {/* Footer */}
                                                <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200/70">
                                                    <div className="text-xs text-slate-500">
                                                        ID: <span className="font-mono text-slate-700">{p.id?.slice(-6) ?? '—'}</span>
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        Created:&nbsp;
                                                        <span className="font-mono text-slate-700">
                                                            {p.createdAt
                                                                ? new Date(p.createdAt).toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric',
                                                                })
                                                                : '—'}
                                                        </span>
                                                    </div>

                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => handleOpenEdit(idx)}
                                                            disabled={loading}
                                                            className="text-xs px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                                                        >
                                                            Quick Edit
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* subtle focus ring overlay */}
                                                <div className="pointer-events-none absolute inset-0 rounded-xl ring-0 group-focus-within:ring-2 ring-indigo-500/30" />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
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
