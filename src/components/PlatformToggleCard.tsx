import { Check } from "lucide-react";
import { Smartphone, User, Users, Monitor } from "lucide-react";
import { UMSForm } from "../interfaces/types";

type PlatformToggleCardProps = {
    title: string;
    description: string;
    checked: boolean;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const PlatformToggleCard = ({
    title,
    description,
    checked,
    onChange,
    icon: Icon
}: PlatformToggleCardProps) => (
    <div
        className={`flex-1 p-5 rounded-xl border-2 transition-all duration-300 ${checked
            ? 'border-blue-500 bg-white shadow-md shadow-blue-100'
            : 'border-gray-200 hover:border-blue-300 bg-white hover:shadow-sm'
            }`}
    >
        <label className="flex items-start gap-4 cursor-pointer">
            <div className={`p-2 rounded-lg ${checked ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                }`}>
                <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">{title}</h4>
                    <div className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-gray-300'
                        }`}>
                        <input
                            type="checkbox"
                            checked={checked}
                            onChange={onChange}
                            className="sr-only"
                        />
                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${checked ? 'translate-x-5' : 'translate-x-0'
                            }`} />
                    </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{description}</p>
            </div>
        </label>
    </div>
);

interface OfficeOptionCardProps {
    office: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

const OfficeOptionCard = ({
    office,
    description,
    checked,
    onChange
}: OfficeOptionCardProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.checked);
    };

    return (
        <label className={`group p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${checked
                ? 'border-blue-500 bg-blue-50 shadow-inner'
                : 'border-gray-200 hover:border-blue-300'
            }`}>
            <div className="flex items-start gap-3">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={handleChange}
                    className="hidden"
                />
                <div className={`mt-1 flex-shrink-0 h-5 w-5 rounded-md border flex items-center justify-center transition ${checked
                        ? 'bg-blue-600 border-blue-600'
                        : 'bg-white border-gray-400 group-hover:border-blue-400'
                    }`}>
                    {checked && <Check className="h-3 w-3 text-white" />}
                </div>
                <div>
                    <h4 className="font-medium text-gray-900">{office}</h4>
                    <p className="text-sm text-gray-600 mt-1">{description}</p>
                </div>
            </div>
        </label>
    );
};

// Main container component for platform and office toggles


type MainPlatformToggleProps = {
    form: UMSForm;
    togglePlatform: (platform: "teacherApp" | "studentApp") => void;
    toggleOffice: (office: string) => void;
    desktopOfficeOptions: string[];
};


const MainPlatformToggle = ({
    form,
    togglePlatform,
    toggleOffice,
    desktopOfficeOptions
}: MainPlatformToggleProps) => {
    return (
        <div className="space-y-6">
            {/* MOBILE PLATFORMS SECTION */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-start gap-3 mb-4">
                    <Smartphone className="h-6 w-6 text-blue-600" />
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Mobile Platforms</h3>
                        <p className="text-sm text-gray-700">
                            Enable mobile experiences for teachers and students
                        </p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-4">
                    <PlatformToggleCard
                        title="Teacher App"
                        description="Attendance marking, grade submission, and class management"
                        checked={form.platforms.teacherApp}
                        onChange={() => togglePlatform("teacherApp")}
                        icon={User}
                    />
                    <PlatformToggleCard
                        title="Student App"
                        description="QR scanning, results tracking, and notifications"
                        checked={form.platforms.studentApp}
                        onChange={() => togglePlatform("studentApp")}
                        icon={Users}
                    />
                </div>
            </div>

            {/* DESKTOP OFFICES SECTION */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-start gap-3 mb-4">
                    <Monitor className="h-6 w-6 text-gray-700" />
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Admin Console (Desktop App)</h3>
                        <p className="text-sm text-gray-700">
                            Configure office roles for desktop administration
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {desktopOfficeOptions?.map((office) => (
                        <OfficeOptionCard
                            key={office}
                            office={office}
                            description={
                                office === "Finance Office"
                                    ? "Financial operations, billing, and reporting"
                                    : office === "Student Affairs Office"
                                        ? "Student welfare and extracurricular management"
                                        : office === "Examination Office"
                                            ? "Exam scheduling and academic assessments"
                                            : "Undergraduate registration and records"
                            }
                            checked={form.platforms.desktopOffices ? form.platforms.desktopOffices.includes(office) : false}
                            onChange={() => toggleOffice(office)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MainPlatformToggle;