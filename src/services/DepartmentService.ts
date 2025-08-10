import api from '../config/axios';
import { CreateDepartmentDto, ApiResponse, UpdateDepartmentDto, Department } from '../types/department.types';

export class DepartmentService {
    private static readonly BASE_URL = '/departments';

    /**
     * Create a new department
     */
    static async createDepartment(payload: CreateDepartmentDto): Promise<Department> {
        try {
            const response = await api.post<ApiResponse<Department>>(
                DepartmentService.BASE_URL,
                payload
            );
            return response.data.data;
        } catch (error) {
            console.error('Error creating department:', error);
            throw new Error('Failed to create department. Please try again.');
        }
    }

    /**
     * Get all departments for current UMS
     */
    static async getDepartments(): Promise<Department[]> {
        try {
            const response = await api.get<ApiResponse<Department[]>>(
                DepartmentService.BASE_URL
            );
            console.log('Fetched departmentszs:', response.data);
            return response.data as unknown as Department[];
        } catch (error) {
            console.error('Error fetching departments:', error);
            throw new Error('Failed to fetch departments. Please try again.');
        }
    }

    /**
     * Get a single department by ID
     */
    static async getDepartment(id: string): Promise<Department> {
        try {
            const response = await api.get<ApiResponse<Department>>(
                `${DepartmentService.BASE_URL}/${id}`
            );
            return response.data.data;
        } catch (error) {
            console.error('Error fetching department:', error);
            throw new Error('Failed to fetch department. Please try again.');
        }
    }

    /**
     * Update an existing department
     */
    static async updateDepartment(
        id: string,
        payload: UpdateDepartmentDto
    ): Promise<Department> {
        try {
            const response = await api.patch<ApiResponse<Department>>(
                `${DepartmentService.BASE_URL}/${id}`,
                payload
            );
            return response.data.data;
        } catch (error) {
            console.error('Error updating department:', error);
            throw new Error('Failed to update department. Please try again.');
        }
    }

    /**
     * Delete a department
     */
    static async deleteDepartment(id: string): Promise<void> {
        try {
            await api.delete<ApiResponse<void>>(
                `${DepartmentService.BASE_URL}/${id}`
            );
        } catch (error) {
            console.error('Error deleting department:', error);
            throw new Error('Failed to delete department. Please try again.');
        }
    }
}