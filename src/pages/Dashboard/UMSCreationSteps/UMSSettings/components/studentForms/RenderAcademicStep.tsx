import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, Tab } from "@headlessui/react";
import { BookOpen, ChevronsUpDown, Check, AlertCircle, GraduationCap, Info, Search } from "lucide-react";
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

    // Filter programs based on search query
    const filteredPrograms = useMemo(() => {
        const q = programQuery.trim().toLowerCase();
        if (!q) return programs;
        return programs.filter(p => p.name.toLowerCase().includes(q));
    }, [programQuery, programs]);

    const { levelTabIndex, setLevelTabIndex, customLevelIndex } = useAcademicUX(form.level);
    useEffect(() => {
        if(programQuery != '')
        form.program = programQuery
    }, [form, programQuery])
    // Get selected program name for display
    const selectedProgramName = useMemo(() => {
        if (!form.program) return '';
        const selectedProgram = programs.find(p => p.id === form.program);
        return selectedProgram?.name || '';
    }, [form.program, programs]);

    return (
        <div className="max-w-4xl mx-auto space-y-10">

            <div className="space-y-10">
                {/* Program Selection */}
                <div className="bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-xs transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-6">

                        <div>
                            <label className="block text-sm font-semibold text-gray-800">
                                Academic Program <span className="text-red-500">*</span>
                            </label>
                            <p className="text-sm text-gray-600">Select the student's academic program</p>
                        </div>
                    </div>

                    <Combobox
                        value={form.program || ''}
                        onChange={(val: string) => {
                            setField('program', val);
                            // Clear the search query when a selection is made
                            setProgramQuery('');
                        }}
                    >
                        <div className="relative">
                            <div className="relative">
                                <ComboboxInput
                                    className={`w-full pl-12 pr-12 py-2 border-2 rounded-xl text-sm transition-all duration-200
                                        focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500
                                        ${errors.program
                                            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-100'
                                            : 'border-gray-200 bg-white hover:border-blue-300'
                                        }
                                        ${saving ? 'opacity-70 cursor-not-allowed' : ''}
                                    `}
                                    placeholder="Search and select a program..."
                                    displayValue={() => selectedProgramName}
                                    onChange={(e) => setProgramQuery(e.target.value)}
                                    disabled={saving}
                                />
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <ComboboxButton className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                    <ChevronsUpDown className="h-5 w-5" />
                                </ComboboxButton>
                            </div>

                            <Combobox.Options className="absolute z-50 mt-2 max-h-64 w-full overflow-auto rounded-xl bg-white border-2 border-gray-100 shadow-xl focus:outline-none">
                                {filteredPrograms.length === 0 ? (
                                    <div className="cursor-default select-none py-6 px-4 text-center">
                                        <Search className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                                        <p className="text-gray-500 text-sm">No programs found</p>
                                        {programQuery && (
                                            <p className="text-gray-400 text-xs mt-1">
                                                Try searching with different keywords
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="py-2">
                                        {filteredPrograms.map((program, index) => (
                                            <ComboboxOption
                                                key={program.id}
                                                value={program.id}
                                                className={({ active, selected }) =>
                                                    `relative cursor-pointer select-none py-3 pl-12 pr-4 transition-colors duration-150 ${active
                                                        ? 'bg-blue-50 text-blue-900'
                                                        : 'text-gray-900 hover:bg-gray-50'
                                                    } ${selected ? 'bg-blue-100' : ''
                                                    }`
                                                }
                                            >
                                                {({ selected, active }) => (
                                                    <>
                                                        <span className={`block truncate text-sm ${selected ? 'font-semibold' : 'font-normal'
                                                            }`}>
                                                            {program.name}
                                                        </span>
                                                        {selected && (
                                                            <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                                                                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                                                    <Check className="h-3 w-3 text-white" />
                                                                </div>
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                            </ComboboxOption>
                                        ))}
                                    </div>
                                )}
                            </Combobox.Options>
                        </div>
                    </Combobox>

                    {errors.program && (
                        <div className="mt-3 flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{errors.program}</span>
                        </div>
                    )}
                </div>

                {/* Academic Level Selection */}
                <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-xxs hover:shadow-xs transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-6">

                        <div>
                            <label className="block text-sm font-semibold text-gray-800">
                                Academic Level <span className="text-red-500">*</span>
                            </label>
                            <p className="text-sm text-gray-600">Choose from standard levels or enter a custom one</p>
                        </div>
                    </div>

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
                        <Tab.List className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mb-6">
                            {LEVELS.map((lvl, i) => (
                                <Tab
                                    key={lvl}
                                    className={({ selected }) =>
                                        [
                                            'relative py-3 px-4 rounded-xl border-2 font-semibold text-sm transition-all duration-200',
                                            'focus:outline-none focus:ring-4 focus:ring-blue-100 focus:ring-offset-1',
                                            'hover:scale-105 transform',
                                            selected
                                                ? 'border-blue-500 bg-blue-500 text-white shadow-lg scale-105'
                                                : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50 shadow-sm',
                                            errors?.level && !selected ? 'border-red-300' : '',
                                        ].join(' ')
                                    }
                                >
                                    <div className="text-center">
                                        <div className="text-xs font-bold">Level</div>
                                        <div className="text-md">{lvl}</div>
                                    </div>
                                </Tab>
                            ))}

                            {/* Custom Tab */}
                            <Tab
                                className={({ selected }) =>
                                    [
                                        'relative py-3 px-4 rounded-xl border-2 font-semibold text-sm transition-all duration-200',
                                        'focus:outline-none focus:ring-4 focus:ring-violet-100 focus:ring-offset-1',
                                        'hover:scale-105 transform',
                                        selected
                                            ? 'border-violet-500 bg-violet-500 text-white shadow-lg scale-105'
                                            : 'border-gray-200 bg-white text-gray-700 hover:border-violet-300 hover:bg-violet-50 shadow-sm',
                                    ].join(' ')
                                }
                            >
                                <div className="text-center">
                                    <Info className="w-5 h-5 mx-auto mb-1" />
                                    <div className="text-sm">Custom</div>
                                </div>
                            </Tab>
                        </Tab.List>

                        <Tab.Panels>
                            {/* Preset panels (empty; selection handled in onChange) */}
                            {LEVELS.map((lvl) => (
                                <Tab.Panel key={`panel-${lvl}`} className="focus:outline-none">
                                    <div className="text-center py-8">
                                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                                            <span className="text-lg font-bold text-blue-600">{lvl}</span>
                                        </div>
                                        <p className="text-gray-600 text-sm">
                                            You've selected <strong>Level {lvl}</strong> for this student.
                                        </p>
                                    </div>
                                </Tab.Panel>
                            ))}

                            {/* Custom panel */}
                            <Tab.Panel className="focus:outline-none">
                                <div className="space-y-4">
                                    <div className="text-center">
                                        <div className="inline-flex items-center gap-2 text-violet-600 mb-4">
                                            <div className="h-px bg-violet-200 flex-1"></div>
                                            <span className="text-sm font-medium bg-violet-50 px-4 py-2 rounded-full">
                                                Enter Custom Level
                                            </span>
                                            <div className="h-px bg-violet-200 flex-1"></div>
                                        </div>
                                    </div>

                                    <div className="relative max-w-md mx-auto">
                                        <input
                                            type="text"
                                            value={form.level || ''}
                                            onChange={(e) => setField('level', e.target.value)}
                                            disabled={saving}
                                            placeholder="e.g., 150, 250, Masters, PhD..."
                                            className={[
                                                'w-full pl-4 pr-12 py-4 border-2 rounded-xl text-sm text-center transition-all duration-200',
                                                'focus:outline-none focus:ring-4 focus:ring-violet-100 focus:border-violet-500',
                                                'placeholder:text-gray-400',
                                                errors?.level
                                                    ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-100'
                                                    : 'border-gray-200 hover:border-violet-300 bg-white',
                                                saving ? 'opacity-70 cursor-not-allowed' : '',
                                            ].join(' ')}
                                            aria-invalid={!!errors?.level}
                                            aria-describedby={errors?.level ? 'level-error' : undefined}
                                        />
                                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-violet-400 pointer-events-none">
                                            <Info className="w-5 h-5" />
                                        </div>
                                    </div>

                                    <div className="text-center text-sm text-gray-500">
                                        <p>Enter any level format that works for your institution.</p>
                                        <p className="text-xs mt-1">Examples: numerical (150, 350) or descriptive (Masters, PhD, Final Year)</p>
                                    </div>
                                </div>
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>

                    {errors.level && (
                        <div id="level-error" className="mt-4 flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{errors.level}</span>
                        </div>
                    )}
                </div>

                {/* Academic Summary */}
                {form.program && form.level && (
                    <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-2 border-emerald-200 rounded-2xl p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                           
                            <div>
                                <h4 className="text-sm font-bold text-emerald-900">Academic Summary</h4>
                                <p className="text-emerald-700 text-xs">Complete academic profile for this student</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-emerald-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center shadow-sm">
                                        <BookOpen className="w-7 h-7 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-1">Program</p>
                                        <p className="text-sm font-bold text-gray-900 leading-tight">{selectedProgramName}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-emerald-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl flex items-center justify-center shadow-sm">
                                        <GraduationCap className="w-7 h-7 text-violet-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-violet-600 uppercase tracking-wide mb-1">Level</p>
                                        <p className="text-sm font-bold text-gray-900 leading-tight">
                                            {isNaN(Number(form.level)) ? form.level : `Level ${form.level}`}
                                        </p>
                                    </div>
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