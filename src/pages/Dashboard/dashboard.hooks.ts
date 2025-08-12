import { RootState, AppDispatch } from "../../store";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { ApiErrorResponse, errorTypeAPI, PermissionsData, Role, RoleUser, SaveState, testUMSForm, UMS, UMSForm, UMSUpdateResponse } from "../../interfaces/types";
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
import { useNavigate, useParams } from "react-router";
import UserInterface from "../../interfaces/user.interface";
import { TABS } from "../../constants/constants";
import { createFormPayload } from "../../utils";
import { UMSIntro, UMSService } from "../../services/UMSService";

export const useUMSSettings = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch();
    const { fetchUMS, ums } = useUMSDetail();

    // Selectors
    const currentUMS = useSelector((state: RootState) => state.umsManagement.currentUMS);
    const isLoadingUMS = useSelector((state: RootState) => state.umsManagement.loading);

    // Local state
    const [activeTab, setActiveTab] = useState<string>('general');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [formData, setFormData] = useState<UMSForm>({
        umsLogo: '',
        umsPhoto: '',
        umsName: '',
        umsTagline: '',
        umsDescription: '',
        umsWebsite: '',
        umsSize: '',
        umsType: undefined,
        adminName: '',
        adminEmail: '',
        adminPhone: '',
        enable2FA: false,
        modules: [],
        platforms: { teacherApp: false, studentApp: false, desktopOffices: [] },
        roles: [],
        departments: []
    });
    const [saveState, setSaveState] = useState<SaveState>({
        isLoading: false,
        error: null,
        hasUnsavedChanges: false
    });

    // Memoized initial form data
    const initialFormData = useMemo((): UMSForm => {
        if (!currentUMS) {
            return {
                umsLogo: '',
                umsPhoto: '',
                umsName: '',
                umsTagline: '',
                umsDescription: '',
                umsWebsite: '',
                umsSize: '',
                umsType: undefined,
                adminName: '',
                adminEmail: '',
                adminPhone: '',
                enable2FA: false,
                modules: [],
                platforms: {
                    teacherApp: false,
                    studentApp: false,
                    desktopOffices: [],
                },
                roles: [],
                departments: []
            };
        }

        return {
            umsLogo: currentUMS.umsLogoUrl || '',
            umsPhoto: currentUMS.umsPhotoUrl || '',
            umsName: currentUMS.umsName || '',
            umsTagline: currentUMS.umsTagline || '',
            umsDescription: currentUMS.umsDescription || '',
            umsWebsite: currentUMS.umsWebsite || '',
            umsSize: currentUMS.umsSize || '',
            umsType: currentUMS.umsType || undefined,
            adminName: currentUMS.adminName || '',
            adminEmail: currentUMS.adminEmail || '',
            adminPhone: currentUMS.adminPhone || '',
            enable2FA: currentUMS.enable2FA || false,
            modules: currentUMS.modules || [],
            platforms: currentUMS.platforms || {},
            roles: currentUMS.roles || [],
            departments: currentUMS.departments || []
        };
    }, [currentUMS]);

    // Fetch UMS data on mount
    useEffect(() => {
        if (id && !currentUMS) {
            fetchUMS(id);
        }
    }, [id, currentUMS, fetchUMS]);

    // Update global state when we get data from backend
    useEffect(() => {
        if (ums && (!currentUMS || currentUMS.id !== ums.id)) {
            dispatch(setCurrentUMS(ums));
        }
    }, [dispatch, ums, currentUMS]);

    // Initialize form data when UMS data is available
    useEffect(() => {
        if (currentUMS && Object.keys(initialFormData).length > 0) {
            setFormData(initialFormData);
            setSaveState(prev => ({ ...prev, hasUnsavedChanges: false }));
        }
    }, [initialFormData, currentUMS]);

    // Optimized input change handler
    const handleInputChange = useCallback(<K extends keyof UMSForm>(
        field: K,
        value: UMSForm[K]
    ) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setSaveState(prev => ({ ...prev, hasUnsavedChanges: true, error: null }));

        // Update global state for immediate UI feedback using your existing action
        dispatch(handleUpdateField({ field, value }));
    }, [dispatch]);

    // Role management handlers - Fixed to use your existing actions
    const handleRoleUpdate = useCallback((index: number, role: Role) => {
        setFormData(prev => {
            const updatedRoles = [...prev.roles || []];
            updatedRoles[index] = role;
            return { ...prev, roles: updatedRoles };
        });

        // Use your existing action pattern
        dispatch(handleUpdateField({
            field: 'roles',
            value: formData.roles?.map((r, i) => i === index ? role : r) || []
        }));
        setSaveState(prev => ({ ...prev, hasUnsavedChanges: true }));
    }, [dispatch, formData.roles]);

    const handleRoleAdd = useCallback((role: Partial<Role> = { name: "", users: [] }) => {
        const newRole = { ...role } as Role;

        setFormData(prev => ({
            ...prev,
            roles: [...(prev.roles || []), newRole]
        }));

        // Use your existing action
        dispatch(handleAddRole(newRole));
        setSaveState(prev => ({ ...prev, hasUnsavedChanges: true }));
    }, [dispatch]);

    const handleRoleRemove = useCallback((index: number) => {
        setFormData(prev => {
            const updatedRoles = (prev.roles || []).filter((_, i) => i !== index);
            return { ...prev, roles: updatedRoles };
        });

        // Use your existing action
        dispatch(handleRemoveRole(index));
        setSaveState(prev => ({ ...prev, hasUnsavedChanges: true }));
    }, [dispatch]);

    // the save handler
    const handleSave = useCallback(async () => {
        if (!saveState.hasUnsavedChanges || saveState.isLoading || !currentUMS || !id) {
            return;
        }

        setSaveState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const payload = await createFormPayload(formData, currentUMS);

            if (!payload) {
                toast.info('No changes to save.', { autoClose: 2000 });
                setSaveState(prev => ({ ...prev, hasUnsavedChanges: false, isLoading: false }));
                return;
            }

            const response = await api.patchFormData<UMSUpdateResponse>(`/ums/${id}`, payload);
            const updatedUMS = response.data.data || response.data;

            dispatch(setCurrentUMS(updatedUMS));
            setSaveState({ isLoading: false, error: null, hasUnsavedChanges: false });
            toast.success('Changes saved successfully!', { autoClose: 2000 });

        } catch (error: any) {
            console.error('Failed to save UMS settings:', error);

            let errorMessage = 'An unexpected error occurred.';

            if (error?.response?.data) {
                const errorData = error.response.data;
                errorMessage = errorData.message?.message || errorData.message || errorData.error || errorMessage;
            } else if (error?.message) {
                errorMessage = error.message;
            }

            setSaveState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
            toast.error(`Failed to save changes: ${errorMessage}`, { autoClose: 4000 });
        }
    }, [formData, currentUMS, saveState.hasUnsavedChanges, saveState.isLoading, id, dispatch]);

    // Reset form to original state
    const handleReset = useCallback(() => {
        if (currentUMS) {
            setFormData(initialFormData);
            setSaveState(prev => ({ ...prev, hasUnsavedChanges: false, error: null }));
            toast.info('Changes reset to original values.', { autoClose: 2000 });
        }
    }, [initialFormData, currentUMS]);

    return {
        // Core data
        id,
        currentUMS,
        formData,

        // UI state
        activeTab,
        setActiveTab,
        showPassword,
        setShowPassword,
        tabs: TABS,

        // Save state
        isLoading: saveState.isLoading,
        hasUnsavedChanges: saveState.hasUnsavedChanges,
        savingError: saveState.error,

        // Handlers
        handleInputChange,
        handleSave,
        handleReset,
        handleRoleUpdate,
        handleRoleAdd,
        handleRoleRemove,

        // Loading states
        isLoadingUMS,
        isReady: !!currentUMS
    };
};


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


