import {
    GraduationCap,
    Building2,
    AlertCircle,
    BookOpen,
    Clock,
    FileText,
    Check,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { Tab, Combobox, TabPanel, TabPanels, TabList, TabGroup } from '@headlessui/react';
import { BASE_PROGRAM_TYPES } from '../../../../../constants/constants';
import { CreateProgramDto, Program } from '../../../../../interfaces/types';

export interface Department {
    _id: string;
    name: string;
}


const toKey = (label: string) =>
    label.trim()
        .replace(/\s+/g, '')
        .replace(/[^a-zA-Z0-9]/g, '')
        .replace(/^\d+/, '') || 'Custom';

const isDuplicateType = (types: { key: string; label: string }[], label: string) =>
    types.some(t => t.label.toLowerCase() === label.trim().toLowerCase());

const ProgramFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (dto: CreateProgramDto) => Promise<void>;
    departments: Department[];
    program?: Program | null;
    title?: string;
}> = ({ isOpen, onClose, onSubmit, departments, program, title = 'Add Program' }) => {
    const [programTypes, setProgramTypes] = useState(BASE_PROGRAM_TYPES);
    const [customTypeLabel, setCustomTypeLabel] = useState('');
    const [customTypeError, setCustomTypeError] = useState<string | null>(null);

    const [form, setForm] = useState<CreateProgramDto>({
        name: '',
        description: '',
        duration: 1,
        departmentId: '',
        programType: BASE_PROGRAM_TYPES[0].key,
    });
    const [errors, setErrors] = useState<Partial<Record<keyof CreateProgramDto, string>>>({});
    const [saving, setSaving] = useState(false);

    // 🔧 Tabs selected index (separate from form.programType)
    // Last tab is the "Custom" tab: index === programTypes.length
    const customTabIndex = programTypes.length;
    const findTypeIndex = (key?: string) => {
        if (!key) return 0;
        const idx = programTypes.findIndex(t => t.key === key);
        return idx >= 0 ? idx : 0;
    };
    const [tabIndex, setTabIndex] = useState(0);

    // Department combobox query state
    const [deptQuery, setDeptQuery] = useState('');
    const filteredDepartments = useMemo(() => {
        const q = deptQuery.trim().toLowerCase();
        if (!q) return departments;
        return departments.filter(d => d.name.toLowerCase().includes(q));
    }, [deptQuery, departments]);

    // Single clean initializer
    useEffect(() => {
        if (!isOpen) return;

        const initialType =
            program?.programType &&
            (programTypes.find(t => t.key === program.programType)
                ? program.programType
                : BASE_PROGRAM_TYPES[0].key);

        if (program) {
            setForm({
                name: program.name ?? '',
                description: program.description ?? '',
                duration: Number(program.duration ?? 1),
                departmentId: program.departmentId ?? '',
                programType: initialType ?? BASE_PROGRAM_TYPES[0].key,
            });
            // sync tab index with existing program type
            setTabIndex(findTypeIndex(initialType ?? BASE_PROGRAM_TYPES[0].key));
        } else {
            setForm({
                name: '',
                description: '',
                duration: 1,
                departmentId: '',
                programType: BASE_PROGRAM_TYPES[0].key,
            });
            setTabIndex(0);
        }

        setDeptQuery('');
        setErrors({});
        setCustomTypeLabel('');
        setCustomTypeError(null);
    }, [isOpen, program, programTypes]);

    const setField =
        (k: keyof CreateProgramDto) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string) => {
                const v = typeof e === 'string' ? e : e.target.value;
                setForm(prev => ({
                    ...prev,
                    [k]: k === 'duration' ? Number(v) || 0 : v,
                }));
                if (errors[k]) setErrors(prev => ({ ...prev, [k]: undefined }));
            };

    const validate = (): boolean => {
        const e: Partial<Record<keyof CreateProgramDto, string>> = {};
        if (!form.name.trim()) e.name = 'Program name is required';
        else if (form.name.trim().length < 3) e.name = 'Minimum 3 characters';
        else if (form.name.trim().length > 100) e.name = 'Maximum 100 characters';

        if (!form.departmentId) e.departmentId = 'Please select a department';
        if (!form.programType) e.programType = 'Please select a program type';

        if (!form.duration || form.duration < 1) e.duration = 'At least 1 year';
        else if (form.duration > 10) e.duration = 'Cannot exceed 10 years';

        if (form.description && form.description.length > 800) {
            e.description = 'Description must not exceed 800 characters';
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (ev: React.FormEvent) => {
        ev.preventDefault();
        if (!validate()) return;

        setSaving(true);
        try {
            const dto: CreateProgramDto = {
                name: form.name.trim(),
                description: form.description?.trim() || undefined,
                duration: form.duration,
                departmentId: form.departmentId,
                programType: form.programType,
            };
            await onSubmit(dto);
            onClose();
        } finally {
            setSaving(false);
        }
    };

    const getDepartmentName = (id: string) =>
        departments.find(d => d._id === id)?.name || '';

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                                <p className="text-sm text-gray-500">
                                    {program ? 'Update program details' : 'Create a new academic program'}
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
                    {/* Program Type (Tabs + Custom) */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                            Program Type <span className="text-red-500">*</span>
                        </label>

                        <TabGroup
                            selectedIndex={tabIndex}
                            onChange={(newIdx) => {
                                setTabIndex(newIdx);
                                if (newIdx < programTypes.length) {
                                    // selecting a predefined type
                                    setForm(prev => ({ ...prev, programType: programTypes[newIdx].key }));
                                }
                                // if custom tab, don't change programType yet; show panel
                            }}
                        >
                            <TabList className="flex flex-wrap gap-2 bg-white/70 border border-gray-200 rounded-xl p-2">
                                {programTypes.map((t) => (
                                    <Tab
                                        key={t.key}
                                        className={({ selected }) =>
                                            [
                                                'px-3 py-2 rounded-lg text-sm font-medium outline-none transition',
                                                selected
                                                    ? 'bg-indigo-600 text-white shadow-sm'
                                                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-gray-200',
                                            ].join(' ')
                                        }
                                    >
                                        {t.label}
                                    </Tab>
                                ))}
                                {/* Custom tab (index === customTabIndex) */}
                                <Tab
                                    className={({ selected }) =>
                                        [
                                            'px-3 py-2 rounded-lg text-sm font-medium outline-none transition',
                                            'border border-dashed',
                                            selected
                                                ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                                                : 'bg-white text-slate-600 hover:bg-slate-50 border-gray-300',
                                        ].join(' ')
                                    }
                                >
                                    + Custom
                                </Tab>
                            </TabList>

                            <TabPanels className="mt-3">
                                {/* Empty panels for predefined types (selection handled above) */}
                                {programTypes.map((t) => (
                                    <TabPanel key={t.key}>
                                        <div className="sr-only">{t.label}</div>
                                    </TabPanel>
                                ))}

                                {/* Custom type creation panel */}
                                <TabPanel>
                                    <div className="rounded-xl border border-gray-200 p-4 bg-white">
                                        <div className="flex items-end gap-3">
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    New Program Type
                                                </label>
                                                <input
                                                    type="text"
                                                    value={customTypeLabel}
                                                    onChange={(e) => {
                                                        setCustomTypeLabel(e.target.value);
                                                        setCustomTypeError(null);
                                                    }}
                                                    placeholder="e.g., Professional Master, Executive Program"
                                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition
                            ${customTypeError ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-indigo-300'}
                          `}
                                                    maxLength={40}
                                                />
                                                <div className="mt-1 text-xs flex justify-between">
                                                    <span className={customTypeError ? 'text-red-600' : 'text-gray-500'}>
                                                        {customTypeError ?? 'Add a custom label (max 40 chars)'}
                                                    </span>
                                                    <span className="text-gray-400">{customTypeLabel.length}/40</span>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                                                onClick={() => {
                                                    const label = customTypeLabel.trim();
                                                    if (!label) return setCustomTypeError('Type name is required');
                                                    if (isDuplicateType(programTypes, label)) {
                                                        return setCustomTypeError('This type already exists');
                                                    }
                                                    const key = toKey(label);
                                                    const next = [...programTypes, { key, label }];
                                                    setProgramTypes(next);
                                                    setForm(prev => ({ ...prev, programType: key }));
                                                    setCustomTypeLabel('');
                                                    setCustomTypeError(null);
                                                    // move selection to the newly added tab (second last index, since custom tab stays last)
                                                    setTabIndex(next.findIndex(t => t.key === key));
                                                }}
                                            >
                                                Add Type
                                            </button>
                                        </div>
                                    </div>
                                </TabPanel>
                            </TabPanels>
                        </TabGroup>

                        {errors.programType && (
                            <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                                <AlertCircle className="w-4 h-4" />
                                {errors.programType}
                            </div>
                        )}
                    </div>

                    {/* Department (Combobox) */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                            <Building2 className="w-4 h-4 inline mr-1" />
                            Department <span className="text-red-500">*</span>
                        </label>

                        <Combobox
                            value={form.departmentId || null}
                            onChange={(val: string | null) => setField('departmentId')(val ?? '')}
                        >
                            <div className="relative">
                                <Combobox.Input
                                    className={`w-full px-4 py-3 border rounded-xl pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition
                    ${errors.departmentId ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-indigo-300 bg-white'}
                  `}
                                    placeholder="Search departments..."
                                    displayValue={(id: string | null) => (id ? getDepartmentName(id) : '')}
                                    onChange={(e) => setDeptQuery(e.target.value)}
                                />
                                <Combobox.Button className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-500">
                                    ▼
                                </Combobox.Button>
                            </div>

                            <Combobox.Options className="absolute z-50 mt-1 max-h-60 w-[calc(100%-3rem)] overflow-auto rounded-xl bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none">
                                {filteredDepartments.length === 0 ? (
                                    <div className="cursor-default select-none py-2 px-4 text-slate-500">
                                        No results found
                                    </div>
                                ) : (
                                    filteredDepartments.map((d) => (
                                        <Combobox.Option
                                            key={d._id}
                                            value={d._id}
                                            className={({ active }) =>
                                                `relative cursor-pointer select-none py-2 pl-10 pr-3 ${active ? 'bg-indigo-600 text-white' : 'text-slate-700'
                                                }`
                                            }
                                        >
                                            {({ selected, active }) => (
                                                <>
                                                    <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                                                        {d.name}
                                                    </span>
                                                    {selected && (
                                                        <span
                                                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-indigo-600'
                                                                }`}
                                                        >
                                                            <Check className="h-4 w-4" />
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </Combobox.Option>
                                    ))
                                )}
                            </Combobox.Options>
                        </Combobox>

                        {errors.departmentId && (
                            <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                {errors.departmentId}
                            </div>
                        )}
                    </div>

                    {/* Program Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                            <BookOpen className="w-4 h-4 inline mr-1" />
                            Program Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={setField('name')}
                            disabled={saving}
                            placeholder="e.g., Bachelor of Science in Computer Science"
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition
                ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-indigo-300 bg-white'}
              `}
                        />
                        <div className="mt-1 flex justify-between text-xs">
                            <span className={errors.name ? 'text-red-600' : 'text-gray-500'}>
                                {errors.name || 'Enter the official program name'}
                            </span>
                            <span className="text-gray-400">{form.name.length}/100</span>
                        </div>
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                            <Clock className="w-4 h-4 inline mr-1" />
                            Duration <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                min={1}
                                max={10}
                                value={form.duration}
                                onChange={setField('duration')}
                                disabled={saving}
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition pr-16
                  ${errors.duration ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-indigo-300 bg-white'}
                `}
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                                {form.duration === 1 ? 'year' : 'years'}
                            </span>
                        </div>
                        {errors.duration && (
                            <div className="mt-1 flex items-center gap-2 text-red-600 text-xs">
                                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                {errors.duration}
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                            <FileText className="w-4 h-4 inline mr-1" />
                            Program Description
                        </label>
                        <textarea
                            rows={5}
                            value={form.description ?? ''}
                            onChange={setField('description')}
                            disabled={saving}
                            placeholder="Describe the program objectives, curriculum highlights, and outcomes..."
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition
                ${errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-indigo-300 bg-white'}
              `}
                        />
                        <div className="mt-2 flex justify-between text-xs">
                            <span className={errors.description ? 'text-red-600' : 'text-gray-500'}>
                                {errors.description || 'Optional: add goals and curriculum overview'}
                            </span>
                            <span className={`${(form.description?.length ?? 0) > 700 ? 'text-amber-600' : 'text-gray-400'}`}>
                                {(form.description?.length ?? 0)}/800
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
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
                            disabled={saving || !form.name.trim() || !form.departmentId || !form.programType}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {saving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>{program ? 'Updating...' : 'Creating...'}</span>
                                </>
                            ) : (
                                <>
                                    <GraduationCap className="w-4 h-4" />
                                    <span>{program ? 'Update Program' : 'Create Program'}</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProgramFormModal;
