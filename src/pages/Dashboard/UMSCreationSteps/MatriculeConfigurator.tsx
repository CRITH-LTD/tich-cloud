import React, { useState, useEffect } from 'react';
import {
    Eye,
    Plus,
    X,
    Copy,
    Check,
    Lightbulb,
    RefreshCw,
    ChevronDown,
    ChevronUp,
    Settings,
    GraduationCap,
    Calendar,
    Hash,
    Info,
    Minimize2,
    Maximize2
} from 'lucide-react';
import { templateSuggestions } from '../../../constants/constants';
import { MatriculeConfig, PlaceholderType } from '../../../interfaces/types';



interface MatriculeConfiguratorProps {
    value: MatriculeConfig;
    onChange: (config: MatriculeConfig) => void;
}

const sampleValues = {
    sequence: '0001',
    year: '24',
};


const templateCategories = [...new Set(templateSuggestions.map(t => t.category))];

// Helper function to generate a preview from the config
export const generatePreview = (config: MatriculeConfig): string => {
    if (!config?.format) return 'No format configured';

    let preview = config.format;

    // Replace dynamic placeholders from the user's config
    if (config.placeholders) {
        for (const [key, value] of Object.entries(config.placeholders)) {
            preview = preview.replace(new RegExp(`{{${key}}}`, 'g'), value);
        }
    }

    // Replace default placeholders for a live preview
    preview = preview.replace(/{{sequence}}/g, String(sampleValues.sequence).padStart(config.sequenceLength || 4, '0'));
    preview = preview.replace(/{{year}}/g, sampleValues.year);

    return preview;
};

