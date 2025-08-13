import React, { useState } from "react";
import {
    // useCreateUMS,
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
import ProgramSettings from "./components/ProgramSettings";
import StudentSettings from "./components/StudentSettings";
import MatriculeSettings from "./components/MatriculeSettings";

const UMSSettingsPage: React.FC = () => {
    const { error, ums } = useUMSDetail();

    const {
        // id,
        currentUMS,
        formData,

        // UI state
        activeTab,
        setActiveTab,
        // showPassword,
        // setShowPassword,
        tabs,

        // Save state
        isLoading,
        hasUnsavedChanges,
        savingError,

        // Handlers
        handleInputChange,
        handleSave,
        // handleReset,
        handleRoleUpdate,
        handleRoleAdd,
        // handleRoleRemove,

        // Loading states
        isLoadingUMS,
        isReady
    } = useUMSSettings();

    const { getAllPermissions } = usePermissions();
    const allPermissions = getAllPermissions();

    // Role drawer state
    const [roleDrawerOpen, setRoleDrawerOpen] = useState(false);
    const [editingRoleIndex, setEditingRoleIndex] = useState<number | null>(null);
    const [editingRoleData, setEditingRoleData] = useState<Role | null>(null);
    const [roleSubmissionLoading, setRoleSubmissionLoading] = useState(false);

    // const openRoleDrawer = (role?: Role, index?: number) => {
    //     setEditingRoleIndex(index ?? null);
    //     setEditingRoleData(role ?? null);
    //     setRoleDrawerOpen(true);
    // };

    const closeRoleDrawer = () => {
        setRoleDrawerOpen(false);
        setEditingRoleIndex(null);
        setEditingRoleData(null);
        setRoleSubmissionLoading(false);
    };

    const handleRoleSubmit = async (role: Role, index?: number) => {
        setRoleSubmissionLoading(true);

        try {
            console.log("Processing role submission");

            if (index !== undefined) {
                console.log("Updating existing role at index:", index);
                await handleRoleUpdate(index, role);
            } else {
                console.log("Adding new role");
                await handleRoleAdd(role);
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

    // Show loading spinner while data is being fetched
    if (isLoadingUMS || !isReady) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    // Show error if there's an issue loading data
    if (error || !currentUMS) {
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
            case "matricule":
                return (
                    <MatriculeSettings 
                    formData={formData}
                        onInputChange={handleInputChange} />
                );
            case "modules":
                return (
                    <ModulesSettings />
                );
            case "roles":
                return (
                    <RolesSettings
                        // // formData={formData}
                        // allPermissions={allPermissions}
                        // onAddRole={() => openRoleDrawer()}
                        // onEditRole={(i) => openRoleDrawer(formData.roles[i], i)}
                        // onDeleteRole={(i) => handleRoleRemove(i)}
                    />
                );
            case "departments":
                return (
                    <DepartmentsSettings />
                );
            case "programs":
                return (
                    <ProgramSettings />
                );
            case "students":
                return (
                    <StudentSettings />
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
                isUpdating={isLoading} // Fixed: use isLoading from hook
                savingError={savingError}
                umsName={currentUMS?.umsName || ums?.umsName || 'UMS'} // Fixed: use available UMS name
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                unsavedChanges={hasUnsavedChanges} // Fixed: use hasUnsavedChanges from hook
                onSave={handleSave}
                // onReset={handleReset} // Added reset functionality
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