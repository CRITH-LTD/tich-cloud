// RoleUsersDrawer.tsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
    Users, X, Search, Plus, Trash2, Eye, EyeOff, AlertCircle, UserCheck,
    Mail, RefreshCw, Filter, Download, Upload, MoreVertical, Edit,
    Shield, Clock, CheckCircle, XCircle, Copy, Send
} from 'lucide-react';
import { toast } from 'react-toastify';
import { RoleService, RoleUser } from '../../../../../services/RoleService';
import type { Role } from './RolesSettings';
import ShimmerLoader from '../../../../../components/Common/ShimmerLoader ';

// Types
interface UserFilters {
    status: 'all' | 'active' | 'inactive';
    sortBy: 'name' | 'email' | 'dateAdded';
    sortOrder: 'asc' | 'desc';
}

interface BulkAction {
    type: 'remove' | 'activate' | 'deactivate' | 'export';
    userIds: string[];
}

const Portal: React.FC<{ children: React.ReactNode }> = ({ children }) =>
    typeof document === 'undefined' ? null : createPortal(children, document.body);

const RoleUsersDrawer: React.FC<{
    open: boolean;
    onClose: () => void;
    role: Role | null;
}> = ({ open, onClose, role }) => {
    // State management
    const [users, setUsers] = useState<RoleUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [addingUser, setAddingUser] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [bulkActionLoading, setBulkActionLoading] = useState(false);

    // Search and filters
    const [q, setQ] = useState('');
    const [filters, setFilters] = useState<UserFilters>({
        status: 'all',
        sortBy: 'name',
        sortOrder: 'asc'
    });
    const [showFilters, setShowFilters] = useState(false);

    // Form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [sendInviteEmail, setSendInviteEmail] = useState(true);

    // Bulk selection
    const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
    const [showBulkActions, setShowBulkActions] = useState(false);

    // Statistics
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        inactive: 0,
        lastUpdated: new Date()
    });

    const emailValid = /^\S+@\S+\.\S+$/.test(email);
    const passwordValid = password.length >= 6;
    const canAdd = emailValid && passwordValid && !addingUser;

    const roleId = role?._id ?? role?.id ?? '';

    // Fetch users with caching
    const fetchUsers = useCallback(async (showRefreshLoader = false) => {
        if (!roleId) return;

        if (showRefreshLoader) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        try {
            const list = await RoleService.listUsers(roleId);
            setUsers(list);

            // Update statistics
            setStats({
                total: list.length,
                active: list.filter(u => u.status !== 'inactive').length,
                inactive: list.filter(u => u.status === 'inactive').length,
                lastUpdated: new Date()
            });

            // Clear selections when data changes
            setSelectedUsers(new Set());

        } catch (e: any) {
            toast.error(e?.message ?? 'Failed to load users');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [roleId]);

    // Auto-refresh every 30 seconds when drawer is open
    useEffect(() => {
        if (!open || !roleId) return;

        fetchUsers();

        const interval = setInterval(() => {
            fetchUsers(true);
        }, 30000);

        return () => clearInterval(interval);
    }, [open, roleId, fetchUsers]);

    // Handle manual refresh
    const handleRefresh = () => {
        fetchUsers(true);
        toast.success('User list refreshed');
    };

    // Add user with enhanced options
    const handleAdd = async () => {
        if (!roleId || !canAdd) return;

        setAddingUser(true);
        try {
            await RoleService.addUser(roleId, {
                email: email.trim(),
                password,
                sendInvite: sendInviteEmail
            });

            await fetchUsers();
            setEmail('');
            setPassword('');

            toast.success(
                sendInviteEmail
                    ? 'User added and invitation sent'
                    : 'User added successfully'
            );
        } catch (e: any) {
            toast.error(e?.message ?? 'Failed to add user');
        } finally {
            setAddingUser(false);
        }
    };

    // Bulk import users
    const handleBulkImport = async (file: File) => {
        if (!roleId) return;

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('roleId', roleId);

            await RoleService.bulkImportUsers(roleId, formData);
            await fetchUsers();
            toast.success('Users imported successfully');
        } catch (e: any) {
            toast.error(e?.message ?? 'Failed to import users');
        } finally {
            setLoading(false);
        }
    };

    // Export users
    const handleExport = async () => {
        try {
            const data = selectedUsers.size > 0
                ? users.filter(u => selectedUsers.has(u._id ?? u.id!))
                : users;

            const csv = [
                ['Name', 'Email', 'Status', 'Date Added'],
                ...data.map(u => [
                    u.name || '',
                    u.email || '',
                    u.status || 'active',
                    u.dateAdded || ''
                ])
            ].map(row => row.join(',')).join('\n');

            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${role?.name}-users.csv`;
            a.click();
            URL.revokeObjectURL(url);

            toast.success('Users exported successfully');
        } catch (e) {
            toast.error('Failed to export users');
        }
    };

    // Bulk actions
    const handleBulkAction = async (action: BulkAction) => {
        if (!roleId || action.userIds.length === 0) return;

        setBulkActionLoading(true);
        try {
            switch (action.type) {
                case 'remove':
                    await Promise.all(action.userIds.map(uid => RoleService.removeUser(roleId, uid)));
                    toast.success(`${action.userIds.length} users removed`);
                    break;
                case 'activate':
                    await RoleService.bulkUpdateUsers(roleId, action.userIds, { status: 'active' });
                    toast.success(`${action.userIds.length} users activated`);
                    break;
                case 'deactivate':
                    await RoleService.bulkUpdateUsers(roleId, action.userIds, { status: 'inactive' });
                    toast.success(`${action.userIds.length} users deactivated`);
                    break;
                case 'export':
                    await handleExport();
                    break;
            }

            await fetchUsers();
            setSelectedUsers(new Set());
            setShowBulkActions(false);
        } catch (e: any) {
            toast.error(e?.message ?? `Failed to ${action.type} users`);
        } finally {
            setBulkActionLoading(false);
        }
    };

    // Remove single user
    const handleRemove = async (uid: string) => {
        if (!roleId) return;

        setLoading(true);
        try {
            await RoleService.removeUser(roleId, uid);
            await fetchUsers();
            toast.success('User removed from role');
        } catch (e: Error | unknown) {
            toast.error(e instanceof Error ? e.message : 'Failed to remove user');
        } finally {
            setLoading(false);
        }
    };

    // Selection handlers
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedUsers(new Set(filtered.map(u => u._id ?? u.id!)));
        } else {
            setSelectedUsers(new Set());
        }
    };

    const handleSelectUser = (userId: string, checked: boolean) => {
        const newSelection = new Set(selectedUsers);
        if (checked) {
            newSelection.add(userId);
        } else {
            newSelection.delete(userId);
        }
        setSelectedUsers(newSelection);
    };

    // Copy user email
    const copyEmail = (email: string) => {
        navigator.clipboard.writeText(email);
        toast.success('Email copied to clipboard');
    };

    // Filtered and sorted users
    const filtered = useMemo(() => {
        let result = [...users];

        // Text search
        const searchTerm = q.trim().toLowerCase();
        if (searchTerm) {
            result = result.filter(user =>
                (user.name ?? '').toLowerCase().includes(searchTerm) ||
                (user.email ?? '').toLowerCase().includes(searchTerm)
            );
        }

        // Status filter
        if (filters.status !== 'all') {
            result = result.filter(user =>
                filters.status === 'active'
                    ? user.status !== 'inactive'
                    : user.status === 'inactive'
            );
        }

        // Sort
        result.sort((a, b) => {
            let aVal = '', bVal = '';

            switch (filters.sortBy) {
                case 'name':
                    aVal = (a.name ?? '').toLowerCase();
                    bVal = (b.name ?? '').toLowerCase();
                    break;
                case 'email':
                    aVal = (a.email ?? '').toLowerCase();
                    bVal = (b.email ?? '').toLowerCase();
                    break;
                case 'dateAdded':
                    aVal = a.dateAdded ?? '';
                    bVal = b.dateAdded ?? '';
                    break;
            }

            const comparison = aVal.localeCompare(bVal);
            return filters.sortOrder === 'desc' ? -comparison : comparison;
        });

        return result;
    }, [users, q, filters]);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && canAdd) {
            handleAdd();
        }
    };

    const getValidationErrors = () => {
        const errors = [];
        if (email && !emailValid) errors.push('Please enter a valid email address');
        if (password && !passwordValid) errors.push('Password must be at least 6 characters');
        return errors;
    };

    const validationErrors = getValidationErrors();
    const allSelected = filtered.length > 0 && selectedUsers.size === filtered.length;
    const someSelected = selectedUsers.size > 0 && selectedUsers.size < filtered.length;

    if (!open) return null;

    return (
        <Portal>
            <div className="fixed inset-0 z-[100] flex">
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />

                {/* Drawer */}
                <div className="ml-auto h-full w-full max-w-4xl bg-white shadow-2xl z-[101] flex flex-col animate-in slide-in-from-right duration-300">

                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <Users className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Role Users</h3>
                                    <p className="text-sm text-gray-500">
                                        Manage users for <span className="font-medium text-gray-700">"{role?.name}"</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleRefresh}
                                    disabled={refreshing}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                                    title="Refresh users"
                                >
                                    <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
                                </button>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Statistics */}
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                                <div className="text-xs text-blue-600">Total Users</div>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                                <div className="text-xs text-green-600">Active</div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-gray-600">{stats.inactive}</div>
                                <div className="text-xs text-gray-600">Inactive</div>
                            </div>
                        </div>
                    </div>

                    {/* Search, Filter, and Actions */}
                    <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 space-y-4">
                        {/* Search and Filter Bar */}
                        <div className="flex items-center gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                    placeholder="Search users by name or email..."
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                                />
                            </div>

                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`p-2.5 border rounded-lg transition-colors ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <Filter className="h-4 w-4" />
                            </button>

                            <button
                                onClick={handleExport}
                                className="p-2.5 bg-white border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                                title="Export users"
                            >
                                <Download className="h-4 w-4" />
                            </button>

                            <label className="p-2.5 bg-white border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
                                <Upload className="h-4 w-4" />
                                <input
                                    type="file"
                                    accept=".csv,.xlsx"
                                    className="hidden"
                                    onChange={(e) => e.target.files?.[0] && handleBulkImport(e.target.files[0])}
                                />
                            </label>
                        </div>

                        {/* Filters */}
                        {showFilters && (
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <select
                                            value={filters.status}
                                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                        >
                                            <option value="all">All Users</option>
                                            <option value="active">Active Only</option>
                                            <option value="inactive">Inactive Only</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                                        <select
                                            value={filters.sortBy}
                                            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                        >
                                            <option value="name">Name</option>
                                            <option value="email">Email</option>
                                            <option value="dateAdded">Date Added</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                                        <select
                                            value={filters.sortOrder}
                                            onChange={(e) => setFilters(prev => ({ ...prev, sortOrder: e.target.value as any }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                        >
                                            <option value="asc">Ascending</option>
                                            <option value="desc">Descending</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Bulk Actions */}
                        {selectedUsers.size > 0 && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-blue-600" />
                                        <span className="text-sm font-medium text-blue-900">
                                            {selectedUsers.size} user{selectedUsers.size !== 1 ? 's' : ''} selected
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleBulkAction({ type: 'activate', userIds: Array.from(selectedUsers) })}
                                            disabled={bulkActionLoading}
                                            className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
                                        >
                                            <CheckCircle className="h-3 w-3 inline mr-1" />
                                            Activate
                                        </button>
                                        <button
                                            onClick={() => handleBulkAction({ type: 'deactivate', userIds: Array.from(selectedUsers) })}
                                            disabled={bulkActionLoading}
                                            className="px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 text-sm"
                                        >
                                            <XCircle className="h-3 w-3 inline mr-1" />
                                            Deactivate
                                        </button>
                                        <button
                                            onClick={() => handleBulkAction({ type: 'remove', userIds: Array.from(selectedUsers) })}
                                            disabled={bulkActionLoading}
                                            className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm"
                                        >
                                            <Trash2 className="h-3 w-3 inline mr-1" />
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Add User Form */}
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Plus className="h-4 w-4 text-gray-600" />
                                <h4 className="font-medium text-gray-900">Add New User</h4>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                {/* Email Input */}
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Enter email address"
                                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${email && !emailValid
                                                ? 'border-red-300 bg-red-50'
                                                : 'border-gray-300 bg-white'
                                            }`}
                                    />
                                </div>

                                {/* Password Input */}
                                <div className="relative">
                                    <input
                                        type={showPw ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Enter password"
                                        className={`w-full px-4 py-2.5 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${password && !passwordValid
                                                ? 'border-red-300 bg-red-50'
                                                : 'border-gray-300 bg-white'
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPw(!showPw)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Options */}
                            <div className="flex items-center gap-4 mb-3">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={sendInviteEmail}
                                        onChange={(e) => setSendInviteEmail(e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">Send invitation email</span>
                                    <Send className="h-3 w-3 text-gray-400" />
                                </label>
                            </div>

                            {/* Validation Errors */}
                            {validationErrors.length > 0 && (
                                <div className="flex items-start gap-2 mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm text-red-700">
                                        <ul className="space-y-1">
                                            {validationErrors.map((error, index) => (
                                                <li key={index}>• {error}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* Add Button */}
                            <button
                                onClick={handleAdd}
                                disabled={!canAdd}
                                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                            >
                                {addingUser ? (
                                    <>
                                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Adding User...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="h-4 w-4" />
                                        Add User
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Users List */}
                    <div className="flex-1 overflow-y-auto px-6 py-4">
                        {loading && !refreshing ? (
                            <div className="space-y-3">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
                                        <ShimmerLoader width="60%" height={16} className="mb-2" />
                                        <ShimmerLoader width="80%" height={12} />
                                    </div>
                                ))}
                            </div>
                        ) : filtered.length > 0 ? (
                            <div className="space-y-3">
                                {/* List Header */}
                                <div className="flex items-center justify-between mb-4 py-2 border-b border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={allSelected}
                                                ref={input => {
                                                    if (input) input.indeterminate = someSelected && !allSelected;
                                                }}
                                                onChange={(e) => handleSelectAll(e.target.checked)}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                        </label>
                                        <span className="text-sm font-medium text-gray-700">
                                            {filtered.length} user{filtered.length !== 1 ? 's' : ''}
                                            {q && ` matching "${q}"`}
                                        </span>
                                    </div>

                                    <div className="text-xs text-gray-500">
                                        Last updated: {stats.lastUpdated.toLocaleTimeString()}
                                    </div>
                                </div>

                                {/* User List */}
                                {filtered.map(user => {
                                    const id = user._id ?? user.id!;
                                    const isSelected = selectedUsers.has(id);
                                    const isActive = user.status !== 'inactive';

                                    return (
                                        <div
                                            key={id}
                                            className={`bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all ${isSelected ? 'ring-2 ring-blue-500 border-blue-500' : ''
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={(e) => handleSelectUser(id, e.target.checked)}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />

                                                    <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center relative">
                                                        <UserCheck className="h-5 w-5 text-white" />
                                                        {isActive ? (
                                                            <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                                                        ) : (
                                                            <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-gray-400 border-2 border-white rounded-full"></div>
                                                        )}
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium text-gray-900 truncate">
                                                                {user.name || 'Unnamed User'}
                                                            </span>
                                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${isActive
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-gray-100 text-gray-800'
                                                                }`}>
                                                                {isActive ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-sm text-gray-500 truncate">
                                                                {user.email}
                                                            </span>
                                                            <button
                                                                onClick={() => copyEmail(user.email || '')}
                                                                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                                                title="Copy email"
                                                            >
                                                                <Copy className="h-3 w-3" />
                                                            </button>
                                                        </div>
                                                        {user.dateAdded && (
                                                            <div className="flex items-center gap-1 mt-1">
                                                                <Clock className="h-3 w-3 text-gray-400" />
                                                                <span className="text-xs text-gray-400">
                                                                    Added {new Date(user.dateAdded).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-1 ml-3">
                                                    <button
                                                        onClick={() => {
                                                            // Toggle user status
                                                            handleBulkAction({
                                                                type: isActive ? 'deactivate' : 'activate',
                                                                userIds: [id]
                                                            });
                                                        }}
                                                        className={`p-2 rounded-lg transition-colors ${isActive
                                                                ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                                                : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                                                            }`}
                                                        title={isActive ? 'Deactivate user' : 'Activate user'}
                                                    >
                                                        {isActive ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            // Edit user functionality
                                                            toast.info('Edit user feature coming soon');
                                                        }}
                                                        className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit user"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>

                                                    <button
                                                        onClick={() => handleRemove(id)}
                                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Remove user from role"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>

                                                    <div className="relative">
                                                        <button
                                                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                                            title="More options"
                                                        >
                                                            <MoreVertical className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <Users className="h-8 w-8 text-gray-400" />
                                </div>
                                <h6 className="text-lg font-medium text-gray-900 mb-2">
                                    {q ? 'No matching users found' : 'No users assigned yet'}
                                </h6>
                                <p className="text-sm text-gray-500 mb-4">
                                    {q
                                        ? `No users match your search "${q}". Try a different search term or adjust your filters.`
                                        : 'Get started by adding users to this role using the form above, or import users from a CSV file.'
                                    }
                                </p>

                                {q && (
                                    <button
                                        onClick={() => {
                                            setQ('');
                                            setFilters({ status: 'all', sortBy: 'name', sortOrder: 'asc' });
                                        }}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                        Clear Search
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer with quick stats */}
                    <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-3">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center gap-4">
                                <span>Showing {filtered.length} of {users.length} users</span>
                                {selectedUsers.size > 0 && (
                                    <span className="text-blue-600 font-medium">
                                        {selectedUsers.size} selected
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                {refreshing && (
                                    <div className="flex items-center gap-2 text-blue-600">
                                        <RefreshCw className="h-3 w-3 animate-spin" />
                                        <span className="text-xs">Refreshing...</span>
                                    </div>
                                )}

                                <div className="flex items-center gap-1">
                                    <Shield className="h-3 w-3" />
                                    <span className="text-xs">Role: {role?.name}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Portal>
    );
};

export default RoleUsersDrawer;