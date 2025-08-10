import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import {
  Users,
  BookOpen,
  ScrollText,
  Landmark,
  CalendarDays,
  ClipboardList,
  ClipboardCheck,
  Mail,
  FileBadge,
  LibraryBig,
  GraduationCap,
  Home,
  Gavel,
  UserCog,
  LineChart,
  RefreshCw,
} from 'lucide-react';
import ConfirmDialog from '../../../../../components/Common/ConfirmDialog';
import { useModules } from '../../../../../hooks/useModules';
import ShimmerLoader from '../../../../../components/Common/ShimmerLoader ';
import { PlatformAccessSettings } from './common';

type ModuleTier = 'basic' | 'standard' | 'premium';
type LucideIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface ModuleOption {
  name: string;
  icon: LucideIcon;
  iconClass: string; // color class for the icon bg/text
}

const TIERS: ModuleTier[] = ['basic', 'standard', 'premium'];

// Available modules (tiered)
const AVAILABLE_MODULES: ModuleOption[] = [
  { name: 'Student Information', icon: Users, iconClass: 'text-blue-600' },
  { name: 'Program & Courses', icon: BookOpen, iconClass: 'text-indigo-600' },
  { name: 'Grading & Transcripts', icon: ScrollText, iconClass: 'text-amber-600' },
  { name: 'Fees & Payments', icon: Landmark, iconClass: 'text-green-600' },
  { name: 'Timetable & Calendar', icon: CalendarDays, iconClass: 'text-red-600' },
  { name: 'Exams & Invigilation', icon: ClipboardList, iconClass: 'text-purple-600' },
  { name: 'Attendance & Absences', icon: ClipboardCheck, iconClass: 'text-cyan-600' },
  { name: 'Messaging & Notifications', icon: Mail, iconClass: 'text-pink-600' },
  { name: 'Certificates & Clearance', icon: FileBadge, iconClass: 'text-teal-600' },
  { name: 'Library Management', icon: LibraryBig, iconClass: 'text-amber-600' },
  { name: 'Student Affairs', icon: GraduationCap, iconClass: 'text-blue-600' },
  { name: 'Accommodation & Housing', icon: Home, iconClass: 'text-orange-600' },
  { name: 'Discipline & Sanctions', icon: Gavel, iconClass: 'text-red-600' },
  { name: 'Alumni & Careers', icon: UserCog, iconClass: 'text-violet-600' },
  { name: 'Analytics & Reporting', icon: LineChart, iconClass: 'text-emerald-600' },
];

// ---------- helpers ----------
const parseKey = (key: string): { name: string; tier: ModuleTier } => {
  const idx = key.lastIndexOf('_');
  if (idx === -1) return { name: key, tier: 'basic' };
  const name = key.slice(0, idx);
  const tierStr = key.slice(idx + 1) as ModuleTier;
  const tier: ModuleTier = (['basic', 'standard', 'premium'] as const).includes(tierStr)
    ? tierStr
    : 'basic';
  return { name, tier };
};

// canonical “set” equality for arrays of strings
const isSameSet = (a: string[], b: string[]) => {
  if (a.length !== b.length) return false;
  const s = new Set(a);
  for (const x of b) if (!s.has(x)) return false;
  return true;
};

// ---------- UI bits ----------
const ModuleCardSkeleton: React.FC = () => (
  <div className="border border-gray-200 rounded-lg p-4 bg-white">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
        <ShimmerLoader width={20} height={20} borderRadius={4} />
      </div>
      <div className="flex-1 min-w-0 space-y-2">
        <ShimmerLoader width="60%" height={16} />
        <ShimmerLoader width="40%" height={12} />
      </div>
      <ShimmerLoader width={120} height={32} borderRadius={8} />
    </div>
  </div>
);

const ModulesSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
    {Array.from({ length: count }).map((_, i) => (
      <ModuleCardSkeleton key={i} />
    ))}
  </div>
);

