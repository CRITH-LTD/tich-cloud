import api from '../config/axios';
import { CreateStudentDto, Student, UpdateStudentDto } from '../interfaces/types';
import type { ApiResponse } from '../types/department.types'; // reuse shape


const unwrap = <T>(payload: ApiResponse<T> | T): T => {
    const isApiResponse = (value: ApiResponse<T> | T): value is ApiResponse<T> => {
        return value !== null && typeof value === 'object' && 'data' in value;
    };
    return isApiResponse(payload) ? payload.data : payload;
};

export class StudentService {
    private static readonly BASE_URL = '/students';

    static async createStudent(payload: CreateStudentDto): Promise<Student> {
        try {
            // normalize/trim
            const body: CreateStudentDto = {
                ...payload,
                fullName: payload.fullName.trim(),
                email: payload.email?.trim(),
                phone: payload.phone.trim(),
                customFields: payload.customFields || {},
            };
            const res = await api.post<ApiResponse<Student> | Student>(this.BASE_URL, body);
            return unwrap(res.data);
        } catch (error) {
            console.error('Error creating student:', error);
            throw new Error('Failed to create student. Please try again.');
        }
    }

    static async getStudents(): Promise<Student[]> {
        try {
            const res = await api.get<ApiResponse<Student[]> | Student[]>(this.BASE_URL);
            const data = unwrap(res.data);
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error fetching students:', error);
            throw new Error('Failed to fetch students. Please try again.');
        }
    }

    static async getStudent(id: string): Promise<Student> {
        try {
            const res = await api.get<ApiResponse<Student> | Student>(`${this.BASE_URL}/${id}`);
            return unwrap(res.data);
        } catch (error) {
            console.error('Error fetching student:', error);
            throw new Error('Failed to fetch student. Please try again.');
        }
    }

    static async getStudentByMatricule(matricule: string): Promise<Student> {
        try {
            const res = await api.get<ApiResponse<Student> | Student>(`${this.BASE_URL}/matricule/${matricule}`);
            return unwrap(res.data);
        } catch (error) {
            console.error('Error fetching student by matricule:', error);
            throw new Error('Failed to fetch student. Please try again.');
        }
    }

    static async getStudentsByProgram(programId: string): Promise<Student[]> {
        try {
            const res = await api.get<ApiResponse<Student[]> | Student[]>(`${this.BASE_URL}/program/${programId}`);
            const data = unwrap(res.data);
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error fetching students by program:', error);
            throw new Error('Failed to fetch students by program. Please try again.');
        }
    }

    static async updateStudent(id: string, payload: UpdateStudentDto): Promise<Student> {
        try {
            const body: UpdateStudentDto = {
                ...payload,
                ...(payload.fullName ? { fullName: payload.fullName.trim() } : {}),
                ...(payload.email !== undefined ? { email: payload.email?.trim() } : {}),
                ...(payload.phone ? { phone: payload.phone.trim() } : {}),
                ...(payload.customFields !== undefined ? { customFields: payload.customFields } : {}),
            };
            const res = await api.patch<ApiResponse<Student> | Student>(`${this.BASE_URL}/${id}`, body);
            return unwrap(res.data);
        } catch (error) {
            console.error('Error updating student:', error);
            throw new Error('Failed to update student. Please try again.');
        }
    }

    static async deleteStudent(id: string): Promise<void> {
        try {
            await api.delete(`${this.BASE_URL}/${id}`);
        } catch (error) {
            console.error('Error deleting student:', error);
            throw new Error('Failed to delete student. Please try again.');
        }
    }

    static async bulkCreateStudents(payload: CreateStudentDto[]): Promise<Student[]> {
        try {
            const body = payload.map(student => ({
                ...student,
                fullName: student.fullName.trim(),
                email: student.email?.trim(),
                phone: student.phone.trim(),
                customFields: student.customFields || {},
            }));
            const res = await api.post<ApiResponse<Student[]> | Student[]>(`${this.BASE_URL}/bulk`, body);
            const data = unwrap(res.data);
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error bulk creating students:', error);
            throw new Error('Failed to create students in bulk. Please try again.');
        }
    }

    static async searchStudents(query: string): Promise<Student[]> {
        try {
            const res = await api.get<ApiResponse<Student[]> | Student[]>(
                `${this.BASE_URL}/search?q=${encodeURIComponent(query)}`
            );
            const data = unwrap(res.data);
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error searching students:', error);
            throw new Error('Failed to search students. Please try again.');
        }
    }
}