type ConfirmFn = (message: string) => Promise<boolean> | boolean;
export const useUMSManagement = (confirmFn?: ConfirmFn) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { umsList, loading, error, currentUMS } = useSelector(
        (state: RootState) => state.umsManagement
    );

    // lightweight intro payload for the current tenant
    const [intro, setIntro] = useState<UMSIntro | null>(null);
    const [introLoading, setIntroLoading] = useState(false);

    const fetchUMSs = useCallback(() => {
        return dispatch(fetchAllUMS());
    }, [dispatch]);

    const mountedRef = useRef(false);
    useEffect(() => {
        mountedRef.current = true;
        return () => { mountedRef.current = false; };
    }, []);

    const fetchUMSIntro = useCallback(async () => {
        setIntroLoading(true);
        try {
            const data = await UMSService.getIntro();

            if (mountedRef.current) {
                setIntro(data);
            }
            return data;
        } finally {
            if (mountedRef.current) setIntroLoading(false);
        }
    }, []);


    // initial boot – fetch intros (and optionally the full list)
    useEffect(() => {
        fetchUMSIntro().catch(() => { });
        // if you need the list too, uncomment:
        // fetchUMSs();
    }, [fetchUMSIntro /*, fetchUMSs */]);

    const addUMS = useCallback(
        (payload: Omit<UMS, 'id'>) => dispatch(createUMS(payload)),
        [dispatch]
    );

    const modifyUMS = useCallback(
        (id: string, data: Partial<UMS>) => dispatch(updateUMS({ id, data })),
        [dispatch]
    );

    const removeUMS = useCallback(
        (id: string) => dispatch(deleteUMS(id)),
        [dispatch]
    );

    const selectUMS = useCallback(
        (ums: UMS | null) => dispatch(setCurrentUMS(ums)),
        [dispatch]
    );

    const resetError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    const handleAction = useCallback(
        async (action: 'view' | 'delete', umsId: string) => {
            const ums = umsList.find(u => u.id === umsId);
            if (!ums) return;

            if (action === 'view') {
                dispatch(setCurrentUMS(ums));
                navigate(`/dashboard/ums/${umsId}`);
                return;
            }

            if (action === 'delete') {
                const ok = confirmFn
                    ? await Promise.resolve(confirmFn(`Terminate "${ums.umsName}"? This cannot be undone.`))
                    : true; // if no confirmFn provided, auto-confirm (or inject your headless dialog)
                if (!ok) return;
                await dispatch(deleteUMS(umsId));
            }
        },
        [umsList, dispatch, navigate, confirmFn]
    );

    return {
        // state
        currentUMS,
        umsList,
        isLoading: loading,
        error,

        // intro slice for the row UI
        intro,
        introLoading,

        // data ops
        fetchUMSs,
        fetchUMSIntro,

        // actions
        handleAction,
        createUMS: addUMS,
        updateUMS: modifyUMS,
        deleteUMS: removeUMS,
        setCurrentUMS: selectUMS,
        clearError: resetError,
    };
};

