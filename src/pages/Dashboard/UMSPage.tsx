import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Eye,
    MoreVertical,
    Plus,
    Settings,
    Database,
    Users,
    Monitor,
    BookOpen,
    AlertCircle,
    RefreshCw,
} from 'lucide-react';
import { Breadcrumbs } from '../../components/Common/Breadcrumbs';
import UMSFilterComponent from '../../components/UMSFilterComponent';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import { pathnames } from '../../routes/path-names';
import { useUMSManagement } from './dashboard.hooks';

type UMSLite = {
    id: string;
    umsName: string;
    umsType?: string | null;
    umsLogoUrl?: string | null;
    modules?: string[];
    platforms?: { teacherApp?: boolean; studentApp?: boolean };
};

const RowSkeleton: React.FC = () => (
    <tr className="animate-pulse">
        <td className="px-6 py-4">
            <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 mr-4" />
                <div className="space-y-2">
                    <div className="h-3 w-36 bg-gray-200 rounded" />
                    <div className="h-3 w-24 bg-gray-100 rounded" />
                </div>
            </div>
        </td>
        <td className="px-6 py-4"><div className="h-6 w-20 bg-gray-100 rounded-full" /></td>
        <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-100 rounded" /></td>
        <td className="px-6 py-4"><div className="h-6 w-36 bg-gray-100 rounded-full" /></td>
        <td className="px-6 py-4"><div className="h-6 w-16 bg-gray-100 rounded-full" /></td>
        <td className="px-6 py-4 text-right"><div className="h-6 w-6 bg-gray-100 rounded-full inline-block" /></td>
    </tr>
);

const getUMSTypeIcon = (type?: string | null) => {
    switch (type?.toLowerCase()) {
        case 'university': return <BookOpen className="h-4 w-4 text-blue-600" />;
        case 'school': return <Users className="h-4 w-4 text-green-600" />;
        case 'institute': return <Database className="h-4 w-4 text-purple-600" />;
        default: return <Monitor className="h-4 w-4 text-gray-600" />;
    }
};

