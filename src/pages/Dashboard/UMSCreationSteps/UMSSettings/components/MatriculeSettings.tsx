import React, { useEffect, useMemo } from 'react';
import {
    Settings,
    Eye,
    CheckCircle,
    Hash,
    Info,
    Building2
} from 'lucide-react';
import { generatePreview, MatriculeConfigurator } from '../../MatriculeConfigurator';
import { UMSForm } from '../../../../../interfaces/types';
import { useMatricule } from '../../../../../hooks/useMatricule';
import ShimmerLoader from '../../../../../components/Common/ShimmerLoader ';

interface MatriculeSettingsProps {
    formData: UMSForm;
    onInputChange: <K extends keyof UMSForm>(field: K, value: UMSForm[K]) => void;
}

const MatriculeSettings: React.FC<MatriculeSettingsProps> = ({
    formData,
    onInputChange
}) => {
    const { handleConfigChange, matriculeConfig, introLoading } = useMatricule({ onInputChange });

    const currentPreview = useMemo(
        () =>
            generatePreview(
                matriculeConfig || { format: '', placeholders: {}, sequenceLength: 4 }
            ),
        [matriculeConfig] // BUG FIX: use the actual config, not formData
    );

    // console.log('MatriculeConfig:', matriculeConfig);

    // When loading, show skeleton
    if (introLoading) {
        return (
            <div className="space-y-6">
                {/* Header Skeleton */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <ShimmerLoader width={32} height={32} borderRadius={8} />
                        <div>
                            <ShimmerLoader width={160} height={16} borderRadius={4} className="mb-2" />
                            <ShimmerLoader width={220} height={12} borderRadius={4} />
                        </div>
                    </div>
                    <ShimmerLoader width="100%" height={80} borderRadius={6} />
                </div>

                {/* Configurator placeholder */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <ShimmerLoader width="100%" height={200} borderRadius={6} />
                </div>

                {/* Preview skeleton */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <ShimmerLoader width={180} height={16} borderRadius={4} className="mb-4" />
                    <ShimmerLoader width="100%" height={120} borderRadius={6} />
                </div>

                {/* Institution overview skeleton */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <ShimmerLoader width={200} height={16} borderRadius={4} className="mb-4" />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="p-4 rounded-lg bg-gray-50">
                                <ShimmerLoader width={80} height={20} borderRadius={4} className="mb-2" />
                                <ShimmerLoader width={100} height={14} borderRadius={4} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Actual UI when loaded
    return (
        <div className="space-y-6">
            {/* Header Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Settings className="h-4 w-4 text-blue-700" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Matricule Configuration</h3>
                            <p className="text-sm text-gray-500">
                                Configure student ID number formats and generation rules
                            </p>
                        </div>
                    </div>
                </div>

                {/* Current Configuration Preview */}
                {matriculeConfig?.format && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-700">
                                Current Configuration
                            </span>
                        </div>
                        <div className="text-sm text-green-700">
                            Format generates IDs like:{' '}
                            <code className="bg-green-100 px-2 py-1 rounded text-green-800 font-mono">
                                {currentPreview}
                            </code>
                        </div>
                    </div>
                )}
            </div>

            {/* Configuration Interface */}
            <MatriculeConfigurator
                value={
                    matriculeConfig ||
                    formData.matriculeConfig || { format: '', placeholders: {}, sequenceLength: 4 }
                }
                onChange={handleConfigChange}
            />

            {/* Preview and Impact Analysis */}
            {matriculeConfig?.format && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Configuration Impact
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Current Preview */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                    Generated Format
                                </label>
                                <div className="bg-gray-900 rounded-lg p-4">
                                    <div className="text-green-400 font-mono text-lg">
                                        {currentPreview}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                    Configuration Details
                                </label>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Hash className="h-3 w-3" />
                                        <span>
                                            Sequence length: {matriculeConfig.sequenceLength || 4} digits
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Settings className="h-3 w-3" />
                                        <span>
                                            Custom placeholders:{' '}
                                            {Object.keys(matriculeConfig.placeholders || {}).length}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Usage Information */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                    Usage Guidelines
                                </label>
                                <div className="bg-blue-50 rounded-lg p-4 space-y-2 text-sm text-blue-700">
                                    <div className="flex items-start gap-2">
                                        <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <div className="font-medium">
                                                New students will receive IDs in this format
                                            </div>
                                            <div className="text-blue-600 mt-1">
                                                Existing student IDs will not be affected
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                    Best Practices
                                </label>
                                <div className="space-y-2 text-xs text-gray-600">
                                    <div className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                                        <span>Keep formats consistent across academic years</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                                        <span>Use meaningful abbreviations for departments/faculties</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                                        <span>Ensure sufficient sequence length for expected enrollments</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Institution Overview */}
            {formData.umsName && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Institution Overview
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                            <div className="text-lg font-bold text-blue-700">{formData.umsName}</div>
                            <div className="text-sm text-blue-600">Institution Name</div>
                        </div>
                        <div className="bg-indigo-50 rounded-lg p-4">
                            <div className="text-lg font-bold text-indigo-700">
                                {formData.matriculeConfig?.format ? 'Configured' : 'Not Set'}
                            </div>
                            <div className="text-sm text-indigo-600">Matricule Status</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                            <div className="text-lg font-bold text-green-700">
                                {Object.keys(formData.matriculeConfig?.placeholders || {}).length}
                            </div>
                            <div className="text-sm text-green-600">Custom Fields</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MatriculeSettings;
