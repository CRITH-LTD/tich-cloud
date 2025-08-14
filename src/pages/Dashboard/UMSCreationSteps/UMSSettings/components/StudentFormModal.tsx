import React, { useEffect } from 'react';
import {
    UserPlus,
    User,
    Mail,
    Phone,
    GraduationCap,
    BookOpen,
    Info,
    AlertCircle,
    Plus,
    X,
    Shield,
    MapPin,
    Check,
    ChevronRight,
    ChevronLeft,
    Save,
    UserCheck
} from 'lucide-react';
import { CreateStudentDto, Student } from '../../../../../interfaces/types';
import { Program } from './ProgramSettings';
import { useStudents } from './RoleDrawing/hooks/useStudents';
import { fmtPhone } from '../../../../../utils';

interface StudentFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (dto: CreateStudentDto | Partial<CreateStudentDto>) => Promise<void>; // The hook handles the DTO creation
    programs: Program[];
    student?: Student | null;
    title?: string;
}

const StudentFormModal: React.FC<StudentFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    programs,
    student,
    title = 'Add Student'
}) => {
    const {
        // Form state
        form,
        currentStep,
        errors,
        saving,
        customFieldKey,
        customFieldValue,

        // Form operations
        initializeForm,
        setField,
        setCurrentStep,
        nextStep,
        prevStep,
        addCustomField,
        removeCustomField,
        setCustomFieldKey,
        setCustomFieldValue,
        handleFormSubmit,

        // Form utilities
        hasFormChanged,
        // getChangedFields,
    } = useStudents();

    const steps = [
        { id: 1, title: 'Personal Info', icon: User, description: 'Basic personal details' },
        { id: 2, title: 'Academic', icon: GraduationCap, description: 'Program selection' },
        { id: 3, title: 'Guardian', icon: Shield, description: 'Guardian information' },
        { id: 4, title: 'Additional', icon: Info, description: 'Extra details' }
    ];

    // Initialize form when modal opens or student changes
    useEffect(() => {
        if (isOpen) {
            initializeForm(student);
        }
    }, [student, isOpen, initializeForm]);

    // Simplified field setter
    const setFormField = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setField(field, e.target.value);
    };

    const getProgramName = (id: string) => {
        return programs.find(p => p._id === id)?.name || '';
    };

    const StepIndicator = () => (
        <div className="flex items-center justify-between mb-8 px-4">
            {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                const isAccessible = student ? true : currentStep >= step.id;

                return (
                    <div key={step.id} className="flex items-center flex-1">
                        <div className="flex flex-col items-center flex-1">
                            <button
                                onClick={() => isAccessible && setCurrentStep(step.id)}
                                disabled={!isAccessible}
                                className={`
                                    w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 mb-2
                                    ${isCompleted
                                        ? 'bg-green-500 border-green-500 text-white shadow-lg'
                                        : isActive
                                            ? 'bg-blue-500 border-blue-500 text-white shadow-lg scale-110'
                                            : isAccessible
                                                ? 'bg-white border-gray-300 text-gray-600 hover:border-blue-300 hover:text-blue-500 cursor-pointer'
                                                : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                                    }
                                    ${student && !isActive ? 'hover:scale-105' : ''}
                                `}
                            >
                                {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                            </button>
                            <div className="text-center">
                                <span className={`text-sm font-medium block ${isActive
                                    ? 'text-blue-600'
                                    : isCompleted
                                        ? 'text-green-600'
                                        : isAccessible
                                            ? 'text-gray-500 hover:text-blue-500'
                                            : 'text-gray-400'
                                    }`}>
                                    {step.title}
                                </span>
                                <span className="text-xs text-gray-400 hidden sm:block">
                                    {step.description}
                                </span>
                                {student && isAccessible && !isActive && (
                                    <span className="text-xs text-blue-500 font-medium">Click to edit</span>
                                )}
                            </div>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`flex-1 h-0.5 mx-4 mt-6 transition-colors duration-300 ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                                }`} />
                        )}
                    </div>
                );
            })}
        </div>
    );

    const renderPersonalInfoStep = () => (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h3>
                <p className="text-gray-600">Let's start with the student's basic details</p>
            </div>

            <div className="grid gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={form.fullName}
                        onChange={setFormField('fullName')}
                        disabled={saving}
                        placeholder="Enter student's full name"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
                            ${errors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-300 bg-white'}
                        `}
                    />
                    {errors.fullName && (
                        <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {errors.fullName}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                            <Mail className="w-4 h-4 inline mr-1" />
                            Email Address (Optional)
                        </label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={setFormField('email')}
                            disabled={saving}
                            placeholder="student@example.com"
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
                                ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-300 bg-white'}
                            `}
                        />
                        {errors.email && (
                            <div className="mt-1 flex items-center gap-2 text-red-600 text-xs">
                                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                {errors.email}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                            <Phone className="w-4 h-4 inline mr-1" />
                            Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            value={form.phone}
                            onChange={setFormField('phone')}
                            disabled={saving}
                            placeholder="+237678123456"
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
                                ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-300 bg-white'}
                            `}
                        />
                        {errors.phone && (
                            <div className="mt-1 flex items-center gap-2 text-red-600 text-xs">
                                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                {errors.phone}
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Gender
                    </label>
                    <select
                        value={form.gender}
                        onChange={setFormField('gender')}
                        disabled={saving}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
                            ${errors.gender ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-300 bg-white'}
                        `}
                    >
                        <option value="prefer not to say">Prefer not to say</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    {errors.gender && (
                        <div className="mt-1 flex items-center gap-2 text-red-600 text-xs">
                            <AlertCircle className="w-3 h-3 flex-shrink-0" />
                            {errors.gender}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderAcademicStep = () => (
        <div className="space-y-8">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Academic Information</h3>
                <p className="text-gray-600">Choose the program and academic level for this student</p>
            </div>

            <div className="grid gap-8">
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                        <BookOpen className="w-4 h-4 inline mr-1" />
                        Program <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={form.program}
                        onChange={setFormField('program')}
                        disabled={saving}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
                            ${errors.program ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-300 bg-white'}
                        `}
                    >
                        <option value="">Choose a program...</option>
                        {programs.map(p => (
                            <option key={p._id} value={p._id}>
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

                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                        <GraduationCap className="w-4 h-4 inline mr-1" />
                        Academic Level <span className="text-red-500">*</span>
                    </label>

                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
                        {[100, 200, 300, 400, 500, 600].map((level) => (
                            <button
                                key={level}
                                type="button"
                                onClick={() => {
                                    setField('level', level.toString()); // Using your form hook's setField
                                    // Clear error if exists (assuming your error handling works this way)
                                }}
                                className={`
        p-2 rounded-xl border-2 font-medium text-sm transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2
        ${form.level === level.toString()
                                        ? 'border-blue-600 bg-blue-600 text-white shadow-md'
                                        : 'border-gray-200 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50'
                                    }
        ${errors?.level ? 'border-red-500 hover:border-red-500' : ''
                                    }
      `}
                                disabled={saving} // Disable during form submission
                                aria-pressed={form.level === level.toString()}
                            >
                                Level {level}
                                {form.level === level.toString() && (
                                    <span className="sr-only">(selected)</span>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="relative">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="flex-1 border-t border-gray-300"></div>
                            <span className="text-xs text-gray-500 px-2 bg-white">OR</span>
                            <div className="flex-1 border-t border-gray-300"></div>
                        </div>

                        <input
                            type="text"
                            value={form.level || ''}
                            onChange={(e) => {
                                const value = e.target.value;
                                setField('level', value); // Using your form hook's setField
                            }}
                            disabled={saving}
                            placeholder="Enter custom level (e.g., 150, 250, Masters, PhD)"
                            className={`
                                    w-full px-4 py-3 border-2 rounded-xl 
                                    focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-1
                                    transition-all duration-200
                                    ${errors?.level
                                    ? 'border-red-500 bg-red-50 hover:border-red-500'
                                    : 'border-gray-200 hover:border-blue-400 bg-white'
                                }
                                    ${saving ? 'opacity-70 cursor-not-allowed' : ''}
                        `}
                            aria-invalid={errors?.level ? "true" : "false"}
                            aria-describedby={errors?.level ? "level-error" : undefined}
                        />
                        <div className="absolute right-3 top-3 text-gray-400">
                            <Info className="w-4 h-4" />
                        </div>
                    </div>

                    {errors.level && (
                        <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {errors.level}
                        </div>
                    )}

                    <p className="mt-2 text-xs text-gray-500">
                        Select a standard level above or enter a custom level in the field
                    </p>
                </div>

                {form.program && form.level && (
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6">
                        <h4 className="font-semibold text-emerald-900 mb-3 flex items-center gap-2">
                            <GraduationCap className="w-5 h-5" />
                            Academic Summary
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                    <BookOpen className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-emerald-600 font-medium">Program</p>
                                    <p className="font-semibold text-emerald-900">{getProgramName(form.program)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                                    <GraduationCap className="w-6 h-6 text-teal-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-teal-600 font-medium">Level</p>
                                    <p className="font-semibold text-teal-900">
                                        {isNaN(Number(form.level)) ? form.level : `Level ${form.level}`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderGuardianStep = () => (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Guardian Information</h3>
                <p className="text-gray-600">Provide guardian contact details</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                        <Shield className="w-4 h-4 inline mr-1" />
                        Guardian Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={form.guardian}
                        onChange={setFormField('guardian')}
                        disabled={saving}
                        placeholder="Guardian's full name"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
                            ${errors.guardian ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-300 bg-white'}
                        `}
                    />
                    {errors.guardian && (
                        <div className="mt-1 flex items-center gap-2 text-red-600 text-xs">
                            <AlertCircle className="w-3 h-3 flex-shrink-0" />
                            {errors.guardian}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                            <Phone className="w-4 h-4 inline mr-1" />
                            Guardian Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            value={form.guardianPhone}
                            onChange={setFormField('guardianPhone')}
                            disabled={saving}
                            placeholder="+237678123456"
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
                                ${errors.guardianPhone ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-300 bg-white'}
                            `}
                        />
                        {errors.guardianPhone && (
                            <div className="mt-1 flex items-center gap-2 text-red-600 text-xs">
                                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                {errors.guardianPhone}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                            <MapPin className="w-4 h-4 inline mr-1" />
                            Guardian Address
                        </label>
                        <input
                            type="text"
                            value={form.guardianAddress}
                            onChange={setFormField('guardianAddress')}
                            disabled={saving}
                            placeholder="Guardian's address"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-300 bg-white"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderAdditionalStep = () => (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Additional Information</h3>
                <p className="text-gray-600">Add any extra details as needed</p>
            </div>

            <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-medium text-gray-800 mb-4">Add Custom Fields</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <input
                            type="text"
                            placeholder="Field name (e.g., parent_occupation)"
                            value={customFieldKey}
                            onChange={(e) => setCustomFieldKey(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Field value"
                                value={customFieldValue}
                                onChange={(e) => setCustomFieldValue(e.target.value)}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                                type="button"
                                onClick={addCustomField}
                                disabled={!customFieldKey.trim() || !customFieldValue.trim()}
                                className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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

                {Object.entries(form.customFields || {}).length > 0 && (
                    <div className="space-y-3">
                        <h4 className="font-medium text-gray-800">Custom Fields</h4>
                        {Object.entries(form.customFields || {}).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                                <div className="text-sm">
                                    <span className="font-medium text-blue-900">{key}:</span>
                                    <span className="text-blue-700 ml-2">{String(value)}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeCustomField(key)}
                                    className="text-blue-600 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {form.fullName && form.program && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                        <h4 className="font-semibold text-green-900 mb-4 flex items-center gap-2">
                            <UserCheck className="w-5 h-5" />
                            Registration Summary
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-600">Student:</span>
                                <span className="font-medium text-gray-900 ml-2">{form.fullName}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Phone:</span>
                                <span className="font-medium text-gray-900 ml-2">{fmtPhone(form.phone)}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Program:</span>
                                <span className="font-medium text-gray-900 ml-2">{getProgramName(form.program)}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Guardian:</span>
                                <span className="font-medium text-gray-900 ml-2">{form.guardian}</span>
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
            </div>
        </div>
    );

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return renderPersonalInfoStep();
            case 2:
                return renderAcademicStep();
            case 3:
                return renderGuardianStep();
            case 4:
                return renderAdditionalStep();
            default:
                return null;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                <UserPlus className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">{title}</h2>
                                <p className="text-blue-100">
                                    {student ? 'Update student information and enrollment' : 'Register a new student in the system'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white hover:bg-white/20 rounded-xl p-2 transition-all"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(95vh-140px)]">
                    <div className="p-8">
                        <StepIndicator />

                        <form className="space-y-8">
                            {renderStepContent()}

                            {student && !hasFormChanged() && (
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4">
                                    <div className="flex items-center gap-2 text-amber-700">
                                        <Info className="w-4 h-4" />
                                        <span className="text-sm font-medium">No changes detected</span>
                                    </div>
                                    <p className="text-xs text-amber-600 mt-1">
                                        You haven't made any changes to the student information.
                                    </p>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex justify-between items-center pt-8 border-t border-gray-200">
                                {/* Previous Button */}
                                <div>
                                    {currentStep > 1 && (
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            disabled={saving}
                                            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 disabled:opacity-50 transition-all"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            Previous
                                        </button>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    {/* Cancel Button */}
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        disabled={saving}
                                        className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 transition-all"
                                    >
                                        Cancel
                                    </button>

                                    {/* Next / Submit Button */}
                                    {currentStep < 4 ? (
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            disabled={saving}
                                            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl"
                                        >
                                            Next
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => handleFormSubmit(onSubmit, onClose)}
                                            disabled={
                                                saving ||
                                                !form.fullName?.trim() ||
                                                !form.level?.trim() ||
                                                !form.program?.trim() ||
                                                !form.phone?.trim() ||
                                                !form.guardian?.trim() ||
                                                !form.guardianPhone?.trim() ||
                                                !form.guardianAddress?.trim() ||
                                                !hasFormChanged()
                                            }
                                            className={`
                                                inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold 
                                                rounded-xl transition-all duration-200 shadow-lg
                                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 text-white
                                                disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
                                                ${saving || (student && !hasFormChanged())
                                                    ? 'bg-gray-400'
                                                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:shadow-xl hover:-translate-y-0.5'
                                                }
                                        `}
                                            aria-busy={saving ? "true" : "false"}
                                        >
                                            {saving ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    <span>{student ? 'Updating...' : 'Registering...'}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4" />
                                                    <span>
                                                        {student
                                                            ? (hasFormChanged() ? 'Update Student' : 'No Changes Made')
                                                            : 'Register Student'
                                                        }
                                                    </span>
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentFormModal;