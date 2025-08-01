import React from 'react';
import { UserPlus } from "lucide-react";;
import { UserList } from './UserList';
import { UserFormModal } from './UserFormModal';
import { Button } from '../../common';
import { RoleUser } from '../../../../../../../interfaces/types';

interface UserManagementProps {
    users: RoleUser[];
    showUserForm: boolean;
    editingUserIndex: number | null;
    userForm: {
        email: string;
        password: string;
        isPrimary: boolean;
    };
    showPasswords: { [key: number]: boolean };
    userFormErrors: { [key: string]: string };
    onAddUser: () => void;
    onEditUser: (index: number) => void;
    onDeleteUser: (index: number) => void;
    onUserSubmit: () => void;
    onCancelUserForm: () => void;
    onTogglePasswordVisibility: (index: number) => void;
    onUserFormChange: (updates: any) => void;
    disabled?: boolean;
}

export const UserManagement: React.FC<UserManagementProps> = ({
    users,
    showUserForm,
    editingUserIndex,
    userForm,
    showPasswords,
    userFormErrors,
    onAddUser,
    onEditUser,
    onDeleteUser,
    onUserSubmit,
    onCancelUserForm,
    onTogglePasswordVisibility,
    onUserFormChange,
    disabled = false
}) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium text-gray-700">
                    Users ({users.length})
                </label>
                <Button
                    variant="secondary"
                    size="sm"
                    icon={UserPlus}
                    onClick={onAddUser}
                    disabled={disabled}
                >
                    Add User
                </Button>
            </div>

            <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-md">
                <UserList
                    users={users}
                    onEditUser={onEditUser}
                    onDeleteUser={onDeleteUser}
                    showPasswords={showPasswords}
                    onTogglePasswordVisibility={onTogglePasswordVisibility}
                    disabled={disabled}
                />
            </div>

            <UserFormModal
                isOpen={showUserForm}
                isEditing={editingUserIndex !== null}
                userForm={userForm}
                errors={userFormErrors}
                onUserFormChange={onUserFormChange}
                onSubmit={onUserSubmit}
                onCancel={onCancelUserForm}
                disabled={disabled}
            />
        </div>
    );
};