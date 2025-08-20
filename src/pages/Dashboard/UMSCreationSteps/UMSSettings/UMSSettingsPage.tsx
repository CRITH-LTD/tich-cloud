import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
    usePermissions,
    useUMSDetail,
    useUMSSettings,
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
    RoleDrawer,
} from "./components/common";
import { XCircle } from "lucide-react";
import { Role } from "../../../../interfaces/types";
import ProgramSettings from "./components/ProgramSettings";
import StudentSettings from "./components/StudentSettings";
import MatriculeSettings from "./components/MatriculeSettings";
import AcademicUnitsSettings from "./components/AcademicUnitsSettings";
import { TABS } from "../../../../constants/constants";

const UMSSettingsPage: React.FC = () => {
    const { error, ums } = useUMSDetail();

    const {
        currentUMS,
        formData,
        activeTab,
        setActiveTab,
        tabs,
        isLoading,
        hasUnsavedChanges,
        savingError,
        handleInputChange,
        handleSave,
        handleRoleUpdate,
        handleRoleAdd,
        isLoadingUMS,
        isReady,
    } = useUMSSettings();

    const { getAllPermissions } = usePermissions();
    const allPermissions = getAllPermissions();

    // Role drawer state
    const [roleDrawerOpen, setRoleDrawerOpen] = useState(false);
    const [editingRoleIndex, setEditingRoleIndex] = useState<number | null>(null);
    const [editingRoleData, setEditingRoleData] = useState<Role | null>(null);
    const [roleSubmissionLoading, setRoleSubmissionLoading] = useState(false);

    // URL search params for tab sync
    const [searchParams, setSearchParams] = useSearchParams();

    // Sync tab with URL
    useEffect(() => {
        const tabParam = searchParams.get("tab");
        if (tabParam && TABS.some((t) => t.id === tabParam)) {
            setActiveTab(tabParam);
        } else if (!tabParam) {
            // default to first tab
            setSearchParams({ tab: TABS[0].id });
        }
    }, [searchParams, setActiveTab, setSearchParams]);

    const handleTabChange = useCallback(
        (tabId: string) => {
            setActiveTab(tabId);
            setSearchParams({ tab: tabId });
        },
        [setActiveTab, setSearchParams]
    );

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
                await handleRoleUpdate(index, role);
            } else {
                await handleRoleAdd(role);
            }
            closeRoleDrawer();
        } catch (error) {
            console.error("Failed to save role:", error);
            throw error;
        } finally {
            setRoleSubmissionLoading(false);
        }
    };

    // Map tabs to components (declarative instead of switch)
    const tabContentMap: Record<string, React.ReactNode> = useMemo(
        () => ({
            general: (
                <GeneralSettings formData={formData} onInputChange={handleInputChange} />
            ),
            admin: (
                <AdminSettings formData={formData} onInputChange={handleInputChange} />
            ),
            security: (
                <SecuritySettings
                    formData={formData}
                    onInputChange={handleInputChange}
                />
            ),
            matricule: (
                <MatriculeSettings
                    formData={formData}
                    onInputChange={handleInputChange}
                />
            ),
            modules: <ModulesSettings />,
            roles: <RolesSettings />,
            academicUnits: <AcademicUnitsSettings />,
            departments: <DepartmentsSettings />,
            programs: <ProgramSettings />,
            students: <StudentSettings />,
            danger: <DangerZone />,
        }),
        [formData, handleInputChange]
    );

    // Loading
    if (isLoadingUMS || !isReady) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    // Error
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

    return (
        <>
            <Breadcrumbs />
            <SettingsLayout
                isUpdating={isLoading}
                savingError={savingError}
                umsName={currentUMS?.umsName || ums?.umsName || "UMS"}
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                unsavedChanges={hasUnsavedChanges}
                onSave={handleSave}
            >
                {tabContentMap[activeTab] || (
                    <ErrorMessage
                        icon={XCircle}
                        title="Unknown Tab"
                        message={`The tab "${activeTab}" does not exist.`}
                    />
                )}
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
