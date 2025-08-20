import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { useCreateUMS, usePermissions } from "../dashboard.hooks";
import { PermissionsRoles } from "../../../interfaces/types";

const StepTwo: React.FC = () => {
    const {
        form,
        updateField,
        addRole,
        updateRole,
        removeRole,
        addUserToRole,
        updateUserInRole,
        removeUserFromRole,
    } = useCreateUMS();

    const { permissions, loading, error, getAllPermissions } = usePermissions();

    // Get all permissions as a flat array for easier handling
    const allPermissions = getAllPermissions();

    const handlePermissionChange = (roleIndex: number, selectedIds: string[]) => {
        const selectedPermObjects = allPermissions.filter((p) => selectedIds.includes(p.id));
        updateRole(roleIndex, { permissions: selectedPermObjects });
    };

    // Group permissions by module for better organization in the UI
    const groupedPermissions = permissions ? Object.entries(permissions).map(([module, perms]) => ({
        module: module.charAt(0).toUpperCase() + module.slice(1), // Capitalize module name
        permissions: perms
    })) : [];

    return (
        <div className="space-y-8 mx-auto p-6 bg-gray-50 rounded-md shadow-sm border border-gray-200">
            {/* Admin Info */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Root Admin Setup</h2>

                <InputField
                    label="Admin Full Name"
                    value={form.adminName}
                    onChange={(e) => updateField("adminName", e.target.value)}
                    placeholder="Dr. Felicia Mbah"
                />

                <InputField
                    label="Root Admin Email"
                    value={form.adminEmail}
                    placeholder="admin@yourdomain.edu"
                    readOnly
                    disabled
                />

                <InputField
                    label="Recovery Phone Number"
                    value={form.adminPhone}
                    onChange={(e) => updateField("adminPhone", e.target.value)}
                    placeholder="+237 6XX XXX XXX"
                />

                <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                        type="checkbox"
                        checked={form.enable2FA}
                        onChange={() => updateField("enable2FA", !form.enable2FA)}
                        className="accent-blue-600"
                    />
                    Enable Two-Factor Authentication (2FA)
                </label>
            </section>

            {/* Roles */}
            <section>
                <h3 className="text-xl font-medium text-gray-800 mb-4">Create Role(s)</h3>

                {form.roles.map((role, roleIndex) => (
                    <div key={roleIndex} className="bg-white p-6 rounded-lg mb-9 shadow-[rgba(9,30,66,0.25)_0px_1px_1px,rgba(9,30,66,0.13)_0px_0px_1px_1px] border space-y-4">
                        <div className="flex items-center justify-between">
                            <input
                                type="text"
                                value={role.name}
                                onChange={(e) => updateRole(roleIndex, { name: e.target.value })}
                                placeholder="Role name (e.g., Registrar)"
                                className="flex-1 border rounded-md px-4 py-2 text-sm focus:ring focus:ring-blue-100 focus:border-blue-400"
                            />
                            <button
                                onClick={() => removeRole(roleIndex)}
                                className="ml-4 text-red-500 hover:text-red-600"
                                title="Remove role"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>

                        <input
                            type="text"
                            value={role.description || ""}
                            onChange={(e) => updateRole(roleIndex, { description: e.target.value })}
                            placeholder="Role description"
                            className="w-full border rounded-md px-4 py-2 text-sm focus:ring focus:ring-blue-100 focus:border-blue-400"
                        />

                        {/* Permissions */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Assign Permissions</label>

                            {loading ? (
                                <div className="w-full h-40 border rounded-md bg-gray-100 flex items-center justify-center">
                                    <span className="text-gray-500">Loading permissions...</span>
                                </div>
                            ) : error ? (
                                <div className="w-full h-40 border rounded-md bg-red-50 flex items-center justify-center">
                                    <span className="text-red-500">Error loading permissions: {error}</span>
                                </div>
                            ) : (
                                <select
                                    multiple
                                    value={role.permissions.map((p) => p.id)}
                                    onChange={(e) =>
                                        handlePermissionChange(
                                            roleIndex,
                                            Array.from(e.target.selectedOptions).map((opt) => opt.value)
                                        )
                                    }
                                    className="w-full h-40 border rounded-md bg-white px-4 py-2 text-sm focus:ring focus:ring-blue-100 focus:border-blue-400"
                                >
                                    {groupedPermissions.map((group) => (
                                        <optgroup key={group.module} label={`${group.module} Permissions`}>
                                            {group.permissions.map((permission: PermissionsRoles) => (
                                                <option key={permission.id} value={permission.id}>
                                                    {permission.name.replace(/_/g, ' ').toUpperCase()} — {permission.description}
                                                </option>
                                            ))}
                                        </optgroup>
                                    ))}
                                </select>
                            )}

                            <p className="text-xs text-gray-500 mt-1">
                                Hold Ctrl (or ⌘) to select multiple permissions.
                            </p>
                        </div>

                        {/* Selected Permissions Preview */}
                        {role.permissions.length > 0 && (
                            <div className="mt-3">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Permissions:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {role.permissions.map((permission) => (
                                        <span
                                            key={permission.id}
                                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                                        >
                                            {permission.name.replace(/_/g, ' ')}
                                            <button
                                                onClick={() => {
                                                    const updatedPermissions = role.permissions.filter(p => p.id !== permission.id);
                                                    updateRole(roleIndex, { permissions: updatedPermissions });
                                                }}
                                                className="ml-1 text-blue-600 hover:text-blue-800"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Users */}
                        {role.users.map((user, userIndex) => (
                            <div key={userIndex} className="pt-3 border-t space-y-2">
                                <div className="flex gap-3 items-center">
                                    <input
                                        type="email"
                                        value={user.email}
                                        onChange={(e) => updateUserInRole(roleIndex, userIndex, { email: e.target.value })}
                                        className="flex-1 border rounded-md px-4 py-2 text-sm focus:ring focus:ring-blue-100 focus:border-blue-400"
                                        placeholder="User email"
                                    />
                                    <button
                                        onClick={() => removeUserFromRole(roleIndex, userIndex)}
                                        className="text-xs text-red-600 hover:underline"
                                    >
                                        Remove
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    value={user.password || ""}
                                    onChange={(e) => updateUserInRole(roleIndex, userIndex, { password: e.target.value })}
                                    className="w-full border rounded-md px-4 py-2 text-sm focus:ring focus:ring-blue-100 focus:border-blue-400"
                                    placeholder="Password (optional)"
                                />
                                <label className="text-xs text-gray-600 flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={user.isPrimary || false}
                                        onChange={(e) => updateUserInRole(roleIndex, userIndex, { isPrimary: e.target.checked })}
                                    />
                                    Primary Contact
                                </label>
                            </div>
                        ))}

                        <button
                            onClick={() =>
                                addUserToRole(roleIndex, {
                                    email: "",
                                    password: "",
                                    isPrimary: false,
                                })
                            }
                            className="text-sm text-blue-600 hover:underline mt-1"
                        >
                            + Add User
                        </button>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={() => addRole()}
                    className="mt-6 inline-flex items-center gap-2 text-sm text-blue-700 hover:text-blue-900 font-medium"
                >
                    <Plus size={16} /> Add another Role
                </button>
            </section>
        </div>
    );
};

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, ...props }) => (
    <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            {...props}
            className={`w-full border px-4 py-2 rounded-md text-sm focus:ring focus:ring-blue-100 focus:border-blue-400 ${props.disabled ? "bg-gray-100 text-gray-500" : ""
                }`}
        />
    </div>
);

export default StepTwo;