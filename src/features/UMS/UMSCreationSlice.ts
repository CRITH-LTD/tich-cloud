// umsCreationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Role, RoleUser, UMSForm } from '../../interfaces/types';
import { generatePassword } from '../../utils/passwordGenerator';

export interface UMSCreationState {
    currentStep: number;
    formData: UMSForm;
    isLoading: boolean;
    error: string | null;
}
const initialState: UMSCreationState = {
    currentStep: 1,
    formData: {
        umsName: "",
        umsTagline: "",
        umsDescription: "",
        umsWebsite: "",
        umsType: undefined,
        umsSize: "",
        adminName: "",
        adminEmail: "",
        adminPhone: "",
        enable2FA: false,
        roles: [],
        modules: [],
        platforms: {
            teacherApp: false,
            studentApp: false,
            desktopOffices: [],
        },
    },
    isLoading: false,
    error: null,
};

const umsCreationSlice = createSlice({
    name: 'umsCreation',
    initialState,
    reducers: {
        // Navigation actions
        nextStep: (state) => {
            state.currentStep = Math.min(state.currentStep + 1, 5);
        },
        prevStep: (state) => {
            state.currentStep = Math.max(state.currentStep - 1, 1);
        },
        goToStep: (state, action: PayloadAction<number>) => {
            state.currentStep = action.payload;
        },
        resetCreation: () => initialState,

        // Form update actions
        updateField: <K extends keyof UMSForm>(state: UMSCreationState, action: PayloadAction<{ field: K; value: UMSForm[K] }>) => {
            state.formData[action.payload.field] = action.payload.value;
        },

        // Module actions
        toggleModule: (state, action: PayloadAction<string>) => {
            const { modules } = state.formData;
            state.formData.modules = modules.includes(action.payload)
                ? modules.filter((m: string) => m !== action.payload)
                : [...modules, action.payload];
        },

        // Platform actions
        togglePlatform: (state, action: PayloadAction<'teacherApp' | 'studentApp'>) => {
            const platform = action.payload;
            state.formData.platforms[platform] = !state.formData.platforms[platform];
        },

        toggleOffice: (state, action: PayloadAction<string>) => {
            const { desktopOffices } = state.formData.platforms;
            state.formData.platforms.desktopOffices = desktopOffices.includes(action.payload)
                ? desktopOffices.filter((o: string) => o !== action.payload)
                : [...desktopOffices, action.payload];
        },

        // Role actions
        addRole: (state, action: PayloadAction<Partial<Role>>) => {
            const newRole = {
                name: action.payload.name || "",
                description: action.payload.description || "",
                users: action.payload.users || []
            };
            state.formData.roles.push(newRole);
        },

        updateRole: (state, action: PayloadAction<{ index: number; role: Partial<Role> }>) => {
            const { index, role } = action.payload;
            state.formData.roles[index] = { ...state.formData.roles[index], ...role };
        },

        removeRole: (state, action: PayloadAction<number>) => {
            state.formData.roles = state.formData.roles.filter((_: Role, i: number) => i !== action.payload);
        },

        // Role user actions
        addUserToRole: (state, action: PayloadAction<{ roleIndex: number; user: Omit<RoleUser, 'password'> }>) => {
            const { roleIndex, user } = action.payload;
            const newUser: RoleUser = {
                ...user,
                password: generatePassword(8), // Auto-generate password
                isPrimary: false // Default to false unless specified
            };
            state.formData.roles[roleIndex].users.push(newUser);
        },

        updateUserInRole: (state, action: PayloadAction<{ roleIndex: number; userIndex: number; user: Partial<RoleUser> }>) => {
            const { roleIndex, userIndex, user } = action.payload;
            state.formData.roles[roleIndex].users[userIndex] = {
                ...state.formData.roles[roleIndex].users[userIndex],
                ...user
            };
        },

        removeUserFromRole: (state, action: PayloadAction<{ roleIndex: number; userIndex: number }>) => {
            const { roleIndex, userIndex } = action.payload;
            state.formData.roles[roleIndex].users = state.formData.roles[roleIndex].users.filter((_: RoleUser, i: number) => i !== userIndex);
        },

        // Async state management
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },

        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});

export const initializeAdminEmail = (email: string) => {
    return umsCreationSlice.actions.updateField({
        field: 'adminEmail',
        value: email
    });
};

// Export actions
export const {
    nextStep,
    prevStep,
    goToStep,
    resetCreation,
    updateField,
    toggleModule,
    togglePlatform,
    toggleOffice,
    addRole,
    updateRole,
    removeRole,
    addUserToRole,
    updateUserInRole,
    removeUserFromRole,
    setLoading,
    setError,
} = umsCreationSlice.actions;

// Export reducer
export default umsCreationSlice.reducer;