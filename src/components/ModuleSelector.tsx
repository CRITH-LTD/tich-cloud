import {
    Users, BookOpen, ScrollText, Landmark, CalendarDays, ClipboardList,
    ClipboardCheck, Mail, FileBadge, LibraryBig, GraduationCap, Home,
    Gavel, UserCog, LineChart, Check, Info, Zap, Gem, Sparkles
} from 'lucide-react';
import { MODULE_TIERS } from '../constants/constants';

type ModuleTierDetailsByTier = 'basic' | 'standard' | 'premium';

type ModuleSelectorProps = {
    selectedModules: string[];
    onToggleModule: (module: string) => void;
};

export const ModuleSelector = ({ selectedModules, onToggleModule }: ModuleSelectorProps) => {
    

    const MODULE_ICONS = {
        "Student Information": <Users className="h-5 w-5 text-blue-600" />,
        "Program & Courses": <BookOpen className="h-5 w-5 text-indigo-600" />,
        "Grading & Transcripts": <ScrollText className="h-5 w-5 text-amber-600" />,
        "Fees & Payments": <Landmark className="h-5 w-5 text-green-600" />,
        "Timetable & Calendar": <CalendarDays className="h-5 w-5 text-red-600" />,
        "Exams & Invigilation": <ClipboardList className="h-5 w-5 text-purple-600" />,
        "Attendance & Absences": <ClipboardCheck className="h-5 w-5 text-cyan-600" />,
        "Messaging & Notifications": <Mail className="h-5 w-5 text-pink-600" />,
        "Certificates & Clearance": <FileBadge className="h-5 w-5 text-teal-600" />,
        "Library Management": <LibraryBig className="h-5 w-5 text-amber-600" />,
        "Student Affairs": <GraduationCap className="h-5 w-5 text-blue-600" />,
        "Accommodation & Housing": <Home className="h-5 w-5 text-orange-600" />,
        "Discipline & Sanctions": <Gavel className="h-5 w-5 text-red-600" />,
        "Alumni & Careers": <UserCog className="h-5 w-5 text-violet-600" />,
        "Analytics & Reporting": <LineChart className="h-5 w-5 text-emerald-600" />
    };

    const MODULE_CATEGORIES = [
        {
            name: "Academic Core",
            modules: [
                "Student Information",
                "Program & Courses",
                "Grading & Transcripts",
                "Exams & Invigilation"
            ]
        },
        {
            name: "Financial Operations",
            modules: [
                "Fees & Payments",
                "Library Management",
                "Accommodation & Housing"
            ]
        },
        {
            name: "Student Life",
            modules: [
                "Attendance & Absences",
                "Student Affairs",
                "Discipline & Sanctions"
            ]
        },
        {
            name: "Administration",
            modules: [
                "Timetable & Calendar",
                "Certificates & Clearance",
                "Alumni & Careers"
            ]
        },
        {
            name: "Communication & Intelligence",
            modules: [
                "Messaging & Notifications",
                "Analytics & Reporting"
            ]
        }
    ];

    // Calculate monthly estimate (730 hours = 24/7 for 1 month)
    const calculateMonthlyCost = () => {
        return selectedModules.reduce((total: number, mod: string) => {
            const [moduleName, tier] = mod.split('_') as [keyof typeof MODULE_TIERS, keyof ModuleTierDetailsByTier];
            return total + (MODULE_TIERS[moduleName][tier as ModuleTierDetailsByTier].price * 730);
        }, 0);
    };

    return (
        <div className="space-y-8 p-4">
            {/* Pricing Header */}
            <div className="bg-white sticky top-10 p-6 rounded-lg shadow-sm border">
                <h2 className="text-2xl font-bold text-gray-900">UMS Module Configuration</h2>
                <p className="text-sm text-gray-500 mt-2">
                    Select modules with pay-as-you-go pricing. Billed per hour of usage.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                    <div className="flex items-center text-sm bg-blue-50 px-4 py-2 rounded-lg">
                        <Zap className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="font-medium">Basic Tier</span>
                        <span className="ml-2 text-gray-600">12-20 FCFA/hr</span>
                    </div>
                    <div className="flex items-center text-sm bg-purple-50 px-4 py-2 rounded-lg">
                        <Gem className="h-4 w-4 text-purple-600 mr-2" />
                        <span className="font-medium">Standard Tier</span>
                        <span className="ml-2 text-gray-600">22-45 FCFA/hr</span>
                    </div>
                    <div className="flex items-center text-sm bg-amber-50 px-4 py-2 rounded-lg">
                        <Sparkles className="h-4 w-4 text-amber-600 mr-2" />
                        <span className="font-medium">Premium Tier</span>
                        <span className="ml-2 text-gray-600">35-75 FCFA/hr</span>
                    </div>
                </div>
            </div>

            {/* Module Categories */}
            {MODULE_CATEGORIES.map((category) => (
                <div key={category.name} className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{category.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {category.modules.map((moduleName) => {
                            const module = moduleName as keyof typeof MODULE_TIERS;
                            return (
                                <div key={module} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="p-4 border-b bg-gray-50 flex items-center space-x-3">
                                        <div className="p-2 rounded-md bg-white border">
                                            {MODULE_ICONS[module as keyof typeof MODULE_ICONS]}
                                        </div>
                                        <h4 className="font-medium text-gray-900">{module}</h4>
                                    </div>

                                    <div className="p-4 space-y-4">
                                        {Object.entries(MODULE_TIERS[module]).map(([tier, details]) => (
                                            <div
                                                key={tier}
                                                onClick={() => onToggleModule(`${module}_${tier}`)}
                                                className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedModules.includes(`${module}_${tier}`)
                                                        ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-200'
                                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="flex items-center">
                                                            <span className="font-medium capitalize">{tier}</span>
                                                            {tier === 'premium' && <Sparkles className="h-4 w-4 ml-1 text-amber-500" />}
                                                        </div>
                                                        <p className="text-sm text-gray-600 mt-1">{details.price} FCFA/hour</p>
                                                    </div>
                                                    {selectedModules.includes(`${module}_${tier}`) && (
                                                        <div className="bg-blue-600 text-white p-1 rounded-full">
                                                            <Check className="h-3 w-3" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="mt-3 space-y-2">
                                                    {details.features.map((feature, i) => (
                                                        <div key={i} className="flex items-start text-sm text-gray-600">
                                                            <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                                            <span>{feature}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        }
                        )}
                    </div>
                </div>
            ))}

            {/* Uncomment below to display module items
            // ))}
          </div>
        </div>
      ))}

      {/* Cost Summary */}
            <div className="fixed bottom-7 left-30 right-40 bg-white p-4 shadow-lg border-t rounded-md border-gray-200 z-50">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">Estimated Monthly Cost</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Based on 730 hours/month (24/7 operation) - Actual may vary
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <div className="text-3xl font-bold text-blue-600">
                            {calculateMonthlyCost().toLocaleString()} FCFA
                        </div>
                        <div className="text-sm text-gray-500 text-right mt-1">
                            ≈ {(calculateMonthlyCost() / 600).toLocaleString(undefined, { maximumFractionDigits: 2 })} USD
                        </div>
                    </div>
                </div>
            </div>

            {/* Information Note */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                <div className="flex items-start">
                    <Info className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                        <h4 className="font-medium text-blue-800">Billing Information</h4>
                        <p className="text-sm text-gray-700 mt-1">
                            You're only charged when modules are actively in use. Costs are prorated by the second.
                            Usage below 1 hour is billed per minute. Volume discounts available for annual commitments.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};