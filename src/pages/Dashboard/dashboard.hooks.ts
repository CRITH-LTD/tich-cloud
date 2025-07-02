import { RootState, AppDispatch } from "../../store";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuthForm } from "../Auth/auth.hooks";
import { useDispatch, useSelector } from 'react-redux';
import {
    nextStep,
    prevStep,
    goToStep,
    resetCreation,
    updateField as handleUpdateField,
    toggleModule as handleToggleModule,
    togglePlatform as handleTogglePlatform,
    toggleOffice as handleToggleOffice,
    addRole as handleAddRole,
    updateRole as handleUpdateRole,
    removeRole as handleRemoveRole,
    addUserToRole as handleAddUserToRole,
    updateUserInRole as handleUpdateUserInRole,
    removeUserFromRole as handleRemoveUserFromRole,
} from '../../features/UMS/UMSCreationSlice'; // Adjust the path to your slice file
import { Role, RoleUser, UMS, UMSForm } from "../../interfaces/types";
import api from "../../config/axios";
import { toast } from "react-toastify";
import {
    fetchAllUMS,
    createUMS,
    updateUMS,
    deleteUMS,
    setCurrentUMS,
    clearError,
    fetchUMSById
} from '../../features/UMS/UMSManagementSlice';
import { useNavigate } from "react-router";


export const useUMSDetail = () => {
    const dispatch = useDispatch<AppDispatch>();

    const ums = useSelector((state: RootState) => state.umsManagement.currentUMS);
    const isLoading = useSelector((state: RootState) => state.umsManagement.loading);
    const error = useSelector((state: RootState) => state.umsManagement.error);

    const fetchUMS = useCallback((id: string) => {
        dispatch(fetchUMSById(id));
    }, [dispatch]);

    return { ums, isLoading, error, fetchUMS };
};

export const useUMSManagement = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { umsList, loading, error, currentUMS } = useSelector((state: RootState) => state.umsManagement);
    const navigate = useNavigate();

    const fetchUMSs = useCallback(() => {
        dispatch(fetchAllUMS());
    }, [dispatch]);
    const addUMS = (newUMS: Omit<UMS, 'id'>) => dispatch(createUMS(newUMS));
    const modifyUMS = (id: string, data: Partial<UMS>) => dispatch(updateUMS({ id, data }));
    const removeUMS = (id: string) => dispatch(deleteUMS(id));
    const selectUMS = (ums: UMS | null) => dispatch(setCurrentUMS(ums));
    const resetError = () => dispatch(clearError());

    const handleAction = (action: 'view' | 'delete', umsId: string) => {
            const ums = umsList.find((u) => u.id === umsId);
            if (!ums) return;
            if (action === 'view') {
                navigate(`/dashboard/ums/${umsId}`);
                setCurrentUMS(ums);
            }
            if (action === 'delete') {
                const confirmed = window.confirm(`Are you sure you want to terminate "${ums.umsName}"?`);
                if (confirmed) deleteUMS(umsId);
            }
        };
    return {
        umsList,
        currentUMS,
        isLoading: loading,
        error,
        fetchUMSs,
        handleAction,
        createUMS: addUMS,
        updateUMS: modifyUMS,
        deleteUMS: removeUMS,
        setCurrentUMS: selectUMS,
        clearError: resetError,
    };
};

