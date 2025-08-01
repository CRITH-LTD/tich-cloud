import React from 'react';
import { Button, FormInput } from '../../common';

interface UserFormData {
    email: string;
    password: string;
    isPrimary: boolean;
}

interface UserFormModalProps {
    isOpen: boolean;
    isEditing: boolean;
    userForm: UserFormData;
    errors: { [key: string]: string };
    onUserFormChange: (updates: Partial<UserFormData>) => void;
    onSubmit: () => void;
    onCancel: () => void;
    disabled?: boolean;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({
    isOpen,
    isEditing,
    userForm,
    errors,
    onUserFormChange,
    onSubmit,
    onCancel,
    disabled = false
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold mb-4">
                    {isEditing ? 'Edit User' : 'Add User'}
                </h3>

                <div className="space-y-4">
                    <div>
                        <FormInput
                            label="Email"
                            value={userForm.email}
                            onChange={(val) => onUserFormChange({ email: val })}
                            required
                            error={errors.email}
                            placeholder="Enter email address"
                            disabled={disabled}
                        />
                    </div>

                    <div>
                        <FormInput
                            label="Password"
                            type="password"
                            value={userForm.password}
                            onChange={(val) => onUserFormChange({ password: val })}
                            required={!isEditing}
                            error={errors.password}
                            placeholder={isEditing ? "Leave blank to keep current password" : "Enter password"}
                            disabled={disabled}
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={userForm.isPrimary}
                                onChange={(e) => onUserFormChange({ isPrimary: e.target.checked })}
                                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                disabled={disabled}
                            />
                            <span className="text-sm text-gray-700">Primary user</span>
                        </label>
                        {errors.isPrimary && (
                            <p className="text-sm text-red-600 mt-1">{errors.isPrimary}</p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <Button
                        variant="secondary"
                        onClick={onCancel}
                        disabled={disabled}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onSubmit}
                        disabled={disabled}
                    >
                        {isEditing ? 'Update' : 'Add'} User
                    </Button>
                </div>
            </div>
        </div>
    );
};