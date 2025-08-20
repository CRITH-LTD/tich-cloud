export interface Department {
  _id: string;
  name: string;
  description?: string;
  code: string; // Unique code for the department
  ums: string;
  programs: string[]; // just IDs
  createdAt: string;
  updatedAt: string;
  programCount: number;
  rating?: number;
  studentCount?: number;
  establishedDate?: string;
  status?: 'active'|'inactive'
  activePrograms: string[]; // just IDs
  id: string; // Virtual field from MongoDB
}

export interface CreateDepartmentDto {
  name: string;
  description?: string;
  code: string;
}

export interface UpdateDepartmentDto {
  name?: string;
  description?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}