import { School, X, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { CreateDepartmentDto, Department } from '../../../../../types/department.types';
import { generateCode } from '../../../../../utils';

interface DepartmentFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (department: CreateDepartmentDto) => Promise<void>;
    department?: Department | null;
    title?: string;
}

const DepartmentFormModal: React.FC<DepartmentFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    department,
    title = 'Add Department',
}) => {
    const [formData, setFormData] = useState({ name: '', description: '', code: '' });
    const [errors, setErrors] = useState<Partial<typeof formData>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [autoMode, setAutoMode] = useState<'2' | '3' | '4' | 'manual'>('2');

    useEffect(() => {
        if (!isOpen) return;

        const initial = {
            name: department?.name ?? '',
            description: department?.description ?? '',
            code: department?.code ?? '',
        };
        setFormData(initial);
        setErrors({});

        if (department?.code) {
            const match = [2, 3, 4].find(len => generateCode(initial.name, len) === department.code);
            setAutoMode(match ? (match.toString() as any) : 'manual');
        } else {
            setAutoMode('2');
        }
    }, [isOpen, department]);

    useEffect(() => {
        if (autoMode === 'manual') return;
        const len = parseInt(autoMode, 10);
        const newCode = generateCode(formData.name, len);
        if (newCode !== formData.code) {
            setFormData(prev => ({ ...prev, code: newCode }));
        }
    }, [formData.name, autoMode]);

    const validateForm = (): boolean => {
        const newErr: Partial<typeof formData> = {};

        if (!formData.name.trim()) newErr.name = 'Department name is required';
        else if (formData.name.length < 2) newErr.name = 'Minimum 2 characters';
        else if (formData.name.length > 100) newErr.name = 'Maximum 100 characters';

        if (!formData.code.trim()) newErr.code = 'Code is required';
        else if (formData.code.length < 2) newErr.code = 'Min 2 chars';
        else if (formData.code.length > 4) newErr.code = 'Max 4 chars';
        else if (!/^[A-Z]+$/.test(formData.code)) newErr.code = 'Uppercase letters only';

        if (formData.description?.length > 500)
            newErr.description = 'Description must not exceed 500 characters';

        setErrors(newErr);
        return Object.keys(newErr).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            await onSubmit({
                name: formData.name.trim(),
                code: formData.code.trim(),
                description: formData.description?.trim(),
            });
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg mx-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <School className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                            <p className="text-sm text-gray-500">
                                {department ? 'Edit department details' : 'Create a new department'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X />
                    </button>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Department Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-4 py-2 border rounded-lg"
                            disabled={isSubmitting}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-600 mt-1 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                <span>{errors.name}</span>
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Code <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2">
                            <select
                                value={autoMode}
                                onChange={(e) => setAutoMode(e.target.value as '2' | '3' | '4' | 'manual')}
                                className="w-1/3 px-3 py-2 border rounded-lg"
                                disabled={isSubmitting}
                            >
                                <option value="2">Auto (2)</option>
                                <option value="3">Auto (3)</option>
                                <option value="4">Auto (4)</option>
                                <option value="manual">Manual</option>
                            </select>
                            <input
                                type="text"
                                value={formData.code}
                                onChange={(e) => {
                                    if (autoMode === 'manual') {
                                        setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase().slice(0, 4) }));
                                    }
                                }}
                                readOnly={autoMode !== 'manual'}
                                className={`w-2/3 px-3 py-2 border rounded-lg ${autoMode !== 'manual' ? 'bg-gray-50 text-gray-500' : ''}`}
                                disabled={isSubmitting}
                            />
                        </div>
                        {errors.code && (
                            <p className="text-sm text-red-600 mt-1 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                <span>{errors.code}</span>
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            rows={3}
                            className="w-full px-4 py-2 border rounded-lg resize-none"
                            disabled={isSubmitting}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-600 mt-1 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                <span>{errors.description}</span>
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            disabled={isSubmitting || !formData.name || !formData.code}
                        >
                            {isSubmitting ? 'Saving...' : department ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DepartmentFormModal;
