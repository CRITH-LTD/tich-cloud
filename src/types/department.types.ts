export interface Department {
  _id: string;
  name: string;
  description?: string;
  ums: string;
  programs: string[]; // just IDs
  createdAt: string;
  updatedAt: string;
  programCount: number;
  activePrograms: string[]; // just IDs
  id: string; // Virtual field from MongoDB
}

export interface CreateDepartmentDto {
  name: string;
  description?: string;
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