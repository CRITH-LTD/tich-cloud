// PermissionsDrawer.tsx (replace your component with this)
import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { KeyRound, X, Search, CheckSquare, Square, Filter } from 'lucide-react';
import { toast } from 'react-toastify';
import { usePermissionz } from '../../../../../hooks/usePermissions';
import { PermissionGroups } from '../../../../../services/PermissionService';
import type { Permission, Role } from './RolesSettings';
import ShimmerLoader from '../../../../../components/Common/ShimmerLoader ';

interface LegacyPermission extends Permission { _id?: string }
const ensureId = (p: LegacyPermission) => p.id ?? p._id ?? '';

const matches = (p: Permission, q: string) =>
    (p.name ?? '').toLowerCase().includes(q) || (p.code ?? '').toLowerCase().includes(q);

const DrawerPortal: React.FC<{ children: React.ReactNode }> = ({ children }) =>
    typeof document === 'undefined' ? null : createPortal(children, document.body);

const orderGroups = (g: PermissionGroups) => {
    const pref = ['user', 'ums', 'department', 'program', 'course', 'student', 'finance', 'system'];
    return [...pref.filter(k => k in g), ...Object.keys(g).filter(k => !pref.includes(k)).sort()];
};

const PermissionsDrawer: React.FC<{
    open: boolean;
    onClose: () => void;
    role: Role | null;
    onSave: (permissionIds: string[]) => Promise<void>;
}> = ({ open, onClose, role, onSave }) => {
    const { grouped, loading, error, refreshPermissions } = usePermissionz();
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [query, setQuery] = useState('');
    const [onlySelected, setOnlySelected] = useState(false);

    useEffect(() => { if (open) refreshPermissions('grouped').catch(() => { }); }, [open, refreshPermissions]);
    useEffect(() => { setSelected(new Set(role?.permissions ?? [])); }, [role]);
    useEffect(() => { if (error) toast.error(error); }, [error]);

    const q = query.trim().toLowerCase();

    const filteredGroups = useMemo(() => {
        const out: PermissionGroups = {};
        for (const [cat, arr] of Object.entries(grouped)) {
            const filtered = arr.filter(p => {
                const id = ensureId(p);
                if (onlySelected && !selected.has(id)) return false;
                if (!q) return true;
                return matches(p, q);
            });
            if (filtered.length) out[cat] = filtered;
        }
        return out;
    }, [grouped, q, onlySelected, selected]);

    const allIds = useMemo(() => {
        const ids: string[] = [];
        for (const arr of Object.values(filteredGroups)) for (const p of arr) {
            const id = ensureId(p); if (id) ids.push(id);
        }
        return ids;
    }, [filteredGroups]);

    const allChecked = allIds.length > 0 && allIds.every(id => selected.has(id));

    const toggle = (id: string) => {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    const toggleAllVisible = () => {
        setSelected(prev => {
            const next = new Set(prev);
            const add = !allChecked;
            allIds.forEach(id => add ? next.add(id) : next.delete(id));
            return next;
        });
    };

    const toggleGroup = (cat: string) => {
        const ids = (filteredGroups[cat] ?? []).map(ensureId).filter(Boolean);
        const groupAll = ids.length > 0 && ids.every(id => selected.has(id));
        setSelected(prev => {
            const next = new Set(prev);
            ids.forEach(id => groupAll ? next.delete(id) : next.add(id));
            return next;
        });
    };

    if (!open) return null;

    const totalSelected = selected.size;

    return (
        <DrawerPortal>
            <div className="fixed inset-0 z-[100]">
                <div className="absolute inset-0 bg-black/40" onClick={onClose} />
                <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-[101] flex flex-col">
                    {/* header */}
                    <div className="sticky top-0 bg-white border-b p-4 z-[102]">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <KeyRound className="h-5 w-5 text-amber-600" />
                                <h3 className="text-lg font-semibold">Assign Permissions</h3>
                            </div>
                            <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-700">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                                Role: <span className="font-medium text-gray-900">{role?.name}</span>
                            </p>
                            <span className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700">
                                Selected: {totalSelected}
                            </span>
                        </div>

                        {/* search + actions */}
                        <div className="mt-3 flex items-center gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search permissions…"
                                    className="w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <button
                                onClick={() => setOnlySelected(v => !v)}
                                className={`inline-flex items-center gap-1 px-3 py-2 border rounded-lg hover:bg-gray-50 ${onlySelected ? 'bg-gray-50' : ''}`}
                                title="Show selected only"
                            >
                                <Filter className="h-4 w-4" />
                                <span className="text-sm">{onlySelected ? 'Selected' : 'All'}</span>
                            </button>
                            <button
                                onClick={toggleAllVisible}
                                className="inline-flex items-center gap-1 px-3 py-2 border rounded-lg hover:bg-gray-50"
                                title={allChecked ? 'Deselect all (visible)' : 'Select all (visible)'}
                            >
                                {allChecked ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                                <span className="text-sm">{allChecked ? 'Deselect All' : 'Select All'}</span>
                            </button>
                        </div>
                    </div>

                    {/* content */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {loading ? (
                            <div className="space-y-2">
                                {Array.from({ length: 12 }).map((_, i) => <ShimmerLoader key={i} width="100%" height={20} />)}
                            </div>
                        ) : (
                            <>
                                {Object.keys(filteredGroups).length === 0 && (
                                    <div className="text-sm text-gray-500">No permissions match your search.</div>
                                )}

                                {orderGroups(filteredGroups).map((cat) => {
                                    const list = filteredGroups[cat] || [];
                                    const ids = list.map(ensureId).filter(Boolean);
                                    const groupAll = ids.length > 0 && ids.every(id => selected.has(id));

                                    return (
                                        <div key={cat} className="mb-4 border rounded-lg">
                                            <div className="flex items-center justify-between px-3 py-2 border-b bg-gray-50">
                                                <div className="font-medium capitalize">{cat}</div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-gray-500">{ids.filter(id => selected.has(id)).length}/{ids.length}</span>
                                                    <button
                                                        onClick={() => toggleGroup(cat)}
                                                        className="inline-flex items-center gap-1 text-sm px-2 py-1 border rounded hover:bg-white"
                                                    >
                                                        {groupAll ? 'Deselect group' : 'Select group'}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="divide-y">
                                                {list.map((p) => {
                                                    const id = ensureId(p);
                                                    const checked = id ? selected.has(id) : false;
                                                    return (
                                                        <label
                                                            key={id}
                                                            className={`flex items-center justify-between px-3 py-2 hover:bg-gray-50 ${checked ? 'bg-green-50/40' : ''}`}
                                                        >
                                                            <div className="min-w-0">
                                                                <div className="font-medium truncate">{p.name}</div>
                                                                <div className="text-xs text-gray-500 truncate">{p.code}</div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {checked && <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700">Selected</span>}
                                                                <input
                                                                    type="checkbox"
                                                                    checked={checked}
                                                                    onChange={() => id && toggle(id)}
                                                                    className="h-4 w-4"
                                                                />
                                                            </div>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                        )}
                    </div>

                    {/* footer */}
                    <div className="border-t p-4 flex justify-end gap-2">
                        <button onClick={onClose} className="px-3 py-2 bg-white border rounded-lg hover:bg-gray-50">Cancel</button>
                        <button
                            onClick={async () => { await onSave(Array.from(selected)); onClose(); }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </DrawerPortal>
    );
};

export default PermissionsDrawer;
