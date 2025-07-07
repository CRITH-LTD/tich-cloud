import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUMSDetail } from "../../dashboard.hooks";
import { Breadcrumbs } from "../../../../components/Common/Breadcrumbs";
import {
    Globe,
    Users,
    Shield,
    Building,
    Mail,
    Phone,
    CheckCircle,
    XCircle,
    Camera,
    Settings,
    Database,
    Smartphone,
    Monitor,
    Crown,
    Key,
    School2Icon
} from "lucide-react";
import { ContactItem, DepartmentCard, InfoCard, PlatformItem, RoleCard, StatCard, StatusBadge, TypeBadge } from "./ComponentLib";


const UMSDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { ums, isLoading, error, fetchUMS } = useUMSDetail();
    const [openRole, setOpenRole] = useState<number | null>(null);
    const [openDept, setOpenDept] = useState<number | null>(null);

    useEffect(() => {
        if (id) fetchUMS(id);
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-gray-600">Loading UMS details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md">
                    <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading UMS</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    if (!ums) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">UMS not found</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Breadcrumbs />

            <div className="min-h-screen bg-gray-50">
                {/* Header Section */}
                <header className="bg-white rounded-lg border-b border-gray-200 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between py-6">
                            <div className="flex items-center space-x-6">
                                {ums.umsLogoUrl && (
                                    <div className="relative">
                                        <img
                                            src={`http://localhost:8000${ums.umsLogoUrl}`}
                                            alt="UMS Logo"
                                            className="h-16 w-16 rounded-xl object-cover ring-4 ring-blue-100"
                                        />
                                        <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 rounded-full ring-2 ring-white" />
                                    </div>
                                )}
                                <div>
                                    <h1 className="text-3xl text-academic font-bold text-gray-900">{ums.umsName}</h1>
                                    <p className="text-lg text-gray-600 mt-1">
                                        {ums.umsTagline || "Educational Management System"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <StatusBadge
                                    status={ums.enable2FA ? "secure" : "basic"}
                                    label={ums.enable2FA ? "2FA Enabled" : "Basic Auth"}
                                />
                                <TypeBadge type={ums.umsType!} />
                            </div>
                            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <Settings className="h-4 w-4 mr-2" />
                                Settings
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Main Info */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Overview Card */}
                            <InfoCard title="Overview" icon={Building}>
                                <div className="prose prose-sm max-w-none">
                                    <p className="text-gray-700 leading-relaxed">
                                        {ums.umsDescription || "No description provided for this UMS."}
                                    </p>
                                </div>
                            </InfoCard>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <StatCard
                                    icon={Users}
                                    label="Size"
                                    value={ums.umsSize || "Not specified"}
                                />
                                <StatCard
                                    icon={Database}
                                    label="Type"
                                    value={ums.umsType || "Standard"}
                                />
                                <StatCard
                                    icon={Globe}
                                    label="Website"
                                    value={ums.umsWebsite || "Not provided"}
                                    isLink={!!ums.umsWebsite}
                                />
                            </div>

                            {/* Features & Modules */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InfoCard title="Available Modules" icon={Settings}>
                                    {ums.modules?.length ? (
                                        <div className="grid grid-cols-1 gap-2">
                                            {ums.modules.map((module) => (
                                                <div key={module} className="flex items-center space-x-2">
                                                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                                    <span className="text-sm text-gray-700">{module}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-sm">No modules configured</p>
                                    )}
                                </InfoCard>

                                <InfoCard title="Supported Platforms" icon={Monitor}>
                                    <div className="space-y-3">
                                        {ums.platforms?.teacherApp && (
                                            <PlatformItem
                                                icon={Smartphone}
                                                label="Teacher Mobile App"
                                                status="active"
                                            />
                                        )}
                                        {ums.platforms?.studentApp && (
                                            <PlatformItem
                                                icon={Smartphone}
                                                label="Student Mobile App"
                                                status="active"
                                            />
                                        )}
                                        {ums.platforms?.desktopOffices?.map((office) => (
                                            <PlatformItem
                                                key={office}
                                                icon={Monitor}
                                                label={office}
                                                status="active"
                                            />
                                        ))}
                                    </div>
                                </InfoCard>
                            </div>

                            {/* Campus Photo */}
                            {ums.umsPhotoUrl && (
                                <InfoCard title="Campus View" icon={Camera}>
                                    <div className="rounded-lg overflow-hidden">
                                        <img
                                            src={`http://localhost:8000${ums.umsPhotoUrl}`}
                                            alt="Campus"
                                            className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                console.error('Image load error:', target.src);
                                            }}
                                        />
                                    </div>
                                </InfoCard>
                            )}
                        </div>

                        {/* Right Column - Admin & Roles */}
                        <div className="space-y-6">

                            {/* Admin Info */}
                            <InfoCard title="System Administrator" icon={Crown}>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <Crown className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {ums.adminName || "Administrator"}
                                            </p>
                                            <p className="text-sm text-gray-500">Root Access</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-4 border-t border-gray-200">
                                        <ContactItem
                                            icon={Mail}
                                            label="Email"
                                            value={ums.adminEmail}
                                        />
                                        <ContactItem
                                            icon={Phone}
                                            label="Phone"
                                            value={ums.adminPhone}
                                        />
                                        <ContactItem
                                            icon={Shield}
                                            label="2FA Status"
                                            value={ums.enable2FA ? "Enabled" : "Disabled"}
                                            status={ums.enable2FA ? "success" : "warning"}
                                        />
                                    </div>
                                </div>
                            </InfoCard>

                            {/* Roles & Permissions */}
                            <InfoCard title="Roles & Permissions" icon={Key}>
                                <div className="space-y-3">
                                    {ums.roles?.length ? (
                                        ums.roles.map((role, idx) => (
                                            <RoleCard
                                                key={role.name}
                                                role={role}
                                                isOpen={openRole === idx}
                                                onToggle={() => setOpenRole(openRole === idx ? null : idx)}
                                            />
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-sm">No roles configured</p>
                                    )}
                                </div>
                            </InfoCard>
                            {/* Departments */}
                            <InfoCard title="Departments" icon={School2Icon}>
                                <div className="space-y-3">
                                    {ums.departments?.length ? (
                                        ums.departments.map((dept, idx) => (
                                            <DepartmentCard
                                                key={dept.name}
                                                department={dept}
                                                isOpen={openDept === idx}
                                                onToggle={() => setOpenDept(openDept === idx ? null : idx)}
                                            />
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-sm">No Departments created yet.</p>
                                    )}
                                </div>
                            </InfoCard>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default UMSDetailPage;