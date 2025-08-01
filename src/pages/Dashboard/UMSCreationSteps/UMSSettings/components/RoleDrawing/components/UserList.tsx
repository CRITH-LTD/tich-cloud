import React from 'react';
import { Users, Mail, Key, Edit, Trash2, Eye, EyeOff, Crown } from "lucide-react";
import { RoleUser } from '../../../../../../../interfaces/types';

interface UserListProps {
    users: RoleUser[];
    onEditUser: (index: number) => void;
    onDeleteUser: (index: number) => void;
    showPasswords: { [key: number]: boolean };
    onTogglePasswordVisibility: (index: number) => void;
    disabled?: boolean;
}

export const UserList: React.FC<UserListProps> = ({
    users,
    onEditUser,
    onDeleteUser,
    showPasswords,
    onTogglePasswordVisibility,
    disabled = false
}) => {
    if (users.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>No users assigned</p>
                <p className="text-sm">Click "Add User" to assign users to this role</p>
            </div>
        );
    }

    return (
        <div className="divide-y divide-gray-200">
            {users.map((user, index) => (
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
                                            onClick={() => onTogglePasswordVisibility(index)}
                                            className="text-gray-400 hover:text-gray-600"
                                            disabled={disabled}
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
                                onClick={() => onEditUser(index)}
                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                disabled={disabled}
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onDeleteUser(index)}
                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                disabled={disabled}
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};