import { useCreateUMS } from "../dashboard.hooks";

const StepTwo = () => {
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

    return (
        <div className="space-y-6">
            {/* Admin Full Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Admin Full Name *
                </label>
                <input
                    type="text"
                    value={form.adminName}
                    onChange={(e) => updateField("adminName", e.target.value)}
                    className="w-full border px-4 py-2 rounded"
                    placeholder="Dr. Felicia Mbah"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Used for identity tracking and internal communication.
                </p>
            </div>

            {/* Admin Email */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Root Admin Email *
                </label>
                <input
                    type="email"
                    value={form.adminEmail}
                    readOnly
                    disabled
                    onChange={(e) => updateField("adminEmail", e.target.value)}
                    className="w-full border px-4 py-2 rounded"
                    placeholder="admin@yourdomain.edu"
                />
                <p className="text-xs text-gray-500 mt-1">
                    This is the primary login and alert contact.
                </p>
            </div>

            {/* Recovery Phone */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recovery Phone Number *
                </label>
                <input
                    type="tel"
                    value={form.adminPhone}
                    onChange={(e) => updateField("adminPhone", e.target.value)}
                    className="w-full border px-4 py-2 rounded"
                    placeholder="+237 6XX XXX XXX"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Used for password recovery and 2FA verification.
                </p>
            </div>

            {/* Enable 2FA */}
            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={form.enable2FA}
                    onChange={() => updateField("enable2FA", !form.enable2FA)}
                />
                <label className="text-sm text-gray-700">
                    Enforce Two-Factor Authentication (2FA)
                </label>
            </div>

            {/* Dynamic Roles Section */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Create Role(s) and Assign Users *
                </label>

                {form.roles.map((role, roleIndex) => (
                    <div
                        key={roleIndex}
                        className="border border-gray-300 rounded-md p-4 mb-4 space-y-3 bg-gray-50"
                    >
                        {/* Role Name */}
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={role.name}
                                onChange={(e) =>
                                    updateRole(roleIndex, { name: e.target.value })
                                }
                                placeholder="Role name (e.g., Registrar)"
                                className="w-full border px-3 py-2 rounded"
                            />
                            <button
                                type="button"
                                onClick={() => removeRole(roleIndex)}
                                className="text-red-600 text-xs"
                            >
                                Remove Role
                            </button>
                        </div>

                        {/* Role Description */}
                        <input
                            type="text"
                            value={role.description || ""}
                            onChange={(e) =>
                                updateRole(roleIndex, { description: e.target.value })
                            }
                            placeholder="Role description (optional)"
                            className="w-full border px-3 py-2 rounded"
                        />

                        {/* Users in Role */}
                        {role.users.map((user, userIndex) => (
                            <div key={userIndex} className="space-y-1 border-t pt-2 mt-2">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="email"
                                        value={user.email}
                                        onChange={(e) =>
                                            updateUserInRole(roleIndex, userIndex, {
                                                email: e.target.value,
                                            })
                                        }
                                        className="w-full border px-3 py-2 rounded"
                                        placeholder="user@domain.com"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeUserFromRole(roleIndex, userIndex)}
                                        className="text-red-500 text-xs"
                                    >
                                        Remove User
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    value={user.password || "Auto-generated"}
                                    onChange={(e) =>
                                        updateUserInRole(roleIndex, userIndex, {
                                            password: e.target.value,
                                        })
                                    }
                                    className="w-full border px-3 py-2 rounded"
                                    placeholder="Optional password"
                                />
                                <label className="text-xs text-gray-500 flex items-center gap-1">
                                    <input
                                        type="checkbox"
                                        checked={user.isPrimary || false}
                                        onChange={(e) =>
                                            updateUserInRole(roleIndex, userIndex, {
                                                isPrimary: e.target.checked,
                                            })
                                        }
                                    />
                                    Set as Primary Contact for this Role
                                </label>
                            </div>
                        ))}

                        {/* Add User Button */}
                        <button
                            type="button"
                            onClick={() =>
                                addUserToRole(roleIndex, {
                                    email: "",
                                    password: "",
                                    isPrimary: false,
                                })
                            }
                            className="text-blue-600 text-sm mt-2"
                        >
                            + Add User to this Role
                        </button>
                    </div>
                ))}

                {/* Add New Role Button */}
                <button
                    type="button"
                    onClick={() => addRole()}
                    className="text-blue-700 text-sm"
                >
                    + Add another Role
                </button>
            </div>
        </div>
    );
};

export default StepTwo;
