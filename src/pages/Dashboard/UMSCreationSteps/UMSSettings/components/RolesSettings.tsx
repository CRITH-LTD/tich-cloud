// RolesSettings.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Plus, RefreshCw, Shield, Pencil, Trash2, KeyRound, X, Users } from 'lucide-react';

import ConfirmDialog from '../../../../../components/Common/ConfirmDialog'; import ShimmerLoader from '../../../../../components/Common/ShimmerLoader ';
import { useRoles } from '../../../../../hooks/useRoles';
import { usePermissionz } from '../../../../../hooks/usePermissions';
import PermissionsDrawer from './PermissionsDrawer';
import RoleUsersDrawer from './RoleUsersDrawer';

// --- Types (align with your backend)
export interface Role {
    id?: string;
    _id?: string;
    name: string;
    description?: string;
    ums: string;
    permissions?: string[]; // permission IDs
    createdAt?: string;
    updatedAt?: string;
}

export interface Permission {
    id?: string;
    _id?: string;
    name: string;
    code: string;       // unique code like 'users.read'
    description?: string;
}

// ---------- Small UI bits ----------
const RowSkeleton: React.FC = () => (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <ShimmerLoader width={20} height={20} borderRadius={4} />
                </div>
                <div className="space-y-2">
                    <ShimmerLoader width={160} height={16} />
                    <ShimmerLoader width={220} height={12} />
                </div>
            </div>
            <div className="flex items-center gap-2">
                <ShimmerLoader width={32} height={32} borderRadius={8} />
                <ShimmerLoader width={32} height={32} borderRadius={8} />
                <ShimmerLoader width={32} height={32} borderRadius={8} />
            </div>
        </div>
    </div>
);

const ListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => (
    <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => <RowSkeleton key={i} />)}
    </div>
);

// ---------- Modals ----------

