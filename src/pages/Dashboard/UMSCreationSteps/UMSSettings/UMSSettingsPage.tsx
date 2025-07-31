import React, { useState } from "react";
import {
    useCreateUMS,
    usePermissions,
    useUMSDetail,
    useUMSSettings
} from "../../dashboard.hooks";
import { Breadcrumbs } from "../../../../components/Common/Breadcrumbs";
import {
    DangerZone,
    GeneralSettings,
    AdminSettings,
    SecuritySettings,
    ModulesSettings,
    DepartmentsSettings,
    RolesSettings,
    SettingsLayout,
    ErrorMessage,
    LoadingSpinner,
    RoleDrawer
} from "./components/common";
import { XCircle } from "lucide-react";
import { Role } from "../../../../interfaces/types";

const UMSSettingsPage: React.FC = () => {
    const { isLoading, error } = useUMSDetail();

    const {
        activeTab,
        setActiveTab,
        // showPassword,
        // setShowPassword,
        unsavedChanges,
        tabs,
        formData,
        currentUMS: ums,
        handleSave,
        handleInputChange
    } = useUMSSettings();

    const {
        addRole,
        updateRole,
        removeRole,
        addUserToRole,
        updateUserInRole,
        removeUserFromRole
    } = useCreateUMS();

    const { getAllPermissions } = usePermissions();
    const allPermissions = getAllPermissions();

    // Role drawer state
    const [roleDrawerOpen, setRoleDrawerOpen] = useState(false);
    const [editingRoleIndex, setEditingRoleIndex] = useState<number | null>(null);
    const [editingRoleData, setEditingRoleData] = useState<Role | null>(null);
    const [roleSubmissionLoading, setRoleSubmissionLoading] = useState(false);

    const openRoleDrawer = (role?: Role, index?: number) => {
        setEditingRoleIndex(index ?? null);
        setEditingRoleData(role ?? null);
        setRoleDrawerOpen(true);
    };

    const closeRoleDrawer = () => {
        setRoleDrawerOpen(false);
        setEditingRoleIndex(null);
        setEditingRoleData(null);
        setRoleSubmissionLoading(false);
    };

    const handleRoleSubmit = async (role: Role, index?: number) => {
        setRoleSubmissionLoading(true);
        
        try {
            if (index !== undefined) {
                await updateRole(index, role);
            } else {
                await addRole(role);
            }
            
            // Close drawer after successful submission
            closeRoleDrawer();
        } catch (error) {
            // Error handling - the RoleDrawer will handle displaying errors
            console.error('Failed to save role:', error);
            throw error; // Re-throw to let RoleDrawer handle it
        } finally {
            setRoleSubmissionLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error || !ums) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <ErrorMessage
                    icon={XCircle}
                    title="Error Loading Settings"
                    message={error || "UMS not found"}
                />
            </div>
        );
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case "general":
                return (
                    <GeneralSettings
                        formData={formData}
                        onInputChange={handleInputChange}
                    />
                );
            case "admin":
                return (
                    <AdminSettings
                        formData={formData}
                        onInputChange={handleInputChange}
                    />
                );
            case "security":
                return (
                    <SecuritySettings
                        formData={formData}
                        onInputChange={handleInputChange}
                        // showPassword={showPassword}
                        // onTogglePassword={() => setShowPassword(!showPassword)}
                    />
                );
            case "modules":
                return (
                    <ModulesSettings
                        formData={formData}
                        onInputChange={handleInputChange}
                    />
                );
            case "roles":
                return (
                    <RolesSettings
                        formData={formData}
                        onAddRole={() => openRoleDrawer()}
                        onEditRole={(i) => openRoleDrawer(formData.roles[i], i)}
                        onDeleteRole={(i) => removeRole(i)}
                    />
                );
            case "departments":
                return (
                    <DepartmentsSettings
                        formData={formData}
                        onAddDepartment={() => { }}
                        onEditDepartment={() => { }}
                        onDeleteDepartment={() => { }}
                    />
                );
            case "danger":
                return <DangerZone />;
            default:
                return null;
        }
    };

    return (
        <>
            <Breadcrumbs />
            <SettingsLayout
                umsName={ums.umsName}
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                unsavedChanges={unsavedChanges}
                onSave={handleSave}
            >
                {renderTabContent()}
            </SettingsLayout>

            <RoleDrawer
                isOpen={roleDrawerOpen}
                onClose={closeRoleDrawer}
                mode={editingRoleIndex !== null ? "edit" : "add"}
                roleIndex={editingRoleIndex ?? undefined}
                roleData={editingRoleData ?? undefined}
                allPermissions={allPermissions}
                existingRoles={formData.roles || []}
                onSubmit={handleRoleSubmit}
                isLoading={roleSubmissionLoading}
                maxRoleNameLength={50}
                maxDescriptionLength={200}
            />
        </>
    );
};

export default UMSSettingsPage;