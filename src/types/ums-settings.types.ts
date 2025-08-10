import { LucideIcon } from 'lucide-react';
import { Department } from './department.types';

export interface Permission {
  id: string;
  name: string;
  description?: string;
  module: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
}

export interface Role {
  id?: string;
  name: string;
  description?: string;
  permissions: Permission[];
  users: User[];
}


export interface PlatformAccess {
  teacherApp: boolean;
  studentApp: boolean;
  parentApp?: boolean;
  adminWeb: boolean;
}

export interface UMSData {
  //   id: string;
  umsName: string;
  umsLogo?: string;
  umsPhoto?: string;
  umsDescription: string;
  umsTagline?: string;
  umsWebsite?: string;
  umsType?: "University" | "College" | "School" | undefined;
  umsSize?: string;
  
  umsLogoUrl?: string;
  umsPhotoUrl?: string;
  adminName?: string;
  adminEmail?: string;
  adminPhone?: string;
  enable2FA?: boolean;
  //   defaultPassword: string;
  roles: Role[];
  departments: Department[];
  modules: string[];
  platforms: PlatformAccess;
}

export interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface GroupedPermission {
  module: string;
  permissions: Permission[];
}

export type SettingsFormData = Omit<UMSData, 'id'>

export interface SettingsHookReturn {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  unsavedChanges: boolean;
  tabs: Tab[];
  formData: SettingsFormData;
  handleSave: () => void;
  handleInputChange: (field: string, value: any) => void;
}

export interface PermissionsHookReturn {
  permissions: Record<string, Permission[]> | null;
  loading: boolean;
  error: string | null;
  getAllPermissions: () => Permission[];
}

export interface CreateUMSHookReturn {
  addRole: (role: Omit<Role, 'id'>) => void;
  updateRole: (roleIndex: number, updates: Partial<Role>) => void;
  removeRole: (roleIndex: number) => void;
  addUserToRole: (roleIndex: number, user: User) => void;
  updateUserInRole: (roleIndex: number, userIndex: number, updates: Partial<User>) => void;
  removeUserFromRole: (roleIndex: number, userIndex: number) => void;
}