// Create/Edit Role
const RoleFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (dto: { name: string; description?: string }) => Promise<void>;
    initial?: Role | null;
    title: string;
    submitting?: boolean;
}> = ({ isOpen, onClose, onSubmit, initial, title, submitting }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (!isOpen) return;
        setName(initial?.name ?? '');
        setDescription(initial?.description ?? '');
    }, [isOpen, initial]);

    if (!isOpen) return null;

    const disabled = submitting || !name.trim();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/40" onClick={onClose} />
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Shield className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">{title}</h3>
                            <p className="text-sm text-gray-500">
                                {initial ? 'Update role details' : 'Create a new role'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-700">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name<span className="text-red-500">*</span></label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., Registrar"
                            disabled={submitting}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            placeholder="What can this role do?"
                            disabled={submitting}
                        />
                    </div>
                    <div className="pt-2 flex justify-end gap-2">
                        <button
                            onClick={onClose}
                            className="px-3 py-2 bg-white border rounded-lg hover:bg-gray-50"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => onSubmit({ name: name.trim(), description: description.trim() || undefined })}
                            disabled={disabled}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {submitting ? 'Saving…' : initial ? 'Update Role' : 'Create Role'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ---------- Main ----------
const RolesSettings: React.FC = () => {
    const {
        roles,
        loading,
        error,
        page,
        total,
        limit,
        search,
        setPage,
        setSearch,
        refreshRoles,
        createRole,
        updateRole,
        deleteRole,
        assignPermissions, // (roleId, permissionIds) -> Promise<void>
        getRolePermissions, // (roleId) -> Promise<string[]>
    } = useRoles();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editing, setEditing] = useState<Role | null>(null);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const [permDrawerOpen, setPermDrawerOpen] = useState(false);
    const [permDrawerRole, setPermDrawerRole] = useState<Role | null>(null);

    const [usersDrawerOpen, setUsersDrawerOpen] = useState(false);
    const [usersDrawerRole, setUsersDrawerRole] = useState<Role | null>(null);


    const didInit = useRef(false);
    useEffect(() => {
        if (didInit.current) return;
        didInit.current = true;
        refreshRoles().catch(() => { });
    }, [refreshRoles]);

    useEffect(() => {
        if (error) toast.error(error);
    }, [error]);

    const openCreate = () => {
        setEditing(null);
        setIsFormOpen(true);
    };
    const openEdit = (role: Role) => {
        setEditing(role);
        setIsFormOpen(true);
    };

    const openPermissions = async (role: Role) => {
        try {
            const ids = await getRolePermissions(role._id ?? role.id!);
            setPermDrawerRole({ ...role, permissions: ids });
            setPermDrawerOpen(true);
        } catch {/* toast handled in hook */ }
    };

    const onSavePermissions = async (permissionIds: string[]) => {
        if (!permDrawerRole) return;
        await assignPermissions(permDrawerRole._id ?? permDrawerRole.id!, permissionIds);
        toast.success('Permissions updated');
        await refreshRoles();
    };

    const openRoleUsers = (role: Role) => {
        setUsersDrawerRole(role);
        setUsersDrawerOpen(true);
    };


    const handleSaveRole = async (dto: { name: string; description?: string }) => {
        if (editing) {
            await updateRole(editing._id ?? editing.id!, dto);
            toast.success('Role updated');
        } else {
            await createRole(dto);
            toast.success('Role created');
        }
        setIsFormOpen(false);
        await refreshRoles();
    };

    const askDelete = (roleId: string) => {
        setDeleteId(roleId);
        setConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        await deleteRole(deleteId);
        toast.success('Role deleted');
        setDeleteId(null);
        await refreshRoles();
    };

    const handleAssign = async (permissionIds: string[]) => {
        if (!permDrawerRole) return;
        await assignPermissions(permDrawerRole._id ?? permDrawerRole.id!, permissionIds);
        toast.success('Permissions updated');
        await refreshRoles();
    };

    const canPaginate = useMemo(() => total > limit, [total, limit]);

    return (
        <>
            <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Roles</h3>
                            <p className="text-sm text-gray-500 mt-1">Manage roles and their permissions</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => refreshRoles()}
                                disabled={loading}
                                className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                            >
                                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                                Refresh
                            </button>
                            <button
                                onClick={openCreate}
                                disabled={loading}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                <Plus className="h-4 w-4" />
                                New Role
                            </button>
                        </div>
                    </div>

                    {/* search */}
                    <div className="mb-4">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') { setPage(1); refreshRoles().catch(() => { }); } }}
                            placeholder="Search roles…"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* list */}
                    {loading && roles.length === 0 ? (
                        <ListSkeleton />
                    ) : roles.length > 0 ? (
                        <div className="space-y-3">
                            {roles.map((r) => {
                                const id = r._id ?? r.id!;
                                return (
                                    <div key={id} className="border border-gray-200 rounded-lg p-4 bg-white hover:border-gray-300 transition">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                                                    <Shield className="h-5 w-5 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{r.name}</div>
                                                    <div className="text-xs text-gray-500">
                                                        {r.description || 'No description'}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => openPermissions({ ...r, ums: r.ums || '' })}
                                                    className="p-2 rounded-lg text-amber-600 hover:bg-amber-50"
                                                    title="Manage permissions"
                                                >
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path opacity="0.4" d="M7.25 6C7.25 3.37665 9.37665 1.25 12 1.25C14.6234 1.25 16.75 3.37665 16.75 6V8.69562C18.4288 10.071 19.5 12.1604 19.5 14.5C19.5 18.6421 16.1421 22 12 22C7.85786 22 4.5 18.6421 4.5 14.5C4.5 12.1604 5.57125 10.071 7.25 8.69562V6ZM8.75 7.73883C9.73325 7.26533 10.8356 7 12 7C13.1644 7 14.2667 7.26533 15.25 7.73883V6C15.25 4.20507 13.7949 2.75 12 2.75C10.2051 2.75 8.75 4.20507 8.75 6V7.73883ZM12 14.75C11.5858 14.75 11.25 15.0858 11.25 15.5V17.5C11.25 17.9142 11.5858 18.25 12 18.25C12.4142 18.25 12.75 17.9142 12.75 17.5V15.5C12.75 15.0858 12.4142 14.75 12 14.75Z" fill="#323544" />
                                                        <path d="M12.75 15.5C12.75 15.0858 12.4142 14.75 12 14.75C11.5858 14.75 11.25 15.0858 11.25 15.5V17.5C11.25 17.9142 11.5858 18.25 12 18.25C12.4142 18.25 12.75 17.9142 12.75 17.5V15.5Z" fill="#323544" />
                                                    </svg>

                                                    {/* <KeyRound className="h-4 w-4" /> */}
                                                </button>
                                                <button
                                                    onClick={() => openRoleUsers({ ...r, ums: r.ums || '' })}
                                                    className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50"
                                                    title="Manage users"
                                                >
                                                    <Users className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => openEdit({ ...r, ums: r.ums || '' })}
                                                    className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"
                                                    title="Edit role"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => askDelete(id)}
                                                    className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                                                    title="Delete role"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
                            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                                <Shield className="h-6 w-6 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No roles yet</h3>
                            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                                Roles control what users can do. Create your first role to get started.
                            </p>
                            <button
                                onClick={openCreate}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                <Plus className="h-4 w-4" />
                                Create Role
                            </button>
                        </div>
                    )}

                    {/* pagination */}
                    {canPaginate && (
                        <div className="mt-4 flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                                Page {page} · {total} total
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => { if (page > 1) { setPage(page - 1); refreshRoles().catch(() => { }); } }}
                                    disabled={loading || page <= 1}
                                    className="px-3 py-1.5 border rounded-lg disabled:opacity-50"
                                >
                                    Prev
                                </button>
                                <button
                                    onClick={() => { setPage(page + 1); refreshRoles().catch(() => { }); }}
                                    disabled={loading || roles.length < limit}
                                    className="px-3 py-1.5 border rounded-lg disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <PermissionsDrawer
                open={permDrawerOpen}
                onClose={() => setPermDrawerOpen(false)}
                role={permDrawerRole}
                onSave={onSavePermissions}
            />

            <RoleUsersDrawer
                open={usersDrawerOpen}
                onClose={() => setUsersDrawerOpen(false)}
                role={usersDrawerRole}
            />

            <RoleFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleSaveRole}
                initial={editing}
                title={editing ? 'Edit Role' : 'New Role'}
                submitting={loading}
            />



            <ConfirmDialog
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={confirmDelete}
                title="Delete role?"
                message="This role will be removed. Users assigned to it may lose access. This action cannot be undone."
            />
        </>
    );
};

export default RolesSettings;
