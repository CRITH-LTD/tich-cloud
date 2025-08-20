// services/ProgramService.ts
import api from '../config/axios';
import { CreateProgramDto, Program, UpdateProgramDto } from '../interfaces/types';
import type { ApiResponse } from '../types/department.types'; // reuse shape

const unwrap = <T>(payload: ApiResponse<T> | T): T => {
    const isApiResponse = (value: ApiResponse<T> | T): value is ApiResponse<T> => {
        return value !== null && typeof value === 'object' && 'data' in value;
    };
    return isApiResponse(payload) ? payload.data : payload;
};

export class ProgramService {
    private static readonly BASE_URL = '/programs';

    static async createProgram(payload: CreateProgramDto): Promise<Program> {
        try {
            // normalize/trim
            const body: CreateProgramDto = {
                ...payload,
                name: payload.name.trim(),
                description: payload.description?.trim(),
            };
            const res = await api.post<ApiResponse<Program> | Program>(this.BASE_URL, body);
            return unwrap(res.data);
        } catch (error) {
            console.error('Error creating program:', error);
            throw new Error('Failed to create program. Please try again.');
        }
    }

    static async getPrograms(): Promise<Program[]> {
        try {
            const res = await api.get<ApiResponse<Program[]>>(this.BASE_URL);
            const data = unwrap(res.data.data);
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error fetching programs:', error);
            throw new Error('Failed to fetch programs. Please try again.');
        }
    }

    static async getProgram(id: string): Promise<Program> {
        try {
            const res = await api.get<ApiResponse<Program> | Program>(`${this.BASE_URL}/${id}`);
            return unwrap(res.data);
        } catch (error) {
            console.error('Error fetching program:', error);
            throw new Error('Failed to fetch program. Please try again.');
        }
    }

    static async updateProgram(id: string, payload: UpdateProgramDto): Promise<Program> {
        try {
            const body: UpdateProgramDto = {
                ...payload,
                ...(payload.name ? { name: payload.name.trim() } : {}),
                ...(payload.description !== undefined ? { description: payload.description?.trim() } : {}),
            };
            const res = await api.patch<ApiResponse<Program> | Program>(`${this.BASE_URL}/${id}`, body);
            return unwrap(res.data);
        } catch (error) {
            console.error('Error updating program:', error);
            throw new Error('Failed to update program. Please try again.');
        }
    }

    static async deleteProgram(id: string): Promise<void> {
        try {
            await api.delete(`${this.BASE_URL}/${id}`);
        } catch (error) {
            console.error('Error deleting program:', error);
            throw new Error('Failed to delete program. Please try again.');
        }
    }
}