// a small segmented-like control using plain buttons
const TierSelector: React.FC<{
  value: ModuleTier;
  disabled?: boolean;
  onChange: (t: ModuleTier) => void;
}> = ({ value, disabled, onChange }) => (
  <div className="inline-flex rounded-md border border-gray-200 overflow-hidden">
    {TIERS.map((t) => (
      <button
        key={t}
        type="button"
        disabled={disabled}
        onClick={() => onChange(t)}
        className={`px-2.5 py-1 text-xs font-medium transition
          ${value === t ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        aria-pressed={value === t}
      >
        {t}
      </button>
    ))}
  </div>
);

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

// ---------- main ----------
const ModulesSettings: React.FC = () => {
  const {
    enabledModules,      // persisted array like ["Analytics & Reporting_standard", ...]
    loading,
    error,
    refreshModules,
    updateModules,       // (mods: string[]) => Promise<void>
  } = useModules();

  // local map: name -> tier
  const [localMap, setLocalMap] = useState<Record<string, ModuleTier>>({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const pendingDisableRef = useRef<string | null>(null);

  // first load once
  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    refreshModules().catch(() => { });
  }, [refreshModules]);

  // sync from hook to local map
  useEffect(() => {
    const next: Record<string, ModuleTier> = {};
    (enabledModules ?? []).forEach((k) => {
      const { name, tier } = parseKey(k);
      next[name] = tier;
    });
    setLocalMap(next);
  }, [enabledModules]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  // derived formatted list for API
  const formattedLocal: string[] = useMemo(
    () => Object.entries(localMap).map(([name, tier]) => `${name}_${tier}` as const),
    [localMap]
  );

  const dirty = useMemo(
    () => !isSameSet(formattedLocal, enabledModules ?? []),
    [formattedLocal, enabledModules]
  );

  const handleToggle = (name: string) => {
    const isOn = name in localMap;
    if (isOn) {
      pendingDisableRef.current = name;
      setConfirmOpen(true);
    } else {
      setLocalMap((prev) => ({ ...prev, [name]: 'basic' })); // default tier on enable
    }
  };

  const confirmDisable = () => {
    const name = pendingDisableRef.current;
    if (!name) return;
    setLocalMap((prev) => {
      const { [name]: _, ...rest } = prev;
      return rest;
    });
    pendingDisableRef.current = null;
  };

  const handleTierChange = (name: string, tier: ModuleTier) => {
    setLocalMap((prev) => ({ ...prev, [name]: tier }));
  };

  const handleRefresh = async () => {
    await refreshModules();
    toast.info('Modules refreshed');
  };

  const handleSave = async () => {
    try {
      await updateModules(formattedLocal);
      toast.success('Modules updated');
      await refreshModules();
    } catch {
      /* toast handled by hook */
    }
  };

  return (
    <div className='space-y-6'>
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Modules</h3>
              <p className="text-sm text-gray-500 mt-1">
                Enable modules and choose their tier
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

          {loading && (enabledModules?.length ?? 0) === 0 ? (
            <ModulesSkeleton />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
              {AVAILABLE_MODULES.map(({ name, icon: Icon, iconClass }) => {
                const active = name in localMap;
                const tier = active ? localMap[name] : 'basic';
                return (
                  <div
                    key={name}
                    className={`border rounded-lg p-4 transition
                      ${active ? 'border-green-200 bg-green-50/40' : 'border-gray-200 bg-white hover:border-gray-300'}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center`}>
                          <Icon className={`h-5 w-5 ${iconClass}`} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{name}</div>
                          <div className="text-xs text-gray-500">
                            {active ? `Enabled · ${tier}` : 'Disabled'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        {active && (
                          <TierSelector
                            value={tier}
                            disabled={loading}
                            onChange={(t) => handleTierChange(name, t)}
                          />
                        )}
                        <Toggle
                          checked={active}
                          disabled={loading}
                          onChange={() => handleToggle(name)}
                          label={`Toggle ${name}`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          pendingDisableRef.current = null;
        }}
        onConfirm={confirmDisable}
        title="Disable module?"
        message="This module will be turned off and hidden from users. You can re-enable it later."
      />

      <PlatformAccessSettings />
    </div>
  );
};

export default ModulesSettings;
