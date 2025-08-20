import api from '../config/axios';
import {
    CreateDepartmentDto,
    UpdateDepartmentDto,
    Department,
    ApiResponse,
} from '../types/department.types';

type ParentType = 'Faculty' | 'School' | 'CertificationProgram';

export class DepartmentService {
    private static buildBaseUrl(
        parentType?: ParentType,
        parentId?: string
    ): string {
        switch (parentType) {
            case 'Faculty':
                return `departments/faculties/${parentId}/departments`;
            case 'School':
                return `departments/schools/${parentId}/departments`;
            case 'CertificationProgram':
                return `departments/certification-programs/${parentId}/departments`;
            default:
                return '/departments';
        }
    }

    static async create(
        dto: CreateDepartmentDto,
        parentId: string,
        parentType: ParentType
    ): Promise<Department> {
        const url = this.buildBaseUrl(parentType, parentId);
        const response = await api.post<ApiResponse<Department>>(url, dto);
        return response.data.data;
    }

    static async findAll(
        parentId: string,
        parentType: ParentType
    ): Promise<Department[]> {
        const url = this.buildBaseUrl(parentType, parentId);
        const response = await api.get<ApiResponse<Department[]>>(url);
        return response.data.data;
    }

    static async findAllByUMS(): Promise<Department[]> {
        const url = this.buildBaseUrl();
        const response = await api.get<ApiResponse<Department[]>>(url);
        return response.data.data;
    }

    static async findOne(
        id: string,
        parentId: string,
        parentType: ParentType
    ): Promise<Department> {
        const url = `${this.buildBaseUrl(parentType, parentId)}/${id}`;
        const response = await api.get<ApiResponse<Department>>(url);
        return response.data.data;
    }

    static async update(
        id: string,
        dto: UpdateDepartmentDto,
        parentId: string,
        parentType: ParentType
    ): Promise<Department> {
        const url = `${this.buildBaseUrl(parentType, parentId)}/${id}`;
        const response = await api.patch<ApiResponse<Department>>(url, dto);
        return response.data.data;
    }

    static async remove(
        id: string,
        parentId: string,
        parentType: ParentType
    ): Promise<void> {
        const url = `${this.buildBaseUrl(parentType, parentId)}/${id}`;
        await api.delete(url);
    }

    static async getPerformance(
        parentId: string,
        parentType: ParentType
    ): Promise<any> {
        const url = `${this.buildBaseUrl(parentType, parentId)}/performance`;
        const response = await api.get(url);
        return response.data;
    }

    static async searchByName(
        searchTerm: string,
        parentId: string,
        parentType: ParentType
    ): Promise<Department[]> {
        const response = await api.get<ApiResponse<Department[]>>(
            `/departments/search`,
            {
                params: {
                    q: searchTerm,
                    parentId,
                    parentType,
                },
            }
        );
        return response.data.data;
    }
}
