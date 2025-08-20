import api from '../config/axios';
import { ApiResponse } from '../types/department.types';

export interface Permission {
    id?: string;
    _id?: string;
    name: string;
    code: string;
    description?: string;
}

export type PermissionGroups = Record<string, Permission[]>;

export class PermissionService {
    static async listAll(): Promise<Permission[]> {
        const res = await api.get<ApiResponse<Permission[]>>('/permissions'); // adjust if your route differs
        if (Array.isArray(res.data.data)) {
            return res.data.data;
        } else if (res.data && typeof res.data === 'object' && 'items' in res.data && Array.isArray((res.data as { items: unknown }).items)) {
            return (res.data as { items: Permission[] }).items;
        } else {
            return [];
        }
    }
    static async listGrouped(): Promise<PermissionGroups> {
    const res = await api.get<ApiResponse<PermissionGroups>>('/permissions/grouped');
    console.log(res.data.data)
    return res.data.data || {};
  }
}
