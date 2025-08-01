import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
    X,
    Save,
    AlertCircle,
    Shield
} from "lucide-react";
import React from "react";
import { Role, PermissionsRoles } from "../../../../../../interfaces/types";
import { PermissionSelector } from "./components/PermissionSelector";
import { RoleBasicInfo } from "./components/RoleBasicInfo";
import { UserManagement } from "./components/serManagement";
import { usePermissionFilter } from "./hooks/usePermissionFilter";
import { useRoleForm } from "./hooks/useRoleForm";
import { useUserManagement } from "./hooks/useUserManagement";
import { Button } from "../common";

interface RoleDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    mode: "add" | "edit";
    roleIndex?: number;
    roleData?: Role;
    allPermissions: PermissionsRoles[];
    existingRoles?: Role[];
    onSubmit: (role: Role, index?: number) => void;
    isLoading?: boolean;
    maxRoleNameLength?: number;
    maxDescriptionLength?: number;
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
    const {
        form,
        errors,
        hasUnsavedChanges,
        setErrors,
        togglePermission,
        selectAllPermissions,
        deselectAllPermissions,
        areAllPermissionsSelected,
        areSomePermissionsSelected,
        updateForm,
        validate
    } = useRoleForm({
        initialData: isOpen ? roleData : undefined,
        existingRoles,
        maxRoleNameLength,
        maxDescriptionLength,
        mode,
        roleIndex
    });

    const userManagement = useUserManagement(
        form.users,
        (users) => updateForm({ users })
    );

    const permissionFilter = usePermissionFilter(allPermissions);

    // Reset everything when drawer opens
    React.useEffect(() => {
        if (isOpen) {
            userManagement.resetForm();
            permissionFilter.resetFilters();
        }
    }, [isOpen]);

    const handleSave = async () => {
        if (!validate()) return;

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
                                        {/* Left Column - Basic Info & Permissions */}
                                        <div className="space-y-6">
                                            <RoleBasicInfo
                                                name={form.name}
                                                description={form.description || ""}
                                                onNameChange={(value) => updateForm({ name: value })}
                                                onDescriptionChange={(value) => updateForm({ description: value })}
                                                nameError={errors.name}
                                                descriptionError={errors.description}
                                                maxRoleNameLength={maxRoleNameLength}
                                                maxDescriptionLength={maxDescriptionLength}
                                                disabled={isLoading}
                                            />

                                            <PermissionSelector
                                                allPermissions={allPermissions}
                                                selectedPermissions={form.permissions}
                                                onTogglePermission={togglePermission}
                                                onSelectAllPermissions={selectAllPermissions}
                                                onDeselectAllPermissions={deselectAllPermissions}
                                                areAllPermissionsSelected={areAllPermissionsSelected}
                                                areSomePermissionsSelected={areSomePermissionsSelected}
                                                permissionSearch={permissionFilter.permissionSearch}
                                                onSearchChange={permissionFilter.setPermissionSearch}
                                                selectedCategory={permissionFilter.selectedPermissionCategory}
                                                onCategoryChange={permissionFilter.setSelectedPermissionCategory}
                                                categories={permissionFilter.permissionCategories}
                                                filteredPermissions={permissionFilter.filteredPermissions}
                                                currentCategoryPermissions={permissionFilter.currentCategoryPermissions}
                                                error={errors.permissions}
                                                disabled={isLoading}
                                            />
                                        </div>

                                        {/* Right Column - User Management */}
                                        <div className="space-y-6">
                                            <UserManagement
                                                users={form.users}
                                                showUserForm={userManagement.showUserForm}
                                                editingUserIndex={userManagement.editingUserIndex}
                                                userForm={userManagement.userForm}
                                                showPasswords={userManagement.showPasswords}
                                                userFormErrors={userManagement.userFormErrors}
                                                onAddUser={userManagement.handleAddUser}
                                                onEditUser={userManagement.handleEditUser}
                                                onDeleteUser={userManagement.handleDeleteUser}
                                                onUserSubmit={userManagement.handleUserSubmit}
                                                onCancelUserForm={userManagement.handleCancelUserForm}
                                                onTogglePasswordVisibility={userManagement.togglePasswordVisibility}
                                                onUserFormChange={(updates) => userManagement.setUserForm(prev => ({ ...prev, ...updates }))}
                                                disabled={isLoading}
                                            />
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