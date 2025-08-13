import { UserPlus, User, AlertCircle, Mail, Phone, GraduationCap, BookOpen, Info, Plus, X } from "lucide-react";
import { useState, useEffect } from "react";
import { CreateStudentDto, Student } from "../../../../../interfaces/types";
import { fmtPhone } from "../../../../../utils";
import { Program } from "./ProgramSettings";

const StudentFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (dto: CreateStudentDto) => Promise<void>;
    programs: Program[];
    student?: Student | null;
    title?: string;
}> = ({ isOpen, onClose, onSubmit, programs, student, title = 'Add Student' }) => {
    const [form, setForm] = useState<CreateStudentDto>({
        fullName: '',
        email: '',
        phone: '',
        program: '',
        customFields: {},
    });
    const [errors, setErrors] = useState<Partial<Record<keyof CreateStudentDto | 'customField', string>>>({});
    const [saving, setSaving] = useState(false);
    const [customFieldKey, setCustomFieldKey] = useState('');
    const [customFieldValue, setCustomFieldValue] = useState('');

    // Initialize form when modal opens or student changes
    useEffect(() => {
        if (student) {
            setForm({
                fullName: student.fullName || '',
                email: '', // Email from customFields if exists
                phone: student.phone || '',
                program: student.program || '',
                customFields: student.customFields || {},
            });
        } else {
            setForm({
                fullName: '',
                email: '',
                phone: '',
                program: '',
                customFields: {},
            });
        }
        setErrors({});
        setCustomFieldKey('');
        setCustomFieldValue('');
    }, [student, isOpen]);

    const setField = (k: keyof CreateStudentDto) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const v = e.target.value;
        setForm(prev => ({ ...prev, [k]: v }));
        if (errors[k]) setErrors(prev => ({ ...prev, [k]: undefined }));
    };

    const addCustomField = () => {
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
    };

    const removeCustomField = (key: string) => {
        setForm(prev => {
            const newFields = { ...prev.customFields };
            delete newFields[key];
            return { ...prev, customFields: newFields };
        });
    };

    const validate = (): boolean => {
        const e: Partial<Record<keyof CreateStudentDto | 'customField', string>> = {};

        // Full name validation
        if (!form.fullName.trim()) {
            e.fullName = 'Student name is required';
        } else if (form.fullName.trim().length < 2) {
            e.fullName = 'Name must be at least 2 characters';
        } else if (form.fullName.trim().length > 100) {
            e.fullName = 'Name must not exceed 100 characters';
        }

        // Email validation (optional)
        if (form.email && form.email.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(form.email.trim())) {
                e.email = 'Please enter a valid email address';
            }
        }

        // Phone validation
        if (!form.phone.trim()) {
            e.phone = 'Phone number is required';
        } else {
            // Basic Cameroon phone validation
            const phoneRegex = /^\+237[0-9]{9}$/;
            if (!phoneRegex.test(form.phone.trim())) {
                e.phone = 'Phone must be in format +237XXXXXXXXX';
            }
        }

        // Program validation
        if (!form.program) {
            e.program = 'Please select a program';
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (ev: React.FormEvent) => {
        ev.preventDefault();
        if (!validate()) return;

        setSaving(true);
        try {
            const dto: CreateStudentDto = {
                fullName: form.fullName.trim(),
                email: form.email?.trim() || undefined,
                phone: form.phone.trim(),
                program: form.program,
                customFields: form.customFields,
            };
            await onSubmit(dto);
            onClose();
        } catch {
            /* toast from parent/hook */
        } finally {
            setSaving(false);
        }
    };

    const getProgramName = (id: string) => {
        return programs.find(p => p._id === id)?.name || '';
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                <UserPlus className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                                <p className="text-sm text-gray-500">
                                    {student ? 'Update student information and enrollment' : 'Register a new student in the system'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {/* Personal Information Section */}
                    <div className="space-y-4">
                        <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Personal Information
                        </h4>

                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={form.fullName}
                                onChange={setField('fullName')}
                                disabled={saving}
                                placeholder="e.g., John Doe"
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
                                    ${errors.fullName
                                        ? 'border-red-300 bg-red-50 focus:ring-red-500'
                                        : 'border-gray-300 hover:border-blue-300 bg-white'
                                    }`}
                            />
                            {errors.fullName && (
                                <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    {errors.fullName}
                                </div>
                            )}
                        </div>

                        {/* Email and Phone Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    <Mail className="w-4 h-4 inline mr-1" />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={setField('email')}
                                    disabled={saving}
                                    placeholder="student@example.com"
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
                                        ${errors.email
                                            ? 'border-red-300 bg-red-50 focus:ring-red-500'
                                            : 'border-gray-300 hover:border-blue-300 bg-white'
                                        }`}
                                />
                                {errors.email && (
                                    <div className="mt-1 flex items-center gap-2 text-red-600 text-xs">
                                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                        {errors.email}
                                    </div>
                                )}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    <Phone className="w-4 h-4 inline mr-1" />
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    value={form.phone}
                                    onChange={setField('phone')}
                                    disabled={saving}
                                    placeholder="+237678123456"
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
                                        ${errors.phone
                                            ? 'border-red-300 bg-red-50 focus:ring-red-500'
                                            : 'border-gray-300 hover:border-blue-300 bg-white'
                                        }`}
                                />
                                {errors.phone && (
                                    <div className="mt-1 flex items-center gap-2 text-red-600 text-xs">
                                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                        {errors.phone}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Academic Information */}
                    <div className="space-y-4">
                        <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2">
                            <GraduationCap className="w-4 h-4" />
                            Academic Information
                        </h4>

                        {/* Program Selection */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                <BookOpen className="w-4 h-4 inline mr-1" />
                                Program <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={form.program}
                                onChange={setField('program')}
                                disabled={saving}
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
                                    ${errors.program
                                        ? 'border-red-300 bg-red-50 focus:ring-red-500'
                                        : 'border-gray-300 hover:border-blue-300 bg-white'
                                    }`}
                            >
                                <option value="">Choose a program...</option>
                                {programs.map(p => (
                                    <option key={p._id ?? p.name} value={p._id ?? ''}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                            {errors.program && (
                                <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    {errors.program}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Custom Fields Section */}
                    <div className="space-y-4">
                        <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2">
                            <Info className="w-4 h-4" />
                            Additional Information
                        </h4>

                        {/* Add Custom Field */}
                        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    placeholder="Field name (e.g., parent_name)"
                                    value={customFieldKey}
                                    onChange={(e) => setCustomFieldKey(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Field value"
                                        value={customFieldValue}
                                        onChange={(e) => setCustomFieldValue(e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <button
                                        type="button"
                                        onClick={addCustomField}
                                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            {errors.customField && (
                                <div className="flex items-center gap-2 text-red-600 text-sm">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    {errors.customField}
                                </div>
                            )}
                        </div>

                        {/* Display Custom Fields */}
                        {Object.entries(form.customFields || {}).length > 0 && (
                            <div className="space-y-2">
                                {Object.entries(form.customFields || {}).map(([key, value]) => (
                                    <div key={key} className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                                        <div className="text-sm">
                                            <span className="font-medium text-blue-900">{key}:</span>
                                            <span className="text-blue-700 ml-2">{String(value)}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeCustomField(key)}
                                            className="text-blue-600 hover:text-blue-800 p-1"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Student Summary Card */}
                    {form.fullName && form.program && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                            <h4 className="font-semibold text-blue-900 mb-2">Student Summary</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                <div>
                                    <span className="text-gray-600">Name:</span>
                                    <span className="font-medium text-gray-900 ml-2">{form.fullName}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Phone:</span>
                                    <span className="font-medium text-gray-900 ml-2">{fmtPhone(form.phone)}</span>
                                </div>
                                <div className="md:col-span-2">
                                    <span className="text-gray-600">Program:</span>
                                    <span className="font-medium text-gray-900 ml-2">{getProgramName(form.program)}</span>
                                </div>
                                {form.email && (
                                    <div className="md:col-span-2">
                                        <span className="text-gray-600">Email:</span>
                                        <span className="font-medium text-gray-900 ml-2">{form.email}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving || !form.fullName.trim() || !form.program || !form.phone.trim()}
                            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                        >
                            {saving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>{student ? 'Updating...' : 'Registering...'}</span>
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-4 h-4" />
                                    <span>{student ? 'Update Student' : 'Register Student'}</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StudentFormModal;