export const MatriculeConfigurator: React.FC<MatriculeConfiguratorProps> = ({
    value,
    onChange,
}) => {
    const [localConfig, setLocalConfig] = useState<MatriculeConfig>({
        ...value,
        placeholders: value.placeholders ?? {},
        placeholderTypes: value.placeholderTypes ?? {},
    });
    const [preview, setPreview] = useState<string>(generatePreview(localConfig));
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('Universities');
    const [copiedPreview, setCopiedPreview] = useState(false);
    const [newPlaceholderKey, setNewPlaceholderKey] = useState('');
    const [newPlaceholderType, setNewPlaceholderType] = useState<PlaceholderType | ''>('');
    const [isMinimized, setIsMinimized] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [examples, setExamples] = useState<string[]>([]);

    useEffect(() => {
        setPreview(generatePreview(localConfig));
        onChange(localConfig);
        generateExamples();
    }, [localConfig, onChange]);

    const updateConfig = <K extends keyof MatriculeConfig>(key: K, newValue: MatriculeConfig[K]) => {
        setLocalConfig(prev => ({ ...prev, [key]: newValue }));
    };

    /**
 * Update a placeholder value, and optionally its type.
 * - key: placeholder key (e.g. "faculty")
 * - value: placeholder value
 * - type: optional 'school' | 'faculty' | 'department'
 */
    const updatePlaceholder = (key: string, value: string, type?: PlaceholderType) => {
        setLocalConfig(prev => ({
            ...prev,
            placeholders: {
                ...(prev.placeholders || {}),
                [key]: value,
            },
            placeholderTypes: type
                ? {
                    ...(prev.placeholderTypes || {}),
                    [key]: type,
                }
                : (prev.placeholderTypes || {}),
        }));
    };

    /**
     * Add a new placeholder with an optional type.
     * Uses newPlaceholderKey + newPlaceholderType from state.
     */
    const addPlaceholder = () => {
        const key = newPlaceholderKey.trim();
        if (!key) return;

        setLocalConfig(prev => ({
            ...prev,
            placeholders: {
                ...(prev.placeholders || {}),
                [key]: '',
            },
            placeholderTypes:
                newPlaceholderType
                    ? {
                        ...(prev.placeholderTypes || {}),
                        [key]: newPlaceholderType,
                    }
                    : (prev.placeholderTypes || {}),
        }));

        setNewPlaceholderKey('');
        setNewPlaceholderType('');
    };

    /**
 * Remove a placeholder and its type metadata.
 */
    const removePlaceholder = (key: string) => {
        setLocalConfig(prev => {
            const placeholders = { ...(prev.placeholders || {}) };
            const placeholderTypes = { ...(prev.placeholderTypes || {}) };
            delete placeholders[key];
            delete placeholderTypes[key];
            return { ...prev, placeholders, placeholderTypes };
        });
    };

    const setPlaceholderType = (key: string, type: PlaceholderType) => {
        setLocalConfig(prev => ({
            ...prev,
            placeholderTypes: {
                ...(prev.placeholderTypes || {}),
                [key]: type,
            },
        }));
    };

    const applyTemplate = (template: typeof templateSuggestions[0]) => {
        setLocalConfig({
            format: template.format,
            placeholders: template.placeholders,
            sequenceLength: template.sequenceLength
        });
        setShowSuggestions(false);
    };

    const copyPreview = () => {
        navigator.clipboard.writeText(preview)
            .then(() => {
                setCopiedPreview(true);
                setTimeout(() => setCopiedPreview(false), 2000);
            })
            .catch(console.error);
    };

    const generateExamples = () => {
        const exampleList = [];
        for (let i = 1; i <= 3; i++) {
            const randomSequence = Math.floor(Math.random() * 1000).toString().padStart(localConfig.sequenceLength || 4, '0');
            const currentYear = new Date().getFullYear().toString().slice(-2);

            let example = localConfig.format || '';

            if (localConfig.placeholders) {
                for (const [key, value] of Object.entries(localConfig.placeholders)) {
                    example = example.replace(new RegExp(`{{${key}}}`, 'g'), value || 'VAL');
                }
            }

            example = example.replace(/{{sequence}}/g, randomSequence);
            example = example.replace(/{{year}}/g, currentYear);

            exampleList.push(example);
        }
        setExamples(exampleList);
    };

    const filteredTemplates = templateSuggestions.filter(t => t.category === selectedCategory);
    const placeholderEntries = Object.entries(localConfig.placeholders || {});

    if (isMinimized) {
        return (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        <GraduationCap className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-gray-800">Matricule Configuration</span>
                        <div className="bg-gray-100 text-gray-700 text-sm font-mono px-2 py-1 rounded">
                            {preview || 'Not configured'}
                        </div>
                    </div>
                    <button
                        onClick={() => setIsMinimized(false)}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <Maximize2 className="h-4 w-4" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <GraduationCap className="h-6 w-6" />
                        <div>
                            <h3 className="text-lg font-semibold">Student Matricule Configuration</h3>
                            <p className="text-blue-100 text-sm">Configure ID formats for your institutions</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowSuggestions(!showSuggestions)}
                            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 px-3 py-2 rounded-lg transition-colors"
                        >
                            <Lightbulb className="h-4 w-4" />
                            Templates
                        </button>
                        <button
                            onClick={() => setIsMinimized(true)}
                            className="text-blue-100 hover:text-white transition-colors"
                        >
                            <Minimize2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-h-[600px] overflow-y-auto">
                {/* Template Suggestions */}
                {showSuggestions && (
                    <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold text-gray-800">Trending Institution Templates</h4>
                            <button
                                onClick={() => setShowSuggestions(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Category Tabs */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {templateCategories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        {/* Templates Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-80 overflow-y-auto">
                            {filteredTemplates.map((template, index) => {
                                const IconComponent = template.icon;
                                return (
                                    <button
                                        key={index}
                                        onClick={() => applyTemplate(template)}
                                        className="text-left p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all group"
                                    >
                                        <div className="flex items-start gap-3">
                                            <IconComponent className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <div className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                                                    {template.name}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {template.description}
                                                </div>
                                                <div className="text-xs text-blue-600 font-mono mt-2 bg-blue-50 px-2 py-1 rounded">
                                                    {generatePreview(template)}
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="p-6 space-y-6">
                    {/* Live Preview Section */}
                    <div className="bg-gray-900 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <Eye className="h-4 w-4 text-gray-400" />
                                <label className="text-sm font-medium text-gray-300">Live Preview</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={generateExamples}
                                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-200 transition-colors"
                                >
                                    <RefreshCw className="h-3 w-3" />
                                    Generate Examples
                                </button>
                                <button
                                    onClick={copyPreview}
                                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-200 transition-colors"
                                >
                                    {copiedPreview ? (
                                        <>
                                            <Check className="h-3 w-3 text-green-400" />
                                            Copied
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="h-3 w-3" />
                                            Copy
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="bg-black rounded border-2 border-gray-700 p-4">
                            <div className="text-green-400 text-xl font-mono mb-2">
                                {preview || 'Configure format below...'}
                            </div>
                            {examples.length > 0 && (
                                <div className="space-y-1">
                                    <div className="text-gray-500 text-xs">Examples:</div>
                                    {examples.map((example, i) => (
                                        <div key={i} className="text-yellow-400 text-sm font-mono">
                                            {example}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Format String Input */}
                    <div>
                        <label htmlFor="format" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                            <Hash className="h-4 w-4" />
                            ID Format Pattern
                        </label>
                        <input
                            id="format"
                            type="text"
                            value={localConfig.format || ''}
                            onChange={(e) => updateConfig('format', e.target.value)}
                            placeholder="e.g., UY1/{{faculty}}/{{year}}/{{sequence}}"
                            className="w-full bg-white border-2 border-gray-300 focus:border-blue-500 focus:ring-0 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 outline-none transition-colors"
                        />
                        <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-start gap-2">
                                <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div className="text-xs text-blue-700">
                                    <div className="font-medium mb-1">Built-in placeholders:</div>
                                    <div><code className="bg-blue-100 px-1 rounded">{'{{sequence}}'}</code> - Auto-incrementing number</div>
                                    <div><code className="bg-blue-100 px-1 rounded">{'{{year}}'}</code> - Current year (2-digit)</div>
                                    <div className="mt-1">Create custom placeholders below for department, faculty, etc.</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Custom Placeholders Section */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <Settings className="h-4 w-4" />
                                Custom Placeholders
                            </label>
                            <button
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
                            >
                                {showAdvanced ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                                {showAdvanced ? 'Less' : 'More'} Options
                            </button>
                        </div>

                        {/* Add New Placeholder */}
                        <div className="mb-4 p-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={newPlaceholderKey}
                                        onChange={(e) => setNewPlaceholderKey(e.target.value)}
                                        placeholder="Enter placeholder name (e.g., 'faculty', 'department')"
                                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                                        onKeyPress={(e) => e.key === 'Enter' && addPlaceholder()}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={addPlaceholder}
                                    disabled={!newPlaceholderKey.trim()}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg px-4 py-2 flex items-center gap-2 text-sm transition-colors"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Placeholder
                                </button>
                                {/* Add a select, to allow the user to link placeholder to [school, or faculty or department] */}
                                <select
                                    value={newPlaceholderType}
                                    onChange={(e) => setNewPlaceholderType(e.target.value as PlaceholderType)}
                                    disabled={!newPlaceholderKey.trim()}
                                    className="ml-2 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                                >
                                    <option value="">Select type</option>
                                    <option value="school">School</option>
                                    <option value="faculty">Faculty</option>
                                    <option value="department">Department</option>
                                </select>
                            </div>
                        </div>

                        {/* Existing Placeholders */}
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                            {placeholderEntries.map(([key, value]) => {
                                const type = localConfig.placeholderTypes?.[key] ?? '';
                                return (
                                    <div
                                        key={key}
                                        className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3">
                                                {/* key chip */}
                                                <span
                                                    className="shrink-0 text-sm font-mono text-blue-700 bg-blue-100 px-3 py-1 rounded-full"
                                                    title="Placeholder key"
                                                >
                                                    {'{{' + key + '}}'}
                                                </span>

                                                <span className="text-gray-400 font-medium">=</span>

                                                {/* value input */}
                                                <input
                                                    type="text"
                                                    value={value}
                                                    onChange={(e) => updatePlaceholder(key, e.target.value)}
                                                    placeholder="Enter value"
                                                    className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                                                />
                                            </div>

                                            {/* type selector */}
                                            <div className="mt-3 flex items-center gap-2">
                                                <label className="text-xs text-gray-500">Type:</label>
                                                <select
                                                    value={type}
                                                    onChange={(e) => setPlaceholderType(key, e.target.value as 'school' | 'faculty' | 'department')}
                                                    className="bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-sm outline-none focus:border-blue-500"
                                                    aria-label={`Type for ${key}`}
                                                >
                                                    <option value="">Unspecified</option>
                                                    <option value="school">School</option>
                                                    <option value="faculty">Faculty</option>
                                                    <option value="department">Department</option>
                                                </select>

                                                {/* optional type pill for quick glance */}
                                                {type ? (
                                                    <span
                                                        className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700"
                                                        title="Linked category"
                                                    >
                                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-gray-400">No category</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* remove */}
                                        <button
                                            type="button"
                                            onClick={() => removePlaceholder(key)}
                                            className="self-start text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-2 transition-colors"
                                            title="Remove placeholder"
                                            aria-label={`Remove ${key}`}
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                );
                            })}

                            {placeholderEntries.length === 0 && (
                                <div className="text-center text-gray-500 text-sm py-8 bg-gray-50 rounded-lg">
                                    <Settings className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                    <div>No custom placeholders yet.</div>
                                    <div className="text-xs mt-1">Add one above to customize your matricule format.</div>
                                </div>
                            )}
                        </div>


                        {/* Advanced Options */}
                        {showAdvanced && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2 mb-3">
                                    <Calendar className="h-4 w-4 text-gray-600" />
                                    <label htmlFor="sequenceLength" className="text-sm font-medium text-gray-700">
                                        Sequential Number Length
                                    </label>
                                </div>
                                <div className="flex items-center gap-4">
                                    <input
                                        id="sequenceLength"
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={localConfig.sequenceLength || 4}
                                        onChange={(e) => updateConfig('sequenceLength', Number(e.target.value))}
                                        className="bg-white border border-gray-300 focus:border-blue-500 rounded-lg px-3 py-2 w-20 text-gray-900 outline-none transition-colors"
                                    />
                                    <div className="text-sm text-gray-600">
                                        digits (e.g., {String(1).padStart(localConfig.sequenceLength || 4, '0')}, {String(42).padStart(localConfig.sequenceLength || 4, '0')}, {String(999).padStart(localConfig.sequenceLength || 4, '0')})
                                    </div>
                                </div>
                                <p className="mt-2 text-xs text-gray-500">
                                    Controls padding with leading zeros for sequence numbers.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};