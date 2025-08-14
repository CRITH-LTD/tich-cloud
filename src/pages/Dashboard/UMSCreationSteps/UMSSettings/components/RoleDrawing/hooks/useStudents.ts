import { useCallback, useState } from 'react';
import { Student, CreateStudentDto, UpdateStudentDto } from '../../../../../../../interfaces/types';
import { StudentService } from '../../../../../../../services/StudentService';

export interface UseStudentsReturn {
    // Student data
    students: Student[];
    loading: boolean;
    error: string | null;

    // Form state
    form: CreateStudentDto;
    originalForm: CreateStudentDto | null;
    currentStep: number;
    errors: Partial<Record<keyof CreateStudentDto | 'customField', string>>;
    saving: boolean;
    customFieldKey: string;
    customFieldValue: string;

    // Student operations
    refreshStudents: () => Promise<void>;
    onAddStudent: (dto: CreateStudentDto) => Promise<void>;
    onEditStudent: (index: number, dto: UpdateStudentDto) => Promise<void>;
    onDeleteStudent: (index: number) => Promise<void>;
    setStudents: (list: Student[]) => void;
    searchStudents: (query: string) => Promise<Student[]>;
    getStudentsByProgram: (programId: string) => Promise<Student[]>;
    bulkCreateStudents: (students: CreateStudentDto[]) => Promise<void>;

    // Form operations
    initializeForm: (student?: Student | null) => void;
    setField: (field: keyof CreateStudentDto, value: any) => void;
    setCurrentStep: (step: number) => void;
    validateStep: (step: number) => boolean;
    nextStep: () => void;
    prevStep: () => void;
    addCustomField: () => void;
    removeCustomField: (key: string) => void;
    setCustomFieldKey: (key: string) => void;
    setCustomFieldValue: (value: string) => void;
    handleFormSubmit: (onSubmit: (dto: CreateStudentDto | UpdateStudentDto) => Promise<void>, onClose: () => void) => Promise<void>;

    // Form utilities
    hasFormChanged: () => boolean;
    getChangedFields: () => Partial<CreateStudentDto>;
    resetForm: () => void;
    clearErrors: () => void;
}

const getInitialForm = (): CreateStudentDto => ({
    fullName: '',
    email: '',
    phone: '',
    program: '',
    level: '',
    gender: 'prefer not to say',
    guardian: '',
    guardianPhone: '',
    guardianAddress: '',
    customFields: {},
});

