import api from '../config/axios';
import { ApiResponse } from '../types/department.types';

export type UMSIntro = {
    id: string;
    name: string;
    type?: string;
    logoUrl?: string | null;
    modulesCount: number;
    platforms: { teacherApp: boolean; studentApp: boolean };
    status: 'active' | 'inactive';
    createdAt?: string;
    matriculeConfig?: {
        format: string;
        placeholders: Record<string, string>;
        sequenceLength: number;
    };
};
export interface UMS {
    id?: string;
    _id?: string;
    umsName: string;
    umsTagline?: string;
    umsWebsite?: string;
    umsDescription: string;
    umsType?: string;
    umsSize?: string;
    adminName: string;
    adminEmail: string;
    adminPhone?: string;
    enable2FA: boolean;
    roles: string[];
    departments: string[];
    modules: string[];
    platforms?: {
        teacherApp?: boolean;
        studentApp?: boolean;
        desktopOffices?: string[];
    };
    umsLogoUrl?: string;
    umsLogoPublicId?: string;
    umsPhotoUrl?: string;
    umsPhotoPublicId?: string;
    createdBy?: string;
    createdAt?: string;
    updatedAt?: string;
}

export type Platforms = {
    teacherApp: boolean;
    studentApp: boolean;
    desktopOffices: string[];
};

// unwrap ApiResponse<T> or raw T
const unwrap = <T>(payload: ApiResponse<T> | T): T => {
    const unknownPayload = payload as unknown as { data?: T };
    return unknownPayload && typeof unknownPayload === 'object' && 'data' in unknownPayload
        ? (unknownPayload.data as T)
        : (payload as T);
};

export class UMSService {
    private static readonly BASE_URL = '/ums';

    static async getIntro(): Promise<UMSIntro> {
        const res = await api.get<ApiResponse<UMSIntro>>('/ums/intro');
        return res.data.data;
    }

    // ---------- Modules ----------
    static async getModules(): Promise<string[]> {
        try {
            const res = await api.get<ApiResponse<string[]> | string[]>(
                `${UMSService.BASE_URL}/modules`
            );
            const modules = unwrap(res.data);
            return Array.isArray(modules) ? modules : [];
        } catch (error) {
            console.error('Error fetching modules:', error);
            throw new Error('Failed to fetch modules. Please try again.');
        }
    }

    static async updateModules(modules: string[]): Promise<string[]> {
        try {
            const res = await api.put<ApiResponse<string[]> | string[]>(
                `${UMSService.BASE_URL}/modules`,
                { modules }
            );
            const updated = unwrap(res.data);
            return Array.isArray(updated) ? updated : modules;
        } catch (error) {
            console.error('Error updating modules:', error);
            throw new Error('Failed to update modules. Please try again.');
        }
    }

    // Optional convenience for quick single-module enable/disable (if you exposed it)
    static async toggleModule(name: string, enable?: boolean): Promise<string[]> {
        try {
            const res = await api.patch<ApiResponse<string[]> | string[]>(
                `${UMSService.BASE_URL}/modules/${encodeURIComponent(name)}`,
                {},
                { params: typeof enable === 'boolean' ? { enable } : undefined }
            );
            const updated = unwrap(res.data);
            return Array.isArray(updated) ? updated : [];
        } catch (error) {
            console.error('Error toggling module:', error);
            throw new Error('Failed to toggle module. Please try again.');
        }
    }

    // ---------- Platforms ----------
    static async getPlatforms(): Promise<Platforms> {
        try {
            const res = await api.get<ApiResponse<Platforms> | Platforms>(
                `${UMSService.BASE_URL}/platforms`
            );
            const p = unwrap(res.data) as Platforms;
            return {
                teacherApp: !!p.teacherApp,
                studentApp: !!p.studentApp,
                desktopOffices: Array.isArray(p.desktopOffices) ? p.desktopOffices : [],
            };
        } catch (error) {
            console.error('Error fetching platforms:', error);
            throw new Error('Failed to fetch platforms. Please try again.');
        }
    }

    static async updatePlatforms(payload: Platforms): Promise<Platforms> {
        try {
            const res = await api.patch<ApiResponse<Platforms> | Platforms>(
                `${UMSService.BASE_URL}/platforms`,
                payload
            );
            const p = unwrap(res.data) as Platforms;
            return {
                teacherApp: !!p.teacherApp,
                studentApp: !!p.studentApp,
                desktopOffices: Array.isArray(p.desktopOffices) ? p.desktopOffices : [],
            };
        } catch (error) {
            console.error('Error updating platforms:', error);
            throw new Error('Failed to update platforms. Please try again.');
        }
    }

    // ---------- Stats (optional helpers) ----------
    static async countDepartments(): Promise<number> {
        try {
            const res = await api.get<ApiResponse<{ count: number }> | { count: number }>(
                `${UMSService.BASE_URL}/stats/departments/count`
            );
            const data = unwrap(res.data) as { count: number };
            return typeof data?.count === 'number' ? data.count : 0;
        } catch (error) {
            console.error('Error counting departments:', error);
            throw new Error('Failed to fetch department count. Please try again.');
        }
    }

    static async departmentsPerformance(): Promise<unknown[]> {
        try {
            const res = await api.get<ApiResponse<unknown[]> | unknown[]>(
                `${UMSService.BASE_URL}/stats/departments/performance`
            );
            const data = unwrap(res.data);
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error fetching departments performance:', error);
            throw new Error('Failed to fetch departments performance. Please try again.');
        }
    }

    // ---------- UMS profile (optional) ----------
    static async getCurrent(): Promise<UMS> {
        try {
            const res = await api.get<ApiResponse<UMS> | UMS>(`${UMSService.BASE_URL}`);
            return unwrap(res.data);
        } catch (error) {
            console.error('Error fetching UMS:', error);
            throw new Error('Failed to fetch UMS. Please try again.');
        }
    }

    static async update(payload: Partial<UMS>): Promise<UMS> {
        try {
            const res = await api.patch<ApiResponse<UMS> | UMS>(
                `${UMSService.BASE_URL}`,
                payload
            );
            return unwrap(res.data);
        } catch (error) {
            console.error('Error updating UMS:', error);
            throw new Error('Failed to update UMS. Please try again.');
        }
    }
}
