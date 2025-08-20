import api from '../config/axios';
import {
    Faculty,
    School,
    CertificationProgram,
    CreateFacultyDto,
    UpdateFacultyDto,
    CreateSchoolDto,
    UpdateSchoolDto,
    CreateCertificationProgramDto,
    UpdateCertificationProgramDto,
    ApiResponse,
} from '../types/academicUnits.types';

export class FacultyService {
    private static readonly BASE_URL = '/faculties';

    static async createFaculty(payload: CreateFacultyDto): Promise<Faculty> {
        try {
            const response = await api.post<ApiResponse<Faculty>>(
                FacultyService.BASE_URL,
                payload
            );
            return response.data.data;
        } catch (error) {
            console.error('Error creating faculty:', error);
            throw new Error('Failed to create faculty. Please try again.');
        }
    }

    static async getFaculties(): Promise<Faculty[]> {
        try {
            const response = await api.get<ApiResponse<Faculty[]>>(
                FacultyService.BASE_URL
            );
            return response.data.data as unknown as Faculty[];
        } catch (error) {
            console.error('Error fetching faculties:', error);
            throw new Error('Failed to fetch faculties. Please try again.');
        }
    }

    static async getFaculty(id: string): Promise<Faculty> {
        try {
            const response = await api.get<ApiResponse<Faculty>>(
                `${FacultyService.BASE_URL}/${id}`
            );
            return response.data.data;
        } catch (error) {
            console.error('Error fetching faculty:', error);
            throw new Error('Failed to fetch faculty. Please try again.');
        }
    }

    static async updateFaculty(id: string, payload: UpdateFacultyDto): Promise<Faculty> {
        try {
            const response = await api.patch<ApiResponse<Faculty>>(
                `${FacultyService.BASE_URL}/${id}`,
                payload
            );
            return response.data.data;
        } catch (error) {
            console.error('Error updating faculty:', error);
            throw new Error('Failed to update faculty. Please try again.');
        }
    }

    static async deleteFaculty(id: string): Promise<void> {
        try {
            await api.delete<ApiResponse<void>>(
                `${FacultyService.BASE_URL}/${id}`
            );
        } catch (error) {
            console.error('Error deleting faculty:', error);
            throw new Error('Failed to delete faculty. Please try again.');
        }
    }
}

export class SchoolService {
    private static readonly BASE_URL = '/schools';

    static async createSchool(payload: CreateSchoolDto): Promise<School> {
        try {
            const response = await api.post<ApiResponse<School>>(
                SchoolService.BASE_URL,
                payload
            );
            return response.data.data;
        } catch (error) {
            console.error('Error creating school:', error);
            throw new Error('Failed to create school. Please try again.');
        }
    }

    static async getSchools(): Promise<School[]> {
        try {
            const response = await api.get<ApiResponse<School[]>>(
                SchoolService.BASE_URL
            );
            return response.data.data as unknown as School[];
        } catch (error) {
            console.error('Error fetching schools:', error);
            throw new Error('Failed to fetch schools. Please try again.');
        }
    }

    static async getSchool(id: string): Promise<School> {
        try {
            const response = await api.get<ApiResponse<School>>(
                `${SchoolService.BASE_URL}/${id}`
            );
            return response.data.data;
        } catch (error) {
            console.error('Error fetching school:', error);
            throw new Error('Failed to fetch school. Please try again.');
        }
    }

    static async updateSchool(id: string, payload: UpdateSchoolDto): Promise<School> {
        try {
            const response = await api.patch<ApiResponse<School>>(
                `${SchoolService.BASE_URL}/${id}`,
                payload
            );
            return response.data.data;
        } catch (error) {
            console.error('Error updating school:', error);
            throw new Error('Failed to update school. Please try again.');
        }
    }

    static async deleteSchool(id: string): Promise<void> {
        try {
            await api.delete<ApiResponse<void>>(
                `${SchoolService.BASE_URL}/${id}`
            );
        } catch (error) {
            console.error('Error deleting school:', error);
            throw new Error('Failed to delete school. Please try again.');
        }
    }
}

export class CertificationProgramService {
    private static readonly BASE_URL = '/certification-programs';

    static async createCertificationProgram(payload: CreateCertificationProgramDto): Promise<CertificationProgram> {
        try {
            const response = await api.post<ApiResponse<CertificationProgram>>(
                CertificationProgramService.BASE_URL,
                payload
            );
            return response.data.data;
        } catch (error) {
            console.error('Error creating certification program:', error);
            throw new Error('Failed to create certification program. Please try again.');
        }
    }

    static async getCertificationPrograms(): Promise<CertificationProgram[]> {
        try {
            const response = await api.get<ApiResponse<CertificationProgram[]>>(
                CertificationProgramService.BASE_URL
            );
            return response.data.data as unknown as CertificationProgram[];
        } catch (error) {
            console.error('Error fetching certification programs:', error);
            throw new Error('Failed to fetch certification programs. Please try again.');
        }
    }

    static async getCertificationProgram(id: string): Promise<CertificationProgram> {
        try {
            const response = await api.get<ApiResponse<CertificationProgram>>(
                `${CertificationProgramService.BASE_URL}/${id}`
            );
            return response.data.data;
        } catch (error) {
            console.error('Error fetching certification program:', error);
            throw new Error('Failed to fetch certification program. Please try again.');
        }
    }

    static async updateCertificationProgram(id: string, payload: UpdateCertificationProgramDto): Promise<CertificationProgram> {
        try {
            const response = await api.patch<ApiResponse<CertificationProgram>>(
                `${CertificationProgramService.BASE_URL}/${id}`,
                payload
            );
            return response.data.data;
        } catch (error) {
            console.error('Error updating certification program:', error);
            throw new Error('Failed to update certification program. Please try again.');
        }
    }

    static async deleteCertificationProgram(id: string): Promise<void> {
        try {
            await api.delete<ApiResponse<void>>(
                `${CertificationProgramService.BASE_URL}/${id}`
            );
        } catch (error) {
            console.error('Error deleting certification program:', error);
            throw new Error('Failed to delete certification program. Please try again.');
        }
    }
}