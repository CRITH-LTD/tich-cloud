import { AuthState } from '../features/auth/authSlice';
import { UMSCreationState } from '../features/UMS/UMSCreationSlice';

export type RoleUser = {
    email: string;
    password?: string;
    isPrimary?: boolean;
};

export interface RootState {
  auth: AuthState;
  umsCreation: UMSCreationState;
}

export type Role = {
    name: string;
    description?: string;
    users: RoleUser[];
};

export type UMSForm = {
    umsName: string;
    umsLogo?: string;
    umsPhoto?: string;
    umsDescription: string;
    umsTagline?: string;
    umsWebsite?: string;
    umsType?: "University" | "College" | "School";
    umsSize?: string;

    adminName: string;
    adminEmail: string;
    adminPhone?: string;
    enable2FA?: boolean;

    roles: Role[];

    modules: string[];

    platforms: {
        teacherApp: boolean;
        studentApp: boolean;
        desktopOffices: string[];
    };
};

export interface UMS {
  umsName: string;
  umsDescription: string;
  adminName: string;
  adminEmail: string;
  enable2FA: boolean;
  roles: Role[];
  modules: string[];
  platforms: {
    teacherApp: boolean;
    studentApp: boolean;
    desktopOffices: string[];
  };
  umsLogo: string;
  umsTagline: string | null;
  umsWebsite: string | null;
  umsType: "University" | "College" | "School" | null;
  umsSize: string | null;
  adminPhone: string | null;
  umsPhoto: string | null;
  id: string;
}