import { Fragment, useState, useEffect, useCallback } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { 
    X, 
    Save, 
    AlertCircle, 
    Search, 
    Users, 
    Shield, 
    Plus, 
    Edit, 
    Trash2, 
    Eye, 
    EyeOff, 
    Mail, 
    Key,
    UserPlus,
    Crown
} from "lucide-react";
import { Button, FormInput } from "./common";
import { PermissionsRoles, Role, RoleUser } from "../../../../../interfaces/types";

interface RoleDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    mode: "add" | "edit";
    roleIndex?: number;
    roleData?: Role;
    allPermissions: PermissionsRoles[];
    existingRoles?: Role[]; // For duplicate name validation
    onSubmit: (role: Role, index?: number) => void;
    isLoading?: boolean;
    maxRoleNameLength?: number;
    maxDescriptionLength?: number;
}

interface ValidationErrors {
    name?: string;
    description?: string;
    permissions?: string;
    users?: string;
    general?: string;
}

interface UserFormData {
    email: string;
    password: string;
    isPrimary: boolean;
}

const RoleDrawer: React.FC<RoleDrawerProps> = ({
    isOpen,
    onClose,
    mode,
    roleIndex,
    roleData,
    allPermissions,
    existingRoles = [],
    onSubmit,
    isLoading = false,
    maxRoleNameLength = 50,
    maxDescriptionLength = 200
}) => {
    const [form, setForm] = useState<Role>({
        name: "",
        description: "",
        permissions: [],
        users: []
    });

    const [errors, setErrors] = useState<ValidationErrors>({});
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [permissionSearch, setPermissionSearch] = useState("");
    const [selectedPermissionCategory, setSelectedPermissionCategory] = useState<string>("all");
    
    // User management states
    const [showUserForm, setShowUserForm] = useState(false);
    const [editingUserIndex, setEditingUserIndex] = useState<number | null>(null);
    const [userForm, setUserForm] = useState<UserFormData>({
        email: "",
        password: "",
        isPrimary: false
    });
    const [showPasswords, setShowPasswords] = useState<{ [key: number]: boolean }>({});
    const [userFormErrors, setUserFormErrors] = useState<{ [key: string]: string }>({});

    // Reset form when drawer opens/closes or roleData changes
    useEffect(() => {
        if (isOpen) {
            if (roleData) {
                setForm({ ...roleData });
            } else {
                setForm({
                    name: "",
                    description: "",
                    permissions: [],
                    users: []
                });
            }
            setErrors({});
            setHasUnsavedChanges(false);
            setPermissionSearch("");
            setSelectedPermissionCategory("all");
            setShowUserForm(false);
            setEditingUserIndex(null);
            setUserForm({ email: "", password: "", isPrimary: false });
            setShowPasswords({});
            setUserFormErrors({});
        }
    }, [isOpen, roleData]);

    // Track changes for unsaved changes warning
    useEffect(() => {
        if (isOpen && roleData) {
            const hasChanges = JSON.stringify(form) !== JSON.stringify(roleData);
            setHasUnsavedChanges(hasChanges);
        } else if (isOpen && !roleData) {
            const hasChanges = Boolean(form.name || form.description || form.permissions.length > 0 || form.users.length > 0);
            setHasUnsavedChanges(hasChanges);
        }
    }, [form, roleData, isOpen]);

    // User form validation
    const validateUserForm = useCallback((): boolean => {
        const newErrors: { [key: string]: string } = {};

        // Email validation
        if (!userForm.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.email)) {
            newErrors.email = "Invalid email format";
        } else {
            // Check for duplicate email
            const isDuplicate = form.users.some((user, index) => 
                user.email.toLowerCase() === userForm.email.toLowerCase() && 
                index !== editingUserIndex
            );
            if (isDuplicate) {
                newErrors.email = "A user with this email already exists";
            }
        }

        // Password validation (only required for new users)
        if (editingUserIndex === null && !userForm.password.trim()) {
            newErrors.password = "Password is required";
        } else if (userForm.password && userForm.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        // Primary user validation
        if (userForm.isPrimary) {
            const existingPrimary = form.users.find((user, index) => 
                user.isPrimary && index !== editingUserIndex
            );
            if (existingPrimary) {
                newErrors.isPrimary = "Only one primary user is allowed per role";
            }
        }

        setUserFormErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [userForm, form.users, editingUserIndex]);

    // Main form validation
    const validateForm = useCallback((): ValidationErrors => {
        const newErrors: ValidationErrors = {};

        // Name validation
        if (!form.name.trim()) {
            newErrors.name = "Role name is required";
        } else if (form.name.length > maxRoleNameLength) {
            newErrors.name = `Role name must be ${maxRoleNameLength} characters or less`;
        } else if (!/^[a-zA-Z0-9\s_-]+$/.test(form.name)) {
            newErrors.name = "Role name can only contain letters, numbers, spaces, hyphens, and underscores";
        } else {
            // Check for duplicate names
            const isDuplicate = existingRoles.some((role, index) =>
                role.name.toLowerCase() === form.name.toLowerCase() &&
                (mode === "add" || index !== roleIndex)
            );
            if (isDuplicate) {
                newErrors.name = "A role with this name already exists";
            }
        }

        // Description validation
        if (form.description && form.description.length > maxDescriptionLength) {
            newErrors.description = `Description must be ${maxDescriptionLength} characters or less`;
        }

        // Permissions validation
        if (form.permissions.length === 0) {
            newErrors.permissions = "At least one permission must be selected";
        }

        return newErrors;
    }, [form, existingRoles, mode, roleIndex, maxRoleNameLength, maxDescriptionLength]);

    // Real-time validation
    useEffect(() => {
        if (hasUnsavedChanges) {
            const newErrors = validateForm();
            setErrors(newErrors);
        }
    }, [form, hasUnsavedChanges, validateForm]);

    const togglePermission = (perm: PermissionsRoles) => {
        const exists = form.permissions.some(p => p.id === perm.id);
        const updatedPermissions = exists
            ? form.permissions.filter(p => p.id !== perm.id)
            : [...form.permissions, perm];

        setForm({ ...form, permissions: updatedPermissions });
    };

    const handleAddUser = () => {
        setEditingUserIndex(null);
        setUserForm({ email: "", password: "", isPrimary: false });
        setUserFormErrors({});
        setShowUserForm(true);
    };

    const handleEditUser = (index: number) => {
        const user = form.users[index];
        setEditingUserIndex(index);
        setUserForm({
            email: user.email,
            password: user.password || "",
            isPrimary: user.isPrimary || false
        });
        setUserFormErrors({});
        setShowUserForm(true);
    };

    const handleDeleteUser = (index: number) => {
        const updatedUsers = form.users.filter((_, i) => i !== index);
        setForm({ ...form, users: updatedUsers });
    };

    const handleUserSubmit = () => {
        if (!validateUserForm()) return;

        const newUser: RoleUser = {
            email: userForm.email,
            password: userForm.password || undefined,
            isPrimary: userForm.isPrimary || undefined
        };

        let updatedUsers;
        if (editingUserIndex !== null) {
            updatedUsers = [...form.users];
            updatedUsers[editingUserIndex] = newUser;
        } else {
            updatedUsers = [...form.users, newUser];
        }

        setForm({ ...form, users: updatedUsers });
        setShowUserForm(false);
        setEditingUserIndex(null);
        setUserForm({ email: "", password: "", isPrimary: false });
    };

    const handleCancelUserForm = () => {
        setShowUserForm(false);
        setEditingUserIndex(null);
        setUserForm({ email: "", password: "", isPrimary: false });
        setUserFormErrors({});
    };

    const togglePasswordVisibility = (index: number) => {
        setShowPasswords(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const handleSave = async () => {
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await onSubmit(form, roleIndex);
            onClose();
        } catch (error) {
            setErrors({ general: "Failed to save role. Please try again." });
        }
    };

    const handleClose = () => {
        if (hasUnsavedChanges) {
            const confirmClose = window.confirm("You have unsaved changes. Are you sure you want to close?");
            if (!confirmClose) return;
        }
        onClose();
    };

    // Extract category from permission name (e.g., "USER_CREATE" -> "USER")
    const getPermissionCategory = (permissionName: string): string => {
        const parts = permissionName.split('_');
        return parts.length > 1 ? parts[0].toLowerCase() : 'general';
    };

    // Filter permissions based on search and category
    const filteredPermissions = allPermissions.filter(perm => {
        const matchesSearch = perm.name.toLowerCase().includes(permissionSearch.toLowerCase()) ||
            perm.description?.toLowerCase().includes(permissionSearch.toLowerCase());

        const permCategory = getPermissionCategory(perm.name);
        const matchesCategory = selectedPermissionCategory === "all" ||
            permCategory === selectedPermissionCategory;

        return matchesSearch && matchesCategory;
    });

    // Get unique categories for filter
    const permissionCategories = [...new Set(allPermissions.map(p => getPermissionCategory(p.name)))]
        .sort();

    const selectedPermissionsCount = form.permissions.length;
    const totalPermissionsCount = allPermissions.length;

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={handleClose}>
                <Transition.Child
                    as={Fragment}
                    enter="transition-opacity ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 flex justify-end">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-200 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="translate-x-full"
                        >
                            <Dialog.Panel className="w-screen max-w-2xl bg-white shadow-xl flex flex-col h-full">
                                {/* Header */}
                                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-blue-600" />
                                        <Dialog.Title className="text-lg font-semibold text-gray-900">
                                            {mode === "add" ? "Add New Role" : "Edit Role"}
                                        </Dialog.Title>
                                        {hasUnsavedChanges && (
                                            <div className="w-2 h-2 bg-orange-500 rounded-full" title="Unsaved changes" />
                                        )}
                                    </div>
                                    <button
                                        onClick={handleClose}
                                        className="text-gray-500 hover:text-gray-800 transition-colors"
                                        disabled={isLoading}
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Form Content */}
                                <div className="flex-1 overflow-y-auto p-6">
                                    {/* General Error */}
                                    {errors.general && (
                                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4 text-red-600" />
                                            <span className="text-sm text-red-700">{errors.general}</span>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Left Column - Basic Info */}
                                        <div className="space-y-6">
                                            {/* Role Name */}
                                            <div>
                                                <FormInput
                                                    label="Role Name"
                                                    value={form.name}
                                                    onChange={(val) => setForm({ ...form, name: val })}
                                                    required
                                                    error={errors.name}
                                                    maxLength={maxRoleNameLength}
                                                    placeholder="Enter role name"
                                                    disabled={isLoading}
                                                />
                                            </div>

                                            {/* Description */}
                                            <div>
                                                <FormInput
                                                    label="Description"
                                                    value={form.description || ""}
                                                    onChange={(val) => setForm({ ...form, description: val })}
                                                    error={errors.description}
                                                    maxLength={maxDescriptionLength}
                                                    placeholder="Enter role description (optional)"
                                                    disabled={isLoading}
                                                />
                                            </div>

                                            {/* Permissions Section */}
                                            <div>
                                                <div className="flex justify-between items-center mb-3">
                                                    <label className="text-sm font-medium text-gray-700">
                                                        Permissions
                                                        <span className="text-red-500 ml-1">*</span>
                                                    </label>
                                                    <span className="text-sm text-gray-500">
                                                        {selectedPermissionsCount}/{totalPermissionsCount} selected
                                                    </span>
                                                </div>

                                                {errors.permissions && (
                                                    <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                                                        {errors.permissions}
                                                    </div>
                                                )}

                                                {/* Permission Search and Filter */}
                                                <div className="mb-4 space-y-2">
                                                    <div className="relative">
                                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                        <input
                                                            type="text"
                                                            placeholder="Search permissions..."
                                                            value={permissionSearch}
                                                            onChange={(e) => setPermissionSearch(e.target.value)}
                                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            disabled={isLoading}
                                                        />
                                                    </div>

                                                    {permissionCategories.length > 0 && (
                                                        <select
                                                            value={selectedPermissionCategory}
                                                            onChange={(e) => setSelectedPermissionCategory(e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            disabled={isLoading}
                                                        >
                                                            <option value="all">All Categories</option>
                                                            {permissionCategories.map(category => (
                                                                <option key={category} value={category}>
                                                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    )}
                                                </div>

                                                {/* Permissions Grid */}
                                                <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-md p-3">
                                                    {filteredPermissions.length === 0 ? (
                                                        <div className="text-center py-8 text-gray-500">
                                                            <Shield className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                                            <p>No permissions found</p>
                                                        </div>
                                                    ) : (
                                                        <div className="grid grid-cols-1 gap-2">
                                                            {filteredPermissions.map((perm) => {
                                                                const selected = form.permissions.find(p => p.id === perm.id);
                                                                return (
                                                                    <label
                                                                        key={perm.id}
                                                                        className={`flex items-center p-2 rounded border cursor-pointer transition-colors ${selected
                                                                            ? "bg-blue-50 border-blue-300"
                                                                            : "bg-white border-gray-200 hover:bg-gray-50"
                                                                            }`}
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={!!selected}
                                                                            onChange={() => togglePermission(perm)}
                                                                            className="mr-3 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                                                            disabled={isLoading}
                                                                        />
                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="font-medium text-sm text-gray-900">
                                                                                {perm.name.replace(/_/g, " ")}
                                                                            </div>
                                                                            {perm.description && (
                                                                                <div className="text-xs text-gray-500 mt-1">
                                                                                    {perm.description}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </label>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Column - User Management */}
                                        <div className="space-y-6">
                                            {/* Users Section */}
                                            <div>
                                                <div className="flex justify-between items-center mb-3">
                                                    <label className="text-sm font-medium text-gray-700">
                                                        Users ({form.users.length})
                                                    </label>
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        icon={UserPlus}
                                                        onClick={handleAddUser}
                                                        disabled={isLoading}
                                                    >
                                                        Add User
                                                    </Button>
                                                </div>

                                                {/* User List */}
                                                <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-md">
                                                    {form.users.length === 0 ? (
                                                        <div className="text-center py-8 text-gray-500">
                                                            <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                                            <p>No users assigned</p>
                                                            <p className="text-sm">Click "Add User" to assign users to this role</p>
                                                        </div>
                                                    ) : (
                                                        <div className="divide-y divide-gray-200">
                                                            {form.users.map((user, index) => (
                                                                <div key={index} className="p-3 hover:bg-gray-50">
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="flex-shrink-0">
                                                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                                                    <Mail className="w-4 h-4 text-blue-600" />
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex-1 min-w-0">
                                                                                <div className="flex items-center gap-2">
                                                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                                                        {user.email}
                                                                                    </p>
                                                                                    {user.isPrimary && (
                                                                                        <Crown className="w-4 h-4 text-yellow-500" title="Primary user" />
                                                                                    )}
                                                                                </div>
                                                                                {user.password && (
                                                                                    <div className="flex items-center gap-2 mt-1">
                                                                                        <Key className="w-3 h-3 text-gray-400" />
                                                                                        <span className="text-xs text-gray-500">
                                                                                            {showPasswords[index] ? user.password : '••••••••'}
                                                                                        </span>
                                                                                        <button
                                                                                            onClick={() => togglePasswordVisibility(index)}
                                                                                            className="text-gray-400 hover:text-gray-600"
                                                                                        >
                                                                                            {showPasswords[index] ? 
                                                                                                <EyeOff className="w-3 h-3" /> : 
                                                                                                <Eye className="w-3 h-3" />
                                                                                            }
                                                                                        </button>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-center gap-1">
                                                                            <button
                                                                                onClick={() => handleEditUser(index)}
                                                                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                                                                disabled={isLoading}
                                                                            >
                                                                                <Edit className="w-4 h-4" />
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleDeleteUser(index)}
                                                                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                                                                disabled={isLoading}
                                                                            >
                                                                                <Trash2 className="w-4 h-4" />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* User Form Modal */}
                                                {showUserForm && (
                                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                                        <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                                                            <h3 className="text-lg font-semibold mb-4">
                                                                {editingUserIndex !== null ? 'Edit User' : 'Add User'}
                                                            </h3>
                                                            
                                                            <div className="space-y-4">
                                                                <div>
                                                                    <FormInput
                                                                        label="Email"
                                                                        value={userForm.email}
                                                                        onChange={(val) => setUserForm({ ...userForm, email: val })}
                                                                        required
                                                                        error={userFormErrors.email}
                                                                        placeholder="Enter email address"
                                                                        disabled={isLoading}
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <FormInput
                                                                        label="Password"
                                                                        type="password"
                                                                        value={userForm.password}
                                                                        onChange={(val) => setUserForm({ ...userForm, password: val })}
                                                                        required={editingUserIndex === null}
                                                                        error={userFormErrors.password}
                                                                        placeholder={editingUserIndex !== null ? "Leave blank to keep current password" : "Enter password"}
                                                                        disabled={isLoading}
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <label className="flex items-center gap-2">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={userForm.isPrimary}
                                                                            onChange={(e) => setUserForm({ ...userForm, isPrimary: e.target.checked })}
                                                                            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                                                            disabled={isLoading}
                                                                        />
                                                                        <span className="text-sm text-gray-700">Primary user</span>
                                                                    </label>
                                                                    {userFormErrors.isPrimary && (
                                                                        <p className="text-sm text-red-600 mt-1">{userFormErrors.isPrimary}</p>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="flex justify-end gap-3 mt-6">
                                                                <Button
                                                                    variant="secondary"
                                                                    onClick={handleCancelUserForm}
                                                                    disabled={isLoading}
                                                                >
                                                                    Cancel
                                                                </Button>
                                                                <Button
                                                                    onClick={handleUserSubmit}
                                                                    disabled={isLoading}
                                                                >
                                                                    {editingUserIndex !== null ? 'Update' : 'Add'} User
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="border-t border-gray-200 p-6">
                                    <div className="flex justify-end space-x-3">
                                        <Button
                                            variant="secondary"
                                            onClick={handleClose}
                                            disabled={isLoading}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            icon={Save}
                                            onClick={handleSave}
                                            disabled={isLoading || Object.keys(errors).length > 0}
                                            loading={isLoading}
                                        >
                                            {isLoading ? "Saving..." : "Save Role"}
                                        </Button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default RoleDrawer;