export const useStudents = (): UseStudentsReturn => {
    // Student data state
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [form, setForm] = useState<CreateStudentDto>(getInitialForm());
    const [originalForm, setOriginalForm] = useState<CreateStudentDto | null>(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState<Partial<Record<keyof CreateStudentDto | 'customField', string>>>({});
    const [saving, setSaving] = useState(false);
    const [customFieldKey, setCustomFieldKey] = useState('');
    const [customFieldValue, setCustomFieldValue] = useState('');

    const showError = useCallback((msg: string) => {
        setError(msg);
        setTimeout(() => setError(null), 5000);
    }, []);

    // Student operations
    const refreshStudents = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const list = await StudentService.getStudents();
            setStudents(Array.isArray(list) ? list : []);
        } catch (e) {
            showError(e instanceof Error ? e.message : 'Failed to refresh students');
        } finally {
            setLoading(false);
        }
    }, [showError]);

    const onAddStudent = useCallback(async (dto: CreateStudentDto) => {
        setLoading(true);
        setError(null);
        try {
            const created = await StudentService.createStudent(dto);
            setStudents(prev => [...prev, created]);
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Failed to create student';
            showError(msg);
            throw e;
        } finally {
            setLoading(false);
        }
    }, [showError]);

    const onEditStudent = useCallback(async (index: number, dto: UpdateStudentDto) => {
        const target = students[index];
        if (!target?.id) {
            showError('Invalid student selected');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const updated = await StudentService.updateStudent(target.id, dto);
            setStudents(prev => {
                const next = [...prev];
                next[index] = updated;
                return next;
            });
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Failed to update student';
            showError(msg);
            throw e;
        } finally {
            setLoading(false);
        }
    }, [students, showError]);

    const onDeleteStudent = useCallback(async (index: number) => {
        const target = students[index];
        if (!target?.id) {
            showError('Invalid student selected');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await StudentService.deleteStudent(target.id);
            setStudents(prev => prev.filter((_, i) => i !== index));
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Failed to delete student';
            showError(msg);
            throw e;
        } finally {
            setLoading(false);
        }
    }, [students, showError]);

    const searchStudents = useCallback(async (query: string): Promise<Student[]> => {
        setLoading(true);
        setError(null);
        try {
            const results = await StudentService.searchStudents(query);
            return Array.isArray(results) ? results : [];
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Failed to search students';
            showError(msg);
            return [];
        } finally {
            setLoading(false);
        }
    }, [showError]);

    const getStudentsByProgram = useCallback(async (programId: string): Promise<Student[]> => {
        setLoading(true);
        setError(null);
        try {
            const results = await StudentService.getStudentsByProgram(programId);
            return Array.isArray(results) ? results : [];
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Failed to fetch students by program';
            showError(msg);
            return [];
        } finally {
            setLoading(false);
        }
    }, [showError]);

    const bulkCreateStudents = useCallback(async (studentDtos: CreateStudentDto[]) => {
        setLoading(true);
        setError(null);
        try {
            const created = await StudentService.bulkCreateStudents(studentDtos);
            setStudents(prev => [...prev, ...created]);
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Failed to create students in bulk';
            showError(msg);
            throw e;
        } finally {
            setLoading(false);
        }
    }, [showError]);

    // Form operations
    const initializeForm = useCallback((student?: Student | null) => {
        if (student) {
            const initialForm = {
                fullName: student.fullName || '',
                email: student.user?.email || '',
                phone: student.phone || '',
                gender: student.gender || 'prefer not to say',
                level: student.level || '',
                program: student.programId || '',
                guardian: student.guardian?.name || '',
                guardianPhone: student.guardian?.phone || '',
                guardianAddress: student.guardian?.address || '',
                customFields: student.customFields || {},
            };
            setForm(initialForm);
            setOriginalForm(initialForm);
        } else {
            const initialForm = getInitialForm();
            setForm(initialForm);
            setOriginalForm(null);
        }

        setErrors({});
        setCustomFieldKey('');
        setCustomFieldValue('');
        setCurrentStep(1);
    }, []);

    const setField = useCallback((field: keyof CreateStudentDto, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    }, [errors]);

    const validateStep = useCallback((step: number): boolean => {
        const newErrors: Partial<Record<keyof CreateStudentDto | 'customField', string>> = {};

        switch (step) {
            case 1:
                if (!form.fullName.trim()) {
                    newErrors.fullName = 'Student name is required';
                } else if (form.fullName.trim().length < 2) {
                    newErrors.fullName = 'Name must be at least 2 characters';
                }

                if (form.email && form.email.trim()) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(form.email.trim())) {
                        newErrors.email = 'Please enter a valid email address';
                    }
                }

                if (!form.gender) {
                    newErrors.gender = 'Gender is required';
                }

                if (!form.phone.trim()) {
                    newErrors.phone = 'Phone number is required';
                } else {
                    const phoneRegex = /^\+237[0-9]{9}$/;
                    if (!phoneRegex.test(form.phone.trim())) {
                        newErrors.phone = 'Phone must be in format +237XXXXXXXXX';
                    }
                }
                break;

            case 2:
                if (!form.program) {
                    newErrors.program = 'Please select a program';
                }
                if (!form.level.trim()) {
                    newErrors.level = 'Academic level is required';
                }
                break;

            case 3:
                if (!form.guardian.trim()) {
                    newErrors.guardian = 'Guardian name is required';
                }
                if (!form.guardianPhone.trim()) {
                    newErrors.guardianPhone = 'Guardian phone is required';
                } else {
                    const phoneRegex = /^\+237[0-9]{9}$/;
                    if (!phoneRegex.test(form.guardianPhone.trim())) {
                        newErrors.guardianPhone = 'Guardian phone must be in format +237XXXXXXXXX';
                    }
                }
                if (!form.guardianAddress.trim()) {
                    newErrors.guardianAddress = 'Guardian address is required';
                }
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [form]);

    const nextStep = useCallback(() => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 4));
        }
    }, [currentStep, validateStep]);

    const prevStep = useCallback(() => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    }, []);

    const addCustomField = useCallback(() => {
        if (!customFieldKey.trim() || !customFieldValue.trim()) {
            setErrors(prev => ({ ...prev, customField: 'Both field name and value are required' }));
            return;
        }

        if (form.customFields?.[customFieldKey]) {
            setErrors(prev => ({ ...prev, customField: 'Field name already exists' }));
            return;
        }

        setForm(prev => ({
            ...prev,
            customFields: {
                ...prev.customFields,
                [customFieldKey.trim()]: customFieldValue.trim()
            }
        }));

        setCustomFieldKey('');
        setCustomFieldValue('');
        setErrors(prev => ({ ...prev, customField: undefined }));
    }, [customFieldKey, customFieldValue, form.customFields]);

    const removeCustomField = useCallback((key: string) => {
        setForm(prev => {
            const newFields = { ...prev.customFields };
            delete newFields[key];
            return { ...prev, customFields: newFields };
        });
    }, []);

    const getChangedFields = useCallback((): Partial<CreateStudentDto> => {
        if (!originalForm) return form; // Return full form for new students

        const changes: Partial<CreateStudentDto> = {};

        const fieldsToCheck: (keyof CreateStudentDto)[] = [
            'fullName', 'email', 'phone', 'gender', 'level', 'program',
            'guardian', 'guardianPhone', 'guardianAddress'
        ];

        for (const field of fieldsToCheck) {
            const currentValue = (form[field] || '').toString().trim();
            const originalValue = (originalForm[field] || '').toString().trim();

            if (currentValue !== originalValue) {
                switch (field) {
                    case 'email':
                        changes.email = currentValue || undefined;
                        break;
                    case 'gender':
                        changes.gender = (currentValue || undefined) as CreateStudentDto['gender'];
                        break;
                    default:
                        // TS now knows this is always a string field
                        changes[field as Exclude<keyof CreateStudentDto, 'gender' | 'email' | 'customFields'>] =
                            currentValue === '' ? undefined : currentValue;
                        break;
                }
            }
        }

        // Handle customFields separately
        if (form.customFields && JSON.stringify(form.customFields) !== JSON.stringify(originalForm.customFields)) {
            changes.customFields = form.customFields;
        }



        // Check custom fields
        const currentCustomFields = form.customFields || {};
        const originalCustomFields = originalForm.customFields || {};

        const allCustomFieldKeys = new Set([
            ...Object.keys(currentCustomFields),
            ...Object.keys(originalCustomFields)
        ]);

        const changedCustomFields: Record<string, any> = {};
        let customFieldsChanged = false;

        for (const key of allCustomFieldKeys) {
            const currentValue = currentCustomFields[key];
            const originalValue = originalCustomFields[key];

            if (currentValue !== originalValue) {
                changedCustomFields[key] = currentValue;
                customFieldsChanged = true;
            }
        }

        if (customFieldsChanged) {
            changes.customFields = changedCustomFields;
        }

        return changes;
    }, [form, originalForm]);

    const hasFormChanged = useCallback((): boolean => {
        if (!originalForm) return true; // Always allow submission for new students
        const changes = getChangedFields();
        return Object.keys(changes).length > 0;
    }, [originalForm, getChangedFields]);

    const handleFormSubmit = useCallback(async (
        onSubmit: (dto: CreateStudentDto | UpdateStudentDto) => Promise<void>,
        onClose: () => void
    ) => {
        // Prevent submission if not on the final step
        if (currentStep !== 4) {
            return;
        }

        // Validate all steps before submitting
        let allValid = true;
        for (let i = 1; i <= 3; i++) {
            if (!validateStep(i)) {
                allValid = false;
                break;
            }
        }

        if (!allValid) {
            // Go to first step with errors
            for (let i = 1; i <= 3; i++) {
                if (!validateStep(i)) {
                    setCurrentStep(i);
                    break;
                }
            }
            return;
        }

        setSaving(true);
        try {
            if (originalForm) {
                // For updates: send only changed fields
                const changedFields = getChangedFields();

                if (Object.keys(changedFields).length === 0) {
                    // No changes, just close the modal
                    onClose();
                    return;
                }

                // Create UpdateStudentDto with only changed fields
                const updateDto: UpdateStudentDto = {};

                // Map the changed fields to update DTO format
                if (changedFields.fullName !== undefined) updateDto.fullName = changedFields.fullName;
                if (changedFields.email !== undefined) updateDto.email = changedFields.email;
                if (changedFields.phone !== undefined) updateDto.phone = changedFields.phone;
                if (changedFields.gender !== undefined) updateDto.gender = changedFields.gender;
                if (changedFields.level !== undefined) updateDto.level = changedFields.level;
                if (changedFields.program !== undefined) updateDto.program = changedFields.program;
                if (changedFields.customFields !== undefined) updateDto.customFields = changedFields.customFields;

                // Handle guardian fields - group them if any guardian field changed
                if (changedFields.guardian !== undefined ||
                    changedFields.guardianPhone !== undefined ||
                    changedFields.guardianAddress !== undefined) {
                    updateDto.guardian = form.guardian.trim();
                    updateDto.guardianPhone = form.guardianPhone.trim();
                    updateDto.guardianAddress = form.guardianAddress.trim();
                }

                await onSubmit(updateDto);
            } else {
                // For new students: send full form data
                const dto: CreateStudentDto = {
                    fullName: form.fullName.trim(),
                    email: form.email?.trim() || undefined,
                    phone: form.phone.trim(),
                    level: form.level.trim(),
                    gender: form.gender,
                    program: form.program,
                    customFields: form.customFields,
                    guardian: form.guardian.trim(),
                    guardianPhone: form.guardianPhone.trim(),
                    guardianAddress: form.guardianAddress.trim(),
                };
                await onSubmit(dto);
            }
            onClose();
        } catch (error) {
            console.error('Submit error:', error);
            throw error;
        } finally {
            setSaving(false);
        }
    }, [currentStep, validateStep, originalForm, getChangedFields, form]);

    const resetForm = useCallback(() => {
        setForm(getInitialForm());
        setOriginalForm(null);
        setCurrentStep(1);
        setErrors({});
        setCustomFieldKey('');
        setCustomFieldValue('');
    }, []);

    const clearErrors = useCallback(() => {
        setErrors({});
    }, []);

    return {
        // Student data
        students,
        loading,
        error,

        // Form state
        form,
        originalForm,
        currentStep,
        errors,
        saving,
        customFieldKey,
        customFieldValue,

        // Student operations
        refreshStudents,
        onAddStudent,
        onEditStudent,
        onDeleteStudent,
        setStudents,
        searchStudents,
        getStudentsByProgram,
        bulkCreateStudents,

        // Form operations
        initializeForm,
        setField,
        setCurrentStep,
        validateStep,
        nextStep,
        prevStep,
        addCustomField,
        removeCustomField,
        setCustomFieldKey,
        setCustomFieldValue,
        handleFormSubmit,

        // Form utilities
        hasFormChanged,
        getChangedFields,
        resetForm,
        clearErrors,
    };
};