const getUMSTypeColor = (type?: string | null) => {
    switch (type?.toLowerCase()) {
        case 'university': return 'bg-blue-100 text-blue-800';
        case 'school': return 'bg-green-100 text-green-800';
        case 'institute': return 'bg-purple-100 text-purple-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const UMSPage: React.FC = () => {
    // headless confirm wired into the hook
    const [confirmState, setConfirmState] = useState<{ open: boolean; message: string; resolve?: (v: boolean) => void }>({ open: false, message: '' });
    const confirmFn = (message: string) =>
        new Promise<boolean>((resolve) => setConfirmState({ open: true, message, resolve }));

    const {
        umsList,
        isLoading,
        error,
        fetchUMSs,
        handleAction,
        clearError,
    } = useUMSManagement(confirmFn);

    const navigate = useNavigate();

    // filters
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | string>('all');

    // actions dropdown
    const [openMenuFor, setOpenMenuFor] = useState<string | null>(null);
    const tableRef = useRef<HTMLDivElement | null>(null);

    // close menu on outside click
    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (!tableRef.current) return;
            if (openMenuFor && !tableRef.current.contains(e.target as Node)) setOpenMenuFor(null);
        };
        document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, [openMenuFor]);

    // fetch list on mount
    useEffect(() => {
        fetchUMSs();
    }, [fetchUMSs]);

    const uniqueTypes = useMemo(
        () =>
            Array.from(
                new Set(
                    umsList
                        .map((u) => u.umsType)
                        .filter((t): t is NonNullable<typeof t> => !!t)
                )
            ),
        [umsList]
    );

    const filteredUMSs = useMemo(() => {
        const q = searchTerm.trim().toLowerCase();
        return umsList.filter((ums) => {
            const matchesSearch = !q || ums.umsName.toLowerCase().includes(q);
            const matchesFilter = filterType === 'all' || ums.umsType?.toLowerCase() === filterType.toLowerCase();
            return matchesSearch && matchesFilter;
        });
    }, [umsList, searchTerm, filterType]);

    return (
        <div className="p-6 mx-auto max-w-[85vw]">
            <Breadcrumbs />

            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">UMS Management</h2>
                        <p className="text-gray-600 mt-1">Manage and monitor your UMS instances</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => fetchUMSs()}
                            disabled={isLoading}
                            className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                        {/* <button
              onClick={() => navigate(pathnames.CRATE_UMS)}
              className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              <Plus className="h-4 w-4" />
              Create New UMS
            </button> */}
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <Database className="h-8 w-8 text-blue-600 mr-3" />
                            <div>
                                <p className="text-sm font-medium text-blue-900">Total UMS Instances</p>
                                <p className="text-2xl font-bold text-blue-700">{umsList.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <Users className="h-8 w-8 text-green-600 mr-3" />
                            <div>
                                <p className="text-sm font-medium text-green-900">Active Users</p>
                                <p className="text-2xl font-bold text-green-700"><i>coming soon</i></p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <BookOpen className="h-8 w-8 text-purple-600 mr-3" />
                            <div>
                                <p className="text-sm font-medium text-purple-900">Total Modules</p>
                                <p className="text-2xl font-bold text-purple-700">
                                    {umsList.reduce((sum, u) => sum + (u.modules?.length ?? 0), 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-6">
                <UMSFilterComponent
                    filterType={filterType}
                    setFilterType={setFilterType}
                    uniqueTypes={uniqueTypes}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    totalCount={umsList.length}
                    filteredCount={filteredUMSs.length}
                />
            </div>

            {/* Table / States */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden" ref={tableRef}>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">UMS Instance</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Modules</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Platforms</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">

                            {/* loading skeleton */}
                            {isLoading && filteredUMSs.length === 0 && (
                                <>
                                    {Array.from({ length: 6 }).map((_, i) => <RowSkeleton key={i} />)}
                                </>
                            )}

                            {/* empty state (inline) */}
                            {!isLoading && filteredUMSs.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center">
                                        <div className="text-center">
                                            <Database className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                            <p className="text-gray-600">
                                                {searchTerm || filterType !== 'all'
                                                    ? 'No instances match your filters.'
                                                    : 'No UMS instances yet.'}
                                            </p>
                                            {!searchTerm && filterType === 'all' && (
                                                <button
                                                    onClick={() => navigate(pathnames.CRATE_UMS)}
                                                    className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                                >
                                                    <Plus className="h-4 w-4" /> Create UMS
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {/* rows */}
                            {filteredUMSs.map((ums: UMSLite) => {
                                const modulesCount = ums.modules?.length ?? 0;
                                const modulesLabel = modulesCount === 1 ? 'module' : 'modules';
                                const teacher = !!ums.platforms?.teacherApp;
                                const student = !!ums.platforms?.studentApp;

                                return (
                                    <tr key={ums.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Link to={`/dashboard/ums/${ums.id}`} className="flex items-center group">
                                                {ums.umsLogoUrl ? (
                                                    <img
                                                        src={`${ums.umsLogoUrl}?w=40&h=40&fit=crop`}
                                                        alt={`${ums.umsName} logo`}
                                                        className="w-10 h-10 object-cover rounded-full border-2 border-gray-200 mr-4"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                                                        <Database className="h-5 w-5 text-gray-500" />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                                        {ums.umsName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">ID: {ums.id.slice(0, 8)}…</div>
                                                </div>
                                            </Link>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {ums.umsType ? (
                                                <div className="flex items-center">
                                                    {getUMSTypeIcon(ums.umsType)}
                                                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-medium rounded-full ${getUMSTypeColor(ums.umsType)}`}>
                                                        {ums.umsType}
                                                    </span>
                                                </div>
                                            ) : <span className="text-gray-400">—</span>}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <BookOpen className="h-4 w-4 text-gray-400 mr-2" />
                                                <span className="text-sm text-gray-900 font-medium">{modulesCount}</span>
                                                <span className="text-sm text-gray-500 ml-1">{modulesLabel}</span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-wrap gap-1">
                                                {teacher && (
                                                    <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                                        <Users className="h-3 w-3 mr-1" /> Teacher
                                                    </span>
                                                )}
                                                {student && (
                                                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                                        <BookOpen className="h-3 w-3 mr-1" /> Student
                                                    </span>
                                                )}
                                                {!teacher && !student && (
                                                    <span className="text-gray-400 text-sm">No platforms</span>
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                                <span className="w-2 h-2 bg-green-600 rounded-full mr-2" />
                                                Active
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 relative whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => setOpenMenuFor(prev => prev === ums.id ? null : ums.id)}
                                                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                                                aria-haspopup="menu"
                                                aria-expanded={openMenuFor === ums.id}
                                            >
                                                <MoreVertical className="h-5 w-5" />
                                            </button>

                                            {openMenuFor === ums.id && (
                                                <div className="absolute right-6 mt-2 w-48 z-10 bg-white border border-gray-200 shadow-lg rounded-lg py-1">
                                                    <button
                                                        onClick={() => { handleAction('view', ums.id); setOpenMenuFor(null); }}
                                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                                    >
                                                        <Eye className="h-4 w-4 mr-3" /> View Details
                                                    </button>
                                                    <button
                                                        onClick={() => { navigate(`/dashboard/ums/${ums.id}/settings`); setOpenMenuFor(null); }}
                                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                                    >
                                                        <Settings className="h-4 w-4 mr-3" /> Settings
                                                    </button>
                                                    <hr className="my-1" />
                                                    <button
                                                        onClick={async () => { await handleAction('delete', ums.id); setOpenMenuFor(null); }}
                                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                                                    >
                                                        <AlertCircle className="h-4 w-4 mr-3" /> Terminate
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* error banner */}
            {error && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                        <div className="flex-1">
                            <h3 className="text-sm font-medium text-red-800">Error Loading UMS Instances</h3>
                            <p className="text-sm text-red-700 mt-1">{error}</p>
                        </div>
                        <button onClick={clearError} className="ml-4 text-red-600 hover:text-red-800 text-lg font-semibold">×</button>
                    </div>
                    <div className="mt-3">
                        <button
                            onClick={() => fetchUMSs()}
                            className="inline-flex items-center gap-2 bg-red-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-700"
                        >
                            <RefreshCw className="h-4 w-4" /> Retry
                        </button>
                    </div>
                </div>
            )}

            {/* global headless confirm */}
            <ConfirmDialog
                isOpen={confirmState.open}
                title="Please confirm"
                message={confirmState.message}
                onClose={() => {
                    confirmState.resolve?.(false);
                    setConfirmState({ open: false, message: '' });
                }}
                onConfirm={() => {
                    confirmState.resolve?.(true);
                    setConfirmState({ open: false, message: '' });
                }}
            />
        </div>
    );
};

export default UMSPage;
