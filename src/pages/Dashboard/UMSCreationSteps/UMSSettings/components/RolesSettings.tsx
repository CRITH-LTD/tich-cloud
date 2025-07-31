import { Plus, Key, Edit, Trash2, Users2Icon } from "lucide-react";
import { Card } from "./common";
import { UMSForm } from "../../../../../interfaces/types";

interface RolesSettingsProps {
    formData: UMSForm;
    onAddRole: () => void;
    onEditRole: (index: number) => void;
    onDeleteRole: (index: number) => void;
}

const RolesSettings: React.FC<RolesSettingsProps> = ({
    formData,
    onAddRole,
    onEditRole,
    onDeleteRole
}) => (
    <div className="space-y-6">
        <Card>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Roles & Permissions</h3>
                <button
                    onClick={onAddRole}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <Plus className="h-4 w-4" />
                    <span>Add Role</span>
                </button>
            </div>

            <div className="space-y-4">
                {formData.roles.map((role, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                                <Key className="h-5 w-5 text-blue-600" />
                                <span className="font-medium text-gray-900">{role.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button onClick={() => onEditRole(index)} className="p-1 text-blue-600 hover:text-blue-800">
                                    <Edit className="h-4 w-4" />
                                </button>
                                <button onClick={() => onDeleteRole(index)} className="p-1 text-red-600 hover:text-red-800">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {role.permissions?.map((permission, idx) => (
                                <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                                    {permission.name.replace(/_/g, " ")}
                                </span>
                            ))}
                        </div>

                        {role.users.map((user, idx) => (
                            <div key={idx} className="border mt-5 border-gray-200 rounded-lg p-4">
                                <div className="flex items-center space-x-3">
                                    <Users2Icon className="h-5 w-5 text-blue-600" />
                                    <span className="font-medium text-gray-900">{user.email}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </Card>
    </div>
);

export default RolesSettings;
