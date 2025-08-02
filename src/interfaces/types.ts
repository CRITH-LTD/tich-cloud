import { AuthState } from '../features/auth/authSlice';
import { UMSCreationState } from '../features/UMS/UMSCreationSlice';
import { Department } from '../types/ums-settings.types';

export type RoleUser = {
  email: string;
  password?: string;
  isPrimary?: boolean;
};

export interface RootState {
  auth: AuthState;
  umsCreation: UMSCreationState;
}

export type PermissionsRoles = {
  id: string;
  name: string;
  description: string;
}

export type RoleToBack = {
  name: string;
  description?: string;
  permissionIds: string[];
  users: RoleUser[];
}
export type Role = {
  name: string;
  description?: string;
  permissions: PermissionsRoles[];
  users: RoleUser[];
};

// A type to represent a matricule configuration for the form
export type MatriculeConfig = {
  format?: string;
  placeholders?: Record<string, string>;
  sequenceLength?: number;
};

// A type to represent a file that can either be a new upload or an existing URL
export type FileWithUrl = File | string;

/**
 * Represents the data structure for the UMS creation and update form.
 */
export type UMSForm = {
  // --- UMS Details ---
  umsName: string;
  umsTagline?: string;
  umsDescription: string;
  umsWebsite?: string;
  umsType?: 'University' | 'College' | 'School';
  umsSize?: string;
  
  // --- File Uploads (can be a File object or an existing URL string) ---
  umsLogo?: string;
  umsPhoto?: string;

  // --- Administration Details ---
  adminName: string;
  adminEmail: string;
  adminPhone?: string;
  enable2FA: boolean;

  // --- Modules and Access Configuration ---
  roles: Role[];
  modules: string[];
  platforms: {
    teacherApp: boolean;
    studentApp: boolean;
    desktopOffices: string[];
  };

  // --- Dynamic Configuration ---
  departments?: Department[]; // Placeholder for Departments
  matriculeConfig?: MatriculeConfig; // NEW: The matricule configuration
};


export type errorTypeAPI = {
  response: data
}

type data = {
  data: { message: string }
}
export interface department {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UMS {
  umsName: string;
  umsDescription: string;
  adminName: string;
  adminEmail: string;
  enable2FA: boolean;
  departments?: department[];
  roles: Role[];
  modules: string[];
  platforms: {
    teacherApp: boolean;
    studentApp: boolean;
    desktopOffices: string[];
  };
  umsLogoUrl: string;
  umsTagline: string | null;
  umsWebsite: string | null;
  umsType: "University" | "College" | "School" | undefined;
  umsSize: string | null;
  adminPhone: string | null;
  umsPhotoUrl: string | null;
  id: string;
}

// _____________________________________________
// Base permission interface
export interface Permission {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// Module-specific permission interfaces for better type safety
export interface UserPermissions {
  create_user: Permission;
  impersonate_user: Permission;
  update_user: Permission;
  view_users: Permission;
  delete_user: Permission;
  reset_user_password: Permission;
}

export interface UmsPermissions {
  update_ums: Permission;
  delete_ums: Permission;
  create_ums: Permission;
  view_ums: Permission;
  manage_ums: Permission;
}

export interface DepartmentPermissions {
  delete_department: Permission;
  update_department: Permission;
  create_department: Permission;
  view_departments: Permission;
}

export interface ProgramPermissions {
  update_program: Permission;
  create_program: Permission;
  delete_program: Permission;
  view_programs: Permission;
}

export interface CoursePermissions {
  view_courses: Permission;
  update_course: Permission;
  create_course: Permission;
  delete_course: Permission;
}

export interface StudentPermissions {
  update_student: Permission;
  enroll_student: Permission;
  view_students: Permission;
}

export interface SystemPermissions {
  update_marks: Permission;
  view_financials: Permission;
  manage_roles: Permission;
  approve_payments: Permission;
  manage_command_roles: Permission;
  view_audit_logs: Permission;
  manage_permissions: Permission;
  view_reports: Permission;
  view_staff: Permission;
  assign_staff: Permission;
  view_results: Permission;
  enter_marks: Permission;
  view_transactions: Permission;
}

// Main permissions structure interface
export interface PermissionsData {
  user: Permission[];
  ums: Permission[];
  department: Permission[];
  program: Permission[];
  course: Permission[];
  student: Permission[];
  finance: Permission[];
  system: Permission[];
}

// Alternative interface for when you want to access permissions by name
export interface PermissionsByName {
  user: UserPermissions;
  ums: UmsPermissions;
  department: DepartmentPermissions;
  program: ProgramPermissions;
  course: CoursePermissions;
  student: StudentPermissions;
  finance: Record<string, never>; // Empty object for finance module
  system: SystemPermissions;
}

// Utility type to get all permission names
export type PermissionName =
  | keyof UserPermissions
  | keyof UmsPermissions
  | keyof DepartmentPermissions
  | keyof ProgramPermissions
  | keyof CoursePermissions
  | keyof StudentPermissions
  | keyof SystemPermissions;

// Module names type
export type ModuleName = keyof PermissionsData;

// Helper type for creating permission lookup maps
export type PermissionLookup = {
  [K in PermissionName]: Permission;
};

// export {
//   Permission,
//   PermissionsData,
//   PermissionsByName,
//   PermissionName,
//   ModuleName,
//   PermissionLookup,
//   UserPermissions,
//   UmsPermissions,
//   DepartmentPermissions,
//   ProgramPermissions,
//   CoursePermissions,
//   StudentPermissions,
//   SystemPermissions
// };