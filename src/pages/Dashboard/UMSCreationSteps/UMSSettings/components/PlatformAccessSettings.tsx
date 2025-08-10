import React, { useEffect, useMemo, useRef, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import ConfirmDialog from '../../../../../components/Common/ConfirmDialog';
import ShimmerLoader from '../../../../../components/Common/ShimmerLoader ';
import { usePlatforms } from '../../../../../hooks/usePlatforms';

type Platforms = {
    teacherApp: boolean;
    studentApp: boolean;
    desktopOffices: string[];
};

const desktopOfficeOptions = [
    "Finance Office",
    "Student Affairs Office",
    "Examination Office",
    "Undergraduate Office",
];

const shallowEqualPlatforms = (a: Platforms, b: Platforms) => {
    if (a.teacherApp !== b.teacherApp) return false;
    if (a.studentApp !== b.studentApp) return false;
    if (a.desktopOffices.length !== b.desktopOffices.length) return false;
    const sa = [...a.desktopOffices].sort();
    const sb = [...b.desktopOffices].sort();
    for (let i = 0; i < sa.length; i++) if (sa[i] !== sb[i]) return false;
    return true;
};

const Toggle: React.FC<{
    checked: boolean;
    disabled?: boolean;
    onChange: () => void;
    label?: string;
}> = ({ checked, disabled, onChange, label }) => (
    <button
        type="button"
        onClick={onChange}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition
      ${checked ? 'bg-green-600' : 'bg-gray-300'}
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}
    `}
        aria-pressed={checked}
        aria-label={label}
    >
        <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white transition
        ${checked ? 'translate-x-5' : 'translate-x-1'}
      `}
        />
    </button>
);

const RowSkeleton: React.FC = () => (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <ShimmerLoader width={20} height={20} borderRadius={4} />
                <ShimmerLoader width={120} height={16} />
            </div>
            <ShimmerLoader width={44} height={24} borderRadius={12} />
        </div>
    </div>
);

const PlatformsSkeleton: React.FC = () => (
    <div className="space-y-3">
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
    </div>
);

const PlatformsSettings: React.FC = () => {
    const { platforms: serverPlatforms, loading, error, refreshPlatforms, updatePlatforms } = usePlatforms();

    const [local, setLocal] = useState<Platforms>({ teacherApp: false, studentApp: false, desktopOffices: [] });
    const [confirmOpen, setConfirmOpen] = useState(false);
    const disableKeyRef = useRef<'teacherApp' | 'studentApp' | null>(null);

    // first load
    const didInit = useRef(false);
    useEffect(() => {
        if (didInit.current) return;
        didInit.current = true;
        refreshPlatforms().catch(() => { });
    }, [refreshPlatforms]);

    // sync with server
    useEffect(() => {
        if (!serverPlatforms) return;
        setLocal({
            teacherApp: !!serverPlatforms.teacherApp,
            studentApp: !!serverPlatforms.studentApp,
            desktopOffices: Array.isArray(serverPlatforms.desktopOffices) ? serverPlatforms.desktopOffices : [],
        });
    }, [serverPlatforms]);

    useEffect(() => {
        if (error) toast.error(error);
    }, [error]);

    const dirty = useMemo(() => {
        if (!serverPlatforms) return false;
        return !shallowEqualPlatforms(local, {
            teacherApp: !!serverPlatforms.teacherApp,
            studentApp: !!serverPlatforms.studentApp,
            desktopOffices: Array.isArray(serverPlatforms.desktopOffices) ? serverPlatforms.desktopOffices : [],
        });
    }, [local, serverPlatforms]);

    const togglePlatform = (key: 'teacherApp' | 'studentApp') => {
        const next = !local[key];
        if (local[key] && !next) {
            disableKeyRef.current = key;
            setConfirmOpen(true);
            return;
        }
        setLocal(prev => ({ ...prev, [key]: next }));
    };

    const confirmDisable = () => {
        const key = disableKeyRef.current;
        if (!key) return;
        setLocal(prev => ({ ...prev, [key]: false }));
        disableKeyRef.current = null;
    };

    const toggleOffice = (office: string) => {
        setLocal(prev => {
            const exists = prev.desktopOffices.includes(office);
            return {
                ...prev,
                desktopOffices: exists
                    ? prev.desktopOffices.filter(o => o !== office)
                    : [...prev.desktopOffices, office],
            };
        });
    };

    const handleSave = async () => {
        try {
            await updatePlatforms(local);
            toast.success('Platforms updated');
            await refreshPlatforms();
        } catch {
            /* handled in hook */
        }
    };

    const handleRefresh = async () => {
        await refreshPlatforms();
        toast.info('Platforms refreshed');
    };

    return (
        <>
            <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Platforms</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Enable platforms and assign allowed desktop offices.
                            </p>
                        </div>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={handleRefresh}
                                disabled={loading}
                                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
                            >
                                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                                <span>Refresh</span>
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={loading || !dirty}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                <span>Save Changes</span>
                            </button>
                        </div>
                    </div>

                    {loading && !serverPlatforms ? (
                        <PlatformsSkeleton />
                    ) : (
                        <div className="space-y-4">
                            {/* Teacher App */}
                            <div className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium text-gray-900">Teacher App</div>
                                        <div className="text-xs text-gray-500">
                                            {local.teacherApp ? 'Enabled' : 'Disabled'}
                                        </div>
                                    </div>
                                    <Toggle
                                        checked={local.teacherApp}
                                        disabled={loading}
                                        onChange={() => togglePlatform('teacherApp')}
                                        label="Toggle Teacher App"
                                    />
                                </div>
                            </div>

                            {/* Student App */}
                            <div className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium text-gray-900">Student App</div>
                                        <div className="text-xs text-gray-500">
                                            {local.studentApp ? 'Enabled' : 'Disabled'}
                                        </div>
                                    </div>
                                    <Toggle
                                        checked={local.studentApp}
                                        disabled={loading}
                                        onChange={() => togglePlatform('studentApp')}
                                        label="Toggle Student App"
                                    />
                                </div>
                            </div>

                            {/* Desktop Offices */}
                            <div className="border border-gray-200 rounded-lg p-4">
                                <div className="mb-3">
                                    <div className="font-medium text-gray-900">Desktop Offices</div>
                                    <div className="text-xs text-gray-500">
                                        Select which offices can use the desktop client
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {desktopOfficeOptions.map(office => {
                                        const active = local.desktopOffices.includes(office);
                                        return (
                                            <button
                                                key={office}
                                                type="button"
                                                onClick={() => toggleOffice(office)}
                                                disabled={loading}
                                                className={`flex items-center justify-between px-3 py-2 rounded-lg border transition
                          ${active ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-gray-300'}
                        `}
                                            >
                                                <span>{office}</span>
                                                <span
                                                    className={`w-4 h-4 rounded-full border ${active ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'
                                                        }`}
                                                />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmDialog
                isOpen={confirmOpen}
                onClose={() => {
                    setConfirmOpen(false);
                    disableKeyRef.current = null;
                }}
                onConfirm={confirmDisable}
                title="Disable platform?"
                message="This platform will be turned off for all users. You can re-enable it later."
            />
        </>
    );
};

export default PlatformsSettings;