export const usePermissions = () => {
    const [permissions, setPermissions] = useState<PermissionsData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getPermissions = async () => {
        try {
            setLoading(true);
            const response = await api.get('/permissions/grouped');

            // Assuming the response.data matches the PermissionsData structure
            setPermissions(response.data && Object.keys(response.data).length > 0 ? response.data as PermissionsData : null);
            // console.log('Permissions loaded:', response.data);
            setError(null);
        } catch (err: unknown) {
            console.error('Error fetching permissions:', err);

            // Type-safe error handling
            if (
                err &&
                typeof err === 'object' &&
                'response' in err &&
                err.response &&
                typeof err.response === 'object' &&
                'data' in err.response &&
                err.response.data &&
                typeof err.response.data === 'object' &&
                'message' in err.response.data
            ) {
                setError((err.response.data as { message?: string }).message || 'Failed to load permissions');
            } else {
                setError('Failed to load permissions');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getPermissions();
    }, []);

    // Helper functions to work with permissions
    const hasPermission = (module: keyof PermissionsData, permissionName: string): boolean => {
        if (!permissions) return false;
        return permissions[module].some(permission => permission.name === permissionName);
    };

    const getPermissionsByModule = (module: keyof PermissionsData) => {
        return permissions?.[module] || [];
    };

    const getAllPermissions = () => {
        if (!permissions) return [];

        return Object.values(permissions).flat();
    };

    return {
        permissions,
        loading,
        error,
        refetch: getPermissions,
        hasPermission,
        getPermissionsByModule,
        getAllPermissions
    };
};


export const useCreateUMS = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentStep, formData } = useSelector((state: RootState) => state.umsCreation);
    const [isLaunching, setIsLaunching] = useState(false);


    const { handleSave } = useUMSSettings()

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
    const addRole = async (role: Partial<Role> = { name: "", users: [] }) => {
        // First dispatch the role to state

        dispatch(handleAddRole(role));

        // Then save the changes
        await handleSave();
    };

    const updateRole = async (index: number, updatedRole: Partial<Role>) => {
        dispatch(handleUpdateRole({ index, role: updatedRole }));

        // Then save the changes
        await handleSave();
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

        if (!form.umsName || !form.adminName || !form.adminEmail) {
            toast.error("Please fill in all required fields");
            return;
        }
        try {
            setIsLaunching(true);
            // Prepare form data for submission
            const formData = new FormData();

            // Utility to convert a URL (dataURL/object URL) to a File
            const urlToFile = async (url: string, fileName: string): Promise<File> => {
                const res = await fetch(url);
                const blob = await res.blob();
                return new File([blob], fileName, { type: blob.type });
            };

            // First, transform the array of 'Role' objects to the 'RoleToBack' type
            const rolesToBack = form.roles.map(role => {
                // For each role, extract just the 'id' from the permissions array
                const permissionIds = role.permissions.map(permission =>
                    typeof permission === 'object' && permission !== null && 'id' in permission
                        ? permission.id
                        : permission
                );

                // Return a new object that matches the 'RoleToBack' structure
                return {
                    name: role.name,
                    description: role.description,
                    permissionIds: permissionIds,
                    users: role.users,
                };
            });
            // Append logo image
            if (form.umsLogo) {
                const logoFile = await urlToFile(form.umsLogo, "ums-logo.png");
                console.log(logoFile);
                formData.append("umsLogo", logoFile);
                console.log("umsLogo", logoFile)
            }

            // Append photo image
            if (form.umsPhoto) {
                const photoFile = await urlToFile(form.umsPhoto, "ums-photo.png");
                formData.append("umsPhoto", photoFile);
                console.log("umsPhoto", photoFile)
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
            formData.append("roles", JSON.stringify(rolesToBack));
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

            setIsLaunching(false);
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
        isLaunching,
        // Navigation methods
        next,
        back,
        reset,
        goToTheStep
    };
};


/**
 * Manages dashboard layout state, including user session and dropdown menu.
 * 
 * @returns an object containing user loading state, authentication data, 
 *          dropdown visibility controls, and logout handler.
 */
const useDashboardLayout = () => {
    // Grab user from Redux. undefined => still loading; null => not authenticated; object => authenticated
    const userFromStore = useSelector((state: RootState) => state.auth.user);

    // Local state to distinguish loading vs loaded/null
    const [user, setUser] = useState<UserInterface | null | undefined>(undefined);

    const [minLoadingTime, setMinLoadingTime] = useState(true);
    // Dropdown visibility
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Logout handler from custom auth hook
    const { handleLogout } = useAuthForm({ intent: 'signup' });

    // Sync local user state with Redux store
    useEffect(() => {
        setUser(userFromStore);
    }, [userFromStore]);


    useEffect(() => {
        const timer = setTimeout(() => setMinLoadingTime(false), 1000); // 500ms minimum
        return () => clearTimeout(timer);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    // Loading indicator: still checking auth status
    const isLoading = user === undefined || minLoadingTime;

    return {
        user,             // User object or null if not signed in
        isLoading,        // true while auth status is being determined
        showMenu,         // dropdown open/closed
        setShowMenu,      // toggle handler
        dropdownRef,      // ref for click-outside detection
        handleLogout      // method to sign the user out
    };
};


export default useDashboardLayout;