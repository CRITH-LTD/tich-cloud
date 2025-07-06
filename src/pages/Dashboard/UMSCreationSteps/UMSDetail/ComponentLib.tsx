
import { UMSForm } from "../../../../interfaces/types";
import { 
    ChevronDown, 
    ChevronUp, 
    Users, 
    Shield, 
    Building, 
    Key
} from "lucide-react";

/* ─────────────────────── Component Library ─────────────────────── */

interface InfoCardProps {
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
}

export const InfoCard: React.FC<InfoCardProps> = ({ title, icon: Icon, children }) => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="p-6">
            <div className="flex items-center space-x-2 mb-4">
                <Icon className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            {children}
        </div>
    </div>
);

interface StatCardProps {
    icon: React.ElementType;
    label: string;
    value: string;
    isLink?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, isLink }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Icon className="h-5 w-5 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
                {isLink && value !== "Not provided" ? (
                    <a 
                        href={value.startsWith('http') ? value : `https://${value}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 truncate block"
                    >
                        {value}
                    </a>
                ) : (
                    <p className="text-sm font-medium text-gray-900 truncate">{value}</p>
                )}
            </div>
        </div>
    </div>
);

interface StatusBadgeProps {
    status: "secure" | "basic";
    label: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => (
    <span className={`
        inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
        ${status === "secure" 
            ? "bg-green-100 text-green-800" 
            : "bg-yellow-100 text-yellow-800"
        }
    `}>
        {status === "secure" ? (
            <Shield className="h-3 w-3 mr-1" />
        ) : (
            <Key className="h-3 w-3 mr-1" />
        )}
        {label}
    </span>
);

interface TypeBadgeProps {
    type: string;
}

export const TypeBadge: React.FC<TypeBadgeProps> = ({ type }) => (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        <Building className="h-3 w-3 mr-1" />
        {type || "Standard"}
    </span>
);

interface PlatformItemProps {
    icon: React.ElementType;
    label: string;
    status: "active" | "inactive";
}

export const PlatformItem: React.FC<PlatformItemProps> = ({ icon: Icon, label, status }) => (
    <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
            <Icon className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">{label}</span>
        </div>
        <span className={`
            inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
            ${status === "active" 
                ? "bg-green-100 text-green-800" 
                : "bg-gray-100 text-gray-800"
            }
        `}>
            {status === "active" ? "Active" : "Inactive"}
        </span>
    </div>
);

interface ContactItemProps {
    icon: React.ElementType;
    label: string;
    value?: string | null;
    status?: "success" | "warning" | "default";
}

export const ContactItem: React.FC<ContactItemProps> = ({ icon: Icon, label, value, status = "default" }) => (
    <div className="flex items-center space-x-3">
        <Icon className="h-4 w-4 text-gray-500 flex-shrink-0" />
        <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500">{label}</p>
            <p className={`
                text-sm font-medium truncate
                ${status === "success" ? "text-green-600" : 
                  status === "warning" ? "text-yellow-600" : 
                  "text-gray-900"}
            `}>
                {value || "Not provided"}
            </p>
        </div>
    </div>
);

interface RoleCardProps {
    role: UMSForm["roles"][number];
    isOpen: boolean;
    onToggle: () => void;
}

export const RoleCard: React.FC<RoleCardProps> = ({ role, isOpen, onToggle }) => (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
            onClick={onToggle}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-150"
        >
            <div className="flex items-center space-x-3">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="font-medium text-gray-900">{role.name}</span>
                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                    {role.users?.length || 0} users
                </span>
            </div>
            {isOpen ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
        </button>
        
        {isOpen && (
            <div className="p-4 bg-white border-t border-gray-200">
                {role.description && (
                    <p className="text-sm text-gray-600 mb-4">{role.description}</p>
                )}
                
                {/* Permissions */}
                <div className="mb-4">
                    <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">Permissions</h5>
                    <div className="flex flex-wrap gap-2">
                        {role.permissions?.map((perm) => (
                            <span
                                key={perm.id}
                                className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                                {perm.name.replace("_", " ")}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Users */}
                <div>
                    <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">Assigned Users</h5>
                    {role.users?.length ? (
                        <div className="space-y-2">
                            {role.users.map((user) => (
                                <div key={user.email} className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700">{user.email}</span>
                                    {user.isPrimary && (
                                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                            Primary
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-gray-500">No users assigned</p>
                    )}
                </div>
            </div>
        )}
    </div>
);
