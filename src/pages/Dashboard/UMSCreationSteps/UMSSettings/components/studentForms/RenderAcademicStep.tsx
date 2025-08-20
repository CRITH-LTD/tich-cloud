import { Combobox, Tab } from "@headlessui/react";
import { BookOpen, ChevronsUpDown, Check, AlertCircle, GraduationCap, Info } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { CreateStudentDto, Program } from "../../../../../../interfaces/types";

const LEVELS = [100, 200, 300, 400, 500, 600];

const useAcademicUX = (formLevel?: string) => {
    // Level tabs index (last index == Custom)
    const customLevelIndex = LEVELS.length;
    const computeIndexFromLevel = (lvl?: string) => {
        if (!lvl) return 0;
        const asNum = Number(lvl);
        const idx = LEVELS.indexOf(asNum);
        return idx >= 0 ? idx : customLevelIndex;
    };

    const [levelTabIndex, setLevelTabIndex] = useState<number>(computeIndexFromLevel(formLevel));

    // keep tab index synced if form.level changes outside (e.g., validation or external edits)
    useEffect(() => {
        setLevelTabIndex(computeIndexFromLevel(formLevel));
    }, [formLevel]);

    return { levelTabIndex, setLevelTabIndex, customLevelIndex };
};

const RenderAcademicStep: React.FC<{
    form: CreateStudentDto;
    setField: (field: keyof CreateStudentDto, value: any) => void
    getProgramName: (id: string) => string;
    errors: Record<string, string>;
    saving: boolean;
    programs: Program[];
}> = ({ form, setField, getProgramName, errors, saving, programs }) => {
    const [programQuery, setProgramQuery] = useState('');
    const filteredPrograms = useMemo(() => {
        const q = programQuery.trim().toLowerCase();
        if (!q) return programs;
        return programs.filter(p => p.name.toLowerCase().includes(q));
    }, [programQuery, programs]);

    const { levelTabIndex, setLevelTabIndex, customLevelIndex } = useAcademicUX(form.level);

    return (
        <div className="space-y-8">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Academic Information</h3>
                <p className="text-gray-600">Choose the program and academic level for this student</p>
            </div>

            <div className="grid gap-8">
                {/* Program (Combobox) */}
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                        <BookOpen className="w-4 h-4 inline mr-1" />
                        Program <span className="text-red-500">*</span>
                    </label>

                    <Combobox
                        value={form.program || null}
                        onChange={(val: string | null) => setField('program', val ?? '')}
                    >
                        <div className="relative">
                            <Combobox.Input
                                className={`w-full px-4 py-3 border rounded-xl pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition
                  ${errors.program ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-300 bg-white'}
                `}
                                placeholder="Search programs…"
                                displayValue={(id: string | null) =>
                                    id ? (programs.find(p => p._id === id)?.name ?? '') : ''
                                }
                                onChange={(e) => setProgramQuery(e.target.value)}
                                disabled={saving}
                            />
                            <Combobox.Button className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-500">
                                <ChevronsUpDown className="h-5 w-5" />
                            </Combobox.Button>
                        </div>

                        <Combobox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none">
                            {filteredPrograms.length === 0 ? (
                                <div className="cursor-default select-none py-2 px-4 text-slate-500">
                                    No results found
                                </div>
                            ) : (
                                filteredPrograms.map((p) => (
                                    <Combobox.Option
                                        key={p._id}
                                        value={p._id}
                                        className={({ active }) =>
                                            `relative cursor-pointer select-none py-2 pl-10 pr-3 ${active ? 'bg-blue-600 text-white' : 'text-slate-700'
                                            }`
                                        }
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                                                    {p.name}
                                                </span>
                                                {selected && (
                                                    <span
                                                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-blue-600'
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

                    {errors.program && (
                        <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {errors.program}
                        </div>
                    )}
                </div>

                {/* Academic Level (Tabs + Custom) */}
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                        <GraduationCap className="w-4 h-4 inline mr-1" />
                        Academic Level <span className="text-red-500">*</span>
                    </label>

                    <Tab.Group
                        selectedIndex={levelTabIndex}
                        onChange={(newIdx) => {
                            setLevelTabIndex(newIdx);
                            if (newIdx < customLevelIndex) {
                                // preset chosen - set the corresponding level
                                setField('level', String(LEVELS[newIdx]));
                            }
                            // For custom tab (newIdx === customLevelIndex), don't change the level value
                            // Let the user type in the custom input field
                        }}
                    >
                        <Tab.List className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-3">
                            {LEVELS.map((lvl, i) => (
                                <Tab
                                    key={lvl}
                                    className={({ selected }) =>
                                        [
                                            'p-2 rounded-xl border-2 font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2',
                                            selected
                                                ? 'border-blue-600 bg-blue-600 text-white shadow-md'
                                                : 'border-gray-200 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50',
                                            errors?.level ? 'border-red-500 hover:border-red-500' : '',
                                        ].join(' ')
                                    }
                                >
                                    Level {lvl}
                                </Tab>
                            ))}
                            {/* Custom Tab */}
                            <Tab
                                className={({ selected }) =>
                                    [
                                        'p-2 rounded-xl border-2 font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2',
                                        selected
                                            ? 'border-violet-600 bg-violet-600 text-white shadow-md'
                                            : 'border-gray-200 bg-white text-gray-700 hover:border-violet-400 hover:bg-violet-50',
                                    ].join(' ')
                                }
                            >
                                Custom
                            </Tab>
                        </Tab.List>

                        <Tab.Panels className="relative">
                            {/* Preset panels (empty; selection handled in onChange) */}
                            {LEVELS.map((lvl) => (
                                <Tab.Panel key={`panel-${lvl}`}>
                                    {/* no-op; the tab itself sets the value */}
                                </Tab.Panel>
                            ))}

                            {/* Custom panel */}
                            <Tab.Panel>
                                <div className="relative">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="flex-1 border-t border-gray-300"></div>
                                        <span className="text-xs text-gray-500 px-2 bg-white">Enter a custom level</span>
                                        <div className="flex-1 border-t border-gray-300"></div>
                                    </div>

                                    <input
                                        type="text"
                                        value={form.level || ''}
                                        onChange={(e) => setField('level', e.target.value)}
                                        disabled={saving}
                                        placeholder="e.g., 150, 250, Masters, PhD"
                                        className={[
                                            'w-full px-4 py-3 border-2 rounded-xl transition-all duration-200',
                                            'focus:outline-none focus:ring-2 focus:ring-violet-300 focus:ring-offset-1',
                                            errors?.level ? 'border-red-500 bg-red-50 hover:border-red-500' : 'border-gray-200 hover:border-violet-400 bg-white',
                                            saving ? 'opacity-70 cursor-not-allowed' : '',
                                        ].join(' ')}
                                        aria-invalid={!!errors?.level}
                                        aria-describedby={errors?.level ? 'level-error' : undefined}
                                    />
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                                        <Info className="w-4 h-4" />
                                    </div>
                                </div>
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>

                    {errors.level && (
                        <div id="level-error" className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {errors.level}
                        </div>
                    )}

                    <p className="mt-2 text-xs text-gray-500">
                        Select a standard level above or enter a custom level in the custom tab.
                    </p>
                </div>

                {/* Summary */}
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
};

export default RenderAcademicStep;