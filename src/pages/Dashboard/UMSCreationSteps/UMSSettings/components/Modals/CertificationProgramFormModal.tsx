import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { CreateCertificationProgramDto, CertificationProgram, Faculty, School } from '../../../../../../types/academicUnits.types';
import { generateCode } from '../../../../../../utils';

interface CertificationProgramFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateCertificationProgramDto) => Promise<void>;
    certProgram: CertificationProgram | null;
    title: string;
    faculties: Faculty[];
    schools: School[];
}


const CertificationProgramFormModal: React.FC<CertificationProgramFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    certProgram,
    title,
}) => {
    const [formData, setFormData] = useState<CreateCertificationProgramDto>({
        name: '',
        description: '',
        code: '',
    });
    const [loading, setLoading] = useState(false);


    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (autoMode !== 'manual') return;
        const value = e.target.value.toUpperCase().slice(0, 4);
        setFormData((prev) => ({ ...prev, code: value }));

        // if (errors.code) {
        //     setErrors((prev) => ({ ...prev, code: undefined }));
        // }
    };

    const [autoMode, setAutoMode] = useState<'2' | '3' | '4' | 'manual'>('2');

    useEffect(() => {
        if (autoMode !== 'manual') {
            const len = parseInt(autoMode, 10);
            // If you can pass existing codes from your list, do it here:
            // const existing = departments.map(d => d.code).filter(Boolean) as string[];
            const newCode = generateCode(formData.name, len /*, existing*/);
            if (newCode !== formData.code) {
                setFormData(prev => ({ ...prev, code: newCode }));
            }
        }
    }, [formData.name, autoMode, formData.code]);
    useEffect(() => {
        if (certProgram) {
            setFormData({
                name: certProgram.name,
                description: certProgram.description || '',
                code: certProgram.code,
            });
            if (certProgram && certProgram.code) {
                const upperCode = certProgram.code.toUpperCase();
                let matched = false;
                for (let len = 2; len <= 4; len++) {
                    const gen = generateCode(certProgram.name, len);
                    if (gen === upperCode) {
                        setAutoMode(len.toString() as '2' | '3' | '4');
                        matched = true;
                        break;
                    }
                }
                if (!matched) {
                    setAutoMode('manual');
                }
            } else {
                setAutoMode('2');
                setFormData((prev) => ({ ...prev, code: generateCode(certProgram.name, 2) }));
            }
        } else {
            setFormData({
                name: '',
                description: '',
                code: '',
            });
        }
    }, [certProgram, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.code.trim()) return;

        setLoading(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            // Error handled in parent component
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
                </div>

                <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Certification Program Name *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter program name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                value={formData.description || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                rows={3}
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter program description"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Certification Program Code <span className="text-red-500">*</span>
                            </label>
                            <div className="flex space-x-3">
                                <select
                                    value={autoMode}
                                    onChange={(e) => setAutoMode(e.target.value as typeof autoMode)}
                                    className={`w-36 px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${loading ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                    disabled={loading}
                                >
                                    <option value="2">Auto (2 chars)</option>
                                    <option value="3">Auto (3 chars)</option>
                                    <option value="4">Auto (4 chars)</option>
                                    <option value="manual">Manual override</option>
                                </select>
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={handleCodeChange}
                                    maxLength={4}
                                    className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${autoMode !== 'manual' ? 'bg-gray-50 cursor-not-allowed text-gray-600' : ''
                                        } 'border-gray-300 hover:border-gray-400'}`}
                                    placeholder="e.g., FHS"
                                    disabled={loading}
                                    readOnly={autoMode !== 'manual'}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !formData.name.trim() || !formData.code.trim()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : (certProgram ? 'Update' : 'Create')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CertificationProgramFormModal;