export const useCreateUMS = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentStep, formData } = useSelector((state: RootState) => state.umsCreation);

    // Generic field updater
    const updateField = <K extends keyof UMSForm>(field: K, value: UMSForm[K]) => {
        dispatch(handleUpdateField({ field, value }));
    };

    // Module toggler
    const toggleModule = (mod: string) => {
        dispatch(handleToggleModule(mod));
    };

    // Office toggler
    const toggleOffice = (office: string) => {
        dispatch(handleToggleOffice(office));
    };

    // Platform toggler
    const togglePlatform = (platform: "teacherApp" | "studentApp") => {
        dispatch(handleTogglePlatform(platform));
    };

    // Role methods
    const addRole = (role: Partial<Role> = { name: "", users: [] }) => {
        dispatch(handleAddRole(role));
    };

    const updateRole = (index: number, updatedRole: Partial<Role>) => {
        dispatch(handleUpdateRole({ index, role: updatedRole }));
    };

    const removeRole = (index: number) => {
        dispatch(handleRemoveRole(index));
    };

    // Role user methods
    const addUserToRole = (roleIndex: number, user: RoleUser) => {
        dispatch(handleAddUserToRole({ roleIndex, user }));
    };

    const updateUserInRole = (roleIndex: number, userIndex: number, user: Partial<RoleUser>) => {
        dispatch(handleUpdateUserInRole({ roleIndex, userIndex, user }));
    };

    const removeUserFromRole = (roleIndex: number, userIndex: number) => {
        dispatch(handleRemoveUserFromRole({ roleIndex, userIndex }));
    };

    // Submit the UMS
    const submitUMS = async (form: UMSForm) => {
        try {
            const formData = new FormData();

            // Utility to convert a URL (dataURL/object URL) to a File
            const urlToFile = async (url: string, fileName: string): Promise<File> => {
                const res = await fetch(url);
                const blob = await res.blob();
                return new File([blob], fileName, { type: blob.type });
            };

            // Append logo image
            if (form.umsLogo) {
                const logoFile = await urlToFile(form.umsLogo, "ums-logo.png");
                formData.append("umsLogo", logoFile);
            }

            // Append photo image
            if (form.umsPhoto) {
                const photoFile = await urlToFile(form.umsPhoto, "ums-photo.png");
                formData.append("umsPhoto", photoFile);
            }

            // Append primitive fields
            formData.append("umsName", form.umsName);
            formData.append("umsDescription", form.umsDescription);
            if (form.umsTagline) formData.append("umsTagline", form.umsTagline);
            if (form.umsWebsite) formData.append("umsWebsite", form.umsWebsite);
            if (form.umsType) formData.append("umsType", form.umsType);
            if (form.umsSize) formData.append("umsSize", form.umsSize);

            formData.append("adminName", form.adminName);
            formData.append("adminEmail", form.adminEmail);
            if (form.adminPhone) formData.append("adminPhone", form.adminPhone);
            formData.append("enable2FA", String(form.enable2FA ?? false));

            // Append arrays/objects as JSON strings
            formData.append("roles", JSON.stringify(form.roles));
            formData.append("modules", JSON.stringify(form.modules));
            formData.append("platforms", JSON.stringify(form.platforms));

            // Submit to backend
            const response = await api.post('ums', formData);
            //  = await fetch("/api/ums", {
            //     method: "POST",
            //     body: formData,
            // });

            if (response.status < 200 || response.status >= 300) {
                throw new Error("UMS submission failed");
            }
            // Toast proper feed back
            navigate("/dashboard/ums")
            toast.success("UMS submitted successfully");
            return response.data;
        } catch (error) {
            // Toast proper feedback
            toast.error("UMS submission failed");
            console.error("UMS submission error:", error);
            throw error;
        }
    };


    // Navigation
    const next = () => dispatch(nextStep());
    const back = () => dispatch(prevStep());
    const reset = () => dispatch(resetCreation());
    const goToTheStep = (step: number) => dispatch(goToStep(step));

    return {
        step: currentStep,
        form: formData,
        updateField,
        toggleModule,
        toggleOffice,
        togglePlatform,
        addRole,
        updateRole,
        removeRole,
        addUserToRole,
        updateUserInRole,
        removeUserFromRole,
        submitUMS,
        next,
        back,
        reset,
        goToTheStep
    };
};

const useDashboardLayout = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [showMenu, setShowMenu] = useState(false);
    const { handleLogout } = useAuthForm({ intent: "signup" })

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setShowMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return {
        showMenu,
        setShowMenu,
        user,
        dropdownRef,
        handleLogout
    };
}
export default useDashboardLayout;