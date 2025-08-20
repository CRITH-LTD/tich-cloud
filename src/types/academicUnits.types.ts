
export interface Faculty {
  _id?: string;
  name: string;
  description?: string;
  code: string;
  dean?: string;
  establishedYear?: number;
  ums?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface School {
  _id?: string;
  name: string;
  description?: string;
  code: string;
  director?: string;
  facultyId?: string;
  establishedYear?: number;
  ums?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CertificationProgram {
  _id?: string;
  name: string;
  description?: string;
  code: string;
  duration?: number; // in months
  credits?: number;
  level: 'Certificate' | 'Diploma' | 'Advanced Certificate' | 'Professional Certificate';
  departmentId?: string;
  facultyId?: string;
  schoolId?: string;
  ums?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFacultyDto {
  name: string;
  description?: string;
  code: string;
  dean?: string;
  establishedYear?: number;
}

export type UpdateFacultyDto = Partial<CreateFacultyDto>;

export interface CreateSchoolDto {
  name: string;
  description?: string;
  code: string;
  director?: string;
  facultyId?: string;
  establishedYear?: number;
}

export type UpdateSchoolDto = Partial<CreateSchoolDto>;

export interface CreateCertificationProgramDto {
  name: string;
  description?: string;
  code: string;
}

export type UpdateCertificationProgramDto = Partial<CreateCertificationProgramDto>;

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}