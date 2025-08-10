import api from '../config/axios';

export interface RoleDto {
    name: string;
    description?: string;
}
export interface Role {
    id?: string;
    _id?: string;
    name: string;
    description?: string;
    ums?: string;
    permissions?: string[];
    createdAt?: string;
    updatedAt?: string;
}

export interface RoleUser {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
}
type ListResponse = {
    data: Role[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
};

// this is an example output:
// {
//     "name": "Registrar",
//     "description": "Collect money",
//     "ums": "688e367180aaf767a84c840c",
//     "permissions": [
//         "688b9ab7ed9ce1aadff05a5e",
//         "688b9ab7ed9ce1aadff05a61"
//     ],
//     "createdAt": "2025-08-10T21:28:47.365Z",
//     "updatedAt": "2025-08-10T21:29:27.501Z",
//     "id": "68990f0f05d1569d48714813",
//     "users": [
//         {
//             "email": "peter@himshub.com",
//             "isPrimary": false,
//             "role": "68990f0f05d1569d48714813",
//             "id": "689915bc3da4e25e7bfca46e"
//         }
//     ]
// }
type listUsersResponse = {
    name: string;
    description?: string;
    ums: string;
    permissions: string[];
    createdAt: string;
    updatedAt: string;
    id: string;
    users: RoleUser[];
};


export class RoleService {
    static async list(params: { ums?: string; search?: string; page?: number; limit?: number }) {
        const res = await api.get<ListResponse>('/roles', { params });
        const { data, pagination } = res.data;
        return {
            items: data ?? [],
            total: pagination?.total ?? 0,
            page: pagination?.page ?? 1,
            limit: pagination?.limit ?? params.limit ?? 10,
        };
    }


    static async create(dto: RoleDto): Promise<Role> {
        const res = await api.post<Role>('/roles', dto);
        return res.data;
    }

    static async update(id: string, dto: Partial<RoleDto>): Promise<Role> {
        const res = await api.put<Role>(`/roles/${id}`, dto);
        return res.data;
    }

    static async remove(id: string): Promise<void> {
        await api.delete(`/roles/${id}`);
    }

    static async getPermissions(id: string): Promise<string[]> {
        const res = await api.get<{ permissionIds?: string[]; permissions?: string[]; items?: string[] }>(`/roles/${id}/permissions`);
        // accept any of the common shapes
        return res.data.permissionIds ?? res.data.permissions ?? res.data.items ?? [];
    }

    static async assignPermissions(id: string, permissionIds: string[]): Promise<void> {
        await api.put(`/roles/${id}/permissions`, { permissionIds });
    }

    static async removePermission(id: string, permissionId: string): Promise<void> {
        await api.delete(`/roles/${id}/permissions/${permissionId}`);
    }

    static async listUsers(roleId: string): Promise<RoleUser[]> {
        const res = await api.get<listUsersResponse>(`/roles/${roleId}/users`);
        const data = res.data.users ?? [];
        console.log('Fetched users for role:', roleId, data);
        return Array.isArray(data) ? data : [];
    }

    static async addUser(roleId: string, payload: { email: string; password: string }): Promise<void> {
    await api.post(`/roles/${roleId}/users`, payload);
  }

    static async removeUser(roleId: string, userId: string): Promise<void> {
        await api.delete(`/roles/${roleId}/users/${userId}`);
    }
}
